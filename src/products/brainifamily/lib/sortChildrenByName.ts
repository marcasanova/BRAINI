type NamedChild = {
  nombre?: string | null;
  apellidos?: string | null;
};

export function compareChildrenByName(a: NamedChild, b: NamedChild): number {
  const byNombre = (a.nombre ?? '').localeCompare(b.nombre ?? '', 'es', { sensitivity: 'base' });
  if (byNombre !== 0) return byNombre;
  return (a.apellidos ?? '').localeCompare(b.apellidos ?? '', 'es', { sensitivity: 'base' });
}

export function sortChildrenByName<T extends NamedChild>(rows: T[]): T[] {
  return [...rows].sort(compareChildrenByName);
}
