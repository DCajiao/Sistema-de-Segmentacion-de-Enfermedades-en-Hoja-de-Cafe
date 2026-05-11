// API client for avocado classification.
// Set VITE_API_URL in env to point to your backend. Falls back to mock responses.

export interface ValidateResponse {
  avocado: boolean;
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

const MOCK_DISEASES = [
  "Antracnosis",
  "Mancha negra (Cercospora)",
  "Roña del aguacate",
  "Sano",
  "Pudrición de raíz",
];

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function validateAvocado(imageBase64: string): Promise<ValidateResponse> {
  if (API_URL) return postJSON<ValidateResponse>("/validate", { image: imageBase64 });
  await delay(900);
  // Mock: 80% probabilidad de ser aguacate
  const ok = Math.random() < 0.8;
  return ok
    ? { avocado: true }
    : { avocado: false, reason: "There is not an avocado, there is an orange" };
}

export async function classifyDisease(imageBase64: string): Promise<DiseaseResponse> {
  if (API_URL) return postJSON<DiseaseResponse>("/classify", { image: imageBase64 });
  await delay(1400);
  const disease = MOCK_DISEASES[Math.floor(Math.random() * MOCK_DISEASES.length)];
  return { disease, classification_time: Math.round((1 + Math.random() * 9) * 10) / 10 };
}
