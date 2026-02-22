import { Metadata } from 'next';
import { loadIPCData } from '@/lib/ipc-data';
import Card from '@/components/ui/Card';
import FAQ from '@/components/seo/FAQ';
import SchemaOrg from '@/components/seo/SchemaOrg';

export const metadata: Metadata = {
    title: 'Inflación Histórica por Año en Argentina — Índice Mensual',
    description: 'Explorá la inflación histórica de Argentina año por año con datos oficiales del INDEC. Evolución mensual del IPC, variaciones interanuales y cambios de signo monetario desde 1943.',
    openGraph: {
        title: 'Inflación Histórica por Año en Argentina',
        description: 'Evolución del IPC y variaciones mes a mes. Explorá el histórico de la inflación argentina.',
    }
};

export default async function InflacionPorAnioIndexPage() {
    const ipcData = await loadIPCData();

    const allYears: { year: number; isGap: boolean }[] = [];
    if (ipcData) {
        const yearSet = new Set(ipcData.series.map(e => parseInt(e.date.split('-')[0])));
        const maxYear = Math.max(...Array.from(yearSet));
        for (let y = maxYear; y >= 1943; y--) {
            const isGap = !yearSet.has(y) || y === 2014 || y === 2015 || y === 2016;
            allYears.push({ year: y, isGap });
        }
    }

    return (
        <>
            <SchemaOrg />

            {/* Hero */}
            <section
                style={{
                    paddingTop: '64px',
                    paddingBottom: '40px',
                    textAlign: 'center',
                }}
            >
                <div className="container" style={{ maxWidth: '900px' }}>
                    <h1 style={{ marginBottom: '16px', margin: '0 auto 16px' }}>
                        Inflación por <span style={{ color: 'var(--color-primary-action)' }}>Año</span>
                    </h1>
                    <p
                        style={{
                            fontSize: '18px',
                            color: 'var(--color-text-secondary)',
                            margin: '0 auto',
                            lineHeight: 1.6,
                            maxWidth: '75%'
                        }}
                    >
                        Seleccioná un año para ver la evolución mensual del Índice de Precios al Consumidor (IPC), la inflación acumulada y la variación interanual.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section style={{ paddingBottom: '64px' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <Card padding="lg" variant="surface">
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                            gap: '12px',
                        }}>
                            {allYears.map(item => {
                                if (item.isGap) {
                                    return (
                                        <a
                                            key={item.year}
                                            href="/intervencion-indec"
                                            title="¿Por qué no hay datos disponibles?"
                                            className="gap-link-card"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '16px',
                                                fontSize: '16px',
                                                fontWeight: 500,
                                                color: 'var(--color-text-secondary)',
                                                backgroundColor: 'transparent',
                                                border: '1px dashed var(--color-border)',
                                                borderRadius: '12px',
                                                opacity: 0.6,
                                                textDecoration: 'line-through',
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            {item.year}
                                        </a>
                                    );
                                }
                                return (
                                    <a
                                        key={item.year}
                                        href={`/inflacion-por-anio/${item.year}`}
                                        className="year-link-card"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '16px',
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            color: 'var(--color-primary)',
                                            backgroundColor: '#FFFFFF',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: '12px',
                                            textDecoration: 'none',
                                            transition: 'all 0.2s ease',
                                            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
                                        }}
                                    >
                                        {item.year}
                                    </a>
                                );
                            })}
                        </div>
                    </Card>

                    <div style={{ marginTop: '48px' }}>
                        <FAQ />
                    </div>
                </div>
            </section>

            <style>{`
                .year-link-card:hover {
                    border-color: var(--color-primary-action) !important;
                    color: var(--color-primary-action) !important;
                    transform: translateY(-2px) !important;
                    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08) !important;
                }
                .gap-link-card:hover {
                    opacity: 1 !important;
                    border-style: solid !important;
                    border-color: var(--color-primary-action) !important;
                    color: var(--color-primary-action) !important;
                    text-decoration: none !important;
                    transform: translateY(-1px) !important;
                }
            `}</style>
        </>
    );
}
