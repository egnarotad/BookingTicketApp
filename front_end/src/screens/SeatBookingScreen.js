import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, StatusBar, ImageBackground, TouchableOpacity, FlatList, ToastAndroid } from 'react-native';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import LinearGradient from 'react-native-linear-gradient';
import AppHeader from '../components/AppHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { getMovieById, getRoomById, getSeatsByRoom, getScreenTypes, getSeatStatusByScreening } from '../api/apicalls';

const SeatBookingScreen = ({ navigation, route }) => {
    const { movieId, screeningId, date, screenTypePrice, roomId } = route.params || {};
    const [price, setPrice] = useState(0);
    const [seatList, setSeatList] = useState([]); // Danh sách seat từ backend
    const [selectedSeatArray, setSelectedSeatArray] = useState([]);
    const [movie, setMovie] = useState();
    const [room, setRoom] = useState();
    const [capacity, setCapacity] = useState(0);
    // Thêm state cho screenType
    const [screenTypes, setScreenTypes] = useState([]);
    const [selectedScreenType, setSelectedScreenType] = useState();
    const { userId } = useAuth();
    const [seatStatusList, setSeatStatusList] = useState([]); // Thêm state lưu seatStatus

    // Fetch movie để lấy BackgroundImagePath
    useEffect(() => {
        if (movieId) {
            getMovieById(movieId)
                .then(data => setMovie(data));
        }
    }, [movieId]);

    // Fetch room để lấy capacity
    useEffect(() => {
        if (roomId) {
            getRoomById(roomId)
                .then(data => {
                    setRoom(data);
                    setCapacity(data.Capacity);
                });
        }
    }, [roomId]);

    // Lấy danh sách seat theo roomId
    useFocusEffect(
        React.useCallback(() => {
            if (roomId) {
                getSeatsByRoom(roomId)
                    .then(data => setSeatList(data));
            }
        }, [roomId])
    );

    // Fetch screenTypes từ backend
    useEffect(() => {
        getScreenTypes()
            .then(data => {
                setScreenTypes(data);
                if (data.length > 0) setSelectedScreenType(data[0]);
            });
    }, []);

    // Lấy danh sách seatStatus theo screeningId
    useEffect(() => {
        if (screeningId) {
            getSeatStatusByScreening(screeningId)
                .then(data => setSeatStatusList(data));
        }
    }, [screeningId]);

    // Sắp xếp seat thành 2D array theo Row (A, B, C, ...), mỗi row là mảng các seat theo Number tăng dần
    const get2DSeatArray = () => {
        const rowMap = {};
        seatList.forEach(seat => {
            if (!rowMap[seat.Row]) rowMap[seat.Row] = [];
            rowMap[seat.Row].push(seat);
        });
        // Sắp xếp row theo alphabet, seat trong row theo Number
        const sortedRows = Object.keys(rowMap).sort();
        let result = sortedRows.map(row => rowMap[row].sort((a, b) => a.Number - b.Number));
        // Flatten và lấy đúng capacity
        let flat = result.flat();
        flat = flat.slice(0, capacity > 0 ? capacity : flat.length);
        // Gom lại thành 2D array (theo row, nhưng chỉ lấy đủ capacity)
        const limitedMap = {};
        flat.forEach(seat => {
            if (!limitedMap[seat.Row]) limitedMap[seat.Row] = [];
            limitedMap[seat.Row].push(seat);
        });
        return Object.keys(limitedMap).sort().map(row => limitedMap[row]);
    };
    const twoDSeatArray = get2DSeatArray();

    // Lấy trạng thái ghế: available (trắng), taken (grey), selected (orange)
    const isTaken = (seat) => {
        // Tìm seatStatus ứng với seat._id
        const seatStatus = seatStatusList.find(ss => {
            if (typeof ss.SeatID === 'object') {
                return ss.SeatID._id === seat._id || ss.SeatID._id === String(seat._id);
            }
            return ss.SeatID === seat._id || ss.SeatID === String(seat._id);
        });
        if (seatStatus && seatStatus.StatusID && (seatStatus.StatusID.StatusName === 'Booked')) {
            return true;
        }
        return false;
    };
    const isSelected = (seat) => selectedSeatArray.includes(seat._id);

    const selectSeat = (seat) => {
        if (isTaken(seat)) return;
        let array = [...selectedSeatArray];
        if (!array.includes(seat._id)) {
            array.push(seat._id);
        } else {
            array = array.filter(id => id !== seat._id);
        }
        setSelectedSeatArray(array);
    };

    // Tính tổng giá
    useEffect(() => {
        setPrice(selectedSeatArray.length * 5 + (screenTypePrice || 0));
    }, [selectedSeatArray, screenTypePrice]);

    const handleGoToPayment = () => {
        if (selectedSeatArray.length !== 0) {
            navigation.navigate('Payment', {
                userId,
                screeningId,
                selectedSeats: selectedSeatArray,
                totalPrice: price,
                date: date,
                roomId,
            });
        } else {
            ToastAndroid.showWithGravity(
                'Please Select Seats',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
            );
        }
    };

    return (
        <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
            <StatusBar hidden />
            <View>
                <ImageBackground
                    source={{ uri: movie?.BackgroundImagePath }}
                    style={styles.ImageBG}>
                    <LinearGradient
                        colors={[COLORS.BlackRGB10, COLORS.Black]}
                        style={styles.linearGradient}>
                        <View style={styles.appHeaderContainer}>
                            <AppHeader
                                name="close"
                                header={''}
                                action={() => navigation.goBack()}
                            />
                        </View>
                    </LinearGradient>
                </ImageBackground>
                <Text style={styles.screenText}>Screen this side</Text>
            </View>

            <View style={styles.seatContainer}>
                <View style={styles.containerGap20}>
                    {twoDSeatArray.map((row, rowIdx) => (
                        <View key={rowIdx} style={styles.seatRow}>
                            {row.map((seat, colIdx) => (
                                <TouchableOpacity
                                    key={seat._id}
                                    onPress={() => selectSeat(seat)}>
                                    <View style={{ alignItems: 'center' }}>
                                        <MaterialCommunityIcons
                                            name="seat"
                                            style={[
                                                styles.seatIcon,
                                                isTaken(seat) ? { color: COLORS.Grey } : {},
                                                isSelected(seat) ? { color: COLORS.Orange } : {},
                                            ]}
                                        />
                                        <Text style={{ color: COLORS.White, fontSize: 10, marginTop: 2 }}>
                                            {seat.Row}{seat.Number}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </View>
                <View style={styles.seatRadioContainer}>
                    <View style={styles.radioContainer}>
                        <MaterialCommunityIcons name="seat" style={styles.radioIcon} />
                        <Text style={styles.radioText}>Available</Text>
                    </View>
                    <View style={styles.radioContainer}>
                        <MaterialCommunityIcons
                            name="seat"
                            style={[styles.radioIcon, { color: COLORS.Grey }]}
                        />
                        <Text style={styles.radioText}>Taken</Text>
                    </View>
                    <View style={styles.radioContainer}>
                        <MaterialCommunityIcons
                            name="seat"
                            style={[styles.radioIcon, { color: COLORS.Orange }]}
                        />
                        <Text style={styles.radioText}>Selected</Text>
                    </View>
                </View>
            </View>

            <View style={styles.buttonPriceContainer}>
                <View style={styles.priceContainer}>
                    <Text style={styles.totalPriceText}>Total Price</Text>
                    <Text style={styles.price}>$ {price}.00</Text>
                </View>
                <TouchableOpacity onPress={handleGoToPayment}>
                    <Text style={styles.buttonText}>Buy Tickets</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: COLORS.Black,
    },
    ImageBG: {
        width: '100%',
        aspectRatio: 3072 / 1727,
    },
    linearGradient: {
        height: '100%',
    },
    appHeaderContainer: {
        marginHorizontal: SPACING.space_36,
        marginTop: SPACING.space_20 * 2,
    },
    screenText: {
        textAlign: 'center',
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_10,
        color: COLORS.WhiteRGBA15,
    },
    seatContainer: {
        marginVertical: SPACING.space_20,
    },
    containerGap20: {
        gap: SPACING.space_20,
    },
    seatRow: {
        flexDirection: 'row',
        gap: SPACING.space_20,
        justifyContent: 'center',
    },
    seatIcon: {
        fontSize: FONTSIZE.size_24,
        color: COLORS.White,
    },
    seatRadioContainer: {
        flexDirection: 'row',
        marginTop: SPACING.space_36,
        marginBottom: SPACING.space_10,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    radioContainer: {
        flexDirection: 'row',
        gap: SPACING.space_10,
        alignItems: 'center',
    },
    radioIcon: {
        fontSize: FONTSIZE.size_20,
        color: COLORS.White,
    },
    radioText: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_12,
        color: COLORS.White,
    },
    containerGap24: {
        gap: SPACING.space_24,
    },
    dateContainer: {
        width: SPACING.space_10 * 7,
        height: SPACING.space_10 * 10,
        borderRadius: SPACING.space_10 * 10,
        backgroundColor: COLORS.DarkGrey,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateText: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_24,
        color: COLORS.White,
    },
    dayText: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_12,
        color: COLORS.White,
    },
    OutterContainer: {
        marginVertical: SPACING.space_24,
    },
    timeContainer: {
        paddingVertical: SPACING.space_10,
        borderWidth: 1,
        borderColor: COLORS.WhiteRGBA50,
        paddingHorizontal: SPACING.space_20,
        borderRadius: BORDERRADIUS.radius_25,
        backgroundColor: COLORS.DarkGrey,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeText: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_14,
        color: COLORS.White,
    },
    buttonPriceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.space_24,
        paddingBottom: SPACING.space_24,
    },
    priceContainer: {
        alignItems: 'center',
    },
    totalPriceText: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_14,
        color: COLORS.Grey,
    },
    price: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_24,
        color: COLORS.White,
    },
    buttonText: {
        borderRadius: BORDERRADIUS.radius_25,
        paddingHorizontal: SPACING.space_24,
        paddingVertical: SPACING.space_10,
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_16,
        color: COLORS.White,
        backgroundColor: COLORS.Orange,
    },
});

export default SeatBookingScreen;