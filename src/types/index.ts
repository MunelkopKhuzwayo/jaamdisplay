export interface Post {
  id: number;
  idx: number;
  slug: string;
  title: string;
  html: string;
  summary: string | null;
  tags: string[];
  status: string;
  published_at: string;
  updated_at: string;
  type: string;
  readtime: string;
  author: string;
  authorimage: string | null;
}
