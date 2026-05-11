export interface HistoryRecord {
  id: string;
  image: string; // base64 data URL
  disease: string;
  classification_time: number;
  createdAt: number;
}

const KEY = "avoscan:history:v1";

export function getHistory(): HistoryRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HistoryRecord[]) : [];
  } catch {
    return [];
  }
}

export function addRecord(rec: Omit<HistoryRecord, "id" | "createdAt">): HistoryRecord {
  const full: HistoryRecord = {
    ...rec,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  const list = [full, ...getHistory()].slice(0, 100);
  localStorage.setItem(KEY, JSON.stringify(list));
  return full;
}

export function clearHistory() {
  localStorage.removeItem(KEY);
}

export function deleteRecord(id: string) {
  const list = getHistory().filter((r) => r.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
}
