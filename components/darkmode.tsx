"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

function DarkToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    setIsDark(theme === "dark");
  }, [theme]);

  if (!mounted) {
    return null;
  }

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center focus:outline-none"
    >
      {isDark ? (
        <div className="mr-2 text-2xl text-yellow-400">
          <Moon />
        </div>
      ) : (
        <div className="mr-2 text-2xl text-gray-700">
          <span className="text-yellow-400">
            <Sun />
          </span>
        </div>
      )}
    </button>
  );
}

export default DarkToggle;
