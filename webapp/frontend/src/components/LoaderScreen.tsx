import { Loader2 } from "lucide-react";

export function LoaderScreen({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
        <Loader2 className="h-14 w-14 text-primary animate-spin relative" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground max-w-xs">{subtitle}</p>}
    </div>
  );
}
