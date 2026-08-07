import { FC, useCallback, useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import './App.css';
import { MapDemo } from './demo/MapDemo';
import { Playground } from './demo/Playground';
import { GettingStarted } from './demo/GettingStarted';
import { buildHash, parseHash } from './demo/sidc';

const TABS = [
    { key: 'start', label: 'Getting started' },
    { key: 'playground', label: 'Playground' },
    { key: 'map', label: 'Map demo' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

const DEFAULT_SIDC = 'SFGPUCI----D';

const isTabKey = (value: string | undefined): value is TabKey =>
    TABS.some((t) => t.key === value);

const App: FC = () => {
    // Initial state comes from the URL so a shared link lands on the right tab and symbol.
    const [tab, setTab] = useState<TabKey>(() => {
        const { tab: hashTab } = parseHash(window.location.hash);
        return isTabKey(hashTab) ? hashTab : 'start';
    });
    const [sidc, setSidc] = useState<string>(() => {
        const { sidc: hashSidc } = parseHash(window.location.hash);
        return hashSidc ?? DEFAULT_SIDC;
    });

    // replaceState, not pushState: dragging a slider or typing a SIDC shouldn't bury the
    // back button under a hundred history entries.
    useEffect(() => {
        const next = buildHash({ tab, sidc: tab === 'playground' ? sidc : undefined });
        if (next !== window.location.hash) {
            window.history.replaceState(null, '', next || window.location.pathname);
        }
    }, [tab, sidc]);

    const openInPlayground = useCallback((next: string) => {
        setSidc(next);
        setTab('playground');
    }, []);

    return (
        <div className="app">
            <div className="header">
                <h1>react-leaflet-milsymbol</h1>
                <p>
                    A React component library for displaying military symbols in Leaflet maps
                    using the milsymbol library. Easily add military symbols to your React Leaflet maps.
                </p>
                <nav className="tabs" aria-label="Sections">
                    {TABS.map(({ key, label }) => (
                        <button
                            key={key}
                            type="button"
                            className={`tab ${tab === key ? 'active' : ''}`}
                            aria-current={tab === key ? 'page' : undefined}
                            onClick={() => setTab(key)}
                        >
                            {label}
                        </button>
                    ))}
                </nav>
            </div>

            {tab === 'start' && <GettingStarted onTrySidc={openInPlayground} />}
            {tab === 'playground' && <Playground sidc={sidc} onSidcChange={setSidc} />}
            {tab === 'map' && <MapDemo />}

            <footer className="footer">
                <p>
                    Created with <a href="https://github.com/jacorbello/react-leaflet-milsymbol" target="_blank" rel="noopener noreferrer">react-leaflet-milsymbol</a> |
                    <a href="https://github.com/jacorbello/react-leaflet-milsymbol/issues" target="_blank" rel="noopener noreferrer">Report an issue</a>
                </p>
            </footer>
        </div>
    );
};

export default App;
