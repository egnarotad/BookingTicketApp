import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../theme/theme';

const AdminListItem = ({ title, subtitle, status, onEdit, onDelete, deleteLabel, editLabel }) => (
  <View style={styles.item}>
    <View>
      <Text style={styles.title}>{title}</Text>
      {/* nếu có subtitle hoặc status thì render Text */}
      {(subtitle || status) && ( 
        <Text style={styles.subtitle}>
          {subtitle}
          {/* nếu có cả subtitle và status thì hiển thị phân cách */}
          {subtitle && status ? ' | ' : ''} 
          {status}
        </Text>
      )}
    </View>
    <View style={styles.actions}>
      <TouchableOpacity onPress={onEdit}><Text style={styles.actionText}>{editLabel || 'Edit'}</Text></TouchableOpacity>
      {onDelete && (
        <TouchableOpacity onPress={onDelete}>
          <Text style={styles.actionText}>{deleteLabel || 'Delete'}</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomColor: COLORS.WhiteRGBA15,
    borderBottomWidth: 1
  },
  title: {
    color: COLORS.White,
    fontWeight: 'bold'
  },
  subtitle: {
    color: COLORS.WhiteRGBA75
  },
  actions: {
    flexDirection: 'row',
    gap: 12
  },
  actionText: {
    color: COLORS.Orange,
    marginLeft: 12
  },
});

export default AdminListItem;
