"use client";

import { Bell, Search, MessageSquare, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  sidebarCollapsed: boolean;
}

export function TopBar({ sidebarCollapsed }: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 bg-[hsl(var(--surface))]/80 backdrop-blur-[20px] border-b border-[hsl(var(--border-precision))] flex items-center justify-between px-4 md:px-6 transition-all duration-300",
        sidebarCollapsed ? "left-[68px]" : "left-[280px]"
      )}
    >
      {/* Search */}
      <div className="relative max-w-md w-full hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
        <Input
          placeholder="Pesquisar..."
          className="pl-9 h-9 bg-[hsl(var(--input))]/50 border-[hsl(var(--border-precision))]"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Theme toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        )}

        <Button variant="ghost" size="icon-sm">
          <MessageSquare className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="icon-sm" className="relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[hsl(var(--error))]" />
        </Button>

        <Button variant="ghost" size="sm" className="gap-2 px-2">
          <Avatar className="w-7 h-7">
            <AvatarImage src="" />
            <AvatarFallback>CV</AvatarFallback>
          </Avatar>
          <span className="text-body-sm hidden md:inline text-[hsl(var(--on-surface))]">
            Cristiano
          </span>
        </Button>
      </div>
    </header>
  );
}
