import React from 'react';
import { getMedalImageForNivelEducativo } from '@/shared/lib/constants/emotionsStorage';

interface MedalShelfProps {
  userMedals: Array<{ id: number; medal_id: number; fecha_obtencion: string }>;
  totalMedals: number;
  isLoading: boolean;
  childNivelEducativo?: string | null;
}

const MedalShelf: React.FC<MedalShelfProps> = ({ userMedals, totalMedals, isLoading, childNivelEducativo }) => {
  const earnedMedals = userMedals.length;
  const progressPercentage = totalMedals > 0 ? (earnedMedals / totalMedals) * 100 : 0;
  const medalImage = getMedalImageForNivelEducativo(childNivelEducativo);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2">
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-gray-500">Cargando misiones...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        {/* Sección izquierda - Icono y número */}
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-lg flex items-center justify-center shadow-xs overflow-hidden border border-gray-200">
            <img 
              src={medalImage} 
              alt="Medalla Braini" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-700">
              {earnedMedals} / {totalMedals} misiones
            </div>
          </div>
        </div>

        {/* Sección derecha - Porcentaje */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-xs text-gray-500 font-medium uppercase">
              Misiones superadas
            </div>
            <div className="text-lg font-black text-braini-blue" style={{ fontWeight: 900 }}>
              {Math.round(progressPercentage)}%
            </div>
          </div>
        </div>
      </div>

      {/* Barra de progreso compacta */}
      <div className="mt-2">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-braini-blue rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default MedalShelf;
