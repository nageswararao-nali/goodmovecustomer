import React, { Component } from "react";
import NavigationDrawerStructure from "./navigationdrawerstructure";
import LogoImage from "../../Components/applogo";
import { colorPrimary } from "../../Components/colors";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";

export default class MyBooking extends Component {
  /** navigation header */
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <View style={{ flex: 1, flexDirection: "row" }}>
          <LogoImage />
          <View style={styles.HeaderTextArea}>
            <Text style={styles.HeaderText}>Terms & Conditions</Text>
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
              <Text style={styles.titlecontent}>Terms and Conditions</Text>
            </View>

            <View style={styles.loginbox}>
              <View style={styles.content}>
                <View style={styles.contentsub}>
                  <Text style={styles.subtitle}>Privacy Policy</Text>
                  <Text style={styles.contentText}>
                    This privacy policy sets out how G-O uses and protects any
                    information that you share when you use this mobile app/
                    platform.
                  </Text>
                  <Text style={styles.contentText}>
                    {" "}
                    The following Terms &amp; Conditions shall apply to
                    customers utilising the Services offered by the G-O;
                  </Text>
                </View>

                <View style={styles.contentsub}>
                  <Text style={styles.subtitle}>Mobile app to Transport:</Text>

                  <Text style={styles.contentText}>
                    The customer shall pay the fare (as agreed), toll (where
                    applicable) and any fee or levy presently payable or
                    hereinafter imposed by the law or required to be paid for
                    availing of the transport Services. The customer agrees and
                    accepts that the use of our Services is at the sole risk of
                    the Customer, and further acknowledges that the G-O
                    disclaims all representations and warranties of any kind,
                    whether express or implied.
                  </Text>
                  <Text style={styles.contentText}>
                    {" "}
                    The customer shall ensure that he/she will not indulge in
                    any of the following activities while availing
                  </Text>
                </View>

                <View style={styles.contentsub}>
                  <Text style={styles.subtitle}>The Service :</Text>

                  <View style={{ flexDirection: "row" }}>
                    <Text>- </Text>
                    <Text style={styles.contentText}>
                      Asking the driver to break any Traffic/RTO/City Police
                      and/or government rules for any purpose. The driver has
                      the right to refuse such a request by the customer. The
                      driver also has the right to refuse such a pick-up.
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text>- </Text>
                    <Text style={styles.contentText}>
                      Pressurizing the driver to overload the truck with the
                      consignment than the allowed limit. The Customer shall
                      indemnify Company from and against and in respect of any
                      or all liabilities, losses, charges and expenses
                      (including legal fees and costs on a full indemnity basis)
                      claims, demands, actions and proceedings which G-O may
                      incur or sustain directly or indirectly from or by any
                      reason of or in relation to the use or proposed use of the
                      Services by the Customer and shall pay such sums on demand
                      on the G-O.
                    </Text>
                  </View>

                  <Text style={styles.contentText}>
                    {" "}
                    G-O shall be entitled to disclose to all companies within
                    its group, or any government body as so required by the law
                    or by directive or request from any government body, the
                    particulars of the Customer in the possession of Company in
                    any way as Company, in its absolute discretion, deems fit or
                    if it considers it in its interests to do so. G-O shall be
                    entitled at any time without giving any reason to terminate
                    the booking to transport the consignment done by the
                    Customer. User(s) shall indemnify G-O with respect to any
                    expenses incurred with respect to such booking.
                  </Text>
                  <Text style={styles.contentText}>
                    {" "}
                    In case of lost items inside the consolidation centre or
                    during the journey, G-O will try to locate the items on a &
                    quot;best-effort & quot; basis but is not responsible for
                    the same in case of loss or damage to the same. G-O
                    aggregates its vehicles for the purposes of providing
                    services. In the event of loss of any item, User(s) shall
                    not have any right to withhold the payment to be made
                    towards the third party or agent operating this mobile app.
                    Any complaint in respect of the Services or the use of the
                    freight vehicle, the Customer has to inform customer care of
                    the same in writing within 24hours of using the freight
                    vehicle or the Services of G-O.
                  </Text>
                  <Text style={styles.contentText}>
                    {" "}
                    G-O shall not be liable for any conduct of the drivers of
                    freight vehicles. However, the G-O encourages you to notify
                    it of any complaints that you may have against the driver
                    that you may have hired using our Services.
                  </Text>
                  <Text style={styles.contentText}>
                    {" "}
                    G-O shall be entitled to add to, vary or amend any or all
                    these terms and conditions at any time and the Customer
                    shall be bound by such addition, variation or amendment once
                    such addition, variation or amendment are incorporated into
                    these terms and conditions
                  </Text>
                  <Text style={styles.contentText}>
                    {" "}
                    All the calls made to the customer care are recorded for
                    quality and training purposes. In the event you place a
                    query on our app including query with respect to our
                    Services, applicable fees or terms of Service, You hereby
                    expressly agree to consent to receive our responses, whether
                    by way of telephonic calls or electronic mail, to such query
                    and all related information with respect to our Services.
                    For removal of doubts, related information shall include
                    without limitation any marketing and/or commercial
                    information. You understand and agree that such information
                    shall in no event qualify as unsolicited commercial
                    communication under the Telecom Unsolicited Commercial
                    Communications Regulations, 2007 and/or due to disclosure of
                    such information, our telephone numbers shall not qualify to
                    be registered under the &#39;National Do Not Call
                    Register&#39; or the &#39;Private Do Not Call Register&#39;
                    in accordance with the Telecom Unsolicited Commercial
                    Communications Regulations, 2007 or any other applicable
                    law.
                  </Text>
                </View>
                <View style={styles.contentsub}>
                  <Text style={styles.subtitle}>Toll Charges :</Text>
                  <Text style={styles.contentText}>
                    {" "}
                    In case of a toll on your trip, return toll fare will be
                    charged.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

/** style of this page */
const styles = StyleSheet.create({
  HeaderTextArea: {
    justifyContent: "center",
    alignItems: "center",
  },
  HeaderText: {
    marginLeft: 10,
    color: colorPrimary,
    fontSize: 25,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginRight: 18,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
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
  },
  content: {
    justifyContent: "center",
  },
  contentText: {
    color: "#777",
    textAlign: "justify",
    lineHeight: 20,
    fontSize: 14,
  },
  subtitle: {
    fontSize: 16,
    color: "#777777",
    fontWeight: "500",
    marginTop: 10,
  },
});
