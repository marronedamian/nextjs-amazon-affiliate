"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function useSessionTracker() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return;

    const key = `session-tracked-${session.user.email}`;
    const alreadyTracked = sessionStorage.getItem(key);

    if (alreadyTracked === "true") return;

    sessionStorage.setItem(key, "true"); // evitar múltiples requests

    fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data?.firstTime === true) {
          const locale = pathname?.split("/")[1] || "en";
          router.push(`/${locale}/onboarding`);
        }
      })
      .catch((err) => {
        console.error("❌ Session track failed", err);
        sessionStorage.removeItem(key);
      });
  }, [status, session, router, pathname]);
}
