import { describe, expect, it } from "vitest";
import { getNewsText } from "@/lib/types/news";

describe("getNewsText", () => {
  it("旧string形式と現行object形式の本文を同じ文字列へ正規化する", () => {
    expect(getNewsText("旧形式の本文")).toBe("旧形式の本文");
    expect(getNewsText({ text: "現行形式の本文" })).toBe("現行形式の本文");
    expect(getNewsText(undefined)).toBe("");
  });
});
