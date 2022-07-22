import React, { Component } from "react";
import NavigationDrawerStructure from "./navigationdrawerstructure";
import LogoImage from "../../Components/applogo";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Touchopacity,
} from "react-native";
import Email from "./email";
import { Row, Col } from "react-native-easy-grid";
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
            marginBottom: 22,
            marginLeft: 22,
          }}
        >
          <LogoImage />
          <View style={styles.HeaderTextArea}>
            <Text style={styles.HeaderText}>About Us</Text>
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

  /** render method for view */
  render() {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
        behavior="padding"
        enabled
        keyboardVerticalOffset={100}
      >
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.title}>
              <Text style={styles.titlecontent}>What we do</Text>
            </View>

            <View style={styles.loginbox}>
              <View style={styles.content}>
                <Email />
                <Text style={styles.contentText}>
                  We are a motivated team of young dynamic individuals with a
                  vision to be a reliable end-to-end city logistics partner for
                  MSMEs in Chennai and beyond, deliver goods on-demand and allow
                  MSMEs to focus on their core business. For the past few years
                  we have been conducting surveys and studies to understand the
                  characteristics of the freight industry, analysing issues and
                  challenges faced by both shippers and truckers from a variety
                  of perspectives.
                </Text>

                <Text style={styles.contentText}>
                  G-O app is an initiative to consolidate freight in-order to
                  decrease the number of less than truckload trips and reduce
                  road congestion and emission of GHGs.
                </Text>

                <Text style={styles.contentText}>
                  We thank our Sponsor Shakthi Sustainable Energy Foundation for
                  funding the development of this app. We are grateful to our
                  partner Madras Chamber of Commerce and Industry (MCCI) and
                  Ambattur Industrial Estate Members Association (AIEMA) without
                  whom our freight consolidation study would not have been
                  possible.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

/** style of page */
const styles = StyleSheet.create({
  HeaderTextArea: {
    justifyContent: "center",
    alignItems: "center",
  },
  HeaderText: {
    marginLeft: 25,
    marginTop: 10,
    color: colorPrimary,
    fontSize: 25,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    margin: 10,
    marginBottom: "10%",
  },
  title: {
    marginBottom: 10,
  },
  titlecontent: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
  loginbox: {
    position: "relative",
    padding: 11,
    borderWidth: 1,
    backgroundColor: "#ffffff",
    borderRadius: 9,
    borderColor: "#ffffff",
    shadowColor: "#777",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 6.22,
    elevation: 5,
    marginBottom: "8%",
  },
  content: {
    justifyContent: "center",
  },
  contentText: {
    color: "#777",
    textAlign: "justify",
    lineHeight: 18,
    fontSize: 14,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#777777",
    fontWeight: "500",
    marginTop: 10,
  },
});
