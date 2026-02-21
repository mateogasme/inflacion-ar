'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    children: React.ReactNode;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    children,
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontFamily: 'var(--font-family)',
        fontWeight: 600,
        borderRadius: 'var(--radius-button)',
        border: 'none',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        width: fullWidth ? '100%' : 'auto',
        whiteSpace: 'nowrap',
        ...(size === 'sm' && { padding: '8px 16px', fontSize: '14px' }),
        ...(size === 'md' && { padding: '12px 24px', fontSize: '16px' }),
        ...(size === 'lg' && { padding: '16px 32px', fontSize: '17px' }),
    };

    const variantStyles: Record<string, React.CSSProperties> = {
        primary: {
            backgroundColor: 'var(--color-primary-action)',
            color: '#FFFFFF',
        },
        secondary: {
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-primary)',
            border: '1.5px solid var(--color-border)',
        },
        accent: {
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-primary)',
        },
    };

    return (
        <button
            style={{ ...baseStyles, ...variantStyles[variant] }}
            className={`btn btn-${variant} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
