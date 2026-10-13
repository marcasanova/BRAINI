import type { ReactNode } from 'react';
import { POLITICA_PRIVACIDAD_URL } from '@/shared/lib/constants/documentosStorage';

type PrivacyPolicyLinkProps = {
  className?: string;
  children?: ReactNode;
};

/** Enlace externo al PDF de política de privacidad (Supabase Storage). */
export function PrivacyPolicyLink({
  className,
  children = 'Política de privacidad',
}: PrivacyPolicyLinkProps) {
  return (
    <a
      href={POLITICA_PRIVACIDAD_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}

type PrivacyPolicyConsentProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  className?: string;
};

/** Checkbox obligatorio de aceptación de la política (flujos de alta). */
export function PrivacyPolicyConsent({
  checked,
  onCheckedChange,
  id = 'privacy-consent',
  className,
}: PrivacyPolicyConsentProps) {
  return (
    <div className={className ?? 'flex items-start gap-2 text-sm'}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300"
        required
      />
      <label htmlFor={id} className="text-muted-foreground leading-snug">
        He leído y acepto la{' '}
        <PrivacyPolicyLink className="text-braini-blue underline font-medium hover:opacity-90" />
        {' '}y autorizo el tratamiento de datos personales conforme a dicho documento.
      </label>
    </div>
  );
}
