import React from 'react';
import { useUserActivities } from '@/hooks/useUserActivities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MessageSquare } from 'lucide-react';

interface TeacherActivityListProps {
  childId: string;
}

const TeacherActivityList: React.FC<TeacherActivityListProps> = ({ childId }) => {
  const { activities, loading, error } = useUserActivities(childId);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          Cargando actividades...
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

  const withRating = activities.filter((a) => a.puntuacion != null || (a.opinion ?? '').trim() !== '');

  if (withRating.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          Aún no hay actividades valoradas.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Actividades y valoraciones</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {withRating.map((a) => (
            <li
              key={a.activity_id}
              className="p-4 rounded-lg border border-gray-200 bg-gray-50/50"
            >
              <div className="font-medium text-gray-800">
                {a.activities?.titulo_actividad ?? `Actividad ${a.activity_id}`}
              </div>
              {a.puntuacion != null && (
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{a.puntuacion}/5</span>
                </div>
              )}
              {a.opinion?.trim() && (
                <div className="flex items-start gap-1 mt-2 text-sm text-gray-600">
                  <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="italic">{a.opinion}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TeacherActivityList;
