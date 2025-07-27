import {create} from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("User-theme") || "coffee",
    setTheme: (theme) => {
        localStorage.setItem("User-theme",theme);
        set({theme});
    },
}));