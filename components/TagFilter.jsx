import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import TagChip from './TagChip.jsx';

export default function TagFilter({ tags = [], selectedTag, onSelectTag, onAddTag, onDeleteTag }) {
  const [isManaging, setIsManaging] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  const handleCreateTag = () => {
    const value = newTagInput.trim();
    if (!value) return;
    onAddTag?.(value);
    setNewTagInput('');
    setIsAdding(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>Filter by Tag</Text>

        <View style={styles.actionsRow}>
          {selectedTag && (
            <TouchableOpacity onPress={() => onSelectTag(null)} style={styles.clearBtn}>
              <Text style={styles.clearTxt}>Show All</Text>
            </TouchableOpacity>
          )}

          {onAddTag && (
            <TouchableOpacity
              onPress={() => { setIsAdding(!isAdding); setIsManaging(false); }}
              style={[styles.toolBtn, isAdding && styles.activeBtn]}
            >
              <Text style={[styles.toolIcon, isAdding && styles.white]}>+</Text>
              <Text style={[styles.toolBtnTxt, isAdding && styles.white]}>New Tag</Text>
            </TouchableOpacity>
          )}

          {onDeleteTag && (
            <TouchableOpacity
              onPress={() => { setIsManaging(!isManaging); setIsAdding(false); }}
              style={[styles.toolBtn, isManaging && styles.manageActive]}
            >
              <Text style={[styles.toolIcon, isManaging && styles.white]}>⚙</Text>
              <Text style={[styles.toolBtnTxt, isManaging && styles.white]}>{isManaging ? 'Done' : 'Manage'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isAdding && (
        <View style={styles.addTagBar}>
          <TextInput
            style={styles.addInput}
            placeholder="Enter a new tag..."
            placeholderTextColor="#94A3B8"
            value={newTagInput}
            onChangeText={setNewTagInput}
            onSubmitEditing={handleCreateTag}
            autoFocus
          />
          <TouchableOpacity onPress={handleCreateTag} style={styles.confirmAddBtn}>
            <Text style={styles.confirmAddTxt}>✓ Add</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsAdding(false)} style={styles.cancelAddBtn}>
            <Text style={styles.cancelAddTxt}>×</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TagChip name="All Notebooks" selected={selectedTag === null} onPress={() => onSelectTag(null)} />
        {tags.map((tag) => {
          const tagName = typeof tag === 'string' ? tag : tag.name;
          const selected = selectedTag === tagName;
          return (
            <TagChip
              key={tag.id || tagName}
              name={tagName}
              selected={selected}
              onPress={isManaging ? undefined : () => onSelectTag(selected ? null : tagName)}
              onRemove={isManaging ? () => onDeleteTag?.(tagName) : undefined}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20, backgroundColor: '#FFFFFF', padding: 18, borderRadius: 22, borderWidth: 1, borderColor: '#E2E8F0', elevation: 2 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  clearBtn: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#EFF6FF', borderRadius: 10 },
  clearTxt: { color: '#2563EB', fontWeight: '600', fontSize: 13 },
  toolBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#F1F5F9', borderRadius: 10, gap: 4 },
  activeBtn: { backgroundColor: '#2563EB' },
  manageActive: { backgroundColor: '#0F172A' },
  toolIcon: { color: '#2563EB', fontWeight: '700' },
  toolBtnTxt: { color: '#2563EB', fontWeight: '600', fontSize: 13 },
  white: { color: '#FFFFFF' },
  addTagBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  addInput: { flex: 1, height: 42, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, paddingHorizontal: 12, color: '#0F172A' },
  confirmAddBtn: { backgroundColor: '#2563EB', paddingHorizontal: 13, paddingVertical: 10, borderRadius: 12 },
  confirmAddTxt: { color: '#FFFFFF', fontWeight: '700' },
  cancelAddBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  cancelAddTxt: { color: '#64748B', fontSize: 22 },
  scrollContent: { paddingRight: 8 },
});
