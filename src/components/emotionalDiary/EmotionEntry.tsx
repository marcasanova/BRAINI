import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Edit3 } from 'lucide-react';

interface EmotionEntryProps {
  observations: string;
  onObservationsChange: (observations: string) => void;
  disabled?: boolean;
}

const EmotionEntry: React.FC<EmotionEntryProps> = ({
  observations,
  onObservationsChange,
  disabled = false
}) => {
  return (
    <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
          <Edit3 className="w-5 h-5 text-braini-blue" />
          Observaciones (Opcional)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Textarea
            value={observations}
            onChange={(e) => onObservationsChange(e.target.value)}
            placeholder="Describe cómo se comportó tu hijo/a hoy, qué pasó, o cualquier observación que quieras recordar..."
            className="min-h-[100px] resize-none border-2 border-gray-200 focus:border-braini-blue focus:ring-0"
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
