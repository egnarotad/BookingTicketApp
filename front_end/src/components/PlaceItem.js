import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { COLORS } from '../theme/theme';

const PlaceItem = ({ item, selected, onPress, styles }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.placeContainer, selected && { backgroundColor: COLORS.Orange }]}> 
      <Text style={styles.placeText}>{item.Name}</Text>
    </View>
  </TouchableOpacity>
);

export default PlaceItem; 