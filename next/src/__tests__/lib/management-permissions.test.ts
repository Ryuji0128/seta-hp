import { describe, expect, it } from "vitest";
import { getManagementPermissions } from "@/lib/management-permissions";
import {
  DEFAULT_USER_ROLE,
  isAdminRole,
  isEditorRole,
  normalizeUserRole,
} from "@/lib/roles";

describe("getManagementPermissions", () => {
  it.each([
    ["ADMIN", { canEdit: true, canDelete: true }],
    ["EDITOR", { canEdit: true, canDelete: false }],
    ["VIEWER", { canEdit: false, canDelete: false }],
    [undefined, { canEdit: false, canDelete: false }],
  ])("%s の権限を返す", (role, expected) => {
    expect(getManagementPermissions(role)).toEqual(expected);
  });
});

describe("role predicates", () => {
  it("ADMIN/EDITORの編集権限とADMIN限定権限を判定する", () => {
    expect(isEditorRole("ADMIN")).toBe(true);
    expect(isEditorRole("EDITOR")).toBe(true);
    expect(isEditorRole("VIEWER")).toBe(false);
    expect(isAdminRole("ADMIN")).toBe(true);
    expect(isAdminRole("EDITOR")).toBe(false);
    expect(normalizeUserRole("ADMIN")).toBe("ADMIN");
    expect(normalizeUserRole("unknown")).toBe(DEFAULT_USER_ROLE);
  });
});
