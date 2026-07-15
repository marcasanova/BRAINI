import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../../../tests/setup/msw/server';
import {
  fetchChildrenByParentId,
  fetchClassChildren,
  fetchParentExists,
  fetchPendingInvitesByChildIds,
} from './children';

describe('children queries', () => {
  it('comprueba existencia de padre', async () => {
    server.use(
      http.get('*/rest/v1/parents*', () => HttpResponse.json({ id: 'parent-1' })),
    );

    await expect(fetchParentExists('parent-1')).resolves.toBe(true);
  });

  it('lista hijos por padre con nombre de centro', async () => {
    server.use(
      http.get('*/rest/v1/children*', ({ request }) => {
        const url = new URL(request.url);
        if (url.searchParams.has('parent_id')) {
          return HttpResponse.json([
            {
              id: 'child-1',
              parent_id: 'parent-1',
              nombre: 'Luis',
              apellidos: 'García',
              nivel_educativo: 'primaria',
              course_id: 1,
              profile_completed: true,
              school_id: 'school-1',
              schools: { name: 'Colegio Test' },
            },
          ]);
        }
        return HttpResponse.json([]);
      }),
    );

    const children = await fetchChildrenByParentId('parent-1');
    expect(children[0].school_name).toBe('Colegio Test');
  });

  it('lista alumnos de una clase', async () => {
    server.use(
      http.get('*/rest/v1/children*', () =>
        HttpResponse.json([
          {
            id: 'child-2',
            nombre: 'María',
            apellidos: null,
            nivel_educativo: 'primaria',
            parent_id: null,
          },
        ]),
      ),
    );

    const children = await fetchClassChildren('class-1');
    expect(children[0].nombre).toBe('María');
  });

  it('obtiene invitaciones pendientes por hijo', async () => {
    server.use(
      http.get('*/rest/v1/parent_invited*', () =>
        HttpResponse.json([
          {
            child_id: 'child-2',
            token: 'tok-abc',
            email: 'familia@test.com',
          },
        ]),
      ),
    );

    const invites = await fetchPendingInvitesByChildIds(['child-2']);
    expect(invites[0].token).toBe('tok-abc');
  });
});
