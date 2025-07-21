import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, ActivityIndicator, StatusBar, ImageBackground, Image, TouchableOpacity, ToastAndroid, Platform, Modal } from 'react-native';
import { getMovieById } from '../api/apicalls';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import AppHeader from '../components/AppHeader';
import LinearGradient from 'react-native-linear-gradient';
import { WebView } from 'react-native-webview';
import { useAuth } from '../context/AuthContext';
import AntDesign from 'react-native-vector-icons/AntDesign';

const MovieDetailsScreen = ({ navigation, route }) => {
    // lấy movie id truyền từ home screen
    const movieId = route.params.movieid;
    const [movieData, setMovieData] = useState(undefined);
    const [showTrailer, setShowTrailer] = useState(false);
    const { role } = useAuth();
    
    // fetch movie theo id và set data
    useEffect(() => {
        if (movieId) {
            getMovieById(movieId).then(setMovieData);
        }
    }, [movieId]);

    // không có data thì hiển thị màn hình loading
    if (!movieData) {
        return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollViewContainer}
                bounces={false}
                showsVerticalScrollIndicator={false}>
                <View style={styles.appHeaderContainer}>
                    <AppHeader
                        name="close"
                        header={''}
                        action={() => navigation.goBack()}
                    />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size={'large'} color={COLORS.Orange} />
                </View>
            </ScrollView>
        );
    };

    return (
        <ScrollView
            style={styles.container}
            bounces={true}
            showsVerticalScrollIndicator={false}>
            <StatusBar hidden />

            <View>
                <ImageBackground
                    source={{
                        uri: movieData.BackgroundImagePath,
                    }}
                    style={styles.imageBG}>
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
                <View style={styles.imageBG}></View>
                <Image
                    source={{ uri: movieData.PosterPath }}
                    style={styles.cardImage}
                />
            </View>

            <View style={styles.timeContainer}>
                <AntDesign name="clockcircle" style={styles.clockIcon} />
                <Text style={styles.runtimeText}>
                    {/* lấy phần nguyên số tiếng */}
                    {Math.floor(movieData.Duration / 60)}h{' '} 
                    {/* lấy phần dư cho phút */}
                    {movieData.Duration % 60}m 
                </Text>
            </View>

            <View>
                <Text style={styles.title}>{movieData.Name}</Text>
                <View style={styles.genreContainer}>
                    {movieData.Genres && movieData.Genres.map((item) => (
                        <View style={styles.genreBox} key={item._id}>
                            <Text style={styles.genreText}>{item.Name}</Text>
                        </View>
                    ))}
                </View>
                {movieData.Trailer && (
                    <TouchableOpacity 
                        onPress={() => setShowTrailer(true)} 
                        style={styles.trailerButton}>
                        <Text style={styles.trailerButtonText}>Watch Trailer</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Modal xem trailer Youtube */}
            <Modal visible={showTrailer} animationType="slide" onRequestClose={() => setShowTrailer(false)}>
                <View style={{ flex: 1, backgroundColor: COLORS.Black }}>
                    <TouchableOpacity onPress={() => setShowTrailer(false)} style={{ padding: 16, alignSelf: 'flex-end' }}>
                        <Text style={{ color: COLORS.Orange, fontSize: 18 }}>Close</Text>
                    </TouchableOpacity>
                    <WebView
                        source={{ uri: movieData.Trailer }}
                        style={{ flex: 1 }}
                        allowsFullscreenVideo
                    />
                </View>
            </Modal>

            <View style={styles.infoContainer}>
                <View style={styles.rateContainer}>
                    <AntDesign name="star" style={styles.starIcon} />
                    <Text style={styles.runtimeText}>
                        {movieData.VoteAverage?.toFixed(1)} ({movieData.VoteCount})
                    </Text>
                    <Text style={styles.runtimeText}>
                        {/* đổi về dạng Date, ghép chuỗi ngày tháng năm */}
                        {movieData.Premiere ? `${new Date(movieData.Premiere).getDate()} ${new Date(movieData.Premiere).toLocaleString('default', { month: 'long' })} ${new Date(movieData.Premiere).getFullYear()}` : ''}
                    </Text>
                </View>
                <Text style={styles.descriptionText}>{movieData.Description}</Text>
                <Text style={styles.runtimeText}>Language: {movieData.Language}</Text>
                <Text style={styles.runtimeText}>Director: {movieData.Director}</Text>
            </View>

            <View>
                <View>
                    {/* Booking Ticket button chỉ hiện với user và guest */}
                    {role !== 'admin' && (
                        <TouchableOpacity
                            style={styles.buttonBG}
                            onPress={() => {
                                // nếu là guest thì yêu cầu đăng nhập để đặt vé
                                if (!role) {
                                    if (Platform.OS === 'android') {
                                        ToastAndroid.showWithGravity(
                                            'Vui lòng đăng nhập để đặt vé!',
                                            ToastAndroid.SHORT,
                                            ToastAndroid.BOTTOM
                                        );
                                    }
                                    return;
                                }
                                navigation.navigate('BookingTicket', {
                                    movieid: movieData._id
                                });
                            }}>
                            <Text style={styles.buttonText}>Booking Ticket</Text>
                        </TouchableOpacity>
                    )}
                </View>
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
    loadingContainer: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    scrollViewContainer: {
        flex: 1,
    },
    appHeaderContainer: {
        marginHorizontal: SPACING.space_36,
        marginTop: SPACING.space_20 * 2,
    },
    imageBG: {
        width: '100%',
        aspectRatio: 3072 / 1727,
    },
    linearGradient: {
        height: '100%',
    },
    cardImage: {
        width: '60%',
        aspectRatio: 200 / 300,
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
    },
    clockIcon: {
        fontSize: FONTSIZE.size_20,
        color: COLORS.WhiteRGBA50,
        marginRight: SPACING.space_8,
    },
    timeContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: SPACING.space_15,
    },
    runtimeText: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_14,
        color: COLORS.White,
    },
    title: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_24,
        color: COLORS.White,
        marginHorizontal: SPACING.space_36,
        marginVertical: SPACING.space_15,
        textAlign: 'center',
    },
    genreContainer: {
        flex: 1,
        flexDirection: 'row',
        gap: SPACING.space_20,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    genreBox: {
        borderColor: COLORS.WhiteRGBA50,
        borderWidth: 1,
        paddingHorizontal: SPACING.space_10,
        paddingVertical: SPACING.space_4,
        borderRadius: BORDERRADIUS.radius_25,
    },
    genreText: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_10,
        color: COLORS.WhiteRGBA75,
    },
    tagline: {
        fontFamily: FONTFAMILY.poppins_thin,
        fontSize: FONTSIZE.size_14,
        fontStyle: 'italic',
        color: COLORS.White,
        marginHorizontal: SPACING.space_36,
        marginVertical: SPACING.space_15,
        textAlign: 'center',
    },
    infoContainer: {
        marginHorizontal: SPACING.space_24,
    },
    rateContainer: {
        flexDirection: 'row',
        gap: SPACING.space_10,
        alignItems: 'center',
    },
    starIcon: {
        fontSize: FONTSIZE.size_20,
        color: COLORS.Yellow,
    },
    descriptionText: {
        fontFamily: FONTFAMILY.poppins_light,
        fontSize: FONTSIZE.size_14,
        color: COLORS.White,
    },
    containerGap24: {
        gap: SPACING.space_24,
    },
    buttonBG: {
        alignItems: 'center',
        marginVertical: SPACING.space_24,
    },
    buttonText: {
        borderRadius: BORDERRADIUS.radius_25 * 2,
        paddingHorizontal: SPACING.space_24,
        paddingVertical: SPACING.space_10,
        backgroundColor: COLORS.Orange,
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_14,
        color: COLORS.White,
    },
    trailerButton: {
        alignSelf: 'center',
        marginVertical: 12,
        backgroundColor: COLORS.Orange,
        borderRadius: 8,
        paddingHorizontal: 24,
        paddingVertical: 8,
    },
    trailerButtonText: {
        color: COLORS.White,
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_16,
    },
});

export default MovieDetailsScreen;