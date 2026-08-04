import * as z from "zod";
import {
  VALID_GALLERY_CATEGORIES,
  VALID_PRODUCT_CATEGORIES,
  VALID_STOCK_OPTIONS,
} from "@/lib/constants/categories";

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
});

// ---------------------------------------------------------------------------
// 商品・制作事例（管理API用）
// POST/PUT で重複していた手続き的バリデーションを Zod に統一（#245）。
// スキーマは検証のみを担い、XSS サニタイズや DB への整形は各ルート側で行う。
// ---------------------------------------------------------------------------

const priceSchema = z.coerce
  .number({ invalid_type_error: "価格は0以上の整数を指定してください" })
  .int({ message: "価格は0以上の整数を指定してください" })
  .min(0, { message: "価格は0以上の整数を指定してください" });

const productCategorySchema = z
  .string({ required_error: "カテゴリは必須です" })
  .refine((v) => (VALID_PRODUCT_CATEGORIES as readonly string[]).includes(v), {
    message: `カテゴリは${VALID_PRODUCT_CATEGORIES.join(", ")}のいずれかを指定してください`,
  });

const stockSchema = z
  .string()
  .refine((v) => !v || (VALID_STOCK_OPTIONS as readonly string[]).includes(v), {
    message: `在庫状況は${VALID_STOCK_OPTIONS.join(", ")}のいずれかを指定してください`,
  });

const purchaseUrlSchema = z
  .string()
  .refine(
    (v) => {
      if (!v) return true;
      try {
        new URL(v);
        return true;
      } catch {
        return false;
      }
    },
    { message: "購入URLは有効なURLを指定してください" }
  );

const idSchema = z
  .number({ required_error: "IDは必須です", invalid_type_error: "IDは必須です" })
  .int({ message: "IDは必須です" })
  .positive({ message: "IDは必須です" });

export const ProductCreateSchema = z.object({
  name: z.string({ required_error: "名前は必須です" }).min(1, { message: "名前は必須です" }),
  description: z.string({ required_error: "説明は必須です" }).min(1, { message: "説明は必須です" }),
  price: priceSchema,
  category: productCategorySchema,
  stock: stockSchema.optional(),
  purchaseUrl: purchaseUrlSchema.optional().nullable(),
});

export const ProductUpdateSchema = ProductCreateSchema.partial().extend({
  id: idSchema,
});

const galleryCategorySchema = z
  .string({ required_error: "カテゴリは必須です" })
  .refine((v) => (VALID_GALLERY_CATEGORIES as readonly string[]).includes(v), {
    message: `カテゴリは${VALID_GALLERY_CATEGORIES.join(", ")}のいずれかを指定してください`,
  });

export const WorkCreateSchema = z.object({
  title: z.string({ required_error: "タイトルは必須です" }).min(1, { message: "タイトルは必須です" }),
  description: z.string({ required_error: "説明は必須です" }).min(1, { message: "説明は必須です" }),
  category: galleryCategorySchema,
});

export const WorkUpdateSchema = WorkCreateSchema.partial().extend({
  id: idSchema,
});