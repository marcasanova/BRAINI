import React from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Baby, BookOpen, GraduationCap, Home } from 'lucide-react';

interface DirectorKpiRowProps {
  teachersTotal: number;
  teachersWithoutClass: number;
  classesTotal: number;
  childrenTotal: number;
  childrenWithoutClass: number;
  familiesTotal: number;
  childrenWithoutFamily: number;
}

const DirectorKpiRow: React.FC<DirectorKpiRowProps> = ({
  teachersTotal,
  teachersWithoutClass,
  classesTotal,
  childrenTotal,
  childrenWithoutClass,
  familiesTotal,
  childrenWithoutFamily,
}) => {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="bg-white/95 border-braini-blue/20 rounded-2xl shadow-sm">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Docentes</p>
              <p className="text-3xl font-black text-gray-900 mt-1" style={{ fontWeight: 900 }}>
                {teachersTotal}
              </p>
              <p className="text-xs text-gray-500 mt-1">{teachersWithoutClass} sin clase</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-braini-yellow/20 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-braini-yellow-dark" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/95 border-braini-blue/20 rounded-2xl shadow-sm">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Clases</p>
              <p className="text-3xl font-black text-gray-900 mt-1" style={{ fontWeight: 900 }}>
                {classesTotal}
              </p>
              <p className="text-xs text-gray-500 mt-1">Aulas del centro</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-braini-blue/15 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-braini-blue-dark" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/95 border-braini-blue/20 rounded-2xl shadow-sm">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Alumnos</p>
              <p className="text-3xl font-black text-gray-900 mt-1" style={{ fontWeight: 900 }}>
                {childrenTotal}
              </p>
              <p className="text-xs text-gray-500 mt-1">{childrenWithoutClass} sin clase</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-braini-turquoise/15 flex items-center justify-center shrink-0">
              <Baby className="w-5 h-5 text-braini-turquoise-dark" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/95 border-braini-blue/20 rounded-2xl shadow-sm">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Familias vinculadas</p>
              <p className="text-3xl font-black text-gray-900 mt-1" style={{ fontWeight: 900 }}>
                {familiesTotal}
              </p>
              <p className="text-xs text-gray-500 mt-1">{childrenWithoutFamily} alumnos sin familia</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-braini-pink/15 flex items-center justify-center shrink-0">
              <Home className="w-5 h-5 text-braini-pink-dark" />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default DirectorKpiRow;
