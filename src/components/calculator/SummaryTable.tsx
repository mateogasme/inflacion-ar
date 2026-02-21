'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import { formatNumber, formatPercent, formatMonthYear } from '@/lib/format';
import type { CalculationResult } from '@/lib/calculations';

interface SummaryTableProps {
    result: CalculationResult;
    originDate: { year: number; month: number };
    destDate: { year: number; month: number };
}

export default function SummaryTable({
    result,
    originDate,
    destDate,
}: SummaryTableProps) {
    const rows = [
        {
            label: `IPC ${formatMonthYear(originDate.year, originDate.month)}`,
            value: formatNumber(result.ipcOrigin, 2),
        },
        {
            label: `IPC ${formatMonthYear(destDate.year, destDate.month)}`,
            value: formatNumber(result.ipcDest, 2),
        },
        {
            label: 'Ratio (IPC destino / IPC origen)',
            value: formatNumber(result.ratio, 6),
        },
        {
            label: 'Variación porcentual',
            value: `${result.cumulativeInflation >= 0 ? '+' : ''}${formatPercent(result.cumulativeInflation)}`,
            highlight: true,
        },
        {
            label: 'Período (meses)',
            value: String(result.months),
        },
    ];

    const cellStyle: React.CSSProperties = {
        padding: '12px 16px',
        borderBottom: '1px solid var(--color-border)',
        fontFamily: 'var(--font-family)',
        fontSize: '15px',
    };

    return (
        <Card padding="sm" style={{ overflow: 'hidden' }}>
            <h3
                style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                    padding: '16px 16px 0',
                    marginBottom: '8px',
                }}
            >
                Resumen del cálculo
            </h3>
            <div style={{ overflowX: 'auto' }}>
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                    }}
                    role="table"
                    aria-label="Resumen detallado del cálculo de inflación"
                >
                    <thead className="sr-only">
                        <tr>
                            <th>Concepto</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i}>
                                <td
                                    style={{
                                        ...cellStyle,
                                        color: 'var(--color-text-secondary)',
                                        ...(i === rows.length - 1 && { borderBottom: 'none' }),
                                    }}
                                >
                                    {row.label}
                                </td>
                                <td
                                    style={{
                                        ...cellStyle,
                                        textAlign: 'right',
                                        fontWeight: row.highlight ? 700 : 600,
                                        color: row.highlight
                                            ? result.cumulativeInflation >= 0
                                                ? 'var(--color-error)'
                                                : 'var(--color-success)'
                                            : 'var(--color-text-primary)',
                                        fontVariantNumeric: 'tabular-nums',
                                        ...(i === rows.length - 1 && { borderBottom: 'none' }),
                                    }}
                                >
                                    {row.value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
