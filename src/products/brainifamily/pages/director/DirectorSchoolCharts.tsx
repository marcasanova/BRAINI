import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { ADMIN_CHART_COLORS } from '../admin/adminChartPalette';

interface VolumeRow {
  label: string;
  count: number;
  color: string;
}

interface ClassShareRow {
  name: string;
  count: number;
}

interface DirectorSchoolChartsProps {
  volume: VolumeRow[];
  childrenWithFamily: number;
  childrenTotal: number;
  childrenByClass: ClassShareRow[];
}

const RING_R = 68;
const RING_C = 2 * Math.PI * RING_R;

const DirectorSchoolCharts: React.FC<DirectorSchoolChartsProps> = ({
  volume,
  childrenWithFamily,
  childrenTotal,
  childrenByClass,
}) => {
  const coveragePercent = childrenTotal === 0 ? 0 : Math.round((childrenWithFamily / childrenTotal) * 100);
  const dash = (coveragePercent / 100) * RING_C;
  const maxVolume = Math.max(...volume.map((row) => row.count), 1);
  const maxClass = Math.max(...childrenByClass.map((row) => row.count), 1);

  return (
    <>
      <Card className="bg-white/95 border-braini-blue/20 rounded-2xl shadow-sm lg:col-span-4 h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-gray-900">Volumen del centro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-52 flex items-end gap-2 px-1 pt-2">
            {volume.map((row) => {
              const height = Math.max((row.count / maxVolume) * 100, row.count > 0 ? 8 : 2);
              return (
                <div key={row.label} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5 min-w-0">
                  <span className="text-xs font-semibold text-gray-700">{row.count}</span>
                  <div
                    className="w-full max-w-10 rounded-t-lg"
                    style={{ height: `${height}%`, backgroundColor: row.color }}
                  />
                  <span className="text-[10px] text-gray-500 text-center leading-tight truncate w-full">
                    {row.label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/95 border-braini-blue/20 rounded-2xl shadow-sm lg:col-span-3 h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-gray-900">Alumnos con familia vinculada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 relative flex items-center justify-center">
            <svg
              viewBox="0 0 180 180"
              className="w-32 h-32"
              aria-label={`${coveragePercent}% de alumnos con familia`}
            >
              <circle cx="90" cy="90" r={RING_R} fill="none" stroke={ADMIN_CHART_COLORS.gray} strokeWidth="16" />
              <circle
                cx="90"
                cy="90"
                r={RING_R}
                fill="none"
                stroke={ADMIN_CHART_COLORS.turquoise}
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${RING_C}`}
                transform="rotate(-90 90 90)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-gray-900" style={{ fontWeight: 900 }}>
                {coveragePercent}%
              </span>
              <span className="text-xs text-gray-500 px-4 text-center">
                {childrenWithFamily} de {childrenTotal}
              </span>
            </div>
          </div>
          {childrenByClass.length > 0 && (
            <div className="mt-1 space-y-1.5">
              <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">Alumnos por clase</p>
              {childrenByClass.slice(0, 5).map((row) => (
                <div key={row.name} className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-600 truncate w-24 shrink-0">{row.name}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-braini-blue"
                      style={{ width: `${Math.max((row.count / maxClass) * 100, 4)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-700 w-6 text-right">{row.count}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default DirectorSchoolCharts;
