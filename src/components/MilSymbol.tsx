import { FC, useEffect, useMemo, useRef } from 'react';
import { Marker, Tooltip, Popup } from 'react-leaflet';
import { DivIcon, Marker as LeafletMarker } from 'leaflet';
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
    const markerRef = useRef<LeafletMarker | null>(null);
    const milSymbol = useMilSymbol(sidc, { size, ...options });

    const divIcon = useMemo(() => new DivIcon({
        html: milSymbol.asSVG(),
        className: '',
        iconSize: [milSymbol.getSize().width, milSymbol.getSize().height],
        iconAnchor: [milSymbol.getAnchor().x, milSymbol.getAnchor().y],
    }), [milSymbol]);

    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.setIcon(divIcon);
        }
    }, [divIcon]);

    return (
        <Marker
            position={position}
            icon={divIcon}
            ref={markerRef}
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
