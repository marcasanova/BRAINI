import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import type { ReactNode } from 'react';
import { server } from '../../../../tests/setup/msw/server';
import { useMissions } from './useMissions';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('useMissions', () => {
  it('carga misiones con React Query', async () => {
    server.use(
      http.get('*/rest/v1/child_missions*', () =>
        HttpResponse.json([
          {
            mission_id: 1,
            status: 'completed',
            missions: { id: 1, titulo: 'Inicio', descripcion: null },
          },
        ]),
      ),
    );

    const { result } = renderHook(() => useMissions('child-abc'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.missions).toHaveLength(1);
    expect(result.current.missions[0].missions.titulo).toBe('Inicio');
    expect(result.current.error).toBeNull();
  });

  it('no consulta sin childId', async () => {
    const { result } = renderHook(() => useMissions(undefined), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.missions).toEqual([]);
  });
});
