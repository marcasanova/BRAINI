import React from 'react';
import { Button } from '@/shared/ui/button';
import { MapIcon } from 'lucide-react';
import { MAPA_AVENTURA_URL } from '@/shared/lib/constants/documentosStorage';
import { cn } from '@/shared/lib/utils';

interface MapDownloadProps {
  className?: string;
  buttonText?: string;
  /** Si es true, muestra la imagen del mapa encima del botón */
  showImage?: boolean;
  /** En escritorio (md+), la imagen se encoge para caber en el alto del contenedor sin recortarse */
  fillHeight?: boolean;
}

const MapDownload: React.FC<MapDownloadProps> = ({
  className = '',
  buttonText = 'Descarga el mapa',
  showImage = false,
  fillHeight = false
}) => {
  const handleMapOpen = () => {
    window.open(MAPA_AVENTURA_URL, '_blank');
  };

  return (
    <div className={cn(fillHeight && 'md:flex md:flex-col', className)}>
      {showImage && (
        <a
          href={MAPA_AVENTURA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'block mb-4 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-braini-blue',
            fillHeight && 'md:flex md:flex-1 md:min-h-0 md:items-center md:justify-center'
          )}
        >
          <img
            src={MAPA_AVENTURA_URL}
            alt="Mapa de la aventura BRAINI"
            className={cn(
              'w-full h-auto object-contain rounded-xl border-2 border-braini-blue/20 shadow-lg',
              fillHeight && 'md:w-auto md:max-w-full md:max-h-full'
            )}
          />
        </a>
      )}
      <div className={cn(showImage && 'flex justify-center', fillHeight && 'shrink-0')}>
        <Button
          onClick={handleMapOpen}
          className="bg-braini-blue hover:bg-braini-blue-dark text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
        >
          <MapIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          <span>{buttonText}</span>
        </Button>
      </div>
    </div>
  );
};

export default MapDownload;
