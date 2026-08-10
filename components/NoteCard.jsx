import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function NoteCard({ note, onPress, onEdit, onDelete }) {
  const formatDate = (value) => {
    if (!value) return '';
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onPress} style={styles.titleGroup}>
          <View style={styles.iconContainer}><Text style={styles.icon}>□</Text></View>
          <Text style={styles.title} numberOfLines={1}>{note.title}</Text>
        </TouchableOpacity>

        <View style={styles.actionsGroup}>
          {onEdit && <TouchableOpacity onPress={() => onEdit(note)} style={styles.iconBtn}><Text>✎</Text></TouchableOpacity>}
          {onDelete && <TouchableOpacity onPress={() => onDelete(note)} style={[styles.iconBtn, styles.deleteBtn]}><Text style={styles.deleteIcon}>⌫</Text></TouchableOpacity>}
        </View>
      </View>

      <TouchableOpacity onPress={onPress}>
        <Text style={styles.previewContent} numberOfLines={3}>
          {note.content || 'No content in this note yet.'}
        </Text>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>Updated {formatDate(note.updated_at || note.created_at)}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 20, marginBottom: 14, borderWidth: 1, borderColor: '#E2E8F0', elevation: 2 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  titleGroup: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  iconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  icon: { fontSize: 21, color: '#2563EB' },
  title: { fontSize: 18, fontWeight: '700', color: '#0F172A', flex: 1 },
  actionsGroup: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  deleteBtn: { backgroundColor: '#FEF2F2', borderColor: '#FEE2E2' },
  deleteIcon: { color: '#DC2626' },
  previewContent: { fontSize: 15, color: '#475569', lineHeight: 22, marginBottom: 14 },
  dateBadge: { alignSelf: 'flex-start', backgroundColor: '#F8FAFC', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  dateText: { fontSize: 13, fontWeight: '500', color: '#64748B' },
});
