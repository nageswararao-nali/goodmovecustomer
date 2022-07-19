import React, { Component } from 'react';
import { View, ActivityIndicator, AsyncStorage } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Login from './Pages/Auth/login';
import Signup from './Pages/Auth/signup';
import OTP from './Pages/Auth/otp';
import ForgetPass from './Pages/Auth/forgetPassword';
import setPassword from './Pages/Auth/setpassword';
import DrawerStack from './Pages/App/drawerstack';

class AuthLoadingScreen extends Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('token');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }
}

const AppStack = createStackNavigator({ DrawerStack: { screen: DrawerStack } }, { headerMode: 'Screen', })
const AuthStack = createStackNavigator({ Login: Login, Signup: Signup, OTP: OTP, ForgetPass: ForgetPass, setPassword: setPassword });

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: DrawerStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));