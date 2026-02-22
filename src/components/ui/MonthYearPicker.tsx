'use client';

import React from 'react';

const MONTH_OPTIONS = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
];

interface MonthYearPickerProps {
    label: string;
    month: number;
    year: number;
    onMonthChange: (month: number) => void;
    onYearChange: (year: number) => void;
    minYear?: number;
    maxYear?: number;
    minMonth?: number; // min month for minYear
    maxMonth?: number; // max month for maxYear
    gapMonths?: string[]; // "YYYY-MM" strings for months with no data
    error?: string;
    id?: string;
}

export default function MonthYearPicker({
    label,
    month,
    year,
    onMonthChange,
    onYearChange,
    minYear = 1943,
    maxYear = 2026,
    minMonth,
    maxMonth,
    gapMonths = [],
    error,
    id,
}: MonthYearPickerProps) {
    const baseId = id || label.toLowerCase().replace(/\s+/g, '-');

    // Build a set for fast gap lookups
    const gapSet = new Set(gapMonths);

    // Check if an entire year is in the gap
    const isYearFullyInGap = (y: number): boolean => {
        for (let m = 1; m <= 12; m++) {
            const key = `${y}-${String(m).padStart(2, '0')}`;
            if (!gapSet.has(key)) return false;
        }
        return true;
    };

    const years: number[] = [];
    for (let y = minYear; y <= maxYear; y++) {
        years.push(y);
    }

    // Check if current month/year is in gap
    const currentKey = `${year}-${String(month).padStart(2, '0')}`;
    const isCurrentInGap = gapSet.has(currentKey);

    // Filter months based on min/max constraints
    const availableMonths = MONTH_OPTIONS.filter((m) => {
        if (year === minYear && minMonth && m.value < minMonth) return false;
        if (year === maxYear && maxMonth && m.value > maxMonth) return false;
        return true;
    });

    // Mark gap months as disabled
    const monthsWithGapInfo = availableMonths.map((m) => {
        const key = `${year}-${String(m.value).padStart(2, '0')}`;
        return {
            ...m,
            inGap: gapSet.has(key),
        };
    });

    const selectStyle: React.CSSProperties = {
        fontFamily: 'var(--font-family)',
        fontSize: '16px',
        padding: '12px 14px',
        backgroundColor: 'var(--color-bg)',
        border: `1.5px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-input)',
        color: 'var(--color-text-primary)',
        outline: 'none',
        cursor: 'pointer',
        transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        paddingRight: '36px',
        flex: 1,
        minWidth: 0,
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
                htmlFor={`${baseId}-month`}
                style={{
                    fontSize: 'var(--font-size-label)',
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)',
                    fontFamily: 'var(--font-family)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                }}
            >
                {label}
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
                <select
                    id={`${baseId}-month`}
                    value={month}
                    onChange={(e) => onMonthChange(Number(e.target.value))}
                    style={selectStyle}
                    aria-label={`${label} — Mes`}
                >
                    {monthsWithGapInfo.map((m) => (
                        <option
                            key={m.value}
                            value={m.value}
                            disabled={m.inGap}
                        >
                            {m.label}{m.inGap ? ' (sin datos)' : ''}
                        </option>
                    ))}
                </select>
                <select
                    id={`${baseId}-year`}
                    value={year}
                    onChange={(e) => onYearChange(Number(e.target.value))}
                    style={selectStyle}
                    aria-label={`${label} — Año`}
                >
                    {years.map((y) => (
                        <option
                            key={y}
                            value={y}
                            disabled={isYearFullyInGap(y) || y === 2016}
                        >
                            {y}{isYearFullyInGap(y) || y === 2016 ? ' (sin datos)' : ''}
                        </option>
                    ))}
                </select>
            </div>

            {/* Gap warning */}
            {isCurrentInGap && !error && (
                <span
                    role="status"
                    style={{
                        fontSize: '13px',
                        color: 'var(--color-warning)',
                        fontFamily: 'var(--font-family)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    Sin datos oficiales para este período (INDEC intervenido)
                </span>
            )}

            {error && (
                <span
                    role="alert"
                    style={{
                        fontSize: '13px',
                        color: 'var(--color-error)',
                        fontFamily: 'var(--font-family)',
                    }}
                >
                    {error}
                </span>
            )}
        </div>
    );
}
