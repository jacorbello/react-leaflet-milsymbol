import React, { useEffect, useMemo, useRef } from 'react';
import { Marker, Tooltip, Popup } from 'react-leaflet';
import { DivIcon, Marker as LeafletMarker } from 'leaflet';
import { MilSymbolProps } from '../types';
import { useMilSymbol } from '../hooks/useMilSymbol';

export const MilSymbol: React.FC<MilSymbolProps> = ({
    position,
    sidc,
    size = 35,
    options = {},
    tooltipContent,
    popupContent,
    eventHandlers,
}) => {
    const markerRef = useRef<LeafletMarker | null>(null);
    const milSymbol = useMilSymbol(sidc, { size, ...options });

    const divIcon = useMemo(() => new DivIcon({
        html: milSymbol.asDOM() as unknown as HTMLElement,
        className: '',
        iconSize: [milSymbol.getSize().width, milSymbol.getSize().height],
        iconAnchor: [milSymbol.getAnchor().x, milSymbol.getAnchor().y],
    }), [milSymbol]);

    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.setIcon(divIcon);
        }
    }, [divIcon, sidc, size, options]);

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
        </Marker>
    );
};