# react-leaflet-milsymbol

![NPM Version](https://img.shields.io/npm/v/react-leaflet-milsymbol?label=react-leaflet-milsymbol&link=https%3A%2F%2Fnpmjs.com%2Fpackage%2Freact-leaflet-milsymbol)

A React Leaflet v4 integration for the milsymbol library, allowing you to easily add military symbols to your React Leaflet maps.

## Installation

```bash
npm install react-leaflet-milsymbol
# or
yarn add react-leaflet-milsymbol
# or
pnpm add react-leaflet-milsymbol
```

### Dependencies

This package requires the following peer dependencies:

- `react` (v18.0.0 or v19.0.0)
- `react-dom` (v18.0.0 or v19.0.0)
- `leaflet` (v1.9.0 or higher)
- `react-leaflet` (v4.0.0 or higher)
- `milsymbol` (v3.0.0 or higher)

Make sure to install these dependencies in your project if you haven't already.

## Usage

### Basic Example

```jsx
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { MilSymbol } from 'react-leaflet-milsymbol';

function MyMap() {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Add a military symbol to the map */}
      <MilSymbol
        position={[51.505, -0.09]}
        sidc="SFGPEWRH--MT" // Symbol Identification Code
        size={30}
        options={{
          size: 35,
          fill: true,
          fillOpacity: 0.5,
          strokeWidth: 2,
        }}
      />
    </MapContainer>
  );
}

export default MyMap;
```

### Props

The `MilSymbol` component accepts the following props:

| Prop             | Type                    | Description                                              |
| ---------------- | ----------------------- | -------------------------------------------------------- |
| `position`       | `[number, number]`      | Latitude and longitude where the symbol should be placed |
| `sidc`           | `string`                | Symbol Identification Code (SIDC)                        |
| `size`           | `number`                | Size of the symbol (optional)                            |
| `options`        | `object`                | Additional options to customize the symbol (see below)   |
| `tooltipContent` | `string` or `ReactNode` | Optional content for tooltip                             |
| `popupContent`   | `string` or `ReactNode` | Optional content for popup                               |
| `eventHandlers`  | `object`                | Event handlers for the symbol                            |

#### Options Object

The options object can include any properties available in the milsymbol library, such as:

```javascript
{
  size: 35,              // Size of the symbol
  fill: true,            // Fill the symbol with color
  fillOpacity: 0.5,      // Opacity of the fill
  strokeWidth: 2,        // Width of the outline stroke
  outlineColor: "rgb(0, 0, 0)",  // Color of the outline
  outlineWidth: 3,       // Width of the symbol outline
  icon: true,            // Show the icon
  monoColor: false,      // Use monochrome color
  civilianColor: false,  // Use civilian colors for the symbol
  colorMode: "Light",    // "Light", "Medium", "Dark"
  infoColor: "rgb(70, 70, 70)",  // Color for information fields
  infoSize: 10,          // Size of information fields
  alternateMedal: false, // Use alternate medal
}
```

### Advanced Usage

#### Custom Symbol Styling

```jsx
<MilSymbol
  position={[51.505, -0.09]}
  sidc="SFGPEWRH--MT"
  options={{
    size: 40,
    fill: true,
    fillOpacity: 0.7,
    colorMode: "Dark",
    monoColor: "rgb(255, 0, 0)",
    infoFields: false,
  }}
/>
```

#### With Popup and Tooltip

```jsx
<MilSymbol
  position={[51.505, -0.09]}
  sidc="SFGPEWRH--MT"
  tooltipContent="Infantry Unit"
  popupContent={
    <div>
      <h3>Infantry Unit</h3>
      <p>Unit ID: 12345</p>
      <p>Status: Active</p>
    </div>
  }
/>
```

#### With Event Handlers

```jsx
<MilSymbol
  position={[51.505, -0.09]}
  sidc="SFGPEWRH--MT"
  eventHandlers={{
    click: () => {
      console.log('Symbol clicked!');
    },
    mouseover: () => {
      console.log('Mouse over symbol');
    },
  }}
/>
```

## API Reference

### Components

#### `<MilSymbol />`

The main component for adding military symbols to your React Leaflet map.

### Hooks

#### `useMilSymbol(sidc, options)`

A hook for creating milsymbol instances outside of the component.

```jsx
import { useMilSymbol } from 'react-leaflet-milsymbol';

function SymbolPreview() {
  const symbol = useMilSymbol("SFGPEWRH--MT", { size: 30 });
  
  return (
    <div>
      <h3>Symbol Preview</h3>
      <div dangerouslySetInnerHTML={{ __html: symbol.toSVG() }} />
    </div>
  );
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [milsymbol](https://www.spatialillusions.com/milsymbol/) - The core library for generating military symbols
- [react-leaflet](https://react-leaflet.js.org/) - React components for Leaflet maps