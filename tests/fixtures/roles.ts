import type { MyRolePayload } from "@/lib/myRole";

export const roles = {
  superAdmin: { role: "super_admin", user_id: "u-super" } satisfies MyRolePayload,
  director: { role: "director", user_id: "u-dir", school_id: "s-1" } satisfies MyRolePayload,
  teacher: { role: "teacher", user_id: "u-tea", teacher_id: "t-1" } satisfies MyRolePayload,
  parent: { role: "parent", user_id: "u-par", parent_id: "p-1" } satisfies MyRolePayload,
};
