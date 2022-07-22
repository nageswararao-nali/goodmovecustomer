import React, { Component } from "react";
import NavigationDrawerStructure from "./navigationdrawerstructure";
import LogoImage from "../../Components/applogo";
import { colorPrimary } from "../../Components/colors";
import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  ActivityIndicator,
  View,
  AsyncStorage,
  RefreshControl,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import validate from "validate.js";
import { getProfileAction, editProfileAction } from "../../util/action";

export default class Profile extends Component {
  /** navigation header */
  static navigationOptions = ({ navigation }) => {
    return {
      headerMode: "screen",
      headerTitle: (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginLeft: 25,
            marginTop: 5,
          }}
        >
          <LogoImage style={styles.LogoWrapper} />
          <View style={styles.HeaderTextArea}>
            <Text style={styles.HeaderText}>Profile</Text>
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

  constructor(props) {
    super(props);

    this.state = {
      loader: false,
      name: "",
      name_Err: "",
      company_name: "",
      company_name_Err: "",
      company_type: "",
      company_type_Err: "",
      mobile: "",
      mobile_Err: "",
      password: "",
      password_Err: "",
    };
  }

  /** this method call when screen load */
  componentDidMount() {
    this.getUserData();
  }

  /** get login user detail */
  async getUserData() {
    this.setState({ loader: true });
    const customerID = await AsyncStorage.getItem("userid");
    let Token = await AsyncStorage.getItem("token");
    Token = "Bearer " + Token;
    var profileActiondData = {
      customer_id: customerID,
    };

    getProfileAction(profileActiondData, Token).then((responseJson) => {
      if (responseJson.isError == false) {
        this.setState({
          name: responseJson.result.name,
          mobile: responseJson.result.mobile,
          companyName: responseJson.result.company_name,
          companyType: responseJson.result.company_type,
          loader: false,
        });
      } else {
        alert(responseJson.message);
      }
    });
  }

  /** refresh page */
  onRefresh() {
    this.getUserData();
  }

  /** update and save user detail */
  async save() {
    const { name, password, companyName, companyType, mobile } = this.state;
    var constraints = {
      name: {
        presence: {
          allowEmpty: false,
          message: "^required",
        },
        format: {
          pattern: "[A-Za-z ]+",
          flags: "i",
          message: "^ (characters)",
        },
      },
      companyName: {
        presence: {
          allowEmpty: false,
          message: "^required",
        },
      },
      companyType: {
        presence: {
          allowEmpty: false,
          message: "^required",
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
          message: "^ (10 digit mobile number)",
        },
      },
    };

    const result = validate(
      {
        name: this.state.name,
        companyName: this.state.companyName,
        companyType: this.state.companyType,
        mobile: this.state.mobile,
        password: this.state.password,
      },
      constraints
    );

    Keyboard.dismiss();

    if (result) {
      if (result.name) {
        this.setState({ name_Err: result.name });
      } else {
        this.setState({ name_Err: "" });
      }
      if (result.companyName) {
        this.setState({ companyName_Err: result.companyName });
      } else {
        this.setState({ companyName_Err: "" });
      }
      if (result.companyType) {
        this.setState({ companyType_Err: result.companyType });
      } else {
        this.setState({ companyType_Err: "" });
      }
      if (result.mobile) {
        this.setState({ mobile_Err: result.mobile });
      } else {
        this.setState({ mobile_Err: "" });
      }
    }

    if (this.state.password != "") {
      this.setState({ password_Err: "" });
      var constraints1 = {
        password: {
          presence: true,
          length: {
            minimum: 6,
            message: "^min 6 characters",
          },
        },
      };

      var result1 = validate(
        {
          password: this.state.password,
        },
        constraints1
      );

      if (result1) {
        if (result1.password) {
          this.setState({ password_Err: result1.password });
        } else {
          this.setState({ password_Err: "" });
        }
      }
    }

    if (!result && !result1) {
      this.setState({ name_Err: "" });
      this.setState({ mobile_Err: "" });
      this.setState({ companyName_Err: "" });
      this.setState({ companyType_Err: "" });
      this.setState({ password_Err: "" });

      let Token = await AsyncStorage.getItem("token");
      Token = "Bearer " + Token;

      var EditProfileActiondData = {
        name: name,
        password: password,
        company_name: companyName,
        company_type: companyType,
        mobile: mobile,
      };

      this.setState({ loader: true });
      editProfileAction(EditProfileActiondData, Token).then((responseJson) => {
        if (responseJson.isError == false) {
          alert(responseJson.message);
          this.setState({ loader: false });
        } else {
          alert(responseJson.message);
          this.setState({ loader: false });
        }
      });
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    const { loader } = this.state;

    if (!loader) {
      return (
        // <KeyboardAvoidingView
        // 	style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }}
        // 	behavior="padding" enabled
        // 	keyboardVerticalOffset={100}>
        // 	keyboardVerticalOffset={100}>
        <View style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.select({ android: "height", ios: "padding" })}
            style={{ flex: 1 }}
          >
            <ScrollView style={{ flex: 1 }}>
              <View style={styles.form}>
                <View style={styles.control}>
                  <View style={styles.combine}>
                    <Text style={styles.label}>Name </Text>
                    <Text style={styles.middlelabel}>: </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Name"
                      value={this.state.name}
                      maxLength={30}
                      onChangeText={(name) => this.setState({ name })}
                    ></TextInput>
                  </View>
                  {this.state.name_Err ? (
                    <Text style={styles.error}>{this.state.name_Err}</Text>
                  ) : null}
                </View>
                <View style={styles.control}>
                  <View style={styles.combine}>
                    <Text style={styles.label}>Company Name </Text>
                    <Text style={styles.middlelabel}>: </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Company Name"
                      value={this.state.companyName}
                      maxLength={50}
                      onChangeText={(companyName) =>
                        this.setState({ companyName })
                      }
                    ></TextInput>
                  </View>
                  {this.state.companyName_Err ? (
                    <Text style={styles.error}>
                      {this.state.companyName_Err}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.control}>
                  <View style={styles.combine}>
                    <Text style={styles.label}>Company Type </Text>
                    <Text style={styles.middlelabel}>: </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Company Type"
                      value={this.state.companyType}
                      maxLength={50}
                      onChangeText={(companyType) =>
                        this.setState({ companyType })
                      }
                    ></TextInput>
                  </View>
                  {this.state.companyType_Err ? (
                    <Text style={styles.error}>
                      {this.state.companyType_Err}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.control}>
                  <View style={styles.combine}>
                    <Text style={styles.label}>Mobile No. </Text>
                    <Text style={styles.middlelabel}>:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Mobile No."
                      value={this.state.mobile}
                      editable={false}
                      selectTextOnFocus={false}
                    ></TextInput>
                  </View>
                  {this.state.mobile_Err ? (
                    <Text style={styles.error}>{this.state.mobile_Err}</Text>
                  ) : null}
                </View>
                <View style={styles.control}>
                  <View style={styles.combine}>
                    <Text style={styles.label}>Change Password </Text>
                    <Text style={styles.middlelabel}>: </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Password"
                      secureTextEntry={true}
                      onChangeText={(password) => this.setState({ password })}
                    ></TextInput>
                  </View>
                  {this.state.password_Err ? (
                    <Text style={styles.error}>{this.state.password_Err}</Text>
                  ) : null}
                </View>

                <View style={styles.btncontrol}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.save()}
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
                      <Text style={styles.btntext}>Save Changes</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button1}
                    onPress={() => {
                      navigate("AddressPage");
                    }}
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
                      <Text style={styles.btntext}>Add & View Address</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
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

/** style of this page */
const styles = StyleSheet.create({
  HeaderTextArea: {
    justifyContent: "center",
    alignItems: "center",
  },
  HeaderText: {
    marginLeft: 30,
    marginTop: 20,
    color: colorPrimary,
    fontSize: 25,
    fontWeight: "bold",
  },
  LogoWrapper: {
    marginLeft: 60,
  },
  form: {
    margin: 20,
    width: "90%",
  },
  label: {
    width: "38%",
    fontWeight: "500",
    fontSize: 15,
    marginBottom: 3,
    fontWeight: "400",
    color: "rgba(119,119,119,1)",
    marginTop: 3,
  },
  middlelabel: {
    fontWeight: "600",
    marginTop: 3,
    fontSize: 15,
    width: "3%",
    color: "rgba(119,119,119,1)",
    marginBottom: 3,
  },
  control: {
    marginBottom: "5%",
  },
  combine: {
    flexDirection: "row",
  },
  input: {
    paddingTop: 0,
    width: "59%",
    marginLeft: "auto",
    borderBottomWidth: 1,
    borderColor: "rgba(119,119,119,1)",
  },
  btncontrol: {
    flexDirection: "row",
    marginBottom: "30%",
    marginTop: "20%",
  },
  button: {
    borderRadius: 5,
    borderColor: colorPrimary,
    position: "absolute",
    shadowColor: "#777",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6.22,
    width: 150,
    height: 40,
    textAlign: "center",
    marginLeft: "-1%",
  },
  button1: {
    borderRadius: 5,
    borderColor: colorPrimary,
    position: "absolute",
    shadowColor: "#777",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6.22,
    width: 180,
    height: 40,
    textAlign: "center",
    marginLeft: "50%",
  },
  btntext: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 15,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  error: {
    left: 130,
    width: "55%",
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
