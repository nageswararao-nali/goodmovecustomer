import React, { Component } from "react";
import NavigationDrawerStructure from "./navigationdrawerstructure";
import LogoImage from "../../Components/applogo";

import { StyleSheet, View, Text } from "react-native";
import { colorPrimary } from "../../Components/colors";

export default class MyBooking extends Component {
  /** navigation header */
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginLeft: 45,
            marginBottom: 20,
          }}
        >
          <LogoImage />
          <View style={styles.HeaderTextArea}>
            <Text style={styles.HeaderText}>Offers</Text>
          </View>
        </View>
      ),
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: "#FFFFFF",
        height: 80,
      },
      headerTintColor: "red",
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.content}>Offers Coming Soon...</Text>
      </View>
    );
  }
}

/** styles of this page */
const styles = StyleSheet.create({
  HeaderTextArea: {
    justifyContent: "center",
    alignItems: "center",
  },
  HeaderText: {
    marginLeft: 25,
    marginTop: 15,
    color: colorPrimary,
    fontSize: 25,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    top: 250,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
