import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../../../tests/setup/msw/server';
import { fetchChildMissions } from './missions';

describe('fetchChildMissions', () => {
  it('mapea misiones con relación anidada', async () => {
    server.use(
      http.get('*/rest/v1/child_missions*', () =>
        HttpResponse.json([
          {
            mission_id: 1,
            status: 'current',
            missions: { id: 1, titulo: 'Misión 1', descripcion: 'Desc' },
          },
          {
            mission_id: 2,
            status: 'locked',
            missions: [{ id: 2, titulo: 'Misión 2', descripcion: null }],
          },
        ]),
      ),
    );

    const result = await fetchChildMissions('child-1');

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      mission_id: 1,
      status: 'current',
      missions: { id: 1, titulo: 'Misión 1' },
    });
    expect(result[1].missions.id).toBe(2);
  });

  it('propaga errores de PostgREST', async () => {
    server.use(
      http.get('*/rest/v1/child_missions*', () =>
        HttpResponse.json({ message: 'permission denied' }, { status: 403 }),
      ),
    );

    await expect(fetchChildMissions('child-1')).rejects.toBeTruthy();
  });
});
