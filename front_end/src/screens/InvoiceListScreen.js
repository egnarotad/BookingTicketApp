import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AppHeader from '../components/AppHeader';
import { COLORS, SPACING } from '../theme/theme';
import { getInvoices } from '../api/apicalls';
import TicketDetail from '../components/TicketDetail';

const InvoiceListScreen = ({ navigation }) => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getInvoices()
            .then(data => {
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setInvoices(data);
            })
            .catch(() => setInvoices([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <View style={styles.container}>
            <AppHeader header="Invoice List" name="close" action={() => navigation.goBack()} />
            <View style={{ height: 16 }} />
            <FlatList
                data={invoices}
                keyExtractor={item => item._id}
                refreshing={loading}
                onRefresh={() => {
                    setLoading(true);
                    getInvoices()
                        .then(data => {
                            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                            setInvoices(data);
                        })
                        .catch(() => setInvoices([]))
                        .finally(() => setLoading(false));
                }}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.title}>InvoiceID: {item._id}</Text>
                        <Text style={styles.sub}>User: {item.UserID?.Name || item.UserID?._id || 'N/A'}</Text>
                        <Text style={styles.sub}>Total: ${item.TotalPrice}</Text>
                        {item.TicketID && <TicketDetail ticket={item.TicketID} />}
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
        marginTop: 2
    },
    ticket: {
        color: COLORS.White,
        marginLeft: 8,
        fontSize: 13
    },
});

export default InvoiceListScreen; 