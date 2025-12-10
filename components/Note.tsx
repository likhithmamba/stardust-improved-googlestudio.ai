
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useDragControls, AnimatePresence, Transition, TargetAndTransition } from 'framer-motion';
import { Note as NoteType, NoteType as NoteTypeEnum, PlanetTheme } from '../types';
import useStore from '../hooks/useStore';
import { NOTE_STYLES, BLACK_HOLE_PROPERTIES, CELESTIAL_DESCRIPTIONS, PLANET_THEME_STYLES } from '../constants';
import { Maximize2, Search, Info, X, Palette, Crosshair, Receipt } from 'lucide-react';
import ParticleEmitter from './Particles';

const getSelectionStyle = (noteType: NoteTypeEnum): { filter: string[] } => {
    const basePulse = [
        'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))',
        'drop-shadow(0 0 16px rgba(255, 255, 255, 0.8))',
        'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))',
    ];

    switch (noteType) {
        case NoteTypeEnum.Galaxy:
            return {
                filter: [
                    'drop-shadow(0 0 20px rgba(167, 139, 250, 0.6))',
                    'drop-shadow(0 0 40px rgba(129, 140, 248, 0.9))',
                    'drop-shadow(0 0 20px rgba(167, 139, 250, 0.6))',
                ]
            };
        case NoteTypeEnum.BlackHole:
            return {
                 filter: [
                    'drop-shadow(0 0 15px rgba(168, 85, 247, 0.6))',
                    'drop-shadow(0 0 30px rgba(147, 51, 234, 0.9))',
                    'drop-shadow(0 0 15px rgba(168, 85, 247, 0.6))',
                ]
            }
        default:
            return { filter: basePulse };
    }
};

interface NoteProps {
  note: NoteType;
  isSelected: boolean;
  isPartofSelectedGroup: boolean;
  onSelect: (id: string, isShiftPressed: boolean) => void;
  onStartLinkDrag: (noteId: string, portPosition: {x: number, y: number}) => void;
  onNoteMouseUp: (noteId: string) => void;
  onNoteDoubleClick: (noteId: string) => void;
  isLinking: boolean;
  isLinkTarget: boolean; 
}

