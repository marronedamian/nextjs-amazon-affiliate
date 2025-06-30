import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function useFollow(targetUserId: string, onToggle?: () => void) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (!currentUserId || currentUserId === targetUserId) return;
      try {
        const res = await fetch(`/api/follows/${targetUserId}`);
        const data = await res.json();
        setIsFollowing(data.isFollowing);
      } catch (err) {
        console.error("Error fetching follow status", err);
      }
    };

    fetchFollowStatus();
  }, [targetUserId, currentUserId]);

  const toggleFollow = async () => {
    if (!currentUserId || currentUserId === targetUserId) return;

    try {
      setIsLoading(true);
      const action = isFollowing ? "unfollow" : "follow";
      await fetch("/api/follows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: targetUserId, action }),
      });

      setIsFollowing(!isFollowing);
      onToggle?.();
    } catch (err) {
      console.error("Error toggling follow", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { isFollowing, toggleFollow, isLoading };
}
