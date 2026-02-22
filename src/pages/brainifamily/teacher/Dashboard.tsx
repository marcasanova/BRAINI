import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeacher } from '@/hooks/useTeacher';
import { useTeacherChildren } from '@/hooks/useTeacherChildren';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { teacher } = useTeacher();
  const [selectedClassIndex, setSelectedClassIndex] = useState<number>(0);

  const classes = useMemo(() => teacher?.classes?.classes ?? [], [teacher]);
  const selectedClass = classes[selectedClassIndex];
  const childIds = useMemo(
    () => selectedClass?.child_ids ?? [],
    [selectedClass]
  );

  const { children, loading, error } = useTeacherChildren(childIds);

  if (!teacher) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mis clases</h1>
        <p className="text-gray-600 mt-1">Elige una clase para ver los niños y su progreso.</p>
      </div>

      {classes.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No tienes clases asignadas.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Clase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={String(selectedClassIndex)}
                onValueChange={(v) => setSelectedClassIndex(Number(v))}
              >
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Selecciona una clase" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls, idx) => (
                    <SelectItem key={cls.name} value={String(idx)}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Niños de {selectedClass?.name ?? 'la clase'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="py-8 text-center text-gray-500">Cargando niños...</div>
              )}
              {error && (
                <div className="py-4 text-center text-red-600">{error}</div>
              )}
              {!loading && !error && children.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  No hay niños en esta clase.
                </div>
              )}
              {!loading && !error && children.length > 0 && (
                <ul className="space-y-2">
                  {children.map((child) => (
                    <li key={child.id}>
                      <button
                        type="button"
                        onClick={() => navigate(`/brainifamily/teacher/nino/${child.id}`)}
                        className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-braini-blue transition flex items-center justify-between"
                      >
                        <span className="font-medium text-gray-800">
                          {child.nombre} {child.apellidos ?? ''}
                        </span>
                        <span className="text-sm text-gray-500">Ver progreso →</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;
