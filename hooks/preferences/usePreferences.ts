import { useEffect, useState } from "react";

export function usePreferences() {
  const [preferences, setPreferences] = useState<null | {
    priceRangeMin: number;
    priceRangeMax: number;
    categories: string[];
  }>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await fetch("/api/preferences");
        const data = await res.json();
        setPreferences(data.preferences ? data : null);
      } catch {
        setPreferences(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  return { preferences, loading };
}
