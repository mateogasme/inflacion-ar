import type { Metadata } from 'next';
import React from 'react';
import Card from '@/components/ui/Card';

export const metadata: Metadata = {
    title: 'La Intervención del INDEC (2007–2016)',
    description: 'Crónica de un colapso institucional y su impacto en las estadísticas públicas de Argentina.',
};

import GlossarialTooltip from '@/components/ui/GlossarialTooltip';

const HighlightBox: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div style={{
        backgroundColor: 'var(--color-surface)',
        borderLeft: '4px solid var(--color-primary-action)',
        padding: '16px 20px',
        margin: '24px 0',
        borderRadius: '0 8px 8px 0',
    }}>
        <h4 style={{ color: 'var(--color-primary)', fontSize: '15px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
        </h4>
        <div style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            {children}
        </div>
    </div>
);

export default function IntervencionIndecPage() {
    const sectionStyle: React.CSSProperties = {
        marginBottom: '40px',
    };

    const headingStyle: React.CSSProperties = {
        fontSize: '24px',
        fontWeight: 600,
        color: 'var(--color-primary)',
        marginBottom: '16px',
        lineHeight: 1.3,
        paddingBottom: '8px',
        borderBottom: '1px solid var(--color-border)',
    };

    const subHeadingStyle: React.CSSProperties = {
        fontSize: '20px',
        fontWeight: 600,
        color: 'var(--color-primary)',
        marginBottom: '12px',
        lineHeight: 1.3,
        marginTop: '32px',
    };

    const bodyStyle: React.CSSProperties = {
        fontSize: '17px',
        lineHeight: 1.7,
        color: 'var(--color-text-secondary)',
        marginBottom: '16px',
    };

    const tableStyle: React.CSSProperties = {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '24px',
        fontSize: '15px',
    };

    const thStyle: React.CSSProperties = {
        padding: '12px 16px',
        textAlign: 'left',
        fontWeight: 600,
        borderBottom: '2px solid var(--color-border)',
        color: 'var(--color-text-secondary)',
        backgroundColor: 'var(--color-surface)',
    };

    const tdStyle: React.CSSProperties = {
        padding: '12px 16px',
        borderBottom: '1px solid var(--color-border)',
        color: 'var(--color-text-primary)',
        verticalAlign: 'top',
    };

    return (
        <div className="container" style={{ paddingTop: '48px', paddingBottom: '64px', maxWidth: '900px' }}>
            <article>
                <header style={{ marginBottom: '40px' }}>
                    <h1 style={{ marginBottom: '24px', lineHeight: 1.2, fontSize: 'clamp(32px, 5vw, 44px)' }}>
                        Crónica de un Colapso: La Intervención del INDEC (2007–2016)
                    </h1>

                    <p style={{ ...bodyStyle, fontSize: '20px', color: 'var(--color-text-primary)', lineHeight: 1.5, fontWeight: 300 }}>
                        La historia de cómo los números oficiales de Argentina dejaron de reflejar la realidad en las góndolas, y el inmenso costo que pagó el país al alterar la información que nos permite saber cuántos pobres hay o cuánto suben los precios.
                    </p>
                </header>

                <figure style={{ margin: '0 0 40px 0' }}>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/6/6f/INDEC_edificio_1.jpg"
                        alt="Edificio del INDEC en Buenos Aires"
                        style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', maxHeight: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <figcaption style={{ fontSize: '13px', color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: '12px', fontStyle: 'italic' }}>
                        Sede del Instituto Nacional de Estadística y Censos (INDEC) en la Ciudad Autónoma de Buenos Aires.
                    </figcaption>
                </figure>

                <section style={sectionStyle}>
                    <p style={bodyStyle}>
                        La integridad de las estadísticas públicas es el cimiento invisible de un país. Nos permite confiar en nuestra propia moneda, saber qué políticas sociales funcionan y mantener la <GlossarialTooltip term="previsibilidad en los contratos" explanation="La seguridad de que lo pactado hoy, ya sea un alquiler o un préstamo, mantendrá su valor justo en el futuro" />.
                    </p>
                    <p style={bodyStyle}>
                        En Argentina, entre los años 2007 y 2016, ocurrió algo insólito en la historia moderna: <strong>la intervención del INDEC</strong>. No fue un accidente. Fue un proceso planificado para "dibujar" los números de la economía. El impacto cruzó nuestras fronteras y terminó costándole al país miles de millones de dólares en juicios internacionales.
                    </p>

                    <h2 style={headingStyle}>El prestigio del INDEC histórico</h2>
                    <p style={bodyStyle}>
                        Para entender la gravedad del asunto, hay que repasar el nivel de respeto que tenía esta institución. Creado en 1968 (Ley 17.622), su objetivo era centralizar la información bajo un estricto secreto estadístico. Pasaron hiperinflaciones y cambios rotundos de gobierno, pero <strong>los técnicos del INDEC siempre lograban mantener la rigurosidad de los datos</strong>.
                    </p>

                    <Card padding="md" style={{ marginBottom: '32px', marginTop: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '16px' }}>Hitos de las estadísticas en Argentina</h3>
                        <ul style={{ ...bodyStyle, fontSize: '15px', paddingLeft: '24px', margin: 0 }}>
                            <li style={{ marginBottom: '8px' }}><strong>1869:</strong> Primer Censo Nacional bajo la presidencia de Sarmiento.</li>
                            <li style={{ marginBottom: '8px' }}><strong>1968:</strong> Creación oficial del INDEC garantizando el secreto profesional.</li>
                            <li style={{ marginBottom: '8px' }}><strong>2001:</strong> A pesar de la peor crisis, el INDEC midió impecablemente la caída brutal del empleo y el triste pico de pobreza.</li>
                        </ul>
                    </Card>
                </section>

                <section style={sectionStyle}>
                    <h2 style={headingStyle}>¿Por qué empezó el conflicto? (2005-2006)</h2>
                    <p style={bodyStyle}>
                        Tras la grave crisis de 2001, Argentina tuvo unos años de recuperación acelerada (creciendo al 9% anual). Pero hacia 2005-2006, la inflación (que estaba adormecida) empezó a asomar su cabeza, rompiendo la barrera del 10% anual.
                    </p>
                    <p style={bodyStyle}>
                        El entonces Secretario de Comercio Interior, Guillermo Moreno, creía que la inflación se frenaba controlando a los comercios y obligándolos a no subir precios. Como el INDEC seguía midiendo la realidad (donde las cosas <em>sí</em> subían), el gobierno empezó a dudar de la institución. Moreno exigió a los técnicos que le dieran <strong>las listas secretas de qué comercios eran encuestados</strong> para ir a "apretarlos" directamente. Los técnicos, amparándose en la ley que los obliga al secreto, se negaron.
                    </p>
                </section>

                <section style={sectionStyle}>
                    <h2 style={headingStyle}>El hito del quiebre: Enero 2007</h2>
                    <p style={bodyStyle}>
                        El 29 de enero de 2007, ocurrió lo impensado. El gobierno echó a Graciela Bevacqua, la técnica a cargo de medir el <GlossarialTooltip term="Índice de Precios (IPC)" explanation="Una medida que saca un promedio de cuánto salen los bienes o servicios básicos que compramos normalmente." /> por negarse a manipular la matemática. Fue reemplazada por personal político afín a Comercio Interior.
                    </p>

                    <h3 style={subHeadingStyle}>Así "dibujaban" los números</h3>
                    <ul style={{ ...bodyStyle, paddingLeft: '24px' }}>
                        <li style={{ marginBottom: '12px' }}><strong>Personal desplazado:</strong> O te ibas, o te castigaban. Profesionales con décadas de experiencia fueron barridos.</li>
                        <li style={{ marginBottom: '12px' }}><strong>Precios teóricos:</strong> Si el turismo aumentaba un 30% en verano, ellos dejaban de medir precios reales y ponían un "precio sugerido o teórico" que indicaba que había subido solo un 2%.</li>
                        <li style={{ marginBottom: '12px' }}><strong>La "Columna Paralela":</strong> Se inventó un programa de computadora donde en paralelo se cargaban "valores sugeridos" topes, reemplazando el trabajo verdadero de campo de los encuestadores.</li>
                    </ul>
                </section>

                <section style={sectionStyle}>
                    <h2 style={headingStyle}>El choque con la realidad: La gente en la calle</h2>
                    <p style={bodyStyle}>
                        Durante casi 9 años, el INDEC informó variaciones de precios que representaban un tercio (1/3) de la inflación real. Si vos en el supermercado veías que las cosas habían aumentado un 30%, el INDEC publicaba un 9%. No coincidía.
                    </p>

                    <HighlightBox title="Motivación Financiera">
                        ¿Por qué mentir en el índice? Además del beneficio político frente a las elecciones, gran parte de la deuda del Estado argentino ajustaba por inflación (bonos atados al mecanismo <GlossarialTooltip term="CER" explanation="Coeficiente de Estabilización de Referencia: Se supone que sigue a los precios para no perder valor." />). Al informar una inflación irrisoria, <strong>el Estado le devaluaba la deuda a los inversores (y a los jubilados indirectamente) ahorrándose de pagar millones</strong>.
                    </HighlightBox>

                    <Card padding="md" style={{ overflow: 'hidden', marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '8px' }}>La inflación "Del Gobierno" vs. La Inflación "Real"</h3>
                        <p style={{ ...bodyStyle, fontSize: '14px', marginBottom: '16px' }}>La gente y las consultoras terminaron usando el IPC de la Provincia de San Luis (que no estaba intervenida) o el "IPC Congreso" (publicado por diputados opositores para saltarse la censura) porque el del INDEC dejó de ser creíble.</p>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>Año</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>Inflación (Oficial)</th>
                                        <th style={{ ...thStyle, textAlign: 'right', color: 'var(--color-error)' }}>Inflación (Congreso/Real)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={tdStyle}><strong>2007</strong></td>
                                        <td style={{ ...tdStyle, textAlign: 'right' }}>8,5%</td>
                                        <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--color-error)', fontWeight: 600 }}>19,6%</td>
                                    </tr>
                                    <tr>
                                        <td style={tdStyle}><strong>2010</strong></td>
                                        <td style={{ ...tdStyle, textAlign: 'right' }}>10,9%</td>
                                        <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--color-error)', fontWeight: 600 }}>25,6%</td>
                                    </tr>
                                    <tr>
                                        <td style={tdStyle}><strong>2014</strong></td>
                                        <td style={{ ...tdStyle, textAlign: 'right' }}>23,9%</td>
                                        <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--color-error)', fontWeight: 600 }}>38,5%</td>
                                    </tr>
                                    <tr>
                                        <td style={tdStyle}><strong>2015</strong></td>
                                        <td style={{ ...tdStyle, textAlign: 'right' }}>14,3% (est)</td>
                                        <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--color-error)', fontWeight: 600 }}>28,0%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <h3 style={subHeadingStyle}>La pobreza "Estigmatizante"</h3>
                    <p style={bodyStyle}>
                        La trampa saltó a la vista muy rápido en lo social. La Argentina mide la pobreza contrastando cuánto gana una persona contra cuánto cuesta una <strong><GlossarialTooltip term="Canasta Básica" explanation="Lista técnica de comida de supervivencia, como pan, fideos, un poco de carne, leche..." /></strong>. Si el INDEC decía que un kilo de carne salía $10 artificialmente, el costo de la familia para no ser pobre daba absurdamente bajo.
                    </p>
                    <p style={bodyStyle}>
                        Al calcular la Canasta Básica con precios re-bajos, el nivel de pobreza daba tan positivo que Argentina "tenía menos pobres que Alemania", según decían los funcionarios públicos en 2015. El problema social era tan inmenso que para disimularlo, <strong>en 2013 el gobierno simplemente dejó de publicar el dato de la pobreza</strong>, porque según el Ministro Kicillof, medirla era "estigmatizante" para la gente.
                    </p>
                </section>

                <section style={sectionStyle}>
                    <h2 style={headingStyle}>La mentira que costó carísima en millones de dólares</h2>
                    <p style={bodyStyle}>
                        Si bien engañar internamente les sirvió un tiempo, el mundo se dio cuenta. Argentina tenía un bono atado a si el país "crecía" más del 3,22% (El <GlossarialTooltip term="Cupón PBI" explanation="Un premio financiero ligado al crecimiento. Si Argentina crecía, pagaba ganancia." />).
                    </p>
                    <p style={bodyStyle}>
                        En 2013, se cambió de imprevisto una enorme base metodológica para mostrar que Argentina había crecido artificialmente un 3,2%... es decir, justo al borde, pero sin llegar a pagar porque no hubo la plata. Pero en verdad, el país había crecido un ~4,5% si veíamos los datos viejos. Los bonistas extranjeros inmediatamente fueron a los Tribunales de Londres y Estados Unidos gritando "¡Nos estafaron manipulando las calculadoras!".
                    </p>

                    <HighlightBox title="Juicios y Multas">
                        <strong>Hoy (2024+):</strong> Las cortes británicas ya condenaron a Argentina a pagar más de <strong>USD 1.500 millones</strong> solo por esa pequeña manipulación puntual del año 2013. Es un costo que pagan hoy todos los contribuyentes con sus impuestos.
                    </HighlightBox>

                    <h3 style={subHeadingStyle}>Aislados del mundo</h3>
                    <p style={bodyStyle}>
                        El papelón internacional fue severo: la <strong>ONU, el Banco Mundial y hasta la CEPAL</strong> ponían asteriscos de "No utilizar" en los datos argentinos. El colmo llegó en 2013 cuando el <strong>FMI</strong>, por primera vez en toda su historia, sacó una <em>"Moción de Censura"</em>, expulsando simbólicamente los números de Argentina por mentirles. Nadie se arriesgaba a prestarnos plata a buena tasa sin datos reales.
                    </p>
                </section>

                <section style={sectionStyle}>
                    <h2 style={headingStyle}>2016: Reconstruir de las cenizas</h2>
                    <p style={bodyStyle}>
                        A fines de 2015 cambió el gobierno, y el principal desafío urgente era prender la luz en medio del cuarto oscuro. Se designó a Jorge Todesca en la dirección y en enero de 2016 se dictó la <strong>"Emergencia Estadística"</strong>.
                    </p>
                    <p style={bodyStyle}>
                        Se dejó de publicar por medio año cualquier dato de precios para limpiar el software desde cero, re-contratar a las técnicos desplazados e instalar software seguro e inalterable. Para noviembre de 2016, misiones técnicas de auditoría del FMI revalidaron al INDEC y levantaron la censura tras casi una década de desprestigio.
                    </p>
                    <p style={bodyStyle}>
                        <mark style={{ backgroundColor: '#fef08a', padding: '0 4px', borderRadius: '4px' }}><strong>El primer cachetazo de realidad:</strong></mark> Cuando el INDEC curado volvió a medir cuántos pobres había en el país a fines de 2016, dio <strong>32,2%</strong>. Fue un golpe brutal a la sociedad que llevaba una década leyendo que había bajado a casi debajo del 5%.
                    </p>
                </section>

                <section style={sectionStyle}>
                    <h2 style={headingStyle}>¿Cuál es la lección principal?</h2>
                    <p style={bodyStyle}>
                        La intervención del INDEC nos enseñó (de la peor de las formas) que la "soberanía política" sobre los datos matemáticos es veneno. Mentir rompe el termómetro. Romperlo no cura al paciente, encarece el crédito del país a futuro y esconde en las sombras a los sectores más golpeados y vulnerables de la sociedad porque, al no estar registrados como pobres en las planillas, las ayudas jamás les llegan.
                    </p>
                    <p style={bodyStyle}>
                        Hoy en día, el INDEC funciona con estándares internacionales transparentes, porque tras mucho derroche hemos aprendido como país que: <strong>La verdad matemática, por más dolorosa que resulte políticamente, es el único punto de partida real para un progreso sensato.</strong>
                    </p>
                </section>

                {/* Back link */}
                <div style={{ marginTop: '56px', borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
                    <a
                        href="/inflacion-por-anio"
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
                        Volver a inflación por año
                    </a>
                </div>
            </article>
        </div>
    );
}
