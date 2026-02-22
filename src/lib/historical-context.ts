export interface YearContext {
    title: string;
    description: string;
}

export const historicalContext: Record<number, YearContext> = {
    1975: {
        title: "El Rodrigazo",
        description: "El año estuvo marcado por una fuerte devaluación y ajuste de tarifas conocido como \"El Rodrigazo\" (por el ministro Celestino Rodrigo), lo que disparó la inflación a niveles muy altos y sentó las bases para el régimen de alta inflación de las siguientes décadas."
    },
    1989: {
        title: "La primera hiperinflación",
        description: "En medio de una profunda crisis política y económica que adelantó el traspaso presidencial de Raúl Alfonsín a Carlos Menem, la inflación mensual llegó a superar el 190% en julio. El año terminó con una de las hiperinflaciones más graves de la historia mundial."
    },
    1990: {
        title: "La segunda hiperinflación y el Plan Bonex",
        description: "Tras la primera hiperinflación, el año comenzó con el Plan Bonex (canje compulsivo de depósitos por bonos) para absorber liquidez. A pesar de frenar la espiral inmediatamente, la inflación volvió a acelerarse hacia fin de año, registrando otra tasa anual por encima del 1000%."
    },
    1991: {
        title: "Ley de Convertibilidad",
        description: "En abril se instauró el Plan de Convertibilidad ideado por Domingo Cavallo, fijando el tipo de cambio en 10.000 Australes = 1 Dólar (luego 1 Peso = 1 Dólar) y resumiendo la emisión sin respaldo. La inflación se desaceleró drásticamente en la segunda mitad del año."
    },
    2001: {
        title: "El fin de la Convertibilidad",
        description: "El año estuvo marcado por una profunda recesión, deflación de precios y la crisis política-económica de diciembre que culminó con la renuncia del presidente Fernando de la Rúa. Fue el último año de vigencia de la regla de 1 Peso = 1 Dólar, con el índice de precios en terreno negativo."
    },
    2002: {
        title: "Salida de la Convertibilidad y devaluación",
        description: "Tras la crisis de fines de 2001, se derogó la Convertibilidad y se devaluó asimétricamente la moneda. Esto provocó un fuerte salto en los precios internos, marcando el fin de más de una década de inflación cercana a cero o deflación."
    },
    2018: {
        title: "Crisis cambiaria y vuelta al FMI",
        description: "Una fuerte sequía y el cierre de los mercados de crédito desencadenaron corridas cambiarias que devaluaron fuertemente el peso. El país firmó un acuerdo Stand-By con el FMI, mientras que el traslado a precios llevó la inflación anual a su nivel más alto desde 1991."
    },
    2023: {
        title: "Aceleración inflacionaria y recambio presidencial",
        description: "Marcado por una grave sequía, restricciones a las importaciones y fuerte emisión. El salto cambiario tras las PASO y la incertidumbre por el cambio de gobierno en diciembre empujaron la inflación interanual por encima del 200%, marcando un nuevo récord en tres décadas."
    }
};

export function getHistoricalContext(year: number): YearContext | undefined {
    return historicalContext[year];
}
