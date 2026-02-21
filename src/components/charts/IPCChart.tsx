'use client';

import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import Card from '@/components/ui/Card';
import type { IPCEntry } from '@/lib/ipc-data';
import { formatNumber } from '@/lib/format';

Chart.register(...registerables);

interface IPCChartProps {
    series: IPCEntry[];
    highlightStart?: string;
    highlightEnd?: string;
}

export default function IPCChart({ series, highlightStart, highlightEnd }: IPCChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (!canvasRef.current || series.length === 0) return;

        // Destroy previous chart
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const labels = series.map((e) => {
            const [y, m] = e.date.split('-');
            return `${m}/${y.slice(2)}`;
        });

        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(37, 99, 235, 0.15)');
        gradient.addColorStop(1, 'rgba(37, 99, 235, 0.01)');

        // Highlight points in selected range
        const pointBackgroundColors = series.map((e) => {
            if (highlightStart && highlightEnd) {
                if (e.date === highlightStart || e.date === highlightEnd) {
                    return '#FBBF24';
                }
            }
            return 'transparent';
        });

        const pointRadius = series.map((e) => {
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
                        label: 'IPC Nacional',
                        data: series.map((e) => e.value),
                        borderColor: '#2563EB',
                        backgroundColor: gradient,
                        borderWidth: 2.5,
                        fill: true,
                        tension: 0.3,
                        pointBackgroundColor: pointBackgroundColors,
                        pointBorderColor: pointBackgroundColors.map((c) =>
                            c === '#FBBF24' ? '#0F172A' : 'transparent'
                        ),
                        pointBorderWidth: 2,
                        pointRadius: pointRadius,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: '#2563EB',
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
                        borderColor: '#2563EB',
                        borderWidth: 1,
                        cornerRadius: 10,
                        padding: 12,
                        titleFont: { family: 'Onest', size: 12 },
                        bodyFont: { family: 'Onest', size: 14, weight: 'bold' },
                        callbacks: {
                            title: (items) => {
                                const idx = items[0].dataIndex;
                                const entry = series[idx];
                                const [y, m] = entry.date.split('-');
                                const months = [
                                    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                                    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
                                ];
                                return `${months[parseInt(m) - 1]} ${y}`;
                            },
                            label: (item) => {
                                return `IPC: ${formatNumber(item.parsed.y as number, 2)}`;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: '#475569',
                            font: { family: 'Onest', size: 11 },
                            maxTicksLimit: 12,
                            maxRotation: 0,
                        },
                        border: {
                            display: false,
                        },
                    },
                    y: {
                        grid: {
                            color: 'rgba(226, 232, 240, 0.6)',
                        },
                        ticks: {
                            color: '#475569',
                            font: { family: 'Onest', size: 11 },
                            callback: (value) => formatNumber(Number(value), 0),
                        },
                        border: {
                            display: false,
                        },
                    },
                },
            },
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [series, highlightStart, highlightEnd]);

    return (
        <Card padding="lg">
            <h3
                style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                    marginBottom: '16px',
                }}
            >
                Evolución del IPC Nacional
            </h3>
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
                Base: Diciembre 2016 = 100 · Fuente: INDEC
            </p>
        </Card>
    );
}
