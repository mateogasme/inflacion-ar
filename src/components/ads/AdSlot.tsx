'use client';

import React, { useEffect, useRef } from 'react';

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
    const isLoaded = useRef(false);

    useEffect(() => {
        if (!isLoaded.current) {
            try {
                // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                isLoaded.current = true;
            } catch (err) {
                console.error('Error loading AdSense:', err);
            }
        }
    }, [slot]);

    return (
        <div
            className={`ad-slot ${className}`}
            style={{
                minHeight: `${minHeight}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                border: 'none',
                overflow: 'hidden',
                margin: '0 auto',
                width: '100%',
            }}
            aria-hidden="true"
        >
            <ins
                className="adsbygoogle"
                style={{ display: 'block', width: '100%', minHeight: `${minHeight}px` }}
                data-ad-client="ca-pub-7966032964949083"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive="true"
            />
        </div>
    );
}
