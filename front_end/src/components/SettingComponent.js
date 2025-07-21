import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import AntDesign from 'react-native-vector-icons/AntDesign';

const SettingComponent = ({
    icon,
    heading,
    subheading,
    onPress,
}) => {
    // Hàm render icon chính
    const renderIcon = () => {
        return <AntDesign name={icon} style={styles.iconStyle} />;
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View>
                {renderIcon()}
            </View>
            <View style={styles.settingContainer}>
                <Text style={styles.title}>{heading}</Text>
                <Text style={styles.subtitle}>{subheading}</Text>
            </View>
            <View style={styles.iconBG}>
                <AntDesign name={'arrowright'} style={styles.iconStyle} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: SPACING.space_20,
    },
    settingContainer: {
        flex: 1,
    },
    iconStyle: {
        color: COLORS.White,
        fontSize: FONTSIZE.size_24,
        paddingHorizontal: SPACING.space_20,
    },
    iconBG: {
        justifyContent: 'center',
    },
    title: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_18,
        color: COLORS.White,
    },
    subtitle: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_14,
        color: COLORS.WhiteRGBA15,
    },
});

export default SettingComponent;
