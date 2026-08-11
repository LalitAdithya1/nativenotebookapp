// Frontend-only state. No backend, database, Supabase, or AsyncStorage.

import React, { createContext, useContext, useState } from 'react';

const now = () => new Date().toISOString();

const INITIAL_NOTEBOOKS = [
  {
    id: 'nb-1',
    name: 'Mathematics',
    description: 'Algebra, geometry, and calculus study notes.',
    tags: ['Mathematics', 'School'],
    created_at: now(),
    updated_at: now(),
    notes: [
      {
        id: 'note-1',
        notebook_id: 'nb-1',
        title: 'Quadratic Equations & Parabolas',
        content:
          'Standard Form: ax² + bx + c = 0\n\nQuadratic Formula:\nx = (-b ± √(b² - 4ac)) / (2a)\n\nVertex Form:\ny = a(x - h)² + k',
        created_at: now(),
        updated_at: now(),
      },
      {
        id: 'note-2',
        notebook_id: 'nb-1',
        title: 'Derivatives & Integration',
        content:
          'Power Rule:\nd/dx(xⁿ) = n·xⁿ⁻¹\n\nIntegration Power Rule:\n∫ xⁿ dx = (xⁿ⁺¹ / (n + 1)) + C',
        created_at: now(),
        updated_at: now(),
      },
    ],
  },
 
  {
    id: 'nb-2',
    name: 'Personal Journal & Ideas',
    description: 'Daily observations, project ideas, and reflections.',
    tags: ['Personal', 'Ideas'],
    created_at: now(),
    updated_at: now(),
    notes: [
      {
        id: 'note-4',
        notebook_id: 'nb-3',
        title: 'Tablet Application UX Goals',
        content:
          '• Pure frontend state management using React Context\n• Tablet-optimized touch layouts\n• Clear navigation: Home → Notebook → Notes',
        created_at: now(),
        updated_at: now(),
      },
    ],
  },
];

const INITIAL_TAGS = ['Mathematics', 'School', 'Physics', 'Personal', 'Ideas'];

const NotebookContext = createContext(null);

export function NotebookProvider({ children }) {
  const [notebooks, setNotebooks] = useState(INITIAL_NOTEBOOKS);
  const [tags, setTags] = useState(INITIAL_TAGS);

  const addTag = (tagName) => {
    const trimmed = tagName.trim();
    if (!trimmed) return;
    setTags((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
  };

  const removeTag = (tagName) => {
    setTags((prev) => prev.filter((tag) => tag !== tagName));
    setNotebooks((prev) =>
      prev.map((nb) => ({
        ...nb,
        tags: (nb.tags || []).filter((tag) => tag !== tagName),
      }))
    );
  };

  const addNotebook = ({ name, description = '', tags: nbTags = [] }) => {
    const timestamp = now();
    const notebook = {
      id: `nb-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      tags: nbTags,
      created_at: timestamp,
      updated_at: timestamp,
      notes: [],
    };

    setNotebooks((prev) => [notebook, ...prev]);
    nbTags.forEach(addTag);
    return notebook;
  };

  const updateNotebook = (id, { name, description = '', tags: nbTags = [] }) => {
    const timestamp = now();
    setNotebooks((prev) =>
      prev.map((nb) =>
        nb.id === id
          ? {
              ...nb,
              name: name.trim(),
              description: description.trim(),
              tags: nbTags,
              updated_at: timestamp,
            }
          : nb
      )
    );
    nbTags.forEach(addTag);
  };

  const deleteNotebook = (id) => {
    setNotebooks((prev) => prev.filter((nb) => nb.id !== id));
  };

  const addNote = (notebookId, { title, content = '' }) => {
    const timestamp = now();
    const note = {
      id: `note-${Date.now()}`,
      notebook_id: notebookId,
      title: title.trim() || 'Untitled Note',
      content: content.trim(),
      created_at: timestamp,
      updated_at: timestamp,
    };

    setNotebooks((prev) =>
      prev.map((nb) =>
        nb.id === notebookId
          ? { ...nb, notes: [note, ...(nb.notes || [])], updated_at: timestamp }
          : nb
      )
    );
    return note;
  };

  const updateNote = (noteId, { title, content = '' }) => {
    const timestamp = now();

    setNotebooks((prev) =>
      prev.map((nb) => {
        const index = (nb.notes || []).findIndex((note) => note.id === noteId);
        if (index === -1) return nb;

        const notes = [...nb.notes];
        notes[index] = {
          ...notes[index],
          title: title.trim() || 'Untitled Note',
          content: content.trim(),
          updated_at: timestamp,
        };

        return { ...nb, notes, updated_at: timestamp };
      })
    );
  };

  const deleteNote = (noteId) => {
    setNotebooks((prev) =>
      prev.map((nb) => ({
        ...nb,
        notes: (nb.notes || []).filter((note) => note.id !== noteId),
      }))
    );
  };

  const getNotebookById = (id) =>
    notebooks.find((notebook) => notebook.id === id) || null;

  const getNoteById = (id) => {
    for (const notebook of notebooks) {
      const note = (notebook.notes || []).find((item) => item.id === id);
      if (note) return note;
    }
    return null;
  };

  return (
    <NotebookContext.Provider
      value={{
        notebooks,
        tags,
        addTag,
        removeTag,
        addNotebook,
        updateNotebook,
        deleteNotebook,
        addNote,
        updateNote,
        deleteNote,
        getNotebookById,
        getNoteById,
      }}
    >
      {children}
    </NotebookContext.Provider>
  );
}

export function useNotebooks() {
  const context = useContext(NotebookContext);
  if (!context) {
    throw new Error('useNotebooks must be used inside NotebookProvider');
  }
  return context;
}
