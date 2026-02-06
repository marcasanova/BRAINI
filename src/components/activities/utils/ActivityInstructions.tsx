import React from 'react';
import { Info, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatearTexto } from '@/components/activities/utils/TextFormatter';
import {
  getInstructionsContainerClasses,
  getDurationTextClasses,
  getMainTitleTextClasses,
  getBorderClasses,
  getSecondaryButtonClasses,
} from '@/components/activities/utils/ActivityColors';

interface ActivityInstructionsProps {
  activityType?: string;
  duracionMin?: number;
  duracionMax?: number;
  comoSeJuega?: string;
  investigacionBeneficios?: string;
  onShowScientificBase?: () => void;
}

/**
 * Componente reutilizable para mostrar las instrucciones de una actividad
 * Incluye: título, duración, cómo se juega, y botón de base científica
 */
const ActivityInstructions: React.FC<ActivityInstructionsProps> = ({
  activityType,
  duracionMin,
  duracionMax,
  comoSeJuega,
  investigacionBeneficios,
  onShowScientificBase,
}) => {
  // Si no hay datos, no renderizar nada
  if (!duracionMin && !duracionMax && !comoSeJuega && !investigacionBeneficios) {
    return null;
  }

  return (
    <div className={getInstructionsContainerClasses(activityType)}>
      {/* Título de la sección */}
      <div className="mb-4 pb-3 border-b-2 border-gray-200">
        <h3 className={`text-2xl font-bold ${getMainTitleTextClasses(activityType)} flex items-center gap-2`}>
          <Info className="w-6 h-6" />
          Información de la actividad
        </h3>
      </div>

      {/* Duración */}
      {duracionMin && duracionMax && (
        <p className="text-gray-700 leading-relaxed mb-3 text-base">
          <strong className={getDurationTextClasses(activityType)}>Duración:</strong> {duracionMin} - {duracionMax} minutos
        </p>
      )}

      {/* Contenido de la actividad: puede incluir "¿Para qué?" y "¿Cómo se juega?" con ### en el texto */}
      {comoSeJuega && (
        <div className="text-gray-700 leading-relaxed mb-4">
          <div className="text-sm">{formatearTexto(comoSeJuega)}</div>
        </div>
      )}

      {/* Botón para ver base científica */}
      {investigacionBeneficios && onShowScientificBase && (
        <div className={`mt-4 pt-4 border-t ${getBorderClasses(activityType)}`}>
          <Button
            onClick={onShowScientificBase}
            variant="outline"
            className={`w-full sm:w-auto ${getSecondaryButtonClasses(activityType)}`}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Ver Base Científica
          </Button>
        </div>
      )}
    </div>
  );
};

export default ActivityInstructions;

