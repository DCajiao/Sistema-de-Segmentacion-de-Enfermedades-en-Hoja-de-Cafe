import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowDown } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/docs")({
  component: DocsPage,
  head: () => ({
    meta: [
      { title: "Arquitectura — Coffee Leaf AI" },
      {
        name: "description",
        content: "Cómo funciona Coffee Leaf AI: pipeline de IA y arquitectura del sistema.",
      },
    ],
  }),
});

const PIPELINE = [
  {
    n: "01",
    title: "Captura de imagen",
    body: "El usuario toma una foto desde la cámara del dispositivo. La imagen se convierte a Base64 y se transmite como JSON — sin almacenamiento en servidor ni multipart.",
    tag: "Frontend · getUserMedia",
  },
  {
    n: "02",
    title: "Pre-filtro con Gemini 2.5 Flash",
    body: "Antes de invocar el modelo de visión, un LLM multimodal verifica que la imagen contenga una hoja de planta. Rechaza fondos, personas y objetos; acepta hojas de cualquier especie y condición.",
    tag: "POST /validate · Gemini",
  },
  {
    n: "03",
    title: "Detección YOLOv8n",
    body: "El modelo YOLOv8n fine-tuned sobre Coffee Leaf v6 (3.993 imágenes, 50 épocas) realiza detección en una sola pasada. Devuelve bounding boxes, clase y confianza para cada lesión detectada por encima de conf=0.30.",
    tag: "POST /classify · YOLOv8n",
  },
  {
    n: "04",
    title: "Interpretación agronómica",
    body: "Un segundo prompt a Gemini 2.5 Flash convierte los resultados técnicos en lenguaje natural: resumen del estado fitosanitario, acciones concretas y recomendación de consulta con un agrónomo.",
    tag: "POST /interpret · Gemini",
  },
  {
    n: "05",
    title: "Resultado con bounding boxes",
    body: "El frontend superpone las cajas de detección sobre la imagen usando coordenadas porcentuales calculadas al cargar (naturalWidth/naturalHeight). El análisis se guarda en localStorage para el historial.",
    tag: "Frontend · localStorage",
  },
];

const LAYERS = [
  {
    emoji: "📱",
    title: "Dispositivo móvil",
    subtitle: "Origen de la imagen",
    tags: ["getUserMedia API", "Base64 JPEG / PNG"],
    connector: "imagen base64",
  },
  {
    emoji: "🖥️",
    title: "Frontend — Render (Node.js SSR)",
    subtitle: "Interfaz web y lógica de presentación",
    tags: ["TanStack Start v1", "React 19", "Tailwind CSS v4", "Vite 7 + Nitro"],
    connector: "HTTP REST (JSON)",
  },
  {
    emoji: "⚙️",
    title: "Backend — Google Cloud Run",
    subtitle: "API REST en contenedor Docker",
    tags: ["Flask 3", "Python 3.13", "UV", "Docker"],
    connector: "llamadas a servicios de IA",
  },
  {
    emoji: "🧠",
    title: "Capa de inteligencia artificial",
    subtitle: "Modelos de IA para validación, detección e interpretación",
    tags: [
      "Gemini 2.5 Flash",
      "YOLOv8n best.pt (6 MB)",
      "Structured Output via Pydantic",
      "conf=0.30 · iou=0.45",
    ],
    connector: null,
  },
];

const METRICS = [
  { label: "Precision", value: "0.938" },
  { label: "Recall", value: "0.961" },
  { label: "mAP@0.5", value: "0.959" },
  { label: "mAP@0.5:0.95", value: "0.710" },
];

const DISEASES = [
  { cls: "healthy", name: "Sana", color: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20" },
  { cls: "miner", name: "Minador", color: "bg-amber-500/15 text-amber-700 border-amber-500/20" },
  { cls: "phoma", name: "Phoma", color: "bg-purple-500/15 text-purple-700 border-purple-500/20" },
  { cls: "rust", name: "Roya", color: "bg-red-500/15 text-red-700 border-red-500/20" },
];

function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[image:var(--gradient-soft)]">
      <AppHeader />
      <main className="flex-1 px-5 pb-14 max-w-lg w-full mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">¿Cómo está construida esta app?</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Arquitectura y pipeline de Coffee Leaf AI
          </p>
        </div>

        {/* Architecture diagram */}
        <section className="mb-10">
          <SectionLabel>Arquitectura del sistema</SectionLabel>
          <div className="flex flex-col items-center w-full">
            {LAYERS.map((layer, i) => (
              <div key={i} className="w-full flex flex-col items-center">
                <ArchCard {...layer} />
                {layer.connector && <ConnectorLine label={layer.connector} />}
              </div>
            ))}
          </div>
        </section>

        {/* Disease classes */}
        <section className="mb-10">
          <SectionLabel>Clases detectables</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {DISEASES.map(({ cls, name, color }) => (
              <div
                key={cls}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border ${color}`}
              >
                <span className="font-mono text-xs font-semibold">{cls}</span>
                <span className="text-xs opacity-70">— {name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Pipeline */}
        <section className="mb-10">
          <SectionLabel>Pipeline de diagnóstico</SectionLabel>
          <ol className="space-y-3">
            {PIPELINE.map((s, i) => (
              <PipelineStep key={i} {...s} last={i === PIPELINE.length - 1} />
            ))}
          </ol>
        </section>

        {/* Metrics */}
        <section>
          <SectionLabel>Métricas del modelo (val set · 50 épocas)</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            {METRICS.map(({ label, value }) => (
              <div
                key={label}
                className="p-4 rounded-2xl border border-border/60 bg-card shadow-sm text-center"
              >
                <p className="text-2xl font-bold tracking-tight text-primary">{value}</p>
                <p className="text-[11px] font-mono text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Dataset: Coffee Leaf v6 — Roboflow · CC BY 4.0
          </p>
        </section>
      </main>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">
      {children}
    </p>
  );
}

function ArchCard({
  emoji,
  title,
  subtitle,
  tags,
}: (typeof LAYERS)[number]) {
  return (
    <div className="w-full p-4 rounded-2xl border border-border/60 bg-card shadow-sm">
      <div className="flex items-start gap-3">
        <span className="text-xl leading-none mt-0.5 shrink-0">{emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-block text-[11px] font-mono px-2 py-0.5 rounded-full bg-secondary/80 text-secondary-foreground border border-border/40"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectorLine({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-0.5">
      <div className="w-px h-3 bg-border/60" />
      <span className="text-[10px] font-mono text-muted-foreground px-2.5 py-0.5 rounded-full border border-border/50 bg-background/80 whitespace-nowrap">
        {label}
      </span>
      <div className="w-px h-3 bg-border/60" />
      <ArrowDown className="h-3 w-3 text-muted-foreground" />
    </div>
  );
}

function PipelineStep({
  n,
  title,
  body,
  tag,
  last,
}: (typeof PIPELINE)[number] & { last: boolean }) {
  return (
    <li className="relative flex gap-3">
      {!last && (
        <div className="absolute left-[17px] top-9 bottom-[-12px] w-px bg-border/50" />
      )}
      <div className="shrink-0 h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
        <span className="text-[11px] font-bold font-mono text-primary">{n}</span>
      </div>
      <div className="flex-1 pb-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p className="font-semibold text-sm">{title}</p>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary/80 text-secondary-foreground border border-border/40">
            {tag}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
      </div>
    </li>
  );
}
