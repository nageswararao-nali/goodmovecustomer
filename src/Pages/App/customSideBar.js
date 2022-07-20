import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  AsyncStorage,
  ScrollView,
} from "react-native";
import MenuIcon from "./menuicon";
import { colorPrimary, colorSecondary } from "../../Components/colors";
export default class CustomSidebarMenu extends Component {
  constructor() {
    super();
    this.state = {
      customerName: "Customer",
    };

    /** side menu */
    this.items = [
      {
        navOptionThumb: "profile",
        navOptionName: "Profile",
        screenToNavigate: "Profile",
      },
      {
        navOptionThumb: "addBooking",
        navOptionName: "Book Vehicle",
        screenToNavigate: "AddBooking",
      },
      {
        navOptionThumb: "myBooking",
        navOptionName: "My Bookings",
        screenToNavigate: "MyBooking",
      },
      {
        navOptionThumb: "payment",
        navOptionName: "Payment Options",
        screenToNavigate: "PaymentOption",
      },
      {
        navOptionThumb: "Offers",
        navOptionName: "Offers",
        screenToNavigate: "Offers",
      },
      {
        navOptionThumb: "about",
        navOptionName: "About Us",
        screenToNavigate: "About",
      },
      {
        navOptionThumb: "terms",
        navOptionName: "Terms and Conditions",
        screenToNavigate: "TermCondition",
      },
      {
        navOptionThumb: "logout",
        navOptionName: "Logout",
        screenToNavigate: "Logout",
      },
    ];

    this.SetUserName();
  }

  /** this method call when screen load */
  componentDidMount() {
    this.SetUserName();
  }

  /** Set Username */
  async SetUserName() {
    const userName = await AsyncStorage.getItem("name");
    const uname = userName.charAt(0).toUpperCase() + userName.slice(1);
    this.setState({ customerName: uname });
  }

  /** toggle menu */
  toggleDrawer = (navigation) => {
    this.props.navigation.closeDrawer();
  };

  render() {
    return (
      <View style={styles.sideMenuContainer}>
        <TouchableOpacity
          onPress={this.toggleDrawer.bind(this)}
          style={styles.sideMenuCloseIconContainer}
        >
          <Image
            source={require("../../images/menu-icon/Close-100x100.png")}
            style={styles.sideMenuCloseIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("Profile");
          }}
        >
          {/* <Image source={require('../../images/App-Icon.png')}
						style={styles.sideMenuProfileIcon} /> */}
          <Image
            source={require("../../../assets/icon.png")}
            style={styles.sideMenuProfileIcon1}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("Profile");
          }}
        >
          <Text style={styles.DrawerLogoText}>{this.state.customerName}</Text>
        </TouchableOpacity>
        {/*Setting up Navigation Options from option array using loop*/}

        <View style={styles.sideMenuItemContainer}>
          <ScrollView>
            {this.items.map((item, key) => (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  this.props.navigation.navigate(item.screenToNavigate);
                }}
              >
                <View style={styles.itemRow}>
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <View style={styles.itemIconContainer}>
                      <Image
                        source={MenuIcon[item.navOptionThumb]}
                        style={styles.itemIcon}
                      />
                    </View>
                    <Text style={styles.itemText}>{item.navOptionName}</Text>
                  </View>
                  <View style={styles.itemLeftArrowContainer}>
                    <Image
                      source={require("../../images/menu-icon/Right-Arrow.png")}
                      style={{ width: 12, height: 20 }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }
}

/** Side menu style */
const styles = StyleSheet.create({
  sideMenuCloseIconContainer: {
    position: "absolute",
    right: 30,
    top: 20,
  },
  sideMenuCloseIcon: {
    marginTop: 20,
    height: 20,
    width: 20,
    color: colorPrimary,
  },
  sideMenuContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: colorPrimary,
    alignItems: "center",
    paddingTop: 20,
  },
  sideMenuProfileIcon: {
    resizeMode: "center",
    width: 130,
    height: 130,
    marginTop: 60,
    borderRadius: 130 / 2,
  },
  sideMenuProfileIcon1: {
    // resizeMode: 'center',
    width: 150,
    height: 100,
    marginTop: 60,
    borderRadius: 10,
  },
  sideMenuItemContainer: {
    width: "100%",
    marginTop: 20,
    flex: 1,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.5)",
  },
  DrawerLogoText: {
    color: colorSecondary,
    fontSize: 20,
    marginTop: 20,
    fontWeight: "800",
  },
  itemIconContainer: {
    marginRight: 10,
    marginLeft: 20,
  },
  itemIcon: {
    //marginTop: 5,
    width: 23,
    height: 23,
  },
  itemText: {
    marginLeft: 5,
    color: colorSecondary,
    fontSize: 20,
    fontWeight: "normal",
  },
  itemLeftArrowContainer: {
    marginRight: 20,
  },
});
