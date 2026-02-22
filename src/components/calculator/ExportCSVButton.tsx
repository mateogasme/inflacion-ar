'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';
import type { IPCEntry } from '@/lib/ipc-data';

interface ExportCSVButtonProps {
    series: IPCEntry[];
    startDate: string;
    endDate: string;
    fullWidth?: boolean;
}

export default function ExportCSVButton({
    series,
    startDate,
    endDate,
    fullWidth,
}: ExportCSVButtonProps) {
    const handleExport = () => {
        trackEvent('export_clicked', { start: startDate, end: endDate });

        // Build CSV content
        const headers = 'Periodo,IPC';
        const rows = series.map((e) => `${e.date},${e.value}`);
        const csv = [headers, ...rows].join('\n');

        // Create and download file
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ipc-argentina_${startDate}_${endDate}.csv`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Button
            variant="secondary"
            size="sm"
            fullWidth={fullWidth}
            onClick={handleExport}
            aria-label="Descargar datos IPC en formato CSV"
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Exportar CSV
        </Button>
    );
}
