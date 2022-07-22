// single componenet for app header title and logo

import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { colorPrimary } from "../../Components/colors";
import LogoImage from "../../Components/applogo";

const HeaderTitle = ({ title }) => {
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <View style={styles.LogoWrapper}>
        <LogoImage />
      </View>
      <View style={styles.HeaderTextArea}>
        <Text style={styles.HeaderText}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  LogoWrapper: {
    marginTop: 10,
  },
  HeaderTextArea: {
    marginLeft: 18,
    marginBottom: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  HeaderText: {
    color: colorPrimary,
    fontSize: 25,
    fontWeight: "bold",
  },
});

export default HeaderTitle;

//  LogoWrapper: {
//     marginTop: 20,
//     marginLeft: 10,
//   },
//   HeaderTextArea: {
//     marginLeft: 18,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 30,
//   },
//   HeaderText: {
//     color: colorPrimary,
//     fontSize: 25,
//     fontWeight: "bold",
//   },
