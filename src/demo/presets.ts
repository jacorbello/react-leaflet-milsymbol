/**
 * Curated starting points for the playground.
 *
 * Every SIDC here is asserted valid by `src/__tests__/demo-sidc.test.ts` — not just
 * `isValid()`, but `isValid(true).icon === true`, which is the stronger claim: a code
 * can be "valid" and still render a blank frame because no icon matches the entity,
 * which would make the label below a lie.
 *
 * ponytail: no `dimension` field — the UI reads it from milsymbol at runtime via
 * isValid(true), so this table can't drift out of sync with upstream.
 */
export type Preset = {
    label: string;
    sidc: string;
    format: 'letter' | 'numeric';
    group: string;
};

export const presets: Preset[] = [
    // --- Ground units, letter-based (APP-6B/C) ---
    { label: 'Infantry', sidc: 'SFGPUCI----D', format: 'letter', group: 'Ground' },
    { label: 'Armor', sidc: 'SFGPUCA----D', format: 'letter', group: 'Ground' },
    { label: 'Field artillery', sidc: 'SFGPUCF----D', format: 'letter', group: 'Ground' },
    { label: 'Air defense', sidc: 'SFGPUCD----D', format: 'letter', group: 'Ground' },
    { label: 'Engineer', sidc: 'SFGPUCE----D', format: 'letter', group: 'Ground' },
    { label: 'Reconnaissance', sidc: 'SFGPUCR----D', format: 'letter', group: 'Ground' },
    { label: 'Headquarters', sidc: 'SFGPUH-----D', format: 'letter', group: 'Ground' },
    { label: 'Medical', sidc: 'SFGPUSM----D', format: 'letter', group: 'Ground' },
    { label: 'Supply', sidc: 'SFGPUSS----D', format: 'letter', group: 'Ground' },
    { label: 'Airborne infantry', sidc: 'SFGPUCIZ---D', format: 'letter', group: 'Ground' },
    { label: 'Installation (airport)', sidc: 'SFGPIBA----D', format: 'letter', group: 'Ground' },

    // --- The four affiliations, same entity, so the frames can be compared ---
    { label: 'Hostile infantry', sidc: 'SHGPUCI----D', format: 'letter', group: 'Affiliation' },
    { label: 'Neutral infantry', sidc: 'SNGPUCI----D', format: 'letter', group: 'Affiliation' },
    { label: 'Unknown infantry', sidc: 'SUGPUCI----D', format: 'letter', group: 'Affiliation' },

    // --- Air and sea, letter-based ---
    { label: 'Fixed-wing aircraft', sidc: 'SFAPMFF----', format: 'letter', group: 'Air & sea' },
    { label: 'Rotary-wing aircraft', sidc: 'SFAPMHR----', format: 'letter', group: 'Air & sea' },
    { label: 'Unmanned aircraft', sidc: 'SFAPMFQ----', format: 'letter', group: 'Air & sea' },
    { label: 'Surface combatant', sidc: 'SFSPCLBB---', format: 'letter', group: 'Air & sea' },
    { label: 'Aircraft carrier', sidc: 'SFSPCLCV---', format: 'letter', group: 'Air & sea' },
    { label: 'Submarine', sidc: 'SFUPSCA----', format: 'letter', group: 'Air & sea' },

    // --- Numeric (APP-6D) ---
    { label: 'Infantry', sidc: '10031000141211000000', format: 'numeric', group: 'APP-6D' },
    { label: 'Hostile infantry', sidc: '10061000141211000000', format: 'numeric', group: 'APP-6D' },
    { label: 'Neutral infantry', sidc: '10041000141211000000', format: 'numeric', group: 'APP-6D' },
    { label: 'Unknown infantry', sidc: '10011000141211000000', format: 'numeric', group: 'APP-6D' },
    { label: 'Armor', sidc: '10031000141213000000', format: 'numeric', group: 'APP-6D' },
    { label: 'Artillery', sidc: '10031000141216000000', format: 'numeric', group: 'APP-6D' },
    { label: 'Fixed-wing aircraft', sidc: '10030100001101000000', format: 'numeric', group: 'APP-6D' },
    { label: 'Rotary-wing aircraft', sidc: '10030100001102000000', format: 'numeric', group: 'APP-6D' },
    { label: 'Surface combatant', sidc: '10033000001201000000', format: 'numeric', group: 'APP-6D' },
    { label: 'Subsurface', sidc: '10033500001100000000', format: 'numeric', group: 'APP-6D' },
    { label: 'Infantry battalion', sidc: '10031000161211000000', format: 'numeric', group: 'APP-6D' },
    { label: 'Infantry brigade', sidc: '10031000181211000000', format: 'numeric', group: 'APP-6D' },
];

export const presetGroups = [...new Set(presets.map((p) => p.group))];
