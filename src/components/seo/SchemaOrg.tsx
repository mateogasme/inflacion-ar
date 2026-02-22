import React from 'react';

export default function SchemaOrg() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Calculadora de Inflación Argentina',
        url: 'https://calculadora-inflacion.ar',
        description:
            'Calculá cuánto vale hoy un monto del pasado usando datos oficiales del IPC (INDEC). Inflación acumulada, promedio anual y gráfico.',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'ARS',
        },
        creator: {
            '@type': 'Organization',
            name: 'Calculadora de Inflación',
        },
        dateModified: new Date().toISOString().split('T')[0],
        inLanguage: 'es-AR',
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
