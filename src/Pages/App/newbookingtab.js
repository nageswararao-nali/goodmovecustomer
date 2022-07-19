import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import PendingQuotationBooking from './newbookingpendingquotation';
import BookingStatus from './newbookingstatus';
import BookDetail from './bookingdetail';
import { colorPrimary } from '../../Components/colors';
const TabNavigator = createMaterialTopTabNavigator(
	{
		PendingQuotation: {
			screen: PendingQuotationBooking,
			navigationOptions: {
				title: "Pending Quotation"
			}
		},
		BookingStatus: {
			screen: BookingStatus,
			navigationOptions: {
				title: "Booking Status"
			}
		},
	}, {
	tabBarPosition: 'top',
	swipeEnabled: true,
	animationEnabled: true,
	tabBarOptions: {
		upperCaseLabel: false,
		activeTintColor: '#333333',
		inactiveTintColor: '#777777',
		style: {
			backgroundColor: '#FFFFFF',
		},
		labelStyle: {
			textAlign: 'center',
			fontSize: 16,
			fontWeight: '600'
		},
		indicatorStyle: {
			borderBottomColor: colorPrimary,
			borderBottomWidth: 2,
		},
	},
}
)

const TabStack = createStackNavigator({
	TabNavigator: { screen: TabNavigator },
	Detailvigator: { screen: BookDetail }
},
	{
		headerMode: 'Screen',
	})


export default createAppContainer(TabStack);