import React from 'react';
import { Button } from '@/shared/ui/button';
import { MapIcon } from 'lucide-react';
import { MAPA_AVENTURA_URL } from '@/shared/lib/constants/documentosStorage';

interface MapDownloadProps {
  className?: string;
  buttonText?: string;
  /** Si es true, muestra la imagen del mapa encima del botón */
  showImage?: boolean;
}

const MapDownload: React.FC<MapDownloadProps> = ({ 
  className = '',
  buttonText = 'Descarga el mapa',
  showImage = false
}) => {
  const handleMapOpen = () => {
    window.open(MAPA_AVENTURA_URL, '_blank');
  };

  return (
    <div className={className}>
      {showImage && (
        <a
          href={MAPA_AVENTURA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl overflow-hidden border-2 border-braini-blue/20 shadow-lg mb-4 focus:outline-hidden focus:ring-2 focus:ring-braini-blue"
        >
          <img
            src={MAPA_AVENTURA_URL}
            alt="Mapa de la aventura BRAINI"
            className="w-full h-auto object-contain"
          />
        </a>
      )}
      <div className={showImage ? 'flex justify-center' : ''}>
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