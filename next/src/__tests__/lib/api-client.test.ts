import { describe, expect, it } from "vitest";
import { isAbortError } from "@/lib/api-client";

describe("isAbortError", () => {
  it("AbortErrorだけを意図的なキャンセルとして扱う", () => {
    const aborted = new Error("aborted");
    aborted.name = "AbortError";

    expect(isAbortError(aborted)).toBe(true);
    expect(isAbortError({ name: "AbortError" })).toBe(true);
    expect(isAbortError(new Error("network error"))).toBe(false);
    expect(isAbortError("AbortError")).toBe(false);
  });
});
