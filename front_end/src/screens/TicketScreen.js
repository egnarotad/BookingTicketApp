import React from 'react';
import { Text, View, StyleSheet, StatusBar, ImageBackground, Image } from 'react-native';
import AppHeader from '../components/AppHeader';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import QRCode from 'react-native-qrcode-svg';
const TicketScreen = ({ navigation, route }) => {
    // Lấy object từ TicketListScreen
    const ticketData = route.params;
    if (!ticketData) {
        return (
            <View style={styles.container}>
                <StatusBar hidden />
                <View style={styles.appHeaderContainer}>
                    <AppHeader
                        name="close"
                        header={'My Tickets'}
                        action={() => navigation.goBack()}
                    />
                </View>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <View style={styles.appHeaderContainer}>
                <AppHeader
                    name="close"
                    header={'My Tickets'}
                    action={() => navigation.goBack()}
                />
            </View>

            <View style={styles.ticketContainer}>
                <ImageBackground
                    source={ticketData.ticketImage ? { uri: ticketData.ticketImage } : undefined}
                    style={styles.ticketBGImage}>
                    <LinearGradient
                        colors={[COLORS.OrangeRGBA0, COLORS.Orange]}
                        style={styles.linearGradient}>
                        <View
                            style={[
                                styles.blackCircle,
                                { position: 'absolute', bottom: -40, left: -40 },
                            ]}></View>
                        <View
                            style={[
                                styles.blackCircle,
                                { position: 'absolute', bottom: -40, right: -40 },
                            ]}></View>
                    </LinearGradient>
                </ImageBackground>
                <View style={styles.linear}></View>

                <View style={styles.ticketFooter}>
                    <View
                        style={[
                            styles.blackCircle,
                            { position: 'absolute', top: -40, left: -40 },
                        ]}></View>
                    <View
                        style={[
                            styles.blackCircle,
                            { position: 'absolute', top: -40, right: -40 },
                        ]}></View>
                    <View style={styles.ticketDateContainer}>
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.dateTitle}>{ticketData?.date?.date}</Text>
                            <Text style={styles.subtitle}>{ticketData?.date?.day}</Text>
                        </View>
                        <View style={styles.subtitleContainer}>
                            <AntDesign name="clockcircle" style={styles.clockIcon} />
                            <Text style={styles.subtitle}>{ticketData?.timeslot?.Time || ''}</Text>
                        </View>
                    </View>
                    <View style={styles.ticketSeatContainer}>
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.subheading}>Type</Text>
                            <Text style={styles.subtitle}>{ticketData?.screenType?.TypeName || ''}</Text>
                        </View>
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.subheading}>Room</Text>
                            <Text style={styles.subtitle}>{ticketData?.room || '...'}</Text>
                        </View>
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.subheading}>Seats</Text>
                            <Text style={styles.subtitle}>
                                {ticketData?.seatLabels && ticketData.seatLabels.length > 0
                                    ? (ticketData.seatLabels.length <= 4
                                        ? ticketData.seatLabels.join(', ')
                                        : `${ticketData.seatLabels.slice(0, 2).join(', ')}, ... (${ticketData.seatLabels.length} seats)`
                                    )
                                    : ''}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.qrContainer}>
                        <QRCode
                            value={ticketData._id || 'NoID'}
                            size={120}
                            backgroundColor="white"
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: COLORS.Black,
    },
    appHeaderContainer: {
        marginHorizontal: SPACING.space_36,
        marginTop: SPACING.space_20 * 2,
    },
    ticketContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    ticketBGImage: {
        alignSelf: 'center',
        width: 300,
        aspectRatio: 200 / 300,
        borderTopLeftRadius: BORDERRADIUS.radius_25,
        borderTopRightRadius: BORDERRADIUS.radius_25,
        overflow: 'hidden',
        justifyContent: 'flex-end',
    },
    linearGradient: {
        height: '70%',
    },
    linear: {
        borderTopColor: COLORS.Black,
        borderTopWidth: 3,
        width: 300,
        alignSelf: 'center',
        backgroundColor: COLORS.Orange,
        borderStyle: 'dashed',
    },
    ticketFooter: {
        backgroundColor: COLORS.Orange,
        width: 300,
        alignItems: 'center',
        paddingBottom: SPACING.space_36,
        alignSelf: 'center',
        borderBottomLeftRadius: BORDERRADIUS.radius_25,
        borderBottomRightRadius: BORDERRADIUS.radius_25,
    },
    ticketDateContainer: {
        flexDirection: 'row',
        gap: SPACING.space_36,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: SPACING.space_10,
    },
    ticketSeatContainer: {
        flexDirection: 'row',
        gap: SPACING.space_24,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: SPACING.space_10,
    },
    dateTitle: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_24,
        color: COLORS.White,
    },
    subtitle: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_14,
        color: COLORS.White,
    },
    subheading: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_18,
        color: COLORS.White,
    },
    subtitleContainer: {
        alignItems: 'center',
    },
    clockIcon: {
        fontSize: FONTSIZE.size_24,
        color: COLORS.White,
        paddingBottom: SPACING.space_10,
    },
    barcodeImage: {
        height: 50,
        aspectRatio: 158 / 52,
    },
    blackCircle: {
        height: 80,
        width: 80,
        borderRadius: 80,
        backgroundColor: COLORS.Black,
    },
    qrContainer: {
        marginTop: SPACING.space_20,
        backgroundColor: COLORS.White,
        padding: SPACING.space_10,
        borderRadius: BORDERRADIUS.radius_10,
    },
});

export default TicketScreen;