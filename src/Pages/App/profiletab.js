import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AddingAddress from './profileAddress';
import Profile from './profile';

const TabStack = createStackNavigator({
	Profile: { screen: Profile },
	AddressPage: { screen: AddingAddress },
})

export default createAppContainer(TabStack);