import React from 'react';
import { Button } from '@/shared/ui/button';
import { MapIcon } from 'lucide-react';
import { MAPA_AVENTURA_URL } from '@/shared/lib/constants/documentosStorage';
import { cn } from '@/shared/lib/utils';

interface MapDownloadProps {
  className?: string;
  buttonText?: string;
}

/** Botón que abre el mapa de la aventura a tamaño completo para descargarlo o imprimirlo. */
const MapDownload: React.FC<MapDownloadProps> = ({ className = '', buttonText = 'Descarga el mapa' }) => {
  const handleMapOpen = () => {
    window.open(MAPA_AVENTURA_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      onClick={handleMapOpen}
      className={cn(
        'h-auto min-h-10 py-2.5 whitespace-normal text-center bg-braini-blue-strong hover:bg-ink text-white font-semibold rounded-xl transition-colors w-full sm:w-auto',
        className,
      )}
    >
      <MapIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 shrink-0" />
      <span>{buttonText}</span>
    </Button>
  );
};

export default MapDownload;
