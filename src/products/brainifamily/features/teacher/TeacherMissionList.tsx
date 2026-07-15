import React from 'react';
import { useMissions } from '@/products/brainifamily/hooks/useMissions';
import { MISSION_STATUS } from '@/shared/lib/constants/missionStatus';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Lock, CheckCircle, Circle } from 'lucide-react';

interface TeacherMissionListProps {
  childId: string;
}

const TeacherMissionList: React.FC<TeacherMissionListProps> = ({ childId }) => {
  const { missions, loading, error } = useMissions(childId);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          Cargando misiones...
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

  if (!missions.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          No hay misiones asignadas.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Estado de misiones</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {missions.map((m) => (
            <li
              key={m.mission_id}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50/50"
            >
              {m.status === MISSION_STATUS.LOCKED && (
                <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
              {m.status === MISSION_STATUS.CURRENT && (
                <Circle className="w-5 h-5 text-braini-blue flex-shrink-0" />
              )}
              {m.status === MISSION_STATUS.COMPLETED && (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <span className="font-medium text-gray-800">
                  Misión {m.missions.id}. {m.missions.titulo}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {m.status === MISSION_STATUS.LOCKED && '(Bloqueada)'}
                  {m.status === MISSION_STATUS.CURRENT && '(Disponible)'}
                  {m.status === MISSION_STATUS.COMPLETED && '(Completada)'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TeacherMissionList;
