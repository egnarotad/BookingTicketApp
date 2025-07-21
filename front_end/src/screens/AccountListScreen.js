import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AppHeader from '../components/AppHeader';
import { COLORS, SPACING } from '../theme/theme';
import { getAccounts } from '../api/apicalls';

const AccountListScreen = ({ navigation }) => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getAccounts()
            .then(data => {
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setAccounts(data);
            })
            .catch(() => setAccounts([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <View style={styles.container}>
            <AppHeader header="Account List" name="close" action={() => navigation.goBack()} />
            <View style={{ height: 16 }} />
            <FlatList
                data={accounts}
                keyExtractor={item => item._id}
                refreshing={loading}
                onRefresh={() => {
                    setLoading(true);
                    getAccounts()
                        .then(data => {
                            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                            setAccounts(data);
                        })
                        .catch(() => setAccounts([]))
                        .finally(() => setLoading(false));
                }}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.title}>UserID: {item._id}</Text>
                        <Text style={styles.sub}>Role: {item.Role || ''}</Text>
                        <Text style={styles.sub}>Status: {typeof item.StatusID === 'object' ? item.StatusID.StatusName : item.StatusID || ''}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.Black,
        padding: SPACING.space_20
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
        arginTop: 2
    },
});

export default AccountListScreen; 