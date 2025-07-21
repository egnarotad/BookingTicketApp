import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AppHeader from '../components/AppHeader';
import { COLORS, SPACING } from '../theme/theme';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createMovie, updateMovie, getGenres, getStatusList } from '../api/apicalls';

const MovieForm = ({ navigation, route }) => {
  // lấy từ object movie từ bên ManageMovie truyền sang
  const paramMovie = route.params?.movie;
  const movieId = paramMovie?._id;
  const [movie, setMovie] = useState(paramMovie || null);
  // đồng bộ dữ liệu form vs UI
  const [name, setName] = useState(movie?.Name || '');
  const [director, setDirector] = useState(movie?.Director || '');
  const [genres, setGenres] = useState(movie?.Genres?.map(g => g._id) || []);
  const [allGenres, setAllGenres] = useState([]);
  const [premiere, setPremiere] = useState(movie?.Premiere ? movie.Premiere.substring(0, 10) : '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [duration, setDuration] = useState(movie?.Duration ? String(movie.Duration) : '');
  const [language, setLanguage] = useState(movie?.Language || '');
  const [description, setDescription] = useState(movie?.Description || '');
  const [trailer, setTrailer] = useState(movie?.Trailer || '');
  const [posterPath, setPosterPath] = useState(movie?.PosterPath || '');
  const [backgroundImagePath, setBackgroundImagePath] = useState(movie?.BackgroundImagePath || '');
  const [allStatus, setAllStatus] = useState([]);
  const [statusId, setStatusId] = useState(movie?.StatusID?._id || '');
  const [voteAverage, setVoteAverage] = useState(movie?.VoteAverage ? String(movie.VoteAverage) : '');
  const [voteCount, setVoteCount] = useState(movie?.VoteCount ? String(movie.VoteCount) : '');
  const [loading, setLoading] = useState(false);

  // Fetch tất cả genres và status
  useEffect(() => {
    getGenres()
      .then(data => setAllGenres(data))
      .catch(() => setAllGenres([]));
    if (movieId) {
      getStatusList()
        .then(data => setAllStatus(data))
        .catch(() => setAllStatus([]));
    }
  }, [movie]);

  // hàm save movie
  const handleSave = async () => {
    if (!name.trim() || !director.trim() || genres.length === 0 || !premiere || !duration.trim() || !language.trim() || !voteAverage.trim() || !voteCount.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    if (
      isNaN(Number(duration)) || Number(duration) <= 0 ||
      isNaN(Number(voteAverage)) || Number(voteAverage) < 0 ||
      isNaN(Number(voteCount)) || Number(voteCount) < 0
    ) {
      Alert.alert('Please enter valid positive numbers for duration, vote average, and vote count.');
      return;
    }
    setLoading(true);
    try {
      let body = {
        Name: name,
        Director: director,
        Genres: genres,
        Premiere: premiere,
        Duration: Number(duration),
        Language: language,
        Description: description,
        Trailer: trailer,
        PosterPath: posterPath,
        BackgroundImagePath: backgroundImagePath,
        StatusID: statusId,
        VoteAverage: Number(voteAverage),
        VoteCount: Number(voteCount)
      };
      if (movieId) {
        // Update movie
        await updateMovie(movieId, body);
      } else {
        // Add new movie thì lấy status active làm mặc định
        const statusActive = allStatus.find(s => s.StatusName === 'Active');
        body.StatusID = statusActive?._id;
        await createMovie(body);
      }
      navigation.navigate('ManageMovie', { reload: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      <AppHeader name="arrowleft" header="Movie Form" action={() => navigation.navigate('ManageMovie')} />
      <Text style={styles.label}>Movie Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>Director</Text>
      <TextInput style={styles.input} value={director} onChangeText={setDirector} />

      <Text style={styles.label}>Genres</Text>
      <View style={styles.genreContainer}>
        {/* render genre button by each genre */}
        {allGenres.map(g => {
          // So sánh _id dưới dạng string để đảm bảo đúng khi edit
          const idStr = g._id + '';
          // kiểm tra genre đã được chọn
          const isSelected = genres.includes(idStr);
          return (
            <TouchableOpacity
              key={g._id}
              style={[styles.genreButton, isSelected ? styles.genreButtonActive : styles.genreButtonInactive]}
              onPress={() => {
                setGenres(prev =>
                  isSelected
                    ? prev.filter(id => id !== idStr) // Bỏ chọn nếu đã chọn
                    : [...prev, idStr] // Thêm nếu chưa chọn
                );
              }}>
              <Text style={[styles.genreText, isSelected ? styles.genreTextActive : styles.genreTextInactive]}>{g.Name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Premiere</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text style={{ color: COLORS.White }}>{premiere || 'Select date'}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          // nếu đã chọn thì hiển thị còn không thì hiển thị ngày hôm nay
          value={premiere ? new Date(premiere) : new Date()}
          mode="date"
          display="default"
          // nếu chọn xong date hoặc cancel thì ẩn date picker đi
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              const today = new Date();
              // Đặt giờ phút giây về 0 để so sánh chỉ ngày
              today.setHours(0, 0, 0, 0);
              selectedDate.setHours(0, 0, 0, 0);
              if (selectedDate > today) {
                Alert.alert('Invalid Date', 'Premiere date cannot be in the future.');
                return;
              }
              // format lại định dạng
              const yyyy = selectedDate.getFullYear();
              const mm = String(selectedDate.getMonth() + 1).padStart(2, '0'); //đảm bảo chuỗi có ít nhất 2 ký tự, nếu thiếu thì thêm số 0 ở đầu
              const dd = String(selectedDate.getDate()).padStart(2, '0');
              setPremiere(`${yyyy}-${mm}-${dd}`);
            }
          }}
        />
      )}

      <Text style={styles.label}>Duration</Text>
      <TextInput style={styles.input} value={duration} onChangeText={setDuration} keyboardType="numeric" />

      <Text style={styles.label}>Language</Text>
      <TextInput style={styles.input} value={language} onChangeText={setLanguage} />

      <Text style={styles.label}>Description</Text>
      <TextInput style={[styles.input, { height: 80 }]} value={description} onChangeText={setDescription} multiline />

      <Text style={styles.label}>Trailer (URL)</Text>
      <TextInput style={styles.input} value={trailer} onChangeText={setTrailer} />

      <Text style={styles.label}>Poster Path (URL)</Text>
      <TextInput style={styles.input} value={posterPath} onChangeText={setPosterPath} />

      <Text style={styles.label}>Background Image Path (URL)</Text>
      <TextInput style={styles.input} value={backgroundImagePath} onChangeText={setBackgroundImagePath} />

      {/* Status chỉ hiện khi edit */}
      {movieId && (
        <>
          <Text style={styles.label}>Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={statusId}
              style={{ color: COLORS.White }}
              dropdownIconColor={COLORS.White}
              onValueChange={v => setStatusId(v)}>
              <Picker.Item label="Select status" value="" />
              {allStatus
                .filter(s => s.StatusName === 'Active' || s.StatusName === 'Inactive' || s.StatusName === 'Upcoming')
                .map((s) => (
                  <Picker.Item key={s._id} label={s.StatusName} value={s._id} />
                ))}
            </Picker>
          </View>
        </>
      )}

      <Text style={styles.label}>Vote Average</Text>
      <TextInput style={styles.input} value={voteAverage} onChangeText={setVoteAverage} keyboardType="numeric" />

      <Text style={styles.label}>Vote Count</Text>
      <TextInput style={styles.input} value={voteCount} onChangeText={setVoteCount} keyboardType="numeric" />

      <View style={styles.saveButtonWrapper}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Black,
    padding: SPACING.space_20,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  label: {
    color: COLORS.White,
    marginTop: SPACING.space_12,
  },
  input: {
    backgroundColor: COLORS.Grey,
    color: COLORS.White,
    borderRadius: 8,
    marginTop: 4,
    padding: 8,
  },
  pickerContainer: {
    backgroundColor: COLORS.Grey,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 8,
    padding: 8,
  },
  pickerContainerSmall: {
    backgroundColor: COLORS.Grey,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 8,
    padding: 0,
    height: 40,
    justifyContent: 'center',
  },
  pickerSmall: {
    color: COLORS.White,
    height: 36,
    fontSize: 14,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  genreButton: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  genreButtonActive: {
    backgroundColor: COLORS.Orange,
    borderColor: COLORS.Orange,
  },
  genreButtonInactive: {
    backgroundColor: COLORS.Grey,
    borderColor: COLORS.WhiteRGBA50,
  },
  genreText: {
    fontWeight: 'bold',
  },
  genreTextActive: {
    color: COLORS.White,
  },
  genreTextInactive: {
    color: COLORS.WhiteRGBA75,
  },
  saveButtonWrapper: {
    paddingBottom: 24,
    backgroundColor: COLORS.Black,
  },
  saveButton: {
    backgroundColor: COLORS.Orange,
    marginTop: 24,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.White,
    fontWeight: 'bold',
  },
});

export default MovieForm;
