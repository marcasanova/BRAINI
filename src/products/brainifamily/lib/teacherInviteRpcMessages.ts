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
    case 'email_role_conflict':
      return 'Ese correo ya pertenece a un profesor o director y no puede usarse como cuenta de familia. Indica un correo distinto.';
    default:
      return `No se pudo crear la invitación (${err}).`;
  }
}

/**
 * Mensajes para RPC create_teacher_invite / create_director_invite (respuesta jsonb).
 * Cubre los códigos de error que devuelven esos RPC en el backend.
 */
export function staffInviteRpcMessage(
  data: unknown,
  flow: 'teacher' | 'director' = 'teacher',
): string {
  const subject = flow === 'director' ? 'director' : 'profesor';
  if (!data || typeof data !== 'object') {
    return 'No se pudo generar la invitación.';
  }
  const o = data as Record<string, unknown>;
  const err = o.error;
  if (typeof err !== 'string') {
    return 'No se pudo generar la invitación.';
  }
  switch (err) {
    case 'forbidden':
      return 'No tienes permiso para realizar esta acción.';
    case 'forbidden_not_director':
      return 'Tu sesión no tiene permiso de director. Vuelve a iniciar sesión.';
    case 'forbidden_school_mismatch':
      return 'Solo puedes invitar a profesores de tu propio centro.';
    case 'missing_school_id':
      return 'Falta el centro educativo. Recarga la página e inténtalo de nuevo.';
    case 'school_not_found':
      return 'No se encontró el centro educativo indicado.';
    case 'invalid_email':
      return `El correo del ${subject} no es válido.`;
    case 'email_already_registered':
      return `Ese correo ya tiene una cuenta en Braini con otro rol y no puede reutilizarse para invitar a un ${subject}. Usa un correo distinto.`;
    case 'invite_already_exists':
      return 'Ya existe una invitación pendiente para ese correo en este centro.';
    case 'role_conflict':
      return 'Ese correo ya pertenece a un usuario con otro rol en Braini. Usa un correo distinto.';
    default:
      return `No se pudo crear la invitación (${err}).`;
  }
}
