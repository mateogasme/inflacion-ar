'use client';

import React, { useState, useCallback } from 'react';
import Input from '@/components/ui/Input';
import MonthYearPicker from '@/components/ui/MonthYearPicker';
import Button from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';
import { parseNumber } from '@/lib/format';

export interface FormData {
    amount: number;
    originMonth: number;
    originYear: number;
    destMonth: number;
    destYear: number;
}

interface CalculatorFormProps {
    onCalculate: (data: FormData) => void;
    minDate?: { year: number; month: number };
    maxDate?: { year: number; month: number };
    gapMonths?: string[];
    isLoading?: boolean;
    initialData?: { amount?: string; originMonth?: number; originYear?: number; destMonth?: number; destYear?: number };
}

export default function CalculatorForm({
    onCalculate,
    minDate = { year: 1943, month: 1 },
    maxDate = { year: 2026, month: 1 },
    gapMonths = [],
    isLoading = false,
    initialData,
}: CalculatorFormProps) {
    const [amountStr, setAmountStr] = useState(initialData?.amount || '');
    const [originMonth, setOriginMonth] = useState(initialData?.originMonth || minDate.month);
    const [originYear, setOriginYear] = useState(initialData?.originYear || minDate.year);
    const [destMonth, setDestMonth] = useState(initialData?.destMonth || maxDate.month);
    const [destYear, setDestYear] = useState(initialData?.destYear || maxDate.year);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const gapSet = new Set(gapMonths);

    const validate = useCallback((): FormData | null => {
        const newErrors: Record<string, string> = {};

        const amount = parseNumber(amountStr);
        if (amount === null || amount <= 0) {
            newErrors.amount = 'Ingresá un monto válido mayor a 0';
        }

        // Check dates are within range
        const originKey = originYear * 100 + originMonth;
        const destKey = destYear * 100 + destMonth;
        const minKey = minDate.year * 100 + minDate.month;
        const maxKey = maxDate.year * 100 + maxDate.month;

        if (originKey < minKey || originKey > maxKey) {
            newErrors.origin = `Fecha fuera de rango (${minDate.month}/${minDate.year} — ${maxDate.month}/${maxDate.year})`;
        }
        if (destKey < minKey || destKey > maxKey) {
            newErrors.dest = `Fecha fuera de rango (${minDate.month}/${minDate.year} — ${maxDate.month}/${maxDate.year})`;
        }

        // Check gap
        const originDateKey = `${originYear}-${String(originMonth).padStart(2, '0')}`;
        const destDateKey = `${destYear}-${String(destMonth).padStart(2, '0')}`;

        if (gapSet.has(originDateKey)) {
            newErrors.origin = 'No hay datos oficiales del IPC para este período (INDEC intervenido entre 2014 y 2016)';
        }
        if (gapSet.has(destDateKey)) {
            newErrors.dest = 'No hay datos oficiales del IPC para este período (INDEC intervenido entre 2014 y 2016)';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return null;

        return {
            amount: amount!,
            originMonth,
            originYear,
            destMonth,
            destYear,
        };
    }, [amountStr, originMonth, originYear, destMonth, destYear, minDate, maxDate, gapSet]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = validate();
        if (data) {
            trackEvent('calculate_clicked', {
                amount: data.amount,
                origin: `${data.originYear}-${data.originMonth}`,
                dest: `${data.destYear}-${data.destMonth}`,
            });
            onCalculate(data);
        }
    };

    const handleDateChange = () => {
        trackEvent('date_range_changed');
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Amount */}
                <Input
                    label="Monto en pesos (ARS)"
                    type="text"
                    inputMode="decimal"
                    placeholder="Ej: 10.000"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    error={errors.amount}
                    autoComplete="off"
                />

                {/* Origin Date */}
                <MonthYearPicker
                    label="Fecha de origen"
                    month={originMonth}
                    year={originYear}
                    onMonthChange={(m) => { setOriginMonth(m); handleDateChange(); }}
                    onYearChange={(y) => { setOriginYear(y); handleDateChange(); }}
                    minYear={minDate.year}
                    maxYear={maxDate.year}
                    minMonth={minDate.month}
                    maxMonth={maxDate.month}
                    gapMonths={gapMonths}
                    error={errors.origin}
                />

                {/* Swap button */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                        type="button"
                        onClick={() => {
                            setOriginMonth(destMonth);
                            setOriginYear(destYear);
                            setDestMonth(originMonth);
                            setDestYear(originYear);
                            handleDateChange();
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: '1.5px solid var(--color-border)',
                            backgroundColor: 'var(--color-surface)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            color: 'var(--color-text-secondary)',
                        }}
                        aria-label="Invertir fechas de origen y destino"
                        title="Invertir fechas"
                        onMouseEnter={(e) => {
                            (e.currentTarget.style.borderColor) = 'var(--color-primary-action)';
                            (e.currentTarget.style.color) = 'var(--color-primary-action)';
                            (e.currentTarget.style.transform) = 'rotate(180deg)';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget.style.borderColor) = 'var(--color-border)';
                            (e.currentTarget.style.color) = 'var(--color-text-secondary)';
                            (e.currentTarget.style.transform) = 'rotate(0deg)';
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="7 3 7 21" />
                            <polyline points="3 7 7 3 11 7" />
                            <polyline points="17 21 17 3" />
                            <polyline points="13 17 17 21 21 17" />
                        </svg>
                    </button>
                </div>

                {/* Destination Date */}
                <MonthYearPicker
                    label="Fecha de destino"
                    month={destMonth}
                    year={destYear}
                    onMonthChange={(m) => { setDestMonth(m); handleDateChange(); }}
                    onYearChange={(y) => { setDestYear(y); handleDateChange(); }}
                    minYear={minDate.year}
                    maxYear={maxDate.year}
                    minMonth={minDate.month}
                    maxMonth={maxDate.month}
                    gapMonths={gapMonths}
                    error={errors.dest}
                />

                {/* Submit */}
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span
                                style={{
                                    width: '18px',
                                    height: '18px',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderTopColor: '#fff',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    animation: 'spin 0.6s linear infinite',
                                }}
                            />
                            Calculando…
                        </>
                    ) : (
                        'Calcular ajuste'
                    )}
                </Button>
            </div>

            <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </form>
    );
}
