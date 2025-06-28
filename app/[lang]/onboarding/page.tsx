import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Steps from "@/components/Onboarding/Steps";

export default async function OnboardingPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        const h = headers();
        const referer = h.get("referer") || "";
        const lang = referer.match(/\/(es|en)(\/|$)/)?.[1] || "en";
        redirect(`/${lang}/auth/login`);
    }

    return <Steps session={session} />;
}
