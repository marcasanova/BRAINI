import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { getPrimaryButtonClasses, getMainTitleTextClasses } from '@/components/activities/utils/ActivityColors';

interface SuccessPopupProps {
  onClose: () => void;
  activityType?: string;
}

// Lista de frases de retroalimentación
const FEEDBACK_MESSAGES = [
  '¡FANTÁSTICO!',
  '¡GENIAL!',
  '¡SUPER!',
  '¡EXCELENTE!',
  '¡INCREÍBLE!',
  '¡PERFECTO!',
  '¡MARAVILLOSO!',
  '¡ESTUPENDO!',
  '¡BIEN HECHO!',
  '¡LO LOGASTE!',
];

const SuccessPopup: React.FC<SuccessPopupProps> = ({ onClose, activityType }) => {
  const [randomMessage, setRandomMessage] = useState<string>('');
  const [open, setOpen] = useState(true);

  // Seleccionar una frase aleatoria al montar el componente
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * FEEDBACK_MESSAGES.length);
    setRandomMessage(FEEDBACK_MESSAGES[randomIndex]);
  }, []);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[90%] max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-4 sm:p-4 md:p-6 max-h-[85vh] sm:max-h-[90vh] rounded-xl flex flex-col [&>button]:hidden">
        <DialogHeader className="text-center pb-1 sm:pb-2 flex-shrink-0">
          <DialogTitle className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black ${getMainTitleTextClasses(activityType)} text-center`}>
            {randomMessage}
          </DialogTitle>
          <DialogDescription className="text-base sm:text-lg md:text-xl text-gray-600 text-center mt-2 sm:mt-3 font-semibold leading-tight">
            ¡Has completado la actividad!
          </DialogDescription>
        </DialogHeader>
        
        {/* Contenedor con scroll interno si es necesario */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Recordatorio de valoración */}
          <div className="mt-2 sm:mt-3 text-center">
            <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-2 sm:mb-3 font-medium">
              Recuerda valorar la actividad con las estrellitas
            </p>
            <div className="flex items-center justify-center gap-1 sm:gap-1.5">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-400 fill-current"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 flex justify-center flex-shrink-0">
          <Button
            onClick={handleClose}
            className={`w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base font-medium ${getPrimaryButtonClasses(activityType)}`}
          >
            Volver a la actividad
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessPopup;

