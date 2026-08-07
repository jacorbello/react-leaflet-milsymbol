/**
 * Pure SIDC + URL helpers for the demo. Kept free of React so they can be tested
 * directly — see `src/__tests__/demo-sidc.test.ts`.
 */

export type Affiliation = 'friend' | 'hostile' | 'neutral' | 'unknown';

/** Letter-based (APP-6B/C) affiliation lives at index 1; numeric (APP-6D) at index 3. */
const LETTER_AFFILIATION_INDEX = 1;
const NUMERIC_AFFILIATION_INDEX = 3;

const LETTER_CODES: Record<Affiliation, string> = {
    friend: 'F',
    hostile: 'H',
    neutral: 'N',
    unknown: 'U',
};

const NUMERIC_CODES: Record<Affiliation, string> = {
    friend: '3',
    hostile: '6',
    neutral: '4',
    unknown: '1',
};

export const isNumericSidc = (sidc: string): boolean => /^\d{20}$/.test(sidc);

/**
 * Swap the affiliation of an existing SIDC, leaving the entity alone.
 *
 * This works on any entity in either format — verified against milsymbol for both
 * ground units and aircraft — which is why the playground can offer affiliation
 * buttons without shipping a symbol taxonomy.
 *
 * Returns the input unchanged when it is too short to carry an affiliation, so a
 * half-typed code doesn't get mangled mid-keystroke.
 */
export const patchAffiliation = (sidc: string, affiliation: Affiliation): string => {
    if (isNumericSidc(sidc)) {
        return (
            sidc.slice(0, NUMERIC_AFFILIATION_INDEX) +
            NUMERIC_CODES[affiliation] +
            sidc.slice(NUMERIC_AFFILIATION_INDEX + 1)
        );
    }
    if (sidc.length <= LETTER_AFFILIATION_INDEX) return sidc;
    return (
        sidc.slice(0, LETTER_AFFILIATION_INDEX) +
        LETTER_CODES[affiliation] +
        sidc.slice(LETTER_AFFILIATION_INDEX + 1)
    );
};

/** Read the affiliation currently encoded in a SIDC, or null if it isn't one of the four. */
export const readAffiliation = (sidc: string): Affiliation | null => {
    const table = isNumericSidc(sidc) ? NUMERIC_CODES : LETTER_CODES;
    const index = isNumericSidc(sidc) ? NUMERIC_AFFILIATION_INDEX : LETTER_AFFILIATION_INDEX;
    const char = sidc[index];
    if (char === undefined) return null;
    const match = Object.entries(table).find(([, code]) => code === char.toUpperCase());
    return match ? (match[0] as Affiliation) : null;
};

// --- URL hash state -------------------------------------------------------------

export type HashState = {
    tab?: string;
    sidc?: string;
    size?: number;
};

/**
 * Parse `#playground&sidc=SFGPUCI----D&size=40`.
 *
 * ponytail: hand-rolled rather than URLSearchParams because the leading bare `tab`
 * segment isn't a key=value pair. Swap to URLSearchParams if the shape grows.
 */
export const parseHash = (hash: string): HashState => {
    const raw = hash.replace(/^#/, '');
    if (!raw) return {};

    const state: HashState = {};
    for (const part of raw.split('&')) {
        if (!part) continue;
        const eq = part.indexOf('=');
        if (eq === -1) {
            state.tab = decodeURIComponent(part);
            continue;
        }
        const key = part.slice(0, eq);
        const value = decodeURIComponent(part.slice(eq + 1));
        if (key === 'sidc') state.sidc = value;
        else if (key === 'tab') state.tab = value;
        else if (key === 'size') {
            const n = Number(value);
            if (Number.isFinite(n)) state.size = n;
        }
    }
    return state;
};

export const buildHash = ({ tab, sidc, size }: HashState): string => {
    const parts: string[] = [];
    if (tab) parts.push(encodeURIComponent(tab));
    if (sidc) parts.push(`sidc=${encodeURIComponent(sidc)}`);
    if (size !== undefined) parts.push(`size=${size}`);
    return parts.length ? `#${parts.join('&')}` : '';
};
