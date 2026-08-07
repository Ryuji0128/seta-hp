import ListingSkeleton from "@/components/ListingSkeleton";

export default function GalleryLoading() {
  return (
    <ListingSkeleton
      titleWidth={180}
      subtitleWidth={260}
      imageAspectRatio="4 / 3"
      lineWidths={["70%", "50%"]}
    />
  );
}
