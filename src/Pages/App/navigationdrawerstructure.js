//This is an example code for NavigationDrawer//
import React, { Component } from 'react';
//import react in our code.
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
// import all basic components
import { colorPrimary } from '../../Components/colors';

class NavigationDrawerStructure extends Component {
	toggleDrawer = () => {
		this.props.navigationProps.toggleDrawer();
	};
	render() {
		return (
			<View style={{ flexDirection: 'row', color: colorPrimary }}>
				<TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
					{/*Donute Button Image */}
					<Image
						source={require('../../images/Menu35x35.png')}
						style={{ marginLeft: 15, height: 25, width: 25 }}
					/>
				</TouchableOpacity>
			</View>
		);
	}
}
export default NavigationDrawerStructure