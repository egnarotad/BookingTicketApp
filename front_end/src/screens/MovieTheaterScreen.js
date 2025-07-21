import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, StatusBar } from 'react-native';
import AppHeader from '../components/AppHeader';
import AdminListItem from '../components/AdminListItem';
import { COLORS, SPACING } from '../theme/theme';
import { getCinemas, getStatusList, updateCinemaStatus, getRooms, updateRoomStatus } from '../api/apicalls';

const MovieTheaterScreen = ({ navigation, route }) => {
  const [cinemas, setCinemas] = useState([]);

  //fetch cinema theo place
  const fetchCinemas = async () => {
    try {
      const data = await getCinemas();
      // Map placeName cho từng cinema
      const cinemasWithPlaces = data.map(cinema => ({
        ...cinema,
        placeName: cinema.PlaceID && cinema.PlaceID.Name
      }));
      // đưa cinema mới được tạo lên trước
      setCinemas(cinemasWithPlaces.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch {
      setCinemas([]);
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, []);

  const handleToggleStatus = async (cinemaId, currentStatus) => {
    try {
      // Lấy statusId cần chuyển sang
      const statusList = await getStatusList();
      const nextStatusName = currentStatus === 'Active' ? 'Inactive' : 'Active';
      const nextStatus = statusList.find(s => s.StatusName === nextStatusName);
      if (!nextStatus) throw new Error('Status not found');
      await updateCinemaStatus(cinemaId, nextStatus._id);
      // Nếu chuyển sang inactive hoặc active, cập nhật tất cả room thuộc cinema này
      if (nextStatusName === 'Inactive' || nextStatusName === 'Active') {
        // Lấy tất cả room thuộc cinema
        const rooms = await getRooms();
        const roomsOfCinema = rooms.filter(r => r.CinemaID === cinemaId);
        // lặp qua từng phần tử của roomsOfCinema và set lại status cho từng phần tử đó
        for (const room of roomsOfCinema) {
          await updateRoomStatus(room._id, nextStatus._id);
        }
      }
      // Cập nhật lại state
      setCinemas(prev => prev.map(c => c._id === cinemaId ? {
        ...c, StatusID: { StatusName: nextStatusName, _id: nextStatus._id }
      } : c
      ));
    } catch (err) {
      alert('Error updating status: ' + (err.message));
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.appHeaderContainer}>
        <AppHeader
          name="close"
          header="Movie Theaters"
          action={() => navigation.goBack()}
        />
      </View>
      <FlatList
        data={cinemas}
        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => {
          const statusName = item.StatusID && item.StatusID.StatusName;
          const toggleLabel = statusName === 'Active' ? 'Inactive' : 'Active';
          return (
            <AdminListItem
              title={item.Name}
              subtitle={item.placeName}
              status={statusName}
              onEdit={() => navigation.navigate('ManageCinema', { cinema: item })}
              onDelete={() => handleToggleStatus(item._id, statusName)}
              deleteLabel={toggleLabel}
            />
          );
        }}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('ManageCinema')}>
        <Text style={styles.addButtonText}>Add Cinema</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.Black },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20 * 2,
  },
  addButton: {
    backgroundColor: COLORS.Orange,
    padding: SPACING.space_12,
    borderRadius: 20,
    alignItems: 'center',
    margin: SPACING.space_20,
  },
  addButtonText: { color: COLORS.White, fontWeight: 'bold' },
});

export default MovieTheaterScreen;
