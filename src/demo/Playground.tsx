import { FC, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { MilSymbol } from '../components/MilSymbol';
import { useMilSymbol } from '../hooks/useMilSymbol';
import { SymbolOptions } from '../types';
import { presets, presetGroups } from './presets';
import {
    patchAffiliation,
    readAffiliation,
    isNumericSidc,
    type Affiliation,
} from './sidc';

const AFFILIATIONS: { key: Affiliation; label: string }[] = [
    { key: 'friend', label: 'Friend' },
    { key: 'hostile', label: 'Hostile' },
    { key: 'neutral', label: 'Neutral' },
    { key: 'unknown', label: 'Unknown' },
];

const COLOR_MODES = ['Light', 'Medium', 'Dark'] as const;

type PlaygroundOptions = {
    size: number;
    fill: boolean;
    fillOpacity: number;
    colorMode: string;
    direction: string;
    infoFields: boolean;
    uniqueDesignation: string;
    higherFormation: string;
};

const DEFAULT_OPTIONS: PlaygroundOptions = {
    size: 45,
    fill: true,
    fillOpacity: 1,
    colorMode: 'Light',
    direction: '',
    infoFields: true,
    uniqueDesignation: '',
    higherFormation: '',
};

/**
 * Build the options object actually handed to the library. Empty strings are dropped
 * rather than passed through — milsymbol renders an empty text amplifier as blank space,
 * which makes the symbol jump around as you type.
 */
const toSymbolOptions = (o: PlaygroundOptions): SymbolOptions => ({
    size: o.size,
    fill: o.fill,
    fillOpacity: o.fillOpacity,
    colorMode: o.colorMode,
    infoFields: o.infoFields,
    ...(o.direction !== '' && { direction: o.direction }),
    ...(o.uniqueDesignation !== '' && { uniqueDesignation: o.uniqueDesignation }),
    ...(o.higherFormation !== '' && { higherFormation: o.higherFormation }),
});

/** Render the snippet a visitor came here to copy. */
const buildSnippet = (sidc: string, o: PlaygroundOptions): string => {
    const opts: string[] = [`size: ${o.size}`];
    if (!o.fill) opts.push('fill: false');
    if (o.fillOpacity !== 1) opts.push(`fillOpacity: ${o.fillOpacity}`);
    if (o.colorMode !== 'Light') opts.push(`colorMode: "${o.colorMode}"`);
    if (!o.infoFields) opts.push('infoFields: false');
    if (o.direction !== '') opts.push(`direction: "${o.direction}"`);
    if (o.uniqueDesignation !== '') opts.push(`uniqueDesignation: "${o.uniqueDesignation}"`);
    if (o.higherFormation !== '') opts.push(`higherFormation: "${o.higherFormation}"`);

    return `<MilSymbol
  position={[51.505, -0.09]}
  sidc="${sidc}"
  options={{
    ${opts.join(',\n    ')}
  }}
/>`;
};

type Props = {
    sidc: string;
    onSidcChange: (sidc: string) => void;
};

export const Playground: FC<Props> = ({ sidc, onSidcChange }) => {
    const [options, setOptions] = useState<PlaygroundOptions>(DEFAULT_OPTIONS);
    const [copied, setCopied] = useState(false);

    // The library warns on every invalid SIDC. Without debouncing, each keystroke of a
    // half-typed code is a distinct invalid string and earns its own console warning.
    // 250ms collapses the noise to roughly one warning per thing you actually meant to type.
    const [debouncedSidc, setDebouncedSidc] = useState(sidc);
    useEffect(() => {
        const id = setTimeout(() => setDebouncedSidc(sidc), 250);
        return () => clearTimeout(id);
    }, [sidc]);

    const symbolOptions = useMemo(() => toSymbolOptions(options), [options]);
    const symbol = useMilSymbol(debouncedSidc, symbolOptions);

    // isValid(true) returns per-field detail rather than a single boolean — this is what
    // turns "invalid SIDC" into "affiliation parsed, but no icon matches that entity".
    const detail = useMemo(
        () => symbol.isValid(true) as Record<string, unknown>,
        [symbol]
    );
    const valid = useMemo(() => symbol.isValid(), [symbol]);

    const activeAffiliation = readAffiliation(sidc);
    const snippet = buildSnippet(debouncedSidc, options);

    const set = <K extends keyof PlaygroundOptions>(key: K, value: PlaygroundOptions[K]) =>
        setOptions((prev) => ({ ...prev, [key]: value }));

    const copySnippet = () => {
        navigator.clipboard?.writeText(snippet).then(
            () => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            },
            () => setCopied(false)
        );
    };

    return (
        <div className="playground">
            <div className="playground-main">
                {/* --- Editor ------------------------------------------------ */}
                <div className="info-card">
                    <h2>SIDC</h2>
                    <input
                        className="sidc-input"
                        value={sidc}
                        spellCheck={false}
                        autoComplete="off"
                        aria-label="Symbol identification code"
                        onChange={(e) => onSidcChange(e.target.value.trim())}
                    />
                    <div className="sidc-meta">
                        <span className={`format-badge ${isNumericSidc(sidc) ? 'numeric' : 'letter'}`}>
                            {isNumericSidc(sidc) ? 'APP-6D' : 'APP-6B/C'}
                        </span>
                        <span className="char-count">{sidc.length} characters</span>
                    </div>

                    <h3>Affiliation</h3>
                    <p className="hint">
                        Swaps one character &mdash; the entity stays the same.
                    </p>
                    <div className="affiliation-row">
                        {AFFILIATIONS.map(({ key, label }) => (
                            <button
                                key={key}
                                type="button"
                                className={`btn ${activeAffiliation === key ? '' : 'btn-secondary'}`}
                                onClick={() => onSidcChange(patchAffiliation(sidc, key))}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- Live render ------------------------------------------- */}
                <div className="info-card">
                    <h2>Result</h2>
                    <div className="preview-row">
                        <div
                            className={`symbol-preview ${valid ? '' : 'invalid'}`}
                            dangerouslySetInnerHTML={{ __html: symbol.asSVG() }}
                        />
                        <div className="preview-map">
                            <MapContainer
                                center={[51.505, -0.09]}
                                zoom={13}
                                style={{ height: '220px', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <MilSymbol
                                    key={debouncedSidc}
                                    position={[51.505, -0.09]}
                                    sidc={debouncedSidc}
                                    options={symbolOptions}
                                    tooltipContent={debouncedSidc}
                                />
                            </MapContainer>
                        </div>
                    </div>
                </div>

                {/* --- Diagnostics ------------------------------------------- */}
                <div className="info-card">
                    <h2>
                        Validity
                        <span className={`validity-pill ${valid ? 'ok' : 'bad'}`}>
                            {valid ? 'valid' : 'invalid'}
                        </span>
                    </h2>
                    <p className="hint">
                        Reported by milsymbol&rsquo;s <code>isValid(true)</code>, field by field.
                        A code can parse and still draw an empty frame when no icon matches
                        the entity &mdash; that shows up here as <code>icon: false</code>.
                    </p>
                    <table className="validity-table">
                        <tbody>
                            {Object.entries(detail).map(([field, value]) => {
                                const bad = value === false || value === 'undefined';
                                return (
                                    <tr key={field} className={bad ? 'bad' : 'ok'}>
                                        <th scope="row">{field}</th>
                                        <td>{String(value)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {!valid && (
                        <p className="hint">
                            The library also logs this to your browser console &mdash; open
                            devtools and you will see the same warning your own app would emit.
                        </p>
                    )}
                </div>
            </div>

            {/* --- Options + snippet + presets ------------------------------- */}
            <div className="playground-side">
                <div className="info-card">
                    <h2>Options</h2>

                    <label className="control">
                        <span>size <em>{options.size}</em></span>
                        <input
                            type="range" min={20} max={120} step={1}
                            value={options.size}
                            onChange={(e) => set('size', Number(e.target.value))}
                        />
                    </label>

                    <label className="control">
                        <span>fillOpacity <em>{options.fillOpacity}</em></span>
                        <input
                            type="range" min={0} max={1} step={0.05}
                            value={options.fillOpacity}
                            onChange={(e) => set('fillOpacity', Number(e.target.value))}
                        />
                    </label>

                    <label className="control">
                        <span>direction <em>{options.direction || 'none'}</em></span>
                        <input
                            type="range" min={0} max={359} step={1}
                            value={options.direction === '' ? 0 : Number(options.direction)}
                            onChange={(e) => set('direction', e.target.value)}
                        />
                    </label>

                    <label className="control">
                        <span>colorMode</span>
                        <select
                            value={options.colorMode}
                            onChange={(e) => set('colorMode', e.target.value)}
                        >
                            {COLOR_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </label>

                    <label className="control checkbox">
                        <input
                            type="checkbox" checked={options.fill}
                            onChange={(e) => set('fill', e.target.checked)}
                        />
                        <span>fill</span>
                    </label>

                    <label className="control checkbox">
                        <input
                            type="checkbox" checked={options.infoFields}
                            onChange={(e) => set('infoFields', e.target.checked)}
                        />
                        <span>infoFields</span>
                    </label>

                    <label className="control">
                        <span>uniqueDesignation</span>
                        <input
                            type="text" value={options.uniqueDesignation} placeholder="e.g. A/1-5"
                            onChange={(e) => set('uniqueDesignation', e.target.value)}
                        />
                    </label>

                    <label className="control">
                        <span>higherFormation</span>
                        <input
                            type="text" value={options.higherFormation} placeholder="e.g. 3BCT"
                            onChange={(e) => set('higherFormation', e.target.value)}
                        />
                    </label>

                    <button
                        type="button"
                        className="btn btn-secondary reset-btn"
                        onClick={() => setOptions(DEFAULT_OPTIONS)}
                    >
                        Reset options
                    </button>
                </div>

                <div className="info-card">
                    <h2>
                        Code
                        <button type="button" className="btn copy-btn" onClick={copySnippet}>
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </h2>
                    <pre>{snippet}</pre>
                </div>

                <div className="info-card">
                    <h2>Start from a symbol</h2>
                    {presetGroups.map((group) => (
                        <div key={group} className="preset-group">
                            <h3>{group}</h3>
                            <div className="preset-row">
                                {presets
                                    .filter((p) => p.group === group)
                                    .map((p) => (
                                        <button
                                            key={p.sidc}
                                            type="button"
                                            className={`preset ${p.sidc === sidc ? 'active' : ''}`}
                                            onClick={() => onSidcChange(p.sidc)}
                                            title={p.sidc}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
