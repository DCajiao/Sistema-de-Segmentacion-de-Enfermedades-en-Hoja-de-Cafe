import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Sparkles, ShieldCheck } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { CameraCapture } from "@/components/CameraCapture";
import { LoaderScreen } from "@/components/LoaderScreen";
import { DiseaseResultScreen, NotAvocadoScreen } from "@/components/ResultScreens";
import { Button } from "@/components/ui/button";
import { classifyDisease, validateAvocado } from "@/lib/api";
import { addRecord } from "@/lib/history";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "AvoScan — Diagnóstico de aguacate con cámara" },
      {
        name: "description",
        content:
          "Toma una foto y descubre al instante qué enfermedad tiene tu aguacate. Rápido, simple y desde tu teléfono.",
      },
    ],
  }),
});

type Step =
  | { name: "intro" }
  | { name: "capture" }
  | { name: "validating"; image: string }
  | { name: "not-avocado"; image: string; reason?: string }
  | { name: "classifying"; image: string }
  | { name: "result"; image: string; disease: string; time: number };

function Index() {
  const [step, setStep] = useState<Step>({ name: "intro" });

  const handleCapture = async (image: string) => {
    setStep({ name: "validating", image });
    try {
      const v = await validateAvocado(image);
      if (!v.avocado) {
        setStep({ name: "not-avocado", image, reason: v.reason });
        return;
      }
      setStep({ name: "classifying", image });
      const r = await classifyDisease(image);
      addRecord({
        image,
        disease: r.disease,
        classification_time: r.classification_time,
      });
      setStep({ name: "result", image, disease: r.disease, time: r.classification_time });
    } catch {
      setStep({
        name: "not-avocado",
        image,
        reason: "No pudimos procesar la imagen. Inténtalo de nuevo.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[image:var(--gradient-soft)]">
      <AppHeader />
      <main className="flex-1 px-5 pb-8 max-w-md w-full mx-auto flex flex-col">
        {step.name === "intro" && <Intro onStart={() => setStep({ name: "capture" })} />}

        {step.name === "capture" && (
          <div className="flex-1 flex flex-col">
            <h1 className="text-xl font-bold mb-3">Toma una foto del aguacate</h1>
            <div className="flex-1 min-h-[60vh] flex">
              <CameraCapture
                onCapture={handleCapture}
                onCancel={() => setStep({ name: "intro" })}
              />
            </div>
          </div>
        )}

        {step.name === "validating" && (
          <LoaderScreen
            title="Verificando la imagen…"
            subtitle="Estamos comprobando que sea un aguacate."
          />
        )}

        {step.name === "not-avocado" && (
          <NotAvocadoScreen
            image={step.image}
            reason={step.reason}
            onRetry={() => setStep({ name: "capture" })}
          />
        )}

        {step.name === "classifying" && (
          <LoaderScreen
            title="Analizando enfermedades…"
            subtitle="Esto puede tardar unos segundos."
          />
        )}

        {step.name === "result" && (
          <DiseaseResultScreen
            image={step.image}
            disease={step.disease}
            time={step.time}
            onRestart={() => setStep({ name: "capture" })}
          />
        )}
      </main>
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-8 py-8">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full" />
        <div className="relative h-28 w-28 rounded-3xl bg-gradient-to-br from-primary to-[oklch(0.7_0.18_142)] flex items-center justify-center shadow-glow">
          <Camera className="h-12 w-12 text-primary-foreground" />
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          Diagnostica tu aguacate <br /> en segundos
        </h1>
        <p className="text-muted-foreground text-base max-w-sm">
          Toma una foto con tu cámara y deja que la IA identifique posibles
          enfermedades al instante.
        </p>
      </div>

      <Button variant="hero" size="lg" onClick={onStart} className="rounded-full px-10 h-14 text-base">
        <Camera className="h-5 w-5 mr-2" /> Empezar análisis
      </Button>

      <ul className="grid grid-cols-2 gap-3 w-full max-w-sm pt-4">
        <Feature icon={<Sparkles className="h-4 w-4" />} label="Rápido" />
        <Feature icon={<ShieldCheck className="h-4 w-4" />} label="Privado" />
      </ul>
    </div>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-card border border-border/60 shadow-sm text-sm font-medium">
      <span className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        {icon}
      </span>
      {label}
    </li>
  );
}
