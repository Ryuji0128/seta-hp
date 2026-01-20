
import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import { Box, Typography } from "@mui/material";

const timelineData = [
  { date: "2017年4月", content: "富士通株式会社にて、研究開発職に従事し、大規模システム開発やAI開発に携わる。" },
  { date: "2020年6月", content: "他社員と共に独立し、システム開発事業を創業。業務システムやアプリケーション設計開発に注力する。" },
  { date: "2021年4月", content: "Web系業務システム開発を中心に、複数のプロジェクトを進行。積極的な雇用を行い、クライアントの多様なニーズに応える体制を確立する。" },
  { date: "2023年1月", content: "内製システムの開発・収益化に向けた事業展開を本格化する。" },
  { date: "2023年8月", content: "滋賀県にて「瀬田製作所
」を設立。法人化によりさらなる事業拡大を目指す。" },
  { date: "2024年4月", content: "組織管理業務を代替するサービス「代理ONE」をリリースする。" },
];

export default function DoctorHistory() {
  return (
    <Box>
      <Timeline sx={{ "& .MuiTimelineItem-missingOppositeContent": { "&:before": { display: "none" } }, p: 0, m: 0 }}>
        {timelineData.map((item, index) => {
          const [year, month] = item.date.split("年"); // "2017年4月" を ["2017", "4月"] に分割
          return (
            <TimelineItem key={index} >
              {/* 左側: 年と月 */}
              <TimelineOppositeContent sx={{ flex: 0.1, textAlign: "right", pl: 0 }}>
                <Typography variant="body2" color="textSecondary" minWidth={50}>
                  {year}年
                  <br />
                  {month}
                </Typography>
              </TimelineOppositeContent>

              {/* セパレーター */}
              <TimelineSeparator>
                <TimelineDot color="secondary" />
                {index < timelineData.length - 1 && <TimelineConnector />}
              </TimelineSeparator>

              {/* 右側: 内容 */}
              <TimelineContent>
                <Typography variant="body1">{item.content}</Typography>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </Box>
  );
}