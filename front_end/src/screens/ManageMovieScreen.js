import React, { useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AppHeader from '../components/AppHeader';
import AdminListItem from '../components/AdminListItem';
import { COLORS, SPACING } from '../theme/theme';
import { useFocusEffect } from '@react-navigation/native';
import { getMovies, getStatusList, updateMovie } from '../api/apicalls';

const ManageMovieScreen = ({ navigation, route }) => { // props của react navigation 
  const [movies, setMovies] = useState([]);

  // hàm lấy movie từ db
  const fetchMovies = () => {
    // call api getMovie
    getMovies()
      .then(data => {
        // sort by createdAt and save to state
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMovies(data);
      })
      .catch(() => setMovies([]));
  };

  useFocusEffect(
    // dùng callback để kiểm soát dependency
    useCallback(() => {
      fetchMovies();
      // Nếu có param reload, reset lại để tránh fetch lặp
      if (route.params?.reload) {
        navigation.setParams({ reload: false });
      }
    }, [route.params?.reload])
  );

  return (
    <View style={styles.container}>
      <View style={styles.appHeaderContainer}>
        <AppHeader name="close" header="Manage Movies" action={() => navigation.navigate('Tab', { screen: 'User' })} />
      </View>
      <FlatList
        data={movies}
        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => {
          // nếu có statusID thì hiển thị status name
          const statusName = item.StatusID && item.StatusID.StatusName;
          return (
            <AdminListItem
              title={item.Name}
              subtitle={item.Director}
              status={statusName}
              // truyền toàn bộ các thành phần của movie tương ứng khi chọn edit
              onEdit={() => navigation.navigate('MovieForm', { movie: item })}
              deleteLabel={''} // Không hiển thị nút Delete
            />
          );
        }}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('MovieForm')}>
        <Text style={styles.addButtonText}>Add Movie</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  addButton: {
    backgroundColor: COLORS.Orange,
    padding: SPACING.space_12,
    borderRadius: 20,
    alignItems: 'center',
    margin: SPACING.space_20,
  },
  addButtonText: {
    color: COLORS.White,
    fontWeight: 'bold',
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20 * 2,
  },
});

export default ManageMovieScreen;
