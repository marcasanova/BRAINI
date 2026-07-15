import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("*/rest/v1/*", () => {
    return HttpResponse.json([]);
  }),
  http.post("*/rest/v1/rpc/get_my_role", () => {
    return HttpResponse.json({ role: null });
  }),
];
