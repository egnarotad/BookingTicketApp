import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';

const PlaceInput = ({ value, onChangeText, places }) => {
    return (
        <View style={{ marginBottom: SPACING.space_20 }}>
            <Text style={styles.inputLabel}>Place</Text>
            <View style={styles.inputContainer}>
                <Picker
                    selectedValue={value}
                    style={{ flex: 1, color: COLORS.White }}
                    dropdownIconColor={COLORS.White}
                    onValueChange={onChangeText}>
                    <Picker.Item label="Select place" value="" />
                    {places.map((place) => (
                        <Picker.Item key={place._id} label={place.Name} value={place._id} />
                    ))}
                </Picker>
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
};

export default PlaceInput; 