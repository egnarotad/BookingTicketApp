import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert, TextInput, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import AppHeader from '../components/AppHeader';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';
import { getUserById, updateUser, uploadAvatar, deleteAvatar, getPlaces } from '../api/apicalls';

// Thêm hàm xin quyền truy cập ảnh cho Android
async function requestGalleryPermission() {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: 'App cần truy cập ảnh',
          message: 'Ứng dụng cần quyền truy cập ảnh để chọn avatar.',
          buttonNeutral: 'Hỏi lại sau',
          buttonNegative: 'Từ chối',
          buttonPositive: 'Đồng ý',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
}

const ProfileDetailScreen = ({ navigation }) => {
  const { userId } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (userId) {
      getUserById(userId)
        .then(data => {
          setProfile(data);
          setForm({
            name: data.Name,
            dob: data.DateofBirth ? data.DateofBirth.substring(0, 10) : '',
            mail: data.Mail,
            phone: data.PhoneNumber,
            placeId: data.PlaceID?._id,
            avatar: data.avatar
          });
          setLoading(false);
        })
        .catch(() => setLoading(false));
      getPlaces()
        .then(data => setPlaces(data))
        .catch(() => setPlaces([]));
    }
  }, [userId]);

  const handleUpdate = async () => {
    try {
      const { ok, data } = await updateUser(userId, form);
      if (ok) {
        // Fetch lại user từ backend để lấy PlaceID mới nhất
        const userData = await getUserById(userId);
        setProfile(userData);
        setForm({
          name: userData.Name,
          dob: userData.DateofBirth ? userData.DateofBirth.substring(0, 10) : '',
          mail: userData.Mail,
          phone: userData.PhoneNumber,
          placeId: userData.PlaceID?._id,
          avatar: userData.avatar
        });
        setEdit(false);
      } else {
        alert(data.message || 'Update failed!');
      }
    } catch (err) {
      alert('Cannot connect to server!');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={COLORS.Orange} size="large" />
      </View>
    );
  }
  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No profile data</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <AppHeader
        name="close"
        header="Profile"
        action={() => navigation.goBack()}
      />
      <View style={styles.profileContainer}>
        <Image
          source={
            (edit ? form.avatar : profile.avatar) && (edit ? form.avatar : profile.avatar) !== '/images/default_avatar.jpg'
              ? { uri: edit ? form.avatar : profile.avatar }
              : require('../assets/images/default_avatar.jpg')
          }
          style={styles.avatar}
        />
        {edit ? (
          <>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={v => setForm({ ...form, name: v })}
            />
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
              <View style={styles.inputContainer}>
                <Text style={[styles.input, { color: form.dob ? COLORS.White : COLORS.WhiteRGBA50, marginBottom: 0 }]}>
                  {form.dob ? form.dob : 'Select your date of birth'}
                </Text>
              </View>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={form.dob ? new Date(form.dob) : new Date(2000, 0, 1)}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    const today = new Date();
                    today.setHours(0,0,0,0);
                    selectedDate.setHours(0,0,0,0);
                    if (selectedDate > today) {
                      Alert.alert('Invalid Date', 'Date of birth cannot be in the future.');
                      return;
                    }
                    const yyyy = selectedDate.getFullYear();
                    const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                    const dd = String(selectedDate.getDate()).padStart(2, '0');
                    setForm({ ...form, dob: `${yyyy}-${mm}-${dd}` });
                  }
                }}
                maximumDate={new Date()}
              />
            )}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={form.mail}
              onChangeText={v => setForm({ ...form, mail: v })}
            />
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={form.phone}
              onChangeText={v => setForm({ ...form, phone: v })}
            />
            <Text style={styles.label}>Place</Text>
            <View style={styles.inputContainer}>
              <Picker
                selectedValue={form.placeId}
                style={{ flex: 1, color: COLORS.White }}
                dropdownIconColor={COLORS.White}
                onValueChange={v => setForm({ ...form, placeId: v })}>
                <Picker.Item label="Select place" value="" />
                {places.map((place) => (
                  <Picker.Item key={place._id} label={place.Name} value={place._id} />
                ))}
              </Picker>
            </View>
            <Text style={styles.label}>Avatar</Text>
            <TouchableOpacity
              style={[styles.inputContainer, { justifyContent: 'center', alignItems: 'center', marginBottom: 16 }]}
              onPress={async () => {
                // Xóa avatar cũ nếu là URL server
                if (profile && profile.avatar && profile.avatar.startsWith('http') && profile.avatar.includes('/uploads/')) {
                  try {
                    await deleteAvatar(profile.avatar);
                  } catch (err) {
                    console.log('Delete old avatar error:', err);
                  }
                }
                const hasPermission = await requestGalleryPermission();
                if (!hasPermission) {
                  alert('Bạn cần cấp quyền truy cập ảnh để chọn avatar!');
                  return;
                }
                const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
                if (result.assets && result.assets.length > 0) {
                  const file = result.assets[0];
                  const formData = new FormData();
                  formData.append('avatar', {
                    uri: file.uri,
                    type: file.type,
                    name: file.fileName || 'avatar.jpg',
                  });
                  const data = await uploadAvatar(formData);
                  if (data.url) {
                    setForm({ ...form, avatar: data.url });
                    if (edit) setProfile({ ...profile, avatar: data.url });
                  }
                } else if (result.didCancel) {
                  // Người dùng hủy chọn ảnh, không làm gì cả
                } else if (result.errorCode) {
                  alert('Error picking image: ' + result.errorMessage);
                }
              }}
            >
              <Text style={{ color: COLORS.White }}>{form.avatar ? 'Change Avatar' : 'Select Avatar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { marginTop: 16 }]} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.Grey }]} onPress={() => setEdit(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.name}>{profile.Name}</Text>
            <Text style={styles.role}>{profile.Role === 'user' ? 'User' : ''}</Text>
            <View style={styles.infoRowAligned}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{profile.Mail}</Text>
            </View>
            <View style={styles.infoRowAligned}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{profile.PhoneNumber}</Text>
            </View>
            <View style={styles.infoRowAligned}>
              <Text style={styles.label}>Place:</Text>
              <Text style={styles.value}>{profile.PlaceID?.Name}</Text>
            </View>
            <TouchableOpacity style={[styles.button, { marginTop: 16 }]} onPress={() => setEdit(true)}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Black,
    padding: SPACING.space_24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.Black,
  },
  errorText: {
    color: COLORS.Orange,
    fontSize: FONTSIZE.size_16,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: SPACING.space_36,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SPACING.space_16,
  },
  name: {
    color: COLORS.White,
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: FONTSIZE.size_20,
    marginBottom: SPACING.space_8,
  },
  role: {
    color: COLORS.Orange,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    marginBottom: SPACING.space_16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: SPACING.space_8,
  },
  infoRowAligned: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.space_8,
    width: '100%',
  },
  label: {
    color: COLORS.Grey,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    alignSelf: 'flex-start',
    marginBottom: 4,
    textAlign: 'left',
  },
  value: {
    color: COLORS.White,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    flex: 1,
    textAlign: 'left',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.Grey,
    borderRadius: 8,
    paddingHorizontal: SPACING.space_16,
    color: COLORS.White,
    marginBottom: SPACING.space_16,
    textAlignVertical: 'center',
    fontSize: FONTSIZE.size_14,
    fontFamily: FONTFAMILY.poppins_regular,
  },
  inputContainer: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.Grey,
    borderRadius: 8,
    marginBottom: SPACING.space_16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.space_16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.Orange,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.space_16,
  },
  buttonText: {
    color: COLORS.White,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
  },
});

export default ProfileDetailScreen;
