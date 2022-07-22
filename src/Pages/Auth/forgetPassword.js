import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { colorPrimary } from "../../Components/colors";
import validate from "validate.js";
import { sendOTPAction, ForgotPassAction } from "../../util/action";

import { Header } from "react-navigation-stack";
import AppLogoBlock from "../../Components/AppLogoBlock";
import { LinearGradient } from "expo-linear-gradient";

export default class ForgetPassword extends Component {
  /** navigation header */
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      mobile: "",
      mobileError: "",
    };
  }

  /* Submit action -> Mobile no validation, API call for send OTP and Store OTP in database */
  async send() {
    const { mobile } = this.state;
    const { navigate } = this.props.navigation;

    /* Validation rule for mobile */
    var constraints = {
      phoneNo: {
        presence: {
          allowEmpty: false,
          message: "^required",
        },
        format: {
          pattern: "[0-9]{10}",
          flags: "i",
          message: "^ (10 digit mobile number)",
        },
      },
    };
    /* Validation rule for mobile */

    Keyboard.dismiss();

    /* Call validation library for validate mobile */
    const result = validate({ phoneNo: this.state.mobile }, constraints);
    /* Call validation library for validate mobile */

    /* Set mobile error to display if not validated as required */
    if (result) {
      if (result.phoneNo) {
        this.setState({ mobileError: result.phoneNo });
      } else {
        this.setState({ mobileError: "" });
      }
    }
    /* Set mobile error to display if not validated as required */

    /* Validation check */
    if (!result) {
      /* Make empty mobile error if validate*/
      this.setState({ mobileError: "" });
      /* Make empty mobile error if validate*/

      /* Data which pass in forgot password API */
      var forgotPasswordData = {
        mobile: mobile,
      };
      /* Data which pass in forgot password API */

      /* API code for forgot password */
      // this.setState({ loader: true });

      /*ForgotPassAction(forgotPasswordData).then(function (responseJson) {
                if (responseJson.isError == false) {
                    var otp = responseJson.result.otp;
                    var mobile = responseJson.result.mobile;

                    sendOTPAction(mobile, otp);
                    this.setState({ loader: false })
                    navigate('setPassword', { mobileNo: mobile });
                } else {
                    alert(responseJson.message);
                    this.setState({ loader: false })
                }
            }.bind(this));*/
      ForgotPassAction(forgotPasswordData).then(function (responseJson) {
        if (responseJson.isError == false) {
          var mobile = responseJson.result.mobile;
          /* Send OTP action */
          sendOTPAction(mobile).then(
            function (responseJson) {
              if (responseJson.type == "success") {
                navigate("setPassword", { mobileNo: mobile });
                // this.setState({ loader: false });
              } else {
                alert(responseJson.message);
                // this.setState({ loader: false });
              }
              // this.setState({ loader: false });
            }.bind(this)
          );
          /* Send OTP action */

          navigate("setPassword", { mobileNo: mobile });
          // this.setState({ loader: false });
        } else {
          alert(responseJson.message);
          // this.setState({ loader: false });
        }
        // this.setState({ loader: false });
      });
      /* API code for forgot password */
    }
    /* Validation check */
  }
  /* Submit action -> Mobile no validation, API call for send OTP and Store OTP in database */

  /* Design part of page */
  render() {
    const { navigate } = this.props.navigation;
    const { loader } = this.state;

    if (!loader) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.select({ android: "height", ios: "padding" })}
          style={{ flex: 1 }}
        >
          <ScrollView style={{ flexGrow: 1 }}>
            <View style={styles.container}>
              <View style={styles.header}>
                <AppLogoBlock />
                <Text style={styles.title}>Forgot Password</Text>
              </View>

              <View style={styles.loginbox}>
                {/* <View style={styles.loginlogo}>
                  <Image
                    source={require("../../images/Forget-Password.png")}
                    style={styles.login}
                  ></Image>
                </View> */}

                <View style={styles.content}>
                  <Text style={styles.intro}>
                    Enter Your Mobile Number Used During Registration
                  </Text>
                </View>

                <View style={styles.input}>
                  <Image
                    source={require("../../images/Call.png")}
                    style={styles.textimage}
                  ></Image>
                  <TextInput
                    style={styles.textbox}
                    placeholder="Enter Mobile"
                    keyboardType="numeric"
                    maxLength={10}
                    onChangeText={(mobile) => this.setState({ mobile })}
                  ></TextInput>
                  <Text style={styles.error}>{this.state.mobileError}</Text>
                </View>

                <View style={styles.buttoncont}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={this.send.bind(this)}
                  >
                    <LinearGradient
                      colors={["#5be9aa", colorPrimary]}
                      style={{
                        height: 38,
                        borderRadius: 5,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.btntext}>Send</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      );
    } else {
      return (
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color={colorPrimary}
        />
      );
    }
  }
  /* Design part of page */
}

