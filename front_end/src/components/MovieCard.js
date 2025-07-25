import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import AntDesign from 'react-native-vector-icons/AntDesign';

const MovieCard = (props) => {
    return (
        <TouchableOpacity onPress={() => props.cardFunction()}>
            <View
                style={[
                    styles.container,
                    props.shoudlMarginatedAtEnd
                        ? props.isFirst
                            ? { marginLeft: SPACING.space_36 }
                            : props.isLast
                                ? { marginRight: SPACING.space_36 }
                                : {}
                        : {},
                    props.shouldMarginatedAround ? { margin: SPACING.space_12 } : {},
                    { maxWidth: props.cardWidth },
                ]}>
                <Image
                    style={[styles.cardImage, { width: props.cardWidth }]}
                    source={{ uri: props.imagePath }}
                />

                <View>
                    <View style={styles.rateContainer}>
                        <AntDesign name="star" style={styles.starIcon} />
                        <Text style={styles.voteText}>
                            {props.vote_average} ({props.vote_count})
                        </Text>
                    </View>

                    <Text numberOfLines={1} style={styles.textTitle}>
                        {props.title}
                    </Text>

                    <View style={styles.genreContainer}>
                        {props.genre && props.genre.slice(0, 3).map((item) => (
                            <View key={item} style={styles.genreBox}>
                                <Text style={styles.genreText}>{item}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: COLORS.Black,
    },
    cardImage: {
        aspectRatio: 2 / 3,
        borderRadius: BORDERRADIUS.radius_20,
    },
    textTitle: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_24,
        color: COLORS.White,
        textAlign: 'center',
        paddingVertical: SPACING.space_10,
    },
    rateContainer: {
        flexDirection: 'row',
        gap: SPACING.space_10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.space_10,
    },
    starIcon: {
        fontSize: FONTSIZE.size_20,
        color: COLORS.Yellow,
    },
    voteText: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_14,
        color: COLORS.White,
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
        paddingVertical: SPACING.space_4,
        paddingHorizontal: SPACING.space_10,
        borderRadius: BORDERRADIUS.radius_25,
    },
    genreText: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_10,
        color: COLORS.WhiteRGBA75,
    },
});

export default MovieCard;