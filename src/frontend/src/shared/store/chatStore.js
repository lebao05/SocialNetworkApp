import { create } from "zustand";

const useChatStore = create((set) => ({
  currentChatId: null,
  isPopupOpen: false,
  openChat: (id) => set({ currentChatId: id, isPopupOpen: true }),
  closePopup: () => set({ isPopupOpen: false, currentChatId: null }),
  setCurrentChatId: (id) => set({ currentChatId: id }),
}));

export default useChatStore;
