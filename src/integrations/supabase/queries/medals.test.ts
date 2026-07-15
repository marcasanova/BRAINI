import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../../../tests/setup/msw/server';
import { fetchChildMedals } from './medals';

describe('fetchChildMedals', () => {
  it('combina medallas del niño y total del catálogo', async () => {
    server.use(
      http.get('*/rest/v1/child_medals*', () =>
        HttpResponse.json([
          {
            id: 1,
            child_id: 'child-1',
            medal_id: 5,
            fecha_obtencion: '2026-01-01',
          },
        ]),
      ),
      http.head('*/rest/v1/medals*', () =>
        HttpResponse.json(null, {
          headers: { 'content-range': '0-0/12' },
        }),
      ),
    );

    const result = await fetchChildMedals('child-1');
    expect(result.userMedals).toHaveLength(1);
    expect(result.totalMedals).toBe(12);
  });
});
