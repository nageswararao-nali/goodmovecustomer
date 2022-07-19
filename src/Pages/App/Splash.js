import React, { Component } from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';
import { colorPrimary } from '../../Components/colors';

export default class Splash extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image 
          style={{width:300, height:200, resizeMode: 'contain',}}
          source={require('../../images/go_logo.png')}
          fadeDuration={0} // we need to adjust Android devices (https://facebook.github.io/react-native/docs/image#fadeduration) fadeDuration prop to `0` as it's default value is `300`
        />
        <View style={styles.content}>
          <Text style={styles.title}>Good Move</Text>
          <Text style={styles.subtitle}>Your affordable, reliable and safe end-to-end city logistics partner</Text>
        </View>
      </View>
    )
  }
}


/** style of this page */
const styles = StyleSheet.create({
	container: {
		flex: 1,
    backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
	},
  content:{
    justifyContent: 'center',
		alignItems: 'center',
    margin:20
  },
  title: {
		color: colorPrimary,
		fontSize: 30,
		fontWeight: 'bold'
  },
  subtitle:{
    marginTop: 20,
		fontWeight: "500",
		fontSize: 17,
		color: "rgba(119,119,119,1)",
    textAlign:"center"
  }
});