import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNotebooks } from '../src/context/NotebookContext.jsx';

export default function CreateNoteScreen() {
  const router = useRouter();
  const { notebookId, editId } = useLocalSearchParams();
  const { notebooks, addNote, updateNote } = useNotebooks();

  const notebook = notebooks.find((nb) => nb.id === notebookId);
  const noteToEdit = notebook?.notes?.find((note) => note.id === editId) || null;
  const isEditing = !!noteToEdit;

  const [title, setTitle] = useState(noteToEdit?.title || '');
  const [content, setContent] = useState(noteToEdit?.content || '');
  const [errorMessage, setErrorMessage] = useState('');

  const save = () => {
    if (!title.trim()) {
      setErrorMessage('Please enter a title for your note.');
      return;
    }

    if (isEditing) {
      updateNote(noteToEdit.id, { title, content });
    } else if (notebookId) {
      addNote(notebookId, { title, content });
    }

    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iconCircle}><Text style={styles.icon}>□</Text></View>
          <Text style={styles.headerTitle}>{isEditing ? 'Edit Note' : 'Create New Note'}</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {!!errorMessage && (
          <View style={styles.errorBox}><Text style={styles.errorText}>⚠️ {errorMessage}</Text></View>
        )}

        <Text style={styles.label}>Note Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Quadratic Formula & Solutions"
          placeholderTextColor="#94A3B8"
          value={title}
          onChangeText={(text) => { setTitle(text); setErrorMessage(''); }}
          maxLength={100}
        />

        <Text style={styles.label}>Note Content</Text>
        <TextInput
          style={[styles.input, styles.contentInput]}
          placeholder="Write your note, formulas, reflections, or summary here..."
          placeholderTextColor="#94A3B8"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={save} style={styles.saveBtn}>
          <Text style={styles.saveText}>Save Note</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  titleRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconCircle: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#CCFBF1', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  icon: { fontSize: 24, color: '#0D9488' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  closeBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  closeText: { fontSize: 28, color: '#64748B' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  errorBox: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 12, padding: 12, marginBottom: 18 },
  errorText: { color: '#991B1B', fontWeight: '600' },
  label: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginTop: 18, marginBottom: 8 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#CBD5E1', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#0F172A' },
  contentInput: { minHeight: 300 },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, padding: 20, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  cancelBtn: { paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#F1F5F9', borderRadius: 14 },
  cancelText: { color: '#475569', fontWeight: '700' },
  saveBtn: { paddingHorizontal: 28, paddingVertical: 14, backgroundColor: '#0D9488', borderRadius: 14 },
  saveText: { color: '#FFFFFF', fontWeight: '700' },
});
