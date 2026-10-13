export const TEACHER_AVATAR_IDS = [
  'oliva',
  'bruno',
  'nara',
  'teo',
  'ines',
  'sam',
  'lina',
  'omar',
] as const;

export type TeacherAvatarId = (typeof TEACHER_AVATAR_IDS)[number];

export const TEACHER_AVATARS: { id: TeacherAvatarId; label: string }[] = [
  { id: 'oliva', label: 'Oliva' },
  { id: 'bruno', label: 'Bruno' },
  { id: 'nara', label: 'Nara' },
  { id: 'teo', label: 'Teo' },
  { id: 'ines', label: 'Inés' },
  { id: 'sam', label: 'Sam' },
  { id: 'lina', label: 'Lina' },
  { id: 'omar', label: 'Omar' },
];

export function teacherAvatarSrc(id: TeacherAvatarId): string {
  return `/avatars/teachers/${id}.png`;
}

export function isTeacherAvatarId(value: string | null | undefined): value is TeacherAvatarId {
  return typeof value === 'string' && (TEACHER_AVATAR_IDS as readonly string[]).includes(value);
}

export function pickRandomTeacherAvatarId(): TeacherAvatarId {
  const index = Math.floor(Math.random() * TEACHER_AVATAR_IDS.length);
  return TEACHER_AVATAR_IDS[index] ?? 'oliva';
}
