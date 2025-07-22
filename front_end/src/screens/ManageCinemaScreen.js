import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AppHeader from '../components/AppHeader';
import { COLORS, SPACING } from '../theme/theme';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { getPlaces, createCinema, updateCinema, getStatusList, createRoom } from '../api/apicalls';

const ManageCinemaScreen = ({ navigation, route }) => {
  const cinema = route.params?.cinema;
  const cinemaId = cinema?._id;
  const isAdd = route.params?.isAdd;
  const [name, setName] = useState(cinema?.Name || '');
  const [placeId, setPlaceId] = useState(cinema?.PlaceID?._id || '');
  const [places, setPlaces] = useState([]);
  const [createdCinemaId, setCreatedCinemaId] = useState(null);
  const [loading, setLoading] = useState(false);
  // State cho rooms
  const [rooms, setRooms] = useState([{ Name: '', Capacity: '' }]);

  useFocusEffect(
    useCallback(() => {
      getPlaces()
        .then(data => setPlaces(data))
        .catch(() => setPlaces([]));
    }, [])
  );

  // Hàm add/update cinema
  const handleSave = async () => {
    // validate các trường cần thiết
    if (!name.trim() || !placeId) return;
    setLoading(true);
    try {
      if (cinemaId) {
        // Update
        await updateCinema(cinemaId, { Name: name, PlaceID: placeId });
      } else {
        // Add new
        const statusList = await getStatusList();
        const activeStatus = statusList.find(s => s.StatusName === 'Active');
        const newCinema = await createCinema({ Name: name, PlaceID: placeId, StatusID: activeStatus?._id });

        setCreatedCinemaId(newCinema._id);
        Alert.alert('Success', 'Created cinema successfully! Now you can add room(s).');
      }
    } finally {
      setLoading(false);
    }
  };

  // Hàm tạo room
  const handleSaveRooms = async () => {
    // Có cinema trước khi add room vào cinema đó
    if (!createdCinemaId) {
      Alert.alert('Cinema not found!');
      return;
    }
    try {
      // Lấy statusId của 'Active'
      const statusList = await getStatusList();
      const activeStatus = statusList.find(s => s.StatusName === 'Active');

      // Kiểm tra tất cả phòng trước khi tạo
      for (const room of rooms) {
        if (!room.Name || room.Name.trim() === '') {
          Alert.alert('Error', 'Name cant be empty!');
          return;
        }
        // Validate capacity là positive number
        if (!room.Capacity || isNaN(Number(room.Capacity)) || Number(room.Capacity) <= 0) {
          Alert.alert('Error', 'Capacity must a positive number!');
          return;
        }
      }

      // Nếu tất cả đều hợp lệ, tiến hành tạo
      for (const room of rooms) {
        await createRoom({
          Name: room.Name,
          Capacity: Number(room.Capacity),
          CinemaID: createdCinemaId,
          StatusID: activeStatus?._id
        });
      }
      Alert.alert('Success', 'Created Room(s) Successfully!');
      // tạo xong set lại state 
      setRooms([{ Name: '', Capacity: '' }]);
    } catch (error) {
      Alert.alert('Error', 'Cant create room(s): ' + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <AppHeader name="arrowleft" header="Manage Cinema" action={() => navigation.goBack()} />
      <Text style={styles.sectionTitle}>Update Cinema</Text>
      <Text style={styles.label}>Cinema Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>Place</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={placeId}
          style={{ color: COLORS.White }}
          dropdownIconColor={COLORS.White}
          onValueChange={v => setPlaceId(v)}>
          <Picker.Item label="Select place" value="" />
          {places.map((place) => (
            <Picker.Item key={place._id} label={place.Name} value={place._id} />
          ))}
        </Picker>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save Cinema'}</Text>
      </TouchableOpacity>

      {isAdd && (
        <>
          <Text style={styles.sectionTitle}>Add Room(s)</Text>
          {rooms.map((room, idx) => (
            <View key={idx} style={styles.roomForm}>
              <Text style={styles.label}>Room Name</Text>
              <TextInput
                style={styles.input}
                value={room.Name}
                // lặp qua từng phần tử của rooms, tìm ra room đang nhập theo index và thay đổi name còn các trường khác dữ nguyên
                onChangeText={v => setRooms(r => r.map((rm, i) => i === idx ? { ...rm, Name: v } : rm))}
              />
              <Text style={styles.label}>Capacity</Text>
              <TextInput
                style={styles.input}
                value={room.Capacity}
                // lặp qua từng phần tử của rooms, tìm ra room đang nhập theo index và thay đổi capacity còn các trường khác dữ nguyên
                onChangeText={v => setRooms(r => r.map((rm, i) => i === idx ? { ...rm, Capacity: v } : rm))} keyboardType="numeric"
              />
              {/* chỉ hiển thị delete khi danh sách có nhiều hơn 1  */}
              {rooms.length > 1 && (
                // cập nhật lại mảng rooms với các phòng trừ phòng trùng với index
                <TouchableOpacity style={styles.deleteRoomButton} onPress={() => setRooms(r => r.filter((_, i) => i !== idx))}>
                  <Text style={styles.deleteRoomButtonText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          {/* add thêm object room vào mảng rooms */}
          <TouchableOpacity style={styles.addRoomButton} onPress={() => setRooms(r => [...r, { Name: '', Capacity: '' }])}>
            <Text style={styles.addRoomButtonText}>More Room</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveRooms}>
            <Text style={styles.saveButtonText}>Save Room(s)</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Black,
    padding: SPACING.space_20,
  },
  bigTitle: {
    color: COLORS.Orange,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    color: COLORS.White,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
    textAlign: 'left',
  },
  label: {
    color: COLORS.White,
    marginTop: SPACING.space_12,
  },
  input: {
    backgroundColor: COLORS.Grey,
    color: COLORS.White,
    borderRadius: 8,
    marginTop: 4,
    padding: 8,
  },
  pickerContainer: {
    backgroundColor: COLORS.Grey,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 8,
    padding: 8,
  },
  saveButton: {
    backgroundColor: COLORS.Orange,
    marginTop: 24,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.White,
    fontWeight: 'bold',
  },
  addRoomButton: {
    backgroundColor: COLORS.DarkGrey,
    marginTop: 16,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addRoomButtonText: {
    color: COLORS.Orange,
    fontWeight: 'bold',
    fontSize: 16,
  },
  roomForm: {
    backgroundColor: COLORS.Black,
    borderWidth: 1,
    borderColor: COLORS.WhiteRGBA50,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  deleteRoomButton: {
    backgroundColor: COLORS.Orange,
    marginTop: 8,
    padding: 6,
    borderRadius: 6,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  deleteRoomButtonText: {
    color: COLORS.White,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ManageCinemaScreen;
