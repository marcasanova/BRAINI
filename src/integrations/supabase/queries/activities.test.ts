import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../../../tests/setup/msw/server';
import { fetchChildActivities, fetchChildActivitiesByMission } from './activities';

describe('fetchChildActivities', () => {
  it('mapea actividades del niño', async () => {
    server.use(
      http.get('*/rest/v1/child_activities*', () =>
        HttpResponse.json([
          {
            activity_id: 10,
            puntuacion: 4,
            opinion: 'Bien',
            started_at: '2026-01-01T00:00:00Z',
            activities: {
              id: 10,
              titulo_actividad: 'Actividad 1',
              mission_id: 1,
            },
          },
        ]),
      ),
    );

    const result = await fetchChildActivities('child-1');
    expect(result[0].activities.titulo_actividad).toBe('Actividad 1');
  });
});

describe('fetchChildActivitiesByMission', () => {
  it('filtra por misión', async () => {
    server.use(
      http.get('*/rest/v1/activities*', () => HttpResponse.json([{ id: 10 }, { id: 11 }])),
      http.get('*/rest/v1/child_activities*', () =>
        HttpResponse.json([
          {
            activity_id: 10,
            puntuacion: null,
            opinion: null,
            started_at: null,
            activities: { id: 10, titulo_actividad: 'A1', mission_id: 1 },
          },
        ]),
      ),
    );

    const result = await fetchChildActivitiesByMission('child-1', 1);
    expect(result).toHaveLength(1);
    expect(result[0].activity_id).toBe(10);
  });

  it('devuelve array vacío sin actividades en la misión', async () => {
    server.use(http.get('*/rest/v1/activities*', () => HttpResponse.json([])));

    const result = await fetchChildActivitiesByMission('child-1', 99);
    expect(result).toEqual([]);
  });
});
