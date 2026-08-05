import { FC, useMemo } from 'react';
import { Marker, Tooltip, Popup } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import { MilSymbolProps } from '../types';
import { useMilSymbol } from '../hooks/useMilSymbol';

export const MilSymbol: FC<MilSymbolProps> = ({
    position,
    sidc,
    size,
    options = {},
    tooltipContent,
    popupContent,
    children,
    eventHandlers,
}) => {
    // The explicit `size` prop wins over `options.size`, but only when actually
    // supplied — a plain `{ ...options, size }` would let an undefined prop
    // clobber options.size. The 35 default lives in useMilSymbol.
    const milSymbol = useMilSymbol(sidc, { ...options, ...(size !== undefined && { size }) });

    // ponytail: react-leaflet's updateMarker already calls setIcon when the
    // icon prop identity changes; no manual ref/effect needed.
    const divIcon = useMemo(() => new DivIcon({
        html: milSymbol.asSVG(),
        className: '',
        iconSize: [milSymbol.getSize().width, milSymbol.getSize().height],
        iconAnchor: [milSymbol.getAnchor().x, milSymbol.getAnchor().y],
    }), [milSymbol]);

    return (
        <Marker
            position={position}
            icon={divIcon}
            eventHandlers={eventHandlers}
        >
            {tooltipContent && (
                <Tooltip>{tooltipContent}</Tooltip>
            )}
            {popupContent && (
                <Popup>{popupContent}</Popup>
            )}
            {children}
        </Marker>
    );
};
