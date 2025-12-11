
import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { NoteType, Note, PlanetTheme } from '../types';
import { NOTE_STYLES, QUICK_TEMPLATES } from '../constants';
import useStore from '../hooks/useStore';
import { 
    LayoutTemplate, Globe, Lock, 
    Kanban, Grid, AlertCircle, Target, Users, Code, Calendar, Quote,
    Map, Layers, RefreshCw, UserCircle, Server, Activity, Sun, Network, Filter, GitBranch, Stars
} from 'lucide-react';

interface CreationMenuProps {
    x: number;
    y: number;
    onSelect: (type: NoteType) => void;
    onClose: () => void;
}

const celestialBodies: NoteType[] = [
    NoteType.Galaxy,
    NoteType.Nebula,
    NoteType.BlackHole,
    NoteType.Sun,
    NoteType.RedGiant,
    NoteType.WhiteDwarf,
    NoteType.Pulsar,
    NoteType.Jupiter,
    NoteType.Saturn,
    NoteType.Neptune,
    NoteType.Uranus,
    NoteType.Earth,
    NoteType.Venus,
    NoteType.Mars,
    NoteType.Mercury,
    NoteType.Planet,
    NoteType.Pluto,
    NoteType.Ceres,
    NoteType.Moon,
    NoteType.Asteroid,
    NoteType.Comet,
];

// Helper to map string icon names to Lucide components
const IconMap: Record<string, React.ElementType> = {
    kanban: Kanban,
    grid: Grid,
    'alert-circle': AlertCircle,
    target: Target,
    users: Users,
    code: Code,
    calendar: Calendar,
    quote: Quote,
    map: Map,
    layers: Layers,
    'refresh-cw': RefreshCw,
    'user-circle': UserCircle,
    server: Server,
    activity: Activity,
    sun: Sun,
    network: Network,
    filter: Filter,
    'git-branch': GitBranch,
    stars: Stars,
};

