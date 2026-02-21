'use client';

import React from 'react';
import Card from '@/components/ui/Card';

interface MethodologySectionProps {
    source: string;
    sourceUrl: string;
    lastUpdated: string;
    base: string;
}

export default function MethodologySection({
    source,
    sourceUrl,
    lastUpdated,
    base,
}: MethodologySectionProps) {
    const lastUpdatedDate = new Date(lastUpdated).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <Card padding="lg" variant="surface">
            {/* Always visible: source info */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px',
                    alignItems: 'center',
                    marginBottom: '16px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--color-border)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-action)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                        Fuente:{' '}
                        <a
                            href={sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: 'var(--color-primary-action)',
                                fontWeight: 500,
                            }}
                        >
                            {source}
                        </a>
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                        Última actualización: {lastUpdatedDate}
                    </span>
                </div>
            </div>

            {/* Collapsible methodology */}
            <details>
                <summary
                    style={{
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'var(--color-primary)',
                        listStyle: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        userSelect: 'none',
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s' }}>
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                    Metodología y fórmulas
                </summary>

                <div
                    style={{
                        marginTop: '16px',
                        fontSize: '15px',
                        lineHeight: 1.7,
                        color: 'var(--color-text-secondary)',
                    }}
                >
                    <p style={{ marginBottom: '12px' }}>
                        El cálculo utiliza el <strong style={{ color: 'var(--color-text-primary)' }}>Índice de Precios al Consumidor (IPC)</strong> publicado
                        por el INDEC con base {base} = 100.
                    </p>

                    <div
                        style={{
                            background: 'var(--color-bg)',
                            borderRadius: 'var(--radius-input)',
                            padding: '16px 20px',
                            marginBottom: '16px',
                            border: '1px solid var(--color-border)',
                            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
                            fontSize: '14px',
                            lineHeight: 1.8,
                        }}
                    >
                        <p style={{ marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                            <strong>Monto ajustado</strong> = Monto × (IPC<sub>destino</sub> / IPC<sub>origen</sub>)
                        </p>
                        <p style={{ marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                            <strong>Inflación acumulada</strong> = (IPC<sub>destino</sub> / IPC<sub>origen</sub> − 1) × 100
                        </p>
                        <p style={{ color: 'var(--color-text-primary)' }}>
                            <strong>CAGR</strong> = ((IPC<sub>destino</sub> / IPC<sub>origen</sub>)<sup>12/meses</sup> − 1) × 100
                        </p>
                    </div>

                    <p style={{ marginBottom: '8px' }}>
                        <strong style={{ color: 'var(--color-text-primary)' }}>CAGR</strong> (Compound Annual Growth Rate)
                        es la tasa de inflación promedio anualizada, útil para comparar períodos de distinta duración.
                    </p>
                    <p>
                        Los valores se redondean a 2 decimales. No se utilizan datos estimados ni interpolados.
                        Si un mes no tiene datos oficiales publicados, se indica como faltante.
                    </p>
                </div>
            </details>
        </Card>
    );
}
