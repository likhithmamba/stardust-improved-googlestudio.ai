
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../hooks/useStore';
import { Note, NoteType, Settings, LayoutType } from '../types';
import { NOTE_STYLES } from '../constants';
import Fuse from 'fuse.js';
import { Map, Frame, HelpCircle, Sun, Moon, Sparkles, Search as SearchIcon, X, Link as LinkIcon, GitBranch, Brush, Plus, Download, Upload, Zap, Type, Crown, Crosshair, LayoutGrid, Circle, Wind, GitMerge, Network, Magnet, Target, FileText } from 'lucide-react';

// Custom Logo Component based on "Stardust - Ideas That Stick"
const StardustLogo: React.FC<{className?: string, size?: number}> = ({ className, size = 64 }) => (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="s-gradient" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#312e81" />
                <stop offset="0.4" stopColor="#7c3aed" />
                <stop offset="1" stopColor="#c026d3" />
            </linearGradient>
            <linearGradient id="ring-gradient" x1="0" y1="100" x2="200" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#fcd34d" stopOpacity="0" />
                <stop offset="0.5" stopColor="#fcd34d" />
                <stop offset="1" stopColor="#fcd34d" stopOpacity="0" />
            </linearGradient>
            <filter id="glow-s" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        
        {/* Background Glow */}
        <circle cx="100" cy="100" r="65" fill="url(#s-gradient)" fillOpacity="0.15" filter="url(#glow-s)" />

        {/* The "S" Shape */}
        <path d="M130 55C115 40 95 35 75 45C50 55 45 85 65 105C85 125 135 130 135 160C135 185 105 195 80 190C55 185 35 165 30 145" 
              stroke="url(#s-gradient)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Document Icon nestled in the S curve */}
        <g transform="translate(65, 115) rotate(-10)">
            <rect x="0" y="0" width="36" height="46" rx="4" fill="#0f172a" stroke="#e879f9" strokeWidth="2" />
            <line x1="8" y1="12" x2="28" y2="12" stroke="#e879f9" strokeWidth="2" strokeOpacity="0.7" />
            <line x1="8" y1="20" x2="28" y2="20" stroke="#e879f9" strokeWidth="2" strokeOpacity="0.7" />
            <line x1="8" y1="28" x2="20" y2="28" stroke="#e879f9" strokeWidth="2" strokeOpacity="0.7" />
        </g>

        {/* The Ring (Orbit) */}
        <path d="M30 90C30 90 60 120 170 70" stroke="url(#ring-gradient)" strokeWidth="4" strokeLinecap="round" />
        <path d="M170 70C170 70 140 40 30 90" stroke="url(#ring-gradient)" strokeWidth="2" strokeOpacity="0.3" strokeDasharray="4 4" />

        {/* Sparkles */}
        <path d="M160 50L163 58L171 61L163 64L160 72L157 64L149 61L157 58L160 50Z" fill="white" />
        <path d="M40 160L42 165L47 167L42 169L40 174L38 169L33 167L38 165L40 160Z" fill="white" />
        <circle cx="170" cy="140" r="2" fill="white" fillOpacity="0.8" />
        <circle cx="30" cy="50" r="2" fill="white" fillOpacity="0.8" />
    </svg>
);

