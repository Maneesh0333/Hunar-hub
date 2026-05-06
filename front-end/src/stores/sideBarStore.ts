import { create } from "zustand";

interface SideBar {
  open: boolean;
  setOpen: () => void;
  init: (value: boolean)=> void
}

export const useSideBar = create<SideBar>((set) => ({
  open: false,

  setOpen: () => set((state) => ({ open: !state.open })),
  init: (value) => {
    set({ open: value });
  },
}));