const NoteComponent: React.FC<NoteProps> = ({ note, isSelected, isPartofSelectedGroup, onSelect, onStartLinkDrag, onNoteMouseUp, onNoteDoubleClick, isLinking, isLinkTarget }) => {
  const updateNotePosition = useStore(s => s.updateNotePosition);
  const updateNoteContent = useStore(s => s.updateNoteContent);
  const deleteNote = useStore(s => s.deleteNote);
  const setFocusedNoteId = useStore(s => s.setFocusedNoteId);
  const setIsAbsorbingNoteId = useStore(s => s.setIsAbsorbingNoteId);
  const setSearchBranchRootId = useStore(s => s.setSearchBranchRootId);
  const setSearchOpen = useStore(s => s.setSearchOpen);
  const setActiveDropTargetId = useStore(s => s.setActiveDropTargetId);
  const setNoteGroup = useStore(s => s.setNoteGroup);
  const setEdgePan = useStore(s => s.setEdgePan);
  const setGroupFilter = useStore(s => s.setGroupFilter);
  const setNoteTheme = useStore(s => s.setNoteTheme);
  const setFocusModeTargetId = useStore(s => s.setFocusModeTargetId);
  
  const settings = useStore(s => s.settings);
  const focusModeTargetId = useStore(s => s.focusModeTargetId);
  
  const isBeingAbsorbed = useStore(s => s.isAbsorbingNoteId === note.id);
  const isDropTarget = useStore(s => s.activeDropTargetId === note.id && note.type === NoteTypeEnum.Nebula);

  const dragStartPos = useRef<{x: number, y: number} | null>(null);
  const groupId = note.groupId;
  const groupFilter = useStore(state => groupId ? state.notes[groupId]?.groupFilter : undefined);

  const isFilteredOut = useMemo(() => {
      if (note.type === NoteTypeEnum.Nebula && note.groupId === note.id) return false;
      if (!groupFilter || !note.groupId) return false;
      const query = groupFilter.toLowerCase();
      const contentMatch = note.content.toLowerCase().includes(query);
      const tagsMatch = note.tags && note.tags.some(t => t.toLowerCase().includes(query));
      return !contentMatch && !tagsMatch;
  }, [groupFilter, note.content, note.tags, note.groupId, note.type, note.id]);
  
  const isDimmedByFocus = useMemo(() => {
      if (settings.mode !== 'ultra' || !focusModeTargetId) return false;
      // If Focus Mode is active, only the target note is fully visible.
      // We also keep Nebulas visible to maintain context if needed, or dim them too.
      return focusModeTargetId !== note.id;
  }, [settings.mode, focusModeTargetId, note.id]);

  const dragControls = useDragControls();
  const noteRef = useRef<HTMLDivElement>(null);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const isNebula = note.type === NoteTypeEnum.Nebula;
  const isBlackHole = note.type === NoteTypeEnum.BlackHole;
  const [isExitingToBlackHole, setIsExitingToBlackHole] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const blackHoleRect = useRef<DOMRect | null>(null);
  
  const collisionTargets = useRef<NoteType[]>([]);
  const style = NOTE_STYLES[note.type];
  const themeOverride = (settings.mode !== 'core' && note.theme && note.theme !== 'default') ? PLANET_THEME_STYLES[note.theme] : null;
  
  let borderClasses = `border-2 p-4 ${themeOverride?.colors || style.colors} ${themeOverride?.glow || style.glow}`;
  if (isLinkTarget) {
      borderClasses = `border-4 p-4 border-green-400 shadow-[0_0_30px_rgba(74,222,128,0.6)] scale-105`;
  }

  const className = `absolute flex flex-col justify-center items-center text-center cursor-grab focus:outline-none transition-all duration-500 ${isNebula || isBlackHole ? '' : borderClasses} group`;

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    setIsEditing(false);
    const newContent = e.currentTarget.innerHTML;
    if (newContent !== note.content) {
      updateNoteContent(note.id, newContent);
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
  };
  
  const handleGenerateInvoice = () => {
      alert(`Generating Galactic Invoice for Client Node: ${note.id}\nScanning connected satellites for billable hours...`);
  };

  const handleDragStart = (e: any, info: any) => {
    dragStartPos.current = { x: info.point.x, y: info.point.y };
    const el = document.getElementById('black-hole');
    blackHoleRect.current = el ? el.getBoundingClientRect() : null;
    const allNotes = useStore.getState().notes;
    collisionTargets.current = (Object.values(allNotes) as NoteType[]).filter(n => 
        (n.type === NoteTypeEnum.Nebula || n.type === NoteTypeEnum.BlackHole) && n.id !== note.id
    );
  };

  const handleDrag = (_: any, info: any) => {
    const state = useStore.getState();
    const { isAbsorbingNoteId, edgePan } = state;
    // ... Collision/Black Hole Logic would be here ... 
    
    // Edge Pan Logic
    const EDGE_MARGIN = 60;
    const MAX_PAN_SPEED = 15;
    const { clientX, clientY } = info.point;
    const { innerWidth, innerHeight } = window;
    let panX = 0; let panY = 0;

    if (clientX < EDGE_MARGIN) panX = (EDGE_MARGIN - clientX) / EDGE_MARGIN * MAX_PAN_SPEED;
    else if (clientX > innerWidth - EDGE_MARGIN) panX = -(clientX - (innerWidth - EDGE_MARGIN)) / EDGE_MARGIN * MAX_PAN_SPEED;

    if (clientY < EDGE_MARGIN) panY = (EDGE_MARGIN - clientY) / EDGE_MARGIN * MAX_PAN_SPEED;
    else if (clientY > innerHeight - EDGE_MARGIN) panY = -(clientY - (innerHeight - EDGE_MARGIN)) / EDGE_MARGIN * MAX_PAN_SPEED;
    
    if (panX !== edgePan.x || panY !== edgePan.y) {
        setEdgePan({ x: panX, y: panY });
    }
  };
  
  const handleDragEnd = (_: any, info: any) => {
    blackHoleRect.current = null;
    setEdgePan({ x: 0, y: 0 }); 
    
    // DRAG THRESHOLD CHECK
    if (dragStartPos.current) {
        const dx = Math.abs(info.point.x - dragStartPos.current.x);
        const dy = Math.abs(info.point.y - dragStartPos.current.y);
        if (dx < 5 && dy < 5) return; // Treat as click
    }

    const { canvasState } = useStore.getState();
    let targetX = note.position.x + info.offset.x / canvasState.zoom;
    let targetY = note.position.y + info.offset.y / canvasState.zoom;

    const delta = {
        x: targetX - note.position.x,
        y: targetY - note.position.y,
    };
    
    updateNotePosition(note.id, delta);
    setIsAbsorbingNoteId(null);
    setActiveDropTargetId(null);
  };
  
  const handleBranchSearch = () => {
    setSearchBranchRootId(note.id);
    setSearchOpen(true);
  };

  let animateProps: TargetAndTransition = {
    scale: isFilteredOut ? 0.8 : (isBeingAbsorbed ? 0.3 : 1), 
    opacity: isFilteredOut ? 0.1 : (isBeingAbsorbed ? 0.2 : (isDimmedByFocus ? 0.1 : 1)), // Reduced opacity for focus mode
    filter: isSelected
      ? getSelectionStyle(note.type).filter
      : isPartofSelectedGroup
        ? 'drop-shadow(0 0 12px rgba(167, 139, 250, 0.8))'
        : 'drop-shadow(0 0 0px rgba(255, 255, 255, 0))',
  };

  // Only animate scale/rotation if fully visible
  if (!isDimmedByFocus && !isFilteredOut && !isBeingAbsorbed) {
      if (note.type === NoteTypeEnum.Pulsar) {
          animateProps.scale = [1, 1.08, 1];
      }
  }

  const getPortPosition = (position: 'top' | 'right' | 'bottom' | 'left') => {
      const center = style.size.diameter / 2;
      switch(position) {
          case 'top': return { top: '-8px', left: `${center - 8}px`, x: center, y: 0 };
          case 'right': return { top: `${center - 8}px`, right: '-8px', x: center * 2, y: center };
          case 'bottom': return { bottom: '-8px', left: `${center - 8}px`, x: center, y: center * 2 };
          case 'left': return { top: `${center - 8}px`, left: '-8px', x: 0, y: center };
      }
  };

  const renderConnectionPorts = () => {
    if (!isSelected || isNebula || isBlackHole) return null;
    return ['top', 'right', 'bottom', 'left'].map(pos => {
        const { top, right, bottom, left, x, y } = getPortPosition(pos as any);
        return (
            <motion.div
                key={pos}
                className="absolute w-4 h-4 bg-sky-400 rounded-full border-2 border-white/80 cursor-pointer"
                style={{ top, right, bottom, left }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                whileHover={{ scale: 1.5, backgroundColor: '#38bdf8' }}
                onPointerDown={(e) => {
                    e.stopPropagation();
                    onStartLinkDrag(note.id, { x: note.position.x + x, y: note.position.y + y });
                }}
            />
        )
    });
  };
  
  const motionDivStyle: React.CSSProperties = {
    width: style.size.diameter,
    height: style.size.diameter,
    left: note.position.x,
    top: note.position.y,
    touchAction: 'none',
    zIndex: isNebula ? 0 : (isBlackHole ? 5 : (isSelected ? 15 : (isPartofSelectedGroup ? 2 : 1))),
    willChange: isSelected || isLinkTarget ? 'transform, left, top' : 'auto', 
    pointerEvents: isFilteredOut ? 'none' : 'auto',
  };
  
  if (note.type === NoteTypeEnum.Asteroid) {
    motionDivStyle.clipPath = 'polygon(20% 0%, 80% 10%, 100% 40%, 90% 80%, 50% 100%, 10% 90%, 0% 40%)';
  } else if (!isNebula) {
    motionDivStyle.borderRadius = '9999px';
  }

  const contentClassName = `note-content overflow-hidden leading-snug cursor-text w-full h-full focus:outline-none ${isEditing ? 'no-effects' : ''}`;

  return (
    <motion.div
      ref={noteRef}
      key={note.id}
      className={className}
      style={motionDivStyle}
      drag={(!isNebula || isSelected) && !isExitingToBlackHole}
      dragMomentum={false}
      dragControls={dragControls}
      dragListener={false}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      dragTransition={{ power: 0.1, timeConstant: 200 }}
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest('.note-actions') || (e.target as HTMLElement).closest('.note-content-wrapper') || (e.target as HTMLElement).tagName === 'INPUT') {
            return;
        }
        dragControls.start(e, { snapToCursor: false });
        onSelect(note.id, e.shiftKey);
        setIsInfoVisible(false);
        setIsThemePickerOpen(false);
        e.stopPropagation();
      }}
      onMouseUp={() => onNoteMouseUp(note.id)}
      onDoubleClick={(e) => {
          e.stopPropagation();
          onNoteDoubleClick(note.id);
      }}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={animateProps}
      whileHover={{ scale: 1.02, zIndex: 20 }}
    >
      {isNebula ? (
            <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(192, 132, 252, 0.4) 0%, transparent 60%)', filter: 'blur(100px)' }}
                animate={{ scale: isDropTarget ? [1, 1.1, 1] : [1, 1.05, 1], rotate: 360 }}
                transition={{ scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 180, repeat: Infinity, ease: 'linear' }}}
            />
        ) : isBlackHole ? (
             <div className="absolute inset-0 flex items-center justify-center">
                 <div className="absolute w-full h-full rounded-full bg-black shadow-[inset_0_0_20px_5px_rgba(76,29,149,0.8)]" />
                 <motion.div 
                    className="absolute w-[140%] h-[140%] rounded-full opacity-60"
                    style={{ background: 'conic-gradient(from 0deg, transparent, #9333ea, transparent, #a855f7, transparent)', filter: 'blur(10px)' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                 />
                 <div className="absolute w-[95%] h-[95%] rounded-full bg-black z-10" />
             </div>
        ) : <ParticleEmitter diameter={style.size.diameter} />}
      
      {style.hasRings && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div 
            className="absolute w-[180%] h-[180%]"
            style={{
              borderRadius: '50%',
              transform: 'rotateX(75deg)',
              border: `${Math.max(2, style.size.diameter / 45)}px solid rgba(253, 230, 138, 0.4)`,
              boxShadow: `inset 0 0 ${style.size.diameter/45}px rgba(253, 230, 138, 0.3), 0 0 ${style.size.diameter/30}px rgba(253, 230, 138, 0.2)`,
            }}
          />
        </div>
      )}

      <AnimatePresence>
        {renderConnectionPorts()}
      </AnimatePresence>

      <div className="absolute top-4 right-4 z-30">
        <button
          className="note-actions text-white/60 hover:text-white transition-colors"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); setIsInfoVisible(!isInfoVisible); setIsThemePickerOpen(false); }}
          title={`About ${note.type}`}
        >
          <Info size={16} />
        </button>
        <AnimatePresence>
          {isInfoVisible && (
            <motion.div
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max max-w-xs p-3 bg-black/70 backdrop-blur-md rounded-lg shadow-lg text-white text-xs z-30"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {CELESTIAL_DESCRIPTIONS[note.type]}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="note-actions absolute -top-10 left-1/2 -translate-x-1/2 flex justify-center items-center z-20 pointer-events-auto">
        {isSelected && !isNebula && !isBlackHole && (
          <div className="flex items-center bg-black/40 backdrop-blur-md rounded-full p-1.5 shadow-lg space-x-1 text-white">
            <button className="p-1.5 hover:text-yellow-300" onClick={() => setFocusedNoteId(note.id)} title="Focus & Edit"><Maximize2 size={14} /></button>
            <button className="p-1.5 hover:text-sky-300" onClick={handleBranchSearch} title="Search Branch"><Search size={14} /></button>
            
            {settings.mode !== 'core' && (
                <div className="relative">
                    <button className="p-1.5 hover:text-indigo-300" onClick={() => { setIsThemePickerOpen(!isThemePickerOpen); setIsInfoVisible(false); }} title="Planet Theme">
                        <Palette size={14} />
                    </button>
                    <AnimatePresence>
                        {isThemePickerOpen && (
                            <motion.div
                                className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-lg p-2 flex gap-1 z-50 shadow-xl border border-white/10"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onPointerDown={(e) => e.stopPropagation()}
                            >
                                {(['default', 'calm', 'energetic', 'noir', 'pastel'] as PlanetTheme[]).map(theme => (
                                    <button
                                        key={theme}
                                        onClick={() => setNoteTheme(note.id, theme)}
                                        className={`w-4 h-4 rounded-full border border-white/20 hover:scale-125 transition-transform ${note.theme === theme ? 'ring-2 ring-white' : ''}`}
                                        style={{ background: theme === 'default' ? '#666' : theme === 'calm' ? '#bae6fd' : theme === 'energetic' ? '#fde047' : theme === 'noir' ? '#111' : '#f9a8d4' }}
                                        title={theme}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {settings.mode === 'ultra' && (
                <button className={`p-1.5 transition-colors ${focusModeTargetId === note.id ? 'text-purple-400' : 'hover:text-purple-300'}`} onClick={() => setFocusModeTargetId(focusModeTargetId === note.id ? null : note.id)} title={focusModeTargetId === note.id ? "Exit Focus" : "Set Focus Target"}>
                    <Crosshair size={14} />
                </button>
            )}
            
            {settings.mode === 'ultra' && note.tags.includes('client') && (
                 <button className="p-1.5 hover:text-emerald-400" onClick={handleGenerateInvoice} title="Generate Galactic Invoice">
                    <Receipt size={14} />
                </button>
            )}
          </div>
        )}
      </div>

      <div
          className="note-content-wrapper relative flex-grow w-full h-full flex items-center justify-center z-10"
          style={{ padding: `${style.size.diameter * (isNebula ? 0.05 : 0.15)}px` }}
      >
        <div
          ref={contentEditableRef}
          contentEditable
          suppressContentEditableWarning={true}
          className={contentClassName}
          dangerouslySetInnerHTML={{ __html: note.content }}
          onBlur={handleBlur}
          onFocus={handleFocus}
          style={isNebula || isBlackHole ? { background: 'transparent', padding: 0, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', textShadow: '0px 2px 10px rgba(0,0,0,0.8)', fontSize: '2.5rem', fontWeight: 'bold' } : { fontSize: `var(--note-font-size, 1rem)` }}
        />
      </div>

      {isNebula && (
        <div className={`absolute bottom-[20%] left-1/2 -translate-x-1/2 w-48 z-40 transition-opacity duration-300 focus-within:opacity-100 ${!note.groupFilter ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
            <div className="flex items-center bg-black/40 backdrop-blur-md rounded-full px-3 py-1 border border-white/20 hover:bg-black/60 transition-colors">
                <Search size={12} className="text-white/60 mr-2 flex-shrink-0" />
                <input type="text" placeholder="Filter nebula..." className="bg-transparent border-none outline-none text-white text-xs w-full placeholder-white/40" value={note.groupFilter || ''} onChange={(e) => setGroupFilter(note.id, e.target.value)} onPointerDown={(e) => e.stopPropagation()} />
                {note.groupFilter && (
                    <button onClick={() => setGroupFilter(note.id, '')} className="ml-1 text-white/60 hover:text-white flex-shrink-0"><X size={12} /></button>
                )}
            </div>
        </div>
      )}
    </motion.div>
  );
};

export default React.memo(NoteComponent);
