import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AddingAddress from './addaddress';
import AddBookingPage from './addBooking';

const TabStack = createStackNavigator({
	AddBooking: { screen: AddBookingPage },
	AddressPage: { screen: AddingAddress },
})

export default createAppContainer(TabStack);