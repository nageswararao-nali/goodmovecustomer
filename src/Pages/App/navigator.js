import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import { BookDetail } from './bookDetail';

const AppNavigator = createStackNavigator({
    BookDetail : BookDetail
  },{
    headerMode: 'none',
    header: null,
});

export default createAppContainer(AppNavigator);