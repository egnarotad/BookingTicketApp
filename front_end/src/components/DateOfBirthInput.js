import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import AntDesign from 'react-native-vector-icons/AntDesign';

const DateOfBirthInput = ({ value, onDateInputPress, showDatePicker, onDatePickerChange }) => {
    // Tạo hàm wrapper để validate ngày không vượt quá hiện tại
    const handleDatePickerChange = (event, selectedDate) => {
        if (selectedDate) {
            const today = new Date();
            today.setHours(0,0,0,0);
            selectedDate.setHours(0,0,0,0);
            if (selectedDate > today) {
                // Báo lỗi nếu ngày vượt quá hiện tại
                Alert.alert('Invalid Date', 'Date of birth cannot be in the future.');
                // Không gọi callback nếu ngày không hợp lệ
                return;
            }
        }
        // Gọi callback gốc nếu hợp lệ
        if (onDatePickerChange) onDatePickerChange(event, selectedDate);
    };
    return (
        <View style={{ marginBottom: SPACING.space_20 }}>
            <Text style={styles.inputLabel}>Date of Birth</Text>
            <TouchableOpacity onPress={onDateInputPress} activeOpacity={0.7}>
                <View style={styles.inputContainer}>
                    <AntDesign name="calendar" style={styles.inputIcon} />
                    <Text style={[styles.input, { color: value ? COLORS.White : COLORS.WhiteRGBA50 }]}>
                        {value ? value : 'Select your date of birth'}
                    </Text>
                </View>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDatePickerChange}
                    maximumDate={new Date()}
                />
            )}
        </View>
    );
};

const styles = {
    inputLabel: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_14,
        color: COLORS.WhiteRGBA75,
        marginBottom: SPACING.space_8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.WhiteRGBA32,
        borderRadius: SPACING.space_10,
        paddingHorizontal: SPACING.space_10,
        backgroundColor: COLORS.DarkGrey,
        height: 44,
    },
    inputIcon: {
        fontSize: FONTSIZE.size_18,
        color: COLORS.WhiteRGBA50,
        marginRight: SPACING.space_10,
    },
    input: {
        flex: 1,
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_14,
        color: COLORS.White,
    },
};

export default DateOfBirthInput; 