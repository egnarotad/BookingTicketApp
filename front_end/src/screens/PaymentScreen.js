import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, StatusBar, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import { createInvoice, createTicket, getStatusList, updateSeatStatus, getSeatStatusByScreening } from '../api/apicalls';

const paymentMethods = [
    { key: 'card', label: 'Bank card' },
    { key: 'cash', label: 'Cash' },
];

const PaymentScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {
        userId,
        screeningId,
        selectedSeats,
        totalPrice,
        date,
    } = route.params;
    const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].key);
    const [loading, setLoading] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');

    const handlePayment = async () => {
        setLoading(true);
        try {
            // 1. Create ticket
            const ticket = await createTicket({
                UserID: userId,
                ScreeningID: screeningId,
                SeatID: selectedSeats,
                date: {
                    date: date.date,
                    day: date.day
                },
            });

            // 2. Create invoice
            const invoice = await createInvoice({
                UserID: userId,
                TotalPrice: totalPrice,
                TicketID: ticket._id,
            });

            // 3. Lấy danh sách seatStatus của screening
            const seatStatusList = await getSeatStatusByScreening(screeningId);

            // 4. Lấy statusId của "Booked"
            const statusList = await getStatusList();
            const bookedStatus = statusList.find(s => s.StatusName === 'Booked');
            if (!bookedStatus) throw new Error('Status Booked not found');

            // 5. Đổi status cho từng seat đã chọn
            await Promise.all(
                selectedSeats.map(seatId => {
                    // Tìm seatStatus ứng với seatId
                    const seatStatus = seatStatusList.find(ss => {
                        // ss.SeatID có thể là object hoặc string
                        if (typeof ss.SeatID === 'object') {
                            return ss.SeatID._id === seatId || ss.SeatID._id === String(seatId);
                        }
                        return ss.SeatID === seatId || ss.SeatID === String(seatId);
                    });
                    if (!seatStatus) return null;
                    return updateSeatStatus(seatStatus._id, bookedStatus._id);
                })
            );

            setLoading(false);
            Alert.alert('Success', 'Payment successful!');
            navigation.navigate('Tab', { screen: 'Ticket' });
        } catch (err) {
            setLoading(false);
            Alert.alert('Error', err.message || 'Network request failed. Please check your connection and try again.');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <View style={styles.appHeaderContainer}>
                <AppHeader name="close" header="Payment" action={() => navigation.goBack()} />
            </View>
            <Text style={styles.title}>Select payment method</Text>
            <View style={styles.methodList}>
                {paymentMethods.map((method) => (
                    <TouchableOpacity
                        key={method.key}
                        style={[
                            styles.methodButton,
                            selectedMethod === method.key && styles.selectedButton,
                        ]}
                        onPress={() => setSelectedMethod(method.key)}
                        disabled={loading}
                    >
                        <Text
                            style={[
                                styles.methodText,
                                selectedMethod === method.key && styles.selectedText,
                            ]}
                        >
                            {method.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            {selectedMethod === 'card' && (
                <View style={styles.cardInputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Card number"
                        placeholderTextColor={COLORS.Grey}
                        value={cardNumber}
                        onChangeText={setCardNumber}
                        keyboardType="number-pad"
                        maxLength={16}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="CVV"
                        placeholderTextColor={COLORS.Grey}
                        value={cvv}
                        onChangeText={setCvv}
                        keyboardType="number-pad"
                        maxLength={4}
                        secureTextEntry
                    />
                </View>
            )}
            <Text style={styles.price}>Total: ${totalPrice?.toLocaleString()}</Text>
            <TouchableOpacity
                style={styles.payButton}
                onPress={handlePayment}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.payText}>Pay</Text>}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.Black,
        padding: SPACING.space_24,
        justifyContent: 'flex-start',
    },
    appHeaderContainer: {
        marginHorizontal: SPACING.space_36,
        marginTop: SPACING.space_20 * 2,
        marginBottom: SPACING.space_24,
    },
    title: {
        fontSize: FONTSIZE.size_20,
        fontFamily: FONTFAMILY.poppins_bold,
        marginBottom: SPACING.space_24,
        textAlign: 'center',
        color: COLORS.White,
    },
    methodList: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: SPACING.space_36,
    },
    methodButton: {
        paddingVertical: SPACING.space_16,
        paddingHorizontal: SPACING.space_20,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: COLORS.Grey,
        backgroundColor: COLORS.DarkGrey,
        marginHorizontal: 4,
    },
    selectedButton: {
        backgroundColor: COLORS.Orange,
        borderColor: COLORS.Orange,
    },
    methodText: {
        fontSize: FONTSIZE.size_16,
        color: COLORS.White,
        fontFamily: FONTFAMILY.poppins_medium,
    },
    selectedText: {
        color: COLORS.White,
        fontWeight: 'bold',
    },
    cardInputContainer: {
        marginBottom: SPACING.space_24,
        paddingHorizontal: SPACING.space_24,
    },
    input: {
        backgroundColor: COLORS.DarkGrey,
        color: COLORS.White,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: FONTSIZE.size_16,
        fontFamily: FONTFAMILY.poppins_regular,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.Grey,
    },
    price: {
        fontSize: FONTSIZE.size_18,
        fontFamily: FONTFAMILY.poppins_bold,
        textAlign: 'center',
        marginBottom: SPACING.space_36,
        color: COLORS.White,
    },
    payButton: {
        backgroundColor: COLORS.Orange,
        paddingVertical: SPACING.space_16,
        borderRadius: 30,
        alignItems: 'center',
        marginHorizontal: 16,
    },
    payText: {
        color: COLORS.White,
        fontSize: FONTSIZE.size_18,
        fontFamily: FONTFAMILY.poppins_bold,
    },
});

export default PaymentScreen; 