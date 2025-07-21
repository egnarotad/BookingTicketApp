import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/theme';

const TicketDetail = ({ ticket }) => {
    if (!ticket || !ticket.ScreeningID) return null;
    const screening = ticket.ScreeningID;
    return (
        <View style={styles.ticketBox}>
            <View style={styles.detailColumn}>
                <Text style={styles.ticketDetail}>Movie: {screening?.MovieID?.Name || ''}</Text>
                <Text style={styles.ticketDetail}>Room: {screening?.RoomID?.Name || ''}</Text>
                <Text style={styles.ticketDetail}>ScreenType: {screening?.ScreenTypeID?.TypeName || ''}</Text>
                <Text style={styles.ticketDetail}>Time: {screening?.TimeSlotID?.Time || ''}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    ticketBox: { marginBottom: 4 },
    detailColumn: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginLeft: 0,
        gap: 2,
    },
    ticketDetail: {
        color: COLORS.WhiteRGBA75,
        fontSize: 14,
        marginBottom: 2,
    },
});

export default TicketDetail; 