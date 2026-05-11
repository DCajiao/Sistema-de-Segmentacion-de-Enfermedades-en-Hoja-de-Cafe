import { useEffect, useRef, useState } from "react";
import { Camera, Image as ImageIcon, RefreshCw, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onCapture: (dataUrl: string) => void;
  onCancel?: () => void;
}

export function CameraCapture({ onCapture, onCancel }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const startCamera = async () => {
    setError(null);
    setReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setReady(true);
      }
    } catch (e) {
      setError(
        "No pudimos acceder a la cámara. Revisa los permisos o usa la galería."
      );
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    if (!preview) startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview]);

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const w = video.videoWidth;
    const h = video.videoHeight;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    stopCamera();
    setPreview(dataUrl);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      stopCamera();
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const retake = () => setPreview(null);
  const confirm = () => preview && onCapture(preview);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="relative flex-1 bg-black rounded-3xl overflow-hidden shadow-soft">
        {preview ? (
          <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {!ready && !error && (
              <div className="absolute inset-0 flex items-center justify-center text-white/80 text-sm">
                Iniciando cámara…
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-white text-sm">
                {error}
              </div>
            )}
            {/* viewfinder overlay */}
            <div className="pointer-events-none absolute inset-6 rounded-2xl border-2 border-white/40" />
          </>
        )}

        {onCancel && !preview && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center"
            aria-label="Cancelar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="mt-6 flex items-center justify-around gap-4 pb-2">
        {preview ? (
          <>
            <Button variant="outline" size="lg" onClick={retake} className="rounded-full">
              <RefreshCw className="h-5 w-5 mr-2" /> Reintentar
            </Button>
            <Button variant="hero" size="lg" onClick={confirm} className="rounded-full">
              <Check className="h-5 w-5 mr-2" /> Usar foto
            </Button>
          </>
        ) : (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="h-14 w-14 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shadow-soft"
              aria-label="Elegir de galería"
            >
              <ImageIcon className="h-6 w-6" />
            </button>
            <button
              onClick={takePhoto}
              disabled={!ready}
              className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-[oklch(0.7_0.18_142)] text-primary-foreground flex items-center justify-center shadow-glow ring-4 ring-background disabled:opacity-50"
              aria-label="Tomar foto"
            >
              <Camera className="h-8 w-8" />
            </button>
            <button
              onClick={startCamera}
              className="h-14 w-14 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shadow-soft"
              aria-label="Reiniciar cámara"
            >
              <RefreshCw className="h-6 w-6" />
            </button>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFile}
        />
      </div>
    </div>
  );
}
