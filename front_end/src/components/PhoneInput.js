import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import AntDesign from 'react-native-vector-icons/AntDesign';

const PhoneInput = ({ value, onChangeText }) => {
    const [isFocused, setIsFocused] = useState(false);
    
    return (
        <View style={{ marginBottom: SPACING.space_20 }}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={[
                styles.inputContainer,
                isFocused && { borderColor: COLORS.Orange },
            ]}>
                <AntDesign name="phone" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Enter your phone number"
                    placeholderTextColor={COLORS.WhiteRGBA50}
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    autoCapitalize="none"
                />
            </View>
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

export default PhoneInput; 