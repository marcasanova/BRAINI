import React from 'react';
import { Link } from 'react-router';
import { Construction, Lock } from 'lucide-react';
import Medal from '@/products/brainifamily/features/medals/Medal';
import { formatearDescripcionMision } from '@/products/brainifamily/features/activities/utils/TextFormatter';
import { cn } from '@/shared/lib/utils';
import {
  MAP_SQUARE_STATUS_LABEL,
  isPlayable,
  type MapSquare,
  type MapSquareStatus,
} from './missionMapLayout';
import { MAP_TILES } from './missionMapBoard';

interface MissionDetailPanelProps {
  square: MapSquare;
  childNivelEducativo?: string | null;
  /** Resaltar el panel durante la celebración de misión desbloqueada */
  highlighted?: boolean;
}

const STATUS_BADGE_CLASS: Record<MapSquareStatus, string> = {
  completed: 'bg-braini-turquoise/20 text-braini-turquoise-dark',
  current: 'bg-braini-blue/20 text-braini-blue-dark',
  locked: 'bg-gray-300 text-gray-600',
  in_development: 'bg-braini-yellow/30 text-gray-800',
};

const MissionDetailPanel = React.forwardRef<HTMLDivElement, MissionDetailPanelProps>(
  ({ square, childNivelEducativo, highlighted = false }, ref) => {
    const playable = isPlayable(square);

    return (
      <div
        ref={ref}
        aria-live="polite"
        className={cn(
          'rounded-xl md:rounded-2xl border bg-white p-4 md:p-5 shadow-md transition-shadow duration-500',
          highlighted ? 'border-braini-blue shadow-[0_0_0_3px_rgba(126,164,223,0.6)]' : 'border-gray-200',
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span
              className={cn(
                'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded mb-2',
                STATUS_BADGE_CLASS[square.status],
              )}
            >
              {square.status === 'locked' && <Lock className="w-3 h-3" aria-hidden="true" />}
              {square.status === 'in_development' && <Construction className="w-3 h-3" aria-hidden="true" />}
              {highlighted && square.status === 'current' ? '¡Nueva misión desbloqueada!' : MAP_SQUARE_STATUS_LABEL[square.status]}
            </span>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Misión {square.mission} de {MAP_TILES.length}
            </p>
            <h3 className="text-braini-blue font-bold text-xl md:text-2xl leading-tight" style={{ fontWeight: 700 }}>
              {square.titulo ?? 'Próximamente'}
            </h3>
          </div>
          {square.medalDate != null && (
            <Medal
              missionNumber={square.mission}
              isEarned
              earnedAt={square.medalDate}
              childNivelEducativo={childNivelEducativo}
            />
          )}
        </div>

        {square.status === 'in_development' ? (
          <p className="mt-3 text-sm md:text-base text-gray-600 font-medium">
            Estamos preparando esta misión con mucho cariño. ¡Muy pronto podréis vivirla en familia!
          </p>
        ) : (
          square.descripcion && (
            <div className="mt-3 text-sm md:text-base text-gray-600 font-medium">
              {formatearDescripcionMision(square.descripcion)}
            </div>
          )
        )}

        {square.status === 'locked' && (
          <p className="mt-3 text-sm text-gray-500">Completa la misión anterior para desbloquearla.</p>
        )}

        <div className="mt-4 flex justify-end">
          {playable ? (
            <Link
              to={`/brainifamily/sesion/${square.mission}`}
              className="w-full sm:w-auto text-center px-6 py-3 bg-braini-blue text-white font-semibold rounded-lg shadow-sm hover:bg-braini-blue-dark transition"
            >
              {square.status === 'completed' ? 'Volver a jugar' : 'Acceder'}
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="w-full sm:w-auto px-6 py-3 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed"
            >
              {square.status === 'in_development' ? '¡Muy pronto!' : 'Aventura bloqueada'}
            </button>
          )}
        </div>
      </div>
    );
  },
);
MissionDetailPanel.displayName = 'MissionDetailPanel';

export default MissionDetailPanel;
