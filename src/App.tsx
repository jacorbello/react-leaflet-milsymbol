import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import { DivIcon, Marker as LeafletMarker } from 'leaflet';
import { MilSymbol } from './components/MilSymbol';
import { useMilSymbol } from './hooks/useMilSymbol';
import 'leaflet/dist/leaflet.css';
import './App.css';
import { SymbolOptions } from './types';


type SymbolDataProps = {
    name: string;
    sidc: string;
    position: [number, number];
    description: string;
    format: 'letter' | 'numeric';
    options: Partial<SymbolOptions>;
}

const symbolData: SymbolDataProps[] = [
    // Letter-based SIDC (APP-6B/C)
    {
        name: "Infantry Unit",
        sidc: "SFGPEWRH--MT",
        position: [51.505, -0.09],
        description: "Standard infantry unit symbol",
        format: 'letter',
        options: { size: 35 }
    },
    {
        name: "Armor Unit",
        sidc: "SFGPUCA---MT",
        position: [51.51, -0.1],
        description: "Armored combat vehicle unit",
        format: 'letter',
        options: { size: 35, fill: true, fillOpacity: 0.7 }
    },
    {
        name: "Air Defense Unit",
        sidc: "SFGPUCD---MT",
        position: [51.5, -0.08],
        description: "Air defense unit with custom coloring",
        format: 'letter',
        options: { size: 35, colorMode: "Dark", monoColor: "rgb(0, 100, 255)" }
    },
    {
        name: "Artillery Unit",
        sidc: "SFGPUCF---MT",
        position: [51.515, -0.12],
        description: "Field artillery unit",
        format: 'letter',
        options: { size: 35, fillOpacity: 0.5 }
    },
    // Numeric SIDC (APP-6D)
    {
        name: "Friendly Infantry Battalion",
        sidc: "10031000161200000000",
        position: [51.508, -0.06],
        description: "Infantry battalion using numeric APP-6D SIDC",
        format: 'numeric',
        options: { size: 35 }
    },
    {
        name: "Hostile Armor Company",
        sidc: "10061000151300000000",
        position: [51.502, -0.065],
        description: "Hostile armor company using numeric APP-6D SIDC",
        format: 'numeric',
        options: { size: 35 }
    },
    {
        name: "Neutral Air Unit",
        sidc: "10040100001100000000",
        position: [51.512, -0.055],
        description: "Neutral military fixed-wing aircraft using numeric APP-6D SIDC",
        format: 'numeric',
        options: { size: 35 }
    },
    {
        name: "Friendly Armored Brigade",
        sidc: "10031000181304000000",
        position: [51.498, -0.075],
        description: "Friendly armored brigade with task force modifier using numeric APP-6D SIDC",
        format: 'numeric',
        options: { size: 35, fill: true }
    },
];

// --- Circling reconnaissance aircraft (animated demo) ---

const RECON_SIDC = '10030100001101110000';
const CIRCLE_CENTER_LAT = 51.507;
const CIRCLE_CENTER_LNG = -0.085;
const RADIUS_LAT = 0.008;
const RADIUS_LNG = 0.01283; // corrected for Mercator at ~51.5°N
const ORBIT_SPEED = 0.6; // radians per second
const HEADING_UPDATE_THRESHOLD = 15; // degrees

const CirclingAircraft: FC = () => {
    // Stable position — same reference every render, prevents react-leaflet
    // from snapping the marker back when the component re-renders for icon updates
    const initialPosition = useMemo<[number, number]>(
        () => [CIRCLE_CENTER_LAT + RADIUS_LAT, CIRCLE_CENTER_LNG], []
    );

    const angleRef = useRef(0);
    const markerRef = useRef<LeafletMarker | null>(null);
    const rafIdRef = useRef(0);
    const lastHeadingRef = useRef(0);

    // Heading state — the only React state; triggers icon re-creation ~2x/sec
    const [heading, setHeading] = useState(0);

    const milSymbol = useMilSymbol(RECON_SIDC, {
        size: 35,
        direction: String(heading),
    });

    const divIcon = useMemo(() => new DivIcon({
        html: milSymbol.asSVG(),
        className: '',
        iconSize: [milSymbol.getSize().width, milSymbol.getSize().height],
        iconAnchor: [milSymbol.getAnchor().x, milSymbol.getAnchor().y],
    }), [milSymbol]);

    // Imperatively update icon when it changes (heading rotated)
    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.setIcon(divIcon);
        }
    }, [divIcon]);

    // Animation loop — runs once on mount, never restarts
    useEffect(() => {
        let lastTime = performance.now();

        const animate = (now: number) => {
            const dt = (now - lastTime) / 1000;
            lastTime = now;

            angleRef.current += ORBIT_SPEED * dt;

            // Position on the circle (clockwise from north)
            const lat = CIRCLE_CENTER_LAT + RADIUS_LAT * Math.cos(angleRef.current);
            const lng = CIRCLE_CENTER_LNG + RADIUS_LNG * Math.sin(angleRef.current);

            // Imperatively move marker — no React state update
            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng]);
            }

            // Update heading icon every ~15° of travel
            // +90 converts radial angle to tangent (direction of travel) for clockwise orbit
            const headingDeg = ((angleRef.current * 180 / Math.PI + 90) % 360 + 360) % 360;
            if (Math.abs(headingDeg - lastHeadingRef.current) >= HEADING_UPDATE_THRESHOLD) {
                lastHeadingRef.current = headingDeg;
                setHeading(Math.round(headingDeg));
            }

            rafIdRef.current = requestAnimationFrame(animate);
        };

        rafIdRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafIdRef.current);
    }, []);

    return (
        <Marker position={initialPosition} icon={divIcon} ref={markerRef}>
            <Tooltip>Recon Aircraft (circling)</Tooltip>
        </Marker>
    );
};

