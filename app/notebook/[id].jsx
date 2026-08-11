import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from '../../components/Header.jsx';
import NoteCard from '../../components/NoteCard.jsx';
import TagChip from '../../components/TagChip.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { useNotebooks } from '../../src/context/NotebookContext.jsx';

export default function NotebookDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { notebooks, deleteNote } = useNotebooks();
  const [searchQuery, setSearchQuery] = useState('');

  const notebook = useMemo(
    () => notebooks.find((item) => item.id === id) || null,
    [notebooks, id]
  );

  const filteredNotes = useMemo(() => {
    if (!notebook) return [];
    const notes = notebook.notes || [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(q) ||
        (note.content || '').toLowerCase().includes(q)
    );
  }, [notebook, searchQuery]);

  if (!notebook) {
    return (
      <View style={styles.container}>
        <Header title="Notebook Not Found" showBack onBack={() => router.back()} />
        <EmptyState type="notebooks" actionText="Return Home" onAction={() => router.replace('/')} />
      </View>
    );
  }

  const createNote = () => {
    router.push({ pathname: '/create-note', params: { notebookId: notebook.id } });
  };

  const editNote = (note) => {
    router.push({
      pathname: '/create-note',
      params: { notebookId: notebook.id, editId: note.id },
    });
  };

  const openNote = (note) => {
    router.push({ pathname: '/note/[id]', params: { id: note.id } });
  };

  const confirmDelete = (note) => {
    Alert.alert('Delete Note?', `Are you sure you want to delete "${note.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteNote(note.id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header
        title={notebook.name}
        subtitle={notebook.description || 'Notebook Notes'}
        showBack
        onBack={() => router.back()}
        rightActionText="New Note"
        onRightAction={createNote}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!!notebook.tags?.length && (
          <View style={styles.tagsBanner}>
            <Text style={styles.tagsLabel}>Tags:</Text>
            {notebook.tags.map((tag) => <TagChip key={tag} name={tag} size="small" />)}
          </View>
        )}

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes in this notebook..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {!!searchQuery && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.countText}>
          {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
        </Text>

        {filteredNotes.length === 0 ? (
          <EmptyState
            type={searchQuery ? 'search' : 'notes'}
            actionText={searchQuery ? 'Clear Search' : '+ Create Note'}
            onAction={() => {
              if (searchQuery) setSearchQuery('');
              else createNote();
            }}
          />
        ) : (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onPress={() => openNote(note)}
              onEdit={editNote}
              onDelete={confirmDelete}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  tagsBanner: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', backgroundColor: '#FFFFFF', padding: 14, borderRadius: 18, marginBottom: 14, borderWidth: 1, borderColor: '#E2E8F0' },
  tagsLabel: { fontSize: 14, fontWeight: '700', color: '#475569', marginRight: 6 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 18, paddingHorizontal: 14, height: 52, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12 },
  searchIcon: { fontSize: 24, color: '#64748B', marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#0F172A' },
  clearIcon: { fontSize: 24, color: '#64748B' },
  countText: { fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 12 },
});
