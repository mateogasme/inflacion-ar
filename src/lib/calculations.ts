/**
 * Inflation Calculator — Calculation Engine
 *
 * All formulas based on IPC (Consumer Price Index):
 *   IPC(t) = index value at month/year t
 *
 * Base: INDEC IPC Nacional, dic-2016 = 100
 */

export interface DateYM {
  year: number;
  month: number; // 1–12
}

export interface CalculationResult {
  adjustedAmount: number;
  cumulativeInflation: number; // percentage
  annualizedInflation: number; // CAGR percentage
  ipcOrigin: number;
  ipcDest: number;
  ratio: number;
  months: number;
}

/**
 * Calculate months between two dates (inclusive of start month).
 * Returns 0 if same month.
 */
export function monthsBetween(origin: DateYM, dest: DateYM): number {
  return (dest.year - origin.year) * 12 + (dest.month - origin.month);
}

/**
 * Adjust an amount for inflation using IPC values.
 * Formula: amount * (ipcDest / ipcOrigin)
 */
export function adjustForInflation(
  amount: number,
  ipcOrigin: number,
  ipcDest: number
): number {
  if (ipcOrigin <= 0) throw new Error('IPC origen debe ser mayor a 0');
  if (ipcDest < 0) throw new Error('IPC destino no puede ser negativo');
  if (amount < 0) throw new Error('El monto no puede ser negativo');

  return amount * (ipcDest / ipcOrigin);
}

/**
 * Calculate cumulative inflation between two IPC values.
 * Formula: ((ipcDest / ipcOrigin) - 1) * 100
 */
export function cumulativeInflation(
  ipcOrigin: number,
  ipcDest: number
): number {
  if (ipcOrigin <= 0) throw new Error('IPC origen debe ser mayor a 0');

  return ((ipcDest / ipcOrigin) - 1) * 100;
}

/**
 * Calculate annualized inflation (CAGR).
 * Formula: ((ipcDest / ipcOrigin) ^ (12 / months) - 1) * 100
 *
 * For same month (0 months between), returns 0.
 * For periods < 12 months, still valid (annualized rate).
 */
export function annualizedInflation(
  ipcOrigin: number,
  ipcDest: number,
  months: number
): number {
  if (ipcOrigin <= 0) throw new Error('IPC origen debe ser mayor a 0');
  if (months === 0) return 0;

  const ratio = ipcDest / ipcOrigin;
  const years = months / 12;
  return (Math.pow(ratio, 1 / years) - 1) * 100;
}

/**
 * Round to N decimal places.
 */
export function roundTo(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Full calculation: takes amount, IPC values, and dates.
 * Returns all derived values.
 */
export function calculate(
  amount: number,
  ipcOrigin: number,
  ipcDest: number,
  origin: DateYM,
  dest: DateYM
): CalculationResult {
  const months = monthsBetween(origin, dest);
  const absMonths = Math.abs(months);
  const ratio = ipcDest / ipcOrigin;

  return {
    adjustedAmount: roundTo(adjustForInflation(amount, ipcOrigin, ipcDest)),
    cumulativeInflation: roundTo(cumulativeInflation(ipcOrigin, ipcDest)),
    annualizedInflation: roundTo(annualizedInflation(ipcOrigin, ipcDest, absMonths)),
    ipcOrigin: roundTo(ipcOrigin, 4),
    ipcDest: roundTo(ipcDest, 4),
    ratio: roundTo(ratio, 6),
    months: absMonths,
  };
}
