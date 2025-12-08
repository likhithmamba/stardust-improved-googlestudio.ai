
import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { Note, CanvasState, Settings, NoteType, PlanetTheme, LayoutType } from '../types';
import { NOTE_STYLES } from '../constants';

interface AppState {
  notes: Record<string, Note>;
  canvasState: CanvasState;
  settings: Settings;
  isLoaded: boolean;
  focusedNoteId: string | null;
  selectedNoteIds: string[];
  isSearchOpen: boolean;
  searchBranchRootId: string | null;
  isAbsorbingNoteId: string | null;
  activeDropTargetId: string | null;
  edgePan: { x: number; y: number };
  focusModeTargetId: string | null; // Ultra Mode Focus

  init: () => void;
  setCanvasState: (state: Partial<CanvasState>) => void;
  setSettings: (settings: Partial<Settings>) => void;
  addNote: (note: Partial<Note>, orbital?: boolean) => void;
  updateNotePosition: (id: string, delta: { x: number; y: number }) => void;
  updateNoteContent: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  resetCanvas: () => void;
  setFocusedNoteId: (id: string | null) => void;
  setSelectedNoteIds: (updater: (ids: string[]) => string[]) => void;
  setSearchOpen: (isOpen: boolean) => void;
  setSearchBranchRootId: (id: string | null) => void;
  createLink: (fromNoteId: string, toNoteId: string) => void;
  removeLink: (fromNoteId: string, toNoteId: string) => void;
  removeParentLink: (childId: string) => void;
  setIsAbsorbingNoteId: (id: string | null) => void;
  setNoteGroup: (noteId: string, groupId: string | null) => void;
  setActiveDropTargetId: (id: string | null) => void;
  setEdgePan: (pan: { x: number; y: number }) => void;
  setGroupFilter: (id: string, filter: string) => void;
  
  // New Pro/Ultra Actions
  setNoteTheme: (id: string, theme: PlanetTheme) => void;
  setFocusModeTargetId: (id: string | null) => void;
  layoutSelectedNotes: (layout: LayoutType) => void;
}

