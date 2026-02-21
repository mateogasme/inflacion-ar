'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import type { Segment } from '@/lib/ipc-data';

interface MethodologySectionProps {
    source: string;
    sourceUrl: string;
    lastUpdated: string;
    base: string;
    segments?: Segment[];
    gapMonths?: string[];
}

export default function MethodologySection({
    source,
    sourceUrl,
    lastUpdated,
    base,
    segments = [],
    gapMonths = [],
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
                        por el INDEC. Todos los valores están re-expresados en base {base} = 100.
                    </p>

                    {/* Formulas */}
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
                    <p style={{ marginBottom: '16px' }}>
                        Los valores se redondean a 2 decimales. No se utilizan datos estimados ni interpolados.
                        Si un mes no tiene datos oficiales publicados, se indica como faltante.
                    </p>

                    {/* Segments — data sources for each time period */}
                    {segments.length > 0 && (
                        <>
                            <h4 style={{
                                fontSize: '14px',
                                fontWeight: 600,
                                color: 'var(--color-primary)',
                                marginBottom: '10px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}>
                                Tramos de datos
                            </h4>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px',
                                marginBottom: '16px',
                            }}>
                                {segments.map((seg, i) => {
                                    const isGap = seg.source === 'N/A';
                                    return (
                                        <div
                                            key={i}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                backgroundColor: isGap ? '#FEF3C7' : 'var(--color-bg)',
                                                border: `1px solid ${isGap ? '#FDE68A' : 'var(--color-border)'}`,
                                                fontSize: '13px',
                                            }}
                                        >
                                            <span style={{
                                                fontFamily: 'ui-monospace, monospace',
                                                fontSize: '12px',
                                                color: 'var(--color-text-secondary)',
                                                whiteSpace: 'nowrap',
                                            }}>
                                                {seg.startDate} → {seg.endDate}
                                            </span>
                                            <span style={{
                                                color: isGap ? '#92400E' : 'var(--color-text-primary)',
                                                fontWeight: isGap ? 600 : 400,
                                            }}>
                                                {seg.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* Gap explanation */}
                    {gapMonths.length > 0 && (
                        <div style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            backgroundColor: '#FFF7ED',
                            border: '1px solid #FED7AA',
                            fontSize: '14px',
                            lineHeight: 1.6,
                            color: '#9A3412',
                        }}>
                            <strong>Nota sobre el período 2014–2016:</strong> Entre enero de 2014 y
                            noviembre de 2016, el INDEC estuvo intervenido y no publicó datos oficiales
                            del IPC considerados confiables. Este período se excluye de la calculadora.
                            No se utilizan datos estimados ni de fuentes alternativas para mantener la
                            integridad de los cálculos.
                        </div>
                    )}
                </div>
            </details>
        </Card>
    );
}
