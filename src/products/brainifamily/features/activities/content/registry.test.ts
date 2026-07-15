import { describe, expect, it } from "vitest";
import {
  REGISTERED_ACTIVITY_IDS,
  activityPuzzleLoaders,
  hasRegisteredActivityPuzzle,
} from "./registry";

describe("activityPuzzleLoaders registry", () => {
  it("registra exactamente 19 actividades con puzzle", () => {
    expect(REGISTERED_ACTIVITY_IDS).toHaveLength(19);
  });

  it("cada activityId tiene un loader de import dinámico", () => {
    for (const id of REGISTERED_ACTIVITY_IDS) {
      expect(hasRegisteredActivityPuzzle(id)).toBe(true);
      expect(typeof activityPuzzleLoaders[id]).toBe("function");
    }
  });

  it("cada loader resuelve un componente por defecto", async () => {
    for (const id of REGISTERED_ACTIVITY_IDS) {
      const mod = await activityPuzzleLoaders[id]();
      expect(mod.default).toBeDefined();
    }
  }, 30_000);
});
