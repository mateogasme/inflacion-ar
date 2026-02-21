'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import { formatCurrency, formatPercent, formatMonthYear } from '@/lib/format';
import type { CalculationResult } from '@/lib/calculations';
import {
    needsConversion,
    convertToModernARS,
    getEra,
    getZerosRemoved,
    getCurrencyChangesBetween,
} from '@/lib/currency-eras';

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
    const showConversion = needsConversion(
        originDate.year, originDate.month,
        destDate.year, destDate.month
    );

    const originEra = getEra(originDate.year, originDate.month);
    const destEra = getEra(destDate.year, destDate.month);

    const modernAmount = showConversion
        ? convertToModernARS(result.adjustedAmount, originDate.year, originDate.month)
        : result.adjustedAmount;

    const zerosRemoved = showConversion
        ? getZerosRemoved(originDate.year, originDate.month, destDate.year, destDate.month)
        : 0;

    const currencyChanges = showConversion
        ? getCurrencyChangesBetween(originDate.year, originDate.month, destDate.year, destDate.month)
        : [];

    return (
        <div style={{ animation: 'fadeSlideUp 0.4s ease-out' }}>
            {/* Main result — in modern ARS */}
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
                        {showConversion ? 'Equivalente en pesos actuales (ARS)' : 'Monto ajustado por inflación'}
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
                        {formatCurrency(showConversion ? modernAmount : result.adjustedAmount)}
                    </p>
                    <p
                        style={{
                            fontSize: '14px',
                            color: 'rgba(255,255,255,0.5)',
                        }}
                    >
                        {showConversion
                            ? `${originEra.symbol} ${formatCurrency(originalAmount).replace('$', '').trim()} de ${formatMonthYear(originDate.year, originDate.month)} → ${formatMonthYear(destDate.year, destDate.month)}`
                            : `${formatCurrency(originalAmount)} de ${formatMonthYear(originDate.year, originDate.month)} → ${formatMonthYear(destDate.year, destDate.month)}`
                        }
                    </p>
                </div>
            </Card>

            {/* Currency conversion banner */}
            {showConversion && (
                <div
                    style={{
                        padding: '14px 18px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)',
                        border: '1px solid #BFDBFE',
                        marginBottom: '16px',
                        fontSize: '14px',
                        lineHeight: 1.6,
                        color: '#1E40AF',
                    }}
                >
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <div>
                            <p style={{ fontWeight: 600, marginBottom: '4px' }}>
                                Conversión de signo monetario aplicada
                            </p>
                            <p style={{ color: '#3B82F6' }}>
                                En {formatMonthYear(originDate.year, originDate.month)} la moneda era el <strong>{originEra.name} ({originEra.symbol})</strong>.
                                Desde entonces se eliminaron <strong>{zerosRemoved} ceros</strong> en {currencyChanges.length}
                                {currencyChanges.length === 1 ? ' reforma' : ' reformas'} monetaria{currencyChanges.length === 1 ? '' : 's'}.
                            </p>

                            {/* Mini timeline of changes */}
                            {currencyChanges.length > 0 && (
                                <div style={{
                                    marginTop: '10px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px',
                                }}>
                                    {currencyChanges.map((change, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                fontSize: '12px',
                                                color: '#60A5FA',
                                            }}
                                        >
                                            <span style={{
                                                fontFamily: 'ui-monospace, monospace',
                                                backgroundColor: '#DBEAFE',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                fontSize: '11px',
                                                color: '#1E40AF',
                                                fontWeight: 600,
                                            }}>
                                                {change.year}
                                            </span>
                                            <span>
                                                {change.from.symbol} → {change.to.symbol}
                                            </span>
                                            <span style={{ color: '#93C5FD' }}>
                                                (÷ 10<sup>{change.zerosRemoved}</sup>)
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

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
