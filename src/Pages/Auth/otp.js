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
import { colorPrimary } from "../../Components/colors";
import {
  storeOTPAction,
  VerityOTPAction,
  verifyMSGOTPAction,
  sendOTPAction,
  resendOTPAction,
} from "../../util/action";
import { Header } from "react-navigation-stack";
import AppLogoBlock from "../../Components/AppLogoBlock";
import { LinearGradient } from "expo-linear-gradient";

export default class Otp extends Component {
  /** navigation header */
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
    };
  };

  constructor(props) {
    super(props);

    this.a = React.createRef();
    this.b = React.createRef();
    this.c = React.createRef();
    this.d = React.createRef();
    this.state = {
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
    const data = navigation.getParam("data");
    const concatNo = data.mobile;

    this.setState({ mobileNo: concatNo });
    /* Get mobile no to display on which sent OTP */

    /* Set focus on first OTP input when page load */
    this.a.current.focus();
    /* Set focus on first OTP input when page load */
  }

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
  focusPrevious(key, previousRef) {
    if (key === "Backspace") {
      previousRef.current.focus();
    }
  }

  /* submit otp for verify mobile number*/
  async submit() {
    const signupData = this.props.navigation.getParam("data");
    const mobile = signupData.mobile;

    const { navigate } = this.props.navigation;
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

    Keyboard.dismiss();

    if (aValue != "" && bValue != "" && cValue != "" && dValue != "") {
      const data = this.props.navigation.getParam("data");
      var enteredOTP = aValue + bValue + cValue + dValue;
      var otp = enteredOTP;

      var setData = { ...data, otp };
      this.setState({ loader: true });

      var response = verifyMSGOTPAction(mobile, enteredOTP).then(
        function (responseJson) {
          console.log(responseJson);
          if (responseJson.type == "success") {
            /* API code for set new password */
            var response1 = VerityOTPAction(setData).then(
              function (responseJson) {
                console.log(responseJson);
                if (responseJson.isError == false) {
                  alert(responseJson.message);
                  this.setState({ loader: false });
                  navigate("Login");
                } else {
                  alert(responseJson.message);
                  this.setState({ loader: false });
                }
              }.bind(this)
            );
            /* API code for set new password */
          } else {
            alert(responseJson.message);
            this.setState({ loader: false });
          }
        }.bind(this)
      );
    }
  }

  /* resend otp in message */
  async resend() {
    const signupData = this.props.navigation.getParam("data");

    this.setState({ loader: true });
    // var response = storeOTPAction(signupData).then(function (responseJson) {

    // if (responseJson.isError == false) {
    // var otp = responseJson.result.otp;
    // var mobile = responseJson.result.mobile;
    // sendOTPAction(mobile, otp);
    // this.state({ loader: false });

    // } else {
    // alert(responseJson.message);
    // this.state({ loader: false });
    // }
    // }.bind(this));

    var response = resendOTPAction(signupData.mobile).then(
      function (responseJson) {
        if (responseJson.type == "success") {
          this.setState({ loader: false });
        } else {
          alert(responseJson.message);
          this.setState({ loader: false });
        }
      }.bind(this)
    );
  }

  render() {
    const { navigate } = this.props.navigation;
    const { loader } = this.state;

    if (!loader) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.select({
            android: "height",
            ios: "padding",
          })}
          style={{ flex: 1 }}
        >
          <ScrollView style={{ flexGrow: 1 }}>
            <View style={styles.container}>
              <View style={styles.header}>
                <AppLogoBlock />
                <Text style={styles.title}>OTP Verification</Text>
              </View>

              <View style={styles.loginbox}>
                {/* <View style={styles.loginlogo}>
                  <Image
                    source={require("../../images/OTP-Verification.png")}
                    style={styles.login}
                  ></Image>
                </View> */}
                <View style={styles.content}>
                  <Text style={styles.intro}>
                    Enter The 4-Digit Code Sent to Your Mobile Number (+91{" "}
                    {this.state.mobileNo})
                  </Text>
                </View>

                <View style={styles.input}>
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
                        borderWidth: this.state.bBorder,
                        borderColor: this.state.bBorderColor,
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
                        borderWidth: this.state.bBorder,
                        borderColor: this.state.bBorderColor,
                      },
                    ]}
                    maxLength={1}
                    keyboardType="numeric"
                    ref={this.d}
                    onKeyPress={(e) =>
                      this.focusPrevious(e.nativeEvent.key, this.c)
                    }
                    onChangeText={(v) => this.focusNext(this.d, this.d, v)}
                  ></TextInput>
                </View>

                <View style={styles.resend}>
                  <TouchableOpacity onPress={this.resend.bind(this)}>
                    <Text style={styles.signup}>Resend OTP</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.buttoncont}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={this.submit.bind(this)}
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
                      <Text style={styles.btntext}>Submit</Text>
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
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    alignItems: "center",
    marginBottom: 40,
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
    top: -130,
    left: 105,
    alignContent: "center",
    position: "absolute",
  },
  login: {
    marginTop: 70,
    zIndex: 111111,
  },
  loginbox: {
    position: "relative",
    paddingTop: 80,
    paddingBottom: 50,
    paddingRight: 30,
    paddingLeft: 30,
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
    marginTop: -20,
    marginBottom: 5,
  },
  intro: {
    // color: "rgba(119,119,119,0.9)",
    color: "#363636",
    fontSize: 16,
    textAlign: "justify",
  },
  input: {
    flexDirection: "row",
    width: "80%",
    marginVertical: 20,
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
    fontSize: 15,
    color: colorPrimary,
    textAlign: "center",
    justifyContent: "center",
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
  error: {
    position: "absolute",
    bottom: -18,
    left: 5,
    color: colorPrimary,
    fontSize: 13,
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
