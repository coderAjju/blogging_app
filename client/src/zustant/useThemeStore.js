import {create} from 'zustand'

const useThemeStore = create((set) => ({
    theme:localStorage.getItem("blog-theme") || "light",
    setTheme:(theme) => {
        localStorage.setItem("blog-theme",theme)
        set({theme})
    }
}))

export default useThemeStore;