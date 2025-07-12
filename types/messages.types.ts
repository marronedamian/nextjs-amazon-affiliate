export type ChatItem = {
  conversationId: string;
  participant: {
    id: number;
    name: string;
    image: string;
  } | null;
  lastMessage: {
    content: string;
    createdAt: string;
  } | null;
};

export interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  senderImage?: string;
}
