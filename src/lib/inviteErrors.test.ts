import { describe, expect, it } from "vitest";
import { inviteErrorDescription, inviteErrorTitle } from "./inviteErrors";

describe("inviteErrors", () => {
  it("prioriza message del body", () => {
    expect(inviteErrorDescription({ message: "Mensaje custom" })).toBe("Mensaje custom");
  });

  it("mapea códigos conocidos", () => {
    expect(inviteErrorTitle({ error: "invalid_invite" })).toBe("Enlace no válido");
    expect(inviteErrorDescription({ error: "password_required" })).toContain("contraseña");
    expect(inviteErrorDescription({ error: "email_already_registered" }, "teacher")).toContain("profesor");
  });
});
