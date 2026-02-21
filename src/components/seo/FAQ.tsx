import React from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
    {
        question: '¿Qué es el IPC y cómo se usa para calcular la inflación?',
        answer:
            'El Índice de Precios al Consumidor (IPC) mide la variación de precios de una canasta representativa de bienes y servicios. Para calcular la inflación entre dos periodos, se compara el IPC de ambos momentos: Inflación = (IPC_destino / IPC_origen − 1) × 100. Es la medida oficial de inflación en Argentina, publicada por el INDEC.',
    },
    {
        question: '¿Qué significa "ajustar por inflación"?',
        answer:
            'Ajustar por inflación significa convertir un monto de dinero de un periodo a otro para reflejar el cambio en el poder adquisitivo. Por ejemplo, si algo costaba $1.000 en diciembre de 2016 y la inflación acumulada hasta hoy fue del 500%, ese monto equivale a $6.000 en valores actuales.',
    },
    {
        question: '¿Cuál es la diferencia entre inflación acumulada y promedio anual (CAGR)?',
        answer:
            'La inflación acumulada es el cambio total de precios entre dos fechas. El CAGR (Tasa de Crecimiento Anual Compuesta) expresa esa misma variación como un promedio anualizado, útil para comparar períodos de distinta duración. Por ejemplo, una inflación acumulada del 100% en 2 años equivale a un CAGR de ~41,4% anual.',
    },
    {
        question: '¿De dónde provienen los datos?',
        answer:
            'Usamos exclusivamente datos oficiales del INDEC (Instituto Nacional de Estadística y Censos de Argentina), específicamente la serie del IPC Nacional con base diciembre 2016 = 100. Los datos se obtienen a través de la API de Series de Tiempo de datos.gob.ar.',
    },
    {
        question: '¿Qué periodos están disponibles?',
        answer:
            'Actualmente la serie cubre desde diciembre de 2016 hasta el último dato publicado por el INDEC. El IPC se publica mensualmente, generalmente dentro de las primeras dos semanas del mes siguiente.',
    },
    {
        question: '¿Puedo confiar en los resultados para uso profesional?',
        answer:
            'Los cálculos siguen la metodología estándar de ajuste por IPC utilizada por economistas y organismos oficiales. Sin embargo, esta herramienta tiene fines informativos. Para uso contractual o legal, consultá con un profesional y verificá directamente con las publicaciones del INDEC.',
    },
];

export default function FAQ() {
    return (
        <section>
            <h2
                style={{
                    fontSize: 'var(--font-size-h3)',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                    marginBottom: '24px',
                }}
            >
                Preguntas frecuentes
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {FAQ_ITEMS.map((item, i) => (
                    <details
                        key={i}
                        style={{
                            borderBottom: i < FAQ_ITEMS.length - 1 ? '1px solid var(--color-border)' : 'none',
                        }}
                    >
                        <summary
                            style={{
                                padding: '18px 0',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: 500,
                                color: 'var(--color-text-primary)',
                                listStyle: 'none',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '12px',
                                lineHeight: 1.4,
                            }}
                        >
                            {item.question}
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="var(--color-text-secondary)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ flexShrink: 0 }}
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </summary>
                        <p
                            style={{
                                paddingBottom: '18px',
                                fontSize: '15px',
                                lineHeight: 1.7,
                                color: 'var(--color-text-secondary)',
                                paddingRight: '32px',
                            }}
                        >
                            {item.answer}
                        </p>
                    </details>
                ))}
            </div>

            {/* Schema.org FAQPage JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: FAQ_ITEMS.map((item) => ({
                            '@type': 'Question',
                            name: item.question,
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: item.answer,
                            },
                        })),
                    }),
                }}
            />
        </section>
    );
}
