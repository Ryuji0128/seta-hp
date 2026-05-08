"use client";

import ViewInArIcon from "@mui/icons-material/ViewInAr";
import PrintIcon from "@mui/icons-material/Print";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import BuildIcon from "@mui/icons-material/Build";
import ServiceCardGrid from "./ServiceCardGrid";

const services = [
  {
    icon: <ViewInArIcon sx={{ fontSize: 48 }} />,
    title: "3Dモデリング",
    description: "CADを使った3Dデータの作成。設計から形状検討までサポートします。",
  },
  {
    icon: <PrintIcon sx={{ fontSize: 48 }} />,
    title: "3Dプリント出力",
    description: "FDM・SLA等の3Dプリンタで、データを実際のカタチにします。",
  },
  {
    icon: <ContentCutIcon sx={{ fontSize: 48 }} />,
    title: "レーザーカット",
    description: "アクリル、木材などの素材をレーザー加工機で精密にカットします。",
  },
  {
    icon: <BuildIcon sx={{ fontSize: 48 }} />,
    title: "モックアップ作成",
    description: "試作品・プロトタイプの制作。アイデアを素早くカタチにします。",
  },
];

const FabricationSection = () => {
  return (
    <ServiceCardGrid
      title="3Dモデル＆試作"
      subtitle="3Dデータからカタチにするものづくり"
      services={services}
      bgColor="primary.main"
      textColor="white"
      cardBgColor="rgba(255,255,255,0.95)"
      hoverShadow="0 12px 40px rgba(0,0,0,0.2)"
    />
  );
};

export default FabricationSection;
