import { useMemo } from 'react';
import ms from 'milsymbol';
import { SymbolOptions } from '../types';

// ponytail: unbounded Set — one entry per distinct bad SIDC, which is bounded in
// practice. Swap for an LRU if an app ever generates infinite distinct bad codes.
const warned = new Set<string>();

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
        const symbol = new ms.Symbol(sidc, {
            size: 35,
            ...options,
        });

        // milsymbol renders an empty placeholder rather than throwing, so without
        // this a typo'd SIDC is an invisible marker with no diagnostic. Warn rather
        // than throw to preserve that behaviour; dedupe so re-renders and
        // StrictMode's double-invoke don't spam the console.
        if (!symbol.isValid() && !warned.has(sidc)) {
            warned.add(sidc);
            console.warn(
                `[react-leaflet-milsymbol] Invalid SIDC "${sidc}" — the symbol will render ` +
                `as an empty placeholder. See https://sidc.milsymb.net/#/APP6 to build a valid one.`
            );
        }

        return symbol;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optionsKey, sidc]);
};
