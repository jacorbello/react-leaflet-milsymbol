import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MapContainer } from 'react-leaflet';
import { MilSymbol } from '../components/MilSymbol';

// ponytail: proves the real react-leaflet update path re-renders the icon,
// so MilSymbol's own setIcon useEffect is redundant.
const sidcOf = () => screen.getByTestId('map').querySelector('.leaflet-marker-icon svg')?.outerHTML;

describe('icon updates through real react-leaflet', () => {
    it('swaps the rendered symbol when sidc changes', () => {
        const { rerender } = render(
            <div data-testid="map">
                <MapContainer center={[0, 0]} zoom={3} style={{ height: 400 }}>
                    <MilSymbol position={[0, 0]} sidc="SFG-UCI----D" />
                </MapContainer>
            </div>
        );
        const before = sidcOf();
        expect(before).toBeTruthy();

        rerender(
            <div data-testid="map">
                <MapContainer center={[0, 0]} zoom={3} style={{ height: 400 }}>
                    <MilSymbol position={[0, 0]} sidc="SHG-UCI----D" />
                </MapContainer>
            </div>
        );
        expect(sidcOf()).not.toBe(before);
    });
});
