import { describe, expect, it } from "vitest";
import { getManagementPermissions } from "@/lib/management-permissions";

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
