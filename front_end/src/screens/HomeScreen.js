import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, ScrollView, StatusBar, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SPACING } from '../theme/theme';
import { getActiveMovies, getUpcomingMovies } from '../api/apicalls';
import CategoryHeader from '../components/CategoryHeader';
import SubMovieCard from '../components/SubMovieCard';
import MovieCard from '../components/MovieCard';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation, route }) => {
    const role = route?.params?.role;
    const [moviesList, setMoviesList] = useState(undefined);
    const [upcomingMovies, setUpcomingMovies] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            (async () => {
                setLoading(true);
                const [active, upcoming] = await Promise.all([
                    getActiveMovies(),
                    getUpcomingMovies()
                ]);
                if (isActive) {
                    setMoviesList(active);
                    setUpcomingMovies(upcoming);
                    setLoading(false);
                }
            })();
            return () => { isActive = false; };
        }, [])
    );

    if (loading || !moviesList || !upcomingMovies) {
        return (
            <ScrollView
                style={styles.container}
                bounces={false}
                contentContainerStyle={styles.scrollViewContainer}>
                <StatusBar hidden />

                <View style={styles.loadingContainer}>
                    <ActivityIndicator size={'large'} color={COLORS.Orange} />
                </View>
            </ScrollView>
        );
    }

    // Now Playing: active movies, sort theo createdAt mới nhất
    const nowPlayingMovies = [...moviesList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    // Popular: sort theo VoteAverage giảm dần
    const popularMovies = [...moviesList].sort((a, b) => b.VoteAverage - a.VoteAverage);

    return (
        <ScrollView style={styles.container} bounces={false}>
            <StatusBar hidden />

            <CategoryHeader title={'Now Playing'} />
            <FlatList
                data={nowPlayingMovies}
                keyExtractor={(item) => item._id}
                bounces={false}
                snapToInterval={width * 0.7 + SPACING.space_36}
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate={0}
                contentContainerStyle={styles.containerGap36}
                renderItem={({ item, index }) => (
                    <MovieCard
                        shoudlMarginatedAtEnd={true}
                        cardFunction={() => {
                            navigation.push('MovieDetails', { movieid: item._id, role });
                        }}
                        cardWidth={width * 0.7}
                        isFirst={index == 0 ? true : false}
                        isLast={index == nowPlayingMovies.length - 1 ? true : false}
                        title={item.Name}
                        imagePath={item.PosterPath}
                        genre={Array.isArray(item.Genres) ? item.Genres.map(g => g.Name) : []}
                        vote_average={item.VoteAverage}
                        vote_count={item.VoteCount}
                    />
                )}
            />
            <CategoryHeader title={'Popular'} />
            <FlatList
                data={popularMovies}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={styles.containerGap36}
                renderItem={({ item, index }) => (
                    <SubMovieCard
                        shoudlMarginatedAtEnd={true}
                        cardFunction={() => {
                            navigation.push('MovieDetails', { movieid: item._id, role });
                        }}
                        cardWidth={width / 3}
                        isFirst={index == 0 ? true : false}
                        isLast={index == popularMovies.length - 1 ? true : false}
                        title={item.Name}
                        imagePath={item.PosterPath}
                    />
                )}
            />
            <CategoryHeader title={'Upcoming'} />
            <FlatList
                data={upcomingMovies}
                keyExtractor={(item) => item._id}
                horizontal
                bounces={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.containerGap36}
                renderItem={({ item, index }) => (
                    <SubMovieCard
                        shoudlMarginatedAtEnd={true}
                        cardFunction={() => {
                            navigation.push('MovieDetails', { movieid: item._id, role });
                        }}
                        cardWidth={width / 3}
                        isFirst={index == 0 ? true : false}
                        isLast={index == upcomingMovies.length - 1 ? true : false}
                        title={item.Name}
                        imagePath={item.PosterPath}
                    />
                )}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        backgroundColor: COLORS.Black,
    },
    scrollViewContainer: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    InputHeaderContainer: {
        marginHorizontal: SPACING.space_36,
        marginTop: SPACING.space_28,
    },
    containerGap36: {
        gap: SPACING.space_36,
    },
});

export default HomeScreen;