import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MilSymbol } from '../components/MilSymbol';

vi.mock('react-leaflet', () => ({
  Marker: ({ children, position, icon, eventHandlers }: Record<string, unknown>) => (
    <div
      data-testid="marker"
      data-position={JSON.stringify(position)}
      data-has-icon={!!icon}
      data-event-handler-keys={JSON.stringify(Object.keys((eventHandlers as Record<string, unknown>) ?? {}))}
    >
      {children as React.ReactNode}
    </div>
  ),
  Tooltip: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip">{children}</div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popup">{children}</div>
  ),
}));

const divIconInstances: Record<string, unknown>[] = [];

vi.mock('leaflet', () => ({
  DivIcon: class MockDivIcon {
    html: unknown;
    iconSize: unknown;
    iconAnchor: unknown;
    constructor(opts?: Record<string, unknown>) {
      Object.assign(this, opts);
      divIconInstances.push(opts ?? {});
    }
  },
  Marker: class MockMarker {},
}));

describe('MilSymbol', () => {
  beforeEach(() => {
    divIconInstances.length = 0;
  });

  it('renders a Marker', () => {
    render(<MilSymbol position={[51.505, -0.09]} sidc="SFG-UCI----D" />);
    expect(screen.getByTestId('marker')).toBeInTheDocument();
  });

  it('passes correct position to Marker', () => {
    render(<MilSymbol position={[51.505, -0.09]} sidc="SFG-UCI----D" />);
    const marker = screen.getByTestId('marker');
    expect(marker.dataset.position).toBe(JSON.stringify([51.505, -0.09]));
  });

  it('renders Tooltip when tooltipContent is provided', () => {
    render(<MilSymbol position={[0, 0]} sidc="SFG-UCI----D" tooltipContent="Test tooltip" />);
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Test tooltip')).toBeInTheDocument();
  });

  it('renders Popup when popupContent is provided', () => {
    render(<MilSymbol position={[0, 0]} sidc="SFG-UCI----D" popupContent="Test popup" />);
    expect(screen.getByTestId('popup')).toBeInTheDocument();
    expect(screen.getByText('Test popup')).toBeInTheDocument();
  });

  it('does not render Tooltip when tooltipContent is not provided', () => {
    render(<MilSymbol position={[0, 0]} sidc="SFG-UCI----D" />);
    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
  });

  it('does not render Popup when popupContent is not provided', () => {
    render(<MilSymbol position={[0, 0]} sidc="SFG-UCI----D" />);
    expect(screen.queryByTestId('popup')).not.toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <MilSymbol position={[0, 0]} sidc="SFG-UCI----D">
        <div data-testid="custom-child">Custom content</div>
      </MilSymbol>
    );
    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });

  it('renders with custom size', () => {
    render(<MilSymbol position={[0, 0]} sidc="SFG-UCI----D" size={50} />);
    expect(screen.getByTestId('marker')).toBeInTheDocument();
  });

  it('renders with additional options', () => {
    render(
      <MilSymbol
        position={[0, 0]}
        sidc="SFG-UCI----D"
        options={{ fill: true, fillColor: '#ff0000' }}
      />
    );
    expect(screen.getByTestId('marker')).toBeInTheDocument();
  });

  it('forwards eventHandlers to Marker', () => {
    const clickHandler = vi.fn();
    render(
      <MilSymbol
        position={[0, 0]}
        sidc="SFG-UCI----D"
        eventHandlers={{ click: clickHandler }}
      />
    );
    const marker = screen.getByTestId('marker');
    const keys = JSON.parse(marker.dataset.eventHandlerKeys!);
    expect(keys).toContain('click');
  });

  it('creates DivIcon with SVG html', () => {
    render(<MilSymbol position={[0, 0]} sidc="SFG-UCI----D" />);
    expect(divIconInstances.length).toBeGreaterThan(0);
    const lastIcon = divIconInstances[divIconInstances.length - 1];
    expect(lastIcon.html).toBeDefined();
    expect(String(lastIcon.html)).toContain('<svg');
  });

  it('creates DivIcon with valid iconSize and iconAnchor', () => {
    render(<MilSymbol position={[0, 0]} sidc="SFG-UCI----D" />);
    const lastIcon = divIconInstances[divIconInstances.length - 1];
    const iconSize = lastIcon.iconSize as number[];
    const iconAnchor = lastIcon.iconAnchor as number[];
    expect(iconSize).toHaveLength(2);
    expect(iconAnchor).toHaveLength(2);
    expect(Number.isNaN(iconSize[0])).toBe(false);
    expect(Number.isNaN(iconSize[1])).toBe(false);
    expect(Number.isNaN(iconAnchor[0])).toBe(false);
    expect(Number.isNaN(iconAnchor[1])).toBe(false);
  });

  it('renders children alongside tooltipContent and popupContent', () => {
    render(
      <MilSymbol
        position={[0, 0]}
        sidc="SFG-UCI----D"
        tooltipContent="Tooltip text"
        popupContent="Popup text"
      >
        <div data-testid="custom-child">Child</div>
      </MilSymbol>
    );
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('popup')).toBeInTheDocument();
    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
  });

  it('renders ReactNode tooltipContent', () => {
    render(
      <MilSymbol position={[0, 0]} sidc="SFG-UCI----D" tooltipContent={<strong>Bold</strong>} />
    );
    expect(screen.getByText('Bold')).toBeInTheDocument();
    expect(screen.getByText('Bold').tagName).toBe('STRONG');
  });

  it('renders ReactNode popupContent', () => {
    render(
      <MilSymbol position={[0, 0]} sidc="SFG-UCI----D" popupContent={<em>Italic</em>} />
    );
    expect(screen.getByText('Italic')).toBeInTheDocument();
    expect(screen.getByText('Italic').tagName).toBe('EM');
  });

  it('renders with numeric SIDC', () => {
    render(<MilSymbol position={[0, 0]} sidc="10031000161200000000" />);
    expect(screen.getByTestId('marker')).toBeInTheDocument();
  });
});
