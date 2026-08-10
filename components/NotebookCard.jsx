import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import TagChip from './TagChip.jsx';

export default function NotebookCard({ notebook, onPress, onEdit, onDelete }) {
  const noteCount = (notebook.notes || []).length;
  const tags = notebook.tags || [];

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View style={styles.topRow}>
          <View style={styles.titleGroup}>
            <View style={styles.iconBadge}>
              <Text style={styles.bookIcon}>▤</Text>
            </View>
            <View style={styles.titleWrapper}>
              <Text style={styles.notebookName} numberOfLines={1}>{notebook.name}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {notebook.description || 'No description provided'}
              </Text>
            </View>
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>

        {tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags.map((tag) => <TagChip key={tag} name={tag} size="small" />)}
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.bottomRow}>
        <View style={styles.noteCountBadge}>
          <Text style={styles.noteCountText}>📝 {noteCount} {noteCount === 1 ? 'note' : 'notes'}</Text>
        </View>

        <View style={styles.actionsGroup}>
          {onEdit && (
            <TouchableOpacity onPress={() => onEdit(notebook)} style={styles.editBtn}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={() => onDelete(notebook)} style={styles.deleteBtn}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: 24, marginBottom: 18, borderWidth: 1, borderColor: '#E2E8F0', elevation: 2 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  titleGroup: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
  iconBadge: { width: 52, height: 52, borderRadius: 18, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  bookIcon: { fontSize: 25, color: '#2563EB' },
  titleWrapper: { flex: 1 },
  notebookName: { fontSize: 21, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  description: { fontSize: 15, color: '#64748B', lineHeight: 21 },
  chevron: { fontSize: 34, color: '#94A3B8' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  noteCountBadge: { backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  noteCountText: { fontSize: 14, fontWeight: '700', color: '#2563EB' },
  actionsGroup: { flexDirection: 'row', gap: 8 },
  editBtn: { backgroundColor: '#0F172A', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12 },
  editText: { color: '#FFFFFF', fontWeight: '700' },
  deleteBtn: { backgroundColor: '#FEF2F2', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12 },
  deleteText: { color: '#DC2626', fontWeight: '700' },
});
