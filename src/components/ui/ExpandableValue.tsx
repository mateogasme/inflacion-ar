'use client';

import React, { useState } from 'react';

interface ExpandableValueProps {
    compact: string;
    full: string;
    color?: string;
}

/**
 * Shows a compact value with a beautiful toggle to reveal the full exact number.
 */
export default function ExpandableValue({ compact, full, color }: ExpandableValueProps) {
    const [expanded, setExpanded] = useState(false);

    if (compact === full) return <>{compact}</>;

    const accentColor = color || 'var(--color-primary-action)';

    return (
        <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
                wordBreak: expanded ? 'break-all' : undefined,
                transition: 'all 0.2s ease',
            }}>
                {expanded ? full : compact}
            </span>
            <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    fontSize: '11px',
                    fontWeight: 500,
                    fontFamily: 'var(--font-family)',
                    color: 'var(--color-text-secondary)',
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                    lineHeight: 1.4,
                    boxShadow: 'var(--shadow-sm)',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                    e.currentTarget.style.color = 'var(--color-primary-action)';
                    e.currentTarget.style.borderColor = '#BFDBFE'; // Light blue border on hover
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg)';
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
                aria-label={expanded ? 'Ocultar número exacto' : 'Ver número exacto'}
            >
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {expanded ? (
                        <>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                    ) : (
                        <>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </>
                    )}
                </svg>
                {expanded ? 'Ocultar' : 'Ver exacto'}
            </button>
        </span>
    );
}
