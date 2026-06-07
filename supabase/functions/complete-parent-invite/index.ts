import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function isDuplicateUserError(err: { message?: string; status?: number }): boolean {
  const m = (err.message ?? "").toLowerCase();
  return (
    err.status === 422 ||
    (m.includes("already") && (m.includes("registered") || m.includes("exists")))
  );
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { token, password, nombre, action } = await req.json();

    if (!token || typeof token !== "string") {
      return new Response(JSON.stringify({ error: "token is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Missing SUPABASE_URL or SERVICE_ROLE_KEY" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { data: invite, error: inviteError } = await supabaseAdmin
      .rpc("get_parent_invite_by_token", { p_token: token })
      .single();

    if (inviteError) {
      console.error("get_parent_invite_by_token error:", inviteError.message);
      return new Response(JSON.stringify({ error: "invalid_invite" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!invite || !invite.is_valid) {
      return new Response(
        JSON.stringify({ error: "invite_not_valid_or_expired" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const inviteEmail: string = String(invite.email ?? "").trim().toLowerCase();
    if (!inviteEmail) {
      return new Response(JSON.stringify({ error: "invalid_invite_email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: schoolRow } = await supabaseAdmin
      .from("schools")
      .select("name")
      .eq("id", invite.school_id)
      .maybeSingle();
    const schoolName = (schoolRow as { name?: string } | null)?.name ?? null;

    const childId = (invite as { child_id?: string }).child_id ?? null;
    // get_parent_invite_by_token expone ch.nombre como child_nombre (ver RPC en BD)
    const childName =
      (invite as { child_nombre?: string }).child_nombre ??
      (invite as { child_name?: string }).child_name ??
      null;

    // Si el email ya existe como parent, devolvemos contexto para UX de "añadir otro hijo".
    let existingParentName: string | null = null;
    let existingChildrenNames: string[] = [];
    const { data: existingParent } = await supabaseAdmin
      .from("parents")
      .select("id, nombre")
      .eq("email", inviteEmail)
      .maybeSingle();

    if (existingParent?.id) {
      existingParentName =
        ((existingParent as { nombre?: string | null }).nombre ?? null) as
          | string
          | null;
      const { data: existingChildren } = await supabaseAdmin
        .from("children")
        .select("nombre, apellidos")
        .eq("parent_id", existingParent.id)
        .eq("active", true)
        .order("created_at", { ascending: true });

      existingChildrenNames = (existingChildren ?? [])
        .map((c) => {
          const n = String((c as { nombre?: string }).nombre ?? "").trim();
          const a = String((c as { apellidos?: string | null }).apellidos ?? "").trim();
          return [n, a].filter(Boolean).join(" ").trim();
        })
        .filter((v) => v.length > 0);
    }

    if (action === "preview") {
      return new Response(
        JSON.stringify({
          ok: true,
          email: inviteEmail,
          school_id: invite.school_id,
          school_name: schoolName,
          expires_at: invite.expires_at,
          status: invite.status,
          child_id: childId,
          child_name: childName,
          existing_parent_exists: Boolean(existingParent?.id),
          existing_parent_name: existingParentName,
          existing_children_names: existingChildrenNames,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const nombreTrimmed =
      nombre === null || nombre === undefined
        ? ""
        : typeof nombre === "string"
          ? nombre.trim()
          : "";
    // complete_parent_invite exige p_nombre no vacío; la UI lo deja opcional
    const nombreForRpc =
      nombreTrimmed ||
      (inviteEmail.includes("@") ? inviteEmail.split("@")[0]! : "Usuario");

    const inviteId = (invite as { invite_id?: string; id?: string }).invite_id ??
      (invite as { id?: string }).id;

    if (!inviteId) {
      return new Response(JSON.stringify({ error: "invalid_invite" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const completeRpc = async (userId: string) => {
      return await supabaseAdmin.rpc("complete_parent_invite", {
        p_invite_id: inviteId,
        p_user_id: userId,
        p_email: inviteEmail,
        p_nombre: nombreForRpc,
      });
    };

    type ParentCompleteResult = {
      ok?: boolean;
      error?: string;
      parent_id?: string;
      child_id?: string;
      school_id?: string;
    };

    function parentCompleteFailed(
      data: unknown,
    ): { failed: true; code: string } | { failed: false } {
      if (!data || typeof data !== "object") {
        return { failed: true, code: "cannot_complete_invite" };
      }
      const o = data as ParentCompleteResult;
      if (o.ok === false) {
        return { failed: true, code: o.error ?? "cannot_complete_invite" };
      }
      if (o.ok !== true) {
        return { failed: true, code: "cannot_complete_invite" };
      }
      return { failed: false };
    }

    // Mapea los códigos de error de complete_parent_invite a respuesta HTTP + mensaje
    function mapCompleteError(
      code: string,
    ): { status: number; body: Record<string, unknown> } {
      switch (code) {
        case "email_mismatch":
          return {
            status: 403,
            body: {
              error: "invite_email_mismatch",
              message:
                "Esta invitación es para otro correo. Usa el correo indicado en el enlace.",
            },
          };
        case "role_conflict":
          return {
            status: 409,
            body: {
              error: "role_conflict",
              message:
                "Este correo ya pertenece a un usuario con otro rol (profesor o director) y no puede usarse como familiar.",
            },
          };
        case "child_already_linked_other_parent":
          return {
            status: 409,
            body: {
              error: "child_already_linked_other_parent",
              message: "Este alumno ya está vinculado a otra cuenta.",
            },
          };
        case "invalid_or_expired_invite":
          return {
            status: 400,
            body: {
              error: "invite_not_valid_or_expired",
              message: "La invitación no es válida o ha caducado.",
            },
          };
        default:
          return { status: 400, body: { error: code } };
      }
    }

    function isLikelyEndUserAccessJwt(token: string): boolean {
      if (!token) return false;
      // Evitar usar claves de proyecto como si fueran JWT de usuario.
      if (token === anonKey || token === serviceRoleKey) return false;
      const parts = token.split(".");
      if (parts.length !== 3) return false;
      try {
        const payloadRaw = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
        const payload = JSON.parse(payloadRaw) as {
          sub?: string;
          role?: string;
        };
        // Access token de usuario: sub presente y rol authenticated.
        return Boolean(payload.sub) && payload.role === "authenticated";
      } catch {
        return false;
      }
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";

    if (jwt && isLikelyEndUserAccessJwt(jwt)) {
      const { data: userData, error: jwtErr } = await supabaseAdmin.auth.getUser(jwt);
      if (!jwtErr && userData.user) {
        const sessionEmail = (userData.user.email ?? "").trim().toLowerCase();
        if (sessionEmail !== inviteEmail) {
          return new Response(
            JSON.stringify({
              error: "invite_email_mismatch",
              message:
                "Esta invitación es para otro correo. Cierra sesión o usa el correo indicado en el enlace.",
            }),
            {
              status: 403,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        const userId = userData.user.id;
        const { data: completeData, error: completeError } = await completeRpc(userId);

        if (completeError) {
          console.error("complete_parent_invite error:", completeError.message);
          return new Response(JSON.stringify({ error: "cannot_complete_invite" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const fail = parentCompleteFailed(completeData);
        if (fail.failed) {
          console.error("complete_parent_invite returned ok=false:", fail.code);
          const mapped = mapCompleteError(fail.code);
          return new Response(JSON.stringify(mapped.body), {
            status: mapped.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const c = completeData as ParentCompleteResult;
        return new Response(
          JSON.stringify({
            ok: true,
            used_existing_session: true,
            parent_id: c.parent_id ?? userId,
            child_id: c.child_id ?? childId,
            school_id: c.school_id ?? invite.school_id ?? null,
            school_name: schoolName,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return new Response(
        JSON.stringify({
          error: "password_required",
          message:
            "Introduce la contraseña (al menos 6 caracteres) o inicia sesión con el mismo correo que la invitación.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!anonKey) {
      return new Response(JSON.stringify({ error: "Missing SUPABASE_ANON_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAnon = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false },
    });

    let userId: string;
    let createdNewUser = false;

    const { data: userResult, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: inviteEmail,
      password,
      email_confirm: true,
    });

    if (userError || !userResult?.user) {
      if (userError && isDuplicateUserError(userError)) {
        const { data: signData, error: signErr } = await supabaseAnon.auth.signInWithPassword({
          email: inviteEmail,
          password,
        });

        if (signErr || !signData.user) {
          console.error("signInWithPassword error:", signErr?.message);
          return new Response(
            JSON.stringify({
              error: "invalid_credentials",
              message:
                "Este correo ya tiene cuenta. Comprueba la contraseña o recupera el acceso.",
            }),
            {
              status: 401,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        userId = signData.user.id;
      } else {
        console.error("createUser error:", userError?.message);
        return new Response(JSON.stringify({ error: "cannot_create_user" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      userId = userResult.user.id;
      createdNewUser = true;
    }

    const { data: completeData, error: completeError } = await completeRpc(userId);

    if (completeError) {
      console.error("complete_parent_invite error:", completeError.message);
      if (createdNewUser) {
        const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (delErr) {
          console.error("rollback deleteUser error:", delErr.message);
        }
      }
      return new Response(JSON.stringify({ error: "cannot_complete_invite" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const failAfterAuth = parentCompleteFailed(completeData);
    if (failAfterAuth.failed) {
      console.error("complete_parent_invite returned ok=false:", failAfterAuth.code);
      if (createdNewUser) {
        const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (delErr) {
          console.error("rollback deleteUser error:", delErr.message);
        }
      }
      const mapped = mapCompleteError(failAfterAuth.code);
      return new Response(JSON.stringify(mapped.body), {
        status: mapped.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const c2 = completeData as ParentCompleteResult;
    return new Response(
      JSON.stringify({
        ok: true,
        used_existing_session: false,
        parent_id: c2.parent_id ?? userId,
        child_id: c2.child_id ?? childId,
        school_id: c2.school_id ?? invite.school_id ?? null,
        school_name: schoolName,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("complete-parent-invite error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
