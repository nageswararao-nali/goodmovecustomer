import React, { Component } from 'react';
import NavigationDrawerStructure from './navigationdrawerstructure';
import LogoImage from '../../Components/applogo';

import { StyleSheet, View, FlatList, RefreshControl, TextInput, ActivityIndicator, Text, Modal, Image, TouchableOpacity, TouchableHighlight, Keyboard, ScrollView, AsyncStorage, KeyboardAvoidingView } from 'react-native';
import { colorPrimary } from '../../Components/colors';
/** page actions */
import { bookingListAction, managerPaymentOptionAction, paymentUploadAction, paymentcancelAction, acceptBookingAction } from '../../util/action';
import { sendNotificationAction } from '../../util/action';

import validate from 'validate.js';
import moment from 'moment';
import BookDetail from './bookDetail';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { withNavigation } from 'react-navigation';

/** device permission */
// import * as Permissions from 'expo-permissions';

class MyBooking extends Component {

	/** navigation header */
	static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: (
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<LogoImage />
					<View style={styles.HeaderTextArea}>
						<Text style={styles.HeaderText}>My Bookings</Text>
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
			dataSource: [],
			loading: true,
			modalVisible: false,
			modalCancle: false,
			confirm_payment_id: '',
			transaction_id: '',
			transaction_id_Err: '',
			quatation_id: '',
			booking_id: '',

		}
		this.GetData();
	}

	/** this method call when screen load */
	componentDidMount() {
		const { navigation } = this.props;
		this.focusListener = navigation.addListener('didFocus', () => {
			this.GetData();

		});
	}

	componentWillUnmount() {
		// Remove the event listener
		this.focusListener.remove();
	}

	/** get booking list */
	async GetData() {
		const customerID = await AsyncStorage.getItem('userid');
		let Token = await AsyncStorage.getItem('token');
		Token = 'Bearer ' + Token;
		bookingData = {
			customer_id: customerID,
		}

		this.setState({ loading: true });
		bookingListAction(bookingData, Token).then(responseJson => {
			if (responseJson.isError == false) {
				this.setState({
					dataSource: responseJson.result, loading: false
				})

				this.getManagerAccountDetail();
				this.setState({ loading: false });
			} else {
				alert(responseJson.message);
				this.setState({ loading: false });
			}
		});
	};

	/** page refresh */
	onRefresh() {
		this.setState({ dataSource: [] });
		this.GetData();
	}

	/** manager account detail */
	async getManagerAccountDetail() {
		let Token = await AsyncStorage.getItem('token');
		Token = 'Bearer ' + Token;

		managerPaymentOptionAction(accountActiondData = null, Token).then(responseJson => {
			if (responseJson.isError == false) {

				this.setState({
					bank_name: responseJson.result.bank_name,
					branch_name: responseJson.result.branch_name,
					ifsc_code: responseJson.result.ifsc_code,
					account_number: responseJson.result.account_number,
					account_holder_name: responseJson.result.account_holder,
					upi_id: responseJson.result.upi_id,
					loading: false
				})

			} else {
				alert(responseJson.message);
			}
		});
	}

	/** payment modal open */
	openAcceptPaymentModal(ID, Quatation_id) {
		this.setState({ booking_id: ID });
		this.setState({ quatation_id: Quatation_id })
		this.setState({ modalVisible: true });
	}

	/** payment modal close */
	closePaymentModal() {
		this.setState({ booking_id: '' });
		this.setState({ quatation_id: '' })
		this.setState({ transaction_id_Err: '' });
		this.setState({ modalVisible: false });
		this.setState({ modalCancle: false });
	}

	/** cancel payment modal */
	opencanclePaymentModal(ID) {
		this.setState({ booking_id: ID });
		this.setState({ modalCancle: true });
	}

	/** payment upload to manager */
	async UploadPayment() {
		const { transaction_id } = this.state;

		var constraints = {
			transaction_id: {
				presence: {
					allowEmpty: false,
					message: "^required"
				},
				format: {
					pattern: "[A-Za-z0-9]{10,16}",
					flags: "i",
					message: "^ (max 10 - 16 characters)"
				},
			},
		}

		const result = validate({
			transaction_id: this.state.transaction_id,
		}, constraints);

		Keyboard.dismiss();
		if (result) {
			if (result.transaction_id) {
				this.setState({ transaction_id_Err: result.transaction_id })
			} else {
				this.setState({ transaction_id_Err: '' })
			}
		}

		if (!result) {
			this.setState({ modalVisible: false });
			this.setState({ transaction_id_Err: '' })

			const customerID = await AsyncStorage.getItem('userid');
			const customer_name = await AsyncStorage.getItem('name');
			let Token = await AsyncStorage.getItem('token');
			Token = 'Bearer ' + Token;

			const datetime = new Date();
			var PaymentData = {
				booking_id: this.state.booking_id,
				customer_id: customerID,
				quotation_id: this.state.quatation_id,
				payment_datetime: moment(datetime).format('YYYY-MM-DD hh:mm:ss'),
				transaction_id: this.state.transaction_id,
				status: 'completed'
			}

			this.setState({ modalVisible: true });
			this.setState({ loading: true });
			paymentUploadAction(PaymentData, Token).then(responseJson => {
				if (responseJson.isError == false) {
					alert(responseJson.message);

					this.setState({ modalVisible: false });

					var book_id = this.state.booking_id;

					this.sendNotification(responseJson.result.token, responseJson.result.booking_id, responseJson.result.customer_name, responseJson.result.transaction_id);

					this.setState({
						loading: false,
						transaction_id: ''
					});
					this.GetData();
				} else {
					alert(responseJson.message);
					this.setState({ loading: false });
				}
			});
		}
	}
	async acceptBookingFn(booking_id, quatation_id) {
		this.setState({ loading: true });
		let reqObj = {
			booking_id,
			quatation_id
		}
		let Token = await AsyncStorage.getItem('token');
		Token = 'Bearer ' + Token;
		acceptBookingAction(reqObj, Token).then(responseJson => {
			if (responseJson.isError == false) {
				alert(responseJson.message);
				this.setState({
					loading: false,
					transaction_id: ''
				});
				this.GetData();
			} else {
				alert(responseJson.message);
				this.setState({ loading: false });
			}
		});
	}

	async cancelpayment() {

		let Token = await AsyncStorage.getItem('token');
		Token = 'Bearer ' + Token;

		cancelData = {
			booking_id: this.state.booking_id
		}

		this.setState({ loading: true });
		paymentcancelAction(cancelData, Token).then(responseJson => {

			if (responseJson.isError == false) {
				alert(responseJson.message)
				this.setState({ loading: false });
				this.setState({ modalCancle: false });
				this.onRefresh();
			} else {
				alert(responseJson.message)
				this.setState({ loading: false });
			}
		})
	}

	/** send notification */
	async sendNotification(token, book_id, customer_name, transaction_id) {
		/* const { status: existingStatus } = await Permissions.getAsync(
			Permissions.NOTIFICATIONS
		);
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			// Android remote notification permissions are granted during the app
			// install, so this will only ask on iOS
			const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
			finalStatus = status;
		} */

		// Stop here if the user did not grant permissions
		if (finalStatus !== 'granted') {
			return;
		}

		let Token = await AsyncStorage.getItem('token');
		Token = 'Bearer ' + Token;

		var title = 'Customer Notification';
		var msg = 'Payment Uploded By ' + customer_name + ' For Booking ID: #' + book_id + ' & Transaction ID: ' + transaction_id;
		var response = sendNotificationAction(token, title, msg).then(responseJson => {

		})

	}

	/** render method */
	renderItem = ({ item }) => {
		let showPaymentButton = 0;
		if (item.booking_canceled_by_manager == 1) {
			quatation = "Booking Declined";
			fare = "Pending";
			showAcceptButton = 0;
			
		}
		else {
			if (item.quotation_status == 0) {
				quatation = "Quotation Pending";
				fare = "Pending";
				showAcceptButton = 0;
				showPaymentButton = 0;
			} else if (item.quotation_status == 1 && item.booking_accept_status == 1 && item.quotation_payment_status == 0) {
				quatation = "Booking Confirmed";
				fare = item.fare + "/-";
				showPaymentButton = 1;
				showAcceptButton = 0;
			} else if (item.quotation_status == 1 && item.booking_accept_status == 0 && item.quotation_payment_status == 0) {
				quatation = "Confirmation Pending";
				fare = item.fare + "/-";
				showAcceptButton = 1;
				showPaymentButton = 0;
			} else if (item.quotation_payment_status == 1) {
				quatation = "Completed";
				fare = item.fare + "/-";
				showAcceptButton = 0;
				showPaymentButton = 0;
			}
		}


		return (
			<TouchableOpacity style={styles.card} onPress={() => { this.props.navigation.navigate('BookDetail', { itemId: item.id }); }}>
				<View style={styles.ItemContainer}>
					<View><Text style={styles.ItemHeader}>Booking Id # {item.id}</Text></View>
					<View style={styles.InnerContainer}>
						<View style={styles.innerleft}>
							<View style={styles.LabelContainer}>
								<Image source={require('../../images/booking-list-icon/truck-50x50.png')} style={styles.iconsize} />

								<Text style={styles.LabelName}>
									{
										item.booking_canceled_by_manager == 1 ?
											'Booking Declined' :
											item.assign_tour_status_graph == 0 ?
												'NA' :
												item.tour_status
									}

								</Text>
							</View>
							<View>
							</View>
							<View style={styles.LabelContainer}>
								<Image source={require('../../images/booking-list-icon/Qautation50x50.png')} style={styles.iconsize} />
								<Text style={styles.LabelName}>{quatation}</Text>
							</View>
							<View style={styles.LabelContainer}>
								<Image source={require('../../images/booking-list-icon/Calendar50x50.png')} style={styles.iconsize} />
								<Text style={styles.LabelName}>{item.created_date} | {item.created_time}</Text>
							</View>
							<View style={styles.LabelContainer}>
								<Image source={require('../../images/booking-list-icon/Rupee-50x50.png')} style={styles.iconsize} />
								<Text style={styles.LabelName}>{fare}</Text>
							</View>
						</View>
						<View style={styles.ActionIconContainer}>
							<TouchableOpacity style={styles.ActionIcon}
								onPress={() => { this.props.navigation.navigate('BookDetail', { itemId: item.id }); }}>
								<Image source={require('../../images/booking-list-icon/Right-Arrow-20x20.png')} />
							</TouchableOpacity>
							{showPaymentButton == 1 ?
								(
									<View style={{ flexDirection: 'row', marginTop: -13 }}>
										<TouchableOpacity
											style={styles.acceptbtn}
											onPress={() => { this.openAcceptPaymentModal(item.id, item.quotation_id); }}>
											<Text style={styles.btnTxt}>Payment</Text>
										</TouchableOpacity>
										<TouchableOpacity
											onPress={() => { this.opencanclePaymentModal(item.id) }}
											style={styles.cancelbtn}>
											<Text style={styles.btnTxt}>Cancel</Text></TouchableOpacity>
									</View>
								) : null
							}
							{showAcceptButton == 1 ?
								(
									<View style={{ flexDirection: 'row', marginTop: -13 }}>
										<TouchableOpacity
											style={styles.acceptbtn}
											onPress={() => { this.acceptBookingFn(item.id, item.quotation_id); }}>
											<Text style={styles.btnTxt}>Accept</Text>
										</TouchableOpacity>
										<TouchableOpacity
											onPress={() => { this.opencanclePaymentModal(item.id) }}
											style={styles.cancelbtn}>
											<Text style={styles.btnTxt}>Cancel</Text>
										</TouchableOpacity>
									</View>
								) : null
							}

						</View>
					</View>
				</View>
			</TouchableOpacity>
		)
	}

	render() {
		const { loading } = this.state;
		if (!loading) {
			return (
				<View> 
					<Modal
						animationType="slide"
						transparent={false}
						avoidKeyboard={false}
						backdropColor='black'
						visible={this.state.modalVisible}
						onRequestClose={() => {
							alert('Modal has been closed.');
						}}>
						
						<View style={{ flex: 1 ,}}>
							<KeyboardAvoidingView behavior={Platform.select({ android: 'height', ios:'padding' })} style={{ flex: 1 }} >
							<ScrollView style={{flexGrow: 1 ,}}>
							<View style={styles.modal}>
								<View>
									<View style={styles.ModalHeaderContainer}>
										<Text style={styles.ModalHeaderText}>Accept Quotation</Text>
									</View>
									<View style={styles.ModalContentContainer}>
										<Text style={styles.ContentText}>Thanks for accepting the quotation. Please use the account details provided here to make payment. Once you have completed the payment, please provide Transaction ID so we can verify the payment.</Text>
									</View>
									<View style={styles.combine}>
										<Text style={styles.label}>A/c Holder Name </Text>
										<Text style={styles.middlelabel}>: </Text>
										<Text style={styles.input}>{this.state.account_holder_name}</Text>
									</View>
									<View style={styles.combine}>
										<Text style={styles.label}>Account Number</Text>
										<Text style={styles.middlelabel}>: </Text>
										<Text style={styles.input}>{this.state.account_number}</Text>
									</View>
									<View style={styles.combine}>
										<Text style={styles.label}>Bank Name</Text>
										<Text style={styles.middlelabel}>: </Text>
										<Text style={styles.input}>{this.state.bank_name}</Text>
									</View>
									<View style={styles.combine}>
										<Text style={styles.label}>Branch Name</Text>
										<Text style={styles.middlelabel}>: </Text>
										<Text style={styles.input}>{this.state.branch_name}</Text>
									</View>
									<View style={styles.combine}>
										<Text style={styles.label}>IFSC Code</Text>
										<Text style={styles.middlelabel}>: </Text>
										<Text style={styles.input}>{this.state.ifsc_code}</Text>
									</View>
									<View style={styles.combine}>
										<Text style={styles.label}>UPI ID</Text>
										<Text style={styles.middlelabel}>: </Text>
										<Text style={styles.input}>{this.state.upi_id}</Text>
									</View>
									<View style={styles.combine}>
										<Text style={styles.label}>Transaction ID</Text>
										<Text style={styles.middlelabel}>: </Text>
										<TextInput
											style={styles.inputtxt}
											placeholder="Enter Transaction ID"
											onChangeText={(transaction_id) => this.setState({ transaction_id })}>
										</TextInput>

									</View>
									{this.state.transaction_id_Err ? <Text style={styles.error}>{this.state.transaction_id_Err}</Text> : null}
									<View style={styles.ModalActionButtonContainer}>
										<TouchableOpacity style={styles.ModalOkButton}
											onPress={() => {
												this.UploadPayment();
											}}>
											<Text style={styles.modalbtn}>Upload</Text>
										</TouchableOpacity>
										<TouchableOpacity style={styles.ModalCancelButton}
											onPress={() => {
												this.closePaymentModal();
											}}>
											<Text style={styles.modalbtn}>Close</Text>
										</TouchableOpacity>
									</View>
								</View>
							</View>
							</ScrollView>
						</KeyboardAvoidingView>
						</View>
					</Modal>
					<Modal
						animationType="slide"
						transparent={false}
						visible={this.state.modalCancle}
						onRequestClose={() => {
							alert('Modal has been closed.');
						}}>
						<View style={styles.modalcancel}>
							<View>
								<View style={styles.ModalHeaderContainer}>
									<Text style={styles.ModalHeaderText}>Cancel Quotation</Text>
								</View>
								<View style={styles.ModalContentContainer}>
									<Text style={styles.ContentText}>Do you want to cancel ? </Text>
								</View>
								<View style={styles.ModalActionCancelContainer}>
									<TouchableHighlight
										style={styles.ModalOkButton}
										onPress={() => { this.cancelpayment(); }}>
										<Text style={styles.modalbtn}>Yes</Text>
									</TouchableHighlight>
									<TouchableHighlight style={styles.ModalCancelButton}
										onPress={() => {
											this.closePaymentModal();
										}}>
										<Text style={styles.modalbtn}>No</Text>
									</TouchableHighlight>
								</View>
							</View>
						</View>

					</Modal>

					<FlatList
						data={this.state.dataSource}
						renderItem={this.renderItem}
						keyExtractor={item => item.id.toString()}
						ListEmptyComponent={
							<EmptyComponent title="Data not available." />
						}
						refreshControl={
							<RefreshControl colors={[colorPrimary]} refreshing={this.state.loading}
								onRefresh={this.onRefresh.bind(this)} />
						}
					/>
				</View>
			)
		} else {
			return <ActivityIndicator style={styles.loading} size='large' color={colorPrimary} />
		}
	};
}

