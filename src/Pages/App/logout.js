import React, { Component } from 'react';
import { AsyncStorage, View } from 'react-native';

class logout extends Component {
	constructor(props) {
		super(props);
	}

	/** this method call when screen load */
	componentWillMount() {
		this._signOutAsync();
	}

	/** logout and remove user detail from storage */
	_signOutAsync = async () => {
		await AsyncStorage.removeItem('userid');
		await AsyncStorage.removeItem('name');
		await AsyncStorage.removeItem('token');
		this.props.navigation.navigate('Auth');
	};

	render() {
		return (
			<View>
			</View>
		);
	}
}
export default logout;
