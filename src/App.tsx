import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { MilSymbol } from './components/MilSymbol';
import 'leaflet/dist/leaflet.css';
import './App.css';
import { SymbolOptions } from './types';


type SymbolDataProps = {
    name: string;
    sidc: string;
    position: [number, number];
    description: string;
    options: Partial<SymbolOptions>;
}

const symbolData: SymbolDataProps[] = [
    {
        name: "Infantry Unit",
        sidc: "SFGPEWRH--MT",
        position: [51.505, -0.09],
        description: "Standard infantry unit symbol",
        options: { size: 35 }
    },
    {
        name: "Armor Unit",
        sidc: "SFGPUCA---MT",
        position: [51.51, -0.1],
        description: "Armored combat vehicle unit",
        options: { size: 35, fill: true, fillOpacity: 0.7 }
    },
    {
        name: "Air Defense Unit",
        sidc: "SFGPUCD---MT",
        position: [51.5, -0.08],
        description: "Air defense unit with custom coloring",
        options: { size: 35, colorMode: "Dark", monoColor: "rgb(0, 100, 255)" }
    },
    {
        name: "Artillery Unit",
        sidc: "SFGPUCF---MT",
        position: [51.515, -0.12],
        description: "Field artillery unit",
        options: { size: 35, fillOpacity: 0.5 }
    }
];

const App: React.FC = () => {
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
                                    <p><span className="sidc-code">{symbol.sidc}</span></p>
                                    <p>{symbol.description}</p>
                                </div>
                            }
                        />
                    ))}
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
                                        <h3>{symbol.name}</h3>
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