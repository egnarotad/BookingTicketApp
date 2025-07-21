import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/theme';

const CinemaBlock = ({ cinema, timeslots, selectedTimeSlot, onSelectTimeSlot, styles }) => (
  <View key={cinema._id} style={styles.cinemaBlock}>
    <Text style={styles.cinemaName}>{cinema.Name}</Text>
    <View style={styles.screeningList}>
      {timeslots.length > 0 ? (
        timeslots.map(ts => (
          <TouchableOpacity
            key={ts._id}
            style={[styles.screeningBtn, selectedTimeSlot === ts._id && { backgroundColor: COLORS.Orange }]}
            onPress={() => onSelectTimeSlot(ts)}>
            <Text style={styles.screeningText}>{ts.Time}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={{ color: COLORS.WhiteRGBA75 }}>No timeslots</Text>
      )}
    </View>
  </View>
);

export default CinemaBlock; 