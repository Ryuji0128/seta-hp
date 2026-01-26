"use client";

import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link as MuiLink,
} from "@mui/material";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { useEffect, useState } from "react";
import axios from "axios";

interface News {
  id: number;
  date: string;
  title: string;
  contents: { text: string };
  url: string | null;
}

const NewsSection = () => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get<{ news: News[] }>("/api/news");
        // 最新5件のみ表示
        setNewsList(response.data.news.slice(0, 5));
      } catch (error) {
        console.error("お知らせの取得に失敗:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading || newsList.length === 0) {
    return null;
  }

  return (
    <Box sx={{ py: 6, bgcolor: "grey.50" }}>
      <Container maxWidth="md">
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <AnnouncementIcon sx={{ color: "primary.main", mr: 1, fontSize: 28 }} />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1.2rem", md: "1.5rem" },
            }}
          >
            お知らせ
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <List disablePadding>
            {newsList.map((news, index) => (
              <Box key={news.id}>
                {index > 0 && <Divider />}
                <ListItem
                  sx={{
                    py: 2,
                    px: 3,
                    "&:hover": {
                      bgcolor: "grey.50",
                    },
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <ListItemText
                    sx={{ width: "100%" }}
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                          gap: { xs: 0.5, sm: 2 },
                          mb: 1,
                        }}
                      >
                        <Typography
                          component="span"
                          sx={{
                            color: "text.secondary",
                            fontSize: "0.875rem",
                            minWidth: "100px",
                          }}
                        >
                          {dayjs(news.date).format("YYYY.MM.DD")}
                        </Typography>
                        {news.url ? (
                          <MuiLink
                            href={news.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              color: "text.primary",
                              textDecoration: "none",
                              fontWeight: 600,
                              "&:hover": {
                                color: "primary.main",
                                textDecoration: "underline",
                              },
                            }}
                          >
                            {news.title}
                          </MuiLink>
                        ) : (
                          <Typography component="span" sx={{ color: "text.primary", fontWeight: 600 }}>
                            {news.title}
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={
                      news.contents?.text && (
                        <Typography
                          component="span"
                          sx={{
                            color: "text.secondary",
                            fontSize: "0.875rem",
                            display: "block",
                            pl: { xs: 0, sm: "116px" },
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {news.contents.text}
                        </Typography>
                      )
                    }
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        </Box>
      </Container>
    </Box>
  );
};

export default NewsSection;
