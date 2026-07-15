import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export type ActivityPuzzleLoader = () => Promise<{ default: ComponentType<unknown> }>;

/** Mapa activityId (BD) → import dinámico del puzzle correspondiente. */
export const activityPuzzleLoaders: Record<number, ActivityPuzzleLoader> = {
  1: () => import("@/components/activities/content/Ses1Act1"),
  2: () => import("@/components/activities/content/Ses1Act2"),
  3: () => import("@/components/activities/content/Ses2Act1"),
  4: () => import("@/components/activities/content/Ses2Act2"),
  6: () => import("@/components/activities/content/Ses3Act1"),
  7: () => import("@/components/activities/content/Ses3Act2"),
  8: () => import("@/components/activities/content/Ses4Act1"),
  9: () => import("@/components/activities/content/Ses4Act2"),
  10: () => import("@/components/activities/content/Ses5Act1"),
  11: () => import("@/components/activities/content/Ses5Act2"),
  24: () => import("@/components/activities/content/Ses6Act1"),
  25: () => import("@/components/activities/content/Ses7Act1"),
  26: () => import("@/components/activities/content/Ses8Act1"),
  27: () => import("@/components/activities/content/Ses9Act1"),
  28: () => import("@/components/activities/content/Ses10Act1"),
  30: () => import("@/components/activities/content/Ses6Act2"),
  31: () => import("@/components/activities/content/Ses7Act2"),
  32: () => import("@/components/activities/content/Ses8Act2"),
  33: () => import("@/components/activities/content/Ses9Act2"),
};

export const REGISTERED_ACTIVITY_IDS = Object.keys(activityPuzzleLoaders).map(Number);

const lazyCache = new Map<number, LazyExoticComponent<ComponentType<unknown>>>();

export function getLazyActivityPuzzle(
  activityId: number,
): LazyExoticComponent<ComponentType<unknown>> | null {
  const loader = activityPuzzleLoaders[activityId];
  if (!loader) return null;

  let cached = lazyCache.get(activityId);
  if (!cached) {
    cached = lazy(loader);
    lazyCache.set(activityId, cached);
  }
  return cached;
}

export function hasRegisteredActivityPuzzle(activityId: number): boolean {
  return activityId in activityPuzzleLoaders;
}
