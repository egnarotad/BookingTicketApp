import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, FlatList, StyleSheet } from 'react-native';
import AppHeader from '../components/AppHeader';
import AdminListItem from '../components/AdminListItem';
import { COLORS, SPACING } from '../theme/theme';
import { getRooms, updateRoomStatus, getCinemas, getStatusList } from '../api/apicalls';

const ManageRoomsScreen = ({ navigation }) => {
    const [rooms, setRooms] = useState([]);
    const [cinemas, setCinemas] = useState([]);

    const fetchRoomsAndCinemas = async () => {
        try {
            // Fetch tất cả dữ liệu song song
            const [roomsRaw, cinemas, statusList] = await Promise.all([
                getRooms(),
                getCinemas(),
                getStatusList(),
            ]);

            // Gán object status cho từng room
            const rooms = roomsRaw.map(room => ({
                ...room,
                StatusID: typeof room.StatusID === 'string'
                    ? statusList.find(s => s._id === room.StatusID) || room.StatusID
                    : room.StatusID
            }));

            // Sắp xếp room mới nhất lên đầu theo createdAt
            rooms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            setRooms(rooms);
            setCinemas(cinemas);
        } catch {
            setRooms([]);
            setCinemas([]);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchRoomsAndCinemas();
        }, [])
    );

    const handleToggleStatus = async (roomId, currentStatus) => {
        try {
            const statusList = await getStatusList();
            const nextStatusName = currentStatus === 'Active' ? 'Inactive' : 'Active';
            const nextStatus = statusList.find(s => s.StatusName === nextStatusName);
            if (!nextStatus) throw new Error('Status not found');
            await updateRoomStatus(roomId, nextStatus._id);
            setRooms(prev => prev.map(r =>
                r._id === roomId
                    ? { ...r, StatusID: { ...(r.StatusID || {}), StatusName: nextStatusName, _id: nextStatus._id } }
                    : r
            ));
        } catch (err) { }
    };

    const getCinemaName = (cinemaId) => {
        const cinema = cinemas.find(c => c._id === (cinemaId?._id || cinemaId));
        return cinema ? cinema.Name : '';
    };

    return (
        <View style={styles.container}>
            <View style={styles.appHeaderContainer}>
                <AppHeader name="close" header="Manage Rooms" action={() => navigation.goBack()} />
            </View>
            <FlatList
                data={rooms}
                keyExtractor={item => item._id.toString()}
                renderItem={({ item }) => {
                    const statusName = item.StatusID && typeof item.StatusID === 'object' ? item.StatusID.StatusName : '';
                    const toggleLabel = statusName === 'Active' ? 'Inactive' : 'Active';
                    return (
                        <AdminListItem
                            title={item.Name}
                            subtitle={getCinemaName(item.CinemaID)}
                            status={statusName}
                            onEdit={() => navigation.navigate('ManageSeats', { room: item })}
                            onDelete={() => handleToggleStatus(item._id, statusName)}
                            deleteLabel={toggleLabel}
                            editLabel="Add Seats"
                        />
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.Black,
    },
    appHeaderContainer: {
        marginHorizontal: SPACING.space_36,
        marginTop: SPACING.space_20 * 2,
    },
});

export default ManageRoomsScreen; 