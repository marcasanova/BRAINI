import { describe, expect, it } from "vitest";
import {
  isDirectorRole,
  isParentRole,
  isSuperAdminRole,
  isTeacherRole,
  normalizeAppRole,
} from "./myRole";
import { roles } from "../../tests/fixtures/roles";

describe("normalizeAppRole", () => {
  it("normaliza variantes de super admin", () => {
    expect(normalizeAppRole("Super Admin")).toBe("super_admin");
    expect(normalizeAppRole("platform_admin")).toBe("super_admin");
    expect(normalizeAppRole("superadmin")).toBe("super_admin");
  });

  it("devuelve null para valores vacíos o inválidos", () => {
    expect(normalizeAppRole(null)).toBeNull();
    expect(normalizeAppRole("   ")).toBe("");
    expect(normalizeAppRole(42)).toBeNull();
  });

  it("normaliza roles estándar", () => {
    expect(normalizeAppRole("Director")).toBe("director");
    expect(normalizeAppRole("teacher")).toBe("teacher");
    expect(normalizeAppRole("  parent  ")).toBe("parent");
  });
});

describe("role helpers", () => {
  it("identifica roles correctamente", () => {
    expect(isSuperAdminRole(roles.superAdmin)).toBe(true);
    expect(isDirectorRole(roles.director)).toBe(true);
    expect(isTeacherRole(roles.teacher)).toBe(true);
    expect(isParentRole(roles.parent)).toBe(true);
    expect(isSuperAdminRole(roles.parent)).toBe(false);
  });
});
