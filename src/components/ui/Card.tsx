'use client';

import React from 'react';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'surface';
    padding?: 'sm' | 'md' | 'lg';
    className?: string;
    style?: React.CSSProperties;
}

export default function Card({
    children,
    variant = 'default',
    padding = 'md',
    className = '',
    style = {},
}: CardProps) {
    const padMap = { sm: '16px', md: '24px', lg: '32px' };

    return (
        <div
            className={`card card-${variant} ${className}`}
            style={{
                backgroundColor: variant === 'surface' ? 'var(--color-surface)' : 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-card)',
                padding: padMap[padding],
                boxShadow: 'var(--shadow-card)',
                transition: 'box-shadow var(--transition-base)',
                ...style,
            }}
        >
            {children}
        </div>
    );
}
