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
 * Format a very large percentage using compact notation.
 * e.g., 2428454965459528000 → "2,43 × 10¹⁸%"
 * Small values fall back to normal formatPercent.
 */
export function formatLargePercent(value: number, decimals: number = 2): string {
    const abs = Math.abs(value);
    if (abs < 1_000_000) {
        return formatPercent(value, decimals);
    }
    return formatScientific(value) + '%';
}

/**
 * Format a very large number using compact notation.
 * e.g., 24284549654595 → "2,43 × 10¹³"
 * Small values fall back to normal formatNumber.
 */
export function formatLargeNumber(value: number, decimals: number = 2): string {
    const abs = Math.abs(value);
    if (abs < 1_000_000) {
        return formatNumber(value, decimals);
    }
    return formatScientific(value);
}

/**
 * Internal: format value in scientific notation with Unicode superscripts.
 */
function formatScientific(value: number): string {
    const exp = Math.floor(Math.log10(Math.abs(value)));
    const mantissa = value / Math.pow(10, exp);

    const superscripts: Record<string, string> = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
        '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻',
    };

    const expStr = String(exp).split('').map(c => superscripts[c] || c).join('');
    const mantissaStr = new Intl.NumberFormat(AR_LOCALE, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(mantissa);

    return `${mantissaStr} × 10${expStr}`;
}

/**
 * Format an IPC value for display.
 * For very small values (< 0.01), uses scientific notation.
 * e.g., 4.29e-13 → "4,29 × 10⁻¹³"
 */
export function formatIPCValue(value: number): string {
    if (value === 0) return '0';
    if (value >= 0.01) {
        return formatNumber(value, 2);
    }

    // Scientific notation with Unicode superscripts
    const exp = Math.floor(Math.log10(Math.abs(value)));
    const mantissa = value / Math.pow(10, exp);

    const superscripts: Record<string, string> = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
        '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻',
    };

    const expStr = String(exp).split('').map(c => superscripts[c] || c).join('');
    const mantissaStr = new Intl.NumberFormat(AR_LOCALE, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(mantissa);

    return `${mantissaStr} × 10${expStr}`;
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
