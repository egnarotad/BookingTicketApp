import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import AntDesign from 'react-native-vector-icons/AntDesign';

const AppHeader = (props) => { //props gồm 3 thuộc tính là name, header và action
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.iconBG} onPress={() => props.action()}>
                <AntDesign name={props.name} style={styles.iconStyle} />
            </TouchableOpacity>
            <Text style={styles.headerText}>{props.header}</Text>
            <View style={styles.emptyContainer}></View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconStyle: {
        color: COLORS.White,
        fontSize: FONTSIZE.size_24,
    },
    headerText: {
        flex: 1,
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_20,
        textAlign: 'center',
        color: COLORS.White,
    },
    emptyContainer: {
        height: SPACING.space_20 * 2,
        width: SPACING.space_20 * 2,
    },
    iconBG: {
        height: SPACING.space_20 * 2,
        width: SPACING.space_20 * 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BORDERRADIUS.radius_20,
        backgroundColor: COLORS.Orange,
    },
});

export default AppHeader;