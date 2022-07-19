import React , {Component} from 'react';
import { StyleSheet, View, Image} from 'react-native';

export default class AppLogoBlock extends Component{
    render(){
        return(
			<View style={styles.container}>
				<Image style={styles.logo} source={require('../images/go_logo_new.png')} />
			</View>
        )
    }
}

const styles = StyleSheet.create({
  container:{
    flexDirection:"row",
    alignItems: 'center',
    justifyContent:"center",
    height:100
  },
	logo : {
    width: 140,
    resizeMode: 'contain',
	}
});