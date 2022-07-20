import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  AsyncStorage,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import CheckBox from "expo-checkbox";
//import Loader from '../Pages/loader';
import { loginAction } from "../../util/action";
import { storage } from "../../util/storage";
import validate from "validate.js";

import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import AppLogoBlock from "../../Components/AppLogoBlock";
import { colorPrimary } from "../../Components/colors";

export default class Login extends Component {
  /** navigation header */
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      mobile: "",
      password: "",
      mobileError: "",
      passwordError: "",
      passwordshow: true,
    };
  }

  componentDidMount() {
    this.registerForPushNotifications();

    /* remember me */
    var mobile = this.getRememberedUser().then((responseJson) => {
      if (responseJson != null) {
        this.setState({
          password: responseJson.password,
          mobile: responseJson.mobile,
          rememberMe: mobile ? true : false,
        });
      }
    });
  }

  /* for get device token */
  registerForPushNotifications = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    this.setState({ token: token });
  };

  /* hide and show password */
  getPasswordshow = () => {
    if (this.state.passwordshow == true) {
      this.setState({ passwordshow: false });
    } else {
      this.setState({ passwordshow: true });
    }
  };

  /* login method */
  async login() {
    const { navigate } = this.props.navigation;
    const { mobile, password } = this.state;

    var constraints = {
      mobile: {
        presence: {
          allowEmpty: false,
          message: "^required",
        },
        format: {
          pattern: "[0-9]{10}",
          flags: "i",
          message: "^ (10 digit mobile number)",
        },
        /*length: {
                    minimum: 10,
                    maximum: 10,
                    tooShort: "needs to have %{count} words or more.",
                    message: "should be 10 digit."
                }*/
      },
      password: {
        presence: {
          allowEmpty: false,
          message: "^required.",
        },
      },
    };

    Keyboard.dismiss();
    const result = validate(
      { mobile: this.state.mobile, password: this.state.password },
      constraints
    );

    if (result) {
      if (result.mobile) {
        this.setState({ mobileError: result.mobile });
      } else {
        this.setState({ mobileError: "" });
      }
      if (result.password) {
        this.setState({ passwordError: result.password });
      } else {
        this.setState({ passwordError: "" });
      }
    }

    var loginData = {
      mobile: this.state.mobile,
      password: this.state.password,
      role: "customer",
      device_token: this.state.token,
    };

    if (!result) {
      this.setState({ mobileError: "" });
      this.setState({ passwordError: "" });
      this.setState({ loading: true });

      var response = loginAction(loginData).then(
        function (responseJson) {
          console.log(responseJson);
          if (responseJson.isError == false) {
            storage
              .storeUserDetail(responseJson.result)
              .then((data) => {
                this.setState({ loading: false });
                navigate("App");
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            alert(responseJson.message);
            this.setState({ loading: false });
            navigate("Auth");
          }
        }.bind(this)
      );
    }
  }

  /* password remember function*/
  async remember(value) {
    this.setState({ rememberMe: value });
    if (value == true) {
      await AsyncStorage.setItem("mobile", this.state.mobile);
      await AsyncStorage.setItem("password", this.state.password);
    } else {
      await AsyncStorage.removeItem("mobile");
    }
    this.setState({ remember: !this.state.remember });
  }

  /* get remember user mobile number and password */
  async getRememberedUser() {
    const mobile = await AsyncStorage.getItem("mobile");
    const password = await AsyncStorage.getItem("password");

    if (mobile != null && password != null) {
      data = {
        mobile: mobile,
        password: password,
      };

      //password : password
      return data;
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    const { loading } = this.state;

    if (!loading) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.select({ android: "height", ios: "padding" })}
          style={{ flex: 1 }}
        >
          <ScrollView style={{ flexGrow: 1 }}>
            <View style={styles.container}>
              <View style={styles.header}>
                <AppLogoBlock />
                <Text style={styles.title}>Customer Login</Text>
              </View>

              <View style={styles.loginbox}>
                {/*<View style={styles.loginlogo}>
                                    <Image source={require('../../images/Login.png')} style={styles.login}></Image>
            </View> */}

                <View style={styles.input}>
                  <Image
                    source={require("../../images/User-name.png")}
                    style={styles.textimage}
                  ></Image>
                  <TextInput
                    style={styles.textbox}
                    placeholder="Enter Mobile"
                    keyboardType="numeric"
                    onChangeText={(mobile) => this.setState({ mobile })}
                    maxLength={10}
                    value={this.state.mobile}
                  ></TextInput>
                </View>
                <Text style={styles.error}>{this.state.mobileError}</Text>

                <View style={styles.input}>
                  <Image
                    source={require("../../images/Password.png")}
                    style={styles.textimage}
                  ></Image>
                  <TextInput
                    style={styles.textbox}
                    placeholder="Password"
                    secureTextEntry={this.state.passwordshow}
                    value={this.state.password}
                    onChangeText={(password) => this.setState({ password })}
                  ></TextInput>
                  {this.state.passwordshow ? (
                    <TouchableOpacity
                      style={{ alignItems: "flex-end" }}
                      onPress={this.getPasswordshow}
                    >
                      <Image
                        source={require("../../images/Eye.png")}
                        style={styles.textimage}
                      ></Image>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{ alignItems: "flex-end" }}
                      onPress={this.getPasswordshow}
                    >
                      <Image
                        source={require("../../images/Eye-Close.png")}
                        style={styles.textimage}
                      ></Image>
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.error}>{this.state.passwordError}</Text>

                <View style={{ flexDirection: "row" }}>
                  <CheckBox
                    style={{ width: 18, height: 18 }}
                    value={this.state.remember}
                    onValueChange={(value) => this.remember(value)}
                  ></CheckBox>
                  <Text style={styles.frtxt}>Remember Me</Text>

                  <TouchableOpacity onPress={() => navigate("ForgetPass")}>
                    <Text style={styles.frpwd}>Forgot Password ?</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.buttoncont}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={this.login.bind(this)}
                  >
                    <Text style={styles.btntext}>Log in</Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 5,
                    justifyContent: "center",
                  }}
                >
                  <Text style={styles.remtxt}>Don't have an Account ? </Text>
                  <TouchableOpacity onPress={() => navigate("Signup")}>
                    <Text style={styles.signup}> Register</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 90,
              }}
            >
              <Text style={{ fontSize: 10 }}>Version 1.1.6</Text>
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
    // marginBottom: 40,
  },
  appLogo: {
    width: 300,
    height: 86,
  },
  header: {
    marginTop: "20%",
    marginBottom: 70,
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
    marginRight: "30%",
    marginLeft: "30%",
  },
  loginbox: {
    position: "relative",
    paddingTop: "15%",
    paddingBottom: "10%",
    paddingRight: "5%",
    paddingLeft: "5%",
    marginTop: "-2%",
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
    //marginBottom : 20,
    borderColor: "rgba(119,119,119,0.6)",
  },
  textbox: {
    paddingLeft: 10,
    width: "80%",
    fontSize: 13,
  },
  textimage: {
    padding: 10,
    margin: 5,
    /*resizeMode: 'stretch',*/
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

  remtxt: {
    //flex : 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginTop: 7,
    fontSize: 13,
    color: "#000000",
  },
  frtxt: {
    textAlign: "right", // <-- the magic
    color: "#000000",
    marginLeft: 8,
    fontSize: 13,
  },
  frpwd: {
    textAlign: "right", // <-- the magic
    color: colorPrimary,
    fontSize: 13,
    marginLeft: 40,
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  signup: {
    marginTop: 7,
    fontSize: 13,
    color: colorPrimary,
    textAlign: "left",
    //justifyContent : 'center'
  },
  error: {
    //position: "absolute",
    //bottom: -5,
    width: 270,
    left: 15,
    color: colorPrimary,
    fontSize: 13,
    marginBottom: 6,
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
