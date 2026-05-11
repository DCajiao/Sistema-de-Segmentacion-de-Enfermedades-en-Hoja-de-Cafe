# Sistema de Detección de Enfermedades en Aguacate Común

Detección de enfermedades en hojas de aguacate mediante Visión Computacional, expuesta a través de una aplicación web accesible desde móvil.

**Equipo — Ingeniería de Datos e IA**

- [Natalia Moreno](https://github.com/natam226)
- [Valentina Bueno](https://github.com/valentinabc19)
- [David Cajiao](https://github.com/DCajiao)

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
| Gestión de paquetes (backend) | UV |
| Gestión de paquetes (frontend) | npm |
| Containerización | Docker (backend) |

---

## Estructura del repositorio

```
.
├── notebooks/
│   └── 00_EDA.ipynb          # Análisis exploratorio del dataset
├── docs/                     # Documentación adicional
└── webapp/
    ├── frontend/
    │   ├── public/
    │   │   ├── icon-512.png
    │   │   └── manifest.json
    │   ├── src/
    │   │   ├── components/   # AppHeader, CameraCapture, ResultScreens, LoaderScreen
    │   │   ├── components/ui/ # Componentes shadcn/ui
    │   │   ├── hooks/
    │   │   ├── lib/
    │   │   │   ├── api.ts    # Cliente HTTP hacia el backend
    │   │   │   └── history.ts
    │   │   ├── routes/
    │   │   │   ├── __root.tsx  # Layout raíz + metadata OG/Twitter
    │   │   │   ├── index.tsx   # Pantalla principal (cámara)
    │   │   │   └── history.tsx # Historial de diagnósticos
    │   │   ├── router.tsx
    │   │   └── start.ts      # Entry point SSR de TanStack Start
    │   ├── package.json
    │   └── vite.config.ts
    └── backend/
        ├── main.py           # API Flask con /validate y /classify
        ├── pyproject.toml
        ├── Dockerfile
        └── uv.lock
```

---

## Endpoints del backend

### `POST /validate`
Valida si la imagen contiene un aguacate.

**Request**
```json
{ "image": "<base64>" }
```

**Response**
```json
{ "avocado": true }
{ "avocado": false, "reason": "Descripción del problema" }
```

### `POST /classify`
Clasifica la enfermedad presente en la hoja de aguacate.

**Request**
```json
{ "image": "<base64>" }
```

**Response**
```json
{ "disease": "Antracnosis", "classification_time": 1.23 }
```

**Enfermedades detectables:** Antracnosis, Mancha negra (Cercospora), Roña del aguacate, Pudrición de raíz, Sano.

---

## Desarrollo local

### Requisitos previos
- Node.js 20+
- Python 3.11+
- [UV](https://docs.astral.sh/uv/) (`pip install uv`)

### Backend

```bash
cd webapp/backend
uv run python main.py
# Servidor disponible en http://localhost:8000
```

### Frontend

```bash
cd webapp/frontend

# Primera vez
npm install

# Crear archivo de entorno local
echo "VITE_API_URL=http://localhost:8000" > .env.local

# Iniciar servidor de desarrollo
npm run dev
# App disponible en http://localhost:3000
```

> Si no se define `VITE_API_URL`, el frontend usa respuestas mock automáticamente (útil para trabajar sin el backend levantado).

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
docker build -t avoscan-backend .
docker run -p 8000:8000 avoscan-backend
```

---

## Notebooks

| Notebook | Descripción |
|---|---|
| `00_EDA.ipynb` | Análisis exploratorio del dataset de imágenes de aguacate |
