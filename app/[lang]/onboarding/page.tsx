import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Steps from "@/components/Onboarding/Steps";

export default async function OnboardingPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/auth/login");

    return <Steps session={session} />;
}
