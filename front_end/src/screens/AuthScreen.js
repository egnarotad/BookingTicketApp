import React, { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import AppHeader from '../components/AppHeader';
import { useAuth } from '../context/AuthContext';
import { getPlaces, loginAccount, registerAccount, getStatusList } from '../api/apicalls';
import PhoneInput from '../components/PhoneInput';
import PasswordInput from '../components/PasswordInput';
import NameInput from '../components/NameInput';
import EmailInput from '../components/EmailInput';
import DateOfBirthInput from '../components/DateOfBirthInput';
import PlaceInput from '../components/PlaceInput';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AuthScreen = ({ navigation }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [error, setError] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState('');
    const [allStatus, setAllStatus] = useState([]);
    const { login } = useAuth();

    useEffect(() => {
        getStatusList()
            .then(data => setAllStatus(data))
            .catch(() => setAllStatus([]));
    }, []);
    // Clear error khi user thay đổi input
    const clearError = () => {
        if (error) setError('');
    };

    // Wrapper functions để clear error khi thay đổi input
    const handlePhoneChange = (text) => {
        setPhone(text);
        clearError();
    };

    const handleEmailChange = (text) => {
        setEmail(text);
        clearError();
    };

    const handleNameChange = (text) => {
        setName(text);
        clearError();
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
        clearError();
    };

    const handleConfirmPasswordChange = (text) => {
        setConfirmPassword(text);
        clearError();
    };

    const handlePlaceChange = (value) => {
        setSelectedPlace(value);
        clearError();
    };

    useEffect(() => {
        if (!isLogin) {
            getPlaces()
                .then(data => setPlaces(data))
                .catch(() => setPlaces([]));
        }
    }, [isLogin]);

    const handleAuth = async () => {
        setError('');
        if (isLogin) {
            try {
                const { ok, data } = await loginAccount(phone.trim(), password);
                if (ok) {
                    await login(data.role, data.userId, data.token);
                    navigation.replace('Tab');
                } else {
                    setError(data.message || 'Login failed!');
                }
            } catch (err) {
                setError('Cannot connect to server!');
            }
        } else {
            // Đăng ký: kiểm tra các trường mới
            if (!name.trim() || !email.trim() || !dob || !phone.trim() || !password || !confirmPassword || !selectedPlace) {
                setError('Please fill all fields!');
                return;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match!');
                return;
            }
            try {
                const statusActive = allStatus.find(s => s.StatusName === 'Active');
                const { ok, data } = await registerAccount({
                    name: name.trim(),
                    mail: email.trim(),
                    dob,
                    phone: phone.trim(),
                    placeId: selectedPlace,
                    password,
                    statusId: statusActive?._id 
                });
                if (ok) {
                    // Đăng ký thành công, tự động đăng nhập
                    const { ok: loginOk, data: loginData } = await loginAccount(phone.trim(), password);
                    if (loginOk) {
                        await login(loginData.role, loginData.userId, loginData.token);
                        navigation.replace('Tab');
                    } else {
                        setError(loginData.message || 'Login failed after register!');
                    }
                } else {
                    // Hiển thị message lỗi chính xác từ backend
                    setError(data.message || 'Register failed!');
                }
            } catch (err) {
                setError('Cannot connect to server!');
            }
        }
    };

    // Date picker logic
    const handleDateInputPress = () => {
        setShowDatePicker(true);
    };
    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            selectedDate.setHours(0, 0, 0, 0);
            if (selectedDate > today) {
                // Báo lỗi nếu ngày vượt quá hiện tại
                Alert.alert('Invalid Date', 'Date of birth cannot be in the future.');
                return;
            }
            // Format date to YYYY-MM-DD
            const yyyy = selectedDate.getFullYear();
            const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const dd = String(selectedDate.getDate()).padStart(2, '0');
            setDob(`${yyyy}-${mm}-${dd}`);
            clearError(); // Clear error khi chọn date
        }
    };

    return (
        <ImageBackground
            source={require('../assets/images/bgimage.jpeg')}
            style={styles.background}
            resizeMode="cover"
            blurRadius={2}
        >
            <StatusBar barStyle={'light-content'} />
            <View style={styles.appHeaderContainer}>
                <AppHeader
                    name="close"
                    header={''}
                    action={() => navigation.replace('Tab')}
                />
            </View>
            <ScrollView contentContainerStyle={styles.scrollviewFlex} keyboardShouldPersistTaps="handled">
                <View style={[styles.authBox, { width: SCREEN_WIDTH > 500 ? 400 : SCREEN_WIDTH * 0.9 }]}>
                    <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>

                    {/* Các trường khác xuất hiện khi là Register */}
                    {!isLogin && (
                        <NameInput value={name} onChangeText={handleNameChange} />
                    )}

                    {/* Cả login và register đều có phone input */}
                    <PhoneInput value={phone} onChangeText={handlePhoneChange} />

                    {!isLogin && (
                        <EmailInput value={email} onChangeText={handleEmailChange} />
                    )}

                    {!isLogin && (
                        <DateOfBirthInput
                            value={dob}
                            onDateInputPress={handleDateInputPress}
                            showDatePicker={showDatePicker}
                            onDatePickerChange={handleDateChange}
                        />
                    )}

                    {!isLogin && (
                        <PlaceInput value={selectedPlace} onChangeText={handlePlaceChange} places={places} />
                    )}

                    {/* Cả login và register đều có password */}
                    <PasswordInput value={password} onChangeText={handlePasswordChange} />

                    {!isLogin && (
                        <PasswordInput
                            value={confirmPassword}
                            onChangeText={handleConfirmPasswordChange}
                            placeholder="Confirm your password"
                        />
                    )}

                    <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
                        <Text style={styles.authButtonText}>{isLogin ? 'Login' : 'Register'}</Text>
                    </TouchableOpacity>

                    {error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : null}

                    <TouchableOpacity onPress={() => {
                        setIsLogin(!isLogin);
                        setError(''); // Clear error khi chuyển mode
                    }} style={styles.switchButton}>
                        <Text style={styles.switchText}>
                            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollviewFlex: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: SCREEN_HEIGHT,
    },
    authBox: {
        backgroundColor: COLORS.Black + 'CC', // semi-transparent black
        borderRadius: SPACING.space_20,
        borderWidth: 1,
        borderColor: COLORS.WhiteRGBA32,
        padding: SPACING.space_24,
        alignItems: 'stretch',
        shadowColor: COLORS.Black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    title: {
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_24,
        color: COLORS.White,
        textAlign: 'center',
        marginBottom: SPACING.space_24,
    },
    authButton: {
        backgroundColor: COLORS.Orange,
        paddingVertical: SPACING.space_10,
        borderRadius: SPACING.space_10,
        alignItems: 'center',
        marginTop: SPACING.space_10,
    },
    authButtonText: {
        fontFamily: FONTFAMILY.poppins_bold,
        fontSize: FONTSIZE.size_16,
        color: COLORS.White,
    },
    switchButton: {
        marginTop: SPACING.space_10,
    },
    switchText: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_14,
        color: COLORS.White,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    errorText: {
        color: '#ff4d4f',
        textAlign: 'center',
        marginTop: 8,
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_14,
    },
    appHeaderContainer: {
        marginHorizontal: SPACING.space_36,
        marginTop: SPACING.space_20 * 2,
        alignItems: 'flex-start',
    },
});

export default AuthScreen; 