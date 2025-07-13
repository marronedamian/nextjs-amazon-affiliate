import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import { marked } from "marked";

const window = new JSDOM("").window;
const purify = DOMPurify(window as any);

export function formatMarkdownToHtml(markdown: string) {
  const rawHtml = marked.parse(markdown) as string;
  return purify.sanitize(rawHtml);
}
