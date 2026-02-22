import type { Metadata } from 'next';
import '@/styles/globals.css';
import React from 'react';
// import DonateButton from '@/components/ui/DonateButton';

export const metadata: Metadata = {
  title: {
    default: 'InflacionAR — Calculadora de Inflación Argentina',
    template: '%s | InflacionAR',
  },
  description:
    'Calculá cuánto vale hoy un monto del pasado usando datos oficiales del IPC (INDEC). Inflación acumulada, promedio anual y gráfico interactivo.',
  keywords: [
    'calculadora inflación',
    'inflación argentina',
    'ajustar por inflación',
    'IPC argentina',
    'cuánto valía',
    'calculadora IPC',
    'INDEC',
    'inflación acumulada',
  ],
  openGraph: {
    title: 'InflacionAR — Inflación Argentina',
    description:
      'Ajustá montos por inflación con datos oficiales del IPC (INDEC). Inflación acumulada, CAGR y gráfico.',
    type: 'website',
    locale: 'es_AR',
    siteName: 'InflacionAR',
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://calculadora-inflacion.ar'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR">
      <head>
        {/* Google Analytics placeholder — replace UA-XXXXX with real ID */}
        {/*
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />
        */}
        <meta name="google-adsense-account" content="ca-pub-7966032964949083" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7966032964949083"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {/* Header */}
        <header
          style={{
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          <div
            className="container"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '64px',
              maxWidth: '900px',
            }}
          >
            <a
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #2563EB, #0F172A)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '20px',
                  color: 'var(--color-primary)',
                  fontFamily: 'var(--font-family)',
                  letterSpacing: '-0.02em',
                }}
              >
                Inflacion<span style={{ color: 'var(--color-primary-action)' }}>AR</span>
              </span>
            </a>

            <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <a
                href="/"
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--color-text-secondary)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-family)',
                }}
              >
                Calculadora
              </a>
              <a
                href="/inflacion-por-anio"
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--color-text-secondary)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-family)',
                }}
              >
                Inflación por año
              </a>
              <a
                href="/metodologia"
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--color-text-secondary)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-family)',
                }}
              >
                Metodología
              </a>
              {/* <DonateButton /> */}
            </nav>
          </div>
        </header>

        {/* Main */}
        <main>{children}</main>

        {/* Footer */}
        <footer
          style={{
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            padding: '40px 0',
            marginTop: '32px',
          }}
        >
          <div className="container" style={{ maxWidth: '900px' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '32px',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: '15px',
                    color: 'var(--color-primary)',
                    marginBottom: '8px',
                  }}
                >
                  Calculadora de Inflación Argentina
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-text-secondary)',
                    maxWidth: '400px',
                    lineHeight: 1.6,
                  }}
                >
                  Herramienta gratuita para ajustar montos por inflación usando datos oficiales del
                  IPC publicado por el INDEC. No almacenamos datos personales.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '32px' }}>
                <div>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: '13px',
                      color: 'var(--color-primary)',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Herramientas
                  </p>
                  <a
                    href="/"
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-text-secondary)',
                      display: 'block',
                      marginBottom: '6px',
                      textDecoration: 'none',
                    }}
                  >
                    Calculadora
                  </a>
                </div>
                <div>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: '13px',
                      color: 'var(--color-primary)',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Recursos
                  </p>
                  <a
                    href="/metodologia"
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-text-secondary)',
                      display: 'block',
                      marginBottom: '6px',
                      textDecoration: 'none',
                    }}
                  >
                    Metodología
                  </a>
                  <a
                    href="https://www.indec.gob.ar/indec/web/Nivel4-Tema-3-5-31"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-text-secondary)',
                      display: 'block',
                      textDecoration: 'none',
                    }}
                  >
                    INDEC — IPC
                  </a>
                </div>
              </div>
            </div>

            <div
              style={{
                borderTop: '1px solid var(--color-border)',
                marginTop: '24px',
                paddingTop: '16px',
              }}
            >
              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-secondary)',
                  textAlign: 'center',
                }}
              >
                © {new Date().getFullYear()} Calculadora de Inflación Argentina. Datos: INDEC.
                Herramienta con fines informativos.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
