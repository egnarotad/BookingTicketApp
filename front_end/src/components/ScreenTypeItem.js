import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTFAMILY, FONTSIZE } from '../theme/theme';

const ScreenTypeItem = ({ item, selected, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.container, selected && styles.selected]}>
      <Text style={styles.typeName}>{item.TypeName}</Text>
      <Text style={styles.price}>${item.Price}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.DarkGrey,
    marginHorizontal: 4,
  },
  selected: {
    backgroundColor: COLORS.Orange,
  },
  typeName: {
    color: COLORS.White,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
  },
  price: {
    color: COLORS.White,
    fontSize: FONTSIZE.size_12,
  },
});

export default ScreenTypeItem; 