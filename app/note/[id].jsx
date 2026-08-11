import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from '../../components/Header.jsx';
import { useNotebooks } from '../../src/context/NotebookContext.jsx';

export default function NoteDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { notebooks, deleteNote } = useNotebooks();

  const note = useMemo(() => {
    for (const notebook of notebooks) {
      const found = (notebook.notes || []).find((item) => item.id === id);
      if (found) return found;
    }
    return null;
  }, [notebooks, id]);

  const formatDate = (value) => {
    if (!value) return '';
    return new Date(value).toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  if (!note) {
    return (
      <View style={styles.container}>
        <Header title="Note Not Found" showBack onBack={() => router.back()} />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>This note might have been deleted.</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Return to Notebook</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const notebook = notebooks.find((item) => item.id === note.notebook_id);

  const edit = () => {
    router.push({
      pathname: '/create-note',
      params: { notebookId: note.notebook_id, editId: note.id },
    });
  };

  const remove = () => {
    Alert.alert('Delete Note?', `Are you sure you want to delete "${note.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteNote(note.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Note Reader"
        subtitle={`Created on ${formatDate(note.created_at)}`}
        showBack
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.paperCard}>
          <View style={styles.topRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeIcon}>□</Text>
              <Text style={styles.badgeText}>Note Content</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity onPress={edit} style={styles.editBtn}>
                <Text style={styles.editText}>✎ Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={remove} style={styles.deleteBtn}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.noteTitle}>{note.title}</Text>
          <Text style={styles.dateText}>
            Last updated: {formatDate(note.updated_at || note.created_at)}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.noteBody}>
            {note.content || 'This note has no written content.'}
          </Text>

          {notebook && (
            <Text style={styles.notebookText}>Notebook: {notebook.name}</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  paperCard: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 26, borderWidth: 1, borderColor: '#E2E8F0', elevation: 3 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#CCFBF1', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  badgeIcon: { color: '#0D9488', marginRight: 6 },
  badgeText: { color: '#0F766E', fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 8 },
  editBtn: { backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 9, borderRadius: 10 },
  editText: { color: '#2563EB', fontWeight: '700' },
  deleteBtn: { backgroundColor: '#FEF2F2', paddingHorizontal: 12, paddingVertical: 9, borderRadius: 10 },
  deleteText: { color: '#DC2626', fontWeight: '700' },
  noteTitle: { fontSize: 30, fontWeight: '800', color: '#0F172A', marginBottom: 10 },
  dateText: { color: '#64748B', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 22 },
  noteBody: { fontSize: 17, color: '#334155', lineHeight: 28 },
  notebookText: { marginTop: 28, color: '#64748B', fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  emptyText: { color: '#64748B', fontSize: 16, marginBottom: 18 },
  backBtn: { backgroundColor: '#0F172A', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14 },
  backText: { color: '#FFFFFF', fontWeight: '700' },
});
