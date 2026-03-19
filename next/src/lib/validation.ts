import * as z from "zod";

// ValidationError型（後方互換性のため維持）
export interface ValidationError {
  [key: string]: string;
}

// 日本の電話番号パターン（固定電話・携帯電話両対応）
// 例: 03-1234-5678, 090-1234-5678, 0120-123-456, 0761234567
const phoneRegex = /^(0[0-9]{1,4}[-]?[0-9]{1,4}[-]?[0-9]{3,4})?$/;

// 問い合わせフォームのZodスキーマ
export const InquirySchema = z.object({
  name: z
    .string()
    .min(1, { message: "氏名を入力してください。" })
    .max(50, { message: "氏名は50文字以内で入力してください。" }),
  company: z
    .string()
    .max(100, { message: "会社名は100文字以内で入力してください。" })
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .min(1, { message: "メールアドレスを入力してください。" })
    .email({ message: "有効なメールアドレスを入力してください。" }),
  phone: z
    .string()
    .regex(phoneRegex, { message: "有効な電話番号を入力してください。" })
    .optional()
    .or(z.literal("")),
  inquiry: z
    .string()
    .min(1, { message: "お問い合わせ内容を入力してください。" })
    .max(500, { message: "お問い合わせ内容は500文字以内で入力してください。" }),
});

export type InquiryData = z.infer<typeof InquirySchema>;

/**
 * 問い合わせデータのバリデーション（Zod版）
 * @param data バリデーション対象データ
 * @returns ValidationError オブジェクト（エラーがない場合は空オブジェクト）
 */
export const validateInquiry = (data: InquiryData): ValidationError => {
  const result = InquirySchema.safeParse(data);

  if (result.success) {
    return {};
  }

  // Zodエラーを ValidationError 形式に変換
  const errors: ValidationError = {};
  for (const error of result.error.errors) {
    const fieldName = error.path[0];
    if (typeof fieldName === "string" && !errors[fieldName]) {
      errors[fieldName] = error.message;
    }
  }

  return errors;
};

// ユーザー登録フォームのバリデーションスキーマ
export const RegistrationSchema = z.object({
  name: z
    .string()
    .min(1, { message: "氏名を入力してください。" })
    .max(50, { message: "氏名は50文字以内で入力してください。" }),
  email: z
    .string()
    .min(1, { message: "メールアドレスを入力してください。" })
    .email({ message: "有効なメールアドレスを入力してください。" }),
  password: z
    .string()
    .min(8, { message: "パスワードは8文字以上で入力してください。" })
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "パスワードは大文字・小文字・数字をそれぞれ含める必要があります。",
    }),
});

// ログインフォームのバリデーションスキーマ
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "メールアドレスを入力してください。" })
    .email({ message: "有効なメールアドレスを入力してください。" }),
  password: z.string().min(8, { message: "パスワードは8文字以上で入力してください。" }),
})

export type RegistrationData = z.infer<typeof RegistrationSchema>;