import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#3a7d3a" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "AvoScan" },
      { title: "AvoScan — Diagnóstico de aguacate" },
      { name: "description", content: "Toma una foto y diagnostica enfermedades del aguacate al instante." },
      { property: "og:title", content: "AvoScan — Diagnóstico de aguacate" },
      { property: "og:description", content: "Toma una foto y diagnostica enfermedades del aguacate al instante con Visión Computacional" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/icon-512.png" },
      { property: "og:image:width", content: "512" },
      { property: "og:image:height", content: "512" },
      { property: "og:image:alt", content: "AvoScan - Diagnóstico de enfermedades en aguacate" },
      { property: "og:site_name", content: "AvoScan" },
      { property: "og:locale", content: "es_CO" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "AvoScan — Diagnóstico de aguacate" },
      { name: "twitter:description", content: "Toma una foto y diagnostica enfermedades del aguacate al instante con Visión Computacional" },
      { name: "twitter:image", content: "/icon-512.png" },
      { name: "twitter:image:alt", content: "AvoScan - Diagnóstico de enfermedades en aguacate" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "icon", href: "/icon-512.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/icon-512.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const TEAM = [
  { name: "Natalia Moreno", handle: "natam226", url: "https://github.com/natam226" },
  { name: "Valentina Bueno", handle: "valentinabc19", url: "https://github.com/valentinabc19" },
  { name: "David Cajiao", handle: "DCajiao", url: "https://github.com/DCajiao" },
];

const REPO_URL =
  "https://github.com/DCajiao/Sistema-de-Deteccion-de-Enfermedades-en-Aguacate-Comun";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.165c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function TeamButton() {
  const handleClick = () => {
    document.getElementById("credits")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Equipo detrás de AvoScan"
      title="Equipo detrás de AvoScan"
      className="fixed bottom-6 right-4 z-50 flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        background: "linear-gradient(135deg, #1e3d1e 0%, #2d5a2d 100%)",
        border: "1px solid rgba(125,189,125,0.35)",
        boxShadow: "0 4px 16px rgba(58,125,58,0.4)",
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0" aria-hidden>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
      <span style={{ color: "rgba(255,255,255,0.9)" }}>Equipo de AvoScan</span>
    </button>
  );
}

function Credits() {
  return (
    <footer
      id="credits"
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #152b15 0%, #1e3d1e 45%, #162a16 100%)",
      }}
    >
      <style>{`
        @keyframes avo-ring-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(125, 189, 125, 0); }
          50% { box-shadow: 0 0 0 5px rgba(125, 189, 125, 0.18); }
        }
        .avo-avatar:hover { animation: avo-ring-pulse 1.6s ease-in-out infinite; }
        @keyframes avo-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .avo-handle {
          background: linear-gradient(90deg, rgba(125,189,125,0.4) 0%, rgba(125,189,125,1) 50%, rgba(125,189,125,0.4) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .avo-member:hover .avo-handle { animation: avo-shimmer 1.4s linear infinite; }
      `}</style>

      {/* Hex cell overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='56' height='48' viewBox='0 0 56 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 2l26 15v16L28 47 2 33V17z' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: "56px 48px",
        }}
      />

      {/* Top edge glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(125,189,125,0.35), transparent)" }}
      />

      <div className="relative mx-auto max-w-sm px-6 py-12">
        {/* Label */}
        <p
          className="mb-8 text-center font-mono text-xs uppercase tracking-[0.3em]"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          ✦ &nbsp;Equipo de desarrollo&nbsp; ✦
        </p>

        {/* Team cards */}
        <div className="mb-10 grid grid-cols-3 gap-4">
          {TEAM.map((member) => {
            const [first, last] = member.name.split(" ");
            const initials = `${first[0]}${last[0]}`;
            return (
              <a
                key={member.url}
                href={member.url}
                target="_blank"
                rel="noopener noreferrer"
                className="avo-member group flex flex-col items-center gap-3 text-center"
              >
                <div
                  className="avo-avatar flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.13)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(125,189,125,0.15)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(125,189,125,0.45)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.13)";
                  }}
                >
                  <span
                    className="text-base font-bold tracking-tight transition-colors duration-300"
                    style={{ color: "rgba(255,255,255,0.75)" }}
                  >
                    {initials}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight" style={{ color: "rgba(255,255,255,0.85)" }}>
                    {first}
                  </p>
                  <p className="text-sm font-semibold leading-tight" style={{ color: "rgba(255,255,255,0.85)" }}>
                    {last}
                  </p>
                  <p className="avo-handle mt-1.5 font-mono text-[11px]">@{member.handle}</p>
                </div>
              </a>
            );
          })}
        </div>

        {/* Divider */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "9px" }}>◆</span>
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Footer bottom */}
        <div className="flex flex-col items-center gap-2.5">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.25)" }}>
            Ingeniería de Datos &amp; IA
          </p>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors duration-200"
            style={{ color: "rgba(255,255,255,0.35)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(125,189,125,0.9)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.35)")}
          >
            <GitHubIcon />
            <span className="font-mono text-[11px] tracking-wide">Ver repositorio</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
        <Credits />
      </div>
      <TeamButton />
    </QueryClientProvider>
  );
}
