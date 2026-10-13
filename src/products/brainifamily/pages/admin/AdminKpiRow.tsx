import React from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Baby, BookOpen, GraduationCap, Home, School, UserCog } from 'lucide-react';
import { ADMIN_CHART_COLORS } from './adminChartPalette';

interface SparkPoint {
  label: string;
  value: number;
}

interface AdminKpiRowProps {
  schoolsTotal: number;
  schoolsActive: number;
  schoolsByMonth: SparkPoint[];
  directorsTotal: number;
  teachersTotal: number;
  parentsTotal: number;
  childrenTotal: number;
  classesTotal: number;
}

function Sparkline({ points }: { points: number[] }) {
  const max = Math.max(...points, 1);
  const w = 120;
  const h = 36;
  const coords = points
    .map((value, index) => {
      const x = points.length === 1 ? w / 2 : (index / (points.length - 1)) * w;
      const y = h - (value / max) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-10 w-full mt-3 -mb-1" aria-hidden>
      <polyline
        fill="none"
        stroke={ADMIN_CHART_COLORS.blue}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={coords}
      />
    </svg>
  );
}

const AdminKpiRow: React.FC<AdminKpiRowProps> = ({
  schoolsTotal,
  schoolsActive,
  schoolsByMonth,
  directorsTotal,
  teachersTotal,
  parentsTotal,
  childrenTotal,
  classesTotal,
}) => {
  const showSpark = schoolsByMonth.some((p) => p.value > 0);

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Card className="bg-white/95 border-braini-blue/20 rounded-2xl shadow-sm">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Centros</p>
              <p className="text-3xl font-black text-gray-900 mt-1" style={{ fontWeight: 900 }}>
                {schoolsTotal}
              </p>
              <p className="text-xs text-gray-500 mt-1">{schoolsActive} activos</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-braini-blue/15 flex items-center justify-center shrink-0">
              <School className="w-5 h-5 text-braini-blue-dark" />
            </div>
          </div>
          {showSpark && (
            <Sparkline points={schoolsByMonth.map((p) => p.value)} />
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/95 border-braini-blue/20 rounded-2xl shadow-sm">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Directores</p>
              <p className="text-3xl font-black text-gray-900 mt-1" style={{ fontWeight: 900 }}>
                {directorsTotal}
              </p>
              <p className="text-xs text-gray-500 mt-1">Cuentas de dirección</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-braini-turquoise/15 flex items-center justify-center shrink-0">
              <UserCog className="w-5 h-5 text-braini-turquoise-dark" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/95 border-braini-blue/20 rounded-2xl shadow-sm">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Profesorado</p>
              <p className="text-3xl font-black text-gray-900 mt-1" style={{ fontWeight: 900 }}>
                {teachersTotal}
              </p>
              <p className="text-xs text-gray-500 mt-1">En todos los centros</p>
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
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Familias</p>
              <p className="text-3xl font-black text-gray-900 mt-1" style={{ fontWeight: 900 }}>
                {parentsTotal}
              </p>
              <p className="text-xs text-gray-500 mt-1">Cuentas de padres/madres</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-braini-pink/15 flex items-center justify-center shrink-0">
              <Home className="w-5 h-5 text-braini-pink-dark" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/95 border-braini-blue/20 rounded-2xl shadow-sm">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Niños y niñas</p>
              <p className="text-3xl font-black text-gray-900 mt-1" style={{ fontWeight: 900 }}>
                {childrenTotal}
              </p>
              <p className="text-xs text-gray-500 mt-1">Perfiles en la app</p>
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
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Clases</p>
              <p className="text-3xl font-black text-gray-900 mt-1" style={{ fontWeight: 900 }}>
                {classesTotal}
              </p>
              <p className="text-xs text-gray-500 mt-1">Aulas dadas de alta</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-braini-blue/15 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-braini-blue-dark" />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default AdminKpiRow;
