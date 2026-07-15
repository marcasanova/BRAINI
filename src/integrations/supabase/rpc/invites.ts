import { supabase } from '@/integrations/supabase/client';

export type ParentInviteRpcResult = {
  ok?: boolean;
  token?: string;
  error?: string;
  message?: string;
};

export type StaffInviteRpcResult = {
  ok?: boolean;
  token?: string;
  error?: string;
  message?: string;
};

export async function createParentInvite(
  childId: string,
  email: string,
): Promise<ParentInviteRpcResult> {
  const { data, error } = await supabase.rpc('create_parent_invite', {
    p_child_id: childId,
    p_email: email,
  });

  if (error) throw error;
  return (data ?? {}) as ParentInviteRpcResult;
}

export async function createTeacherInvite(
  schoolId: string,
  email: string,
): Promise<StaffInviteRpcResult> {
  const { data, error } = await supabase.rpc('create_teacher_invite', {
    p_school_id: schoolId,
    p_email: email,
  });

  if (error) throw error;
  return (data ?? {}) as StaffInviteRpcResult;
}

export async function createDirectorInvite(
  schoolId: string,
  email: string,
): Promise<StaffInviteRpcResult> {
  const { data, error } = await supabase.rpc('create_director_invite', {
    p_school_id: schoolId,
    p_email: email,
  });

  if (error) throw error;
  return (data ?? {}) as StaffInviteRpcResult;
}
