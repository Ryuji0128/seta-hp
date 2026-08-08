export type NewsContents = string | { text: string };

export function getNewsText(contents: NewsContents | null | undefined): string {
  return typeof contents === "string" ? contents : contents?.text ?? "";
}

export interface News {
  id: number;
  date: string;
  title: string;
  contents: NewsContents;
  url: string | null;
}
