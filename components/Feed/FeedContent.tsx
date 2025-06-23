"use client";

import FeedPost from "./FeedPost";

export default function Feed() {
    const posts = [
        {
            id: 1,
            user: {
                name: "Jack robo",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                postedAt: "15 min ago",
            },
            image: "https://images.unsplash.com/photo-1549924231-f129b911e442?q=80&w=900",
            likes: 31,
            likedBy: [
                "https://randomuser.me/api/portraits/men/10.jpg",
                "https://randomuser.me/api/portraits/women/11.jpg",
                "https://randomuser.me/api/portraits/men/12.jpg",
            ],
            description:
                "if you’ve ever grabbed a pack of retrosupply retrosupply brushes and wished you had a course...",
            username: "retroholi",
        },
        {
            id: 2,
            user: {
                name: "Emily Rose",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                postedAt: "30 min ago",
            },
            image: "https://images.unsplash.com/photo-1533106418989-88406c7cc8e2?q=80&w=900",
            likes: 12,
            likedBy: [
                "https://randomuser.me/api/portraits/men/15.jpg",
                "https://randomuser.me/api/portraits/women/16.jpg",
                "https://randomuser.me/api/portraits/men/17.jpg",
            ],
            description: "A perfect sunset on the coast. #nature #sunset",
            username: "emilyr",
        },
    ];

    return (
        <div className="w-full max-w-xl space-y-6 px-4">
            {posts.map((post) => (
                <FeedPost key={post.id} post={post} />
            ))}
        </div>
    );
}
