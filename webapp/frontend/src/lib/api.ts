// API client for coffee leaf disease detection.
// Set VITE_API_URL in env to point to your backend. Falls back to mock responses.

export interface ValidateResponse {
  coffee_leaf: boolean;
  reason?: string;
}

export interface Detection {
  disease: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x1, y1, x2, y2] in pixels
}

export interface ClassifyResponse {
  detections: Detection[];
  classification_time: number;
}

const API_URL = import.meta.env.VITE_API_URL as string | undefined;

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

const MOCK_DISEASES = ["healthy", "miner", "phoma", "rust"];

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function validateCoffeeLeaf(imageBase64: string): Promise<ValidateResponse> {
  if (API_URL) return postJSON<ValidateResponse>("/validate", { image: imageBase64 });
  await delay(900);
  const ok = Math.random() < 0.8;
  return ok
    ? { coffee_leaf: true }
    : { coffee_leaf: false, reason: "No se detectó una hoja de café en la imagen." };
}

export interface InterpretResponse {
  summary: string;
  actions: string[];
  professional_note: string;
}

export async function interpretDetections(detections: Detection[]): Promise<InterpretResponse> {
  if (API_URL) return postJSON<InterpretResponse>("/interpret", { detections });
  await delay(1800);
  if (detections.length === 0) {
    return {
      summary: "No se detectaron enfermedades en la hoja analizada. El cultivo parece estar en buen estado fitosanitario.",
      actions: [
        "Mantener el programa de riego y fertilización actual.",
        "Realizar monitoreo visual semanal de nuevas hojas.",
        "Mantener buenas prácticas de higiene en el cultivo para prevenir infecciones futuras.",
      ],
      professional_note: "Aunque no se detectaron enfermedades, se recomienda una revisión periódica con un agrónomo certificado para mantener la salud del cultivo a largo plazo.",
    };
  }
  const diseases = [...new Set(detections.map((d) => d.disease))].join(", ");
  return {
    summary: `Se detectó presencia de ${diseases} en la hoja analizada. Esto indica un problema fitosanitario activo que requiere atención para evitar su propagación al resto del cultivo.`,
    actions: [
      "Aislar las plantas afectadas para evitar la propagación a plantas cercanas.",
      "Revisar las plantas circundantes en un radio de 5 metros para detectar síntomas similares.",
      "Aplicar el tratamiento fungicida o pesticida específico para la enfermedad detectada.",
      "Retirar y destruir (no compostar) las hojas más afectadas.",
      "Registrar la fecha, ubicación e incidencia para seguimiento del avance.",
    ],
    professional_note: "Se recomienda confirmar el diagnóstico y el plan de tratamiento con un agrónomo o técnico agrícola certificado antes de aplicar cualquier producto químico.",
  };
}

export async function classifyDisease(imageBase64: string): Promise<ClassifyResponse> {
  if (API_URL) return postJSON<ClassifyResponse>("/classify", { image: imageBase64 });
  await delay(1400);
  const disease = MOCK_DISEASES[Math.floor(Math.random() * MOCK_DISEASES.length)];
  if (disease === "healthy") {
    return { detections: [], classification_time: parseFloat((1 + Math.random() * 9).toFixed(1)) };
  }
  return {
    detections: [{ disease, confidence: parseFloat((0.7 + Math.random() * 0.25).toFixed(3)), bbox: [50, 50, 400, 400] }],
    classification_time: parseFloat((1 + Math.random() * 9).toFixed(1)),
  };
}
