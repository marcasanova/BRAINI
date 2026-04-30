import { supabase } from '@/lib/supabaseClient';
import type { NavigateFunction } from 'react-router-dom';

type ToastLike = (opts: {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}) => void;

/**
 * Tras login como padre (rol o fila en `parents`): onboarding → home.
 */
export async function navigateParentAfterLogin(
  navigate: NavigateFunction,
  userId: string,
  toast: ToastLike,
): Promise<void> {
  const { data: parentData, error: parentError } = await supabase
    .from('parents')
    .select('profile_completed, children_count')
    .eq('id', userId)
    .single();

  if (parentError?.code === 'PGRST116') {
    toast({
      title: '🌱 Nos queda un paso',
      description: 'Completa tu perfil para continuar.',
    });
    navigate('/brainifamily/parents-profile');
    return;
  }

  if (parentError || !parentData) {
    toast({
      title: '❌ Error al cargar tu perfil',
      description: 'No se pudo cargar la información. Inténtalo de nuevo.',
      variant: 'destructive',
    });
    return;
  }

  if (parentData.profile_completed === false) {
    navigate('/brainifamily/parents-profile');
    return;
  }

  const parentChildrenCount =
    parentData.children_count != null
      ? Math.min(5, Math.max(1, Number(parentData.children_count)))
      : 1;

  const { data: childRows, error: childError } = await supabase
    .from('children')
    .select('profile_completed')
    .eq('parent_id', userId)
    .order('created_at', { ascending: true });

  if (childError) {
    toast({
      title: '❌ Error al cargar el perfil del menor',
      description: 'No se pudo cargar la información. Inténtalo de nuevo.',
      variant: 'destructive',
    });
    return;
  }

  const children = childRows ?? [];
  const hasEnoughChildren = children.length >= parentChildrenCount;
  const allCompleted =
    children.length > 0 &&
    children.every((c: { profile_completed: boolean }) => c.profile_completed);

  if (!hasEnoughChildren || !allCompleted) {
    navigate('/brainifamily/child-profile');
    return;
  }

  navigate('/brainifamily/home');
}
