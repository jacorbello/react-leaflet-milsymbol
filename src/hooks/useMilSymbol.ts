import { useMemo } from 'react';
import ms from 'milsymbol';
import { SymbolOptions } from '../types';

/**
 * Hook to create and memoize a milsymbol instance
 *
 * @param sidc - Symbol Identification Code
 * @param options - Configuration options for the symbol
 * @returns A milsymbol instance
 */
export const useMilSymbol = (sidc: string, options: SymbolOptions = {}) => {
    const optionsKey = JSON.stringify(options);
    return useMemo(() => {
        return new ms.Symbol(sidc, {
            size: options.size ?? 35,
            ...options,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optionsKey, sidc]);
};