const EmptyComponent = ({ title }) => (
	<View style={styles.emptyContainer}>
		<Text style={styles.emptyText}>{title}</Text>
	</View>
);

const AppNavigator = createStackNavigator({
	MyBooking: MyBooking,
	BookDetail: BookDetail
}, {
	initialRouteName: 'MyBooking',
});

export default withNavigation(createAppContainer(AppNavigator));

/** style of this page */
const styles = StyleSheet.create({
	emptyContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: '70%'
	},
	emptyText: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 18
	},
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
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	card: {
		marginTop: 12,
		marginLeft: 10,
		marginRight: 10,
		paddingTop: 10,
		paddingBottom: 10,
		paddingRight: 10,
		paddingLeft: 10,
		borderWidth: 1,
		backgroundColor: '#ffffff',
		borderRadius: 9,
		borderColor: '#ffffff',
		shadowColor: "#777",
		shadowOffset: { width: 0, height: 1, },
		shadowOpacity: 0.1,
		shadowRadius: 4.22,
		elevation: 2,
		marginBottom: 2
	},
	ItemContainer: {
		paddingRight: 5,
		paddingLeft: 5,
	},
	ItemHeader: {
		color: '#333333',
		fontWeight: '500',
		fontSize: 17
	},
	InnerContainer: {
		flex: 1,
		flexDirection: 'row',
	},
	innerleft: {
		width: "70%"
	},
	ActionIconContainer: {
		flex: 1,
		marginTop: -50,
		justifyContent: 'center',
		alignItems: 'flex-end'
	},
	ActionIcon: {
		marginBottom: 15,
		paddingBottom: 7,
		paddingTop: 7,
		paddingLeft: 11,
		paddingRight: 11,
		borderRadius: 2,
		backgroundColor: colorPrimary,
		transform: [{ rotate: '90deg' }]
	},
	LabelContainer: {
		flex: 1,
		flexDirection: 'row',
		marginTop: 4,
		alignItems: 'center',
	},
	LabelIcon: {
		height: 15,
		width: 15
	},
	LabelName: {
		marginLeft: 10,
		fontSize: 15,
		fontWeight: '400',
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
	iconsize: {
		height: 17,
		width: 17
	},
	acceptbtn: {
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 7,
		paddingBottom: 7,
		backgroundColor: "#009D00",
		marginRight: 7,
		borderWidth: 1,
		borderRadius: 3,
		borderColor: '#009D00',
	},
	cancelbtn: {
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 7,
		paddingBottom: 7,
		backgroundColor: colorPrimary,
		borderWidth: 1,
		borderRadius: 3,
		borderColor: colorPrimary,
	},
	btnTxt: {
		color: '#ffffff',
	},
	modal: {
		backgroundColor: '#ffffff',
		borderRadius: 9,
		shadowColor: "#777",
		shadowOffset: { width: 0, height: 1, },
		shadowOpacity: 0.5,
		shadowRadius: 6.22,
		elevation: 5,
		marginRight: "5%",
		marginLeft: "5%",
		marginTop: "30%",
		marginBottom: "30%",
		paddingBottom: "10%",
		
	},
	ModalHeaderContainer: {
		height: 40,
		borderTopLeftRadius: 9,
		borderTopRightRadius: 9,
		backgroundColor: colorPrimary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	ModalHeaderText: {
		color: '#FFFFFF',
		fontSize: 18
	},
	ModalContentContainer: {
		padding: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	ContentText: {
		fontSize: 16,
		color: '#777777'
	},
	ModalActionButtonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 20
	},
	ModalOkButton: {
		height: 35,
		width: 70,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'green',
		borderRadius: 5
	},
	ModalCancelButton: {
		height: 35,
		width: 70,
		marginLeft: 15,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colorPrimary,
		borderRadius: 5
	},
	combine: {
		flexDirection: 'row',
		paddingLeft: 20
	},
	label: {
		width: "38%",
		fontWeight: "500",
		fontSize: 15,
		marginBottom: 3,
		fontWeight: "400",
		color: "#383838",
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
	input: {
		marginTop: 3,
		fontSize: 15,
		color: "rgba(119,119,119,1)",
		marginBottom: 3,
	},
	inputtxt: {
		marginTop: 0,
		marginBottom: 5,
		paddingTop: 0,
		width: "50%",
		borderBottomWidth: 1,
		color: "rgba(119,119,119,1)",
	},
	modalbtn: {
		color: "white"
	},
	error: {
		color: colorPrimary,
		fontSize: 13,
		left: 130,
		width: "55%"
	},
	modalcancel: {
		position: 'absolute',
		top: 250,
		left: 30,
		backgroundColor: '#FFFFFF',
		height: 160,
		width: 300,
		borderRadius: 9,
		shadowColor: "#777",
		shadowOffset: { width: 0, height: 1, },
		shadowOpacity: 0.5,
		shadowRadius: 6.22,
		elevation: 5,
	},
	ModalActionCancelContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 7
	},
});
