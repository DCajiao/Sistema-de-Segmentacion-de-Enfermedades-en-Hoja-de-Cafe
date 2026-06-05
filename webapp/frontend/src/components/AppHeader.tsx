import { Link, useRouterState } from "@tanstack/react-router";
import { Leaf, History } from "lucide-react";

export function AppHeader() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="flex items-center justify-between px-5 py-4">
      <Link to="/" className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-[oklch(0.65_0.12_50)] flex items-center justify-center shadow-soft">
          <Leaf className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-tight">Coffee Leaf AI</p>
          <p className="text-[10px] text-muted-foreground">Diagnóstico de hoja de café</p>
        </div>
      </Link>
      {path !== "/history" && (
        <Link
          to="/history"
          className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors px-3 py-2 rounded-full hover:bg-secondary"
        >
          <History className="h-4 w-4" /> Historial
        </Link>
      )}
    </header>
  );
}
