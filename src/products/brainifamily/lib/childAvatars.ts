export const CHILD_AVATAR_IDS = [
  'zorro',
  'buho',
  'panda',
  'gato',
  'perro',
  'conejo',
  'oso',
  'leon',
  'pinguino',
  'koala',
] as const;

export type ChildAvatarId = (typeof CHILD_AVATAR_IDS)[number];

export const CHILD_AVATARS: { id: ChildAvatarId; label: string }[] = [
  { id: 'zorro', label: 'Zorro' },
  { id: 'buho', label: 'Búho' },
  { id: 'panda', label: 'Panda' },
  { id: 'gato', label: 'Gato' },
  { id: 'perro', label: 'Perro' },
  { id: 'conejo', label: 'Conejo' },
  { id: 'oso', label: 'Oso' },
  { id: 'leon', label: 'León' },
  { id: 'pinguino', label: 'Pingüino' },
  { id: 'koala', label: 'Koala' },
];

export function childAvatarSrc(id: ChildAvatarId): string {
  return `/avatars/children/${id}.png`;
}

export function isChildAvatarId(value: string | null | undefined): value is ChildAvatarId {
  return typeof value === 'string' && (CHILD_AVATAR_IDS as readonly string[]).includes(value);
}

export function pickRandomChildAvatarId(): ChildAvatarId {
  const index = Math.floor(Math.random() * CHILD_AVATAR_IDS.length);
  return CHILD_AVATAR_IDS[index] ?? 'zorro';
}
