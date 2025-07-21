import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ImageBackground, StyleSheet, StatusBar } from 'react-native';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import AppHeader from '../components/AppHeader';
import { useAuth } from '../context/AuthContext';
import { getTicketsByUser, getMovieById, getRoomById, getTimeSlotById, getScreenTypeById } from '../api/apicalls';
const TicketListScreen = ({ navigation }) => {
    const [tickets, setTickets] = useState([]);
    const [displayTickets, setDisplayTickets] = useState([]);
    const { userId } = useAuth();

    // 1. Fetch raw tickets
    useEffect(() => {
        if (!userId) return;
        getTicketsByUser(userId)
            .then(data => {
                setTickets(data);
            })
            .catch(() => {
                setTickets([]);
            });
    }, [userId]);

    // 2. Process tickets to get display info
    useEffect(() => {
        if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
            setDisplayTickets([]);
            return;
        }
        const processTickets = async () => {
            const ticketsWithInfo = await Promise.all(tickets.map(async (ticket) => {
                // Lấy thông tin screening, movie, room, seat, timeslot, screentype thong qua screeing id
                let screening = ticket.ScreeningID;
                let movie = null, room = null, timeslot = null, screenType = null;
                if (screening && screening.MovieID) {
                    try {
                        movie = await getMovieById(screening.MovieID);
                    } catch { }
                }
                if (screening && screening.RoomID) {
                    try {
                        room = await getRoomById(screening.RoomID);
                    } catch { }
                }
                if (screening && screening.TimeSlotID) {
                    try {
                        timeslot = typeof screening.TimeSlotID === 'object' && screening.TimeSlotID.Time ? screening.TimeSlotID : await getTimeSlotById(screening.TimeSlotID);
                    } catch { }
                }
                if (screening && screening.ScreenTypeID) {
                    try {
                        const screenTypeId = typeof screening.ScreenTypeID === 'object' && screening.ScreenTypeID._id ? screening.ScreenTypeID._id : screening.ScreenTypeID;
                        screenType = await getScreenTypeById(screenTypeId);
                    } catch { }
                }
                // Lấy label ghế
                let seatLabels = [];
                if (ticket.SeatID && Array.isArray(ticket.SeatID)) {
                    seatLabels = ticket.SeatID.map(seat => seat.Row && seat.Number ? seat.Row + seat.Number : '');
                }
                const ticketObj = {
                    _id: ticket._id,
                    movieName: movie?.Name || 'Movie',
                    ticketImage: movie?.BackgroundImagePath,
                    room: room?.Name,
                    seatLabels,
                    timeslot,
                    date: ticket.date,
                    screenType,
                };
                return ticketObj;
            }));
            setDisplayTickets(ticketsWithInfo);
        };
        processTickets();
    }, [tickets]);

    // 3. Render
    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={styles.ticketCard}
                onPress={() => {
                    navigation.navigate('TicketDetail', item); // truyền toàn bộ object
                }}
            >
                <ImageBackground
                    source={item.ticketImage ? { uri: item.ticketImage } : undefined}
                    style={styles.bgImage}
                    imageStyle={{ borderRadius: 16 }}
                >
                    <View style={styles.overlay} />
                    <Text style={styles.movieName}>{item.movieName || 'Movie'}</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoText}>{item.date?.date} {item.date?.day}</Text>
                        <Text style={styles.infoText}>{item.timeslot?.Time}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoText}>Room: {item.room || '...'}</Text>
                        <Text style={styles.infoText}>Seats: {item.seatLabels?.slice(0, 2).join(', ')}{item.seatLabels?.length > 2 ? `, ... (${item.seatLabels.length})` : ''}</Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <View style={styles.appHeaderContainer}>
                <AppHeader name="close" header="My Tickets" action={() => navigation.goBack()} />
            </View>
            {displayTickets.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No tickets found.</Text>
                </View>
            ) : (
                <FlatList
                    data={displayTickets}
                    keyExtractor={(_, idx) => idx.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                />
            )}
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
    ticketCard: {
        marginHorizontal: 16,
        marginVertical: 12,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
    },
    bgImage: {
        height: 160,
        justifyContent: 'flex-end',
        padding: 16,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.Black + '55',
        borderRadius: 16,
    },
    movieName: {
        color: COLORS.White,
        fontFamily: FONTFAMILY.poppins_bold,
        fontSize: FONTSIZE.size_18,
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    infoText: {
        color: COLORS.White,
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS.Grey,
        fontSize: FONTSIZE.size_16,
        fontFamily: FONTFAMILY.poppins_regular,
    },
    listContent: {
        paddingBottom: 32,
    },
});

export default TicketListScreen; 