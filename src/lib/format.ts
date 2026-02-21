/**
 * Number and currency formatting for Argentine locale.
 *
 * Argentina uses:
 *   - Dot (.) for thousands separator
 *   - Comma (,) for decimal separator
 *   - $ symbol for ARS
 */

const AR_LOCALE = 'es-AR';

/**
 * Format a number as Argentine currency (ARS).
 * e.g., 1234567.89 → "$ 1.234.567,89"
 */
export function formatCurrency(value: number, decimals: number = 2): string {
    return new Intl.NumberFormat(AR_LOCALE, {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

/**
 * Format a number with Argentine separators.
 * e.g., 1234567.89 → "1.234.567,89"
 */
export function formatNumber(value: number, decimals: number = 2): string {
    return new Intl.NumberFormat(AR_LOCALE, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

/**
 * Format a percentage.
 * e.g., 123.456 → "123,46%"
 */
export function formatPercent(value: number, decimals: number = 2): string {
    return new Intl.NumberFormat(AR_LOCALE, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value) + '%';
}

/**
 * Format a DateYM to human-readable string.
 * e.g., { year: 2023, month: 3 } → "Marzo 2023"
 */
const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export function formatMonthYear(year: number, month: number): string {
    return `${MONTH_NAMES[month - 1]} ${year}`;
}

/**
 * Parse a user-typed number string (with Argentine formatting) to a number.
 * "1.234.567,89" → 1234567.89
 * "1234567.89" → 1234567.89 (also supports standard format)
 */
export function parseNumber(input: string): number | null {
    if (!input || input.trim() === '') return null;

    let cleaned = input.trim();

    // If contains both dots and comma, it's Argentine format
    if (cleaned.includes(',')) {
        cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    }

    const result = parseFloat(cleaned);
    return isNaN(result) ? null : result;
}

/**
 * Format a date-key string "YYYY-MM" to readable format.
 */
export function formatDateKey(dateKey: string): string {
    const [yearStr, monthStr] = dateKey.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    return formatMonthYear(year, month);
}

/**
 * Generate a copyable text summary of the calculation result.
 */
export function generateCopyText(
    amount: number,
    originDate: string,
    destDate: string,
    adjustedAmount: number,
    cumulativeInflation: number,
    annualizedInflation: number
): string {
    return [
        `📊 Calculadora de Inflación Argentina`,
        ``,
        `Monto original: ${formatCurrency(amount)}`,
        `Período: ${formatDateKey(originDate)} → ${formatDateKey(destDate)}`,
        ``,
        `✅ Monto ajustado: ${formatCurrency(adjustedAmount)}`,
        `📈 Inflación acumulada: ${formatPercent(cumulativeInflation)}`,
        `📅 Inflación promedio anual (CAGR): ${formatPercent(annualizedInflation)}`,
        ``,
        `Fuente: INDEC - IPC Nacional (base dic-2016 = 100)`,
    ].join('\n');
}
