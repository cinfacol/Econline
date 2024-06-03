import { create } from "zustand";

const usePreviewModal = create((set) => ({
  isOpen: false,
  data: undefined,
  auth: undefined,
  onOpen: (data, auth) => set({ isOpen: true, data, auth }),
  onClose: () => set({ isOpen: false }),
}));

export default usePreviewModal;
