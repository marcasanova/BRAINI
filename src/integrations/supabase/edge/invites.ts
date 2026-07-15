import { supabase } from '@/integrations/supabase/client';

export type InvitePreviewResponse = {
  ok?: boolean;
  email?: string;
  school_name?: string | null;
  school_id?: string | null;
  child_name?: string | null;
  expires_at?: string | null;
  existing_parent_exists?: boolean;
  existing_parent_name?: string | null;
  existing_children_names?: string[];
  error?: string;
  message?: string;
};

export type InviteCompleteResponse = {
  ok?: boolean;
  error?: string;
  message?: string;
  school_name?: string | null;
  child_name?: string | null;
};

type InvokeResult<T> = {
  data: T | null;
  error: { message: string } | null;
};

async function invokeInviteFunction<T>(
  functionName: string,
  body: Record<string, unknown>,
): Promise<InvokeResult<T>> {
  const { data, error } = await supabase.functions.invoke(functionName, { body });
  return {
    data: (data ?? null) as T | null,
    error: error ? { message: error.message } : null,
  };
}

export async function previewParentInvite(token: string) {
  return invokeInviteFunction<InvitePreviewResponse>('complete-parent-invite', {
    token,
    action: 'preview',
  });
}

export async function completeParentInvite(body: {
  token: string;
  password?: string;
  nombre?: string;
  action?: string;
}) {
  return invokeInviteFunction<InviteCompleteResponse>('complete-parent-invite', body);
}

export async function previewTeacherInvite(token: string) {
  return invokeInviteFunction<InvitePreviewResponse>('complete-teacher-invite', {
    token,
    action: 'preview',
  });
}

export async function completeTeacherInvite(body: {
  token: string;
  password: string;
  nombre: string;
}) {
  return invokeInviteFunction<InviteCompleteResponse>('complete-teacher-invite', body);
}

export async function previewDirectorInvite(token: string) {
  return invokeInviteFunction<InvitePreviewResponse>('complete-director-invite', {
    token,
    action: 'preview',
  });
}

export async function completeDirectorInvite(body: {
  token: string;
  password: string;
  nombre: string;
}) {
  return invokeInviteFunction<InviteCompleteResponse>('complete-director-invite', body);
}
