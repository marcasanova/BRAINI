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
import { getPrimaryButtonClasses, getMainTitleTextClasses } from '@/components/activities/utils/activityColors';

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
      <DialogContent className="max-w-md bg-white/95 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className={`text-3xl font-bold ${getMainTitleTextClasses(activityType)} text-center`}>
            {randomMessage}
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-center mt-2">
            ¡Has completado la actividad!
          </DialogDescription>
        </DialogHeader>
        
        {/* Recordatorio de valoración */}
        <div className="mt-6 text-center">
          <p className="text-gray-700 mb-3 font-medium">
            Recuerda valorar la actividad con las estrellitas
          </p>
          <div className="flex items-center justify-center gap-1">
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                className="w-8 h-8 text-yellow-400 fill-current"
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleClose}
            className={getPrimaryButtonClasses(activityType)}
          >
            Volver a la actividad
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessPopup;

