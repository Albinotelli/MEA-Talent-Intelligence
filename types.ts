
export interface Article {
  id: string;
  title: string;
  source: string;
  url: string;
  date: string;
  snippet: string;
  category: 'Talent Trend' | 'Layoffs' | 'C-Suite' | 'Acquisition' | 'Labor Law';
}

export interface NewsletterArticle {
  title: string;
  url: string;
  source: string;
  synopsis: string;
  strategicInsights: string;
}

export interface Newsletter {
  title: string;
  intro: string;
  sections: {
    heading: string;
    content: string;
    articles: NewsletterArticle[];
  }[];
  conclusion: string;
  generatedDate: string;
}

export enum AppState {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  CURATING = 'CURATING',
  GENERATING = 'GENERATING',
  PUBLISHING = 'PUBLISHING',
  PUBLISHED = 'PUBLISHED'
}
