// API client for coffee leaf disease segmentation.
// Set VITE_API_URL in env to point to your backend. Falls back to mock responses.

export interface ValidateResponse {
  coffee_leaf: boolean;
  reason?: string;
}

export interface DiseaseResponse {
  disease: string;
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

export async function classifyDisease(imageBase64: string): Promise<DiseaseResponse> {
  if (API_URL) return postJSON<DiseaseResponse>("/classify", { image: imageBase64 });
  await delay(1400);
  const disease = MOCK_DISEASES[Math.floor(Math.random() * MOCK_DISEASES.length)];
  return { disease, classification_time: Math.round((1 + Math.random() * 9) * 10) / 10 };
}
