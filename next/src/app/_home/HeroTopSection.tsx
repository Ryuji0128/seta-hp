"use client";

import { Box } from "@mui/material";
import React from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

const HeroTopSection: React.FC = () => {
  const slides = [
    "/top/image1.jpg",
    "/top/image2.jpg",
    "/top/image3.jpg",
    "/top/image4.jpg",
    "/top/image5.jpg",
    "/top/image6.jpg",
  ];

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 4,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "800px",
          height: "550px",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          speed={800}
          style={{ width: "100%", height: "100%" }}
        >
          {slides.map((image, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  position: "relative",
                  height: "500px",
                  backgroundImage: `url(${image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};

export default HeroTopSection;