import React, { Component } from 'react';
import NavigationDrawerStructure from './navigationdrawerstructure';
import LogoImage from '../../Components/applogo';

import { StyleSheet, View, RefreshControl, ActivityIndicator, Text, Image, ScrollView, AsyncStorage, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { colorPrimary } from '../../Components/colors';
import { getBookingDetailAction } from '../../util/action';
import moment from 'moment';
export default class BookingDetail extends Component {

  /** navigation header */
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <LogoImage />
          <View style={styles.HeaderTextArea}>
            <Text style={styles.HeaderText}>Booking Details</Text>
          </View>
        </View>
      ),
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#FFFFFF',
        height: 80
      },
      headerTintColor: 'red',
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      booking_details: '',
      pickup_tour_booking_details: '',
      intransit_tour_booking_details: '',
      delivered_tour_booking_details: '',
      driver_vehicle_detail: '',
      quo_payment: '',
      loading: true,
      isEditable: false
    }
    this.GetData();
  }

  /** Refresh page */
  onRefresh() {
    this.GetData();
  }

  /** get booking detail from booking id */
  async GetData() {
    const { navigation } = this.props;
    const BookingId = navigation.getParam('itemId')
    let Token = await AsyncStorage.getItem('token');
    Token = 'Bearer ' + Token;
    bookingDetailData = {
      booking_id: BookingId,
    }

    getBookingDetailAction(bookingDetailData, Token).then((responseJson) => {
      if (responseJson.isError == false) {
        console.log("booking details ...")
        console.log(responseJson.result.booking_details[0])
        let p_date = responseJson.result.booking_details[0].pickup_date.split("-");
        let p_df = p_date[2] + "-" + p_date[1] + "-" + p_date[0];
        let pickup_datetime =  moment(p_df + " " + responseJson.result.booking_details[0].pickup_time.split(" ")[0])
        let diff = moment(pickup_datetime).diff(moment(new Date()), "minutes")
        console.log("diff....", diff)
        this.setState({
          booking_details: responseJson.result.booking_details[0],
          pickup_tour_booking_details: responseJson.result.pickup_tour_booking_details[0],
          intransit_tour_booking_details: responseJson.result.intransit_tour_booking_details[0],
          delivered_tour_booking_details: responseJson.result.delivered_tour_booking_details[0],
          driver_vehicle_detail: responseJson.result.driver_vehicle_detail[0],
          quo_payment: responseJson.result.quo_payment[0],
          loading: false,
          isEditable: diff >= 90 ? true : false
        })
      } else {
        alert(responseJson.message);
      }
    });
  };
  async goToBookong() {
    await AsyncStorage.setItem('booking_details', JSON.stringify(this.state.booking_details));
    const { navigate } = this.props.navigation;
    // navigate('AddBooking', { itemId: responseJson.result.id, address: responseJson.result.address, addressType: this.state.address_type, pickLat: responseJson.result.latitude, pickLang: responseJson.result.longitude, city: responseJson.result.city, state: responseJson.result.state, pincode: responseJson.result.pincode, country: responseJson.result.country, receiver_contact: responseJson.result.receiver_contact, receiver_name: responseJson.result.receiver_name });
    navigate('AddBooking', {});
  }
  render() {
    const { loading } = this.state;
    const booking_details = this.state.booking_details;
    const pickup_tour_booking_details = this.state.pickup_tour_booking_details;
    const intransit_tour_booking_details = this.state.intransit_tour_booking_details;
    const delivered_tour_booking_details = this.state.delivered_tour_booking_details;
    const driver_vehicle_detail = this.state.driver_vehicle_detail;
    const quo_payment = this.state.quo_payment;


    if (!loading) {
      return (
        // <KeyboardAvoidingView
        //   style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }}
        //   behavior="padding" enabled
        //   keyboardVerticalOffset={100}>

          <ScrollView
            refreshControl={
              <RefreshControl colors={[colorPrimary]} refreshing={this.state.loading}
                onRefresh={this.onRefresh.bind(this)} />
            }>
            <View style={styles.MainContainer}>
              <View style={styles.BookingDetailContainer}>
                <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={styles.ItemHeader}>Booking Id # {booking_details.id}</Text>
                  {
                    this.state.isEditable ?
                    <TouchableOpacity style={styles.card} onPress={() => this.goToBookong()}>
                      <Image source={require('../../images/edit.png')} style={styles.icon} />
                    </TouchableOpacity>
                    : null
                  }
                </View>

                <View style={styles.InnerContainer}>
                  <View style={styles.TopLabelContainer}>
                    <Image style={styles.LabelIcon} source={require('../../images/booking-list-icon/truck-50x50.png')} style={styles.icon} />
                    <Text style={styles.TopLabelName}>
                      {

                        booking_details.booking_canceled_by_manager == 1 ?
                          'Booking Declined' :
                          booking_details.assign_tour_status_graph == 0 ?
                            'NA' :
                            booking_details.tour_status
                      }
                    </Text>
                  </View>
                  <View style={styles.TopLabelContainer}>
                    <Image style={styles.LabelIcon} source={require('../../images/booking-list-icon/Rupee-50x50.png')} style={styles.icon} />
                    <Text style={styles.TopLabelName}>{booking_details.quotation_status == 0 ? 'Pending' : (<Text style={styles.LabelName}>{booking_details.fare}/-</Text>)}</Text>
                  </View>
                </View>

                <View style={styles.ItemContainer}>
                  <View style={styles.ItemDetailContainer}>
                    <View>
                      <Text style={styles.commodity_name}>{booking_details.commodity_type}</Text>
                    </View>
                    <View style={styles.LabelContainer}>
                      <Text style={styles.LabelName}>{booking_details.commodity_weight} {booking_details.weight_unit} | {booking_details.packaging_type}</Text>

                      {booking_details.packaging_type == 'Gunny bags' || booking_details.packaging_type == 'Loose' || booking_details.packaging_type == 'others' ?
                        <Text style={styles.LabelName}>V: {booking_details.commodity_whole_volume}{booking_details.volume_unit} </Text>
                        : (<Text style={styles.LabelName}>L: {booking_details.commodity_length}{booking_details.length_unit} | B: {booking_details.commodity_breadth}{booking_details.breadth_unit} | H: {booking_details.commodity_height}{booking_details.height_unit}</Text>)}

                      {booking_details.instruction ? (<Text style={styles.LabelName}>{booking_details.instruction}</Text>) : null}
                      {booking_details.pickup_flexible_time ? (<Text style={styles.LabelName}>Pickup Time Flexibility : {booking_details.pickup_flexible_time}</Text>) : null}
                      {booking_details.dropoff_flexible_time ? (<Text style={styles.LabelName}>Drop-off Time Flexibility : {booking_details.dropoff_flexible_time}</Text>) : null}
                    </View>
                  </View>
                  <View style={styles.ItemImageContainer}>
                    <Image style={styles.ConsignmentImage} source={{ uri: booking_details.consignment_image }} />
                  </View>
                </View>
                <View style={styles.PicAddressContainer}>
                  <View style={styles.Address}>
                    <View style={styles.PicAddressIconContainer}>
                      <Image source={require('../../images/booking-list-icon/Pickup-50x50.png')} style={styles.icon} />
                    </View>
                    <View style={styles.AddressContainer}>
                      <Text numberOfLines={3} style={styles.addressText}>{booking_details.pickup_location}</Text>
                    </View>
                  </View>
                  <View style={styles.PicDateTimeContainer}>
                    <Image source={require('../../images/booking-list-icon/Calendar50x50.png')} style={styles.icon} />
                    <Text style={styles.date}>{booking_details.pickup_date}</Text>
                    <Text style={styles.date}>{booking_details.pickup_time}</Text>
                  </View>
                </View>

                <View style={styles.PicAddressContainer}>
                  <View style={styles.Address}>
                    <View style={styles.PicAddressIconContainer}>
                      <Image source={require('../../images/booking-list-icon/Location-50x50.png')} style={styles.icon} />
                    </View>
                    <View style={styles.AddressContainer}>
                      <Text numberOfLines={3} style={styles.addressText}>{booking_details.dropoff_location}</Text>
                    </View>
                  </View>
                  <View style={styles.PicDateTimeContainer}>
                    <Image source={require('../../images/booking-list-icon/Calendar50x50.png')} style={styles.icon} />
                    <Text style={styles.date}>{booking_details.dropoff_date}</Text>
                    <Text style={styles.date}>{booking_details.dropoff_time}</Text>
                  </View>
                </View>

                {
                  booking_details.assign_tour_status_graph == 0 ?
                    (<View></View>)
                    :
                    (
                      <View style={styles.InnerContainerBook}>
                        <View>
                          <Text style={styles.bookingtrack}>Booking Tracking</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            {delivered_tour_booking_details != null ?
                              (<View><Image source={require('../../images/booking-list-icon/4-Grey.png')} style={styles.trackImg} /></View>)
                              :
                              intransit_tour_booking_details != null ?
                                (<View><Image source={require('../../images/booking-list-icon/3-Grey.png')} style={styles.trackImg} /></View>)
                                :
                                pickup_tour_booking_details != null ?
                                  (<View><Image source={require('../../images/booking-list-icon/2-Grey.png')} style={styles.trackImg} /></View>)
                                  :
                                  (<View><Image source={require('../../images/booking-list-icon/1-Grey.png')} style={styles.trackImg} /></View>)
                                    ?
                                    (<View><Image source={require('../../images/booking-list-icon/1-Grey.png')} style={styles.trackImg} /></View>)
                                    :
                                    (<View></View>)
                            }
                          </View>
                          <View>
                            {delivered_tour_booking_details != null ?
                              (

                                <View>
                                  <View>
                                    <Text style={styles.pickupTitle}>Picked Up</Text>
                                    <Text style={styles.pickupDateTimeText}>{pickup_tour_booking_details.date} | {pickup_tour_booking_details.time}</Text>
                                  </View>
                                  <View>
                                    <Text style={styles.inTransitTitle}>In Transit</Text>
                                    <Text style={styles.pickupDateTimeText}>{intransit_tour_booking_details.date} | {intransit_tour_booking_details.time}</Text>
                                  </View>
                                  <View>
                                    <Text style={styles.deliveredTitle}>Delivered</Text>
                                    <Text style={styles.pickupDateTimeText}>{delivered_tour_booking_details.date} | {delivered_tour_booking_details.time}</Text>
                                  </View>
                                </View>)
                              :
                              intransit_tour_booking_details != null ?
                                (
                                  <View>
                                    <View>
                                      <Text style={styles.pickupTitle}>Picked Up</Text>
                                      <Text style={styles.pickupDateTimeText}>{pickup_tour_booking_details.date} | {pickup_tour_booking_details.time}</Text>
                                    </View>
                                    <View>
                                      <Text style={styles.inTransitTitle}>In Transit</Text>
                                      <Text style={styles.pickupDateTimeText}>{intransit_tour_booking_details.date} | {intransit_tour_booking_details.time}</Text>
                                    </View>
                                    <View>
                                      <Text style={styles.deliveredTitleGrey}>Delivered</Text>
                                      <Text style={styles.pickupDateTimeTextGray}>Pending</Text>
                                    </View>
                                  </View>
                                )
                                :
                                pickup_tour_booking_details != null ?
                                  (<View>
                                    <View>
                                      <Text style={styles.pickupTitle}>Picked Up</Text>
                                      <Text style={styles.pickupDateTimeText}>{pickup_tour_booking_details.date} | {pickup_tour_booking_details.time}</Text>
                                    </View>
                                    <View>
                                      <Text style={styles.inTransitTitleGrey}>In Transit</Text>
                                      <Text style={styles.pickupDateTimeTextGray}>Pending</Text>
                                    </View>
                                    <View>
                                      <Text style={styles.deliveredTitleGrey}>Delivered</Text>
                                      <Text style={styles.pickupDateTimeTextGray}>Pending</Text>
                                    </View>
                                  </View>)
                                  :
                                  (
                                    <View>
                                      <View>
                                        <Text style={styles.pickupTitleGrey}>Picked Up</Text>
                                        <Text style={styles.pickupDateTimeTextGray}>Pending</Text>
                                      </View>
                                      <View>
                                        <Text style={styles.inTransitTitleGrey}>In Transit</Text>
                                        <Text style={styles.pickupDateTimeTextGray}>Pending</Text>
                                      </View>
                                      <View>
                                        <Text style={styles.deliveredTitleGrey}>Delivered</Text>
                                        <Text style={styles.pickupDateTimeTextGray}>Pending</Text>
                                      </View>
                                    </View>
                                  )
                                    ?
                                    (<View>
                                      <View>
                                        <Text style={styles.pickupTitleGrey}>Picked Up</Text>
                                        <Text style={styles.pickupDateTimeTextGray}>Pending</Text>
                                      </View>
                                      <View>
                                        <Text style={styles.inTransitTitleGrey}>In Transit</Text>
                                        <Text style={styles.pickupDateTimeTextGray}>Pending</Text>
                                      </View>
                                      <View>
                                        <Text style={styles.deliveredTitleGrey}>Delivered</Text>
                                        <Text style={styles.pickupDateTimeTextGray}>Pending</Text>
                                      </View>
                                    </View>)
                                    :
                                    (<View></View>)
                            }
                          </View>
                        </View>
                      </View>
                    )}

                {driver_vehicle_detail == null ?
                  <Text></Text>
                  :
                  (
                    <View style={styles.InnerContainerdriver}>
                      <View>
                        <Text style={styles.bookingtrack}>Driver / Vehicle Detail</Text>
                      </View>
                      <View style={styles.TopLabelContainerpay} >
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                          <Text style={styles.TopLabelName}>Vehicle No.</Text>
                          <Text style={styles.TopLabelNameValue}>{driver_vehicle_detail.vehicle_no}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={styles.TopLabelName}>Vehicle Model</Text>
                          <Text style={styles.TopLabelNameValue}>{driver_vehicle_detail.vehicle_model}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={styles.TopLabelName}>Driver Name</Text>
                          <Text style={styles.TopLabelNameValue}>{driver_vehicle_detail.driver_name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={styles.TopLabelName}>Driver Mobile Number</Text>
                          <Text style={styles.TopLabelNameValue}>{driver_vehicle_detail.driver_mobile}</Text>
                        </View>
                      </View>

                    </View>
                  )}

                {quo_payment == null ?
                  <Text></Text>
                  :
                  (
                    <View style={styles.InnerContainerPayment}>
                      <View>
                        <Text style={styles.bookingtrack}>Payment Details</Text>
                      </View>
                      <View style={styles.TopLabelContainerpay}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={styles.TopLabelName}>Fare</Text>
                          <Image style={styles.LabelIcon} source={require('../../images/booking-list-icon/Rupee-22x22.png')} />
                          <Text style={styles.TopLabelNameValue}>{quo_payment.fare} /-</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={styles.TopLabelName}>Transaction ID</Text>
                          <Text style={styles.TopLabelNameValue}>{quo_payment.transaction_id}</Text>
                        </View>
                      </View>
                    </View>
                  )
                }

              </View>
            </View>
          </ScrollView>
        // </KeyboardAvoidingView>
      )
    } else {
      return <ActivityIndicator style={styles.loading} size='large' color={colorPrimary} />
    }
  }
}

