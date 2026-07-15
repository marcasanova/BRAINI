import { supabase } from '@/integrations/supabase/client';
import { parentInviteRpcMessage } from '@/products/brainifamily/lib/teacherInviteRpcMessages';

export type ParentInviteLinkResult =
  | { ok: true; url: string }
  | { ok: false; message: string };

/** RPC `create_parent_invite` → URL pública de invitación padre. */
export async function createParentInviteLink(
  childId: string,
  emailNormalized: string,
): Promise<ParentInviteLinkResult> {
  const { data: rpcData, error: rpcErr } = await supabase.rpc('create_parent_invite', {
    p_child_id: childId,
    p_email: emailNormalized,
  });

  if (rpcErr) {
    return { ok: false, message: rpcErr.message };
  }

  const payload = rpcData as { ok?: boolean; token?: string };
  if (payload?.ok === true && typeof payload.token === 'string') {
    const url = `${window.location.origin}/brainifamily/invite/parent?token=${encodeURIComponent(payload.token)}`;
    return { ok: true, url };
  }

  return { ok: false, message: parentInviteRpcMessage(rpcData) };
}
