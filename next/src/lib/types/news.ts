export interface News {
  id: number;
  date: string;
  title: string;
  contents: { text: string };
  url: string | null;
}
