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
| Gestión de paquetes (frontend) | npm |
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
        ├── main.py                # API Flask con /validate y /classify
        ├── src/services/
        │   └── gemini.py          # Validación con Gemini
        ├── pyproject.toml
        ├── Dockerfile
        └── uv.lock
```

---

## Endpoints del backend

### `POST /validate`
Valida si la imagen contiene una hoja de café (Gemini 2.5 Flash).

**Request**
```json
{ "image": "<base64>" }
```

**Response**
```json
{ "coffee_leaf": true }
{ "coffee_leaf": false, "reason": "Descripción del problema en español" }
```

### `POST /classify`
Clasifica la enfermedad presente en la hoja de café.

**Request**
```json
{ "image": "<base64>" }
```

**Response**
```json
{ "disease": "rust", "classification_time": 0.82 }
```

**Clases segmentables:** `healthy`, `miner`, `phoma`, `rust`

> `/classify` actualmente devuelve valores mock. La integración de YOLOv8 es el próximo paso.

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
npm install
echo "VITE_API_URL=http://localhost:8000" > .env.local
npm run dev
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
| Build Command | `npm install && npm run build` |
| Start Command | `npm run start` |
| Node Version | 20 |

Variables de entorno en Render:
```
NODE_ENV=production
VITE_API_URL=<URL del backend desplegado>
```

### Backend — Docker

```bash
cd webapp/backend
docker build -t coffee-leaf-ai-backend .
docker run -p 8000:8000 --env-file .env coffee-leaf-ai-backend
```

---

## Notebooks

| Notebook | Descripción |
|---|---|
| `CNN_Laboratorio2026.ipynb` | Fine-tuning YOLOv8n sobre Coffee Leaf v6, métricas por clase y análisis de errores |
