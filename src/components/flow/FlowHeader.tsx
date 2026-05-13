"use client";

import { ArrowLeft, Home } from "lucide-react";
import { ThemeToggle } from "@/components/ui/curtain-theme-toggle";
import Image from "next/image";

interface FlowHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  onBack?: () => void;
  onHome?: () => void;
  showHome?: boolean;
}

export default function FlowHeader({
  title,
  subtitle,
  backHref,
  onBack,
  onHome,
  showHome = true,
}: FlowHeaderProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      window.location.href = backHref;
    }
  };

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-blue-100 dark:border-zinc-800/50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3 min-w-0">
          {(backHref || onBack) && (
            <button
              onClick={handleBack}
              className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              aria-label="Volver"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-zinc-900 dark:text-white truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a href="/" className="hidden sm:flex items-center gap-1.5 mr-1">
            <Image src="/logo_sgf.webp" alt="Sisprot Global Fiber" width={22} height={22} className="rounded" />
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-500">SGF</span>
          </a>
          <ThemeToggle variant="icon" defaultTheme="light" duration={550} />
          {showHome && (
            <button
              onClick={handleHome}
              className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors"
              aria-label="Inicio"
            >
              <Home size={18} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