const useStore = create<AppState>()(
  (set, get) => ({
      notes: {},
      canvasState: { zoom: 1, pan: { x: 0, y: 0 } },
      settings: {
        theme: 'cosmic',
        font: 'inter',
        fontColor: '#FFFFFF',
        fontSize: 1,
        showConnections: true,
        showMinimap: true,
        proMode: false,
        ultraMode: false,
      },
      isLoaded: false,
      focusedNoteId: null,
      selectedNoteIds: [],
      isSearchOpen: false,
      searchBranchRootId: null,
      isAbsorbingNoteId: null,
      activeDropTargetId: null,
      edgePan: { x: 0, y: 0 },
      focusModeTargetId: null,
      
      init: () => {
        set({
          isLoaded: true,
          canvasState: { zoom: 1, pan: { x: window.innerWidth / 2, y: window.innerHeight / 2 } },
          notes: {}
        });
      },

      setCanvasState: (state) => set((prev) => ({ canvasState: { ...prev.canvasState, ...state } })),
      setSettings: (settings) => set((prev) => ({ settings: { ...prev.settings, ...settings } })),
      
      addNote: (note, orbital = true) => {
        const id = nanoid();
        const noteType = note.type || NoteType.Earth;
        const noteSize = NOTE_STYLES[noteType].size.diameter;
        let position = note.position || { x: 0, y: 0 };
        
        if (orbital && !note.parentId) {
            const notesCount = Object.keys(get().notes).length;
            const angle = notesCount * (Math.PI * (3 - Math.sqrt(5)));
            const radius = 400 * Math.sqrt(notesCount + 1);
            position = {
                x: Math.cos(angle) * radius - (noteSize / 2),
                y: Math.sin(angle) * radius - (noteSize / 2),
            };
        }

        const newNote: Note = {
          id,
          content: note.content || (noteType === NoteType.Nebula ? '<h1>Nebula Title</h1>' : `New ${noteType}`),
          position,
          type: noteType,
          parentId: note.parentId || null,
          tags: note.tags || [],
          linkedNoteIds: note.linkedNoteIds || [],
          groupId: null,
          theme: 'default',
        };
        // Initialize Nebula as its own group container
        if (newNote.type === NoteType.Nebula) {
            newNote.groupId = id; 
        }
        set((prev) => ({ notes: { ...prev.notes, [id]: newNote } }));
      },

      updateNotePosition: (id, delta) => {
        set((prev) => {
          const targetNote = prev.notes[id];
          if (!targetNote) return {};
      
          // Determine if we should move the whole group or just the note.
          // Move group ONLY if dragging the Nebula itself (the container).
          // Dragging a child note should move only that note (allowing it to be dragged out).
          const isGroupContainer = targetNote.type === NoteType.Nebula && targetNote.groupId === targetNote.id;

          // Optimization: Fast path for single notes or independent child movement
          if (!targetNote.groupId || !isGroupContainer) {
             return {
                 notes: {
                     ...prev.notes,
                     [id]: {
                         ...targetNote,
                         position: {
                             x: targetNote.position.x + delta.x,
                             y: targetNote.position.y + delta.y,
                         },
                     },
                 },
             };
          }

          // Group update logic (Dragging the Nebula moves all children)
          const newNotes = { ...prev.notes };
          const ids = Object.keys(newNotes);
          // Single pass iteration is faster than filter + map
          for (let i = 0; i < ids.length; i++) {
              const noteId = ids[i];
              const note = newNotes[noteId];
              if (note.groupId === targetNote.groupId) {
                  newNotes[noteId] = {
                      ...note,
                      position: {
                          x: note.position.x + delta.x,
                          y: note.position.y + delta.y,
                      },
                  };
              }
          }
          return { notes: newNotes };
        });
      },

      updateNoteContent: (id, content) => {
        set((prev) => ({
          notes: { ...prev.notes, [id]: { ...prev.notes[id], content } },
        }));
      },
      
      deleteNote: (id) => {
        set((prev) => {
          const newNotes = { ...prev.notes };
          const notesToDelete = new Set<string>([id]);
          const queue = [id];
      
          while (queue.length > 0) {
            const currentId = queue.shift()!;
            Object.values(newNotes).forEach((note: Note) => {
              if (note.parentId === currentId) {
                notesToDelete.add(note.id);
                queue.push(note.id);
              }
            });
          }
      
          notesToDelete.forEach(noteId => {
            delete newNotes[noteId];
          });
      
          Object.keys(newNotes).forEach(key => {
            const note = newNotes[key];
            let needsUpdate = false;
            
            const updatedLinkedIds = note.linkedNoteIds.filter(linkId => !notesToDelete.has(linkId));
            if (updatedLinkedIds.length !== note.linkedNoteIds.length) needsUpdate = true;
            
            const updatedParentId = (note.parentId && notesToDelete.has(note.parentId)) ? null : note.parentId;
            if (updatedParentId !== note.parentId) needsUpdate = true;

            if (needsUpdate) {
              newNotes[key] = { 
                  ...note, 
                  linkedNoteIds: updatedLinkedIds,
                  parentId: updatedParentId
              };
            }
          });
      
          const newFocusedNoteId = notesToDelete.has(prev.focusedNoteId || '') ? null : prev.focusedNoteId;
          const newSelectedNoteIds = prev.selectedNoteIds.filter(noteId => !notesToDelete.has(noteId));
          const newFocusModeTargetId = notesToDelete.has(prev.focusModeTargetId || '') ? null : prev.focusModeTargetId;
      
          return { 
            notes: newNotes, 
            isAbsorbingNoteId: null,
            focusedNoteId: newFocusedNoteId,
            selectedNoteIds: newSelectedNoteIds,
            focusModeTargetId: newFocusModeTargetId
          };
        });
      },
      
      resetCanvas: () => {
        set({
          notes: {},
          canvasState: { zoom: 1, pan: { x: window.innerWidth / 2, y: window.innerHeight / 2 } },
          focusedNoteId: null,
          selectedNoteIds: [],
          searchBranchRootId: null,
          focusModeTargetId: null,
        });
      },

      setFocusedNoteId: (id) => set({ focusedNoteId: id }),
      setSelectedNoteIds: (updater) => set(state => ({ selectedNoteIds: updater(state.selectedNoteIds) })),
      setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
      setSearchBranchRootId: (id) => set({ searchBranchRootId: id }),

      createLink: (fromNoteId: string, toNoteId: string) => {
          if (!fromNoteId || fromNoteId === toNoteId) {
              return;
          }

          set((prev) => {
              const fromNote = prev.notes[fromNoteId];
              const toNote = prev.notes[toNoteId];
              if (!fromNote || !toNote) return {};
              
              const fromLinkedIds = new Set(fromNote.linkedNoteIds);
              fromLinkedIds.add(toNoteId);

              const toLinkedIds = new Set(toNote.linkedNoteIds);
              toLinkedIds.add(fromNoteId);

              return {
                  notes: {
                      ...prev.notes,
                      [fromNoteId]: { ...fromNote, linkedNoteIds: Array.from(fromLinkedIds) },
                      [toNoteId]: { ...toNote, linkedNoteIds: Array.from(toLinkedIds) },
                  }
              };
          });
      },

      removeLink: (fromNoteId, toNoteId) => {
          set((prev) => {
              const fromNote = prev.notes[fromNoteId];
              const toNote = prev.notes[toNoteId];
              const updatedNotes = { ...prev.notes };

              if (fromNote) {
                  updatedNotes[fromNoteId] = {
                      ...fromNote,
                      linkedNoteIds: fromNote.linkedNoteIds.filter(id => id !== toNoteId)
                  };
              }

              if (toNote) {
                  updatedNotes[toNoteId] = {
                      ...toNote,
                      linkedNoteIds: toNote.linkedNoteIds.filter(id => id !== fromNoteId)
                  };
              }
              
              return { notes: updatedNotes };
          });
      },

      removeParentLink: (childId) => {
        set((prev) => {
            const childNote = prev.notes[childId];
            if (!childNote || !childNote.parentId) return {};

            return {
                notes: {
                    ...prev.notes,
                    [childId]: { ...childNote, parentId: null }
                },
            };
        });
      },
      
      setIsAbsorbingNoteId: (id) => set({ isAbsorbingNoteId: id }),
      setActiveDropTargetId: (id) => set({ activeDropTargetId: id }),
      setEdgePan: (pan) => set({ edgePan: pan }),
      
      setNoteGroup: (noteId, groupId) => {
        set(prev => {
            const newNotes = { ...prev.notes };
            const noteToUpdate = newNotes[noteId];
            if (!noteToUpdate) return {};

            const oldGroupId = noteToUpdate.groupId;
            newNotes[noteId] = { ...noteToUpdate, groupId };

            // Handle leaving a group (Nebula)
            if (oldGroupId && oldGroupId !== noteId) {
                const oldGroupMembers = Object.values(newNotes).filter((n: Note) => n.groupId === oldGroupId);
                // If only the Nebula itself remains, reset its group status so it acts empty
                if (oldGroupMembers.length === 1 && newNotes[oldGroupId]?.type === NoteType.Nebula) {
                    newNotes[oldGroupId] = { ...newNotes[oldGroupId], groupId: null };
                }
            }

            // Handle joining a group (Nebula)
            if (groupId && newNotes[groupId]?.type === NoteType.Nebula) {
                // Ensure the Nebula has its groupId set to itself to act as the container leader
                if (!newNotes[groupId].groupId) {
                    newNotes[groupId] = { ...newNotes[groupId], groupId: groupId };
                }
            }

            return { notes: newNotes };
        });
      },

      setGroupFilter: (id, filter) => set(prev => ({
          notes: { ...prev.notes, [id]: { ...prev.notes[id], groupFilter: filter } }
      })),

      // PRO/ULTRA Actions
      setNoteTheme: (id, theme) => set(prev => ({
          notes: { ...prev.notes, [id]: { ...prev.notes[id], theme } }
      })),
      
      setFocusModeTargetId: (id) => set({ focusModeTargetId: id }),

      layoutSelectedNotes: (layout) => {
        set((prev) => {
            const selectedIds = prev.selectedNoteIds;
            if (selectedIds.length < 2) return {};

            const selectedNotes = selectedIds.map(id => prev.notes[id]).filter(Boolean);
            if (selectedNotes.length === 0) return {};

            const newNotes = { ...prev.notes };
            
            // Calculate center mass
            const minX = Math.min(...selectedNotes.map(n => n.position.x));
            const maxX = Math.max(...selectedNotes.map(n => n.position.x));
            const minY = Math.min(...selectedNotes.map(n => n.position.y));
            const maxY = Math.max(...selectedNotes.map(n => n.position.y));
            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;

            // Sort logic varies by layout, default ID
            let sortedNotes = [...selectedNotes].sort((a, b) => a.id.localeCompare(b.id));

            // Parameters
            const maxDiameter = Math.max(...selectedNotes.map(n => NOTE_STYLES[n.type].size.diameter));
            const padding = 50;
            const spacing = maxDiameter + padding;

            if (layout === 'grid') {
                const cols = Math.ceil(Math.sqrt(selectedNotes.length));
                sortedNotes.forEach((note, index) => {
                    const col = index % cols;
                    const row = Math.floor(index / cols);
                    // Center the grid around previous center
                    const offsetX = (col - (cols - 1) / 2) * spacing;
                    const offsetY = (row - (Math.ceil(selectedNotes.length / cols) - 1) / 2) * spacing;
                    
                    newNotes[note.id] = {
                        ...note,
                        position: { x: centerX + offsetX, y: centerY + offsetY }
                    };
                });
            } else if (layout === 'circle') {
                const radius = Math.max((selectedNotes.length * spacing) / (2 * Math.PI), spacing);
                sortedNotes.forEach((note, index) => {
                    const angle = (index / selectedNotes.length) * 2 * Math.PI;
                    newNotes[note.id] = {
                        ...note,
                        position: {
                            x: centerX + radius * Math.cos(angle) - NOTE_STYLES[note.type].size.diameter / 2,
                            y: centerY + radius * Math.sin(angle) - NOTE_STYLES[note.type].size.diameter / 2
                        }
                    };
                });
            } else if (layout === 'spiral') {
                 // Archimedean spiral: r = a + b * theta
                 const a = spacing;
                 const b = spacing / (2 * Math.PI);
                 sortedNotes.forEach((note, index) => {
                    const theta = index * 0.8; // Adjust tightness
                    const r = a + b * theta;
                    newNotes[note.id] = {
                        ...note,
                        position: {
                            x: centerX + r * Math.cos(theta) - NOTE_STYLES[note.type].size.diameter / 2,
                            y: centerY + r * Math.sin(theta) - NOTE_STYLES[note.type].size.diameter / 2
                        }
                    };
                 });
            } else if (layout === 'solar') {
                // Find potential star (biggest or Sun type)
                let starIndex = sortedNotes.findIndex(n => 
                    [NoteType.Sun, NoteType.RedGiant, NoteType.WhiteDwarf, NoteType.Pulsar, NoteType.BlackHole].includes(n.type)
                );
                // If no star type, find largest by diameter
                if (starIndex === -1) {
                    let maxSize = 0;
                    sortedNotes.forEach((n, i) => {
                        const d = NOTE_STYLES[n.type].size.diameter;
                        if (d > maxSize) { maxSize = d; starIndex = i; }
                    });
                }
                
                // Swap star to front
                if (starIndex !== -1) {
                    const star = sortedNotes[starIndex];
                    sortedNotes.splice(starIndex, 1);
                    sortedNotes.unshift(star);
                }

                const star = sortedNotes[0];
                newNotes[star.id] = {
                    ...star,
                    position: { x: centerX - NOTE_STYLES[star.type].size.diameter / 2, y: centerY - NOTE_STYLES[star.type].size.diameter / 2 }
                };

                const starRadius = NOTE_STYLES[star.type].size.diameter / 2;
                let currentOrbitRadius = starRadius + spacing;
                
                // Place rest in orbit
                const satellites = sortedNotes.slice(1);
                const satellitesPerRing = 6;
                let processed = 0;
                
                while(processed < satellites.length) {
                    const countInRing = Math.min(satellites.length - processed, Math.floor((2 * Math.PI * currentOrbitRadius) / spacing));
                    const ringNodes = satellites.slice(processed, processed + countInRing);
                    
                    ringNodes.forEach((note, i) => {
                         const angle = (i / ringNodes.length) * 2 * Math.PI;
                         newNotes[note.id] = {
                             ...note,
                             position: {
                                 x: centerX + currentOrbitRadius * Math.cos(angle) - NOTE_STYLES[note.type].size.diameter / 2,
                                 y: centerY + currentOrbitRadius * Math.sin(angle) - NOTE_STYLES[note.type].size.diameter / 2
                             }
                         };
                    });
                    
                    currentOrbitRadius += spacing * 1.5;
                    processed += countInRing;
                }

            } else if (layout === 'flowchart') {
                // Simple hierarchical layout based on links within selection
                // 1. Build adjacency list for selected nodes
                const adj: Record<string, string[]> = {};
                const inDegree: Record<string, number> = {};
                const idSet = new Set(selectedIds);
                
                selectedIds.forEach(id => { adj[id] = []; inDegree[id] = 0; });
                
                selectedIds.forEach(id => {
                    const note = prev.notes[id];
                    note.linkedNoteIds.forEach(targetId => {
                        if (idSet.has(targetId)) {
                             adj[id].push(targetId);
                             inDegree[targetId] = (inDegree[targetId] || 0) + 1;
                        }
                    });
                });

                // 2. Assign Levels (BFS/Topological-ish)
                const levels: Record<number, string[]> = {};
                const queue = selectedIds.filter(id => inDegree[id] === 0);
                // If cycle or no roots, just take first
                if (queue.length === 0 && selectedIds.length > 0) queue.push(selectedIds[0]);
                
                const visited = new Set<string>();
                const noteLevel: Record<string, number> = {};
                
                queue.forEach(id => { noteLevel[id] = 0; visited.add(id); });
                
                // Populate roots
                levels[0] = [...queue];

                let maxLevel = 0;
                
                while(queue.length > 0) {
                    const currId = queue.shift()!;
                    const currLevel = noteLevel[currId];
                    maxLevel = Math.max(maxLevel, currLevel);
                    
                    adj[currId].forEach(neighbor => {
                        if (!visited.has(neighbor)) {
                            visited.add(neighbor);
                            noteLevel[neighbor] = currLevel + 1;
                            if (!levels[currLevel + 1]) levels[currLevel + 1] = [];
                            levels[currLevel + 1].push(neighbor);
                            queue.push(neighbor);
                        }
                    });
                }
                
                // Handle disconnected nodes not reached by roots
                selectedIds.forEach(id => {
                    if (!visited.has(id)) {
                        const lvl = 0; // Dump in level 0 or create separate tree? Level 0 for simplicity.
                        if (!levels[lvl]) levels[lvl] = [];
                        levels[lvl].push(id);
                        visited.add(id);
                    }
                });

                // 3. Position by level
                const levelHeight = spacing * 1.5;
                const totalHeight = (maxLevel + 1) * levelHeight;
                const startY = centerY - totalHeight / 2;

                Object.keys(levels).forEach(lvlStr => {
                    const lvl = parseInt(lvlStr);
                    const rowNodes = levels[lvl];
                    const rowWidth = rowNodes.length * spacing;
                    const startX = centerX - rowWidth / 2;
                    
                    rowNodes.forEach((nodeId, i) => {
                        const note = prev.notes[nodeId];
                         newNotes[nodeId] = {
                            ...note,
                            position: {
                                x: startX + i * spacing,
                                y: startY + lvl * levelHeight
                            }
                        };
                    });
                });
            }

            return { notes: newNotes };
        });
      },
    })
);

export default useStore;
