"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function usePosts(categoryQuery?: string) {
  const [posts, setPosts] = useState<any[]>([]);
  const [newCount, setNewCount] = useState(0);
  const latestCreatedAtRef = useRef<Date | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const fetchPosts = async () => {
    const url = categoryQuery
      ? `/api/posts?category=${encodeURIComponent(categoryQuery)}`
      : `/api/posts`;

    const res = await fetch(url);
    const data = await res.json();
    setPosts(data);

    if (data.length > 0) {
      latestCreatedAtRef.current = new Date(data[0].createdAt);
    }
  };

  useEffect(() => {
    fetchPosts();

    socketRef.current = io({ path: "/api/socket" });

    socketRef.current.on("post:new", (newPost) => {
      if (
        latestCreatedAtRef.current &&
        new Date(newPost.createdAt) > latestCreatedAtRef.current
      ) {
        setNewCount((prev) => prev + 1);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [categoryQuery]);

  const showNewPosts = async () => {
    await fetchPosts();
    setNewCount(0);
  };

  return { posts, newCount, showNewPosts };
}
