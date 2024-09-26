"use client";
// https://github.com/pacocoursey/next-themes/issues/169#issuecomment-1539498884
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <ThemeProvider attribute="class" enableSystem={true}>
      {children}
    </ThemeProvider>
  );
}

export default CustomThemeProvider;
