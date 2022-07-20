//This is an example code for NavigationDrawer//
import React, { Component } from "react";
//import react in our code.
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
// import all basic components
import { colorPrimary } from "../../Components/colors";

class NavigationDrawerStructure extends Component {
  toggleDrawer = () => {
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          color: colorPrimary,
        }}
      >
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          {/*Donute Button Image */}
          <Image
            source={require("../../images/threeline_menuicon.png")}
            style={{ marginLeft: 15, height: 30, width: 30 }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
export default NavigationDrawerStructure;
