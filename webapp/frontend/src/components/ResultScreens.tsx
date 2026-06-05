import { AlertCircle, CheckCircle2, RotateCcw, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

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

interface DiseaseProps {
  disease: string;
  time: number;
  image: string;
  onRestart: () => void;
}

export function DiseaseResultScreen({ disease, time, image, onRestart }: DiseaseProps) {
  const healthy = /sano|healthy/i.test(disease);
  return (
    <div className="flex flex-col items-center text-center gap-6 py-4">
      <div className="relative w-44 h-44 rounded-3xl overflow-hidden shadow-glow ring-4 ring-primary/20">
        <img src={image} alt="Hoja de café analizada" className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col items-center gap-2">
        {healthy ? (
          <CheckCircle2 className="h-10 w-10 text-primary" />
        ) : (
          <Sparkles className="h-10 w-10 text-primary" />
        )}
        <p className="text-sm uppercase tracking-wider text-muted-foreground">Resultado</p>
        <h2 className="text-3xl font-bold leading-tight">{disease}</h2>
      </div>

      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm">
        <Clock className="h-4 w-4" />
        Clasificado en {time}s
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
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
