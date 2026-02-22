'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import CalculatorForm from '@/components/calculator/CalculatorForm';
import type { FormData } from '@/components/calculator/CalculatorForm';
import ResultPanel from '@/components/calculator/ResultPanel';
import SummaryTable from '@/components/calculator/SummaryTable';
import IPCChart from '@/components/charts/IPCChart';
import MethodologySection from '@/components/calculator/MethodologySection';
import CopyResultButton from '@/components/calculator/CopyResultButton';
import ExportCSVButton from '@/components/calculator/ExportCSVButton';
import ShareLinkButton from '@/components/calculator/ShareLinkButton';
import FAQ from '@/components/seo/FAQ';
import SchemaOrg from '@/components/seo/SchemaOrg';
import AdSlot from '@/components/ads/AdSlot';
import Card from '@/components/ui/Card';
import { calculate } from '@/lib/calculations';
import type { CalculationResult } from '@/lib/calculations';
import { loadIPCData, getIPCValue, getSeriesSlice, parseDateKey, buildDateKey } from '@/lib/ipc-data';
import type { IPCDataset, IPCEntry } from '@/lib/ipc-data';
import { generateCopyText } from '@/lib/format';

export default function CalculadoraArgentinaPage() {
    const searchParams = useSearchParams();
    const [ipcData, setIpcData] = useState<IPCDataset | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<CalculationResult | null>(null);
    const [formData, setFormData] = useState<FormData | null>(null);
    const [chartSeries, setChartSeries] = useState<IPCEntry[]>([]);
    const autoCalcDone = useRef(false);
    const resultRef = useRef<HTMLDivElement>(null);

    // Parse URL query params for deep linking
    const urlParams = {
        monto: searchParams?.get('monto') || undefined,
        desde: searchParams?.get('desde') || undefined,
        hasta: searchParams?.get('hasta') || undefined,
    };

    // Derive initial form data from URL params
    const initialFormData = urlParams.monto ? {
        amount: urlParams.monto,
        originMonth: urlParams.desde ? parseInt(urlParams.desde.split('-')[1]) : undefined,
        originYear: urlParams.desde ? parseInt(urlParams.desde.split('-')[0]) : undefined,
        destMonth: urlParams.hasta ? parseInt(urlParams.hasta.split('-')[1]) : undefined,
        destYear: urlParams.hasta ? parseInt(urlParams.hasta.split('-')[0]) : undefined,
    } : undefined;

    // Load IPC data on mount
    useEffect(() => {
        loadIPCData()
            .then((data) => {
                setIpcData(data);
                const recentSeries = data.series.filter(e => e.date >= '2021-01');
                setChartSeries(recentSeries.length > 0 ? recentSeries : data.series.slice(-60));
                setIsLoading(false);
            })
            .catch(() => {
                setError('No se pudieron cargar los datos de IPC. Intentá recargar la página.');
                setIsLoading(false);
            });
    }, []);

    const handleCalculate = useCallback(
        (data: FormData) => {
            if (!ipcData) return;

            setError(null);
            setFormData(data);

            const ipcOrigin = getIPCValue(ipcData.series, data.originYear, data.originMonth);
            const ipcDest = getIPCValue(ipcData.series, data.destYear, data.destMonth);

            if (ipcOrigin === null) {
                setError(
                    `No hay datos de IPC para ${data.originMonth}/${data.originYear}. Es posible que el INDEC aún no haya publicado ese dato o que caiga en el período sin datos oficiales (2014–2016).`
                );
                return;
            }

            if (ipcDest === null) {
                setError(
                    `No hay datos de IPC para ${data.destMonth}/${data.destYear}. Es posible que el INDEC aún no haya publicado ese dato o que caiga en el período sin datos oficiales (2014–2016).`
                );
                return;
            }

            const calcResult = calculate(
                data.amount,
                ipcOrigin,
                ipcDest,
                { year: data.originYear, month: data.originMonth },
                { year: data.destYear, month: data.destMonth }
            );

            setResult(calcResult);

            // Smooth scroll to result
            setTimeout(() => {
                resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);

            // Update URL without navigation
            const url = new URL(window.location.href.split('?')[0]);
            url.searchParams.set('monto', String(data.amount));
            url.searchParams.set('desde', buildDateKey(data.originYear, data.originMonth));
            url.searchParams.set('hasta', buildDateKey(data.destYear, data.destMonth));
            window.history.replaceState({}, '', url.toString());

            // Update chart
            const startKey = buildDateKey(
                Math.min(data.originYear, data.destYear),
                data.originYear < data.destYear
                    ? data.originMonth
                    : data.originYear === data.destYear
                        ? Math.min(data.originMonth, data.destMonth)
                        : data.destMonth
            );
            const endKey = buildDateKey(
                Math.max(data.originYear, data.destYear),
                data.originYear > data.destYear
                    ? data.originMonth
                    : data.originYear === data.destYear
                        ? Math.max(data.originMonth, data.destMonth)
                        : data.destMonth
            );

            const slice = getSeriesSlice(ipcData.series, startKey, endKey);
            setChartSeries(slice.length > 0 ? slice : ipcData.series.slice(-60));
        },
        [ipcData]
    );

    // Auto-calculate from URL params when data is loaded
    useEffect(() => {
        if (!ipcData || isLoading || autoCalcDone.current) return;
        if (!urlParams.monto || !urlParams.desde || !urlParams.hasta) return;

        const amount = parseFloat(urlParams.monto);
        const [oy, om] = urlParams.desde.split('-').map(Number);
        const [dy, dm] = urlParams.hasta.split('-').map(Number);

        if (!isNaN(amount) && amount > 0 && oy && om && dy && dm) {
            autoCalcDone.current = true;
            handleCalculate({ amount, originYear: oy, originMonth: om, destYear: dy, destMonth: dm });
        }
    }, [ipcData, isLoading, urlParams, handleCalculate]);

    // Get date range
    const minDate = ipcData
        ? parseDateKey(ipcData.series[0].date)
        : { year: 1943, month: 1 };
    const maxDate = ipcData
        ? parseDateKey(ipcData.series[ipcData.series.length - 1].date)
        : { year: 2026, month: 1 };

    const gapMonths = ipcData?.gapMonths || [];

    const originDateKey = formData
        ? buildDateKey(formData.originYear, formData.originMonth)
        : '';
    const destDateKey = formData
        ? buildDateKey(formData.destYear, formData.destMonth)
        : '';



    return (
        <>
            <SchemaOrg />

            {/* Hero */}
            <section
                style={{
                    paddingTop: '48px',
                    paddingBottom: '24px',
                    textAlign: 'center',
                }}
            >
                <div className="container">
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '100px',
                            padding: '6px 14px',
                            marginBottom: '20px',
                            fontSize: '13px',
                            fontWeight: 500,
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--color-primary-action)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        Datos oficiales · INDEC · Desde 1943
                    </div>

                    <h1 style={{ marginBottom: '16px', maxWidth: '700px', margin: '0 auto 16px' }}>
                        Calculadora de Inflación{' '}
                        <span style={{ color: 'var(--color-primary-action)' }}>Argentina</span>
                    </h1>
                    <p
                        style={{
                            fontSize: '18px',
                            color: 'var(--color-text-secondary)',
                            maxWidth: '600px',
                            margin: '0 auto',
                            lineHeight: 1.6,
                        }}
                    >
                        Ajustá cualquier monto por inflación usando el IPC oficial del INDEC.
                        Series históricas desde 1943 hasta hoy.
                    </p>
                </div>
            </section>

            {/* Calculator + Ad Layout */}
            <section className="container" style={{ paddingBottom: '32px' }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: '24px',
                        maxWidth: '900px',
                        margin: '0 auto',
                    }}
                >
                    {/* Main calculator area */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(0, 1fr) 300px',
                            gap: '24px',
                        }}
                        className="calc-grid"
                    >
                        {/* Form + Results */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <Card padding="lg">
                                {isLoading ? (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '48px 0',
                                            gap: '12px',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                border: '3px solid var(--color-border)',
                                                borderTopColor: 'var(--color-primary-action)',
                                                borderRadius: '50%',
                                                animation: 'spin 0.7s linear infinite',
                                            }}
                                        />
                                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                                            Cargando datos de IPC…
                                        </p>
                                    </div>
                                ) : (
                                    <CalculatorForm
                                        onCalculate={handleCalculate}
                                        minDate={minDate}
                                        maxDate={maxDate}
                                        gapMonths={gapMonths}
                                        isLoading={false}
                                        initialData={initialFormData}
                                    />
                                )}
                            </Card>

                            {/* Error */}
                            {error && (
                                <Card
                                    padding="md"
                                    style={{
                                        backgroundColor: '#FEF2F2',
                                        border: '1px solid #FECACA',
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="var(--color-error)"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{ flexShrink: 0, marginTop: '1px' }}
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="15" y1="9" x2="9" y2="15" />
                                            <line x1="9" y1="9" x2="15" y2="15" />
                                        </svg>
                                        <p style={{ fontSize: '14px', color: 'var(--color-error)', lineHeight: 1.5 }}>
                                            {error}
                                        </p>
                                    </div>
                                </Card>
                            )}

                            {/* Result */}
                            {result && formData && (
                                <div ref={resultRef} style={{ scrollMarginTop: '140px' }}>
                                    <ResultPanel
                                        result={result}
                                        originalAmount={formData.amount}
                                        originDate={{ year: formData.originYear, month: formData.originMonth }}
                                        destDate={{ year: formData.destYear, month: formData.destMonth }}
                                    />

                                    {/* Actions */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                        gap: '8px',
                                        marginTop: '16px',
                                        marginBottom: '16px'
                                    }}>
                                        <CopyResultButton
                                            fullWidth
                                            text={generateCopyText(
                                                formData.amount,
                                                originDateKey,
                                                destDateKey,
                                                result.adjustedAmount,
                                                result.cumulativeInflation,
                                                result.annualizedInflation
                                            )}
                                        />
                                        <ExportCSVButton
                                            fullWidth
                                            series={chartSeries}
                                            startDate={originDateKey}
                                            endDate={destDateKey}
                                        />
                                        <ShareLinkButton
                                            fullWidth
                                            amount={formData.amount}
                                            originDate={originDateKey}
                                            destDate={destDateKey}
                                        />
                                    </div>

                                    <SummaryTable
                                        result={result}
                                        originDate={{ year: formData.originYear, month: formData.originMonth }}
                                        destDate={{ year: formData.destYear, month: formData.destMonth }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Desktop Ad Sidebar */}
                        <div className="ad-sidebar">
                            <AdSlot slot="sidebar-1" format="vertical" minHeight={250} />
                        </div>
                    </div>

                    {/* Chart */}
                    {chartSeries.length > 0 && (
                        <IPCChart
                            series={chartSeries}
                            highlightStart={originDateKey}
                            highlightEnd={destDateKey}
                        />
                    )}

                    {/* Methodology */}
                    {ipcData && (
                        <MethodologySection
                            source={ipcData.source}
                            sourceUrl={ipcData.sourceUrl}
                            lastUpdated={ipcData.lastUpdated}
                            base="Diciembre 2016"
                            segments={ipcData.segments}
                            gapMonths={ipcData.gapMonths}
                        />
                    )}


                    {/* FAQ */}
                    <FAQ />

                    {/* Bottom Ad */}
                    <AdSlot slot="bottom-1" format="horizontal" minHeight={90} />
                </div>
            </section>

            {/* Page-specific styles */}
            <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .calc-grid {
          grid-template-columns: minmax(0, 1fr) 300px;
        }

        @media (max-width: 768px) {
          .calc-grid {
            grid-template-columns: 1fr !important;
          }
          .ad-sidebar {
            display: none;
          }
        }
      `}</style>
        </>
    );
}
