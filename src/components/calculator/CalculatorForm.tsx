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
    isLoading?: boolean;
}

export default function CalculatorForm({
    onCalculate,
    minDate = { year: 2016, month: 12 },
    maxDate = { year: 2026, month: 1 },
    isLoading = false,
}: CalculatorFormProps) {
    const [amountStr, setAmountStr] = useState('');
    const [originMonth, setOriginMonth] = useState(minDate.month);
    const [originYear, setOriginYear] = useState(minDate.year);
    const [destMonth, setDestMonth] = useState(maxDate.month);
    const [destYear, setDestYear] = useState(maxDate.year);
    const [errors, setErrors] = useState<Record<string, string>>({});

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

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return null;

        return {
            amount: amount!,
            originMonth,
            originYear,
            destMonth,
            destYear,
        };
    }, [amountStr, originMonth, originYear, destMonth, destYear, minDate, maxDate]);

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
                    error={errors.origin}
                />

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
