"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? (resolvedTheme || theme) : "dark";
  const isDark = currentTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
    >
      <Sun className={cn("h-5 w-5 transition-all text-amber-500", isDark ? "rotate-90 scale-0" : "rotate-0 scale-100")} />
      <Moon className={cn("absolute h-5 w-5 transition-all text-slate-200", isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0")} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
