// frontend/src/contexts/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

/**
 * key usado no localStorage
 */
const STORAGE_KEY = "livraria_theme";

/**
 * Detecta preferência do sistema
 */
const getSystemPreference = () => {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch (e) {}
    return getSystemPreference();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
    // adiciona uma classe no root (<html>) para permitir estilização por tema
    const root = document.documentElement;
    root.classList.remove("theme-light", "theme-dark");
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  // opcional: escuta mudanças na preferência do sistema e atualiza SOMENTE se o usuário não tiver escolhido manualmente
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media || !media.addEventListener) return;
    const handler = e => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored !== "light" && stored !== "dark") {
          setTheme(e.matches ? "dark" : "light");
        }
      } catch (err) {}
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const toggleTheme = () => setTheme(prev => (prev === "dark" ? "light" : "dark"));
  const setLight = () => setTheme("light");
  const setDark = () => setTheme("dark");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setLight, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
