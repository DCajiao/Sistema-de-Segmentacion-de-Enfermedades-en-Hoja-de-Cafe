import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Trash2, Clock, Leaf } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { clearHistory, deleteRecord, getHistory, type HistoryRecord } from "@/lib/history";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
  head: () => ({
    meta: [
      { title: "Historial — AvoScan" },
      { name: "description", content: "Revisa tus análisis de aguacate anteriores." },
    ],
  }),
});

function HistoryPage() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    setRecords(getHistory());
  }, []);

  const handleDelete = (id: string) => {
    deleteRecord(id);
    setRecords(getHistory());
  };

  const handleClear = () => {
    clearHistory();
    setRecords([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[image:var(--gradient-soft)]">
      <AppHeader />
      <main className="flex-1 px-5 pb-10 max-w-md w-full mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Volver
          </Link>
          {records.length > 0 && (
            <button
              onClick={handleClear}
              className="text-xs text-destructive hover:underline"
            >
              Borrar todo
            </button>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-1">Historial</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {records.length} análisis guardado{records.length === 1 ? "" : "s"}
        </p>

        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
            <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center">
              <Leaf className="h-7 w-7 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              Aún no tienes análisis. Cuando clasifiques un aguacate, aparecerá aquí.
            </p>
            <Button asChild variant="hero" className="rounded-full">
              <Link to="/">Hacer mi primer análisis</Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {records.map((r) => (
              <li
                key={r.id}
                className="flex gap-3 items-center p-3 rounded-2xl bg-card border border-border/60 shadow-sm"
              >
                <img
                  src={r.image}
                  alt={r.disease}
                  className="h-16 w-16 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{r.disease}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    {r.classification_time}s · {formatDate(r.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="h-9 w-9 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex items-center justify-center"
                  aria-label="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
