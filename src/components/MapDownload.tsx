import React from 'react';
import { Button } from '@/components/ui/button';
import { MapIcon } from 'lucide-react';

interface MapDownloadProps {
  className?: string;
}

const MapDownload: React.FC<MapDownloadProps> = ({ 
  className = '' 
}) => {
  const handleMapOpen = () => {
    // URL del mapa en Supabase Storage
    const mapUrl = 'https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/braini-map//tema1.pdf';
    
    // Abrir en nueva pestaña
    window.open(mapUrl, '_blank');
  };

  return (
    <Button 
      onClick={handleMapOpen}
      className={`bg-gradient-to-r from-braini-blue to-braini-blue-light hover:from-braini-blue-dark hover:to-braini-blue text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${className}`}
    >
      <MapIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
      <span className="hidden sm:inline">Descargar Mapa Físico</span>
      <span className="sm:hidden">Mapa</span>
    </Button>
  );
};

export default MapDownload; 