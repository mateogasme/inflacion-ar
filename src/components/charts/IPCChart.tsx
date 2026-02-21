'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Chart, registerables } from 'chart.js';
import Card from '@/components/ui/Card';
import type { IPCEntry } from '@/lib/ipc-data';
import { formatNumber, formatPercent } from '@/lib/format';

Chart.register(...registerables);

type ChartMode = 'linear' | 'log' | 'variation';

interface IPCChartProps {
    series: IPCEntry[];
    highlightStart?: string;
    highlightEnd?: string;
}

/**
 * Compute year-over-year variation: ((IPC(t) / IPC(t-12)) - 1) * 100
 */
function computeVariation(series: IPCEntry[]): IPCEntry[] {
    if (series.length < 13) return [];

    // Build a lookup map
    const lookup = new Map<string, number>();
    for (const e of series) {
        lookup.set(e.date, e.value);
    }

    const result: IPCEntry[] = [];
    for (let i = 12; i < series.length; i++) {
        const current = series[i];
        const [y, m] = current.date.split('-').map(Number);
        const prevKey = `${y - 1}-${String(m).padStart(2, '0')}`;
        const prevValue = lookup.get(prevKey);

        if (prevValue && prevValue > 0 && current.value > 0) {
            const variation = ((current.value / prevValue) - 1) * 100;
            // Cap at reasonable values for display
            if (isFinite(variation) && variation < 100000) {
                result.push({ date: current.date, value: Math.round(variation * 100) / 100 });
            }
        }
    }

    return result;
}

const MODE_LABELS: Record<ChartMode, string> = {
    linear: 'Lineal',
    log: 'Log',
    variation: 'Var. % anual',
};

export default function IPCChart({ series, highlightStart, highlightEnd }: IPCChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart | null>(null);
    const [mode, setMode] = useState<ChartMode>('linear');

    const variationSeries = useMemo(() => computeVariation(series), [series]);

    const activeSeries = mode === 'variation' ? variationSeries : series.filter(e => e.value > 0);

    useEffect(() => {
        if (!canvasRef.current || activeSeries.length === 0) return;

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const labels = activeSeries.map((e) => {
            const [y, m] = e.date.split('-');
            return `${m}/${y.slice(2)}`;
        });

        // Create gradient
        const isVariation = mode === 'variation';
        const mainColor = isVariation ? '#EF4444' : '#2563EB';
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, isVariation ? 'rgba(239, 68, 68, 0.12)' : 'rgba(37, 99, 235, 0.15)');
        gradient.addColorStop(1, isVariation ? 'rgba(239, 68, 68, 0.01)' : 'rgba(37, 99, 235, 0.01)');

        // Highlight points in selected range
        const pointBackgroundColors = activeSeries.map((e) => {
            if (highlightStart && highlightEnd) {
                if (e.date === highlightStart || e.date === highlightEnd) {
                    return '#FBBF24';
                }
            }
            return 'transparent';
        });

        const pointRadius = activeSeries.map((e) => {
            if (highlightStart && highlightEnd) {
                if (e.date === highlightStart || e.date === highlightEnd) {
                    return 6;
                }
            }
            return 0;
        });

        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: isVariation ? 'Variación interanual' : 'IPC Nacional',
                        data: activeSeries.map((e) => e.value),
                        borderColor: mainColor,
                        backgroundColor: gradient,
                        borderWidth: 2,
                        fill: true,
                        tension: 0.3,
                        pointBackgroundColor: pointBackgroundColors,
                        pointBorderColor: pointBackgroundColors.map((c) =>
                            c === '#FBBF24' ? '#0F172A' : 'transparent'
                        ),
                        pointBorderWidth: 2,
                        pointRadius: pointRadius,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: mainColor,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        backgroundColor: '#0F172A',
                        titleColor: '#E2E8F0',
                        bodyColor: '#FFFFFF',
                        borderColor: mainColor,
                        borderWidth: 1,
                        cornerRadius: 10,
                        padding: 12,
                        titleFont: { family: 'Onest', size: 12 },
                        bodyFont: { family: 'Onest', size: 14, weight: 'bold' },
                        callbacks: {
                            title: (items) => {
                                const idx = items[0].dataIndex;
                                const entry = activeSeries[idx];
                                const [y, m] = entry.date.split('-');
                                const months = [
                                    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                                    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
                                ];
                                return `${months[parseInt(m) - 1]} ${y}`;
                            },
                            label: (item) => {
                                if (isVariation) {
                                    return `Var. interanual: ${formatPercent(item.parsed.y as number)}`;
                                }
                                return `IPC: ${formatNumber(item.parsed.y as number, 2)}`;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: '#475569',
                            font: { family: 'Onest', size: 11 },
                            maxTicksLimit: 12,
                            maxRotation: 0,
                        },
                        border: { display: false },
                    },
                    y: {
                        type: mode === 'log' ? 'logarithmic' : 'linear',
                        grid: { color: 'rgba(226, 232, 240, 0.6)' },
                        ticks: {
                            color: '#475569',
                            font: { family: 'Onest', size: 11 },
                            callback: (value) => {
                                if (isVariation) {
                                    return `${formatNumber(Number(value), 0)}%`;
                                }
                                if (mode === 'log') {
                                    const v = Number(value);
                                    if (v >= 1) return formatNumber(v, 0);
                                    return v.toExponential(0);
                                }
                                return formatNumber(Number(value), 0);
                            },
                        },
                        border: { display: false },
                    },
                },
            },
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [activeSeries, highlightStart, highlightEnd, mode]);

    const buttonStyle = (active: boolean): React.CSSProperties => ({
        padding: '6px 14px',
        fontSize: '12px',
        fontWeight: active ? 600 : 400,
        fontFamily: 'var(--font-family)',
        border: `1px solid ${active ? 'var(--color-primary-action)' : 'var(--color-border)'}`,
        borderRadius: '8px',
        backgroundColor: active ? 'var(--color-primary-action)' : 'var(--color-bg)',
        color: active ? '#FFFFFF' : 'var(--color-text-secondary)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
    });

    return (
        <Card padding="lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <h3
                    style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'var(--color-primary)',
                    }}
                >
                    {mode === 'variation' ? 'Variación interanual del IPC' : 'Evolución del IPC Nacional'}
                </h3>
                <div style={{ display: 'flex', gap: '4px' }}>
                    {(Object.keys(MODE_LABELS) as ChartMode[]).map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            style={buttonStyle(mode === m)}
                            type="button"
                            aria-pressed={mode === m}
                        >
                            {MODE_LABELS[m]}
                        </button>
                    ))}
                </div>
            </div>
            <div style={{ position: 'relative', height: '320px', width: '100%' }}>
                <canvas ref={canvasRef} aria-label="Gráfico de evolución del IPC Nacional" role="img" />
            </div>
            <p
                style={{
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)',
                    marginTop: '12px',
                    textAlign: 'center',
                }}
            >
                {mode === 'variation'
                    ? 'Variación porcentual respecto al mismo mes del año anterior · Fuente: INDEC'
                    : 'Base: Diciembre 2016 = 100 · Fuente: INDEC'
                }
            </p>
        </Card>
    );
}
