import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { colorPrimary } from "../../Components/colors";
import { LinearGradient } from "expo-linear-gradient";

const AppButton = ({ buttonTitle }) => {
  return (
    <View>
      <LinearGradient
        colors={["#5be9aa", colorPrimary]}
        style={styles.buttonGrad}
      >
        <Text style={styles.btntext}>{buttonTitle}</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonGrad: {
    width: 180,
    height: 40,
    borderRadius: 5,
    borderColor: colorPrimary,
    position: "absolute",
    bottom: 5,
    shadowColor: "#777",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 6.22,
    paddingTop: 7,
    textAlign: "center",
  },
  btntext: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 16,
  },
});

export default AppButton;
