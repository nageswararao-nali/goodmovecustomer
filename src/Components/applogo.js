import React , {Component} from 'react';
import { StyleSheet, View, Image} from 'react-native';

export default class AppLogo extends Component{
    render(){
        return(
			<View style={{marginTop:15}}>
				{/* <Image style={styles.logo} source={require('../images/mainlogo.png')}/> */}
				{/* <Image style={styles.logo} source={require('../images/App-Icon.png')}/> */}
				<Image style={styles.logo1} source={require('../images/go_logo_new.png')}/>
			</View>
        )
    }
}

const styles = StyleSheet.create({
	logo : {
		width: 70,
		height: 70
	},
	logo1 : {
		width: 40,
		height: 40
	}
});