const App: FC = () => {
    return (
        <div className="app">
            <div className="header">
                <h1>react-leaflet-milsymbol</h1>
                <p>
                    A React component library for displaying military symbols in Leaflet maps
                    using the milsymbol library. Easily add military symbols to your React Leaflet v4 maps.
                </p>
            </div>

            <div className="map-container">
                <MapContainer
                    center={[51.505, -0.09]}
                    zoom={13}
                    style={{ height: '500px', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {symbolData.map((symbol) => (
                        <MilSymbol
                            key={symbol.sidc + symbol.position.join(',')}
                            position={symbol.position}
                            sidc={symbol.sidc}
                            options={symbol.options}
                            tooltipContent={symbol.name}
                            popupContent={
                                <div>
                                    <h3>{symbol.name}</h3>
                                    <p>
                                        <span className="sidc-code">{symbol.sidc}</span>
                                        {' '}
                                        <span className={`format-badge ${symbol.format}`}>
                                            {symbol.format === 'letter' ? 'APP-6B' : 'APP-6D'}
                                        </span>
                                    </p>
                                    <p>{symbol.description}</p>
                                </div>
                            }
                        />
                    ))}

                    <CirclingAircraft />
                </MapContainer>
            </div>

            <div className="content-area">
                <div className="info-section">
                    <div className="info-card">
                        <h2>Installation</h2>
                        <pre>npm install react-leaflet-milsymbol</pre>
                        <p>Make sure you have the required peer dependencies:</p>
                        <pre>npm install leaflet react-leaflet milsymbol</pre>
                    </div>

                    <div className="info-card">
                        <h2>Basic Usage</h2>
                        <pre>{`import { MapContainer, TileLayer } from 'react-leaflet';
import { MilSymbol } from 'react-leaflet-milsymbol';

const MyMap = () => (
  <MapContainer center={[51.505, -0.09]} zoom={13}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    
    <MilSymbol
      position={[51.505, -0.09]}
      sidc="SFGPEWRH--MT"
      options={{
        size: 35,
        fill: true,
        fillOpacity: 0.7
      }}
      tooltipContent="Infantry Unit"
    />
  </MapContainer>
);`}</pre>
                    </div>
                </div>

                <div className="info-section">
                    <div className="info-card">
                        <h2>Available Symbols</h2>
                        <p>Here are the symbols used in this demo:</p>
                        <div className="symbol-list">
                            {symbolData.map((symbol) => (
                                <div key={symbol.sidc} className="symbol-item">
                                    <div className="symbol-info">
                                        <h3>
                                            {symbol.name}
                                            <span className={`format-badge ${symbol.format}`}>
                                                {symbol.format === 'letter' ? 'APP-6B' : 'APP-6D'}
                                            </span>
                                        </h3>
                                        <p>SIDC: <span className="sidc-code">{symbol.sidc}</span></p>
                                        <p>{symbol.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="info-card">
                        <h2>Resources</h2>
                        <p>For more information about military symbology:</p>
                        <ul>
                            <li><a href="https://sidc.milsymb.net/#/APP6" target="_blank" rel="noopener noreferrer">SIDC Builder (APP-6) &mdash; interactive tool for generating SIDC codes</a></li>
                            <li><a href="https://www.spatialillusions.com/milsymbol/" target="_blank" rel="noopener noreferrer">milsymbol library documentation</a></li>
                            <li><a href="https://www.spatialillusions.com/milsymbol/documentation.html" target="_blank" rel="noopener noreferrer">Symbol identification codes (SIDC) reference</a></li>
                        </ul>
                    </div>
                </div>
            </div>

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