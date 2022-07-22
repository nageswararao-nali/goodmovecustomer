import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { storeOTPAction, sendOTPAction } from "../../util/action";
import validate from "validate.js";
import { Header } from "react-navigation-stack";
import AppLogoBlock from "../../Components/AppLogoBlock";
import { colorPrimary } from "../../Components/colors";
import { LinearGradient } from "expo-linear-gradient";
export default class Signup extends Component {
  /** navigation header */
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      nameError: "",
      company_name: "",
      company_nameError: "",
      company_type: "",
      company_typeError: "",
      mobile: "",
      mobileError: "",
      password: "",
      passwordError: "",
      confirm_password: "",
      confirm_passwordError: "",
      loading: false,
    };
  }

  /* user registration method*/
  async register() {
    const {
      name,
      company_name,
      company_type,
      mobile,
      password,
      confirm_password,
    } = this.state;
    const { navigate } = this.props.navigation;

    var constraints = {
      name: {
        presence: {
          allowEmpty: false,
          message: "^required",
        },
        format: {
          pattern: "[A-Za-z ]+",
          flags: "i",
          message: "^ (characters).",
        },
      },
      company_name: {
        presence: {
          allowEmpty: false,
          message: "^required",
        },
        format: {
          pattern: "[A-Za-z ]+",
          flags: "i",
          message: "^ (characters).",
        },
      },
      company_type: {
        presence: {
          allowEmpty: false,
          message: "^required",
        },
        format: {
          pattern: "[A-Za-z ]+",
          flags: "i",
          message: "^ (characters).",
        },
      },
      mobile: {
        presence: {
          allowEmpty: false,
          message: "^required",
        },
        format: {
          pattern: "[0-9]{10}",
          flags: "i",
          message: "^ (10 digit mobile number).",
        },
      },
      password: {
        presence: {
          allowEmpty: false,
          message: "^required",
        },
        length: {
          minimum: 6,
          tooShort: "needs to have %{count} words or more.",
          message: "^ (min 6 characters).",
        },
      },
      confirm_password: {
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

    Keyboard.dismiss();
    const result = validate(
      {
        name: this.state.name,
        company_name: this.state.company_name,
        company_type: this.state.company_type,
        mobile: this.state.mobile,
        password: this.state.password,
        confirm_password: this.state.confirm_password,
      },
      constraints
    );

    if (result) {
      if (result.name) {
        this.setState({ nameError: result.name });
      } else {
        this.setState({ nameError: "" });
      }
      if (result.company_name) {
        this.setState({ company_nameError: result.company_name });
      } else {
        this.setState({ company_nameError: "" });
      }
      if (result.company_type) {
        this.setState({ company_typeError: result.company_type });
      } else {
        this.setState({ company_typeError: "" });
      }
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
      if (result.confirm_password) {
        this.setState({ confirm_passwordError: result.confirm_password });
      } else {
        this.setState({ confirm_passwordError: "" });
      }
    }

    var signupData = {
      name: this.state.name,
      company_name: this.state.company_name,
      company_type: this.state.company_type,
      mobile: this.state.mobile,
      password: this.state.password,
      role: "customer",
    };

    if (!result) {
      this.setState({ nameError: "" });
      this.setState({ company_nameError: "" });
      this.setState({ company_typeError: "" });
      this.setState({ mobileError: "" });
      this.setState({ passwordError: "" });
      this.setState({ confirm_passwordError: "" });

      this.setState({ loading: true });

      var response = storeOTPAction(signupData).then(
        function (responseJson) {
          if (responseJson.isError == false) {
            sendOTPAction(mobile).then(
              function (responseJson) {
                if (responseJson.type == "success") {
                  navigate("OTP", { data: signupData });
                  this.setState({ loader: false });
                } else {
                  alert(responseJson.message);
                  this.setState({ loader: false });
                }
              }.bind(this)
            );
          } else {
            alert(responseJson.message);
            this.setState({ loading: false });
          }
        }.bind(this)
      );
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
                <Text style={styles.title}>Customer Registration</Text>
              </View>
              <View style={styles.loginbox}>
                {/* <View style={styles.loginlogo}>
                  <Image
                    source={require("../../images/Registration.png")}
                    style={styles.login}
                  ></Image>
                </View> */}
                <View style={styles.input}>
                  <Image
                    source={require("../../images/User-name.png")}
                    style={styles.textimage}
                  ></Image>
                  <TextInput
                    style={styles.textbox}
                    placeholder="Name"
                    onChangeText={(name) => this.setState({ name })}
                  ></TextInput>
                </View>
                <Text style={styles.error}>{this.state.nameError}</Text>

                <View style={styles.input}>
                  <Image
                    source={require("../../images/Company.png")}
                    style={styles.textimage}
                  ></Image>
                  <TextInput
                    style={styles.textbox}
                    placeholder="Company Name"
                    onChangeText={(company_name) =>
                      this.setState({ company_name })
                    }
                  ></TextInput>
                </View>
                <Text style={styles.error}>{this.state.company_nameError}</Text>

                <View style={styles.input}>
                  <Image
                    source={require("../../images/Company.png")}
                    style={styles.textimage}
                  ></Image>
                  <TextInput
                    style={styles.textbox}
                    placeholder="Company Type"
                    onChangeText={(company_type) =>
                      this.setState({ company_type })
                    }
                  ></TextInput>
                </View>
                <Text style={styles.error}>{this.state.company_typeError}</Text>

                <View style={styles.input}>
                  <Image
                    source={require("../../images/Call.png")}
                    style={styles.textimage}
                  ></Image>
                  <TextInput
                    style={styles.textbox}
                    placeholder="Mobile Number"
                    keyboardType="numeric"
                    maxLength={10}
                    onChangeText={(mobile) => this.setState({ mobile })}
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
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                  ></TextInput>
                </View>
                <Text style={styles.error}>{this.state.passwordError}</Text>

                <View style={styles.input}>
                  <Image
                    source={require("../../images/Password.png")}
                    style={styles.textimage}
                  ></Image>
                  <TextInput
                    style={styles.textbox}
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    onChangeText={(confirm_password) =>
                      this.setState({ confirm_password })
                    }
                  ></TextInput>
                </View>
                <Text style={styles.error}>
                  {this.state.confirm_passwordError}
                </Text>

                <View style={styles.buttoncont}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={this.register.bind(this)}
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
                      <Text style={styles.btntext}>Register</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 5,
                    justifyContent: "center",
                  }}
                >
                  <Text style={styles.remtxt}>Already have an Account ? </Text>
                  <TouchableOpacity onPress={() => navigate("Login")}>
                    <Text style={styles.signup}> Login</Text>
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
    //marginBottom: 40
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
  input: {
    flexDirection: "row",
    width: 270,
    borderBottomWidth: 1,
    //marginBottom : 20,
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
    /*resizeMode: 'stretch',*/
    width: 20,
    height: 20,
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
    // marginTop: 15,
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
    marginTop: 40,
    fontSize: 13,
    color: "#000000",
  },
  signup: {
    marginTop: 40,
    fontSize: 13,
    color: colorPrimary,
    textAlign: "left",
    justifyContent: "center",
  },
  error: {
    //position: "absolute",
    //bottom: -5,
    width: 250,
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
  /*icon : {
        width : 20,
        height : 20
    }*/
});
