import ListingSkeleton from "@/components/ListingSkeleton";

export default function ProductsLoading() {
  return (
    <ListingSkeleton
      titleWidth={200}
      subtitleWidth={300}
      imageAspectRatio="1 / 1"
      lineWidths={["60%", "80%", "40%"]}
    />
  );
}
