export interface NotificationData {
  id: string;
  type: { name: string; label: string };
  message: string | null;
  comment: string | null;
  isRead: boolean;
  createdAt: string;
  fromUser: {
    name: string;
    username: string;
    image: string;
  };
  story: {
    id: string;
    previewUrl: string | null;
  } | null;
  post: {
    id: string;
    content: string | null;
    previewUrl: string | null;
  } | null;
}
