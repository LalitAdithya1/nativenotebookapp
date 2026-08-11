import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Header({
  title = 'Welcome back!',
  subtitle = 'What would you like to learn today?',
  showBack = false,
  onBack,
  rightActionText,
  onRightAction,
}) {
  return (
    <View style={styles.header}>
      <View style={styles.leftGroup}>
        {showBack && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
        )}

        <View style={styles.titleWrapper}>
          <View style={styles.titleRow}>
            {!showBack && <Text style={styles.bookIcon}>▤</Text>}
            <Text style={styles.title}>{title}</Text>
          </View>
          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>

      {onRightAction && rightActionText && (
        <TouchableOpacity
          onPress={onRightAction}
          style={styles.actionBtn}
          accessibilityRole="button"
          accessibilityLabel={rightActionText}
        >
          <Text style={styles.actionIcon}>+</Text>
          <Text style={styles.actionBtnTxt}>{rightActionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  leftGroup: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  backButton: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 14,
  },
  backIcon: { fontSize: 36, lineHeight: 38, color: '#1E293B' },
  titleWrapper: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  bookIcon: { fontSize: 28, color: '#2563EB', marginRight: 8 },
  title: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  subtitle: { fontSize: 16, color: '#64748B', marginTop: 4, fontWeight: '500' },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 18, paddingVertical: 12,
    borderRadius: 16,
  },
  actionIcon: { color: '#FFFFFF', fontSize: 22, marginRight: 6 },
  actionBtnTxt: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
