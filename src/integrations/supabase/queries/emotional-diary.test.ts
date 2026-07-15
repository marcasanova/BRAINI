import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../../../tests/setup/msw/server';
import {
  fetchDayEmotionEntry,
  fetchMonthEmotionEntries,
  formatDateToLocalString,
  upsertEmotionEntry,
} from './emotional-diary';

describe('emotional-diary queries', () => {
  it('formatea fechas en zona local', () => {
    const date = new Date(2026, 6, 15);
    expect(formatDateToLocalString(date)).toBe('2026-07-15');
  });

  it('obtiene entradas del mes', async () => {
    server.use(
      http.get('*/rest/v1/emotional_diary*', () =>
        HttpResponse.json([
          {
            id: 1,
            user_id: 'u1',
            child_id: 'c1',
            emotion_names: ['Alegría'],
            observations: null,
            entry_date: '2026-07-01',
            created_at: '2026-07-01',
            updated_at: '2026-07-01',
          },
        ]),
      ),
    );

    const entries = await fetchMonthEmotionEntries('u1', 'c1', 2026, 7);
    expect(entries).toHaveLength(1);
    expect(entries[0].emotion_names).toContain('Alegría');
  });

  it('obtiene entrada de un día', async () => {
    server.use(
      http.get('*/rest/v1/emotional_diary*', () =>
        HttpResponse.json({
          id: 2,
          user_id: 'u1',
          child_id: 'c1',
          emotion_names: ['Tristeza'],
          observations: 'Nota',
          entry_date: '2026-07-15',
          created_at: '2026-07-15',
          updated_at: '2026-07-15',
        }),
      ),
    );

    const entry = await fetchDayEmotionEntry('u1', 'c1', new Date(2026, 6, 15));
    expect(entry?.observations).toBe('Nota');
  });

  it('hace upsert de entrada emocional', async () => {
    server.use(
      http.post('*/rest/v1/emotional_diary*', () =>
        HttpResponse.json({
          id: 3,
          user_id: 'u1',
          child_id: 'c1',
          emotion_names: ['Miedo'],
          observations: null,
          entry_date: '2026-07-16',
          created_at: '2026-07-16',
          updated_at: '2026-07-16',
        }),
      ),
    );

    const saved = await upsertEmotionEntry({
      userId: 'u1',
      childId: 'c1',
      date: new Date(2026, 6, 16),
      emotionNames: ['Miedo'],
    });

    expect(saved?.id).toBe(3);
  });
});
