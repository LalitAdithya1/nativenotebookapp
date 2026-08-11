import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import TagChip from '../components/TagChip.jsx';
import { useNotebooks } from '../src/context/NotebookContext.jsx';

const SUGGESTED_TAGS = ['Mathematics', 'Science', 'Personal', 'Important', 'School', 'Art', 'Reading'];

export default function CreateNotebookScreen() {
  const router = useRouter();
  const { editId } = useLocalSearchParams();
  const { notebooks, tags, addNotebook, updateNotebook } = useNotebooks();

  const notebookToEdit = notebooks.find((nb) => nb.id === editId) || null;
  const isEditing = !!notebookToEdit;

  const [name, setName] = useState(notebookToEdit?.name || '');
  const [description, setDescription] = useState(notebookToEdit?.description || '');
  const [selectedTags, setSelectedTags] = useState(notebookToEdit?.tags || []);
  const [newTagInput, setNewTagInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const availableTags = useMemo(
    () => Array.from(new Set([...SUGGESTED_TAGS, ...tags])),
    [tags]
  );

  const toggleTag = (tag) => {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]);
  };

  const addCustomTag = () => {
    const tag = newTagInput.trim();
    if (tag && !selectedTags.includes(tag)) setSelectedTags((prev) => [...prev, tag]);
    setNewTagInput('');
  };

  const save = () => {
    if (!name.trim()) {
      setErrorMessage('Please enter a notebook name.');
      return;
    }

    if (isEditing) {
      updateNotebook(notebookToEdit.id, { name, description, tags: selectedTags });
    } else {
      addNotebook({ name, description, tags: selectedTags });
    }

    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iconCircle}><Text style={styles.icon}>▤</Text></View>
          <Text style={styles.title}>{isEditing ? 'Edit Notebook' : 'Create New Notebook'}</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {!!errorMessage && (
          <View style={styles.errorBox}><Text style={styles.errorText}>⚠️ {errorMessage}</Text></View>
        )}

        <Text style={styles.label}>Notebook Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Mathematics"
          placeholderTextColor="#94A3B8"
          value={name}
          onChangeText={(text) => { setName(text); setErrorMessage(''); }}
          maxLength={60}
        />

        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="What topics will be stored here?"
          placeholderTextColor="#94A3B8"
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
        />

        <Text style={styles.label}>Notebook Tags</Text>
        <Text style={styles.helper}>Tap tags to select or deselect them.</Text>

        <View style={styles.tagsContainer}>
          {availableTags.map((tag) => (
            <TagChip key={tag} name={tag} selected={selectedTags.includes(tag)} onPress={() => toggleTag(tag)} />
          ))}
        </View>

        <View style={styles.addTagRow}>
          <TextInput
            style={styles.addTagInput}
            placeholder="New custom tag..."
            placeholderTextColor="#94A3B8"
            value={newTagInput}
            onChangeText={setNewTagInput}
            onSubmitEditing={addCustomTag}
          />
          <TouchableOpacity onPress={addCustomTag} style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={save} style={styles.saveBtn}>
          <Text style={styles.saveText}>{isEditing ? 'Save Changes' : 'Create Notebook'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  titleRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconCircle: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  icon: { fontSize: 25, color: '#2563EB' },
  title: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  closeBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  closeText: { fontSize: 28, color: '#64748B' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  errorBox: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 12, padding: 12, marginBottom: 18 },
  errorText: { color: '#991B1B', fontWeight: '600' },
  label: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginTop: 18, marginBottom: 8 },
  helper: { color: '#64748B', marginBottom: 12 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#CBD5E1', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#0F172A' },
  multiline: { minHeight: 110 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  addTagRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  addTagInput: { flex: 1, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 14, paddingHorizontal: 14, color: '#0F172A' },
  addBtn: { backgroundColor: '#2563EB', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 14 },
  addBtnText: { color: '#FFFFFF', fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, padding: 20, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  cancelBtn: { paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#F1F5F9', borderRadius: 14 },
  cancelText: { color: '#475569', fontWeight: '700' },
  saveBtn: { paddingHorizontal: 22, paddingVertical: 14, backgroundColor: '#0F172A', borderRadius: 14 },
  saveText: { color: '#FFFFFF', fontWeight: '700' },
});
