import { create } from "zustand";

type ChatState = {
  selectedConversationId: string | null;
  participant: any;
  setConversation: (id: string, participant: any) => void;
  clearConversation: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  selectedConversationId: null,
  participant: null,
  setConversation: (id, participant) =>
    set({ selectedConversationId: id, participant }),
  clearConversation: () =>
    set({ selectedConversationId: null, participant: null }),
}));
