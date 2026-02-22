'use client';

import React, { useState } from 'react';

interface Props {
    term: string;
    explanation: string;
}

export default function GlossarialTooltip({ term, explanation }: Props) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <span
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onTouchStart={() => setShowTooltip(prev => !prev)}
            style={{
                position: 'relative',
                display: 'inline-block',
                borderBottom: '2px dotted var(--color-primary-action)',
                color: 'var(--color-text-primary)',
                fontWeight: 600,
                cursor: 'help',
                transition: 'color 0.2s',
            }}
        >
            {term}

            <span
                style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 10px)',
                    left: '50%',
                    transform: `translateX(-50%) translateY(${showTooltip ? '0' : '4px'})`,
                    width: 'max-content',
                    maxWidth: '300px',
                    padding: '12px 16px',
                    backgroundColor: 'var(--color-primary)',
                    color: '#f8fafc',
                    borderRadius: '12px',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    textAlign: 'left',
                    pointerEvents: 'none',
                    opacity: showTooltip ? 1 : 0,
                    visibility: showTooltip ? 'visible' : 'hidden',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 20px 40px -8px rgba(15, 23, 42, 0.4), 0 12px 30px -8px rgba(15, 23, 42, 0.3)',
                    zIndex: 50,
                }}
            >
                {/* Arrow */}
                <span style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '0',
                    height: '0',
                    borderLeft: '7px solid transparent',
                    borderRight: '7px solid transparent',
                    borderTop: '7px solid var(--color-primary)',
                }} />

                <span style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-primary-action)', flexShrink: 0, marginTop: '1px' }}>
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <span>{explanation}</span>
                </span>
            </span>
        </span>
    );
}
