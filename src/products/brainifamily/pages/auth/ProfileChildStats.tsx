import React from 'react';
import { Award, Flag, Heart, Sparkles } from 'lucide-react';
import type { ChildProgressStats } from '@/integrations/supabase/queries/profile-progress';

interface ProfileChildStatsProps {
  stats: ChildProgressStats;
  variant?: 'child' | 'household';
  childrenCount?: number;
}

function Chip({
  label,
  value,
  pie,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  pie: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: 'yellow' | 'turquoise' | 'pink' | 'blue';
}) {
  const tones = {
    yellow: 'bg-braini-yellow/20 text-braini-yellow-dark',
    turquoise: 'bg-braini-turquoise/15 text-braini-turquoise-dark',
    pink: 'bg-braini-pink/15 text-braini-pink-dark',
    blue: 'bg-braini-blue/15 text-braini-blue-dark',
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-2.5 py-2 sm:px-3 sm:py-2.5 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
          <p className="text-lg sm:text-xl font-black text-gray-900 mt-0.5 truncate" style={{ fontWeight: 900 }}>
            {value}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">{pie}</p>
        </div>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${tones[tone]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

const ProfileChildStats: React.FC<ProfileChildStatsProps> = ({
  stats,
  variant = 'child',
  childrenCount = 1,
}) => {
  const isHousehold = variant === 'household';
  const none = 'Aún no hay progreso';

  const medalsPie =
    stats.medalsEarned === 0
      ? none
      : isHousehold
        ? `${stats.medalsEarned} de ${stats.medalsTotal * Math.max(childrenCount, 1)}`
        : `${stats.medalsEarned} de ${stats.medalsTotal}`;

  const activitiesPie = stats.activitiesRated === 0 ? none : 'con nota';
  const diaryPie = stats.diaryDays === 0 ? none : 'días registrados';

  const missionValue = isHousehold
    ? String(stats.currentMissionCount)
    : stats.currentMissionTitle ?? '—';
  const missionPie = isHousehold
    ? stats.currentMissionCount > 0
      ? 'hijos con misión activa'
      : none
    : stats.currentMissionTitle
      ? 'en curso'
      : none;

  return (
    <div className={isHousehold ? 'grid grid-cols-2 lg:grid-cols-4 gap-2' : 'grid grid-cols-2 gap-2'}>
      <Chip label="Misiones" value={String(stats.medalsEarned)} pie={medalsPie} icon={Award} tone="yellow" />
      <Chip
        label="Actividades"
        value={String(stats.activitiesRated)}
        pie={activitiesPie}
        icon={Sparkles}
        tone="turquoise"
      />
      <Chip label="Diario" value={String(stats.diaryDays)} pie={diaryPie} icon={Heart} tone="pink" />
      <Chip label="Misión actual" value={missionValue} pie={missionPie} icon={Flag} tone="blue" />
    </div>
  );
};

export default ProfileChildStats;
