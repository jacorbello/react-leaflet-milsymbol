import { ReactNode } from 'react';
import { LeafletEventHandlerFnMap } from 'leaflet';

/**
 * Color mode options for milsymbol
 */
export type ColorMode = {
    Civilian: string;
    Friend: string;
    Hostile: string;
    Neutral: string;
    Unknown: string;
    Suspect: string;
};

/**
 * Direct copy of the SymbolOptions type from milsymbol
 */
export type SymbolOptions = {
    additionalInformation?: string;
    alternateMedal?: boolean;
    altitudeDepth?: string;
    auxiliaryEquipmentIndicator?: string;
    civilianColor?: boolean;
    colorMode?: ColorMode | string;
    combatEffectiveness?: string;
    commonIdentifier?: string;
    country?: string;
    direction?: string;
    dtg?: string;
    engagementBar?: string;
    engagementType?: string;
    equipmentTeardownTime?: string;
    evaluationRating?: string;
    fill?: boolean;
    fillColor?: string;
    fillOpacity?: number;
    fontfamily?: string;
    frame?: boolean;
    frameColor?: ColorMode;
    guardedUnit?: string;
    headquartersElement?: string;
    higherFormation?: string;
    hostile?: string;
    hqStaffLength?: number;
    icon?: boolean;
    iconColor?: ColorMode | string;
    iffSif?: string;
    infoBackground?: ColorMode | string;
    infoBackgroundFrame?: ColorMode | string;
    infoColor?: ColorMode | string;
    infoFields?: boolean;
    infoOutlineColor?: string;
    infoOutlineWidth?: number;
    infoSize?: number;
    installationComposition?: string;
    location?: string;
    monoColor?: string;
    outlineColor?: ColorMode | string;
    outlineWidth?: number;
    padding?: number;
    platformType?: string;
    quantity?: string;
    reinforcedReduced?: string;
    sidc?: string;
    sigint?: string;
    signatureEquipment?: string;
    simpleStatusModifier?: boolean;
    size?: number;
    specialDesignator?: string;
    specialHeadquarters?: string;
    speed?: string;
    speedLeader?: number;
    square?: boolean;
    staffComments?: string;
    standard?: string;
    strokeWidth?: number;
    type?: string;
    uniqueDesignation?: string;
};

/**
 * Props for the MilSymbol component
 */
export interface MilSymbolProps {
    /** Latitude and longitude position for the symbol */
    position: [number, number];

    /** Symbol Identification Code */
    sidc: string;

    /** Size of the symbol (optional) */
    size?: number;

    /** Additional options to customize the symbol */
    options?: SymbolOptions;

    /** Optional content for tooltip */
    tooltipContent?: string | ReactNode;

    /** Optional content for popup */
    popupContent?: string | ReactNode;

    /** Event handlers for the symbol */
    eventHandlers?: LeafletEventHandlerFnMap;
}