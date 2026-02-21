'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import { formatCurrency, formatPercent, formatMonthYear } from '@/lib/format';
import type { CalculationResult } from '@/lib/calculations';

interface ResultPanelProps {
    result: CalculationResult;
    originalAmount: number;
    originDate: { year: number; month: number };
    destDate: { year: number; month: number };
}

export default function ResultPanel({
    result,
    originalAmount,
    originDate,
    destDate,
}: ResultPanelProps) {
    return (
        <div
            style={{
                animation: 'fadeSlideUp 0.4s ease-out',
            }}
        >
            {/* Main result */}
            <Card
                padding="lg"
                style={{
                    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                    border: 'none',
                    color: '#FFFFFF',
                    marginBottom: '16px',
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <p
                        style={{
                            fontSize: '13px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: 'rgba(255,255,255,0.6)',
                            marginBottom: '8px',
                            fontWeight: 500,
                        }}
                    >
                        Monto ajustado por inflación
                    </p>
                    <p
                        style={{
                            fontSize: 'clamp(28px, 5vw, 42px)',
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                            lineHeight: 1.1,
                            color: '#FFFFFF',
                            marginBottom: '12px',
                        }}
                    >
                        {formatCurrency(result.adjustedAmount)}
                    </p>
                    <p
                        style={{
                            fontSize: '14px',
                            color: 'rgba(255,255,255,0.5)',
                        }}
                    >
                        {formatCurrency(originalAmount)} de {formatMonthYear(originDate.year, originDate.month)}
                        {' → '}
                        {formatMonthYear(destDate.year, destDate.month)}
                    </p>
                </div>
            </Card>

            {/* Secondary metrics */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                }}
            >
                <Card padding="md" variant="surface">
                    <p
                        style={{
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: 'var(--color-text-secondary)',
                            marginBottom: '6px',
                            fontWeight: 500,
                        }}
                    >
                        Inflación acumulada
                    </p>
                    <p
                        style={{
                            fontSize: '24px',
                            fontWeight: 700,
                            color: result.cumulativeInflation >= 0 ? 'var(--color-error)' : 'var(--color-success)',
                            lineHeight: 1.2,
                        }}
                    >
                        {result.cumulativeInflation >= 0 ? '+' : ''}{formatPercent(result.cumulativeInflation)}
                    </p>
                    <p
                        style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}
                    >
                        en {result.months} {result.months === 1 ? 'mes' : 'meses'}
                    </p>
                </Card>

                <Card padding="md" variant="surface">
                    <p
                        style={{
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: 'var(--color-text-secondary)',
                            marginBottom: '6px',
                            fontWeight: 500,
                        }}
                    >
                        Promedio anual (CAGR)
                    </p>
                    <p
                        style={{
                            fontSize: '24px',
                            fontWeight: 700,
                            color: result.annualizedInflation >= 0 ? 'var(--color-error)' : 'var(--color-success)',
                            lineHeight: 1.2,
                        }}
                    >
                        {result.annualizedInflation >= 0 ? '+' : ''}{formatPercent(result.annualizedInflation)}
                    </p>
                    <p
                        style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}
                    >
                        por año
                    </p>
                </Card>
            </div>

            <style jsx>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
}