// About Modal Component
const AboutModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="w-full max-w-lg bg-gray-100/80 dark:bg-cosmic-bg-dark/80 backdrop-blur-xl border border-glass-edge rounded-lg shadow-2xl overflow-hidden text-black dark:text-white"
                        initial={{ scale: 0.9, y: -20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-8 relative">
                            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                            <div className="flex flex-col items-center justify-center text-center space-y-4 mb-6">
                                <StardustLogo size={100} className="drop-shadow-lg" />
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight">STARDUST</h2>
                                    <p className="text-sm font-medium text-purple-500 dark:text-purple-400 uppercase tracking-widest mt-1">Ideas That Stick.</p>
                                </div>
                            </div>
                            
                            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 border border-gray-200 dark:border-white/5 text-center">
                                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                    An infinite canvas note-taking application designed for visual thinkers. 
                                    Map your universe of thoughts with AI-powered tools and cosmic templates.
                                </p>
                            </div>

                            <div className="mt-6">
                                <h3 className="font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 text-center">Core Technologies</h3>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm px-4">
                                    <div className="flex items-center space-x-2"><GitBranch size={16} className="text-sky-400" /><span>React 18</span></div>
                                    <div className="flex items-center space-x-2"><Zap size={16} className="text-amber-400" /><span>Zustand State</span></div>
                                    <div className="flex items-center space-x-2"><Brush size={16} className="text-rose-400" /><span>Framer Motion</span></div>
                                    <div className="flex items-center space-x-2"><LayoutGrid size={16} className="text-indigo-400" /><span>Tailwind CSS</span></div>
                                </div>
                            </div>
                             <div className="mt-8 pt-4 border-t border-gray-200 dark:border-white/10 text-center">
                                <p className="text-xs text-gray-400">Version 3.1.0 — Universal Edition</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Settings Modal
const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const settings = useStore(state => state.settings);
    const setSettings = useStore(state => state.setSettings);

    const themes: { name: Settings['theme']; icon: React.ReactNode }[] = [
        { name: 'light', icon: <Sun /> },
        { name: 'dark', icon: <Moon /> },
        { name: 'cosmic', icon: <Sparkles /> },
    ];
    
    const fonts: { name: Settings['font']; className: string }[] = [
        { name: 'inter', className: 'font-inter' },
        { name: 'serif', className: 'font-serif' },
        { name: 'mono', className: 'font-mono' },
    ];

    const fontSizes = [
        { label: 'S', value: 0.8 },
        { label: 'M', value: 1.0 },
        { label: 'L', value: 1.25 },
        { label: 'XL', value: 1.5 },
    ];

    const fontColors = [
        { name: 'Starlight White', hex: '#FFFFFF' },
        { name: 'Nebula Pink', hex: '#f5d0fe' },
        { name: 'Supernova Gold', hex: '#fcd34d' },
        { name: 'Andromeda Blue', hex: '#93c5fd' },
        { name: 'Galactic Green', hex: '#86efac' },
        { name: 'Solar Flare Orange', hex: '#fb923c' },
        { name: 'Cosmic Gray', hex: '#9ca3af' },
        { name: 'Void Black', hex: '#111827' },
    ];

    const specialFontColors = [
        { name: 'Cosmic Gradient', value: 'font-effect-cosmic', style: { background: 'linear-gradient(90deg, #93c5fd, #c084fc, #f472b6, #fb923c)'} },
        { name: 'Gold Glitter', value: 'font-effect-glitter-gold', style: { background: 'linear-gradient(90deg, #fcd34d, #fef08a, #fde047, #fcd34d)'} },
        { name: 'Nebula Shimmer', value: 'font-effect-shimmer-nebula', style: { background: 'linear-gradient(110deg, #f472b6, #c084fc, #93c5fd, #86efac)'} },
        { name: 'Oceanic Wave', value: 'font-effect-ocean-wave', style: { background: 'linear-gradient(90deg, #00C9FF, #92FE9D)' } },
    ];

    const toggleMode = (mode: 'core' | 'pro' | 'ultra') => {
        setSettings({ mode });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="w-full max-w-md bg-gray-100/80 dark:bg-cosmic-bg-dark/80 backdrop-blur-xl border border-glass-edge rounded-lg shadow-2xl text-black dark:text-white max-h-[90vh] overflow-y-auto"
                        initial={{ scale: 0.9, y: -20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 relative">
                            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white transition-colors"><X size={24} /></button>
                            <h2 className="text-2xl font-bold mb-6">Settings</h2>

                            <div className="mb-6 p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                                <h3 className="font-semibold text-md mb-3 text-indigo-400 flex items-center"><Crown size={16} className="mr-2"/> Experience Level</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors cursor-pointer" onClick={() => toggleMode('core')}>
                                        <div>
                                            <span className={`text-sm font-medium ${settings.mode === 'core' ? 'text-sky-400' : ''}`}>Core Mode</span>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Pure canvas, simple tools.</p>
                                        </div>
                                        <div className={`w-4 h-4 rounded-full border border-gray-400 ${settings.mode === 'core' ? 'bg-sky-400 border-sky-400' : ''}`} />
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors cursor-pointer" onClick={() => toggleMode('pro')}>
                                        <div>
                                            <span className={`text-sm font-medium ${settings.mode === 'pro' ? 'text-amber-400' : ''}`}>Pro Mode</span>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Templates, Themes, Alignment.</p>
                                        </div>
                                        <div className={`w-4 h-4 rounded-full border border-gray-400 ${settings.mode === 'pro' ? 'bg-amber-400 border-amber-400' : ''}`} />
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors cursor-pointer" onClick={() => toggleMode('ultra')}>
                                        <div>
                                            <span className={`text-sm font-medium ${settings.mode === 'ultra' ? 'text-purple-400' : ''}`}>Ultra Mode</span>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Auto-Map, Focus, Workflows.</p>
                                        </div>
                                        <div className={`w-4 h-4 rounded-full border border-gray-400 ${settings.mode === 'ultra' ? 'bg-purple-400 border-purple-400' : ''}`} />
                                    </div>
                                </div>
                            </div>

                            {/* Pro Features Sub-menu */}
                            {settings.mode !== 'core' && (
                                <div className="mb-6 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                                    <h3 className="font-semibold text-md mb-3 text-amber-400">Pro Features</h3>
                                    <div className="space-y-2">
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <span className="text-sm flex items-center"><Magnet size={14} className="mr-2"/> Magnetic Alignment</span>
                                            <input type="checkbox" checked={settings.pro.magneticAlignment} onChange={(e) => setSettings(s => ({ pro: { ...s.pro, magneticAlignment: e.target.checked } }))} className="accent-amber-400" />
                                        </label>
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <span className="text-sm flex items-center"><Target size={14} className="mr-2"/> Smart Zoom</span>
                                            <input type="checkbox" checked={settings.pro.smartZoom} onChange={(e) => setSettings(s => ({ pro: { ...s.pro, smartZoom: e.target.checked } }))} className="accent-amber-400" />
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Ultra Features Sub-menu */}
                            {settings.mode === 'ultra' && (
                                <div className="mb-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                    <h3 className="font-semibold text-md mb-3 text-purple-400">Ultra Features</h3>
                                    <div className="space-y-2">
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <span className="text-sm flex items-center"><Network size={14} className="mr-2"/> Hierarchy Lines</span>
                                            <input type="checkbox" checked={settings.ultra.hierarchyLines} onChange={(e) => setSettings(s => ({ ultra: { ...s.ultra, hierarchyLines: e.target.checked } }))} className="accent-purple-400" />
                                        </label>
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <span className="text-sm flex items-center"><FileText size={14} className="mr-2"/> Invoice Universe</span>
                                            <input type="checkbox" checked={settings.ultra.invoiceUniverse} onChange={(e) => setSettings(s => ({ ultra: { ...s.ultra, invoiceUniverse: e.target.checked } }))} className="accent-purple-400" />
                                        </label>
                                    </div>
                                </div>
                            )}
                            
                            <div className="mb-6">
                                <h3 className="font-semibold text-md mb-3 text-gray-700 dark:text-gray-300">Theme</h3>
                                <div className="flex space-x-2 rounded-lg bg-gray-200 dark:bg-gray-900/50 p-1">
                                    {themes.map(theme => (
                                        <button key={theme.name} onClick={() => setSettings({ theme: theme.name })} className={`w-full flex justify-center items-center space-x-2 p-2 rounded-md text-sm transition-colors ${settings.theme === theme.name ? 'bg-white dark:bg-black/50 shadow' : 'hover:bg-gray-300/50 dark:hover:bg-white/10'}`}>
                                            {theme.icon}
                                            <span className="capitalize">{theme.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold text-md mb-3 text-gray-700 dark:text-gray-300">Font Style</h3>
                                <div className="flex space-x-2 rounded-lg bg-gray-200 dark:bg-gray-900/50 p-1">
                                    {fonts.map(font => (
                                        <button key={font.name} onClick={() => setSettings({ font: font.name })} className={`w-full p-2 rounded-md text-sm transition-colors ${settings.font === font.name ? 'bg-white dark:bg-black/50 shadow' : 'hover:bg-gray-300/50 dark:hover:bg-white/10'}`}>
                                            <span className={font.className}>Aa</span>
                                            <span className="capitalize ml-2">{font.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <h3 className="font-semibold text-md mb-3 text-gray-700 dark:text-gray-300">Font Size</h3>
                                <div className="flex space-x-2 rounded-lg bg-gray-200 dark:bg-gray-900/50 p-1">
                                    {fontSizes.map(size => (
                                        <button key={size.label} onClick={() => setSettings({ fontSize: size.value })} className={`w-full p-2 rounded-md text-sm transition-colors ${settings.fontSize === size.value ? 'bg-white dark:bg-black/50 shadow font-bold' : 'hover:bg-gray-300/50 dark:hover:bg-white/10'}`}>
                                            <span className="flex items-center justify-center gap-1"><Type size={12 + (size.value * 2)} /> {size.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold text-md mb-3 text-gray-700 dark:text-gray-300">Font Color</h3>
                                <div className="grid grid-cols-4 gap-2">
                                    {fontColors.map(color => (
                                        <button key={color.hex} onClick={() => setSettings({ fontColor: color.hex })} title={color.name} className="relative rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-sky-400">
                                            <div style={{ backgroundColor: color.hex }} className="w-full h-10"></div>
                                            {settings.fontColor === color.hex && (
                                                <div className="absolute inset-0 bg-sky-400/30 border-2 border-sky-400 rounded-md"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-md mb-3 text-gray-700 dark:text-gray-300">Special Effects</h3>
                                <div className="grid grid-cols-4 gap-2">
                                    {specialFontColors.map(color => (
                                        <button key={color.value} onClick={() => setSettings({ fontColor: color.value })} title={color.name} className="relative rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-sky-400">
                                            <div style={color.style} className="w-full h-10"></div>
                                            {settings.fontColor === color.value && (
                                                <div className="absolute inset-0 bg-sky-400/30 border-2 border-sky-400 rounded-md"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Minimap Component
export const Minimap: React.FC = () => {
    const notes = useStore(state => state.notes);
    const canvasState = useStore(state => state.canvasState);
    const setCanvasState = useStore(state => state.setCanvasState);
    
    // Explicitly cast Object.values(notes) to Note[] to avoid type inference errors ('unknown')
    const noteList = useMemo(() => Object.values(notes) as Note[], [notes]);

    if (noteList.length === 0) return null;

    // Calculate world bounds
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    noteList.forEach(note => {
        const size = NOTE_STYLES[note.type].size.diameter;
        minX = Math.min(minX, note.position.x);
        minY = Math.min(minY, note.position.y);
        maxX = Math.max(maxX, note.position.x + size);
        maxY = Math.max(maxY, note.position.y + size);
    });

    // Add ample padding to bounds
    const padding = 2500;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    const worldWidth = maxX - minX;
    const worldHeight = maxY - minY;

    // Minimap dimensions
    const mapWidth = 240;
    const mapHeight = 160;

    // Scale factor to fit world into minimap
    const scaleX = mapWidth / worldWidth;
    const scaleY = mapHeight / worldHeight;
    const scale = Math.min(scaleX, scaleY);

    // Viewport rectangle calculations
    // canvasState.pan is the offset applied to the world.
    // viewport left in world coords = -pan.x / zoom
    const viewWorldX = -canvasState.pan.x / canvasState.canvasState?.zoom || -canvasState.pan.x / canvasState.zoom;
    const viewWorldY = -canvasState.pan.y / canvasState.canvasState?.zoom || -canvasState.pan.y / canvasState.zoom;
    const viewWorldW = window.innerWidth / (canvasState.zoom || 1);
    const viewWorldH = window.innerHeight / (canvasState.zoom || 1);

    const viewX = (viewWorldX - minX) * scale;
    const viewY = (viewWorldY - minY) * scale;
    const viewW = viewWorldW * scale;
    const viewH = viewWorldH * scale;

    const handleMapClick = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Convert map click to world coordinates
        const worldClickX = clickX / scale + minX;
        const worldClickY = clickY / scale + minY;

        // Center camera on that point
        // New Pan = -worldCoord * zoom + screenCenter
        const zoom = canvasState.zoom || 1;
        const newPanX = -worldClickX * zoom + window.innerWidth / 2;
        const newPanY = -worldClickY * zoom + window.innerHeight / 2;

        setCanvasState({ pan: { x: newPanX, y: newPanY } });
    };

    return (
        <motion.div 
            className="fixed bottom-4 right-4 z-30 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden shadow-xl hidden md:block cursor-crosshair"
            style={{ width: mapWidth, height: mapHeight }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleMapClick}
        >
            {/* Render Notes as dots */}
            {noteList.map(note => {
                const size = NOTE_STYLES[note.type].size.diameter;
                const dotSize = Math.max(2, size * scale);
                const isStar = [NoteType.Sun, NoteType.RedGiant, NoteType.WhiteDwarf, NoteType.Pulsar].includes(note.type);
                
                return (
                    <div
                        key={note.id}
                        className={`absolute rounded-full ${isStar ? 'bg-yellow-400' : 'bg-white/50'}`}
                        style={{
                            left: (note.position.x - minX) * scale,
                            top: (note.position.y - minY) * scale,
                            width: dotSize,
                            height: dotSize,
                        }}
                    />
                );
            })}

            {/* Viewport Indicator */}
            <div
                className="absolute border-2 border-sky-400/50 bg-sky-400/10 pointer-events-none transition-all duration-75"
                style={{
                    left: viewX,
                    top: viewY,
                    width: Math.max(1, viewW),
                    height: Math.max(1, viewH),
                }}
            />
        </motion.div>
    );
};

// Search Component
export const Search: React.FC = () => {
    const notes = useStore(state => state.notes);
    const isSearchOpen = useStore(state => state.isSearchOpen);
    const setSearchOpen = useStore(state => state.setSearchOpen);
    const setCanvasState = useStore(state => state.setCanvasState);
    const setFocusedNoteId = useStore(state => state.setFocusedNoteId);
    const searchBranchRootId = useStore(state => state.searchBranchRootId);

    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus input when opened
    useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isSearchOpen]);

    const fuse = useMemo(() => {
        // Explicit cast to fix type error
        const list = Object.values(notes) as Note[];
        // If a branch search is active, filter only notes in that hierarchy
        let searchList = list;
        if (searchBranchRootId) {
            // Simple branch logic: just the node and its immediate children for now, 
            // or perform a traversal if needed. For performance, we'll keep it simple or assume full list
            // If strict branch search is required, we'd traverse down from rootId.
            // For now, let's search everything to be more useful, but prioritize?
            // Or strictly filter:
            const branchIds = new Set<string>();
            const queue = [searchBranchRootId];
            while(queue.length > 0) {
                const curr = queue.shift()!;
                branchIds.add(curr);
                list.forEach(n => {
                    if (n.parentId === curr) queue.push(n.id);
                });
            }
            searchList = list.filter(n => branchIds.has(n.id));
        }

        return new Fuse(searchList, {
            keys: ['content', 'tags', 'type'],
            threshold: 0.4,
            includeScore: true
        });
    }, [notes, searchBranchRootId]);

    const results = useMemo(() => {
        if (!query) return [];
        return fuse.search(query).map(r => r.item).slice(0, 10);
    }, [query, fuse]);

    const handleSelect = (noteId: string) => {
        const note = notes[noteId];
        if (note) {
            const zoom = 1.5;
            const size = NOTE_STYLES[note.type].size.diameter;
            const newPanX = -note.position.x * zoom + window.innerWidth / 2 - (size * zoom / 2);
            const newPanY = -note.position.y * zoom + window.innerHeight / 2 - (size * zoom / 2);
            
            setCanvasState({ zoom, pan: { x: newPanX, y: newPanY } });
            setFocusedNoteId(noteId);
            setSearchOpen(false);
            setQuery("");
        }
    };

    if (!isSearchOpen) return null;

    return (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4">
             <motion.div 
                className="bg-white/10 dark:bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
             >
                <div className="flex items-center px-4 py-3 border-b border-white/10">
                    <SearchIcon className="text-gray-400 mr-2" size={20} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={searchBranchRootId ? "Search in branch..." : "Search universe..."}
                        className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500 font-medium"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Escape') setSearchOpen(false); }}
                    />
                    <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={18} /></button>
                </div>
                
                {results.length > 0 && (
                    <div className="max-h-80 overflow-y-auto py-2">
                        {results.map(note => (
                            <button
                                key={note.id}
                                className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center justify-between group border-l-2 border-transparent hover:border-sky-400"
                                onClick={() => handleSelect(note.id)}
                            >
                                <div className="truncate text-sm text-gray-200 flex flex-col">
                                    <span className="font-bold text-sky-400 text-xs uppercase tracking-wider mb-0.5">{note.type}</span>
                                    <span className="opacity-90" dangerouslySetInnerHTML={{ __html: note.content.replace(/<[^>]*>?/gm, '').substring(0, 50) || 'Untitled Note' }} />
                                </div>
                                <span className="opacity-0 group-hover:opacity-100 text-xs text-sky-400 font-mono">WARP &rarr;</span>
                            </button>
                        ))}
                    </div>
                )}
                
                {query && results.length === 0 && (
                    <div className="px-4 py-8 text-center text-gray-500 text-sm">
                        <Sparkles className="mx-auto mb-2 opacity-20" size={32} />
                        No celestial bodies found matching "{query}".
                    </div>
                )}

                {!query && (
                    <div className="px-4 py-3 text-xs text-gray-600 text-center">
                        Type to explore the cosmos.
                    </div>
                )}
             </motion.div>
        </div>
    );
};

// Toolbar Component
export const Toolbar: React.FC = () => {
  const settings = useStore(state => state.settings);
  const setSettings = useStore(state => state.setSettings);
  const addNote = useStore(state => state.addNote);
  const resetCanvas = useStore(state => state.resetCanvas);
  const selectedNoteIds = useStore(state => state.selectedNoteIds);
  const layoutSelectedNotes = useStore(state => state.layoutSelectedNotes);
  const toggleAutoMap = useStore(state => state.toggleAutoMap);
  const isAutoMapActive = useStore(state => state.isAutoMapActive);

  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isArrangeOpen, setIsArrangeOpen] = useState(false);
  
  const handleExport = () => {
      const { notes, canvasState, settings } = useStore.getState();
      const exportData = {
          notes,
          canvasState,
          settings,
      };
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportData, null, 2))}`;
      const link = document.createElement('a');
      link.href = jsonString;
      link.download = `stardust-canvas-backup-${new Date().toISOString()}.json`;
      link.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const imported = JSON.parse(e.target?.result as string);
              if (imported.notes && imported.canvasState) {
                  useStore.setState(state => ({ ...state, ...imported }));
              } else {
                  alert('Invalid backup file format.');
              }
          } catch (error)
 {
              alert('Error parsing file.');
              console.error(error);
          }
      };
      reader.readAsText(file);
  };

  const IconButton: React.FC<{onClick?: any, title: string, children: React.ReactNode, as?: 'label', active?: boolean}> = ({onClick, title, children, as, active}) => {
      const Component = as || 'button';
      return (
          <Component onClick={onClick} className={`p-2.5 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-colors ${active ? 'bg-white/20 dark:bg-white/10 text-sky-400' : ''}`} title={title}>
            {children}
          </Component>
      )
  };
  
  const handleArrange = (layout: LayoutType) => {
      layoutSelectedNotes(layout);
      setIsArrangeOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          className="flex items-center space-x-1 bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-full shadow-lg border border-glass-edge text-black dark:text-white px-2 py-1.5"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
        >
            <IconButton onClick={() => setIsSettingsOpen(true)} title="Settings"><Brush size={20} /></IconButton>
            <IconButton onClick={() => addNote({ type: NoteType.Earth })} title="Add Note"><Plus size={20} /></IconButton>
            <IconButton onClick={resetCanvas} title="Reset Canvas"><Frame size={20} /></IconButton>
            
            <div className="w-px h-6 bg-white/30 mx-2"></div>
            
            <IconButton onClick={handleExport} title="Export Data"><Download size={20} /></IconButton>
            <IconButton as="label" title="Import Data">
                <Upload size={20} />
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </IconButton>
            
            <div className="w-px h-6 bg-white/30 mx-2"></div>
            
            <IconButton onClick={() => setSettings(s => ({ showMinimap: !s.showMinimap }))} title="Toggle Minimap"><Map size={20}/></IconButton>
            <IconButton onClick={() => setSettings(s => ({ showConnections: !s.showConnections }))} title="Toggle Connections"><LinkIcon size={20}/></IconButton>
            
            {/* Pro Mode: Constellation Auto-Arrange */}
            {settings.mode !== 'core' && selectedNoteIds.length > 1 && (
                <>
                    <div className="w-px h-6 bg-white/30 mx-2"></div>
                    <div className="relative">
                        <IconButton onClick={() => setIsArrangeOpen(!isArrangeOpen)} title="Arrange Constellation" active={isArrangeOpen}>
                            <LayoutGrid size={20} />
                        </IconButton>
                        <AnimatePresence>
                            {isArrangeOpen && (
                                <motion.div
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-black/80 backdrop-blur-xl border border-glass-edge rounded-lg p-2 flex flex-col gap-2 min-w-[140px] shadow-2xl"
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                >
                                    <button onClick={() => handleArrange('grid')} className="flex items-center p-2 hover:bg-white/10 rounded transition-colors text-sm text-white">
                                        <LayoutGrid size={16} className="mr-2 text-sky-400" /> Grid
                                    </button>
                                    <button onClick={() => handleArrange('circle')} className="flex items-center p-2 hover:bg-white/10 rounded transition-colors text-sm text-white">
                                        <Circle size={16} className="mr-2 text-purple-400" /> Circle
                                    </button>
                                    <button onClick={() => handleArrange('spiral')} className="flex items-center p-2 hover:bg-white/10 rounded transition-colors text-sm text-white">
                                        <Wind size={16} className="mr-2 text-rose-400" /> Spiral
                                    </button>
                                    <button onClick={() => handleArrange('