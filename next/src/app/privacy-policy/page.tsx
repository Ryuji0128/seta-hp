import React from "react";
import type { Metadata } from "next";
import PrivacyPolicyMainTitle from "./PrivacyPolicyMainTitle";
import PrivacyPolicyDetails from "./PrivacyPolicyDetails";
import { Box } from "@mui/material";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "瀬田製作所のプライバシーポリシー。個人情報の取り扱い、利用目的、第三者提供について説明しています。",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicy() {
  return (
    <>
      <PrivacyPolicyMainTitle />
      <PrivacyPolicyDetails />
      <Box mb={10}></Box>
    </>
  );
}
