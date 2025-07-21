import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, FlatList, } from 'react-native';
import { COLORS, SPACING } from '../theme/theme';
import InputHeader from '../components/InputHeader';
import SubMovieCard from '../components/SubMovieCard';
import { searchMovies } from '../api/apicalls';

const { width, height } = Dimensions.get('screen');

const SearchScreen = ({ navigation }) => {
  const [searchList, setSearchList] = useState([]);

  const searchMoviesFunction = async (name) => {
    try {
      const result = await searchMovies(name);
      setSearchList(result); // backend trả về array movie
    } catch (error) {
      console.error('Something went wrong in searchMoviesFunction ', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <View>
        <FlatList
          data={searchList}
          keyExtractor={(item) => item._id}
          bounces={false}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.InputHeaderContainer}>
              <InputHeader searchFunction={searchMoviesFunction} />
            </View>
          }
          contentContainerStyle={styles.centerContainer}
          renderItem={({ item, index }) => (
            <SubMovieCard
              shoudlMarginatedAtEnd={false}
              shouldMarginatedAround={true}
              cardFunction={() => {
                navigation.push('MovieDetails', { movieid: item._id });
              }}
              cardWidth={width / 2 - SPACING.space_12 * 2}
              title={item.Name}
              imagePath={item.PosterPath}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    width,
    alignItems: 'center',
    backgroundColor: COLORS.Black,
  },
  InputHeaderContainer: {
    display: 'flex',
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_28,
    marginBottom: SPACING.space_28 - SPACING.space_12,
  },
  centerContainer: {
    alignItems: 'center',
  },
});

export default SearchScreen;