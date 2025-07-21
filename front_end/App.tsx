import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './src/navigators/TabNavigator';
import MovieDetailsScreen from './src/screens/MovieDetailsScreen';
import SeatBookingScreen from './src/screens/SeatBookingScreen';
import TicketScreen from './src/screens/TicketScreen';
import AuthScreen from './src/screens/AuthScreen';
import ManageMovieScreen from './src/screens/ManageMovieScreen';
import ManageCinemaScreen from './src/screens/ManageCinemaScreen';
import MovieTheaterScreen from './src/screens/MovieTheaterScreen';
import MovieForm from './src/screens/MovieForm';
import ProfileDetailScreen from './src/screens/ProfileDetailScreen';
import BookingTicketScreen from './src/screens/BookingTicketScreen';
import { AuthProvider } from './src/context/AuthContext';
import PaymentScreen from './src/screens/PaymentScreen';
import ManageRoomsScreen from './src/screens/ManageRoomsScreen';
import ManageSeatsScreen from './src/screens/ManageSeatsScreen';
import ManageScreenings from './src/screens/ManageScreenings';
import ScreeningForm from './src/screens/ScreeningForm';
import AccountListScreen from './src/screens/AccountListScreen';
import InvoiceListScreen from './src/screens/InvoiceListScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    // share trạng thái đăng nhập cho toàn bộ app
    <AuthProvider>
      {/* đảm bảo các màn hình nằm trong hệ thống navigation */}
      <NavigationContainer>
        {/* định nghĩa các stack screen */}
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Tab"
            component={TabNavigator}
            options={{ animation: 'default' }}
          />
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ animation: 'default' }}
          />
          <Stack.Screen
            name="MovieDetails"
            component={MovieDetailsScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="SeatBooking"
            component={SeatBookingScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="TicketDetail"
            component={TicketScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="ManageMovie"
            component={ManageMovieScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="ManageCinema"
            component={ManageCinemaScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="MovieTheater"
            component={MovieTheaterScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="ProfileDetail"
            component={ProfileDetailScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="MovieForm"
            component={MovieForm}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="BookingTicket"
            component={BookingTicketScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="ManageRooms"
            component={ManageRoomsScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="ManageSeats"
            component={ManageSeatsScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="ManageScreenings"
            component={ManageScreenings}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="ScreeningForm"
            component={ScreeningForm}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="AccountList"
            component={AccountListScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="InvoiceList"
            component={InvoiceListScreen}
            options={{ animation: 'slide_from_right' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;