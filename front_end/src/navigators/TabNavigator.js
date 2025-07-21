import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import UserAccountScreen from '../screens/UserAccountScreen';
import { COLORS, FONTSIZE, SPACING } from '../theme/theme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MovieTheaterScreen from '../screens/MovieTheaterScreen';
import { useAuth } from '../context/AuthContext';
import TicketListScreen from '../screens/TicketListScreen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { role, userId } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.Black,
          borderTopWidth: 0,
          height: SPACING.space_10 * 10,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ role }}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="videocamera"
              color={focused ? COLORS.Orange : COLORS.White}
              size={FONTSIZE.size_24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Feather
              name="search"
              color={focused ? COLORS.Orange : COLORS.White}
              size={FONTSIZE.size_24}
            />
          ),
        }}
      />
      {role === 'admin' ? (
        <Tab.Screen
          name="MovieTheater"
          component={MovieTheaterScreen}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <AntDesign
                name="enviromento"
                color={focused ? COLORS.Orange : COLORS.White}
                size={FONTSIZE.size_24}
              />
            ),
          }}
        />
      ) : role === 'user' ? (
        <Tab.Screen
          name="Ticket"
          component={TicketListScreen}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <Entypo
                name="ticket"
                color={focused ? COLORS.Orange : COLORS.White}
                size={FONTSIZE.size_24}
              />
            ),
          }}
        />
      ) : null}
      <Tab.Screen
        name="User"
        component={UserAccountScreen}
        initialParams={{ role, userId }}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="user"
              color={focused ? COLORS.Orange : COLORS.White}
              size={FONTSIZE.size_24}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;