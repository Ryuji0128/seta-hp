"use client";

import { useState, useCallback } from "react";
import { useReCaptcha } from "next-recaptcha-v3";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import PageMainTitle from "@/components/PageMainTitle";
import BaseContainer from "@/components/BaseContainer";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import WebIcon from "@mui/icons-material/Web";
import BuildIcon from "@mui/icons-material/Build";
import DesignServicesIcon from "@mui/icons-material/DesignServices";

type MenuType = "create" | "maintenance" | "mockup";

export default function PaymentContent() {
  const [menuType, setMenuType] = useState<MenuType>("create");
  const [amount, setAmount] = useState<string>("5000");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { executeRecaptcha, loaded: recaptchaLoaded } = useReCaptcha();

  const getFinalAmount = (): number => {
    const parsed = parseInt(amount, 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  const getTitle = (): string => {
    switch (menuType) {
      case "create":
        return "HP新規作成";
      case "maintenance":
        return "HP管理・保守";
      case "mockup":
        return "モックアップ作成";
    }
  };

  const getDescription = (): string => {
    switch (menuType) {
      case "create":
        return "ホームページの新規作成サービスです。1回限りのお支払いです。";
      case "maintenance":
        return "ホームページの管理・保守サービスです。毎月自動で課金されます。いつでもキャンセル可能です。";
      case "mockup":
        return "デザインモックアップ作成サービスです。1回限りのお支払いです。";
    }
  };

  const isSubscription = menuType === "maintenance";

  const handleCheckout = useCallback(async () => {
    const parsed = parseInt(amount, 10);
    const finalAmount = isNaN(parsed) ? 0 : parsed;

    if (finalAmount < 100) {
      setError("100円以上を指定してください");
      return;
    }

    const productName =
      menuType === "create"
        ? "HP新規作成サービス"
        : menuType === "maintenance"
          ? "HP管理・保守サービス"
          : "モックアップ作成サービス";

    setLoading(true);
    setError(null);

    try {
      // reCAPTCHA検証
      const recaptchaToken = await executeRecaptcha("checkout");
      const recaptchaRes = await fetch("/api/recaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: recaptchaToken, expectedAction: "checkout" }),
      });
      const recaptchaData = await recaptchaRes.json();

      if (!recaptchaData.success) {
        setError("reCAPTCHA検証に失敗しました");
        setLoading(false);
        return;
      }

      // Stripe決済
      const endpoint = isSubscription
        ? "/api/checkout/subscription"
        : "/api/checkout/onetime";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount, productName }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "エラーが発生しました");
      }
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }, [executeRecaptcha, isSubscription, amount, menuType]);

  return (
    <Box>
      <BaseContainer>
        <PageMainTitle japanseTitle="提供サービス" englishTitle="Service" />
      </BaseContainer>

      <Container maxWidth="md" sx={{ pb: 10 }}>
        {/* メニュー選択タブ */}
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={menuType}
            onChange={(_, value) => {
              setMenuType(value);
              setError(null);
            }}
            variant="fullWidth"
            sx={{
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Tab
              value="create"
              label="HP新規作成"
              icon={<WebIcon />}
              iconPosition="start"
            />
            <Tab
              value="maintenance"
              label="HP管理・保守"
              icon={<BuildIcon />}
              iconPosition="start"
            />
            <Tab
              value="mockup"
              label="モックアップ作成"
              icon={<DesignServicesIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              {isSubscription ? (
                <AutorenewIcon sx={{ color: "primary.main", mr: 1, fontSize: 28 }} />
              ) : (
                <CreditCardIcon sx={{ color: "primary.main", mr: 1, fontSize: 28 }} />
              )}
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {getTitle()}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {getDescription()}
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                {isSubscription ? "月額料金を入力" : "金額を入力"}
              </Typography>
              <TextField
                fullWidth
                type="number"
                placeholder="金額を入力（100円以上）"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>¥</Typography>,
                  endAdornment: isSubscription ? (
                    <Typography sx={{ ml: 1 }}>/ 月</Typography>
                  ) : null,
                }}
              />
            </Box>

            {/* 確認 */}
            <Box
              sx={{
                bgcolor: "primary.pale",
                borderRadius: 2,
                p: 3,
                mb: 3,
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {isSubscription ? "月額料金" : "お支払い金額"}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
                ¥{getFinalAmount().toLocaleString()}
                {isSubscription && (
                  <Typography component="span" variant="body1" sx={{ ml: 1 }}>
                    / 月
                  </Typography>
                )}
              </Typography>
            </Box>

            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleCheckout}
              disabled={loading || getFinalAmount() < 100 || !recaptchaLoaded}
              sx={{ py: 2, fontSize: "1.1rem" }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : !recaptchaLoaded ? (
                "準備中..."
              ) : (
                `Stripeで${isSubscription ? "申し込む" : "支払う"}`
              )}
            </Button>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: "center" }}>
              決済はStripeの安全なページで行われます
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
