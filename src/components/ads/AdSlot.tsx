'use client';

import React from 'react';

interface AdSlotProps {
    slot: string;
    format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
    minHeight?: number;
    className?: string;
}

/**
 * AdSlot — Wrapper for Google AdSense ads.
 *
 * Reserves fixed height space to prevent CLS (Cumulative Layout Shift).
 * Replace data-ad-client with your actual AdSense publisher ID.
 */
export default function AdSlot({
    slot,
    format = 'auto',
    minHeight = 100,
    className = '',
}: AdSlotProps) {
    return (
        <div
            className={`ad-slot ${className}`}
            style={{
                minHeight: `${minHeight}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--color-surface)',
                border: '1px dashed var(--color-border)',
                borderRadius: 'var(--radius-card)',
                overflow: 'hidden',
                margin: '0 auto',
                width: '100%',
            }}
            aria-hidden="true"
        >
            {/* 
        Replace data-ad-client and data-ad-slot with real values.
        Uncomment <ins> and <script> when AdSense is approved.
      */}
            {/*
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: `${minHeight}px` }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
      */}
            <span
                style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-family)',
                    opacity: 0.5,
                }}
            >
                Espacio publicitario
            </span>
        </div>
    );
}
