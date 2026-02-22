import React, { Suspense } from 'react';
import CalculadoraClient from './CalculadoraClient';

export default function CalculadoraArgentinaPage() {
    return (
        <Suspense>
            <CalculadoraClient />
        </Suspense>
    );
}
