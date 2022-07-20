import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import validate from "validate.js";
import { setPasswordAction, verifyOTPAction } from "../../util/action";
import { Header } from "react-navigation-stack";
import AppLogoBlock from "../../Components/AppLogoBlock";
import { colorPrimary } from "../../Components/colors";
export default class SetPassword extends Component {
  /* Remove header part, not needed here */
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
    };
  };
  /* Remove header part, not needed here */

  constructor(props) {
    super(props);
    this.a = React.createRef();
    this.b = React.createRef();
    this.c = React.createRef();
    this.d = React.createRef();
    this.state = {
      mobileNo: "",
      password: "",
      confirmPassword: "",
      passwordError: "",
      confirmPasswordError: "",
      aValue: "",
      bValue: "",
      cValue: "",
      dValue: "",
      aBorder: 0,
      bBorder: 0,
      cBorder: 0,
      dBorder: 0,
      aBorderColor: "#777",
      bBorderColor: "#777",
      cBorderColor: "#777",
      dBorderColor: "#777",
      loader: false,
    };
  }

  /* This function will run first before rest code */
  componentDidMount() {
    const { navigation } = this.props;

    /* Get mobile no to display on which sent OTP */
    const concatNo = navigation.getParam("mobileNo");
    this.setState({ mobileNo: concatNo });
    /* Get mobile no to display on which sent OTP */

    /* Set focus on first OTP input when page load */
    this.a.current.focus();
    /* Set focus on first OTP input when page load */
  }
  /* This function will run first before rest code */

  /* Set focus on next OTP input */
  focusNext(currentRef, nextRef, value) {
    if (currentRef !== this.d && value) {
      nextRef.current.focus();
    }
    if (currentRef == this.a) {
      this.setState({ aValue: value });
      this.setState({ aBorder: 0, aBorderColor: "#777" });
    }
    if (currentRef == this.b) {
      this.setState({ bValue: value });
      this.setState({ bBorder: 0, bBorderColor: "#777" });
    }
    if (currentRef == this.c) {
      this.setState({ cValue: value });
      this.setState({ cBorder: 0, cBorderColor: "#777" });
    }
    if (currentRef == this.d) {
      this.setState({ dValue: value });
      this.setState({ dBorder: 0, dBorderColor: "#777" });
    }
  }
  /* Set focus on next OTP input */

  /* Set focus on previous OTP input */
  focusPrevious(key, previousRef) {
    if (key === "Backspace") {
      previousRef.current.focus();
    }
  }
  /* Set focus on previous OTP input */

  /* Submit Action -> OTP, Mobile and Password Validation and API call */
  async submit() {
    const { navigate } = this.props.navigation;
    /* Validation of OTP input */
    const { aValue, bValue, cValue, dValue } = this.state;
    if (aValue == "") {
      this.setState({ aBorder: 1, aBorderColor: colorPrimary });
    }

    if (bValue == "") {
      this.setState({ bBorder: 1, bBorderColor: colorPrimary });
    }

    if (cValue == "") {
      this.setState({ cBorder: 1, cBorderColor: colorPrimary });
    }

    if (dValue == "") {
      this.setState({ dBorder: 1, dBorderColor: colorPrimary });
    }
    /* Validation of OTP input */

    /* Validation rule for mobile and password */
    var constraints = {
      password: {
        presence: {
          allowEmpty: false,
          message: "^required",
        },
        length: {
          minimum: 6,
          tooShort: "needs to have %{count} words or more.",
          message: "^ (min 6 characters)",
        },
      },
      confirmpassword: {
        presence: {
          allowEmpty: false,
          message: "^required",
        },
        equality: {
          attribute: "password",
          message: "^ (not matched with password)",
        },
      },
    };
    /* Validation rule for mobile and password */

    Keyboard.dismiss();

    /* Call validation library for validate mobile and password */
    const result = validate(
      {
        password: this.state.password,
        confirmpassword: this.state.confirmPassword,
      },
      constraints
    );
    /* Call validation library for validate mobile and password */

    /* Set mobile and password error to display if not validated as required */
    if (result) {
      if (result.password) {
        this.setState({ passwordError: result.password });
      } else {
        this.setState({ passwordError: "" });
      }
      if (result.confirmpassword) {
        this.setState({ confirmPasswordError: result.confirmpassword });
      } else {
        this.setState({ confirmPasswordError: "" });
      }
    }
    /* Set mobile and password error to display if not validated as required */

    /* Make empty mobile and password error if validate*/
    if (!result) {
      this.setState({ passwordError: "" });
      this.setState({ confirmPasswordError: "" });
    }
    /* Make empty mobile and password error if validate*/

    /* Validation check */
    if (
      !result &&
      aValue != "" &&
      bValue != "" &&
      cValue != "" &&
      dValue != ""
    ) {
      /* Entered OTP combine in variable */
      var enteredOTP = aValue + bValue + cValue + dValue;
      var mobile = this.state.mobileNo;
      /* Data which pass in set new password API */
      var setPasswordData = {
        mobile: this.state.mobileNo,
        otp: enteredOTP,
        password: this.state.password,
      };
      /* Data which pass in set new password API */

      /* Verify OTP */
      var response = verifyOTPAction(mobile, enteredOTP).then(
        function (responseJson) {
          if (responseJson.type == "success") {
            /* API code for set new password */
            setPasswordAction(setPasswordData).then(function (responseJson) {
              if (responseJson.isError == false) {
                alert(responseJson.message);
                navigate("Login");
              } else {
                alert(responseJson.message);
              }
            });
            /* API code for set new password */
            this.setState({ loader: false });
          } else {
            alert(responseJson.message);
          }
        }.bind(this)
      );
      /* API code for set new password */
    }
  }
  /* Submit Action -> OTP, Mobile and Password Validation and API call */

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
          <ScrollView styles={{ flexGrow: 1 }}>
            <View style={styles.container}>
              <View style={styles.header}>
                <AppLogoBlock />
                <Text style={styles.title}>Create New Password</Text>
              </View>

              <View style={styles.loginbox}>
                {/* <View style={styles.loginlogo}>
                  <Image
                    source={require("../../images/New-Password.png")}
                    style={styles.login}
                  ></Image>
                </View> */}
                <View style={styles.content}>
                  <Text style={styles.intro}>
                    Enter The 4-Digit Code Sent to Your Mobile Number (+91{" "}
                    {this.state.mobileNo})
                  </Text>
                </View>

                <View style={styles.otpinput}>
                  <TextInput
                    style={[
                      styles.otp,
                      {
                        borderWidth: this.state.aBorder,
                        borderColor: this.state.aBorderColor,
                      },
                    ]}
                    maxLength={1}
                    keyboardType="numeric"
                    ref={this.a}
                    onChangeText={(v) => this.focusNext(this.a, this.b, v)}
                  ></TextInput>
                  <TextInput
                    style={[
                      styles.otp,
                      {
                        borderWidth: this.state.bBorder,
                        borderColor: this.state.bBorderColor,
                      },
                    ]}
                    maxLength={1}
                    keyboardType="numeric"
                    ref={this.b}
                    onKeyPress={(e) =>
                      this.focusPrevious(e.nativeEvent.key, this.a)
                    }
                    onChangeText={(v) => this.focusNext(this.b, this.c, v)}
                  ></TextInput>
                  <TextInput
                    style={[
                      styles.otp,
                      {
                        borderWidth: this.state.cBorder,
                        borderColor: this.state.cBorderColor,
                      },
                    ]}
                    maxLength={1}
                    keyboardType="numeric"
                    ref={this.c}
                    onKeyPress={(e) =>
                      this.focusPrevious(e.nativeEvent.key, this.b)
                    }
                    onChangeText={(v) => this.focusNext(this.c, this.d, v)}
                  ></TextInput>
                  <TextInput
                    style={[
                      styles.otp,
                      {
                        borderWidth: this.state.dBorder,
                        borderColor: this.state.dBorderColor,
                      },
                    ]}
                    maxLength={1}
                    keyboardType="numeric"
                    onKeyPress={(e) =>
                      this.focusPrevious(e.nativeEvent.key, this.c)
                    }
                    ref={this.d}
                    onChangeText={(v) => this.focusNext(this.d, this.d, v)}
                  ></TextInput>
                </View>

                <View style={styles.passwordinput}>
                  <Image
                    source={require("../../images/Password.png")}
                    style={styles.textimage}
                  ></Image>
                  <TextInput
                    style={styles.textbox}
                    placeholder="Enter New Password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                  ></TextInput>
                  {this.state.passwordError ? (
                    <Text style={styles.error}>{this.state.passwordError}</Text>
                  ) : null}
                </View>

                <View style={styles.passwordinput}>
                  <Image
                    source={require("../../images/Password.png")}
                    style={styles.textimage}
                  ></Image>
                  <TextInput
                    style={styles.textbox}
                    placeholder="Confirm New Password"
                    secureTextEntry={true}
                    onChangeText={(confirmPassword) =>
                      this.setState({ confirmPassword })
                    }
                  ></TextInput>
                  <Text style={styles.error}>
                    {this.state.confirmPasswordError}
                  </Text>
                </View>

                <View style={styles.buttoncont}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={this.submit.bind(this)}
                  >
                    <Text style={styles.btntext}>Update</Text>
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
    marginTop: 80,
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
  content: {
    width: "90%",
    marginTop: 10,
    marginHorizontal: 9,
  },
  intro: {
    // color: "rgba(119,119,119,0.9)",
    color: "#000000",
    fontSize: 14,
    textAlign: "justify",
  },
  otpinput: {
    flexDirection: "row",
    width: "80%",
    marginVertical: 30,

    borderColor: "rgba(119,119,119,0.6)",
  },
  textbox: {
    paddingLeft: 10,
    fontSize: 13,
  },
  textimage: {
    padding: 10,
    margin: 5,
    // resizeMode : 'stretch',
    width: 20,
    height: 20,
  },
  passwordinput: {
    flexDirection: "row",
    width: 250,
    borderBottomWidth: 1,
    // marginTop: 15,
    marginBottom: 30,
    marginLeft: 10,
    borderColor: "rgba(119,119,119,0.6)",
  },
  otp: {
    height: "150%",
    width: "20%",
    borderRadius: 5,
    borderWidth: 0,
    backgroundColor: "rgba(119,119,119,0.2)",
    borderColor: "#777",
    marginHorizontal: 10,
    paddingHorizontal: 20,
  },
  resend: {
    marginBottom: 20,
  },
  signup: {
    marginTop: 8,
    fontSize: 16,
    color: "#2175DC",
    textAlign: "center",
    justifyContent: "center",
  },
  buttoncont: {
    marginTop: 6,
    alignItems: "center",
  },
  button: {
    borderWidth: 1,
    backgroundColor: colorPrimary,
    borderRadius: 5,
    borderColor: colorPrimary,
    shadowColor: "#777",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 6.22,
    elevation: 5,
    paddingTop: 8,
    marginTop: 9,
    width: 270,
    height: 40,
    textAlign: "center",
  },
  btntext: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 16,
  },
  error: {
    position: "absolute",
    bottom: -20,
    //left:5,
    color: colorPrimary,
    fontSize: 13,
    width: "100%",
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
