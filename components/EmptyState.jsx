import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function EmptyState({ type = 'notebooks', actionText, onAction }) {
  let title = 'No Notebooks Yet';
  let description = 'Create your first notebook to start organizing your learning and notes!';
  let icon = '▤';

  if (type === 'notes') {
    title = 'This Notebook is Empty';
    description = 'Add your first note to start recording thoughts, formulas, or ideas!';
    icon = '□';
  } else if (type === 'search') {
    title = 'No Matching Results Found';
    description = 'Try different keywords or clear your search filter.';
    icon = '⌕';
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {onAction && actionText && (
        <TouchableOpacity onPress={onAction} style={styles.button}>
          <Text style={styles.buttonText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 36,
    alignItems: 'center',
    marginVertical: 20,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
  },
  iconCircle: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: '#F1F5F9',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  icon: { fontSize: 34, color: '#2563EB' },
  title: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginBottom: 8, textAlign: 'center' },
  description: { fontSize: 15, color: '#64748B', textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  button: { backgroundColor: '#0F172A', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16 },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
