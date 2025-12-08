
export enum NoteType {
    // Cosmic Structures
    Galaxy = 'Galaxy',
    Nebula = 'Nebula', // New group container
    BlackHole = 'BlackHole', // Absorbs other notes
    
    // Stars
    Sun = 'Sun',
    RedGiant = 'RedGiant',
    WhiteDwarf = 'WhiteDwarf',
    Pulsar = 'Pulsar',
    // Gas Giants
    Jupiter = 'Jupiter',
    Saturn = 'Saturn',
    // Ice Giants
    Neptune = 'Neptune',
    Uranus = 'Uranus',
    // Terrestrial Planets
    Earth = 'Earth',
    Venus = 'Venus',
    Mars = 'Mars',
    Mercury = 'Mercury',
    Planet = 'Planet', // Generic Planet
    // Dwarf Planets
    Pluto = 'Pluto',
    Ceres = 'Ceres',
    // Other
    Moon = 'Moon',
    Asteroid = 'Asteroid',
    Comet = 'Comet',
}

export type PlanetTheme = 'default' | 'calm' | 'energetic' | 'noir' | 'pastel';
export type LayoutType = 'grid' | 'circle' | 'spiral' | 'solar' | 'flowchart';

export interface Note {
    id: string;
    content: string;
    position: { x: number; y: number };
    type: NoteType;
    parentId: string | null;
    tags: string[];
    linkedNoteIds: string[];
    groupId: string | null;
    groupFilter?: string;
    theme?: PlanetTheme; // Pro Mode feature
}

export interface CanvasState {
    zoom: number;
    pan: { x: number; y: number };
}

export interface Settings {
    theme: 'cosmic' | 'light' | 'dark';
    font: 'inter' | 'serif' | 'mono';
    fontColor: string;
    fontSize: number; // Font size scale factor (0.5 to 2.0)
    showConnections: boolean;
    showMinimap: boolean;
    
    // Mode Toggles
    proMode: boolean;   // Enables Themes, Smart Search, Magnetic Align, Auto-Arrange
    ultraMode: boolean; // Enables Focus Mode, Invoice Universe, Quest Mode
}
