import { http, HttpResponse } from 'msw';

const SUPABASE_URL = 'http://localhost:54321';

export function supabaseRestHandler(
  table: string,
  response: unknown,
  method: 'get' | 'post' | 'patch' = 'get',
) {
  const pattern = `*/rest/v1/${table}*`;
  if (method === 'get') {
    return http.get(pattern, () => HttpResponse.json(response));
  }
  if (method === 'post') {
    return http.post(pattern, () => HttpResponse.json(response));
  }
  return http.patch(pattern, () => HttpResponse.json(response));
}

export function supabaseRpcHandler(rpcName: string, response: unknown) {
  return http.post(`*/rest/v1/rpc/${rpcName}`, () => HttpResponse.json(response));
}

export function supabaseCountHandler(table: string, count: number) {
  return http.head(`*/rest/v1/${table}*`, () =>
    HttpResponse.json(null, {
      headers: {
        'content-range': `0-0/${count}`,
      },
    }),
  );
}

export { SUPABASE_URL };
