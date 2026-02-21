'use client';

import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label: string;
    error?: string;
    hint?: string;
    size?: 'sm' | 'md';
}

export default function Input({
    label,
    error,
    hint,
    size = 'md',
    id,
    className = '',
    ...props
}: InputProps) {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
                htmlFor={inputId}
                style={{
                    fontSize: 'var(--font-size-label)',
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)',
                    fontFamily: 'var(--font-family)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                }}
            >
                {label}
            </label>
            <input
                id={inputId}
                className={`input-field ${error ? 'input-error' : ''} ${className}`}
                style={{
                    fontFamily: 'var(--font-family)',
                    fontSize: size === 'sm' ? '15px' : '17px',
                    padding: size === 'sm' ? '10px 14px' : '13px 16px',
                    backgroundColor: 'var(--color-bg)',
                    border: `1.5px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-input)',
                    color: 'var(--color-text-primary)',
                    outline: 'none',
                    transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
                    width: '100%',
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-primary-action)';
                    e.target.style.boxShadow = error
                        ? '0 0 0 3px rgba(220, 38, 38, 0.15)'
                        : 'var(--shadow-focus)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)';
                    e.target.style.boxShadow = 'none';
                }}
                aria-invalid={!!error}
                aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
                {...props}
            />
            {error && (
                <span
                    id={`${inputId}-error`}
                    role="alert"
                    style={{
                        fontSize: '13px',
                        color: 'var(--color-error)',
                        fontFamily: 'var(--font-family)',
                    }}
                >
                    {error}
                </span>
            )}
            {hint && !error && (
                <span
                    id={`${inputId}-hint`}
                    style={{
                        fontSize: '13px',
                        color: 'var(--color-text-secondary)',
                        fontFamily: 'var(--font-family)',
                    }}
                >
                    {hint}
                </span>
            )}
        </div>
    );
}
