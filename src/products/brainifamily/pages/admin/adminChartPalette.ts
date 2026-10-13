export const ADMIN_CHART_COLORS = {
  blue: '#7ea4df',
  turquoise: '#35bdb1',
  pink: '#f5827b',
  yellow: '#f8cd50',
  gray: '#e5e7eb',
} as const;

export const INVITE_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  completed: 'Completada',
  expired: 'Caducada',
  revoked: 'Revocada',
};

export const INVITE_STATUS_COLORS: Record<string, string> = {
  pending: ADMIN_CHART_COLORS.yellow,
  completed: ADMIN_CHART_COLORS.turquoise,
  expired: ADMIN_CHART_COLORS.pink,
  revoked: ADMIN_CHART_COLORS.blue,
};
