import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadIPCData, getIPCValue, parseDateKey } from '@/lib/ipc-data';
import { calculate } from '@/lib/calculations';
import { formatPercent, formatNumber, formatIPCValue } from '@/lib/format';
import { getEra } from '@/lib/currency-eras';
import Card from '@/components/ui/Card';
import ExpandableValue from '@/components/ui/ExpandableValue';

interface PageProps {
    params: Promise<{ anio: string }>;
}

const GAP_YEARS = new Set([2014, 2015, 2016]);

export async function generateStaticParams() {
    const data = await loadIPCData();
    const years = new Set(data.series.map(e => e.date.split('-')[0]));
    return Array.from(years)
        .filter(y => parseInt(y) >= 1943 && !GAP_YEARS.has(parseInt(y)))
        .map(anio => ({ anio }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { anio } = await params;
    const year = parseInt(anio);

    return {
        title: `Inflación en Argentina en ${year} — Datos oficiales INDEC`,
        description: `Evolución del IPC y la inflación acumulada en Argentina durante ${year}. Datos oficiales del INDEC con cálculos detallados y gráficos interactivos.`,
        openGraph: {
            title: `Inflación Argentina ${year}`,
            description: `Conocé cuánto subieron los precios en ${year} según el IPC oficial del INDEC.`,
        },
    };
}

export default async function InflacionAnioPage({ params }: PageProps) {
    const { anio } = await params;
    const year = parseInt(anio);

    if (isNaN(year) || year < 1943 || year > 2030 || GAP_YEARS.has(year)) {
        notFound();
    }

    const data = await loadIPCData();

    // Find January and December IPC for this year
    const ipcJan = getIPCValue(data.series, year, 1);
    const ipcDec = getIPCValue(data.series, year, 12);

    // Also get December of prior year for year-over-year calculation
    const ipcPrevDec = getIPCValue(data.series, year - 1, 12);

    // Monthly data for this year
    const yearEntries = data.series.filter(e => e.date.startsWith(`${year}-`));

    const era = getEra(year, 1);
    const minDate = parseDateKey(data.series[0].date);
    const maxDate = parseDateKey(data.series[data.series.length - 1].date);

    const getExactIpc = (val: number) => new Intl.NumberFormat('es-AR', { maximumFractionDigits: 20 }).format(val);

    // Compute annual inflation
    let annualInflation: string | null = null;
    let annualResult = null;
    if (ipcJan && ipcDec) {
        annualResult = calculate(1, ipcJan, ipcDec, { year, month: 1 }, { year, month: 12 });
        annualInflation = formatPercent(annualResult.cumulativeInflation);
    } else if (ipcPrevDec && ipcDec) {
        annualResult = calculate(1, ipcPrevDec, ipcDec, { year: year - 1, month: 12 }, { year, month: 12 });
        annualInflation = formatPercent(annualResult.cumulativeInflation);
    }

    // Year-over-year from prev Dec to this Dec
    let yoyInflation: string | null = null;
    if (ipcPrevDec && ipcDec) {
        const yoy = ((ipcDec / ipcPrevDec) - 1) * 100;
        yoyInflation = formatPercent(yoy);
    }

    // Adjacent years for navigation
    const prevYear = year > minDate.year ? year - 1 : null;
    const nextYear = year < maxDate.year ? year + 1 : null;
    // Skip gap years
    const adjPrev = prevYear && GAP_YEARS.has(prevYear) ? prevYear - 1 : prevYear;
    const adjNext = nextYear && GAP_YEARS.has(nextYear) ? nextYear + 1 : nextYear;

    return (
        <section style={{ paddingTop: '48px', paddingBottom: '48px' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                {/* Breadcrumb */}
                <nav style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                    <a href="/inflacion-por-anio" style={{ color: 'var(--color-primary-action)', textDecoration: 'none' }}>
                        Inflación por año
                    </a>
                    {' › '}
                    <span>{year}</span>
                </nav>

                <h1 style={{ marginBottom: '8px' }}>
                    Inflación en Argentina en{' '}
                    <span style={{ color: 'var(--color-primary-action)' }}>{year}</span>
                </h1>

                <p style={{
                    fontSize: '18px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: '32px',
                }}>
                    Evolución del Índice de Precios al Consumidor (IPC) durante {year},
                    según datos oficiales del INDEC.
                    {era.code !== 'ARS' && ` En ${year} la moneda vigente era el ${era.name} (${era.symbol}).`}
                </p>

                {/* Key metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                    {yoyInflation && (
                        <Card padding="md" variant="surface">
                            <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                                Inflación anual {year}
                            </p>
                            <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-error)', lineHeight: 1.2 }}>
                                +{yoyInflation}
                            </p>
                            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                                Dic {year - 1} → Dic {year}
                            </p>
                        </Card>
                    )}
                    {ipcJan && (
                        <Card padding="md" variant="surface">
                            <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                                IPC Enero {year}
                            </p>
                            <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
                                {ipcJan < 0.01 ? (
                                    <ExpandableValue compact={formatIPCValue(ipcJan)} full={getExactIpc(ipcJan)} color="var(--color-text-primary)" />
                                ) : (
                                    formatIPCValue(ipcJan)
                                )}
                            </p>
                        </Card>
                    )}
                    {ipcDec && (
                        <Card padding="md" variant="surface">
                            <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                                IPC Diciembre {year}
                            </p>
                            <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
                                {ipcDec < 0.01 ? (
                                    <ExpandableValue compact={formatIPCValue(ipcDec)} full={getExactIpc(ipcDec)} color="var(--color-text-primary)" />
                                ) : (
                                    formatIPCValue(ipcDec)
                                )}
                            </p>
                        </Card>
                    )}
                </div>

                {/* Monthly IPC table */}
                {yearEntries.length > 0 && (
                    <Card padding="sm" style={{ overflow: 'hidden', marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-primary)', padding: '16px 16px 8px' }}>
                            IPC mensual — {year}
                        </h2>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }} role="table">
                                <thead>
                                    <tr>
                                        <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', fontWeight: 600, borderBottom: '2px solid var(--color-border)' }}>Mes</th>
                                        <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', fontWeight: 600, borderBottom: '2px solid var(--color-border)' }}>IPC</th>
                                        <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', fontWeight: 600, borderBottom: '2px solid var(--color-border)' }}>Var. mensual</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {yearEntries.map((entry, i) => {
                                        const month = parseInt(entry.date.split('-')[1]);
                                        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

                                        // Monthly variation
                                        let monthlyVar: string | null = null;
                                        if (i > 0) {
                                            const prev = yearEntries[i - 1].value;
                                            if (prev > 0) {
                                                monthlyVar = formatPercent(((entry.value / prev) - 1) * 100);
                                            }
                                        }

                                        return (
                                            <tr key={entry.date}>
                                                <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--color-border)', fontSize: '14px', color: 'var(--color-text-primary)' }}>
                                                    {monthNames[month - 1]}
                                                </td>
                                                <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--color-border)', fontSize: '14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                                    {entry.value < 0.01 ? (
                                                        <ExpandableValue compact={formatIPCValue(entry.value)} full={getExactIpc(entry.value)} color="var(--color-text-primary)" />
                                                    ) : (
                                                        formatIPCValue(entry.value)
                                                    )}
                                                </td>
                                                <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--color-border)', fontSize: '14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--color-error)' }}>
                                                    {monthlyVar ? `+${monthlyVar}` : '—'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {/* CTA */}
                <Card padding="lg" style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                        ¿Querés calcular cuánto vale un monto de {year} en pesos de hoy?
                    </p>
                    <a
                        href={`/?desde=${year}-01&hasta=${maxDate.year}-${String(maxDate.month).padStart(2, '0')}&monto=1000`}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '14px 28px',
                            backgroundColor: 'var(--color-primary-action)',
                            color: '#FFFFFF',
                            borderRadius: 'var(--radius-button)',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '16px',
                            transition: 'background-color 0.15s ease',
                        }}
                    >
                        Calcular ajuste por inflación →
                    </a>
                </Card>

                {/* Year navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {adjPrev ? (
                        <a href={`/inflacion-por-anio/${adjPrev}`} style={{ color: 'var(--color-primary-action)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                            ← Inflación {adjPrev}
                        </a>
                    ) : <span />}
                    <a href="/" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '13px' }}>
                        Volver a la calculadora
                    </a>
                    {adjNext ? (
                        <a href={`/inflacion-por-anio/${adjNext}`} style={{ color: 'var(--color-primary-action)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                            Inflación {adjNext} →
                        </a>
                    ) : <span />}
                </div>
            </div>
        </section>
    );
}
