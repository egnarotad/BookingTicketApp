import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, StatusBar } from 'react-native';
import { COLORS, SPACING, FONTFAMILY, FONTSIZE } from '../theme/theme';
import AppHeader from '../components/AppHeader';
import { getPlaces, getScreenTypes, getTimeSlots, getCinemasByPlace, getScreenings, getScreeningsByMovieId } from '../api/apicalls';
import DateItem from '../components/DateItem';
import PlaceItem from '../components/PlaceItem';
import ScreenTypeItem from '../components/ScreenTypeItem';
import CinemaBlock from '../components/CinemaBlock';

const generateDate = () => {
    const date = new Date();
    let weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let weekdays = [];
    for (let i = 0; i < 30; i++) {
        let tempDate = {
            date: new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDate(),
            day: weekday[new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDay()],
            full: new Date(date.getTime() + i * 24 * 60 * 60 * 1000)
        };
        weekdays.push(tempDate);
    }
    return weekdays;
};

const BookingTicketScreen = ({ navigation, route }) => {
    const movieId = route?.params?.movieid;
    const [dateArray, setDateArray] = useState(generateDate());
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState();
    const [cinemas, setCinemas] = useState([]);
    const [selectedCinema, setSelectedCinema] = useState();
    const [screenings, setScreenings] = useState([]);
    const [selectedScreening, setSelectedScreening] = useState();
    const [timeslots, setTimeslots] = useState([]);
    const [screenTypes, setScreenTypes] = useState([]);
    const [selectedScreenType, setSelectedScreenType] = useState();
    const [selectedTimeSlot, setSelectedTimeSlot] = useState();

    // Gom fetch data vào 1 useEffect
    useEffect(() => {
        Promise.all([
            getPlaces(),
            getScreenTypes(),
            getTimeSlots(),
        ]).then(([placesData, screenTypesData, timeslotsData]) => {
            setPlaces(placesData);
            if (placesData.length > 0) setSelectedPlace(placesData[0]._id);
            setScreenTypes(screenTypesData);
            if (screenTypesData.length > 0) setSelectedScreenType(screenTypesData[0]);
            setTimeslots(timeslotsData);
        });
    }, []);

    // Fetch cinema theo place
    useEffect(() => {
        if (!selectedPlace) return;
        getCinemasByPlace(selectedPlace)
            .then(data => {
                setCinemas(data);
                setSelectedCinema(data.length > 0 ? data[0]._id : undefined);
            });
    }, [selectedPlace]);

    // Fetch screenings theo movieId
    useEffect(() => {
        if (!movieId) return;
        getScreeningsByMovieId(movieId)
            .then(data => setScreenings(data));
    }, [movieId]);

    // Memo hóa cinema active
    const cinemasActive = useMemo(() =>
        cinemas.filter(cinema => {
            const status = cinema.StatusID && (typeof cinema.StatusID === 'object' ? cinema.StatusID.StatusName : cinema.StatusID);
            return status === 'Active';
        }), [cinemas]
    );

    return (
        <ScrollView style={styles.container}>
            <StatusBar hidden />
            <View style={styles.appHeaderContainer}>
                <AppHeader name="close" header="Booking Ticket" action={() => navigation.goBack()} />
            </View>
            {/* Chọn ngày */}
            <FlatList
                data={dateArray}
                keyExtractor={(_, idx) => idx.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dateList}
                renderItem={({ item, index }) => (
                    <DateItem
                        item={item}
                        selected={index === selectedDateIndex}
                        onPress={() => setSelectedDateIndex(index)}
                        styles={styles}
                    />
                )}
            />
            {/* Chọn place */}
            <FlatList
                data={places}
                keyExtractor={item => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.placeList}
                renderItem={({ item }) => (
                    <PlaceItem
                        item={item}
                        selected={selectedPlace === item._id}
                        onPress={() => setSelectedPlace(item._id)}
                        styles={styles}
                    />
                )}
            />
            {/* Chọn screenType */}
            <FlatList
                data={screenTypes}
                keyExtractor={item => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 12 }}
                renderItem={({ item }) => (
                    <ScreenTypeItem
                        item={item}
                        selected={selectedScreenType?._id === item._id}
                        onPress={() => setSelectedScreenType(item)}
                    />
                )}
            />
            {/* Danh sách rạp và screening */}
            <View style={styles.cinemaList}>
                {cinemasActive.map(cinema => {
                    // Lọc screening theo cinema và screenType
                    const screeningsOfCinema = screenings.filter(s =>
                        s.RoomID && s.RoomID.CinemaID && s.RoomID.CinemaID.toString() === cinema._id &&
                        (!selectedScreenType || (s.ScreenTypeID && (typeof s.ScreenTypeID === 'object' ? s.ScreenTypeID._id : s.ScreenTypeID) === selectedScreenType._id))
                    );
                    // Lấy tất cả timeslot (Time) duy nhất từ các screening này
                    const timeslotMap = {};
                    screeningsOfCinema.forEach(s => {
                        if (s.TimeSlotID && typeof s.TimeSlotID === 'object') {
                            if (s.TimeSlotID._id && !timeslotMap[s.TimeSlotID._id]) {
                                timeslotMap[s.TimeSlotID._id] = { ...s.TimeSlotID, screeningId: s._id };
                            }
                        }
                    });
                    const timeslots = Object.values(timeslotMap);
                    return (
                        <CinemaBlock
                            key={cinema._id}
                            cinema={cinema}
                            timeslots={timeslots}
                            selectedTimeSlot={selectedTimeSlot}
                            onSelectTimeSlot={ts => {
                                if (selectedTimeSlot === ts._id) {
                                    setSelectedTimeSlot(undefined);
                                    setSelectedScreening(undefined);
                                } else {
                                    setSelectedTimeSlot(ts._id);
                                    setSelectedScreening(ts.screeningId);
                                }
                            }}
                            styles={styles}
                        />
                    );
                })}
            </View>
            {/* Nút select seat */}
            <View style={{ alignItems: 'center', marginVertical: 24 }}>
                <TouchableOpacity
                    style={[styles.selectSeatBtn, !(selectedScreening && selectedCinema && selectedPlace && selectedScreenType && selectedTimeSlot) && { backgroundColor: COLORS.Grey }]}
                    disabled={!(selectedScreening && selectedCinema && selectedPlace && selectedScreenType && selectedTimeSlot)}
                    onPress={() => {
                        // Tìm screeningId ứng với selectedTimeSlot
                        let selectedRoomId = null;
                        for (const cinema of cinemas) {
                            const screeningsOfCinema = screenings.filter(s =>
                                s.RoomID && s.RoomID.CinemaID && s.RoomID.CinemaID.toString() === cinema._id &&
                                (!selectedScreenType || (s.ScreenTypeID && (typeof s.ScreenTypeID === 'object' ? s.ScreenTypeID._id : s.ScreenTypeID) === selectedScreenType._id))
                            );
                            for (const s of screeningsOfCinema) {
                                if (s._id === selectedScreening && s.TimeSlotID && s.TimeSlotID._id === selectedTimeSlot) {
                                    selectedRoomId = s.RoomID?._id || s.RoomID;
                                }
                            }
                        }
                        navigation.navigate('SeatBooking', {
                            movieId,
                            placeId: selectedPlace,
                            cinemaId: selectedCinema,
                            screeningId: selectedScreening,
                            date: dateArray[selectedDateIndex],
                            timeslot: timeslots.find(ts => ts._id === selectedTimeSlot),
                            screenTypePrice: selectedScreenType?.Price || 0,
                            roomId: selectedRoomId,
                        });
                    }}>
                    <Text style={styles.selectSeatText}>Select Seat</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
    dateList: {
        paddingVertical: SPACING.space_12,
        paddingHorizontal: SPACING.space_12,
    },
    dateContainer: {
        width: 48,
        height: 56,
        borderRadius: 12,
        backgroundColor: COLORS.DarkGrey,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
    },
    dateText: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_18,
        color: COLORS.White,
    },
    dayText: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_12,
        color: COLORS.White,
    },
    placeList: {
        paddingVertical: SPACING.space_12,
        paddingHorizontal: SPACING.space_12,
    },
    placeContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: COLORS.DarkGrey,
        marginHorizontal: 4,
    },
    placeText: {
        color: COLORS.White,
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_14,
    },
    cinemaList: {
        marginTop: 16,
        paddingHorizontal: 16,
    },
    cinemaBlock: {
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.WhiteRGBA15,
        paddingBottom: 16,
    },
    cinemaName: {
        color: COLORS.White,
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_18,
    },
    cinemaSub: {
        color: COLORS.WhiteRGBA75,
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_14,
        marginBottom: 8,
    },
    screeningList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    screeningBtn: {
        backgroundColor: COLORS.DarkGrey,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
        marginBottom: 8,
    },
    screeningText: {
        color: COLORS.White,
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_14,
    },
    selectSeatBtn: {
        backgroundColor: COLORS.Orange,
        borderRadius: 24,
        paddingHorizontal: 32,
        paddingVertical: 12,
    },
    selectSeatText: {
        color: COLORS.White,
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_18,
    },
});

export default BookingTicketScreen; 