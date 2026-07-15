import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../../../tests/setup/msw/server';
import { fetchCurrentTeacher, fetchTeacherByUserId } from './teachers';

describe('teachers queries', () => {
  it('carga perfil de maestro con clases y conteos', async () => {
    server.use(
      http.get('*/rest/v1/teachers*', () =>
        HttpResponse.json({
          id: 'teacher-1',
          email: 't@school.com',
          nombre: 'Ana',
          school_id: 'school-1',
          active: true,
          created_at: '2026-01-01',
          updated_at: '2026-01-01',
        }),
      ),
      http.get('*/rest/v1/classes*', () =>
        HttpResponse.json([
          {
            id: 'class-1',
            name: '3A',
            course_id: 1,
            nivel_educativo: 'primaria',
            courses: { nombre: 'Tercero' },
          },
        ]),
      ),
      http.get('*/rest/v1/children*', () =>
        HttpResponse.json([{ class_id: 'class-1' }, { class_id: 'class-1' }]),
      ),
    );

    const teacher = await fetchTeacherByUserId('teacher-1');
    expect(teacher?.nombre).toBe('Ana');
    expect(teacher?.classList).toHaveLength(1);
    expect(teacher?.classStudentCounts['class-1']).toBe(2);
  });

  it('devuelve null si no hay fila de maestro', async () => {
    server.use(http.get('*/rest/v1/teachers*', () => HttpResponse.json(null)));

    const teacher = await fetchTeacherByUserId('unknown');
    expect(teacher).toBeNull();
  });

  it('fetchCurrentTeacher sin sesión devuelve null', async () => {
    const result = await fetchCurrentTeacher();
    expect(result.user).toBeNull();
    expect(result.teacher).toBeNull();
  });
});
