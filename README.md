# Coffee Leaf AI — Segmentación de Enfermedades en Hoja de Café

Segmentación de enfermedades en hojas de café mediante Visión Computacional, expuesta a través de una aplicación web PWA accesible desde móvil.

**Equipo — Ingeniería de Datos e IA**

- [Natalia Moreno](https://github.com/natam226)
- [Valentina Bueno](https://github.com/valentinabc19)
- [David Cajiao](https://github.com/DCajiao)

---

## Modelo de segmentación

**YOLOv8n** fine-tuned sobre el dataset [Coffee Leaf v6 (Roboflow)](https://roboflow.com), con 3.993 imágenes de entrenamiento y 167 de validación.

| Clase | Descripción |
|---|---|
| `healthy` | Hoja sana |
| `miner` | Minador de la hoja (*Leucoptera coffeella*) |
| `phoma` | Mancha de hierro (*Phoma* spp.) |
| `rust` | Roya del café (*Hemileia vastatrix*) |

**Métricas (val set, 50 épocas):**

| Métrica | Valor |
|---|---|
| Precision | 0.938 |
| Recall | 0.961 |
| mAP@0.5 | 0.959 |
| mAP@0.5:0.95 | 0.710 |

---

## Arquitectura general

```
┌─────────────────────────────────────────────────────┐
│                    Repositorio                      │
│                                                     │
│  notebooks/          Exploración y modelado         │
│  webapp/                                            │
│  ├── frontend/       TanStack Start + React (SSR)   │
│  └── backend/        Flask API (Python)             │
└─────────────────────────────────────────────────────┘
```

El frontend se despliega en **Render** como Web Service Node.js. El backend se despliega como servicio independiente (Render o Docker). Ambos se comunican vía HTTP REST.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend framework | TanStack Start v1 (SSR) + React 19 |
| Estilos | Tailwind CSS v4 + shadcn/ui |
| Routing | TanStack Router (file-based) |
| Frontend build | Vite 7 + Nitro |
| Backend | Python 3.11 + Flask 3 |
| Modelo CV | YOLOv8n (Ultralytics) |
| Validación de imagen | Gemini 2.5 Flash (Google AI) |
| Gestión de paquetes (backend) | UV |
| Gestión de paquetes (frontend) | pnpm |
| Containerización | Docker (backend) |

---

## Estructura del repositorio

```
.
├── notebooks/
│   └── CNN_Laboratorio2026.ipynb  # Fine-tuning YOLOv8 sobre Coffee Leaf v6
├── docs/                          # Documentación adicional
└── webapp/
    ├── frontend/
    │   ├── public/
    │   │   ├── icon-512.png
    │   │   └── manifest.json
    │   └── src/
    │       ├── components/        # AppHeader, CameraCapture, ResultScreens, LoaderScreen
    │       ├── lib/
    │       │   ├── api.ts         # Cliente HTTP hacia el backend
    │       │   └── history.ts
    │       └── routes/
    │           ├── __root.tsx     # Layout raíz + metadata OG/Twitter
    │           ├── index.tsx      # Pantalla principal (cámara)
    │           └── history.tsx    # Historial de diagnósticos
    └── backend/
        ├── main.py                # API Flask con /validate, /classify y /interpret
        ├── .env.template          # Variables de entorno requeridas
        ├── model/
        │   └── best.pt            # Pesos YOLOv8n entrenados (Coffee Leaf v6, 6 MB)
        ├── src/services/
        │   ├── gemini.py          # Pre-filtro de hoja con Gemini 2.5 Flash
        │   └── yolo.py            # Detección de enfermedades con YOLOv8n
        ├── pyproject.toml
        ├── Dockerfile
        └── uv.lock
```

---

## Endpoints del backend

### `POST /validate`
Pre-filtro: verifica que la imagen muestre una hoja de planta (Gemini 2.5 Flash). Acepta hojas de cualquier especie y en cualquier condición (dañadas, dobladas, decoloradas). Solo rechaza imágenes sin foliaje visible.

**Request**
```json
{ "image": "<base64>" }
```

**Response**
```json
{ "coffee_leaf": true }
{ "coffee_leaf": false, "reason": "Descripción del rechazo en español" }
```

### `POST /classify`
Detecta enfermedades en la hoja mediante YOLOv8n. Devuelve todas las detecciones encontradas por encima del umbral de confianza (`conf=0.30`, `iou=0.45`).

**Request**
```json
{ "image": "<base64>" }
```

**Response**
```json
{
  "detections": [
    { "disease": "rust",  "confidence": 0.848, "bbox": [45.0, 120.3, 390.5, 480.1] },
    { "disease": "miner", "confidence": 0.712, "bbox": [200.0, 50.0, 320.0, 180.0] }
  ],
  "classification_time": 1.13
}
```

- `detections` vacío → hoja sana (ninguna detección supera el umbral).
- `bbox` en píxeles `[x1, y1, x2, y2]` en el espacio de la imagen original (YOLO reescala internamente pero devuelve coordenadas sobre las dimensiones originales).

**Clases detectables:** `healthy` · `miner` · `phoma` · `rust`

### `POST /interpret`
Genera una interpretación agronómica de los resultados de detección usando Gemini 2.5 Flash. Recibe el array `detections` que devuelve `/classify` (puede estar vacío para hojas sanas).

**Request**
```json
{
  "detections": [
    { "disease": "rust", "confidence": 0.848, "bbox": [45.0, 120.3, 390.5, 480.1] }
  ]
}
```

**Response**
```json
{
  "summary": "Se detectó roya del café con alta confianza...",
  "actions": [
    "Aislar las plantas afectadas para evitar propagación.",
    "Aplicar fungicida cúprico en las próximas 48 horas.",
    "Revisar plantas circundantes en un radio de 5 metros."
  ],
  "professional_note": "Se recomienda confirmar el diagnóstico con un agrónomo certificado antes de aplicar cualquier producto."
}
```

---

## Desarrollo local

### Requisitos previos
- Node.js 20+
- Python 3.11+
- [UV](https://docs.astral.sh/uv/) (`pip install uv`)

### Backend

```bash
cd webapp/backend
cp .env.template .env   # agregar GEMINI_API_KEY
uv run python main.py
# Servidor disponible en http://localhost:8000
```

### Frontend

```bash
cd webapp/frontend
pnpm install
echo "VITE_API_URL=http://localhost:8000" > .env.local
pnpm dev
# App disponible en http://localhost:3000
```

> Si no se define `VITE_API_URL`, el frontend usa respuestas mock automáticamente.

---

## Despliegue

### Frontend — Render Web Service

| Campo | Valor |
|---|---|
| Root Directory | `webapp/frontend` |
| Runtime | Node |
| Build Command | `corepack enable && pnpm install && pnpm build` |
| Start Command | `pnpm start` |
| Node Version | 20 |

Variables de entorno en Render:
```
NODE_ENV=production
VITE_API_URL=<URL del backend desplegado>
```

### Backend — Docker / Cloud Run

```bash
cd webapp/backend
docker build -t coffee-leaf-ai-backend .
docker run -p 8000:8000 --env-file .env coffee-leaf-ai-backend
```

Variables de entorno requeridas:
```
GEMINI_API_KEY=<tu clave de AI Studio>
PORT=8000   # Cloud Run lo inyecta automáticamente
```

---

## Notebooks

| Notebook | Descripción |
|---|---|
| `yolov8_coffee_leaf.ipynb` | Fine-tuning YOLOv8n sobre Coffee Leaf v6, métricas por clase y análisis de errores |
