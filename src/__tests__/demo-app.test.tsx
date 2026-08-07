import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, fireEvent, within } from '@testing-library/react';
import App from '../App';

const flushDebounce = async () => {
    await act(async () => {
        await new Promise((r) => setTimeout(r, 350));
    });
};

describe('demo app', () => {
    beforeEach(() => {
        window.location.hash = '';
        vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    it('renders all three tabs without crashing', async () => {
        render(<App />);
        expect(screen.getByRole('heading', { name: /1\. Install/ })).toBeInTheDocument();

        await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Playground' })); });
        expect(screen.getByLabelText('Symbol identification code')).toBeInTheDocument();

        await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Map demo' })); });
        expect(screen.getByRole('heading', { name: /Symbols on this map/ })).toBeInTheDocument();
    });

    it('shows field-level diagnostics for a bad SIDC and recovers for a good one', async () => {
        render(<App />);
        await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Playground' })); });

        const input = screen.getByLabelText('Symbol identification code');
        await act(async () => { fireEvent.change(input, { target: { value: 'NOTASIDC' } }); });
        await flushDebounce();

        expect(screen.getByText('invalid')).toBeInTheDocument();
        const iconRow = screen.getByRole('row', { name: /^icon/ });
        expect(within(iconRow).getByText('false')).toBeInTheDocument();

        await act(async () => { fireEvent.change(input, { target: { value: 'SFGPUCI----D' } }); });
        await flushDebounce();

        expect(screen.getByText('valid')).toBeInTheDocument();
        expect(within(screen.getByRole('row', { name: /^icon/ })).getByText('true')).toBeInTheDocument();
    });

    // The map's <MilSymbol> deliberately carries no `key`, so it must update the existing
    // Leaflet marker rather than being remounted. This asserts the icon really does change
    // without one — remove the assertion and a silent "marker never updates" regression
    // would look identical to a pass.
    it('updates the map marker in place when the SIDC changes', async () => {
        render(<App />);
        await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Playground' })); });
        await flushDebounce();

        const markerSvg = () =>
            document.querySelector('.leaflet-marker-icon svg')?.outerHTML;
        const before = markerSvg();
        expect(before).toBeTruthy();

        const input = screen.getByLabelText('Symbol identification code');
        await act(async () => { fireEvent.change(input, { target: { value: 'SHGPUCI----D' } }); });
        await flushDebounce();

        expect(markerSvg()).not.toBe(before);
    });

    it('affiliation button rewrites the code in place', async () => {
        render(<App />);
        await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Playground' })); });

        const input = screen.getByLabelText('Symbol identification code') as HTMLInputElement;
        expect(input.value).toBe('SFGPUCI----D');

        await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Hostile' })); });
        expect(input.value).toBe('SHGPUCI----D');
    });

    it('a preset loads into the editor', async () => {
        render(<App />);
        await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Playground' })); });

        await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Submarine' })); });
        const input = screen.getByLabelText('Symbol identification code') as HTMLInputElement;
        expect(input.value).toBe('SFUPSCA----');
    });

    it('generated snippet reflects the current SIDC and options', async () => {
        render(<App />);
        await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Playground' })); });
        await flushDebounce();

        expect(screen.getByText(/sidc="SFGPUCI----D"/)).toBeInTheDocument();
    });

    it('restores state from a shared URL', async () => {
        window.location.hash = '#playground&sidc=SHGPUCI----D';
        render(<App />);

        const input = screen.getByLabelText('Symbol identification code') as HTMLInputElement;
        expect(input.value).toBe('SHGPUCI----D');
    });

    it('Try button on getting-started jumps to the playground preloaded', async () => {
        render(<App />);
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Try NOTASIDC/ }));
        });
        await flushDebounce();

        const input = screen.getByLabelText('Symbol identification code') as HTMLInputElement;
        expect(input.value).toBe('NOTASIDC');
        expect(screen.getByText('invalid')).toBeInTheDocument();
    });
});
