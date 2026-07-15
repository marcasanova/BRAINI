import React, { Suspense } from "react";
import { getLazyActivityPuzzle } from "@/products/brainifamily/features/activities/content/registry";
import type { UserActivity } from "@/products/brainifamily/hooks/useUserActivities";

export type ActivityPuzzleProps = {
  userProgress: UserActivity;
  activityId: number;
  missionId: string;
  userId: string;
  activityType?: string;
  activityData: {
    duracion_min?: number | null;
    duracion_max?: number | null;
    como_se_juega?: string | null;
    investigacion_beneficios?: string | null;
  };
  onPuzzleComplete: () => void;
};

type ActivityPuzzleRendererProps = ActivityPuzzleProps & {
  activityDbId: number;
};

const ActivityPuzzleRenderer: React.FC<ActivityPuzzleRendererProps> = ({
  activityDbId,
  ...props
}) => {
  const LazyPuzzle = getLazyActivityPuzzle(activityDbId);

  if (!LazyPuzzle) {
    return null;
  }

  return (
    <Suspense fallback={<div className="text-center text-gray-600 py-6">Cargando actividad...</div>}>
      <LazyPuzzle {...props} />
    </Suspense>
  );
};

export default ActivityPuzzleRenderer;
