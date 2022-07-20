import React, { Component } from "react";
import { StyleSheet } from "react-native";

//For React Navigation 4+
import { createAppContainer } from "react-navigation";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { createStackNavigator } from "react-navigation-stack";
import Profile from "./profiletab";
import AddBooking from "./addbookingtab";
import MyBooking from "./myBooking";
import PaymentOption from "./paymentOption";
import Offers from "./offers";
import About from "./about";
import TermCondition from "./termCondition";
import CustomSideBar from "./customSideBar";
import Logout from "./logout";

import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("screen");

const Profile_StackNavigator = createStackNavigator(
  {
    Second: { screen: Profile },
  },
  { headerMode: "Screen" }
);

const AddBooking_StackNavigator = createStackNavigator(
  {
    First: { screen: AddBooking },
  },
  { headerMode: "Screen" }
);

const MyBooking_StackNavigator = createStackNavigator(
  {
    Third: { screen: MyBooking },
  },
  { headerMode: "Screen" }
);

const Logout_StackNavigator = createStackNavigator({
  Four: { screen: Logout },
});

const PaymentOption_StackNavigator = createStackNavigator({
  Six: { screen: PaymentOption },
});

const Offers_StackNavigator = createStackNavigator({
  Seven: { screen: Offers },
});

const About_StackNavigator = createStackNavigator({
  Eight: { screen: About },
});

const TermCondition_StackNavigator = createStackNavigator({
  Nine: { screen: TermCondition },
});

const DrawerNavigator = createDrawerNavigator(
  {
    AddBooking: { screen: AddBooking_StackNavigator },
    Profile: { screen: Profile_StackNavigator },
    MyBooking: { screen: MyBooking_StackNavigator },
    Logout: { screen: Logout_StackNavigator },
    PaymentOption: { screen: PaymentOption_StackNavigator },
    Offers: { screen: Offers_StackNavigator },
    About: { screen: About_StackNavigator },
    TermCondition: { screen: TermCondition_StackNavigator },
  },
  {
    contentComponent: CustomSideBar,
    drawerWidth: Math.min(height, width) * 0.8,
  }
);

export default createAppContainer(DrawerNavigator);

const styles = StyleSheet.create({
  DrawerLogoPart: {
    marginTop: 80,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  DrawerLogo: {
    height: 120,
    width: 120,
    marginLeft: 5,
  },
  DrawerLogoText: {
    color: "#FFFFFF",
    fontSize: 20,
    marginTop: 10,
    opacity: 0.8,
  },
});
