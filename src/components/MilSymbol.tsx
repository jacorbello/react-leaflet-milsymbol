import { FC, useMemo } from 'react';
import { Marker, Tooltip, Popup } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import { MilSymbolProps } from '../types';
import { useMilSymbol } from '../hooks/useMilSymbol';

export const MilSymbol: FC<MilSymbolProps> = ({
    position,
    sidc,
    size = 35,
    options = {},
    tooltipContent,
    popupContent,
    children,
    eventHandlers,
}) => {
    const milSymbol = useMilSymbol(sidc, { size, ...options });

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