const styles = StyleSheet.create({
  HeaderTextArea: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  HeaderText: {
    marginLeft: 30,
    color: colorPrimary,
    fontSize: 25,
    fontWeight: 'bold'
  },
  MainContainer: {
    flex: 1,
  },
  BookingDetailContainer: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10
  },
  CustomerContainer: {
    flexDirection: 'row',
    marginTop: 10,
    height: 20,
    alignItems: 'center',
  },
  ItemContainer: {
    flexDirection: 'row',
    marginTop: 15
  },
  ItemDetailContainer: {
    flex: 2,
  },
  ItemImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  commodity_name: {
    color: colorPrimary,
    fontWeight: '500',
    fontSize: 20,
    textTransform: 'capitalize'
  },
  bookingtrack: {
    color: colorPrimary,
    fontWeight: '500',
    fontSize: 20,
    textTransform: 'capitalize',
    paddingBottom: 10
  },
  TopLabelContainer: {
    flexDirection: 'row'
  },
  TopLabelName: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '400',
    color: '#777777',
    width: '50%',
  },
  TopLabelNameValue: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '400',
    color: '#777777',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    textAlign: "left",
    width: '40%',
  },
  LabelName: {
    fontWeight: '400',
    color: '#777777'
  },
  ConsignmentImage: {
    height: 80,
    width: 80
  },
  PicAddressContainer: {
    marginTop: 18,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#777777',
    borderRadius: 5,
    height: 65
  },
  Address: {
    width: '80%',
    paddingRight: 5,
    paddingLeft: 5,
    flexDirection: 'row',
    borderRightWidth: 1,
    borderRightColor: '#777777',
  },
  PicAddressIconContainer: {
    paddingTop: 10,
  },
  AddressContainer: {
    padding: 5,
    width: '98%',
  },
  addressText: {
    fontSize: 15,
    color: '#777777'
  },
  PicAddressIcon: {
  },
  PicDateTimeContainer: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  date: {
    fontSize: 12,
    color: '#777777'
  },
  QuotationMainContainer: {
    flex: 1,
    padding: 0,
    justifyContent: 'flex-end',
  },
  QuotationContainer: {
    height: 20,
    backgroundColor: colorPrimary,
  },
  QuotationHeaderButton: {
    position: 'absolute',
    backgroundColor: colorPrimary,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    top: -30,
    left: 46,
    width: 270,
    height: 40,
  },
  btntext: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '400',
  },
  FormContainer: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Form: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: 70,
    width: 320,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  SubmitButtonContainer: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20
  },
  SubmitButton: {
    backgroundColor: '#FFFFFF',
    height: 50,
    width: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  SubmitButtontext: {
    color: colorPrimary,
    fontSize: 18,
    fontWeight: '400',
  },
  FormInputContainer: {
    flexDirection: 'row',
    width: 120,
    borderBottomWidth: 1,
    marginBottom: 5,
    borderColor: "rgba(119,119,119,0.6)",
  },
  textimage: {
    padding: 10,
    margin: 5,
    height: 5,
    width: 5,
  },
  textbox: {
    width: '100%',
  },
  FormLabelText: {
    fontSize: 14,
    color: '#777777'
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    width: 15,
    height: 15
  },
  LabelIcon: {
    width: 13,
    height: 13,
    marginTop: 5,
    marginRight: -5,
    marginLeft: 5,
  },
  LabelContainerpay: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },
  ItemHeader: {
    color: '#333333',
    fontWeight: '500',
    fontSize: 17
  },
  InnerContainer: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#777777'
  },
  InnerContainerBook: {
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderColor: '#777777'
  },
  InnerContainerdriver: {
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopWidth: 1,
    borderColor: '#777777'
  },
  InnerContainerPayment: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderTopWidth: 1,
    borderColor: '#777777'
  },
  trackImg: {
    height: 250,
    margin: 10,
    marginLeft: 20,
  },
  pickupTitle: {
    paddingTop: 15,
    fontSize: 17,
    fontWeight: "500",
    color: "#333333",
    paddingLeft: 10,
  },
  pickupTitleGrey: {
    paddingTop: 15,
    fontSize: 17,
    fontWeight: "500",
    color: "#777777",
    paddingLeft: 10,
  },
  inTransitTitle: {
    paddingTop: 50,
    fontSize: 17,
    fontWeight: "500",
    color: "#333333",
    paddingLeft: 10,
  },
  inTransitTitleGrey: {
    paddingTop: 50,
    fontSize: 17,
    fontWeight: "500",
    color: "#777777",
    paddingLeft: 10,
  },
  deliveredTitle: {
    paddingTop: 35,
    fontSize: 17,
    fontWeight: "500",
    color: "#333333",
    paddingLeft: 10,
  },
  deliveredTitleGrey: {
    paddingTop: 35,
    fontSize: 17,
    fontWeight: "500",
    color: "#777777",
    paddingLeft: 10,
  },
  pickupDateTimeText: {
    paddingTop: 5,
    fontSize: 17,
    color: "#777777",
    paddingLeft: 10,
  },
  pickupDateTimeTextGray: {
    paddingTop: 5,
    fontSize: 17,
    color: "#777777",
    paddingLeft: 10,
  },
});
