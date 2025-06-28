"use client";

import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginForm from "@/components/Profile/LoginForm";

export default function LoginPage() {
    const { t } = useTranslation("common");
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    const callbackUrl = searchParams?.get("callbackUrl") || "/";

    useEffect(() => {
        if (status === "authenticated") {
            router.replace(callbackUrl);
        }
    }, [status, router, callbackUrl]);

    if (status === "loading") return null;

    return <LoginForm t={t} callbackUrl={callbackUrl} />;
}
