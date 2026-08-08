import { describe, expect, it } from "vitest";
import {
  REVIEW_MAX_CONTENT,
  REVIEW_MAX_NAME,
  REVIEW_MAX_PAGE_URL,
} from "@/lib/review-constants";
import {
  ReviewCommentCreateSchema,
  ReviewReplyCreateSchema,
  ReviewStatusUpdateSchema,
} from "@/lib/review-validation";

describe("Review入力スキーマ", () => {
  it("コメント文字列をサニタイズし、共有上限へ丸める", () => {
    const result = ReviewCommentCreateSchema.safeParse({
      pageUrl: "/products/<script>alert(1)</script>" + "x".repeat(600),
      authorName: "<script>alert(1)</script>" + "名".repeat(100),
      content: "<script>alert(1)</script>" + "本".repeat(2100),
      xRatio: 0.5,
      yAbsolute: 120,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.pageUrl).not.toContain("<script>");
      expect(result.data.authorName).not.toContain("<script>");
      expect(result.data.content).not.toContain("<script>");
      expect(result.data.pageUrl.length).toBeLessThanOrEqual(REVIEW_MAX_PAGE_URL);
      expect(result.data.authorName.length).toBeLessThanOrEqual(REVIEW_MAX_NAME);
      expect(result.data.content.length).toBeLessThanOrEqual(REVIEW_MAX_CONTENT);
    }
  });

  it("範囲外または文字列の座標を拒否する", () => {
    expect(
      ReviewCommentCreateSchema.safeParse({
        pageUrl: "/",
        authorName: "担当者",
        content: "確認",
        xRatio: 1.1,
        yAbsolute: 0,
      }).success
    ).toBe(false);
    expect(
      ReviewCommentCreateSchema.safeParse({
        pageUrl: "/",
        authorName: "担当者",
        content: "確認",
        xRatio: "0.5",
        yAbsolute: 0,
      }).success
    ).toBe(false);
  });

  it("statusはopenとresolvedだけを許可する", () => {
    expect(ReviewStatusUpdateSchema.safeParse({ status: "open" }).success).toBe(true);
    expect(ReviewStatusUpdateSchema.safeParse({ status: "resolved" }).success).toBe(true);
    expect(ReviewStatusUpdateSchema.safeParse({ status: "invalid" }).success).toBe(false);
    expect(ReviewStatusUpdateSchema.safeParse({}).success).toBe(false);
  });

  it("空の返信を拒否する", () => {
    expect(
      ReviewReplyCreateSchema.safeParse({ authorName: "担当者", content: "" }).success
    ).toBe(false);
  });
});
