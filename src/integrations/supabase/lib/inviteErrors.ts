/**
 * Mensajes humanos para respuestas de Edge Functions de invitaciones (Supabase).
 * Prioriza `message` del body si existe; si no, mapea `error` (código).
 */

export type InviteFlow = 'parent' | 'teacher' | 'director';

function codeFromBody(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined;
  const e = (data as Record<string, unknown>).error;
  return typeof e === 'string' ? e : undefined;
}

/** Texto largo para la descripción del toast o alertas inline. */
export function inviteErrorDescription(data: unknown, flow: InviteFlow = 'parent'): string {
  if (!data || typeof data !== 'object') {
    return 'Ha ocurrido un problema al procesar la solicitud. Inténtalo de nuevo en unos minutos.';
  }
  const o = data as Record<string, unknown>;
  if (typeof o.message === 'string' && o.message.trim()) {
    return o.message.trim();
  }
  const code = o.error;
  if (typeof code !== 'string') {
    return 'Respuesta inesperada del servidor. Si persiste, contacta con el centro.';
  }

  const teacherDirectorRegistered =
    flow === 'teacher'
      ? 'Este correo ya tiene cuenta en Braini. Inicia sesión o pide al centro un correo distinto o que revisen el alta.'
      : flow === 'director'
        ? 'Este correo ya tiene cuenta en Braini. Inicia sesión o contacta con el administrador para completar el alta.'
        : 'Este correo ya está registrado. Inicia sesión con ese correo y vuelve a abrir el enlace de invitación.';

  switch (code) {
    case 'invalid_invite':
      return 'El enlace no es válido o está incompleto. Usa exactamente el enlace que recibiste por correo o pide uno nuevo al centro.';
    case 'invite_not_valid_or_expired':
      return 'Esta invitación ya no está activa (caducada, ya usada o anulada). Pide al centro que genere una nueva invitación.';
    case 'invalid_invite_email':
      return 'Los datos de la invitación no incluyen un correo válido. Contacta con el centro.';
    case 'password_required':
      return 'Para continuar necesitas una contraseña de al menos 6 caracteres (cuenta nueva o iniciar sesión con tu cuenta existente). Si ya tienes sesión abierta con el mismo correo que la invitación, puedes enviar el formulario sin contraseña.';
    case 'invite_email_mismatch':
    case 'email_mismatch':
      return 'Esta invitación está dirigida a otro correo. Cierra sesión en Braini o usa el mismo correo que figura en la invitación.';
    case 'invalid_credentials':
      return 'La contraseña introducida no coincide con la cuenta de ese correo. Revisa mayúsculas/minúsculas y vuelve a intentarlo, o usa «¿Has olvidado tu contraseña?» para recuperarla.';
    case 'email_already_registered':
      return teacherDirectorRegistered;
    case 'role_conflict':
      return 'Este correo ya pertenece a un usuario con otro rol en Braini (familia, profesor o director) y no puede reutilizarse para esta invitación. Usa un correo distinto o contacta con el centro.';
    case 'email_role_conflict':
      return 'Este correo ya está asociado a un profesor o director y no puede usarse como cuenta de familia. Indica un correo distinto para el padre o tutor.';
    case 'cannot_create_user':
      return 'No se ha podido crear la cuenta. El correo podría estar en uso o haber un problema temporal. Prueba más tarde o contacta con el centro.';
    case 'cannot_complete_invite':
      return 'No se pudo completar el vínculo con el centro. Puede haber conflicto con el alumno o con el estado de la invitación. Contacta con el centro para revisión.';
    case 'child_already_linked_other_parent':
      return 'Este alumno ya está asociado a otra cuenta de familia. Si es un error, contacta con el centro.';
    case 'invalid_or_expired_invite':
      return 'La invitación no se puede completar: caducada o no válida en este momento.';
    case 'missing_params':
      return 'Faltan datos necesarios. Recarga la página y vuelve a intentarlo.';
    case 'token is required':
      return 'El enlace está incompleto (falta información). Abre la invitación desde el correo o copia el enlace completo.';
    default:
      return `No se ha podido completar la acción (${code}). Si persiste, contacta con el centro.`;
  }
}

/** Título corto para toasts de error (más claro que genérico). */
export function inviteErrorTitle(data: unknown): string {
  const code = codeFromBody(data);
  switch (code) {
    case 'invite_not_valid_or_expired':
    case 'invalid_or_expired_invite':
      return 'Invitación no disponible';
    case 'invalid_invite':
    case 'token is required':
      return 'Enlace no válido';
    case 'password_required':
      return 'Contraseña necesaria';
    case 'invite_email_mismatch':
    case 'email_mismatch':
      return 'Correo distinto al de la invitación';
    case 'invalid_credentials':
      return 'Contraseña incorrecta';
    case 'email_already_registered':
      return 'Correo ya registrado';
    case 'role_conflict':
    case 'email_role_conflict':
      return 'Correo en uso con otro rol';
    case 'cannot_create_user':
      return 'No se pudo crear la cuenta';
    case 'cannot_complete_invite':
      return 'No se pudo completar el vínculo';
    case 'child_already_linked_other_parent':
      return 'Alumno ya vinculado';
    case 'invalid_invite_email':
      return 'Datos de invitación incorrectos';
    default:
      return 'Algo ha salido mal';
  }
}
