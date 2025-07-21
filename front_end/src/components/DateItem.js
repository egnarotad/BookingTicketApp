import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { COLORS } from '../theme/theme';

const DateItem = ({ item, selected, onPress, styles }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.dateContainer, selected && { backgroundColor: COLORS.Orange }]}> 
      <Text style={styles.dateText}>{item.date}</Text>
      <Text style={styles.dayText}>{item.day}</Text>
    </View>
  </TouchableOpacity>
);

export default DateItem; 