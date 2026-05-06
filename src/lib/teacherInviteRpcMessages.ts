/** Mensajes para RPC create_parent_invite (respuesta jsonb). */
export function parentInviteRpcMessage(data: unknown): string {
  if (!data || typeof data !== 'object') {
    return 'No se pudo generar la invitación.';
  }
  const o = data as Record<string, unknown>;
  const err = o.error;
  if (typeof err !== 'string') {
    return 'No se pudo generar la invitación.';
  }
  switch (err) {
    case 'forbidden_not_teacher':
      return 'Tu sesión no tiene permiso de docente. Vuelve a iniciar sesión.';
    case 'child_not_found_or_not_your_class':
      return 'No se encontró el alumno o no pertenece a tu clase. Recarga e inténtalo de nuevo.';
    case 'invalid_email':
      return 'El correo del padre o tutor no es válido.';
    default:
      return `No se pudo crear la invitación (${err}).`;
  }
}
