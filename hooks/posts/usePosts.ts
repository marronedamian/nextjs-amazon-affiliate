import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function usePosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newCount, setNewCount] = useState(0);
  const latestCreatedAtRef = useRef<Date | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data);

      if (data.length > 0) {
        latestCreatedAtRef.current = new Date(data[0].createdAt);
      }
    };

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
  }, []);

  const showNewPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
    setNewCount(0);
    if (data.length > 0) {
      latestCreatedAtRef.current = new Date(data[0].createdAt);
    }
  };

  return { posts, newCount, showNewPosts };
}
