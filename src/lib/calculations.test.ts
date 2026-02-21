/**
 * Unit Tests — Calculation Engine
 */

import { describe, it, expect } from 'vitest';
import {
    monthsBetween,
    adjustForInflation,
    cumulativeInflation,
    annualizedInflation,
    roundTo,
    calculate,
} from './calculations';

describe('monthsBetween', () => {
    it('returns 0 for same month', () => {
        expect(monthsBetween({ year: 2020, month: 6 }, { year: 2020, month: 6 })).toBe(0);
    });

    it('returns 12 for one year apart', () => {
        expect(monthsBetween({ year: 2020, month: 1 }, { year: 2021, month: 1 })).toBe(12);
    });

    it('returns 6 for half year', () => {
        expect(monthsBetween({ year: 2020, month: 1 }, { year: 2020, month: 7 })).toBe(6);
    });

    it('handles negative (dest before origin)', () => {
        expect(monthsBetween({ year: 2021, month: 1 }, { year: 2020, month: 1 })).toBe(-12);
    });

    it('handles cross-year periods', () => {
        expect(monthsBetween({ year: 2019, month: 11 }, { year: 2020, month: 2 })).toBe(3);
    });
});

describe('adjustForInflation', () => {
    it('adjusts correctly for basic case', () => {
        // 1000 ARS, IPC went from 100 to 200 → 2000
        expect(adjustForInflation(1000, 100, 200)).toBe(2000);
    });

    it('returns same amount for same IPC', () => {
        expect(adjustForInflation(1500, 150, 150)).toBe(1500);
    });

    it('handles deflation', () => {
        // IPC went down
        expect(adjustForInflation(1000, 200, 100)).toBe(500);
    });

    it('throws on zero IPC origin', () => {
        expect(() => adjustForInflation(1000, 0, 100)).toThrow();
    });

    it('throws on negative amount', () => {
        expect(() => adjustForInflation(-100, 100, 200)).toThrow();
    });

    it('throws on negative IPC origin', () => {
        expect(() => adjustForInflation(1000, -100, 200)).toThrow();
    });
});

describe('cumulativeInflation', () => {
    it('returns 100% for doubling', () => {
        expect(cumulativeInflation(100, 200)).toBe(100);
    });

    it('returns 0% for no change', () => {
        expect(cumulativeInflation(150, 150)).toBe(0);
    });

    it('returns negative for deflation', () => {
        expect(cumulativeInflation(200, 100)).toBe(-50);
    });

    it('handles real-world Argentina-like values', () => {
        // IPC from 100 to 827.88 → ~727.88%
        const result = cumulativeInflation(100, 827.88);
        expect(result).toBeCloseTo(727.88, 1);
    });
});

describe('annualizedInflation (CAGR)', () => {
    it('returns 0 for same month', () => {
        expect(annualizedInflation(100, 100, 0)).toBe(0);
    });

    it('returns correct CAGR for 1 year', () => {
        // 50% in 12 months → CAGR = 50%
        expect(annualizedInflation(100, 150, 12)).toBeCloseTo(50, 1);
    });

    it('annualizes correctly for 6 months', () => {
        // 50% in 6 months → annualized = ((1.5)^2 - 1)*100 = 125%
        expect(annualizedInflation(100, 150, 6)).toBeCloseTo(125, 0);
    });

    it('handles multi-year periods', () => {
        // IPC 100 → 200 in 24 months (2 years)
        // CAGR = (2^(1/2) - 1) * 100 ≈ 41.42%
        const result = annualizedInflation(100, 200, 24);
        expect(result).toBeCloseTo(41.42, 1);
    });

    it('handles periods < 12 months', () => {
        // 10% in 3 months → annualized
        const result = annualizedInflation(100, 110, 3);
        expect(result).toBeGreaterThan(10);
    });
});

describe('roundTo', () => {
    it('rounds to 2 decimals by default', () => {
        expect(roundTo(1.23456)).toBe(1.23);
    });

    it('rounds to custom decimals', () => {
        expect(roundTo(1.23456, 4)).toBe(1.2346);
    });

    it('rounds 0.5 up', () => {
        expect(roundTo(1.235)).toBe(1.24);
    });
});

describe('calculate (full integration)', () => {
    it('calculates correct result for basic case', () => {
        const result = calculate(
            10000,
            100,
            200,
            { year: 2017, month: 1 },
            { year: 2018, month: 1 }
        );

        expect(result.adjustedAmount).toBe(20000);
        expect(result.cumulativeInflation).toBe(100);
        expect(result.annualizedInflation).toBeCloseTo(100, 1);
        expect(result.ipcOrigin).toBe(100);
        expect(result.ipcDest).toBe(200);
        expect(result.ratio).toBeCloseTo(2, 4);
        expect(result.months).toBe(12);
    });

    it('handles same month', () => {
        const result = calculate(
            5000,
            150.5,
            150.5,
            { year: 2020, month: 6 },
            { year: 2020, month: 6 }
        );

        expect(result.adjustedAmount).toBe(5000);
        expect(result.cumulativeInflation).toBe(0);
        expect(result.annualizedInflation).toBe(0);
        expect(result.months).toBe(0);
    });
});
