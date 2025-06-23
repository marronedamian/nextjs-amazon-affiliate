import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserCard from "@/components/Profile/UserCard";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/auth/login");

    return <UserCard session={session} />;
}