/* Styles */
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    alignItems: "center",
    //marginBottom: 40,
  },
  appLogo: {
    width: 300,
    height: 86,
  },
  header: {
    marginTop: "20%",
    marginBottom: 80,
    position: "relative",
    flexDirection: "column",
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 22,
    color: colorPrimary,
    marginTop: 30,
  },
  loginlogo: {
    marginTop: "-20%",
    //marginLeft: "35%",
    position: "absolute",
  },
  login: {
    //marginTop: 70,
    //zIndex: 111111
    marginRight: "35%",
    marginLeft: "30%",
  },
  loginbox: {
    position: "relative",
    paddingTop: "15%",
    paddingBottom: "10%",
    paddingRight: "5%",
    paddingLeft: "5%",
    marginTop: "-5%",
    marginBottom: "15%",
    borderWidth: 1,
    backgroundColor: "#ffffff",
    borderRadius: 9,
    borderColor: "#ffffff",
    shadowColor: "#777",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 6.22,
    elevation: 5,
  },
  input: {
    flexDirection: "row",
    width: 270,
    borderBottomWidth: 1,
    marginTop: 20,
    marginBottom: 20,
    borderColor: "rgba(119,119,119,0.6)",
  },
  textbox: {
    paddingLeft: 10,
    width: "90%",
    fontSize: 13,
  },
  textimage: {
    padding: 10,
    margin: 5,
    //resizeMode : 'stretch',
    width: 20,
    height: 20,
  },
  eye: {
    padding: 10,
    marginRight: 0,
    alignItems: "flex-end",
    height: 20,
    width: 20,
    resizeMode: "stretch",
  },
  buttoncont: {
    marginTop: 10,
    alignItems: "center",
  },
  button: {
    borderRadius: 5,
    borderColor: colorPrimary,
    position: "absolute",
    shadowColor: "#777",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6.22,
    width: 250,
    height: 40,
    textAlign: "center",
    marginTop: "-4%",
  },
  btntext: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 16,
  },
  remtxt: {
    //flex : 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginTop: 7,
    fontSize: 15,
    color: "#777777",
  },
  frtxt: {
    textAlign: "right", // <-- the magic
    color: "#777",
    marginTop: 5,
  },
  frpwd: {
    textAlign: "right", // <-- the magic
    color: "#777",
    marginTop: 5,
    marginLeft: 40,
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  signup: {
    marginTop: 7,
    fontSize: 15,
    color: "#2175DC",
    textAlign: "left",
    //justifyContent : 'center'
  },
  error: {
    position: "absolute",
    bottom: -35,
    left: 5,
    color: colorPrimary,
    fontSize: 13,
    width: "95%",
  },
  intro: {
    // color: "rgba(119,119,119,0.9)",
    color: "#363636",
    fontSize: 14,
    textAlign: "justify",
  },
  content: {
    width: "90%",
    marginTop: -5,
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
/* Styles */
