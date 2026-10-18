import { useCallback, useSyncExternalStore } from 'react';
import { isSoundMuted, setSoundMuted, subscribeSoundMuted } from '@/shared/lib/sound';

/** Estado del silencio de sonidos, sincronizado entre componentes. */
export function useSoundMuted(): [boolean, (muted: boolean) => void] {
  const muted = useSyncExternalStore(subscribeSoundMuted, isSoundMuted, () => false);
  const update = useCallback((next: boolean) => setSoundMuted(next), []);
  return [muted, update];
}
