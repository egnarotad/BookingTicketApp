import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AppHeader from '../components/AppHeader';
import { COLORS, SPACING } from '../theme/theme';
import { getScreenings } from '../api/apicalls';

const ManageScreenings = ({ navigation }) => {
    const [screenings, setScreenings] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchScreenings = async () => {
        setLoading(true);
        try {
            const data = await getScreenings();
            // Sắp xếp screening mới nhất lên đầu theo createdAt
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setScreenings(data);
        } catch {
            setScreenings([]);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchScreenings();
        }, [])
    );

    return (
        <View style={styles.container}>
            <AppHeader header="Manage Screenings" name="close" action={() => navigation.goBack()} />
            <View style={{ height: 16 }} />
            <FlatList
                data={screenings}
                keyExtractor={item => item._id}
                refreshing={loading}
                onRefresh={fetchScreenings}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.title}>{item.MovieID?.Name || 'No Movie'}</Text>
                        <Text style={styles.sub}>{item.RoomID?.Name || ''} | {item.ScreenTypeID?.TypeName || ''}</Text>
                        <Text style={styles.sub}>Time: {item.TimeSlotID?.Time || ''}</Text>
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => navigation.navigate('ScreeningForm', { screening: item, reload: fetchScreenings })}><Text style={styles.edit}>Edit</Text></TouchableOpacity>
                        </View>
                    </View>
                )}
            />
            <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('ScreeningForm', { reload: fetchScreenings })}>
                <Text style={styles.addBtnText}>Add Screening</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.Black,
        padding: SPACING.space_20
    },
    addBtn: {
        backgroundColor: COLORS.Orange,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16
    },
    addBtnText: {
        color: COLORS.White,
        fontWeight: 'bold'
    },
    item: {
        backgroundColor: COLORS.Grey,
        borderRadius: 8,
        marginBottom: 16,
        padding: 16
    },
    title: {
        color: COLORS.White,
        fontWeight: 'bold',
        fontSize: 16
    },
    sub: {
        color: COLORS.WhiteRGBA75,
        marginTop: 2
    },
    actions: {
        flexDirection: 'row',
        marginTop: 8,
        gap: 16
    },
    edit: {
        color: COLORS.Orange,
        marginRight: 16
    },
    delete: {
        color: 'red'
    },
});

export default ManageScreenings; 