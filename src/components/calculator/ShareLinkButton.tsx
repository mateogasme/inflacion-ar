'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';

interface ShareLinkButtonProps {
    amount: number;
    originDate: string; // "YYYY-MM"
    destDate: string;   // "YYYY-MM"
    fullWidth?: boolean;
}

export default function ShareLinkButton({ amount, originDate, destDate, fullWidth }: ShareLinkButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleClick = async () => {
        const url = new URL(window.location.href.split('?')[0]);
        url.searchParams.set('monto', String(amount));
        url.searchParams.set('desde', originDate);
        url.searchParams.set('hasta', destDate);

        try {
            await navigator.clipboard.writeText(url.toString());
            setCopied(true);
            trackEvent('share_link_clicked');
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // Fallback
            const input = document.createElement('input');
            input.value = url.toString();
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    return (
        <Button
            variant="secondary"
            size="sm"
            fullWidth={fullWidth}
            onClick={handleClick}
            aria-label="Compartir enlace con este cálculo"
        >
            {copied ? (
                <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    ¡Enlace copiado!
                </>
            ) : (
                <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    Compartir enlace
                </>
            )}
        </Button>
    );
}
