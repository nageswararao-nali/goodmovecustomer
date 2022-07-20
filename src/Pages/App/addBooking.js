import React, { Component } from "react";
import NavigationDrawerStructure from "./navigationdrawerstructure";
import LogoImage from "../../Components/applogo";

import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
  Button,
  Keyboard,
  ScrollView,
  AsyncStorage,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import RadioForm from "react-native-simple-radio-button";
import CheckBox from "expo-checkbox";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import validate from "validate.js";
import { colorPrimary } from "../../Components/colors";
/** device permission */
// import * as Permissions from 'expo-permissions';
import Constants from "expo-constants";

/** import Actions */
import { CategoryAction } from "../../util/action";
import { AddBookingAction } from "../../util/action";
import { sendNotificationAction } from "../../util/action";

/** datepicker */
import DateTimePicker from "react-native-modal-datetime-picker";

import moment from "moment";

import { withNavigation } from "react-navigation";

import { Row, Col } from "react-native-easy-grid";
import InputScrollView from "react-native-input-scroll-view";

var time = [
  { label: "Fixed", value: "Fixed" },
  { label: "Flexible", value: "Flexible" },
];
var today = new Date();

class AddBooking extends Component {
  /** navigation header */
  /*static navigationOptions = ({ navigation }) => {
        return {
            header: null

        };
    };*/
  static navigationOptions = ({ navigation }) => {
    return {
      headerMode: "screen",
      headerTitle: (
        <View style={{ flex: 1, flexDirection: "row", marginTop: 20 }}>
          <LogoImage />
          <View style={styles.HeaderTextArea}>
            <Text style={styles.HeaderText}>Book Vehicle</Text>
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
  async checkBookDetails() {
    await AsyncStorage.getItem("booking_details").then(async (bDetails) => {
      if (bDetails) {
        let booking_details = JSON.parse(bDetails);
        await AsyncStorage.removeItem("booking_details");
        let p_date = booking_details.pickup_date.split("-");
        let p_df = p_date[2] + "-" + p_date[1] + "-" + p_date[0];
        let d_date = booking_details.dropoff_date.split("-");
        let d_df = d_date[2] + "-" + d_date[1] + "-" + d_date[0];
        this.setState({
          id: booking_details.id,
          weight: booking_details.commodity_weight,
          // weight_unit: booking_details.weight_unit,
          pickup_address: booking_details.pickup_location,
          pickup_time: moment(
            p_df + " " + booking_details.pickup_time.split(" ")[0]
          ).format("YYYY-MM-DD HH:mm:ss"),
          pick_flexibility: booking_details.pickuptime_flexiblity_status,
          drop_address: booking_details.dropoff_location,
          drop_time: moment(
            d_df + " " + booking_details.dropoff_time.split(" ")[0]
          ).format("YYYY-MM-DD HH:mm:ss"),
          drop_flexibility: booking_details.dropofftime_flexiblity_status,
          instruction: booking_details.instruction,
          receiver_name: booking_details.receiver_name,
          mobile: booking_details.receiver_contact,
        });
      }
    });
  }
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      saveloader: false,
      pickAddressId: "",
      dropAddressId: "",
      //picktime : '',
      weight: "",
      weight_Err: "",
      weight_unit: 12,
      weight_unit_Err: "",
      pack_type: "",
      pack_type_Err: "",
      length: "",
      length_Err: "",
      length_unit: "",
      length_unit_Err: "",
      breadth: "",
      breadth_Err: "",
      breadth_unit: "",
      breadth_unit_Err: "",
      height: "",
      height_Err: "",
      height_unit: "",
      height_unit_Err: "",
      dimension_unit_Err: "",
      commodity_type: "",
      commodity_type_Err: "",
      pickup_time: "",
      pick_time_Err: "",
      pickup_add: "",
      pickup_add_Err: "",
      pick_flexibility: "Fixed",
      drop_flexibility: "Fixed",
      pick_flex_time: "",
      pick_flex_time_Err: "",
      dropmindate: today,
      drop_time: "",
      drop_time_Err: "",
      drop_add: "",
      drop_add_Err: "",
      drop_flex_time: "",
      drop_flex_time_Err: "",
      photo: null,
      photo_Err: "",
      filename: "",
      receiver_name: "",
      receiver_name_Err: "",
      mobile: "",
      mobile_Err: "",
      instruction: "",
      instruction_Err: "",
      isPickVisible: false,
      isDropVisible: false,
      dbpackage_type: "",
      dbdimension_unit: "",
      dbweight_unit: "",
      dbvolumn_unit: "",
      dblenght_unit: "",
      dbheight_unit: "",
      dbbreadth_unit: "",
      dbcommodity_type_types: "",
      photoResult: "",
      drop_address: "",
      pickup_address: "",
      volumn_unit: 35,
      length_unit: 37,
      breadth_unit: 37,
      height_unit: 37,
      dimension_unit: 37,
      responseJson: "",
      dbdevice_token: "",
      pickLattitude: "",
      pickLongittude: "",
      commodity_type_name: "",
      commodity_type_name_Err: "",
      pick_city: "",
      pick_state: "",
      pick_pincode: "",
      pick_country: "",
      drop_city: "",
      drop_state: "",
      drop_pincode: "",
      drop_country: "",
      dropLattitude: "",
      dropLongittude: "",
      packaging_type: 1,
    };
  }

  /* pickup date picker */
  showPickupPicker = () => {
    this.setState({ isPickVisible: true });
    Keyboard.dismiss();
  };
  PickupDatePicker = (datetime) => {
    this.setState({ isPickVisible: false });
    this.setState({ dropmindate: datetime });
    this.setState({ drop_time: "" });

    var picktime = moment(datetime).format("YYYY-MM-DD HH:mm:ss");
    var currentDateTime = moment(new Date())
      .add(1, "hour")
      .format("YYYY-MM-DD HH:mm:ss");
    var currentDate = moment().format("YYYY-MM-DD HH:mm:ss");

    if (picktime < currentDateTime) {
      this.setState({
        pickup_time: moment(new Date())
          .add(1, "hour")
          .format("YYYY-MM-DD HH:mm:ss"),
      });
    } else {
      this.setState({
        pickup_time: moment(datetime).format("YYYY-MM-DD HH:mm:ss"),
      });
    }
  };
  hidePickupPicker = () => {
    this.setState({ isPickVisible: false });
  };
  /* end  pickup date picker */

  /* Drop-off date picker */
  showDropPicker = () => {
    this.setState({ isDropVisible: true });
    Keyboard.dismiss();
  };
  DropDatePicker = (datetime) => {
    moment.locale("en");
    this.setState({ isDropVisible: false });

    var drop = moment(datetime).format("YYYY-MM-DD HH:mm:ss");
    var dropTime = moment(this.state.pickup_time)
      .add(1, "hour")
      .format("YYYY-MM-DD HH:mm:ss");

    if (this.state.pickup_time >= drop) {
      this.setState({
        drop_time: moment(this.state.pickup_time)
          .add(1, "hour")
          .format("YYYY-MM-DD HH:mm:ss"),
      });
    } else if (drop <= dropTime) {
      this.setState({
        drop_time: moment(this.state.pickup_time)
          .add(1, "hour")
          .format("YYYY-MM-DD HH:mm:ss"),
      });
    } else if (this.state.pickup_time < dropTime) {
      this.setState({
        drop_time: moment(datetime).format("YYYY-MM-DD HH:mm:ss"),
      });
    } else {
      this.setState({
        drop_time: moment(datetime).format("YYYY-MM-DD HH:mm:ss"),
      });
    }
  };
  hideDropPicker = () => {
    this.setState({ isDropVisible: false });
  };
  /* end drop date picker */

  /** this method call when screen load */
  componentDidMount() {
    this.getPermissionAsync();
    this.setState({ pick_flexibility: "Fixed" });
    this.setState({ drop_flexibility: "Fixed" });
    this.getCategory();

    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.reEnterAddress();
      this.checkBookDetails();
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  /** this method to set address in pick up and drop off textbox when back from add address page */
  async reEnterAddress() {
    const { navigation } = this.props;
    const addressId = navigation.getParam("itemId");
    const address = navigation.getParam("address");
    const addressType = navigation.getParam("addressType");
    const pickLat = navigation.getParam("pickLat");
    const pickLang = navigation.getParam("pickLang");
    const city = navigation.getParam("city");
    const state = navigation.getParam("state");
    const pincode = navigation.getParam("pincode");
    const country = navigation.getParam("country");
    const receiver_name = navigation.getParam("receiver_name");
    const receiver_contact = navigation.getParam("receiver_contact");
    console.log(addressId, addressType, receiver_contact, receiver_name);
    if (addressId) {
      if (addressType == "Pickup") {
        this.setState({
          pickAddressId: addressId,
          pickup_address: address,
          pickLattitude: pickLat,
          pickLongittude: pickLang,
          pick_city: city,
          pick_state: state,
          pick_pincode: pincode,
          pick_country: country,
          // receiver_name: receiver_name,
          // mobile: receiver_contact
        });
      } else {
        this.setState({
          dropAddressId: addressId,
          drop_address: address,
          dropLattitude: pickLat,
          dropLongittude: pickLang,
          drop_city: city,
          drop_state: state,
          drop_pincode: pincode,
          drop_country: country,
          receiver_name: receiver_name,
          mobile: receiver_contact,
        });
      }
    }
  }

  /** get all category */
  getCategory = async () => {
    this.setState({ saveloader: true });
    var response = CategoryAction().then(
      function (responseJson) {
        if (responseJson.isError == false) {
          this.setState({
            dbpackage_type: responseJson.result.packaging_types,
          });
          this.setState({
            dbweight_unit: responseJson.result.weight_unit_types,
          });
          this.setState({
            dbvolumn_unit: responseJson.result.volume_unit_types,
          });
          this.setState({
            dbdimension_unit: responseJson.result.dimension_unit_types,
          });
          this.setState({
            dblenght_unit: responseJson.result.length_unit_types,
          });
          this.setState({
            dbheight_unit: responseJson.result.height_unit_types,
          });
          this.setState({
            dbbreadth_unit: responseJson.result.breadth_unit_types,
          });
          this.setState({
            dbcommodity_type_types: responseJson.result.commodity_type_types,
          });
          this.setState({ saveloader: false });
        } else {
          alert(responseJson.message);
        }
      }.bind(this)
    );
  };

  /** device permission */
  getPermissionAsync = async () => {
    if (Constants.platform.ios || Constants.platform.android) {
      /* const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            } */
    }
  };

  /** pickup time flexibility dropdown show */
  async picktime(value) {
    if (value == "Flexible") {
      this.setState({ showpick: true });
      this.setState({ pick_flexibility: value });
    } else {
      this.setState({ showpick: false });
      this.setState({ pick_flexibility: value });
    }
  }

  /** drop time flexibility dropdown show */
  async droptime(value) {
    if (value == "Flexible") {
      this.setState({ showdrop: true });
      this.setState({ drop_flexibility: value });
    } else {
      this.setState({ showdrop: false });
      this.setState({ drop_flexibility: value });
    }
  }

  /** photo choose from gallary */
  handleChoosePhoto = async () => {
    let Photoresult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Image,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (Photoresult.cancelled != true) {
      this.setState({ photo: Photoresult.base64 });
      this.setState({
        filename: Photoresult.uri.substring(
          Photoresult.uri.lastIndexOf("/") + 1
        ),
      });
      this.setState({ photoResult: Photoresult });
    }
  };

  /** add booking */
  async submit() {
    const {
      weight,
      weight_unit,
      packaging_type,
      volumn,
      volumn_unit,
      length,
      length_unit,
      breadth,
      breadth_unit,
      height,
      height_unit,
      commodity_type,
      pickup_time,
      pickup_address,
      pick_flex_time,
      drop_time,
      drop_address,
      drop_flex_time,
      photo,
      receiver_name,
      mobile,
      instruction,
      dimension_unit,
      commodity_type_name,
    } = this.state;

    var constraints = {
      weight: {
        presence: {
          allowEmpty: false,
          message: "^required",
        },
        format: {
          pattern: "[0-9]+(.[0-9][0-9]?)?",
          flags: "i",
          message: "^ (numbers)",
        },
      },
      weight_unit: {
        presence: {
          allowEmpty: false,
          message: "^required",
        },
      },
      /*packaging_type: {
                presence: {
                    allowEmpty: false,
                    message: "^required"
                }
            },
            commodity_type: {
                presence: {
                    allowEmpty: false,
                    message: "^required"
                }
            },*/
      pickup_time: {
        presence: {
          allowEmpty: false,
          message: "^required",
        },
      },
      pickup_address: {
        presence: {
          allowEmpty: false,
          message: "^required",
        },
      },
      drop_time: {
        presence: {
          allowEmpty: false,
          message: "^required",
        },
        equality: {
          attribute: "pickup_time",
          message: "^ should not same as pickup time",
          comparator: function (v1, v2) {
            return JSON.stringify(v1) >= JSON.stringify(v2);
          },
        },
      },
      drop_address: {
        presence: {
          allowEmpty: false,
          message: "^required",
        },
        equality: {
          attribute: "pickup_address",
          message: "^ (should not same as pickup location)",
          comparator: function (v1, v2) {
            return (
              JSON.stringify(v1.toLowerCase()) !=
              JSON.stringify(v2.toLowerCase())
            );
          },
        },
      },
      /*photo: {
                presence: {
                    allowEmpty: false,
                    message: "^required"
                }
            },
            receiver_name: {
                presence: {
                    allowEmpty: false,
                    message: "^required"
                },
                format: {
                    pattern: "[A-Za-z ]+",
                    flags: "i",
                    message: "^ (characters)"
                }
            },
            mobile: {
                presence: {
                    allowEmpty: false,
                    message: "^required"
                },
                format: {
                    pattern: "[0-9]{10}",
                    flags: "i",
                    message: "^ (10 digit mobile number)"
                },

            },*/
    };

    if (
      this.state.packaging_type == 28 ||
      this.state.packaging_type == 30 ||
      this.state.packaging_type == 34
    ) {
      this.setState({ length_Err: "" });
      this.setState({ breadth_Err: "" });
      this.setState({ height_Err: "" });
      this.setState({ dimension_unit_Err: "" });
      var constraints1 = {
        volumn: {
          presence: {
            allowEmpty: false,
            message: "^required",
          },
          format: {
            pattern: "[0-9]+(.[0-9][0-9]?)?",
            flags: "i",
            message: "^ (numbers)",
          },
        },
        volumn_unit: {
          presence: {
            allowEmpty: false,
            message: "^required",
          },
        },
      };

      var result1 = validate(
        {
          volumn: this.state.volumn,
          volumn_unit: this.state.volumn_unit,
        },
        constraints1
      );

      if (result1) {
        if (result1.volumn) {
          this.setState({ volumn_Err: result1.volumn });
        } else {
          this.setState({ volumn_Err: "" });
        }
        if (result1.volumn_unit) {
          this.setState({ volumn_unit_Err: result1.volumn_unit });
        } else {
          this.setState({ volumn_unit_Err: "" });
        }
      }
    }

    if (
      this.state.packaging_type == 29 ||
      this.state.packaging_type == 31 ||
      this.state.packaging_type == 32 ||
      this.state.packaging_type == 33
    ) {
      this.setState({ volumn_Err: "" });
      this.setState({ volumn_unit_Err: "" });
      var constraints2 = {
        length: {
          presence: {
            allowEmpty: false,
            message: "^required",
          },
          format: {
            pattern: "[0-9]+(.[0-9][0-9]?)?",
            flags: "i",
            message: "^ (numbers)",
          },
        },
        breadth: {
          presence: {
            allowEmpty: false,
            message: "^required",
          },
          format: {
            pattern: "[0-9]+(.[0-9][0-9]?)?",
            flags: "i",
            message: "^ (numbers)",
          },
        },
        height: {
          presence: {
            allowEmpty: false,
            message: "^required",
          },
          format: {
            pattern: "[0-9]+(.[0-9][0-9]?)?",
            flags: "i",
            message: "^ (numbers)",
          },
        },
        dimension_unit: {
          presence: {
            allowEmpty: false,
            message: "^required",
          },
        },
      };

      var result1 = validate(
        {
          length: this.state.length,
          breadth: this.state.breadth,
          height: this.state.height,
          dimension_unit: this.state.dimension_unit,
        },
        constraints2
      );

      if (result1) {
        if (result1.length) {
          this.setState({ length_Err: result1.length });
        } else {
          this.setState({ length_Err: "" });
        }
        if (result1.breadth) {
          this.setState({ breadth_Err: result1.breadth });
        } else {
          this.setState({ breadth_Err: "" });
        }
        if (result1.height) {
          this.setState({ height_Err: result1.height });
        } else {
          this.setState({ height_Err: "" });
        }
        if (result1.dimension_unit) {
          this.setState({ dimension_unit_Err: result1.dimension_unit });
        } else {
          this.setState({ dimension_unit_Err: "" });
        }
      }
    }

    if (this.state.commodity_type == 43) {
      this.setState({ commodity_type_name_Err: "" });
      var constraints3 = {
        commodity_type_name: {
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
      };

      var result2 = validate(
        {
          commodity_type_name: this.state.commodity_type_name,
        },
        constraints3
      );

      if (result2) {
        if (result2.commodity_type_name) {
          this.setState({
            commodity_type_name_Err: result2.commodity_type_name,
          });
        } else {
          this.setState({ commodity_type_name_Err: "" });
        }
      }
    }

    const result = validate(
      {
        weight: this.state.weight,
        weight_unit: this.state.weight_unit,
        // packaging_type: this.state.packaging_type,
        // commodity_type: this.state.commodity_type,
        pickup_time: this.state.pickup_time,
        pickup_address: this.state.pickup_address,
        drop_time: this.state.drop_time,
        drop_address: this.state.drop_address,
        // photo: this.state.photo,
        // receiver_name: this.state.receiver_name,
        // mobile: this.state.mobile
      },
      constraints
    );

    if (result) {
      if (result.weight) {
        this.setState({ weight_Err: result.weight });
      } else {
        this.setState({ weight_Err: "" });
      }
      if (result.weight_unit) {
        this.setState({ weight_unit_Err: result.weight_unit });
      } else {
        this.setState({ weight_unit_Err: "" });
      }
      if (result.packaging_type) {
        this.setState({ pack_type_Err: result.packaging_type });
      } else {
        this.setState({ pack_type_Err: "" });
      }
      if (result.commodity_type) {
        this.setState({ commodity_type_Err: result.commodity_type });
      } else {
        this.setState({ commodity_type_Err: "" });
      }
      if (result.pickup_address) {
        this.setState({ pickup_add_Err: result.pickup_address });
      } else {
        this.setState({ pickup_add_Err: "" });
      }
      if (result.pickup_time) {
        this.setState({ pickup_time_Err: result.pickup_time });
      } else {
        this.setState({ pickup_time_Err: "" });
      }
      if (result.drop_address) {
        this.setState({ drop_add_Err: result.drop_address });
      } else {
        this.setState({ drop_add_Err: "" });
      }
      if (result.drop_time) {
        this.setState({ drop_time_Err: result.drop_time });
      } else {
        this.setState({ drop_time_Err: "" });
      }
      if (result.photo) {
        this.setState({ photo_Err: result.photo });
      } else {
        this.setState({ photo_Err: "" });
      }
      if (result.receiver_name) {
        this.setState({ receiver_name_Err: result.receiver_name });
      } else {
        this.setState({ receiver_name_Err: "" });
      }
      if (result.mobile) {
        this.setState({ mobile_Err: result.mobile });
      } else {
        this.setState({ mobile_Err: "" });
      }
    }

    if (this.state.pick_flexibility == "Flexible") {
      this.setState({ pick_flex_time_Err: "" });
      var constraints4 = {
        pick_flex_time: {
          presence: {
            allowEmpty: false,
            message: "^required",
          },
        },
      };

      var result3 = validate(
        {
          pick_flex_time: this.state.pick_flex_time,
        },
        constraints4
      );

      if (result3) {
        if (result3.pick_flex_time) {
          this.setState({ pick_flex_time_Err: result3.pick_flex_time });
        } else {
          this.setState({ pick_flex_time_Err: "" });
        }
      }
    }

    if (this.state.drop_flexibility == "Flexible") {
      this.setState({ drop_flex_time_Err: "" });
      var constraints5 = {
        drop_flex_time: {
          presence: {
            allowEmpty: false,
            message: "^required",
          },
        },
      };

      var result4 = validate(
        {
          drop_flex_time: this.state.drop_flex_time,
        },
        constraints5
      );

      if (result4) {
        if (result4.drop_flex_time) {
          this.setState({ drop_flex_time_Err: result4.drop_flex_time });
        } else {
          this.setState({ drop_flex_time_Err: "" });
        }
      }
    }

    let customer_id = await AsyncStorage.getItem("userid");
    console.log(customer_id, "customer id ....");
    const formData = new FormData();
    formData.append("id", this.state.id);
    formData.append("customer_id", customer_id);
    formData.append("pickup_location", this.state.pickup_address);
    formData.append("pickup_time", this.state.pickup_time);
    formData.append(
      "pickuptime_flexiblity_status",
      this.state.pick_flexibility
    );
    formData.append("pickup_flexible_time", this.state.pick_flex_time);
    formData.append("dropoff_location", this.state.drop_address);
    formData.append("dropoff_time", this.state.drop_time);
    formData.append(
      "dropofftime_flexiblity_status",
      this.state.drop_flexibility
    );
    formData.append("dropoff_flexible_time", this.state.drop_flex_time);
    // formData.append('commodity_type', this.state.commodity_type);
    formData.append("commodity_type", 1);
    formData.append("commodity_weight", this.state.weight);
    // formData.append('commodity_weight', 1);
    formData.append("weight_unit", this.state.weight_unit);
    formData.append("commodity_whole_volume", this.state.volumn);
    formData.append("volume_unit", this.state.volumn_unit);
    formData.append("commodity_length", this.state.length);
    formData.append("length_unit", this.state.length_unit);
    formData.append("commodity_breadth", this.state.breadth);
    formData.append("breadth_unit", this.state.breadth_unit);
    formData.append("commodity_height", this.state.height);
    formData.append("height_unit", this.state.height_unit);
    // formData.append('packaging_type', this.state.packaging_type);
    formData.append("packaging_type", 1);
    // formData.append('receiver_name', this.state.receiver_name);
    formData.append(
      "receiver_name",
      this.state.receiver_name ? this.state.receiver_name : "Prakash"
    );
    // formData.append('receiver_contact', this.state.mobile);
    formData.append(
      "receiver_contact",
      this.state.mobile ? this.state.mobile : "7010020749"
    );
    formData.append("instruction", this.state.instruction);
    formData.append(
      "pickup_lat",
      this.state.pickLattitude ? this.state.pickLattitude : 13.098312
    );
    formData.append(
      "pickup_long",
      this.state.pickLongittude ? this.state.pickLongittude : 80.175435
    );
    formData.append("pickup_city", this.state.pick_city);
    formData.append("pickup_state", this.state.pick_state);
    formData.append("pickup_country", this.state.pick_country);
    formData.append("pickup_pincode", this.state.pick_pincode);

    formData.append("dropoff_city", this.state.drop_city);
    formData.append("dropoff_state", this.state.drop_state);
    formData.append("dropoff_country", this.state.drop_country);
    formData.append("dropoff_pincode", this.state.drop_pincode);

    formData.append(
      "dropoff_lat",
      this.state.dropLattitude ? this.state.dropLattitude : 13.098312
    );
    formData.append(
      "dropoff_long",
      this.state.dropLongittude ? this.state.dropLongittude : 80.175435
    );
    formData.append("assign_tour_status", 0);
    formData.append("other_commodity_name", this.state.commodity_type_name);
    /*formData.append('consignment_image', {
            uri: this.state.photoResult.uri,
            name: 'image.jpg',
            type: 'image/jpg'
        });*/
    if (!result && !result1 && !result2 && !result3 && !result4) {
      let Token = await AsyncStorage.getItem("token");
      Token = "Bearer " + Token;

      this.setState({ saveloader: true });
      console.log(formData);
      var response = AddBookingAction(formData, Token).then((responseJson) => {
        console.log("responseJson");
        console.log(responseJson);
        console.log(responseJson.result);
        if (responseJson.isError == false) {
          for (let device of responseJson.result) {
            this.sendNotification(device.token, device.booking_id);
          }
          alert(responseJson.message);
          this.clearText();

          this.setState({ saveloader: false });
          this.props.navigation.push("MyBooking");
        } else {
          alert(responseJson.message);
          this.setState({ saveloader: false });
        }
      });
    }
  }
  async clearText() {
    this.setState({
      //picktime : '',
      weight: "",
      weight_Err: "",
      // weight_unit: '', weight_unit_Err: '',
      pack_type: "",
      pack_type_Err: "",
      length: "",
      length_Err: "",
      length_unit: "",
      length_unit_Err: "",
      breadth: "",
      breadth_Err: "",
      breadth_unit: "",
      breadth_unit_Err: "",
      volumn: "",
      volumn_Err: "",
      volumn_unit: "",
      volumn_unit_Err: "",
      height: "",
      height_Err: "",
      height_unit: "",
      height_unit_Err: "",
      commodity_type: "",
      commodity_type_Err: "",
      pickup_time: "",
      pickup_time_Err: "",
      pickup_add: "",
      pickup_add_Err: "",
      pick_flexibility: "Fixed",
      drop_flexibility: "Fixed",
      showpick: "",
      showdrop: "",
      pick_flex_time: "",
      pick_flex_time_Err: "",
      drop_time: "",
      drop_time_Err: "",
      drop_add: "",
      drop_add_Err: "",
      drop_flex_time: "",
      drop_flex_time_Err: "",
      photo: null,
      photo_Err: "",
      filename: "",
      receiver_name: "",
      receiver_name_Err: "",
      mobile: "",
      mobile_Err: "",
      instruction: "",
      instruction_Err: "",
      isPickVisible: false,
      isDropVisible: false,
      packaging_type: 1,
      drop_address: "",
      pickup_address: "",
      volumn_unit: 35,
      length_unit: 37,
      breadth_unit: 37,
      height_unit: 37,
      dimension_unit: 37,

      photoResult: "",
      commodity_type_name_Err: "",
      commodity_type_name: "",
      pickLattitude: "",
      pickLongittude: "",
      pick_city: "",
      pick_state: "",
      pick_pincode: "",
      pick_country: "",
      drop_city: "",
      drop_state: "",
      drop_pincode: "",
      drop_country: "",
      dropLattitude: "",
      dropLongittude: "",
    });
  }

  /** Send Notification */
  async sendNotification(token, booking) {
    /* const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
            return;
        } */

    let Token = await AsyncStorage.getItem("token");

    Token = "Bearer " + Token;

    var title = "Customer Notification";
    var msg = "New Booking Received. Booking ID : #" + booking;
    var response = sendNotificationAction(token, title, msg).then(
      (responseJson) => {}
    );
  }

  /** refresh page */
  onRefresh() {
    this.getCategory();
    this.clearText();
  }

  render() {
    const { navigate } = this.props.navigation;

    const packagTypes = [];
    for (let userObject of this.state.dbpackage_type) {
      packagTypes.push(
        <Picker.Item
          value={userObject.id}
          label={userObject.cate_name}
          key={userObject.id}
        ></Picker.Item>
      );
    }

    const weightUnit = [];
    for (let userObject of this.state.dbweight_unit) {
      weightUnit.push(
        <Picker.Item
          value={userObject.id}
          label={userObject.cate_name}
          key={userObject.id}
        ></Picker.Item>
      );
    }

    const volumnUnit = [];
    for (let userObject of this.state.dbvolumn_unit) {
      volumnUnit.push(
        <Picker.Item
          value={userObject.id}
          label={userObject.cate_name}
          key={userObject.id}
        ></Picker.Item>
      );
    }

    const dimensionUnit = [];
    for (let userObject of this.state.dbdimension_unit) {
      dimensionUnit.push(
        <Picker.Item
          value={userObject.id}
          label={userObject.cate_name}
          key={userObject.id}
        ></Picker.Item>
      );
    }

    const lenghtUnit = [];
    for (let userObject of this.state.dblenght_unit) {
      lenghtUnit.push(
        <Picker.Item
          value={userObject.id}
          label={userObject.cate_name}
          key={userObject.id}
        ></Picker.Item>
      );
    }

    const heightUnit = [];
    for (let userObject of this.state.dbheight_unit) {
      heightUnit.push(
        <Picker.Item
          value={userObject.id}
          label={userObject.cate_name}
          key={userObject.id}
        ></Picker.Item>
      );
    }

    const breadthUnit = [];
    for (let userObject of this.state.dbbreadth_unit) {
      breadthUnit.push(
        <Picker.Item
          value={userObject.id}
          label={userObject.cate_name}
          key={userObject.id}
        ></Picker.Item>
      );
    }

    const commodity_type = [];

    for (let userObject of this.state.dbcommodity_type_types) {
      commodity_type.push(
        <Picker.Item
          value={userObject.id}
          label={userObject.cate_name}
          key={userObject.id}
        ></Picker.Item>
      );
    }

    const { saveloader } = this.state;
    if (!saveloader) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.select({ android: "height", ios: "padding" })}
          style={{ flex: 1 }}
        >
          <ScrollView style={{ flexgrow: 1 }}>
            <View style={styles.container}>
              <View style={styles.form}>
                <View style={styles.control}>
                  <Text style={styles.label}>Commodity Weight</Text>
                  <View style={styles.combine}>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      placeholder="Enter Weight"
                      onChangeText={(weight) => this.setState({ weight })}
                      value={this.state.weight}
                    ></TextInput>
                    <Picker
                      selectedValue={this.state.weight_unit}
                      style={styles.picker}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({ weight_unit: itemValue })
                      }
                    >
                      {weightUnit}
                    </Picker>
                  </View>
                  {this.state.weight_Err ? (
                    <Text style={styles.error}>{this.state.weight_Err}</Text>
                  ) : null}
                  {this.state.weight_unit_Err ? (
                    <Text style={styles.error}>
                      {this.state.weight_unit_Err}
                    </Text>
                  ) : null}
                </View>
                {/*
                                <View style={styles.control}>
                                    <Text style={styles.label}>Packaging Type</Text>
                                    <View style={styles.pickerPack}>
                                        <Picker
                                            selectedValue={this.state.packaging_type}
                                            style={styles.pickdropdown}
                                            onValueChange={(itemValue, itemIndex) =>
                                                this.setState({ packaging_type: itemValue })
                                            }>
                                            <Picker.Item style={styles.label} label="- Select Type -" ></Picker.Item>
                                            {packagTypes}
                                        </Picker>
                                    </View>
                                    {this.state.pack_type_Err ? <Text style={styles.error}>{this.state.pack_type_Err}</Text> : null}
                                </View>
                                */}
                {this.state.packaging_type == 28 ||
                this.state.packaging_type == 30 ||
                this.state.packaging_type == 34 ? (
                  <View style={styles.control}>
                    <Text style={styles.label}>Volume</Text>
                    <View style={styles.combine}>
                      <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="Enter Volume"
                        onChangeText={(volumn) => this.setState({ volumn })}
                        value={this.state.volumn}
                      ></TextInput>
                      <Picker
                        selectedValue={this.state.volumn_unit}
                        style={styles.picker}
                        onValueChange={(itemValue, itemIndex) =>
                          this.setState({ volumn_unit: itemValue })
                        }
                      >
                        {volumnUnit}
                      </Picker>
                    </View>
                    {this.state.volumn_Err ? (
                      <Text style={styles.error}>{this.state.volumn_Err}</Text>
                    ) : null}
                    {this.state.volumn_unit_Err ? (
                      <Text style={styles.error}>
                        {this.state.volumn_unit_Err}
                      </Text>
                    ) : null}
                  </View>
                ) : null}

                {this.state.packaging_type == 29 ||
                this.state.packaging_type == 31 ||
                this.state.packaging_type == 32 ||
                this.state.packaging_type == 33 ? (
                  <View>
                    <View style={[styles.control, { flexDirection: "row" }]}>
                      <View style={{ width: "23%" }}>
                        <Text style={styles.label}>Length</Text>
                        <View style={styles.DimensionInput}>
                          <TextInput
                            style={styles.inputDim}
                            keyboardType="numeric"
                            placeholder="L"
                            onChangeText={(length) => this.setState({ length })}
                            value={this.state.length}
                          ></TextInput>
                        </View>
                      </View>
                      <View style={{ width: "23%" }}>
                        <Text style={styles.label}>Breadth</Text>
                        <View style={styles.DimensionInput}>
                          <TextInput
                            style={styles.inputDim}
                            keyboardType="numeric"
                            placeholder="B"
                            onChangeText={(breadth) =>
                              this.setState({ breadth })
                            }
                            value={this.state.breadth}
                          ></TextInput>
                        </View>
                      </View>
                      <View style={{ width: "23%" }}>
                        <Text style={styles.label}>Height</Text>
                        <View style={styles.DimensionInput}>
                          <TextInput
                            style={styles.inputDim}
                            keyboardType="numeric"
                            placeholder="H"
                            onChangeText={(height) => this.setState({ height })}
                            value={this.state.height}
                          ></TextInput>
                        </View>
                      </View>
                      <View style={{ width: "30%" }}>
                        <Text style={styles.label}>Unit</Text>
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: "rgba(119,119,119,0.6)",
                            borderRadius: 5,
                            paddingTop: 5,
                            paddingBottom: 5,
                          }}
                        >
                          <Picker
                            selectedValue={this.state.dimension_unit}
                            style={{
                              borderWidth: 1,
                              borderColor: "blue",
                              height: 29,
                            }}
                            onValueChange={(itemValue, itemIndex) =>
                              this.setState({
                                height_unit: itemValue,
                                breadth_unit: itemValue,
                                length_unit: itemValue,
                                dimension_unit: itemValue,
                              })
                            }
                          >
                            {dimensionUnit}
                          </Picker>
                        </View>
                      </View>
                    </View>
                    <View>
                      {this.state.height_Err ? (
                        <Text style={styles.error}>
                          {this.state.height_Err}
                        </Text>
                      ) : null}
                      {this.state.breadth_Err ? (
                        <Text style={styles.error}>
                          {this.state.breadth_Err}
                        </Text>
                      ) : null}
                      {this.state.length_Err ? (
                        <Text style={styles.error}>
                          {this.state.length_Err}
                        </Text>
                      ) : null}
                      {this.state.dimension_unit_Err_Err ? (
                        <Text style={styles.error}>
                          {this.state.dimension_unit_Err_Err}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                ) : null}
                {/*
                                <View style={styles.control}>
                                    <Text style={styles.label}>Commodity Type</Text>

                                    <View style={styles.pickerPack}>
                                        <Picker
                                            selectedValue={this.state.commodity_type}
                                            style={styles.pickdropdown}
                                            onValueChange={(itemValue, itemIndex) =>
                                                this.setState({ commodity_type: itemValue })
                                            }>
                                            <Picker.Item style={styles.label} label="- Select Type -" ></Picker.Item>
                                            {commodity_type}
                                        </Picker>
                                    </View>
                                    {this.state.commodity_type_Err ? <Text style={styles.error}>{this.state.commodity_type_Err}</Text> : null}
                                </View>
                                {this.state.commodity_type == 43 ?
                                    (<View style={styles.control}>
                                        <Text style={styles.label}>Commodity Type Name</Text>
                                        <View style={styles.pickadd}>
                                            <TextInput style={styles.inputPackaging}
                                                placeholder="Enter Commodity Type Name"
                                                onChangeText={(commodity_type_name) => this.setState({ commodity_type_name })}
                                                value={this.state.commodity_type_name}
                                            >
                                            </TextInput>
                                        </View>

                                        {this.state.commodity_type_name_Err ? <Text style={styles.error}>{this.state.commodity_type_name_Err}</Text> : null}
                                    </View>)
                                    : null}
                                */}
                <View style={styles.control}>
                  <Text style={styles.label}>Pickup Location</Text>

                  <Row style={styles.pickadd}>
                    <Col style={{ width: "6%" }}>
                      <Image
                        source={require("../../images/booking-list-icon/Pickup-50x50.png")}
                        style={styles.icon}
                      ></Image>
                    </Col>

                    <Col
                      style={{
                        width: "86%",
                        paddingLeft: "2%",
                        paddingLeft: "1%",
                        paddingRight: "1%",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          navigate("AddressPage", { address_type: "Pickup" })
                        }
                      >
                        <TextInput
                          placeholder="Select address from map"
                          editable={false}
                          selectTextOnFocus={true}
                          onChangeText={(pickup_address) =>
                            this.setState({ pickup_address })
                          }
                          value={this.state.pickup_address}
                        ></TextInput>
                      </TouchableOpacity>
                    </Col>
                    <Col style={{ width: "8%" }}>
                      <TouchableOpacity
                        onPress={() =>
                          navigate("AddressPage", { address_type: "Pickup" })
                        }
                      >
                        <Image
                          source={require("../../images/Detact-Location.png")}
                          style={{ width: 20, height: 20, marginTop: 5 }}
                        ></Image>
                      </TouchableOpacity>
                    </Col>
                  </Row>
                  {this.state.pickup_add_Err ? (
                    <Text style={styles.error}>
                      {this.state.pickup_add_Err}
                    </Text>
                  ) : null}
                </View>

                <View style={styles.control}>
                  <Text style={styles.label}>Pickup Time</Text>
                  <View style={styles.pickadd}>
                    <TextInput
                      style={styles.inputAddress}
                      placeholder="Enter Time"
                      onFocus={this.showPickupPicker}
                      value={this.state.pickup_time}
                    ></TextInput>

                    <Text
                      style={{
                        alignItems: "flex-end",
                        paddingTop: 5,
                        paddingRight: 5,
                        color: "#777",
                      }}
                    >
                      {this.state.showpick ? "Flexible" : "Fixed"}
                    </Text>
                  </View>

                  <DateTimePicker
                    isVisible={this.state.isPickVisible}
                    onConfirm={this.PickupDatePicker}
                    onCancel={this.hidePickupPicker}
                    mode={"datetime"}
                    minimumDate={today}
                    is24Hour={true}
                  />
                  {this.state.pickup_time_Err ? (
                    <Text style={styles.error}>
                      {this.state.pickup_time_Err}
                    </Text>
                  ) : null}
                </View>
                {/*
                                <View style={styles.control}>
                                    <Text style={styles.label}>Pickup Time Flexibility</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <RadioForm
                                            radio_props={time}
                                            onPress={(value) => this.picktime(value)}
                                            formHorizontal={true}
                                            buttonSize={10}
                                            selectedButtonColor={"green"}
                                            buttonColor={"#777"}
                                            labelStyle={{ marginRight: 50, }}
                                        ></RadioForm>
                                    </View>
                                </View>
                                */}
                {this.state.showpick ? (
                  <View style={styles.control}>
                    <Text style={styles.label}>
                      Select Pickup Time Flexibility
                    </Text>
                    <View style={styles.pickerPack}>
                      <Picker
                        selectedValue={this.state.pick_flex_time}
                        style={styles.pickdropdown}
                        onValueChange={(itemValue, itemIndex) =>
                          this.setState({ pick_flex_time: itemValue })
                        }
                      >
                        <Picker.Item
                          style={styles.label}
                          label="- Select -"
                        ></Picker.Item>
                        <Picker.Item
                          style={styles.label}
                          label="30 minutes"
                          value="30 minutes"
                        ></Picker.Item>
                        <Picker.Item
                          style={styles.label}
                          label="1 hours"
                          value="1 hours"
                        ></Picker.Item>
                        <Picker.Item
                          style={styles.label}
                          label="2 hours"
                          value="2 hours"
                        ></Picker.Item>
                      </Picker>
                    </View>
                    {this.state.pick_flex_time_Err ? (
                      <Text style={styles.error}>
                        {this.state.pick_flex_time_Err}
                      </Text>
                    ) : null}
                  </View>
                ) : null}

                <View style={styles.control}>
                  <Text style={styles.label}>Drop-off Location</Text>

                  <Row style={styles.pickadd}>
                    <Col style={{ width: "6%" }}>
                      <Image
                        source={require("../../images/booking-list-icon/location_icon1.png")}
                        style={styles.icon}
                      ></Image>
                    </Col>
                    <Col style={{ width: "86%", paddingLeft: "2%" }}>
                      <TouchableOpacity
                        onPress={() =>
                          navigate("AddressPage", { address_type: "Drop-off" })
                        }
                      >
                        <TextInput
                          editable={false}
                          selectTextOnFocus={false}
                          placeholder="Select address from map"
                          onChangeText={(drop_address) =>
                            this.setState({ drop_address })
                          }
                          value={this.state.drop_address}
                        ></TextInput>
                      </TouchableOpacity>
                    </Col>
                    <Col style={{ width: "8%" }}>
                      <TouchableOpacity
                        onPress={() =>
                          navigate("AddressPage", { address_type: "Drop-off" })
                        }
                      >
                        <Image
                          source={require("../../images/Detact-Location.png")}
                          style={{ width: 20, height: 20, marginTop: 5 }}
                        ></Image>
                      </TouchableOpacity>
                    </Col>
                  </Row>
                  {this.state.drop_add_Err ? (
                    <Text style={styles.error}>{this.state.drop_add_Err}</Text>
                  ) : null}
                </View>

                <View style={styles.control}>
                  <Text style={styles.label}>Drop-off Time</Text>
                  <View style={styles.pickadd}>
                    <TextInput
                      style={styles.inputAddress}
                      placeholder="Enter Time"
                      onFocus={this.showDropPicker}
                      value={this.state.drop_time}
                    ></TextInput>
                    <Text
                      style={{
                        alignItems: "flex-end",
                        paddingTop: 5,
                        paddingRight: 5,
                        color: "#777",
                      }}
                    >
                      {this.state.showdrop ? "Flexible" : "Fixed"}
                    </Text>
                  </View>

                  <DateTimePicker
                    isVisible={this.state.isDropVisible}
                    onConfirm={this.DropDatePicker}
                    onCancel={this.hideDropPicker}
                    mode={"datetime"}
                    minimumDate={this.state.dropmindate}
                    is24Hour={true}
                  />
                  {this.state.drop_time_Err ? (
                    <Text style={styles.error}>{this.state.drop_time_Err}</Text>
                  ) : null}
                </View>
                {/* 
                                <View style={styles.control}>
                                    <Text style={styles.label}>Drop-off Time Flexibility</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <RadioForm
                                            radio_props={time}
                                            onPress={(value) => this.droptime(value)}
                                            formHorizontal={true}
                                            buttonSize={10}
                                            selectedButtonColor={"green"}
                                            buttonColor={"#777"}
                                            labelStyle={{ marginRight: 50, }}
                                        ></RadioForm>
                                    </View>
                                </View>
                                */}
                {this.state.showdrop ? (
                  <View style={styles.control}>
                    <Text style={styles.label}>
                      Select Drop Time Flexibility
                    </Text>
                    <View style={styles.pickerPack}>
                      <Picker
                        selectedValue={this.state.drop_flex_time}
                        style={styles.pickdropdown}
                        onValueChange={(itemValue, itemIndex) =>
                          this.setState({ drop_flex_time: itemValue })
                        }
                      >
                        <Picker.Item
                          style={styles.label}
                          label="- Select -"
                        ></Picker.Item>
                        <Picker.Item
                          style={styles.label}
                          label="30 minutes"
                          value="30 minutes"
                        ></Picker.Item>
                        <Picker.Item
                          style={styles.label}
                          label="1 hours"
                          value="1 hours"
                        ></Picker.Item>
                        <Picker.Item
                          style={styles.label}
                          label="2 hours"
                          value="2 hours"
                        ></Picker.Item>
                      </Picker>
                    </View>
                    {this.state.drop_flex_time_Err ? (
                      <Text style={styles.error}>
                        {this.state.drop_flex_time_Err}
                      </Text>
                    ) : null}
                  </View>
                ) : null}
                {/*
                                <View style={styles.control}>
                                    <Text style={styles.label}>Upload Picture Of Consignment</Text>
                                    <View style={styles.imageuplod}>
                                        <TouchableOpacity style={styles.imag}
                                            onPress={this.handleChoosePhoto.bind(this)}>
                                            <Image source={require('../../images/Attached.png')}
                                                style={styles.attechicon}
                                            ></Image>
                                        </TouchableOpacity>
                                        <Text style={{ paddingVertical: 12 }}
                                            value={this.state.filename}>{this.state.filename}</Text>
                                    </View>
                                    {this.state.photo_Err ? <Text style={styles.error}>{this.state.photo_Err}</Text> : null}
                                </View>

                                <View style={styles.control}>
                                    <Text style={styles.label}>Receiver's Name</Text>
                                    <View style={styles.pickadd}>
                                        <TextInput style={styles.inputAddress}
                                            placeholder="Enter Receiver's Name"
                                            onChangeText={(receiver_name) => this.setState({ receiver_name })}
                                            value={this.state.receiver_name}
                                        >
                                        </TextInput>
                                    </View>
                                    {this.state.receiver_name_Err ? <Text style={styles.error}>{this.state.receiver_name_Err}</Text> : null}
                                </View>

                                <View style={styles.control}>
                                    <Text style={styles.label}>Receiver's Mobile Number</Text>
                                    <View style={styles.pickadd}>
                                        <TextInput style={styles.inputAddress}
                                            placeholder="Enter Receiver's Mobile Number"
                                            keyboardType="numeric"
                                            onChangeText={(mobile) => this.setState({ mobile })}
                                            maxLength={10}
                                            value={this.state.mobile}>
                                        </TextInput>
                                    </View>
                                    {this.state.mobile_Err ? <Text style={styles.error}>{this.state.mobile_Err}</Text> : null}
                                </View>
                            */}
                <View style={styles.control}>
                  <Text style={styles.label}>Additional Information</Text>
                  <View style={styles.pickadd}>
                    <TextInput
                      style={styles.input}
                      placeholder="Additional Information"
                      onChangeText={(instruction) =>
                        this.setState({ instruction })
                      }
                      value={this.state.instruction}
                    ></TextInput>
                  </View>
                </View>

                <View style={styles.btncontrol}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.submit()}
                  >
                    <Text style={styles.btntext}>Book Vehicle</Text>
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

export default withNavigation(AddBooking);

const styles = StyleSheet.create({
  HeaderTextArea: {
    justifyContent: "center",
    alignItems: "center",
  },
  HeaderText: {
    marginLeft: 30,
    marginTop: 15,
    color: colorPrimary,
    fontSize: 25,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  form: {
    margin: 10,
    width: "94%",
  },
  control: {
    marginBottom: "3%",
  },
  label: {
    fontWeight: "500",
    fontSize: 15,
    marginBottom: 3,
    fontWeight: "400",
    color: "rgba(119,119,119,1)",
    marginTop: 3,
  },
  combine: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "rgba(119,119,119,0.6)",
  },
  DimensionInput: {
    flexDirection: "row",
    marginRight: 5,
    paddingTop: 5,
    paddingBottom: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "rgba(119,119,119,0.6)",
  },
  inputDim: {
    paddingTop: 1,
    paddingLeft: 10,
    paddingRight: 10,
    width: "100%",
  },
  input: {
    paddingTop: 1,
    paddingLeft: 10,
    paddingRight: 10,
    width: "65%",
  },
  picker: {
    marginTop: -10,
    width: "35%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    top: 4,
  },
  icon: {
    width: 20,
    height: 24,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  pickerPack: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "rgba(119,119,119,0.6)",
  },
  pickdropdown: {
    marginTop: -10,
    top: 4,
  },
  pickadd: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "rgba(119,119,119,0.6)",
    paddingVertical: 6,
  },
  inputAddress: {
    paddingTop: 1,
    paddingLeft: 10,
    paddingRight: 10,
    width: "87%",
  },
  inputPackaging: {
    paddingTop: 1,
    paddingLeft: 10,
    paddingRight: 10,
    width: "100%",
  },
  imageuplod: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "rgba(119,119,119,0.6)",
    height: 43,
  },
  imag: {
    borderRightWidth: 1,
    padding: 10,
    borderColor: "rgba(119,119,119,0.6)",
    height: 43,
  },
  attechicon: {
    width: 20,
    height: 20,
  },
  btncontrol: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10%",
    marginBottom: "15%",
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
    marginTop: "15%",
    width: 200,
    height: 40,
    textAlign: "center",
  },
  btntext: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 18,
  },
  error: {
    left: 10,
    color: colorPrimary,
    fontSize: 13,
    marginBottom: 0,
    width: "90%",
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
