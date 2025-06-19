export interface Post {
  lang: "es" | "en";
  slug: string;
  title: string;
  description: string;
  content: string;
  thumbnail: string;
  createdAt: string;
  amazonLink: string;
}