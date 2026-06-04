import { create } from "zustand"

type modalPage = "login" | "signup"

interface ModalState {
    isOpen: boolean;
    modalPage: modalPage;
    openModal: () => void;
    closeModal: () => void;
    setModalPage: (page: modalPage) => void;
}

const useAuthModalStore = create<ModalState>((set) => ({
    isOpen: false,
    modalPage: "login",
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),
    setModalPage: (page: modalPage) => set({ modalPage: page }),
}));

export default useAuthModalStore;
