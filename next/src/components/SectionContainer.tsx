import { Container, type ContainerProps } from "@mui/material";

/**
 * サイト標準幅（1320px）のセクションコンテナ。
 * `<Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>` の
 * 直書き（20箇所超）を一元化する（#245）。
 */
export default function SectionContainer({ sx, children, ...rest }: ContainerProps) {
  return (
    <Container
      maxWidth="xl"
      sx={[{ maxWidth: "1320px !important" }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...rest}
    >
      {children}
    </Container>
  );
}
