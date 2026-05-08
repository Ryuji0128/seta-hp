"use client";

import MemoryIcon from "@mui/icons-material/Memory";
import WebIcon from "@mui/icons-material/Web";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
import ServiceCardGrid from "./ServiceCardGrid";

const services = [
  {
    icon: <MemoryIcon sx={{ fontSize: 48 }} />,
    title: "組み込みマイコン",
    description: "STM32、ESP32、PICなどのマイコンを使ったファームウェア開発を行います。",
  },
  {
    icon: <WebIcon sx={{ fontSize: 48 }} />,
    title: "Webアプリ開発",
    description: "ホームページ、業務システム、ECサイトなど、Webアプリケーションを開発します。",
  },
  {
    icon: <PhoneIphoneIcon sx={{ fontSize: 48 }} />,
    title: "モバイルアプリ",
    description: "iOS・Androidに対応したモバイルアプリケーションを開発します。",
  },
  {
    icon: <DeveloperBoardIcon sx={{ fontSize: 48 }} />,
    title: "電子回路設計",
    description: "基板設計から回路設計まで、電子回路のトータルサポートを行います。",
  },
];

const EngineeringSection = () => {
  return (
    <ServiceCardGrid
      title="ソフト＆ハード開発"
      subtitle="組み込みマイコンからホームページまで、幅広い受託開発"
      services={services}
    />
  );
};

export default EngineeringSection;
