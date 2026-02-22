'use client';

import React from 'react';

/**
 * A client-side button component for donations.
 * Extracted from layout.tsx to handle interactivity (hover effects) in a Next.js Server Component environment.
 */
export default function DonateButton() {
    const [showTooltip, setShowTooltip] = React.useState(false);

    return (
        <div style={{ position: 'relative', display: 'inline-flex' }}>
            <a
                href="https://link.mercadopago.com.ar/mateogasme"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#000000',
                    backgroundColor: '#fde802', // MP Yellow
                    border: '1px solid rgba(0,0,0,0.05)',
                    borderRadius: '100px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-family)',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    position: 'relative',
                    zIndex: 2,
                    transform: showTooltip ? 'translateY(-1px)' : 'translateY(0)',
                    textDecoration: 'none',
                }}
            >
                <img
                    src="https://http2.mlstatic.com/frontend-assets/mp-web-navigation/ui-navigation/7.1.9/mercadopago/favicon.svg"
                    alt="Mercado Pago"
                    style={{ width: '16px', height: '16px' }}
                />
                Donar
            </a>

            {/* Custom Tooltip */}
            <div
                style={{
                    position: 'absolute',
                    top: 'calc(100% + 12px)',
                    right: '50%',
                    transform: `translateX(50%) translateY(${showTooltip ? '0' : '8px'})`,
                    width: '288px',
                    padding: '12px 16px',
                    backgroundColor: 'var(--color-primary)', // #0F172A
                    color: '#FFFFFF',
                    borderRadius: '14px',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    fontWeight: 500,
                    textAlign: 'center',
                    pointerEvents: 'none',
                    opacity: showTooltip ? 1 : 0,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 20px 40px -8px rgba(15, 23, 42, 0.3), 0 12px 16px -8px rgba(15, 23, 42, 0.2)',
                    zIndex: 10,
                }}
            >
                {/* Triangle arrow */}
                <div style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '0',
                    height: '0',
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderBottom: '8px solid var(--color-primary)',
                }} />
                Este botón es solo para apoyo voluntario. Si querés, podés transferir una donación para ayudar a mantener la calculadora gratis. No hay beneficios por donar.
            </div>
        </div>
    );
}
