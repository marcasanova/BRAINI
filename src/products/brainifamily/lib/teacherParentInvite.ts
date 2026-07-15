import { createParentInvite } from '@/integrations/supabase/rpc/invites';
import { parentInviteRpcMessage } from '@/products/brainifamily/lib/teacherInviteRpcMessages';

export type ParentInviteLinkResult =
  | { ok: true; url: string }
  | { ok: false; message: string };

/** RPC `create_parent_invite` → URL pública de invitación padre. */
export async function createParentInviteLink(
  childId: string,
  emailNormalized: string,
): Promise<ParentInviteLinkResult> {
  let payload: { ok?: boolean; token?: string };
  try {
    payload = await createParentInvite(childId, emailNormalized);
  } catch (rpcErr: unknown) {
    return {
      ok: false,
      message: rpcErr instanceof Error ? rpcErr.message : 'Error al crear invitación',
    };
  }
  if (payload?.ok === true && typeof payload.token === 'string') {
    const url = `${window.location.origin}/brainifamily/invite/parent?token=${encodeURIComponent(payload.token)}`;
    return { ok: true, url };
  }

  return { ok: false, message: parentInviteRpcMessage(payload) };
}
