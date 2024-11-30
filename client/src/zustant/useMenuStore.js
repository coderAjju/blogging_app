import {create} from 'zustand';

const useMenuStore = create((set) => ({
    menuOpen: false,
    openMenu: () => set({menuOpen: true}),
    closeMenu: () => set({menuOpen: false}),
}))

export default useMenuStore;