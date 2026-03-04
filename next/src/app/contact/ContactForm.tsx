"use client";

import BaseContainer from "@/components/BaseContainer";
import { validateInquiry } from "@/lib/validation";
import { CheckCircle, Error } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography
} from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReCaptcha } from "next-recaptcha-v3";
import { useSearchParams } from "next/navigation";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  inquiry?: string;
  company?: string;
}

/**
 * ContactFormContent
 * 実際のフォームの中身
 */
export default function ContactForm() {
  const nameRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const inquiryRef = useRef<HTMLTextAreaElement>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<
    "loading" | "success" | "error"
  >("loading");

  const { executeRecaptcha, loaded: recaptchaLoaded } = useReCaptcha();
  const searchParams = useSearchParams();

  // URLパラメータから商品名を取得して自動入力
  useEffect(() => {
    const product = searchParams.get("product");
    if (product && inquiryRef.current) {
      // XSS対策: HTMLエスケープ処理
      const sanitizedProduct = product
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .slice(0, 200); // 長さ制限
      inquiryRef.current.value = `【商品購入のお問い合わせ】\n商品名: ${sanitizedProduct}\n\n`;
    }
  }, [searchParams]);

  // モーダルを閉じる
  const closeModal = () => setIsModalOpen(false);

  // 入力中にエラーをクリア
  const handleChange = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // フォーム送信
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      name: nameRef.current?.value || "",
      company: companyRef.current?.value || "",
      email: emailRef.current?.value || "",
      phone: phoneRef.current?.value || "",
      inquiry: inquiryRef.current?.value || "",
    };

    // 入力チェック
    const validationErrors = validateInquiry(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsModalOpen(true);
    setModalContent("loading");

    try {
      // reCAPTCHA検証
      const token = await executeRecaptcha("contact_form");
      const recaptchaRes = await axios.post("/api/recaptcha", { token, expectedAction: "contact_form" });

      if (!recaptchaRes.data.success) {
        setModalContent("error");
        return;
      }

      const emailRes = await axios.post("/api/email", formData);

      if (emailRes.data.success) {
        setModalContent("success");

        // フォーム初期化
        if (nameRef.current) nameRef.current.value = "";
        if (companyRef.current) companyRef.current.value = "";
        if (emailRef.current) emailRef.current.value = "";
        if (phoneRef.current) phoneRef.current.value = "";
        if (inquiryRef.current) inquiryRef.current.value = "";
      } else {
        setModalContent("error");
      }
    } catch (error) {
      console.error("送信エラー:", error);
      setModalContent("error");
    }
  }, [executeRecaptcha]);

  return (
    <BaseContainer>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 600,
          margin: "auto",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          align="justify"
          paddingY={5}
          sx={{ textAlign: "justify", textJustify: "inter-word" }}
        >
          下記の送信フォームよりお問い合わせ可能です。<br />
          ご質問・ご相談のある方はお気軽にお問い合わせください。<br />
          またネット予約はこちらより２４時間受け付けております。<br />
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginBottom: "20px",
          }}
        >
          <TextField
            inputRef={nameRef}
            label="お名前*"
            name="name"
            error={Boolean(errors.name)}
            helperText={errors.name}
            onChange={() => handleChange("name")}
            fullWidth
          />
          <TextField
            inputRef={emailRef}
            label="メールアドレス*"
            name="email"
            error={Boolean(errors.email)}
            helperText={errors.email}
            onChange={() => handleChange("email")}
            fullWidth
          />
          <TextField
            inputRef={phoneRef}
            label="電話番号"
            name="phone"
            error={Boolean(errors.phone)}
            helperText={errors.phone}
            onChange={() => handleChange("phone")}
            fullWidth
          />
          <TextField
            inputRef={inquiryRef}
            label="お問い合わせ内容*"
            name="inquiry"
            error={Boolean(errors.inquiry)}
            helperText={errors.inquiry}
            onChange={() => handleChange("inquiry")}
            fullWidth
            multiline
            rows={4}
          />
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <Button
            type="submit"
            variant="contained"
            disabled={!recaptchaLoaded}
            sx={{
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              width: "200px",
              "&:hover": { backgroundColor: "primary.dark" },
            }}
          >
            {recaptchaLoaded ? "送信" : "準備中..."}
          </Button>
        </Box>
      </Box>

      {/* モーダル */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
            borderRadius: "10px",
          }}
        >
          {modalContent === "loading" && (
            <>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>お問い合わせ送信中...</Typography>
            </>
          )}
          {modalContent === "success" && (
            <>
              <CheckCircle sx={{ color: "green", fontSize: 50 }} />
              <Typography sx={{ mt: 2 }}>
                送信が完了しました。お問い合わせいただき、ありがとうございます。
              </Typography>
              <Button onClick={closeModal} sx={{ mt: 2 }} variant="contained">
                閉じる
              </Button>
            </>
          )}
          {modalContent === "error" && (
            <>
              <Error sx={{ color: "red", fontSize: 50 }} />
              <Typography sx={{ mt: 2, color: "red" }}>
                送信に失敗しました。ウェブサイト管理者にお問い合わせください。
              </Typography>
              <Button onClick={closeModal} sx={{ mt: 2 }} variant="contained">
                閉じる
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </BaseContainer>
  );
}
