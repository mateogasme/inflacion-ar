'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import { formatNumber, formatPercent, formatMonthYear, formatIPCValue, formatLargeNumber, formatLargePercent } from '@/lib/format';
import ExpandableValue from '@/components/ui/ExpandableValue';
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
            value: formatIPCValue(result.ipcOrigin),
            fullValue: undefined as string | undefined,
        },
        {
            label: `IPC ${formatMonthYear(destDate.year, destDate.month)}`,
            value: formatIPCValue(result.ipcDest),
            fullValue: undefined as string | undefined,
        },
        {
            label: 'Ratio (IPC destino / IPC origen)',
            value: formatLargeNumber(result.ratio, 6),
            fullValue: Math.abs(result.ratio) >= 1_000_000 ? formatNumber(result.ratio, 6) : undefined,
        },
        {
            label: 'Variación porcentual',
            value: `${result.cumulativeInflation >= 0 ? '+' : ''}${formatLargePercent(result.cumulativeInflation)}`,
            fullValue: Math.abs(result.cumulativeInflation) >= 1_000_000
                ? `${result.cumulativeInflation >= 0 ? '+' : ''}${formatPercent(result.cumulativeInflation)}`
                : undefined,
            highlight: true,
        },
        {
            label: 'Período (meses)',
            value: String(result.months),
            fullValue: undefined as string | undefined,
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
                                    {row.fullValue ? (
                                        <ExpandableValue
                                            compact={row.value}
                                            full={row.fullValue}
                                            color={row.highlight
                                                ? result.cumulativeInflation >= 0
                                                    ? 'var(--color-error)'
                                                    : 'var(--color-success)'
                                                : 'var(--color-primary-action)'
                                            }
                                        />
                                    ) : row.value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
