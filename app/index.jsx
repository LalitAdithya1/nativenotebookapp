import React, { useMemo, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  TouchableOpacity, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header.jsx';
import TagFilter from '../components/TagFilter.jsx';
import NotebookCard from '../components/NotebookCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useNotebooks } from '../src/context/NotebookContext.jsx';

const SORT_OPTIONS = [
  { id: 'updated_desc', label: 'Recently Updated' },
  { id: 'title_asc', label: 'Name (A–Z)' },
  { id: 'title_desc', label: 'Name (Z–A)' },
  { id: 'notes_desc', label: 'Most Notes' },
  { id: 'created_desc', label: 'Date Created' },
];

export default function HomeScreen() {
  const router = useRouter();
  const {
    notebooks, tags, addTag, removeTag, deleteNotebook,
  } = useNotebooks();

  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated_desc');

  const processedNotebooks = useMemo(() => {
    let result = notebooks.filter((nb) => !selectedTag || (nb.tags || []).includes(selectedTag));

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((nb) =>
        nb.name.toLowerCase().includes(q) ||
        (nb.description || '').toLowerCase().includes(q) ||
        (nb.tags || []).some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return [...result].sort((a, b) => {
      if (sortBy === 'title_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'title_desc') return b.name.localeCompare(a.name);
      if (sortBy === 'notes_desc') return (b.notes?.length || 0) - (a.notes?.length || 0);
      if (sortBy === 'created_desc') return new Date(b.created_at) - new Date(a.created_at);
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
  }, [notebooks, selectedTag, searchQuery, sortBy]);

  const openNotebook = (notebook) => {
    router.push({
      pathname: '/notebook/[id]',
      params: { id: notebook.id },
    });
  };

  const editNotebook = (notebook) => {
    router.push({
      pathname: '/create-notebook',
      params: { editId: notebook.id },
    });
  };

  const confirmDelete = (notebook) => {
    Alert.alert(
      'Delete Notebook?',
      `Are you sure you want to delete "${notebook.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteNotebook(notebook.id) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Welcome back!"
        subtitle="What would you like to learn today?"
        rightActionText="New Notebook"
        onRightAction={() => router.push('/create-notebook')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TagFilter
          tags={tags}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          onAddTag={addTag}
          onDeleteTag={removeTag}
        />

        <View style={styles.toolbarCard}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search notebooks..."
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

          <Text style={styles.sortLabel}>Sort notebooks by:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.sortRow}>
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setSortBy(option.id)}
                  style={[styles.sortPill, sortBy === option.id && styles.sortPillActive]}
                >
                  <Text style={[styles.sortText, sortBy === option.id && styles.sortTextActive]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <Text style={styles.resultsText}>
          {processedNotebooks.length} {processedNotebooks.length === 1 ? 'notebook' : 'notebooks'}
        </Text>

        {processedNotebooks.length === 0 ? (
          <EmptyState
            type={searchQuery || selectedTag ? 'search' : 'notebooks'}
            actionText={searchQuery || selectedTag ? 'Clear Filters' : 'Create Notebook'}
            onAction={() => {
              setSearchQuery('');
              setSelectedTag(null);
              if (!searchQuery && !selectedTag) router.push('/create-notebook');
            }}
          />
        ) : (
          processedNotebooks.map((notebook) => (
            <NotebookCard
              key={notebook.id}
              notebook={notebook}
              onPress={() => openNotebook(notebook)}
              onEdit={() => editNotebook(notebook)}
              onDelete={() => confirmDelete(notebook)}
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
  toolbarCard: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 22, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', height: 52, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 16, paddingHorizontal: 14, backgroundColor: '#F8FAFC' },
  searchIcon: { fontSize: 24, color: '#64748B', marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#0F172A' },
  clearIcon: { fontSize: 24, color: '#64748B' },
  sortLabel: { fontSize: 13, fontWeight: '700', color: '#64748B', marginTop: 14, marginBottom: 8 },
  sortRow: { flexDirection: 'row', gap: 8 },
  sortPill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: '#F1F5F9' },
  sortPillActive: { backgroundColor: '#2563EB' },
  sortText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  sortTextActive: { color: '#FFFFFF' },
  resultsText: { fontSize: 15, fontWeight: '700', color: '#64748B', marginBottom: 12 },
});
