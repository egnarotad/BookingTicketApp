import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AppHeader from '../components/AppHeader';
import { COLORS, SPACING } from '../theme/theme';
import { Picker } from '@react-native-picker/picker';
import { getMovies, getRooms, getScreenTypes, getTimeSlots, createScreening, updateScreening } from '../api/apicalls';

const ScreeningForm = ({ navigation, route }) => {
    const screening = route.params?.screening;
    const reload = route.params?.reload;
    const [movies, setMovies] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [screenTypes, setScreenTypes] = useState([]);
    const [timeslots, setTimeslots] = useState([]);
    const [movieId, setMovieId] = useState(screening?.MovieID?._id || '');
    const [roomId, setRoomId] = useState(screening?.RoomID?._id || '');
    const [screenTypeId, setScreenTypeId] = useState(screening?.ScreenTypeID?._id || '');
    const [selectedTimeslot, setSelectedTimeslot] = useState((screening?.TimeSlotID && screening.TimeSlotID._id) ? screening.TimeSlotID._id : (screening?.TimeSlotID || ''));

    useEffect(() => {
        getMovies().then(data => setMovies(data));
        getRooms().then(data => setRooms(data));
        getScreenTypes().then(data => setScreenTypes(data));
        getTimeSlots().then(data => setTimeslots(data));
    }, []);

    const handleSave = async () => {
        if (!movieId || !roomId || !screenTypeId || !selectedTimeslot) {
            Alert.alert('Missing info', 'Please fill all fields and select a timeslot.');
            return;
        }
        const body = {
            MovieID: movieId,
            RoomID: roomId,
            ScreenTypeID: screenTypeId,
            TimeSlotID: selectedTimeslot,
        };
        try {
            let res;
            if (screening?._id) {
                res = await updateScreening(screening._id, body);
            } else {
                res = await createScreening(body);
            }
            // Nếu API trả về lỗi, ném lỗi (giả định res có thể là response hoặc object lỗi)
            if (res && res.ok === false) {
                const err = res.data || {};
                throw new Error(err.message || 'Screening already existed!');
            }
            if (reload) reload();
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', e.message || 'Failed to save screening');
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <AppHeader header={screening ? 'Edit Screening' : 'Add Screening'} name="close" action={() => navigation.goBack()} />
            <Text style={styles.label}>Movie</Text>
            <View style={styles.pickerContainer}>
                <Picker selectedValue={movieId} onValueChange={setMovieId} style={{ color: COLORS.White }} dropdownIconColor={COLORS.White}>
                    <Picker.Item label="Select movie" value="" />
                    {movies.map(m => <Picker.Item key={m._id} label={m.Name} value={m._id} />)}
                </Picker>
            </View>
            <Text style={styles.label}>Room</Text>
            <View style={styles.pickerContainer}>
                <Picker selectedValue={roomId} onValueChange={setRoomId} style={{ color: COLORS.White }} dropdownIconColor={COLORS.White}>
                    <Picker.Item label="Select room" value="" />
                    {rooms.map(r => <Picker.Item key={r._id} label={r.Name} value={r._id} />)}
                </Picker>
            </View>
            <Text style={styles.label}>Screen Type</Text>
            <View style={styles.pickerContainer}>
                <Picker selectedValue={screenTypeId} onValueChange={setScreenTypeId} style={{ color: COLORS.White }} dropdownIconColor={COLORS.White}>
                    <Picker.Item label="Select screen type" value="" />
                    {screenTypes.map(s => <Picker.Item key={s._id} label={s.TypeName} value={s._id} />)}
                </Picker>
            </View>
            <Text style={styles.label}>Time Slot</Text>
            <View style={styles.pickerContainer}>
                <Picker selectedValue={selectedTimeslot} onValueChange={setSelectedTimeslot} style={{ color: COLORS.White }} dropdownIconColor={COLORS.White}>
                    <Picker.Item label="Select timeslot" value="" />
                    {timeslots.map(t => <Picker.Item key={t._id} label={t.Time} value={t._id} />)}
                </Picker>
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.Black,
        padding: SPACING.space_20,
    },
    label: {
        color: COLORS.White,
        marginTop: SPACING.space_12,
    },
    pickerContainer: {
        backgroundColor: COLORS.Grey,
        borderRadius: 8,
        marginTop: 4,
        marginBottom: 8,
        padding: 8,
    },
    timeslotContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 4,
        marginBottom: 8,
    },
    timeslotBtn: {
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 16,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
    },
    timeslotBtnActive: {
        backgroundColor: COLORS.Orange,
        borderColor: COLORS.Orange,
    },
    timeslotBtnInactive: {
        backgroundColor: COLORS.Grey,
        borderColor: COLORS.WhiteRGBA50,
    },
    timeslotText: {
        color: COLORS.White,
    },
    timeslotTextActive: {
        color: COLORS.White,
        fontWeight: 'bold',
    },
    saveBtn: {
        backgroundColor: COLORS.Orange,
        marginTop: 24,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveBtnText: {
        color: COLORS.White,
        fontWeight: 'bold',
    },
});

export default ScreeningForm; 