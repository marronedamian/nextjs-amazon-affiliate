import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Content from "@/components/Profile/Content";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/auth/login");

    return <Content session={session} />;
}
