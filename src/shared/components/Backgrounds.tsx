import React from 'react';
import Navbar from './navigation/Navbar';

/** Color de sección de la app de familias (son los 4 colores de los tipos de actividad). */
export type SectionTone = 'blue' | 'turquoise' | 'yellow' | 'coral';

const TONE_CLASSES: Record<SectionTone, { canvas: string; band: string }> = {
  blue: { canvas: 'bg-braini-blue-tint', band: 'bg-braini-blue' },
  turquoise: { canvas: 'bg-braini-turquoise-tint', band: 'bg-braini-turquoise' },
  yellow: { canvas: 'bg-braini-yellow-tint', band: 'bg-braini-yellow' },
  coral: { canvas: 'bg-braini-pink-tint', band: 'bg-braini-pink' },
};

interface BackgroundsProps {
  className?: string;
  children?: React.ReactNode;
  /** Layout de la app de familias: navegación + fondo de sección + cabecera */
  wrapWithCard?: boolean;
  tone?: SectionTone;
  /** Cabecera en banda con el color de la sección (texto en tinta, contraste ≥ 5:1) */
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Acciones a la derecha del título (p. ej. el selector de hijo) */
  actions?: React.ReactNode;
  /** Contenido de la banda por encima del título (p. ej. navegación entre misiones) */
  header?: React.ReactNode;
}

const Backgrounds: React.FC<BackgroundsProps> = ({
  className = '',
  children,
  wrapWithCard = false,
  tone = 'blue',
  title,
  subtitle,
  actions,
  header,
}) => {
  if (wrapWithCard) {
    const toneClasses = TONE_CLASSES[tone];
    const hasBand = title != null || header != null;

    return (
      <div className={`min-h-screen font-montserrat text-ink ${toneClasses.canvas} ${className}`}>
        <Navbar />

        <div className="min-h-screen md:pl-72">
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 md:pt-8 pb-24 md:pb-10">
            {hasBand && (
              <header className={`rounded-3xl px-5 py-5 sm:px-8 sm:py-7 mb-6 md:mb-8 ${toneClasses.band}`}>
                {header && <div className="mb-4">{header}</div>}
                {title != null && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="min-w-0">
                      <h1 className="font-display text-3xl sm:text-4xl font-semibold leading-tight text-ink">{title}</h1>
                      {subtitle && <div className="mt-2 text-base sm:text-lg text-ink">{subtitle}</div>}
                    </div>
                    {actions && <div className="shrink-0">{actions}</div>}
                  </div>
                )}
              </header>
            )}
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #7ea4df 0%, #35bdb1 100%)' }}
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 sm:-top-40 -left-5 sm:-left-10 w-40 h-40 sm:w-80 sm:h-80 bg-white/15 rounded-full" />
        <div className="absolute -bottom-40 sm:-bottom-80 -right-30 sm:-right-60 w-[300px] h-[300px] sm:w-[700px] sm:h-[700px] bg-white/15 rounded-full" />
      </div>
    </div>
  );
};

export default Backgrounds;
