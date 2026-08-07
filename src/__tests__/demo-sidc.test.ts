import { describe, it, expect } from 'vitest';
import ms from 'milsymbol';
import {
    patchAffiliation,
    readAffiliation,
    isNumericSidc,
    parseHash,
    buildHash,
    type Affiliation,
} from '../demo/sidc';
import { presets } from '../demo/presets';

/** milsymbol's own name for each affiliation, as reported by isValid(true). */
const MS_NAME: Record<Affiliation, string> = {
    friend: 'Friend',
    hostile: 'Hostile',
    neutral: 'Neutral',
    unknown: 'Unknown',
};

const inspect = (sidc: string) => new ms.Symbol(sidc).isValid(true) as Record<string, unknown>;

describe('preset catalog', () => {
    // isValid() alone is too weak: a code can pass it and still render a blank frame
    // because no icon matched the entity, which would make the preset's label a lie.
    it.each(presets)('$group / $label ($sidc) resolves a real icon', ({ sidc }) => {
        const detail = inspect(sidc);
        expect(detail.icon).toBe(true);
    });

    it('declares the format that matches the code shape', () => {
        for (const { sidc, format } of presets) {
            expect(isNumericSidc(sidc)).toBe(format === 'numeric');
        }
    });

    it('has no duplicate SIDCs', () => {
        const codes = presets.map((p) => p.sidc);
        expect(new Set(codes).size).toBe(codes.length);
    });
});

describe('patchAffiliation', () => {
    // The claim under test is milsymbol's, not ours: after patching, milsymbol must
    // agree the affiliation changed AND the symbol must still resolve an icon.
    const samples = [
        { name: 'letter ground unit', sidc: 'SFGPUCI----D' },
        { name: 'letter aircraft', sidc: 'SFAPMFF----' },
        { name: 'numeric ground unit', sidc: '10031000141211000000' },
        { name: 'numeric aircraft', sidc: '10030100001101000000' },
    ];
    const affiliations: Affiliation[] = ['friend', 'hostile', 'neutral', 'unknown'];

    it.each(samples)('$name keeps its entity across all four affiliations', ({ sidc }) => {
        for (const affiliation of affiliations) {
            const patched = patchAffiliation(sidc, affiliation);
            const detail = inspect(patched);
            expect(detail.affiliation).toBe(MS_NAME[affiliation]);
            expect(detail.icon).toBe(true);
            expect(patched).toHaveLength(sidc.length);
        }
    });

    it('round-trips through readAffiliation', () => {
        for (const affiliation of affiliations) {
            expect(readAffiliation(patchAffiliation('SFGPUCI----D', affiliation))).toBe(affiliation);
            expect(readAffiliation(patchAffiliation('10031000141211000000', affiliation))).toBe(affiliation);
        }
    });

    it('leaves a half-typed code alone rather than mangling it', () => {
        expect(patchAffiliation('', 'hostile')).toBe('');
        expect(patchAffiliation('S', 'hostile')).toBe('S');
    });
});

describe('hash state', () => {
    it('round-trips tab and sidc', () => {
        const state = { tab: 'playground', sidc: 'SFGPUCI----D' };
        expect(parseHash(buildHash(state))).toEqual(state);
    });

    it('round-trips a numeric SIDC', () => {
        const state = { tab: 'playground', sidc: '10031000141211000000' };
        expect(parseHash(buildHash(state))).toEqual(state);
    });

    it('handles an empty or bare hash', () => {
        expect(parseHash('')).toEqual({});
        expect(parseHash('#')).toEqual({});
        expect(parseHash('#map')).toEqual({ tab: 'map' });
        expect(buildHash({})).toBe('');
    });

    it('ignores unknown keys rather than carrying them through', () => {
        expect(parseHash('#playground&sidc=SFGPUCI----D&evil=1')).toEqual({
            tab: 'playground',
            sidc: 'SFGPUCI----D',
        });
    });
});
