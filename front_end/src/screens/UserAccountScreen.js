import React, { useState, useCallback } from 'react';
import { Text, View, StyleSheet, StatusBar, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import AppHeader from '../components/AppHeader';
import SettingComponent from '../components/SettingComponent';
import { useAuth } from '../context/AuthContext';
import { getUserById } from '../api/apicalls';

const UserAccountScreen = ({ navigation }) => {
    const { role, userId, logout } = useAuth();
    const [user, setUser] = useState(null);
    // Sử dụng useFocusEffect để luôn fetch lại user khi màn hình được focus
    useFocusEffect(
        useCallback(() => {
            if (userId) {
                getUserById(userId)
                    .then(data => setUser(data))
                    .catch(() => setUser(null));
            }
        }, [userId])
    );
    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <View style={styles.appHeaderContainer}>
                <AppHeader
                    name="close"
                    header={'My Profile'}
                    action={() => navigation.goBack()}
                />
            </View>
            <View style={styles.profileContainer}>
                <Image
                    source={user && user.avatar && user.avatar !== '/images/default_avatar.jpg' ? { uri: user.avatar } : require('../assets/images/default_avatar.jpg')}
                    style={styles.avatarImage}
                />
                {user && user.Name ? (
                    <Text style={styles.avatarText}>{user.Name}</Text>
                ) : null}
            </View>
            <View style={styles.profileContainer}>
                {!role && (
                    <SettingComponent
                        icon="login"
                        heading="Login"
                        subheading="Sign in your account"
                        onPress={() => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Auth' }],
                            });
                        }}
                    />
                )}
                {role === 'user' && (
                    <>
                        <SettingComponent
                            icon="user"
                            heading="Account"
                            subheading="Edit Profile"
                            onPress={() => navigation.push('ProfileDetail', { userId })}
                        />
                        <SettingComponent
                            icon="closecircle"
                            heading="Logout"
                            subheading="Sign out of your account"
                            onPress={async () => {
                                await logout();
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Auth' }],
                                });
                            }}
                        />
                    </>
                )}
                {role === 'admin' && (
                    <>
                        <SettingComponent
                            icon="user"
                            heading="Accounts"
                            subheading="View All Accounts"
                            onPress={() => navigation.navigate('AccountList')}
                        />
                        <SettingComponent
                            icon="creditcard"
                            heading="Invoices"
                            subheading="View All Invoices"
                            onPress={() => navigation.navigate('InvoiceList')}
                        />
                        <SettingComponent
                            icon="youtube"
                            heading="Movies"
                            subheading="Manage Movies"
                            onPress={() => navigation.navigate('ManageMovie')}
                        />
                        <SettingComponent
                            icon="videocamera"
                            heading="Rooms"
                            subheading="View Room List and Add Seats"
                            onPress={() => navigation.navigate('ManageRooms')}
                        />
                        <SettingComponent
                            icon="calendar"
                            heading="Screenings"
                            subheading="Manage Screenings"
                            onPress={() => navigation.navigate('ManageScreenings')}
                        />
                        <SettingComponent
                            icon="closecircle"
                            heading="Logout"
                            subheading="Sign out of your account"
                            onPress={async () => {
                                await logout();
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Auth' }],
                                });
                            }}
                        />
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: COLORS.Black,
    },
    appHeaderContainer: {
        marginHorizontal: SPACING.space_36,
        marginTop: SPACING.space_20 * 2,
    },
    profileContainer: {
        alignItems: 'center',
        padding: SPACING.space_12,
    },
    avatarImage: {
        height: 80,
        width: 80,
        borderRadius: 80,
    },
    avatarText: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_16,
        marginTop: SPACING.space_16,
        color: COLORS.White,
    },
});

export default UserAccountScreen;