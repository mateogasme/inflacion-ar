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
    error?: string;
    id?: string;
}

export default function MonthYearPicker({
    label,
    month,
    year,
    onMonthChange,
    onYearChange,
    minYear = 2016,
    maxYear = 2026,
    minMonth,
    maxMonth,
    error,
    id,
}: MonthYearPickerProps) {
    const baseId = id || label.toLowerCase().replace(/\s+/g, '-');

    const years: number[] = [];
    for (let y = minYear; y <= maxYear; y++) {
        years.push(y);
    }

    // Filter months based on min/max constraints
    const availableMonths = MONTH_OPTIONS.filter((m) => {
        if (year === minYear && minMonth && m.value < minMonth) return false;
        if (year === maxYear && maxMonth && m.value > maxMonth) return false;
        return true;
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
                    {availableMonths.map((m) => (
                        <option key={m.value} value={m.value}>
                            {m.label}
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
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>
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
