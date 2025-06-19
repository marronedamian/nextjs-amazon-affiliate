export default function ArticleContent({ html }: { html: string }) {
  return (
    <article
      className="prose prose-lg prose-invert max-w-none leading-relaxed text-gray-300 space-y-6"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}