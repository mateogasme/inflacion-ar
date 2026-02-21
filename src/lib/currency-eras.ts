/**
 * Argentine Currency Eras
 *
 * Argentina changed its currency sign (removing zeros) multiple times:
 *
 *   1. Peso Moneda Nacional (m$n)    → hasta 31/12/1969
 *   2. Peso Ley 18.188 ($ley)       → 01/01/1970 – 31/05/1983  (÷ 100)
 *   3. Peso Argentino ($a)           → 01/06/1983 – 14/06/1985  (÷ 10.000)
 *   4. Austral (₳)                   → 15/06/1985 – 31/12/1991  (÷ 1.000)
 *   5. Peso (ARS / $)               → 01/01/1992 – presente     (÷ 10.000)
 *
 *   Total: 13 ceros eliminados → 1 m$n = 10^-13 ARS
 *
 * The IPC series is continuous through all these changes — the index
 * values implicitly absorb the denominations. So a "raw" inflation
 * calculation between e.g. 1950 and 2026 produces astronomically large
 * numbers that, while mathematically correct, confuse users because
 * the money changed several times.
 *
 * This module provides:
 *   - getEra(year, month): what currency sign was used at that date
 *   - getConversionToARS(year, month): factor to convert from that era's unit to ARS
 *   - needsConversion(originYear, originMonth, destYear, destMonth): whether the
 *     origin and destination are in different currency eras
 */

export interface CurrencyEra {
    name: string;
    symbol: string;
    /** ISO code or informal code */
    code: string;
    /** Start date (inclusive) as "YYYY-MM" */
    startDate: string;
    /** End date (inclusive) as "YYYY-MM" */
    endDate: string;
    /** Cumulative factor: 1 unit of this currency = factor ARS */
    toARS: number;
    /** Zeros removed in THIS conversion (for display) */
    zerosRemoved: number;
}

/**
 * The eras in chronological order.
 *
 * toARS calculated cumulatively:
 *   m$n   → ARS: 1 / (100 × 10000 × 1000 × 10000) = 1e-13
 *   $ley  → ARS: 1 / (10000 × 1000 × 10000) = 1e-11
 *   $a    → ARS: 1 / (1000 × 10000) = 1e-7
 *   ₳     → ARS: 1 / 10000 = 1e-4
 *   ARS   → ARS: 1
 */
export const CURRENCY_ERAS: CurrencyEra[] = [
    {
        name: 'Peso Moneda Nacional',
        symbol: 'm$n',
        code: 'MXN', // informal
        startDate: '1900-01',
        endDate: '1969-12',
        toARS: 1e-13,
        zerosRemoved: 0, // it's the original
    },
    {
        name: 'Peso Ley 18.188',
        symbol: '$ley',
        code: 'PEL',
        startDate: '1970-01',
        endDate: '1983-05',
        toARS: 1e-11,
        zerosRemoved: 2,
    },
    {
        name: 'Peso Argentino',
        symbol: '$a',
        code: 'PEA',
        startDate: '1983-06',
        endDate: '1985-06',
        toARS: 1e-7,
        zerosRemoved: 4,
    },
    {
        name: 'Austral',
        symbol: '₳',
        code: 'ARA',
        startDate: '1985-07',
        endDate: '1991-12',
        toARS: 1e-4,
        zerosRemoved: 3,
    },
    {
        name: 'Peso',
        symbol: '$',
        code: 'ARS',
        startDate: '1992-01',
        endDate: '2099-12',
        toARS: 1,
        zerosRemoved: 4,
    },
];

/**
 * Get the currency era for a given year/month.
 */
export function getEra(year: number, month: number): CurrencyEra {
    const dateKey = `${year}-${String(month).padStart(2, '0')}`;

    for (let i = CURRENCY_ERAS.length - 1; i >= 0; i--) {
        if (dateKey >= CURRENCY_ERAS[i].startDate) {
            return CURRENCY_ERAS[i];
        }
    }

    return CURRENCY_ERAS[0]; // fallback to oldest
}

/**
 * Get the conversion factor from the era's currency unit to modern ARS.
 */
export function getConversionToARS(year: number, month: number): number {
    return getEra(year, month).toARS;
}

/**
 * Check if two dates are in different currency eras.
 */
export function needsConversion(
    originYear: number,
    originMonth: number,
    destYear: number,
    destMonth: number
): boolean {
    const originEra = getEra(originYear, originMonth);
    const destEra = getEra(destYear, destMonth);
    return originEra.code !== destEra.code;
}

/**
 * Convert an amount from its original era to modern ARS.
 *
 * Use case: the user enters "1" meaning 1 Peso Moneda Nacional (m$n).
 * The IPC-based calculation gives a huge number because the index is
 * continuous. To express the result in modern ARS, we divide by
 * the origin era's toARS factor (since the IPC already accounts for
 * the real purchasing power change, but the denomination changes are
 * multiplicative).
 *
 * Actually, the way our IPC series works:
 * All values are rebased to dic-2016 = 100 (ARS era).
 * So `adjustedAmount = amount * (IPC_dest / IPC_origin)`.
 *
 * If the user enters "1 m$n" from 1950, the IPC calculates as if it's
 * 1 unit of the continuous price level. The result is in the same
 * "unit" — which for a 1950 peso means 1 modern ARS already had 13
 * zeros removed.
 *
 * To show the "ARS equivalent": adjustedAmount * originEra.toARS
 * This converts from the "old unit scale" to modern ARS.
 */
export function convertToModernARS(
    adjustedAmount: number,
    originYear: number,
    originMonth: number,
): number {
    const era = getEra(originYear, originMonth);
    return adjustedAmount * era.toARS;
}

/**
 * Get the total number of zeros removed between origin and dest eras.
 */
export function getZerosRemoved(
    originYear: number,
    originMonth: number,
    destYear: number,
    destMonth: number,
): number {
    const originEra = getEra(originYear, originMonth);
    const destEra = getEra(destYear, destMonth);

    if (originEra.code === destEra.code) return 0;

    // Sum zeros removed from the era AFTER the origin to the dest era
    const originIdx = CURRENCY_ERAS.findIndex(e => e.code === originEra.code);
    const destIdx = CURRENCY_ERAS.findIndex(e => e.code === destEra.code);

    let total = 0;
    for (let i = originIdx + 1; i <= destIdx; i++) {
        total += CURRENCY_ERAS[i].zerosRemoved;
    }
    return total;
}

/**
 * Get the list of currency changes that happened between two dates.
 * Useful for displaying to the user.
 */
export function getCurrencyChangesBetween(
    originYear: number,
    originMonth: number,
    destYear: number,
    destMonth: number,
): { year: string; from: CurrencyEra; to: CurrencyEra; zerosRemoved: number }[] {
    const originEra = getEra(originYear, originMonth);
    const destEra = getEra(destYear, destMonth);

    if (originEra.code === destEra.code) return [];

    const originIdx = CURRENCY_ERAS.findIndex(e => e.code === originEra.code);
    const destIdx = CURRENCY_ERAS.findIndex(e => e.code === destEra.code);

    const changes = [];
    for (let i = originIdx; i < destIdx; i++) {
        changes.push({
            year: CURRENCY_ERAS[i + 1].startDate.substring(0, 4),
            from: CURRENCY_ERAS[i],
            to: CURRENCY_ERAS[i + 1],
            zerosRemoved: CURRENCY_ERAS[i + 1].zerosRemoved,
        });
    }
    return changes;
}
