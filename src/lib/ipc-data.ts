/**
 * IPC Data Access Module
 *
 * Provides typed access to IPC (Consumer Price Index) data
 * stored as static JSON files in /public/data/.
 *
 * Data source: INDEC / datos.gob.ar — IPC Nacional base dic-2016 = 100
 */

export interface IPCEntry {
    date: string;   // "YYYY-MM"
    value: number;   // IPC index value
}

export interface IPCDataset {
    country: string;
    currency: string;
    base: string;         // base period "YYYY-MM"
    source: string;
    sourceUrl: string;
    lastUpdated: string;  // ISO date
    series: IPCEntry[];
}

let cachedData: IPCDataset | null = null;

/**
 * Load the IPC dataset for Argentina.
 * Uses fetch on client or dynamic import for server.
 */
export async function loadIPCData(): Promise<IPCDataset> {
    if (cachedData) return cachedData;

    // Client-side: fetch from public
    if (typeof window !== 'undefined') {
        const response = await fetch('/data/ipc-argentina.json');
        if (!response.ok) throw new Error('No se pudieron cargar los datos de IPC');
        cachedData = await response.json();
        return cachedData!;
    }

    // Server-side: import directly
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'public', 'data', 'ipc-argentina.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    cachedData = JSON.parse(raw);
    return cachedData!;
}

/**
 * Get the IPC value for a specific month/year.
 * Returns null if not found.
 */
export function getIPCValue(series: IPCEntry[], year: number, month: number): number | null {
    const dateKey = `${year}-${String(month).padStart(2, '0')}`;
    const entry = series.find(e => e.date === dateKey);
    return entry ? entry.value : null;
}

/**
 * Get the available date range from the series.
 */
export function getDateRange(series: IPCEntry[]): { min: string; max: string } | null {
    if (series.length === 0) return null;

    return {
        min: series[0].date,
        max: series[series.length - 1].date,
    };
}

/**
 * Get a slice of the series between two dates (inclusive).
 */
export function getSeriesSlice(
    series: IPCEntry[],
    startDate: string,
    endDate: string
): IPCEntry[] {
    return series.filter(e => e.date >= startDate && e.date <= endDate);
}

/**
 * Detect missing months in the series (gaps).
 * Returns an array of "YYYY-MM" strings for missing months.
 */
export function detectMissingMonths(series: IPCEntry[]): string[] {
    if (series.length < 2) return [];

    const missing: string[] = [];
    const dateSet = new Set(series.map(e => e.date));

    const [startYear, startMonth] = series[0].date.split('-').map(Number);
    const [endYear, endMonth] = series[series.length - 1].date.split('-').map(Number);

    let y = startYear;
    let m = startMonth;

    while (y < endYear || (y === endYear && m <= endMonth)) {
        const key = `${y}-${String(m).padStart(2, '0')}`;
        if (!dateSet.has(key)) {
            missing.push(key);
        }
        m++;
        if (m > 12) { m = 1; y++; }
    }

    return missing;
}

/**
 * Parse a "YYYY-MM" date key to year and month numbers.
 */
export function parseDateKey(dateKey: string): { year: number; month: number } {
    const [y, m] = dateKey.split('-').map(Number);
    return { year: y, month: m };
}

/**
 * Build a "YYYY-MM" date key from year and month.
 */
export function buildDateKey(year: number, month: number): string {
    return `${year}-${String(month).padStart(2, '0')}`;
}
