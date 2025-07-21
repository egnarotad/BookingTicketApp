import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import AppHeader from '../components/AppHeader';
import { COLORS, SPACING } from '../theme/theme';
import { getSeats, getStatusList, removeSeatFromRoom, addSeatToRoom } from '../api/apicalls';

const ManageSeatsScreen = ({ navigation, route }) => {
    const room = route.params?.room;
    const roomId = room?._id;
    const [seats, setSeats] = useState([]);
    const [selected, setSelected] = useState([]);
    const [activeStatusId, setActiveStatusId] = useState('');

    useFocusEffect(
        useCallback(() => {
            getSeats(roomId)
                .then(data => {
                    setSeats(data);
                    // Lấy danh sách seat đã thuộc room này
                    const alreadyInRoom = data
                        .filter(seat => seat.Rooms.some(r => (r._id ? r._id.toString() === roomId : r.toString() === roomId)))
                        .map(seat => seat._id);
                    setSelected(alreadyInRoom);
                })
                .catch(() => setSeats([]));
            getStatusList()
                .then(data => {
                    const active = data.find(s => s.StatusName === 'Active');
                    setActiveStatusId(active?._id || '');
                });
        }, [roomId])
    );

    const toggleSelect = (seatId) => {
        setSelected(prev => prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]);
    };

    const handleAddSeats = async () => {
        if (!roomId || !activeStatusId) return;
        try {
            console.log('[ManageSeatsScreen] Updating seats for roomId:', roomId);
            console.log('[ManageSeatsScreen] Active statusId:', activeStatusId);
            
            // 1. Ghế đã thuộc room nhưng bị bỏ chọn → xóa khỏi room
            const seatsToRemove = seats.filter(seat =>
                seat.Rooms.some(r => (r._id ? r._id.toString() === roomId : r.toString() === roomId)) &&
                !selected.includes(seat._id)
            );
            // 2. Ghế chưa thuộc room nhưng được chọn → thêm vào room
            const seatsToAdd = seats.filter(seat =>
                !seat.Rooms.some(r => (r._id ? r._id.toString() === roomId : r.toString() === roomId)) &&
                selected.includes(seat._id)
            );

            // Xóa room khỏi seat
            await Promise.all(seatsToRemove.map(seat =>
                removeSeatFromRoom(seat._id, roomId)
            ));

            // Thêm room vào seat
            await Promise.all(seatsToAdd.map(seat =>
                addSeatToRoom(seat._id, roomId)
            ));

            Alert.alert('Seats updated!');
            navigation.goBack(); // Quay về ManageRoomsScreen
        } catch (e) {
            Alert.alert('Error updating seats: ' + e.message);
        }
    };

    const selectAll = () => setSelected(seats.map(s => s._id));
    const deselectAll = () => setSelected([]);

    return (
        <View style={styles.container}>
            <AppHeader name="close" header="Manage Seats" action={() => navigation.goBack()} />
            <Text style={styles.roomTitle}>Room: {room?.Name}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 12 }}>
                <TouchableOpacity style={[styles.addButton, { marginRight: 8 }]} onPress={selectAll}>
                    <Text style={styles.addButtonText}>Select All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton} onPress={deselectAll}>
                    <Text style={styles.addButtonText}>Deselect All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={seats}
                keyExtractor={item => item._id}
                numColumns={5}
                contentContainerStyle={styles.seatList}
                renderItem={({ item }) => {
                    const label = `${item.Row}${item.Number}`;
                    const isSelected = selected.includes(item._id);
                    return (
                        <TouchableOpacity
                            style={[styles.seatBtn, isSelected ? styles.seatBtnActive : styles.seatBtnInactive]}
                            onPress={() => toggleSelect(item._id)}>
                            <Text style={isSelected ? styles.seatTextActive : styles.seatText}>{label}</Text>
                        </TouchableOpacity>
                    );
                }}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddSeats}>
                <Text style={styles.addButtonText}>Update</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.Black,
        padding: SPACING.space_20,
    },
    roomTitle: {
        color: COLORS.Orange,
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 12,
    },
    seatList: {
        alignItems: 'center',
        marginVertical: 16,
    },
    seatBtn: {
        width: 48,
        height: 48,
        margin: 6,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    seatBtnActive: {
        backgroundColor: COLORS.Orange,
        borderColor: COLORS.Orange,
    },
    seatBtnInactive: {
        backgroundColor: COLORS.Grey,
        borderColor: COLORS.WhiteRGBA50,
    },
    seatText: {
        color: COLORS.White,
        fontWeight: 'bold',
        fontSize: 16,
    },
    seatTextActive: {
        color: COLORS.White,
        fontWeight: 'bold',
        fontSize: 16,
    },
    addButton: {
        backgroundColor: COLORS.Orange,
        marginTop: 24,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: {
        color: COLORS.White,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ManageSeatsScreen; 