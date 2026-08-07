import { FC } from 'react';

type Props = {
    /** Jump to the playground with a SIDC preloaded — the thing a static README can't do. */
    onTrySidc: (sidc: string) => void;
};

const TryButton: FC<{ sidc: string; onTrySidc: (s: string) => void }> = ({ sidc, onTrySidc }) => (
    <button type="button" className="btn btn-secondary try-btn" onClick={() => onTrySidc(sidc)}>
        Try <span className="sidc-code">{sidc}</span> &rarr;
    </button>
);

export const GettingStarted: FC<Props> = ({ onTrySidc }) => (
    <div className="content-area getting-started">
        <div className="info-section">
            <div className="info-card">
                <h2>1. Install</h2>
                <pre>npm install react-leaflet-milsymbol</pre>
                <p>Plus the peer dependencies, if your project doesn&rsquo;t already have them:</p>
                <pre>npm install react react-dom leaflet react-leaflet milsymbol</pre>
                <p className="hint">
                    Works with react-leaflet v4 (React 18) and v5 (React 19). Both are tested
                    on every commit.
                </p>
            </div>

            <div className="info-card">
                <h2>2. Put a symbol on a map</h2>
                <pre>{`import { MapContainer, TileLayer } from 'react-leaflet';
import { MilSymbol } from 'react-leaflet-milsymbol';
import 'leaflet/dist/leaflet.css';

const MyMap = () => (
  <MapContainer center={[51.505, -0.09]} zoom={13}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

    <MilSymbol
      position={[51.505, -0.09]}
      sidc="SFGPUCI----D"
      options={{ size: 35 }}
      tooltipContent="Infantry"
    />
  </MapContainer>
);`}</pre>
                <TryButton sidc="SFGPUCI----D" onTrySidc={onTrySidc} />
            </div>
        </div>

        <div className="info-section">
            <div className="info-card">
                <h2>3. What is a SIDC?</h2>
                <p>
                    A <strong>Symbol Identification Code</strong> is the string that decides
                    which military symbol gets drawn. It encodes three things: who it is
                    (affiliation &mdash; friendly, hostile, neutral, unknown), where it operates
                    (ground, air, sea), and what it actually is (infantry, armor, aircraft).
                </p>
                <p>
                    It&rsquo;s the one prop you can&rsquo;t guess, so start by copying one and
                    changing it a character at a time.
                </p>

                <h3>Two formats, both accepted</h3>
                <table className="validity-table">
                    <tbody>
                        <tr>
                            <th scope="row">Letter-based <span className="format-badge letter">APP-6B/C</span></th>
                            <td><span className="sidc-code">SFGPUCI----D</span></td>
                        </tr>
                        <tr>
                            <th scope="row">Numeric <span className="format-badge numeric">APP-6D</span></th>
                            <td><span className="sidc-code">10031000141211000000</span></td>
                        </tr>
                    </tbody>
                </table>

                <h3>Affiliation is one character</h3>
                <p>
                    In a letter code it&rsquo;s the 2nd character; in a numeric one it&rsquo;s the
                    4th digit. Everything else stays put, so you can flip a friendly unit to a
                    hostile one without touching the entity:
                </p>
                <table className="validity-table">
                    <tbody>
                        <tr><th scope="row">Friend</th><td><span className="sidc-code">S<b>F</b>GPUCI----D</span></td></tr>
                        <tr><th scope="row">Hostile</th><td><span className="sidc-code">S<b>H</b>GPUCI----D</span></td></tr>
                        <tr><th scope="row">Neutral</th><td><span className="sidc-code">S<b>N</b>GPUCI----D</span></td></tr>
                        <tr><th scope="row">Unknown</th><td><span className="sidc-code">S<b>U</b>GPUCI----D</span></td></tr>
                    </tbody>
                </table>
                <TryButton sidc="SHGPUCI----D" onTrySidc={onTrySidc} />
            </div>

            <div className="info-card">
                <h2>4. When a symbol doesn&rsquo;t appear</h2>
                <p>
                    An invalid SIDC doesn&rsquo;t throw &mdash; milsymbol draws an empty
                    placeholder, which looks identical to a missing marker. Since v0.3.1 the
                    library logs a warning naming the bad code, so check the console first.
                </p>
                <p>
                    The <strong>Playground</strong> tab shows the same information as a table,
                    field by field, so you can see whether the affiliation parsed but the entity
                    didn&rsquo;t.
                </p>
                <TryButton sidc="NOTASIDC" onTrySidc={onTrySidc} />
            </div>

            <div className="info-card">
                <h2>Full API reference</h2>
                <p>
                    Props, the complete options object, and the <code>useMilSymbol</code> hook are
                    documented in the README &mdash; kept canonical there rather than duplicated
                    here.
                </p>
                <ul>
                    <li><a href="https://github.com/jacorbello/react-leaflet-milsymbol#readme" target="_blank" rel="noopener noreferrer">README &mdash; full API reference</a></li>
                    <li><a href="https://github.com/jacorbello/react-leaflet-milsymbol/blob/main/CHANGELOG.md" target="_blank" rel="noopener noreferrer">Changelog</a></li>
                    <li><a href="https://sidc.milsymb.net/#/APP6" target="_blank" rel="noopener noreferrer">Interactive SIDC builder</a></li>
                </ul>
            </div>
        </div>
    </div>
);
