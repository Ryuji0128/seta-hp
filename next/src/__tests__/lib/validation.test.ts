import { describe, it, expect } from "vitest";
import {
  InquirySchema,
  RegistrationSchema,
  LoginSchema,
  validateInquiry,
} from "@/lib/validation";

describe("InquirySchema", () => {
  const validData = {
    name: "山田太郎",
    email: "yamada@example.com",
    inquiry: "テストのお問い合わせ内容です。",
  };

  it("有効なデータでバリデーション成功", () => {
    expect(InquirySchema.safeParse(validData).success).toBe(true);
  });

  it("氏名が空のとき失敗", () => {
    const result = InquirySchema.safeParse({ ...validData, name: "" });
    expect(result.success).toBe(false);
  });

  it("氏名が50文字超で失敗", () => {
    const result = InquirySchema.safeParse({ ...validData, name: "あ".repeat(51) });
    expect(result.success).toBe(false);
  });

  it("メールアドレスが不正な形式で失敗", () => {
    const result = InquirySchema.safeParse({ ...validData, email: "not-email" });
    expect(result.success).toBe(false);
  });

  it("問い合わせ内容が空のとき失敗", () => {
    const result = InquirySchema.safeParse({ ...validData, inquiry: "" });
    expect(result.success).toBe(false);
  });

  it("問い合わせ内容が500文字超で失敗", () => {
    const result = InquirySchema.safeParse({ ...validData, inquiry: "あ".repeat(501) });
    expect(result.success).toBe(false);
  });

  it("電話番号が有効な形式で成功", () => {
    const patterns = ["03-1234-5678", "090-1234-5678", "0120-123-456", "0761234567", ""];
    for (const phone of patterns) {
      const result = InquirySchema.safeParse({ ...validData, phone });
      expect(result.success).toBe(true);
    }
  });

  it("電話番号が無効な形式で失敗", () => {
    const result = InquirySchema.safeParse({ ...validData, phone: "abc-defg" });
    expect(result.success).toBe(false);
  });

});

describe("validateInquiry", () => {
  it("有効なデータで空オブジェクトを返す", () => {
    const errors = validateInquiry({
      name: "山田太郎",
      email: "yamada@example.com",
      inquiry: "テスト",
    });
    expect(errors).toEqual({});
  });

  it("複数フィールドのエラーをまとめて返す", () => {
    const errors = validateInquiry({
      name: "",
      email: "invalid",
      inquiry: "",
    });
    expect(errors).toHaveProperty("name");
    expect(errors).toHaveProperty("email");
    expect(errors).toHaveProperty("inquiry");
  });
});

describe("RegistrationSchema", () => {
  const validData = {
    name: "テストユーザー",
    email: "test@example.com",
    password: "Abc12345",
  };

  it("有効なデータでバリデーション成功", () => {
    expect(RegistrationSchema.safeParse(validData).success).toBe(true);
  });

  it("パスワードが8文字未満で失敗", () => {
    const result = RegistrationSchema.safeParse({ ...validData, password: "Ab1" });
    expect(result.success).toBe(false);
  });

  it("パスワードに大文字がなくて失敗", () => {
    const result = RegistrationSchema.safeParse({ ...validData, password: "abc12345" });
    expect(result.success).toBe(false);
  });

  it("パスワードに小文字がなくて失敗", () => {
    const result = RegistrationSchema.safeParse({ ...validData, password: "ABC12345" });
    expect(result.success).toBe(false);
  });

  it("パスワードに数字がなくて失敗", () => {
    const result = RegistrationSchema.safeParse({ ...validData, password: "Abcdefgh" });
    expect(result.success).toBe(false);
  });
});

describe("LoginSchema", () => {
  it("有効なデータでバリデーション成功", () => {
    const result = LoginSchema.safeParse({ email: "test@example.com", password: "12345678" });
    expect(result.success).toBe(true);
  });

  it("メールアドレスが空で失敗", () => {
    const result = LoginSchema.safeParse({ email: "", password: "12345678" });
    expect(result.success).toBe(false);
  });

  it("パスワードが8文字未満で失敗", () => {
    const result = LoginSchema.safeParse({ email: "test@example.com", password: "1234" });
    expect(result.success).toBe(false);
  });
});
