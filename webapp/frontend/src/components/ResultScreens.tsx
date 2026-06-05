import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, RotateCcw, Sparkles, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { interpretDetections } from "@/lib/api";
import type { Detection, InterpretResponse } from "@/lib/api";

// ── NotCoffeeLeafScreen ───────────────────────────────────────────────────────

interface NotCoffeeLeafProps {
  reason?: string;
  image: string;
  onRetry: () => void;
}

export function NotCoffeeLeafScreen({ reason, image, onRetry }: NotCoffeeLeafProps) {
  return (
    <div className="flex flex-col items-center text-center gap-6 py-6">
      <div className="relative w-40 h-40 rounded-3xl overflow-hidden shadow-soft">
        <img src={image} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-destructive/30 mix-blend-multiply" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <h2 className="text-2xl font-bold">Esto no parece una hoja de café</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          {reason ?? "No detectamos una hoja de café en la imagen. Intenta con otra foto."}
        </p>
      </div>
      <Button variant="hero" size="lg" onClick={onRetry} className="rounded-full">
        <RotateCcw className="h-5 w-5 mr-2" /> Tomar otra foto
      </Button>
    </div>
  );
}

// ── ImageWithBoxes ────────────────────────────────────────────────────────────

const DISEASE_COLORS: Record<string, string> = {
  healthy: "#22c55e",
  miner:   "#f59e0b",
  phoma:   "#8b5cf6",
  rust:    "#ef4444",
};

function ImageWithBoxes({ src, detections }: { src: string; detections: Detection[] }) {
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-glow ring-4 ring-primary/20">
      <img
        src={src}
        alt="Hoja de café analizada"
        className="w-full h-auto block"
        onLoad={(e) => {
          const img = e.currentTarget;
          setDims({ w: img.naturalWidth, h: img.naturalHeight });
        }}
      />
      {dims &&
        detections.map((d, i) => {
          const [x1, y1, x2, y2] = d.bbox;
          const color = DISEASE_COLORS[d.disease] ?? "#6b7280";
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left:   `${(x1 / dims.w) * 100}%`,
                top:    `${(y1 / dims.h) * 100}%`,
                width:  `${((x2 - x1) / dims.w) * 100}%`,
                height: `${((y2 - y1) / dims.h) * 100}%`,
                border: `2px solid ${color}`,
                boxSizing: "border-box",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  bottom: "100%",
                  left: 0,
                  background: color,
                  color: "white",
                  fontSize: 10,
                  fontWeight: 600,
                  padding: "1px 5px",
                  borderRadius: "3px 3px 0 0",
                  whiteSpace: "nowrap",
                  lineHeight: "18px",
                }}
              >
                {d.disease} {(d.confidence * 100).toFixed(0)}%
              </span>
            </div>
          );
        })}
    </div>
  );
}

// ── InterpretationSection ─────────────────────────────────────────────────────

function InterpretationSection({ detections }: { detections: Detection[] }) {
  const [data, setData] = useState<InterpretResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interpretDetections(detections)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full space-y-4 text-left rounded-2xl bg-card border border-border/60 p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
        <h3 className="font-semibold text-sm">¿Esto qué significa?</h3>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-1">
          <span className="text-sm text-muted-foreground">Pensando</span>
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </span>
        </div>
      ) : data ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{data.summary}</p>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
              Acciones recomendadas
            </p>
            <ul className="space-y-2">
              {data.actions.map((action, i) => (
                <li key={i} className="flex gap-2.5 text-sm items-start">
                  <span className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-foreground/80">{action}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">{data.professional_note}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ── DiseaseResultScreen ───────────────────────────────────────────────────────

interface DiseaseProps {
  detections: Detection[];
  time: number;
  image: string;
  onRestart: () => void;
}

export function DiseaseResultScreen({ detections, time, image, onRestart }: DiseaseProps) {
  const healthy = detections.length === 0;
  const primary = healthy
    ? null
    : detections.reduce((a, b) => (a.confidence > b.confidence ? a : b));
  const displayName = primary ? primary.disease : "Sana";

  return (
    <div className="flex flex-col gap-6 py-4 w-full">
      <ImageWithBoxes src={image} detections={detections} />

      <div className="flex flex-col items-center text-center gap-2">
        {healthy ? (
          <CheckCircle2 className="h-10 w-10 text-primary" />
        ) : (
          <Sparkles className="h-10 w-10 text-primary" />
        )}
        <p className="text-sm uppercase tracking-wider text-muted-foreground">Resultado</p>
        <h2 className="text-3xl font-bold leading-tight capitalize">{displayName}</h2>
        {primary && (
          <p className="text-sm text-muted-foreground">
            Confianza: {(primary.confidence * 100).toFixed(1)}%
          </p>
        )}
      </div>

      {detections.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {detections.map((d, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
            >
              <span className="capitalize">{d.disease}</span>
              <span className="text-muted-foreground">{(d.confidence * 100).toFixed(0)}%</span>
            </span>
          ))}
        </div>
      )}

      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm self-center">
        <Clock className="h-4 w-4" />
        Analizado en {time}s
      </div>

      <InterpretationSection detections={detections} />

      <div className="flex flex-col gap-3 w-full">
        <Button variant="hero" size="lg" onClick={onRestart} className="rounded-full">
          Analizar otra hoja
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full">
          <Link to="/history">Ver historial</Link>
        </Button>
      </div>
    </div>
  );
}
