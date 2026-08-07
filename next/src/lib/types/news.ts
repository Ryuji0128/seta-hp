export interface News {
  id: number;
  createdAt: string;
  updatedAt: string;
  date: string;
  title: string;
  contents: { text: string };
  url: string | null;
}
