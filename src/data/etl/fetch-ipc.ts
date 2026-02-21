#!/usr/bin/env npx tsx
/**
 * ETL Script: Fetch IPC data from datos.gob.ar API
 *
 * Usage: npx tsx src/data/etl/fetch-ipc.ts
 *
 * Fetches IPC Nacional (base dic-2016 = 100) from the
 * official Argentine Time Series API and saves it as
 * a JSON file for the web app.
 *
 * Source: datos.gob.ar — Serie 148.3_INIVELNAL_DICI_M_26
 */

import * as fs from 'fs';
import * as path from 'path';

const SERIES_ID = '148.3_INIVELNAL_DICI_M_26';
const API_URL = `https://apis.datos.gob.ar/series/api/series/?ids=${SERIES_ID}&limit=5000&format=json&sort=asc`;

interface APIResponse {
    data: [string, number | null][];
    meta: Array<{
        field?: { id: string; description: string };
        frequency?: string;
    }>;
    params: Record<string, unknown>;
}

interface IPCEntry {
    date: string;
    value: number;
}

interface IPCDataset {
    country: string;
    currency: string;
    base: string;
    source: string;
    sourceUrl: string;
    lastUpdated: string;
    series: IPCEntry[];
    missingMonths: string[];
}

async function fetchIPCData(): Promise<void> {
    console.log('📡 Fetching IPC data from datos.gob.ar...');
    console.log(`   URL: ${API_URL}\n`);

    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const json: APIResponse = await response.json();
    console.log(`✅ Received ${json.data.length} data points\n`);

    // Parse and validate
    const series: IPCEntry[] = [];
    let skipped = 0;

    for (const [dateStr, value] of json.data) {
        // dateStr is in "YYYY-MM-DD" format, we want "YYYY-MM"
        const dateKey = dateStr.substring(0, 7); // "YYYY-MM"

        if (value === null || value === undefined) {
            console.warn(`⚠️  Missing value for ${dateKey}, skipping`);
            skipped++;
            continue;
        }

        if (typeof value !== 'number' || value <= 0) {
            console.warn(`⚠️  Invalid value ${value} for ${dateKey}, skipping`);
            skipped++;
            continue;
        }

        series.push({
            date: dateKey,
            value: Math.round(value * 100) / 100, // 2 decimal places
        });
    }

    if (skipped > 0) {
        console.log(`⚠️  Skipped ${skipped} entries with missing/invalid values\n`);
    }

    // Detect missing months
    const missingMonths = detectMissing(series);
    if (missingMonths.length > 0) {
        console.log(`⚠️  Missing months detected: ${missingMonths.join(', ')}\n`);
    }

    // Build output
    const dataset: IPCDataset = {
        country: 'argentina',
        currency: 'ARS',
        base: '2016-12',
        source: 'INDEC — IPC Nacional (base dic-2016 = 100)',
        sourceUrl: 'https://www.indec.gob.ar/indec/web/Nivel4-Tema-3-5-31',
        lastUpdated: new Date().toISOString(),
        series,
        missingMonths,
    };

    // Write to file
    const outDir = path.join(process.cwd(), 'public', 'data');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    const outPath = path.join(outDir, 'ipc-argentina.json');
    fs.writeFileSync(outPath, JSON.stringify(dataset, null, 2), 'utf-8');

    console.log(`📁 Saved ${series.length} entries to ${outPath}`);
    console.log(`   Date range: ${series[0].date} → ${series[series.length - 1].date}`);
    console.log(`   Last value: IPC = ${series[series.length - 1].value}`);
    console.log('\n✅ ETL complete!');
}

function detectMissing(series: IPCEntry[]): string[] {
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

// Run
fetchIPCData().catch((err) => {
    console.error('❌ ETL failed:', err);
    process.exit(1);
});
