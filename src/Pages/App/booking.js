import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import NavigationDrawerStructure from './navigationdrawerstructure';
import LogoImage from '../../Components/applogo';
import Booking from './navigator';
import { colorPrimary } from '../../Components/colors';
export default class Booking extends Component {

	/** navigation header */
	static navigationOptions = ({navigation}) => {
		return {
			headerTitle: (
				<View style={{flex: 1, flexDirection: 'row'}}>
					<LogoImage />
					<View style={styles.HeaderTextArea}>
						<Text style={styles.HeaderText}>My Booking</Text>
					</View>
				</View>
			),
			headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
			headerStyle: {
				backgroundColor: '#FFFFFF',
				height: 80
			},
			headerTintColor: 'red',		
		};
  };
  //Screen2 Component
  render() {
    return (
		<Booking />
    );
  }
}
 
const styles = StyleSheet.create({
  MainContainer: {
	flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    marginTop: 50,
    justifyContent: 'center',
  },
  HeaderTextArea: {
	justifyContent : 'center',
	alignItems : 'center'
  },
  HeaderText: {
	marginLeft: 30,
	color: colorPrimary,
	fontSize: 25,
	fontWeight: 'bold'
  }
});