const CreationMenu: React.FC<CreationMenuProps> = ({ x, y, onSelect, onClose }) => {
    const settings = useStore(state => state.settings);
    const addNote = useStore(state => state.addNote);
    const [view, setView] = useState<'elements' | 'templates'>('elements');

    const radius = 420; // Increased radius for larger items
    const items = view === 'elements' ? celestialBodies : QUICK_TEMPLATES;
    const angleStep = (Math.PI * 2) / items.length;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { type: 'spring', stiffness: 300, damping: 15 },
        },
        hover: {
            scale: 1.15,
            zIndex: 10,
            transition: { type: 'spring', stiffness: 400, damping: 10 },
        }
    };

    const handleTemplateSelect = (template: typeof QUICK_TEMPLATES[0]) => {
        const noteData: Partial<Note> = {
            type: template.type,
            content: template.content,
            tags: template.tags,
            theme: template.theme
        };
        
        const rect = document.querySelector('#root')?.getBoundingClientRect();
        if(!rect) return;
        
        const canvasState = useStore.getState().canvasState;
        const noteSize = NOTE_STYLES[template.type].size.diameter;
        const posX = (x - rect.left - canvasState.pan.x) / canvasState.zoom - (noteSize / 2);
        const posY = (y - rect.top - canvasState.pan.y) / canvasState.zoom - (noteSize / 2);

        addNote({ 
            ...noteData, 
            position: { x: posX, y: posY } 
        }, false);
        
        onClose();
    };

    const isProOrUltra = settings.mode !== 'core';

    return (
        <div className="fixed inset-0 z-20" onClick={onClose}>
            {/* Mode Toggle - Always Visible now */}
            <motion.div 
                className="fixed z-40 flex bg-black/60 backdrop-blur-md rounded-full p-1 border border-glass-edge"
                style={{ left: x, top: y - 100, transform: 'translateX(-50%)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={() => setView('elements')}
                    className={`p-3 rounded-full transition-colors ${view === 'elements' ? 'bg-white/20 text-sky-400' : 'text-gray-400 hover:text-white'}`}
                    title="Celestial Elements"
                >
                    <Globe size={24} />
                </button>
                <button 
                    onClick={() => isProOrUltra && setView('templates')}
                    className={`p-3 rounded-full transition-colors ${view === 'templates' ? 'bg-white/20 text-purple-400' : isProOrUltra ? 'text-gray-400 hover:text-white' : 'text-gray-600'}`}
                    title={isProOrUltra ? "Pro Templates" : "Enable Pro Mode in Settings"}
                    style={{ cursor: isProOrUltra ? 'pointer' : 'not-allowed' }}
                >
                    {isProOrUltra ? <LayoutTemplate size={24} /> : <Lock size={20} />}
                </button>
            </motion.div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    className="fixed top-0 left-0 z-30"
                    style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }} // Center the origin on the cursor
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={(e) => e.stopPropagation()} // Prevent clicks inside the radius from closing the menu
                >
                    {view === 'elements' ? (
                        celestialBodies.map((type, index) => {
                            const angle = index * angleStep - Math.PI / 2;
                            const itemX = radius * Math.cos(angle);
                            const itemY = radius * Math.sin(angle);
                            const style = NOTE_STYLES[type];
                            const previewDiameter = Math.max(30, style.size.diameter / 12);

                            return (
                                <motion.div
                                    key={type}
                                    className="absolute"
                                    style={{
                                        left: itemX - previewDiameter / 2,
                                        top: itemY - previewDiameter / 2,
                                    }}
                                    variants={itemVariants}
                                    whileHover="hover"
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSelect(type);
                                        }}
                                        className={`transition-all duration-200 flex items-center justify-center relative group ${style.colors} ${style.glow}`}
                                        style={{
                                            width: previewDiameter,
                                            height: previewDiameter,
                                            borderRadius: type === NoteType.Nebula ? '40% 60% 60% 40% / 70% 30% 70% 30%' : '9999px',
                                            background: type === NoteType.BlackHole ? 'black' : undefined
                                        }}
                                        title={type}
                                    >
                                        {style.hasRings && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="w-[180%] h-[180%] border-[2px] border-amber-200/70 rounded-full" style={{ transform: 'rotateX(70deg)' }} />
                                                <div className="w-[150%] h-[150%] border-[1px] border-amber-100/50 rounded-full" style={{ transform: 'rotateX(70deg)' }} />
                                            </div>
                                        )}
                                        {type === NoteType.BlackHole && (
                                            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_10px_2px_rgba(147,51,234,0.8)]" />
                                        )}
                                        <span className="absolute -bottom-6 text-xs text-white bg-black/30 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{type}</span>
                                    </button>
                                </motion.div>
                            );
                        })
                    ) : (
                         QUICK_TEMPLATES.map((template, index) => {
                            const angle = index * angleStep - Math.PI / 2;
                            const itemX = radius * Math.cos(angle);
                            const itemY = radius * Math.sin(angle);
                            const style = NOTE_STYLES[template.type];
                            
                            // Fixed, larger size for templates to accommodate text
                            const previewDiameter = 90;
                            const IconComponent = IconMap[template.icon] || LayoutTemplate;

                            return (
                                <motion.div
                                    key={template.name}
                                    className="absolute"
                                    style={{
                                        left: itemX - previewDiameter / 2,
                                        top: itemY - previewDiameter / 2,
                                    }}
                                    variants={itemVariants}
                                    whileHover="hover"
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTemplateSelect(template);
                                        }}
                                        className={`transition-all duration-200 flex flex-col items-center justify-center relative group ${style.colors} ${style.glow}`}
                                        style={{
                                            width: previewDiameter,
                                            height: previewDiameter,
                                            borderRadius: '50%',
                                            borderWidth: '2px',
                                        }}
                                        title={template.name}
                                    >
                                        <div className="flex flex-col items-center justify-center text-white/90 drop-shadow-md z-10 px-1">
                                            <IconComponent size={24} className="mb-1" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider leading-tight text-center w-full break-words">
                                                {template.name}
                                            </span>
                                        </div>
                                        
                                        {/* Background effect for text readability */}
                                        <div className="absolute inset-0 bg-black/20 rounded-full z-0"></div>

                                        {style.hasRings && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="w-[160%] h-[160%] border-[2px] border-amber-200/50 rounded-full" style={{ transform: 'rotateX(70deg)' }} />
                                            </div>
                                        )}
                                    </button>
                                </motion.div>
                            );
                        })
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default CreationMenu;
