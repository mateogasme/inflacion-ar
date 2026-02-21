'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';

interface CopyResultButtonProps {
    text: string;
}

export default function CopyResultButton({ text }: CopyResultButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            trackEvent('copy_result_clicked');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            trackEvent('copy_result_clicked');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            aria-label={copied ? 'Resultado copiado' : 'Copiar resultado al portapapeles'}
        >
            {copied ? (
                <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copiado
                </>
            ) : (
                <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copiar resultado
                </>
            )}
        </Button>
    );
}
