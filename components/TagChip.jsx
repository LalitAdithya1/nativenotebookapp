import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

export default function TagChip({
  name,
  selected = false,
  onPress,
  onRemove,
  size = 'medium',
}) {
  const small = size === 'small';
  const chipStyle = [
    styles.chip,
    small ? styles.chipSmall : styles.chipMedium,
    selected ? styles.selected : styles.unselected,
  ];

  const text = (
    <Text
      style={[
        styles.text,
        small ? styles.textSmall : styles.textMedium,
        selected ? styles.textSelected : styles.textUnselected,
      ]}
    >
      #{name}
    </Text>
  );

  if (!onPress && !onRemove) return <View style={chipStyle}>{text}</View>;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress || onRemove}
      style={chipStyle}
      accessibilityRole="button"
      accessibilityLabel={`Tag ${name}${selected ? ', selected' : ''}`}
    >
      {text}
      {onRemove && <Text style={[styles.remove, selected ? styles.textSelected : styles.textUnselected]}> ×</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, borderWidth: 1,
    marginRight: 6, marginBottom: 6,
  },
  chipSmall: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  chipMedium: { paddingHorizontal: 14, paddingVertical: 8 },
  selected: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  unselected: { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' },
  text: { fontWeight: '600' },
  textSmall: { fontSize: 13 },
  textMedium: { fontSize: 14 },
  textSelected: { color: '#FFFFFF' },
  textUnselected: { color: '#475569' },
  remove: { fontSize: 14, fontWeight: '700' },
});
