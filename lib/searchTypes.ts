export type SearchResultType =
  | "page"
  | "blog"
  | "showcase"
  | "interior"
  | "product"
  | "catalogue"
  | "team"
  | "faq";

export type SearchHit = {
  type: SearchResultType;
  id: string;
  title: string;
  snippet: string;
  href: string;
  meta?: string;
};

export type SearchApiResponse = {
  query: string;
  locale: string;
  results: SearchHit[];
  tookMs?: number;
};

export type StaticSearchPage = {
  title: string;
  href: string;
  description: string;
};

export type GroupedSearchResults = {
  pages: SearchHit[];
  content: SearchHit[];
};
