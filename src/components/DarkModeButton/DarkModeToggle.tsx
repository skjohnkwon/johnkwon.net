import React, { useEffect, useState } from "react";

const DarkModeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedTheme = window.localStorage.getItem("theme");
      if (storedTheme) {
        return storedTheme === "dark";
      } else {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      window.localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      window.localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      aria-label={darkMode ? "switch to light mode" : "switch to dark mode"}
      className="generic-hover leading-none active:scale-90 transition-transform"
    >
      {darkMode ? "☀" : "☾"}
    </button>
  );
};

export default DarkModeToggle;
