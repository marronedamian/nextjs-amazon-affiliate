export function formatTimeAgo(date: string, language: string) {
  const now = new Date();
  const created = new Date(date);
  const diffMs = now.getTime() - created.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMin < 1) return language;
  if (diffMin < 60) return `${diffMin} min`;
  if (diffHrs < 24) return `${diffHrs} h`;
  return `${diffDays} d`;
}
