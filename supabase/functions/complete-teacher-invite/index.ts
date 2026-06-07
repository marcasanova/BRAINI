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
      .rpc("get_teacher_invite_by_token", { p_token: token })
      .single();

    if (inviteError) {
      console.error("get_teacher_invite_by_token error:", inviteError.message);
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

    if (action === "preview") {
      return new Response(
        JSON.stringify({
          ok: true,
          email: inviteEmail,
          school_id: invite.school_id,
          school_name: schoolName,
          expires_at: invite.expires_at,
          status: invite.status,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return new Response(JSON.stringify({ error: "password is required (min 6 chars)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const nombreFinal = typeof nombre === "string" ? nombre.trim() : "";
    if (!nombreFinal) {
      return new Response(JSON.stringify({ error: "nombre is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: userResult, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: inviteEmail,
      password,
      email_confirm: true,
    });

    if (userError || !userResult?.user) {
      console.error("createUser error:", userError?.message);
      if (userError && isDuplicateUserError(userError)) {
        return new Response(
          JSON.stringify({
            error: "email_already_registered",
            message: "Este correo ya tiene cuenta. Contacta con soporte para completar la invitación.",
          }),
          {
            status: 409,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      return new Response(JSON.stringify({ error: "cannot_create_user" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userResult.user.id;

    const { data: completeData, error: completeError } = await supabaseAdmin.rpc(
      "complete_teacher_invite",
      {
        p_invite_id: invite.invite_id,
        p_user_id: userId,
        p_email: inviteEmail,
        p_nombre: nombreFinal,
      },
    );

    if (completeError) {
      console.error("complete_teacher_invite error:", completeError.message);
      const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (delErr) {
        console.error("rollback deleteUser error:", delErr.message);
      }
      return new Response(JSON.stringify({ error: "cannot_complete_invite" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // El RPC puede devolver { ok:false, error } sin lanzar excepción
    if (!completeData || (completeData as { ok?: boolean }).ok !== true) {
      const code = (completeData as { error?: string })?.error ??
        "cannot_complete_invite";
      console.error("complete_teacher_invite returned ok=false:", code);
      const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (delErr) {
        console.error("rollback deleteUser error:", delErr.message);
      }
      const status = code === "role_conflict"
        ? 409
        : code === "email_mismatch"
        ? 403
        : 400;
      return new Response(JSON.stringify({ error: code }), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        teacher_id: completeData?.teacher_id ?? userId,
        school_id: completeData?.school_id ?? invite.school_id ?? null,
        school_name: schoolName,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("complete-teacher-invite error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
