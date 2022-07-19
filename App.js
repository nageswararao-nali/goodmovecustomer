import React, {Component} from 'react';
import { StyleSheet, Text, View,ScrollView,Image,Dimensions } from 'react-native';
import { SplashScreen } from 'expo';
import { Asset } from 'expo-asset';

import AppNavigator from './src/Routes';
import Splash from './src/Pages/App/Splash';
import * as Updates from 'expo-updates';

export default class App extends Component {
	constructor(props) {
		super(props);
		SplashScreen?.preventAutoHide(); // Instruct SplashScreen not to hide yet
		this.state = {
			// for Timer
			timer: null,
			minutes_Counter: '00',
			seconds_Counter: '00',
			isReady:false,
		}
	};
	
	/* this method is run when app start */
	componentDidMount = async () => {
		try {
			// const update = await Updates.checkForUpdateAsync();
			// console.log(update.isAvailable)
			// console.log("update.isAvailable")
			// if (update.isAvailable) {
			// 	await Updates.fetchUpdateAsync();
			// 	// ... notify user of update ...
			// 	await Updates.reloadAsync();
			// }
		} catch (e) {
		// handle or log error
		console.log(e)
		}
		this.setState({isReady: true});
		// checkConnection();
		/*this.cacheResourcesAsync() // ask for resources
		// .then(() => this.setState({ areResourcesReady: true })) // mark resources as loaded
		.then(() => this.onButtonStart()) // mark resources as loaded
		.catch(error => console.error(`Unexpected error thrown when loading: ${error.stack}`));
		// this.onButtonStart();*/
	}
  
	/* set timer for splash screen and increse splash screen time */
	onButtonStart = () => {
		let timer = setInterval(() => {

			var num = (Number(this.state.seconds_Counter) + 1).toString(),
			count = this.state.minutes_Counter;

			if (Number(this.state.seconds_Counter) == 59) {
				count = (Number(this.state.minutes_Counter) + 1).toString();
				num = '00';
			}

			this.setState({
				minutes_Counter: count.length == 1 ? '0' + count : count,
				seconds_Counter: num.length == 1 ? '0' + num : num
			});

			if(Number(this.state.minutes_Counter) == '00' && Number(this.state.seconds_Counter) == '10'){
				clearInterval(this.state.timer);
				this.setState({isReady: true});
			}
		}, 1000);
		this.setState({ timer });
	}
  
	/* set image in splash screen*/
	async cacheResourcesAsync() {
		const images = [require('./assets/splash.png')];
		const cacheImages = images.map(image => Asset.fromModule(image).downloadAsync());
		return Promise.all(cacheImages);
	}
	 	 
	render(){
		const {  isReady } = this.state;
		if(isReady){
			return (
				<AppNavigator/>                 
			);
		}else{
			return (
					<Image style={{ flex: 1, resizeMode: 'contain', width: undefined, height: undefined }}
						source={require('./assets/splash.png')}
						onLoadEnd={() => {
						// wait for image's content to fully load [`Image#onLoadEnd`] (https://facebook.github.io/react-native/docs/image#onloadend)
						SplashScreen?.hide(); // Image is fully presented, instruct SplashScreen to hide
						}}
						fadeDuration={0} // we need to adjust Android devices (https://facebook.github.io/react-native/docs/image#fadeduration) fadeDuration prop to `0` as it's default value is `300`
					/>
			);
		}
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
