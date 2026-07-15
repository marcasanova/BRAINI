import React from 'react';
import { useUserMedals } from '@/products/brainifamily/hooks/useUserMedals';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { getMedalImageForNivelEducativo } from '@/shared/lib/constants/emotionsStorage';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MedalInfo {
  id: number;
  mission_id: number;
  nombre: string;
  descripcion: string | null;
}

interface TeacherMedalListProps {
  childId: string;
}

const TeacherMedalList: React.FC<TeacherMedalListProps> = ({ childId }) => {
  const { userMedals, totalMedals, loading, error } = useUserMedals(childId);
  const [medalsCatalog, setMedalsCatalog] = useState<MedalInfo[]>([]);
  const [nivelEducativo, setNivelEducativo] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('medals')
      .select('id, mission_id, nombre, descripcion')
      .order('mission_id', { ascending: true })
      .then(({ data }) => setMedalsCatalog((data ?? []) as MedalInfo[]));
  }, []);

  useEffect(() => {
    if (!childId) return;
    supabase
      .from('children')
      .select('nivel_educativo')
      .eq('id', childId)
      .single()
      .then(({ data }) => setNivelEducativo(data?.nivel_educativo ?? null));
  }, [childId]);

  const medalImage = getMedalImageForNivelEducativo(nivelEducativo);
  const earnedIds = new Set(userMedals.map((m) => m.medal_id));

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          Cargando medallas...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-red-600">{error}</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Medallas</CardTitle>
        <p className="text-sm text-gray-500">
          {userMedals.length} de {totalMedals} misiones superadas
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {medalsCatalog.map((medal) => {
            const earned = earnedIds.has(medal.id);
            const userMedal = userMedals.find((m) => m.medal_id === medal.id);
            const dateStr = userMedal?.fecha_obtencion
              ? new Date(userMedal.fecha_obtencion).toLocaleDateString('es-ES')
              : null;

            return (
              <div
                key={medal.id}
                className={`flex flex-col items-center p-3 rounded-lg border ${
                  earned ? 'border-amber-300 bg-amber-50/50' : 'border-gray-200 bg-gray-50/50'
                }`}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center bg-white">
                  {earned ? (
                    <img
                      src={medalImage}
                      alt={medal.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300" />
                  )}
                </div>
                <div className="text-xs font-medium text-gray-700 mt-2 text-center">
                  Misión {medal.mission_id}
                </div>
                {dateStr && (
                  <div className="text-xs text-gray-500 mt-0.5">{dateStr}</div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherMedalList;
