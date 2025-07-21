import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import AntDesign from 'react-native-vector-icons/AntDesign';

const PasswordInput = ({ value, onChangeText, placeholder = 'Enter your password' }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [show, setShow] = useState(false);
    
    return (
        <View style={{ marginBottom: SPACING.space_20 }}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={[
                styles.inputContainer,
                isFocused && { borderColor: COLORS.Orange },
            ]}>
                <AntDesign name="lock" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.WhiteRGBA50}
                    secureTextEntry={!show}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShow(!show)}>
                    <AntDesign name={show ? 'eye' : 'eyeo'} style={styles.inputIcon} />
                </TouchableOpacity>
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

export default PasswordInput; 