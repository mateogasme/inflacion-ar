import type { Metadata } from 'next';
import React from 'react';
import Card from '@/components/ui/Card';

export const metadata: Metadata = {
    title: 'Metodología — Cómo calculamos la inflación',
    description:
        'Explicamos la metodología de ajuste por inflación usando el IPC del INDEC. Fórmulas, fuentes de datos y definiciones de inflación acumulada y CAGR.',
};

export default function MetodologiaPage() {
    const sectionStyle: React.CSSProperties = {
        marginBottom: '32px',
    };

    const headingStyle: React.CSSProperties = {
        fontSize: '22px',
        fontWeight: 600,
        color: 'var(--color-primary)',
        marginBottom: '12px',
        lineHeight: 1.3,
    };

    const bodyStyle: React.CSSProperties = {
        fontSize: '16px',
        lineHeight: 1.7,
        color: 'var(--color-text-secondary)',
    };

    return (
        <div className="container" style={{ paddingTop: '48px', paddingBottom: '64px' }}>
            <div style={{ maxWidth: '720px', margin: '0 auto' }}>
                <h1
                    style={{
                        marginBottom: '16px',
                    }}
                >
                    Metodología
                </h1>
                <p
                    style={{
                        ...bodyStyle,
                        fontSize: '18px',
                        marginBottom: '40px',
                    }}
                >
                    Explicamos cómo funciona la calculadora, qué datos usa, y cómo interpretamos los resultados.
                    La transparencia metodológica es fundamental para que los resultados sean auditables.
                </p>

                {/* ── Qué es el IPC ── */}
                <section style={sectionStyle}>
                    <h2 style={headingStyle}>¿Qué es el IPC?</h2>
                    <div style={bodyStyle}>
                        <p style={{ marginBottom: '12px' }}>
                            El <strong style={{ color: 'var(--color-text-primary)' }}>Índice de Precios al Consumidor (IPC)</strong> es
                            un indicador económico que mide la variación promedio de los precios de un conjunto de bienes y servicios
                            representativos del consumo de los hogares urbanos.
                        </p>
                        <p style={{ marginBottom: '12px' }}>
                            En Argentina, el IPC es publicado mensualmente por el{' '}
                            <a href="https://www.indec.gob.ar/indec/web/Nivel4-Tema-3-5-31" target="_blank" rel="noopener noreferrer">
                                INDEC (Instituto Nacional de Estadística y Censos)
                            </a>
                            . La serie actual tiene como base diciembre 2016 = 100.
                        </p>
                        <p>
                            Cuando el IPC pasa de 100 a 200, significa que los precios promedio se duplicaron:
                            lo que antes costaba $100 ahora cuesta $200.
                        </p>
                    </div>
                </section>

                {/* ── Fórmulas ── */}
                <section style={sectionStyle}>
                    <h2 style={headingStyle}>Fórmulas de cálculo</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Card padding="md" variant="surface">
                            <p
                                style={{
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    color: 'var(--color-primary)',
                                    marginBottom: '8px',
                                }}
                            >
                                Monto ajustado por inflación
                            </p>
                            <div
                                style={{
                                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                                    fontSize: '15px',
                                    color: 'var(--color-text-primary)',
                                    lineHeight: 1.8,
                                }}
                            >
                                Monto<sub>ajustado</sub> = Monto<sub>original</sub> × (IPC<sub>destino</sub> / IPC<sub>origen</sub>)
                            </div>
                        </Card>

                        <Card padding="md" variant="surface">
                            <p
                                style={{
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    color: 'var(--color-primary)',
                                    marginBottom: '8px',
                                }}
                            >
                                Inflación acumulada
                            </p>
                            <div
                                style={{
                                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                                    fontSize: '15px',
                                    color: 'var(--color-text-primary)',
                                    lineHeight: 1.8,
                                }}
                            >
                                Inflación (%) = (IPC<sub>destino</sub> / IPC<sub>origen</sub> − 1) × 100
                            </div>
                            <p style={{ ...bodyStyle, fontSize: '14px', marginTop: '8px' }}>
                                Representa el cambio total de precios entre dos momentos.
                            </p>
                        </Card>

                        <Card padding="md" variant="surface">
                            <p
                                style={{
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    color: 'var(--color-primary)',
                                    marginBottom: '8px',
                                }}
                            >
                                Inflación promedio anual (CAGR)
                            </p>
                            <div
                                style={{
                                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                                    fontSize: '15px',
                                    color: 'var(--color-text-primary)',
                                    lineHeight: 1.8,
                                }}
                            >
                                CAGR (%) = ((IPC<sub>destino</sub> / IPC<sub>origen</sub>)<sup>12/meses</sup> − 1) × 100
                            </div>
                            <p style={{ ...bodyStyle, fontSize: '14px', marginTop: '8px' }}>
                                CAGR (Compound Annual Growth Rate) expresa la inflación como un promedio anualizado.
                                Útil para comparar períodos de distinta duración.
                            </p>
                        </Card>
                    </div>
                </section>

                {/* ── Inflación acumulada vs anual ── */}
                <section style={sectionStyle}>
                    <h2 style={headingStyle}>Inflación acumulada vs. promedio anual</h2>
                    <div style={bodyStyle}>
                        <p style={{ marginBottom: '12px' }}>
                            La <strong style={{ color: 'var(--color-text-primary)' }}>inflación acumulada</strong> mide
                            el cambio total de precios en un período. Si los precios subieron de 100 a 300 en 3 años,
                            la inflación acumulada es del 200%.
                        </p>
                        <p style={{ marginBottom: '12px' }}>
                            El <strong style={{ color: 'var(--color-text-primary)' }}>CAGR</strong> toma esa misma variación
                            y la expresa como si hubiera crecido a un ritmo constante cada año. En el ejemplo anterior,
                            el CAGR sería ~44,2% anual (porque 1,442³ ≈ 3,00).
                        </p>
                        <p>
                            El CAGR es más útil para comparar: ¿fue más alta la inflación entre 2017–2019 o entre 2020–2023?
                            La inflación acumulada no sirve para comparar períodos de distinta duración.
                        </p>
                    </div>
                </section>

                {/* ── Fuente de datos ── */}
                <section style={sectionStyle}>
                    <h2 style={headingStyle}>Fuente de datos</h2>
                    <div style={bodyStyle}>
                        <p style={{ marginBottom: '12px' }}>
                            Usamos exclusivamente datos oficiales publicados por el INDEC, obtenidos a través de la{' '}
                            <a
                                href="https://datosgobar.github.io/series-tiempo-ar-api/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                API de Series de Tiempo de datos.gob.ar
                            </a>
                            .
                        </p>
                        <p style={{ marginBottom: '12px' }}>
                            Serie utilizada: <code style={{ backgroundColor: 'var(--color-surface)', padding: '2px 6px', borderRadius: '4px', fontSize: '14px' }}>
                                148.3_INIVELNAL_DICI_M_26</code> — IPC Nivel General Nacional, base diciembre 2016 = 100, frecuencia mensual.
                        </p>
                        <p>
                            No utilizamos datos estimados, interpolados ni de fuentes no oficiales.
                            Si un mes no tiene dato publicado, se indica como faltante.
                        </p>
                    </div>
                </section>

                {/* ── Limitaciones ── */}
                <section style={sectionStyle}>
                    <h2 style={headingStyle}>Limitaciones</h2>
                    <div style={bodyStyle}>
                        <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <li>La serie actual del INDEC comienza en diciembre de 2016. No cubrimos períodos anteriores.</li>
                            <li>El IPC mide promedios: la inflación individual puede variar según hábitos de consumo y región.</li>
                            <li>Los datos se actualizan tras cada publicación del INDEC (generalmente en la primera quincena del mes).</li>
                            <li>Esta herramienta tiene fines informativos. Para uso contractual o legal, verificá con las publicaciones oficiales del INDEC.</li>
                        </ul>
                    </div>
                </section>

                {/* Back link */}
                <div style={{ marginTop: '40px' }}>
                    <a
                        href="/calculadora-inflacion/argentina"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontWeight: 500,
                            fontSize: '15px',
                        }}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        Volver a la calculadora
                    </a>
                </div>
            </div>
        </div>
    );
}
