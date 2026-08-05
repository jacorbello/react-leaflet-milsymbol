import { ReactNode } from 'react';
import { LeafletEventHandlerFnMap } from 'leaflet';
import { Symbol as MsSymbol } from 'milsymbol';

/**
 * Configuration options for a milsymbol Symbol.
 *
 * Derived from milsymbol itself rather than hand-copied, so it tracks
 * upstream automatically. milsymbol does not export SymbolOptions
 * directly, but getOptions() returns it.
 */
export type SymbolOptions = ReturnType<MsSymbol['getOptions']>;

/**
 * Props for the MilSymbol component
 */
export interface MilSymbolProps {
    /** Latitude and longitude position for the symbol */
    position: [number, number];

    /** Symbol Identification Code */
    sidc: string;

    /** Size of the symbol (optional) */
    size?: number;

    /** Additional options to customize the symbol */
    options?: SymbolOptions;

    /** Optional content for tooltip */
    tooltipContent?: string | ReactNode;

    /** Optional content for popup */
    popupContent?: string | ReactNode;

    /** Arbitrary react-leaflet children (tooltips, popups, custom layers) */
    children?: ReactNode;

    /** Event handlers for the symbol */
    eventHandlers?: LeafletEventHandlerFnMap;
}