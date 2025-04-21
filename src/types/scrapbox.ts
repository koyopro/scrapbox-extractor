// Scrapboxの型定義

export interface ScrapboxPage {
  id: string;
  title: string;
  created: number;
  updated: number;
  content: string;
  user: {
    id: string;
    name: string;
  };
}

export interface ScrapboxPagesResponse {
  pages: ScrapboxPage[];
}

export interface ExtractedPageData {
  title: string;
  content: string;
  updatedAt: string;
  url: string;
}
