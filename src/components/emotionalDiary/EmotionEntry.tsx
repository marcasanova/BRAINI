import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Edit3 } from 'lucide-react';

interface EmotionEntryProps {
  observations: string;
  onObservationsChange: (observations: string) => void;
  disabled?: boolean;
  childName?: string;
}

const EmotionEntry: React.FC<EmotionEntryProps> = ({
  observations,
  onObservationsChange,
  disabled = false,
  childName = ''
}) => {
  return (
      <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-gray-800">
            <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-braini-blue" />
            Observaciones (Opcional)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 sm:space-y-3">
          <Textarea
            value={observations}
            onChange={(e) => onObservationsChange(e.target.value)}
            placeholder={childName 
              ? `Describe cómo se comportó ${childName} hoy, qué pasó, o cualquier observación que quieras recordar...`
              : "Describe cómo se comportó hoy, qué pasó, o cualquier observación que quieras recordar..."
            }
            className="min-h-[100px] resize-none border-2 border-gray-200 focus:border-braini-blue focus:ring-0 text-base sm:text-sm"
            maxLength={500}
            disabled={disabled}
          />
          
          <div className="flex justify-end">
            <span className="text-xs text-gray-500">
              {observations.length}/500 caracteres
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionEntry;
