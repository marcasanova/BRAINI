import React from 'react';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/dialog';
import { formatearTexto } from '@/products/brainifamily/features/activities/utils/TextFormatter';
import {
  getScientificBaseTitleClasses,
  getScientificBaseIconClasses,
  getSimpleButtonClasses,
} from '@/products/brainifamily/features/activities/utils/ActivityColors';

interface SciBasePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activityType?: string;
  investigacionBeneficios?: string;
}

/**
 * Componente reutilizable para mostrar el popup de Base Científica
 * Mejorado para móviles con mejor UX/UI
 */
const SciBasePopup: React.FC<SciBasePopupProps> = ({
  open,
  onOpenChange,
  activityType,
  investigacionBeneficios,
}) => {
  if (!investigacionBeneficios) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl p-4 sm:p-4 md:p-6 max-h-[85vh] sm:max-h-[90vh] rounded-xl flex flex-col [&>button]:hidden">
        <DialogHeader className="text-left pb-1 shrink-0">
          <DialogTitle className={`text-lg sm:text-lg md:text-xl lg:text-2xl font-bold sm:font-semibold ${getScientificBaseTitleClasses(activityType)} flex items-center gap-1.5 sm:gap-2`}>
            <svg className={`w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 ${getScientificBaseIconClasses(activityType)} shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="wrap-break-word">Base Científica</span>
          </DialogTitle>
        </DialogHeader>
        
        {/* Contenedor con scroll interno */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="grid gap-2 sm:gap-3 md:gap-4 pt-0 pb-2">
            <div className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed wrap-break-word">
              {formatearTexto(investigacionBeneficios)}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-end pt-3 sm:pt-0 border-t border-gray-200 sm:border-0 mt-2 sm:mt-0 shrink-0">
          <Button
            onClick={() => onOpenChange(false)}
            className={`w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base font-medium ${getSimpleButtonClasses(activityType)}`}
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SciBasePopup;

