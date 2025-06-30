import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import UserCard from "@/components/Profile/UserCard";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function generateStaticParams() {
    const users = await db.user.findMany({
        select: { username: true },
        take: 100,
    });

    return users.flatMap((user) => [
        { lang: "es", username: user.username },
        { lang: "en", username: user.username },
    ]);
}

export default async function UserProfilePage({
    params,
}: {
    params: { username: string; lang: string };
}) {
    const session = await getServerSession(authOptions);
    if (!session) {
        const h = headers();
        const referer = h.get("referer") || "";
        const lang = referer.match(/\/(es|en)(\/|$)/)?.[1] || "en";
        redirect(`/${lang}/auth/login`);
    }

    const profileUser = await db.user.findUnique({
        where: { username: params.username },
    });

    if (!profileUser) return notFound();

    const isOwner = session.user.id === profileUser.id;

    return (
        <UserCard
            session={session}
            isOwner={isOwner}
            profileUser={profileUser}
        />
    );
}
