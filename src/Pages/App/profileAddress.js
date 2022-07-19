import React, { Component } from 'react';
import NavigationDrawerStructure from './navigationdrawerstructure';
import LogoImage from '../../Components/applogo';
import { RefreshControl, StyleSheet, Dimensions, Image, AsyncStorage, View, TextInput, Text, TouchableOpacity, Keyboard, ScrollView, KeyboardAvoidingView, FlatList, ActivityIndicator, Alert, Modal, TouchableHighlight } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { withNavigation } from 'react-navigation';
import { colorPrimary } from '../../Components/colors';
import validate from 'validate.js';

import {Row , Col} from 'react-native-easy-grid';

/** action method */
import { addressAction } from '../../util/action';
import { getAddressAction } from '../../util/action';
import { deleteCustomerAddressFromId } from '../../util/action';

import Map from './map';
import SlidingUpPanel from 'rn-sliding-up-panel'
import { Button } from 'react-native';
import { Header } from 'react-navigation-stack';

class AddingAddress extends Component {


	/** navigation header */
	static navigationOptions = ({ navigation }) => {
		return {
			headerMode: 'screen',
			headerTitle: (
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<LogoImage />
					<View style={styles.HeaderTextArea}>
						<Text style={styles.HeaderText}>Select Address</Text>
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
			id: '',
			pickLocationList: '',
			dropLocationList: '',
			street: '', street_Err: '',
			landmark: '', landmark_Err: '',
			city: '', city_Err: '',
			pincode: '', pincode_Err: '',
			country: '',
			state: '',
			address_type: '', mobile: '',
			address_type_Err: '',
			latitude: '', longitude: '',
			loading: false,
			modalCancle: false,
			paneltoggle: false,
			receiver_name: '',
			receiver_contact: '',
			pickLocationListData: '',
			dropLocationListData: '',
			sValue: '',
			sDValue: ''

		}

	};

	// upButtonHandler = () => {
	// 	//OnCLick of Up button we scrolled the list to top
	// 	if(this.state.paneltoggle){
	// 		this._panel.hide();
	// 		this.setState({
	// 			paneltoggle: false
	// 		});
	// 	}else{
	// 		this._panel.show();
	// 		this.setState({
	// 			paneltoggle: true
	// 		});
	// 	}

		
	//   };

	/** this method call when screen load */
	componentDidMount() {
		const { navigation } = this.props;
		this.focusListener = navigation.addListener('didFocus', () => {
			this.GetAddress();
		});

	}


	componentWillUnmount() {
		// Remove the event listener
		this.focusListener.remove();
	}

	/** get address list */
	async GetAddress() {

		const { navigation } = this.props;
		const address_type = navigation.getParam('address_type')

		this.setState({
			address_type: address_type
		})
		const customer_id = await AsyncStorage.getItem('userid');

		let Token = await AsyncStorage.getItem('token');
		Token = 'Bearer ' + Token;

		var data = {
			customer_id: customer_id,
		}

		this.setState({ loading: true })
		getAddressAction(data, Token).then(responseJson => {
			if (responseJson.isError == false) {
				this.setState({
					pickLocationList: responseJson.result.Pickup_address,
					pickLocationListData: responseJson.result.Pickup_address,
					dropLocationList: responseJson.result.Dropoff_address,
					dropLocationListData: responseJson.result.Dropoff_address,
					loading: false,
				})

			} else {
				alert(responseJson.message);
				this.setState({ loading: false })
			}
		})
	};

	/** add address and submit that */
	async submit() {
		const { street, landmark, city, pincode, state, country, mobile, address_type } = this.state;
		var constraints = {
			street: {
				presence: {
					allowEmpty: false,
					message: "^required"
				},

			},
			landmark: {
				presence: {
					allowEmpty: false,
					message: "^required"
				},

			},
			city: {
				presence: {
					allowEmpty: false,
					message: "^required"
				},

			},
			pincode: {
				presence: {
					allowEmpty: false,
					message: "^required"
				},
				format: {
					pattern: "[0-9]{6,10}",
					flags: "i",
					message: "^ (6-10 digit pincode)"
				},

			},
			address_type: {
				presence: {
					allowEmpty: false,
					message: "^required"
				},
			}
		}

		const result = validate({
			street: this.state.street,
			landmark: this.state.landmark,
			city: this.state.city,
			pincode: this.state.pincode,
			address_type: this.state.address_type,
		}, constraints);

		Keyboard.dismiss();

		if (result) {
			if (result.street) {
				this.setState({ street_Err: result.street })
			} else {
				this.setState({ street_Err: '' })
			}
			if (result.landmark) {
				this.setState({ landmark_Err: result.landmark })
			} else {
				this.setState({ landmark_Err: '' })
			}
			if (result.city) {
				this.setState({ city_Err: result.city })
			} else {
				this.setState({ city_Err: '' })
			}
			if (result.pincode) {
				this.setState({ pincode_Err: result.pincode })
			} else {
				this.setState({ pincode_Err: '' })
			}
			if (result.address_type) {
				this.setState({ address_type_Err: result.address_type })
			} else {
				this.setState({ address_type_Err: '' })
			}
		}

		if (!result) {

			var addresslist = this.state.street + ',' + this.state.landmark + ',' + this.state.city + ',' + this.state.state + ',' + ' ' + this.state.pincode + ',' + ' ' + this.state.country;

			var customer_id = await AsyncStorage.getItem('userid');

			var addressData = {
				customer_id: customer_id,
				address: addresslist,
				city: this.state.city,
				state: this.state.state,
				country: this.state.country,
				pincode: this.state.pincode,
				latitude: this.state.latitude,
				longitude: this.state.longitude,
				mobile: this.state.mobile,
				address_type: this.state.address_type,
				receiver_name: this.state.receiver_name,
				receiver_contact: this.state.receiver_contact
			}

			let Token = await AsyncStorage.getItem('token');
			Token = 'Bearer ' + Token;
			this.setState({ loading: true });
			if (this.state.id) {
				addressData['id'] = this.state.id
			}
			console.log(addressData)
			var response = addressAction(addressData, Token).then(responseJson => {
				console.log(responseJson)
				if (responseJson.isError == false) {
					this.setState({ pickLocationList: '', dropLocationList: '', loading: false })
					alert(responseJson.message);
					this.GetAddress();
					this.clear();
				} else {
					alert(responseJson.message);
					this.setState({ loading: false })
				}
			})
		}
	}
	isJson(str) {
	    try {
	        JSON.parse(str);
	    } catch (e) {
	        return false;
	    }
	    return true;
	}
	setAddressData (street) {
		if(this.isJson(street)) {
			let addr = JSON.parse(street)

	  		this.setState({
	  			street: addr.address,
	  			city: addr.city,
				state: addr.state,
				country: addr.country,
				pincode: addr.pincode,
				latitude: addr.latitude,
				longitude: addr.longitude,
				mobile: addr.mobile,
				receiver_name: addr.receiver_name,
				receiver_contact: addr.receiver_contact
	  		})
		} else {
			this.setState({street})
		}
	}
	/** clear address page after address add */
	async clear() {
		this.setState({
			street: '', landmark: '', city: '', pincode: '', mobile: '', receiver_name: '', receiver_contact: '', id: '',
			street_Err: '', landmark_Err: '', city_Err: '', pincode_Err: '', address_type: '', address_type_Err: ''
		})
	}

	/** delete address */
	async deleteAddess() {

		let Token = await AsyncStorage.getItem('token');
		Token = 'Bearer ' + Token;

		var getAddressActionData = {
			address_id: this.state.address_id
		}
		this.setState({ loading: true })
		deleteCustomerAddressFromId(getAddressActionData, Token).then(responseJson => {
			if (responseJson.isError == false) {
				this.GetAddress();
				alert(responseJson.message);
				this.setState({ loading: false })
				this.setState({ modalCancle: false });
			} else {
				alert(responseJson.message);
				this.setState({ loading: false })
			}
		});
	}

	/** open delete address confirm modal */
	opendltModal(ID) {
		this.setState({ address_id: ID });
		this.setState({ modalCancle: true });
	}

	/** close delete address confirm modal */
	closeModal() {
		this.setState({ address_id: '' });
		this.setState({ modalCancle: false });
	}

	populateAddress(item) {
		console.log('item')
		console.log(item)
		let addr = item.address.split(",")
		this.setState({
			id: item.id,
			customer_id: item.customer_id,
			street: addr[0] ? addr[0] : '',
			landmark: addr[1] ? addr[1] : '',
			city: item.city,
			state: item.state,
			country: item.country,
			pincode: item.pincode,
			latitude: item.latitude,
			longitude: item.longitude,
			mobile: item.mobile,
			address_type: item.address_type,
			receiver_name: item.receiver_name,
			receiver_contact: item.receiver_contact
		})
		this._panel.hide()
	}
	searchPickupAddress(sValue) {
		// console.log("this.state.pickLocationListData")
		// console.log(this.state.pickLocationListData)
		let searchResults = []
		if(sValue) {
			searchResults = this.state.pickLocationListData.filter((pData) => {
				if(pData.address.toLowerCase().includes(sValue.toLowerCase())) {
					return pData
				}
			})
		} else {
			searchResults = this.state.pickLocationListData
		}
		this.setState({
			pickLocationList: searchResults,
			sValue: sValue
		})
		
	}

	searchDropoffAddress(sDValue) {
		// console.log("this.state.pickLocationListData")
		// console.log(this.state.pickLocationListData)
		let searchResults = []
		if(sDValue) {
			searchResults = this.state.dropLocationListData.filter((pData) => {
				if(pData.address.toLowerCase().includes(sDValue.toLowerCase())) {
					return pData
				}
			})
		} else {
			searchResults = this.state.dropLocationListData
		}
		this.setState({
			dropLocationList: searchResults,
			sDValue: sDValue
		})
		
	}
	/** render item of address */
	renderItem = ({ item }) => {
		var pickaddress = [
			{ label: '', value: item.id },
		]
		return (
			<View>

				<View style={styles.card}>
					<View style={styles.InnerContainer}>
						<View style={styles.LabelContainer}>
							<Text style={styles.LabelName}>{item.address}</Text>
						</View>
						<View style={styles.ActionIconContainer}>
							<TouchableOpacity style={styles.EditActionIcon}
								onPress={() => { this.populateAddress(item) }}>
								<Image style={{width: 20, height: 20}} source={require('../../images/edit.png')} />
							</TouchableOpacity>
							<TouchableOpacity style={styles.ActionIcon}
								onPress={() => { this.opendltModal(item.id) }}>
								<Image source={require('../../images/Delete.png')} />
							</TouchableOpacity>
						</View>
					</View>
				</View>

			</View>
		)
	}

	/** refresh page */
	onRefresh() {
		this.setState({ pickLocationList: [], dropLocationList: [] });
		this.GetAddress();
		this.clear();
	}
	locationChanged = (coord) => {
	
	  
	  const { navigation } = this.props;
		const address_type = navigation.getParam('address_type');
		// var myArray = payload.coords.toString().split(',');
		var ll = parseFloat(coord.lat);
		var lnn = parseFloat(coord.lng);
		

		var getaddressurl = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + ll + '&lon=' + lnn;

		var data = null;

		var xhr = new XMLHttpRequest();
		xhr.withCredentials = true;

		xhr.open("GET", "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + ll + "&lon=" + lnn + "&zoom=18&addressdetails=1");
		xhr.setRequestHeader("User-Agent", "PostmanRuntime/7.20.1");
		xhr.setRequestHeader("Accept", "*/*");
		xhr.setRequestHeader("Cache-Control", "no-cache");
		xhr.setRequestHeader("Postman-Token", "bb71ba75-a221-4135-988e-8ee9180517ad,37e2af0b-0136-4d03-a52d-27cecb834f6a");
		xhr.setRequestHeader("Host", "nominatim.openstreetmap.org");
		xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
		xhr.setRequestHeader("Connection", "keep-alive");
		xhr.setRequestHeader("cache-control", "no-cache");

		xhr.send(data);
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				var addressData = JSON.parse(xhr.responseText);
				this.setState({ street: '' });
				this.setState({ landmark: '' });
				this.setState({ city: '' });
				this.setState({ pincode: '' });

				this.setState({ latitude: ll });
				this.setState({ longitude: lnn });

				var street = '';
				var city = '';

				/* street */
				if (addressData.address.school) {
					street += addressData.address.school + ',';
				}
				if (addressData.address.hospital) {
					street += ' ' + addressData.address.hospital + ',';
				}
				if (addressData.address.station) {
					street += ' ' + addressData.address.station + ',';
				}
				if (addressData.address.road) {
					street += ' ' + addressData.address.road + ',';
				}
				if (addressData.address.neighbourhood) {
					street += ' ' + addressData.address.neighbourhood + ',';
				}
				if (addressData.address.suburb) {
					street += ' ' + addressData.address.suburb + ',';
				}
				if (addressData.address.hamlet) {
					street += ' ' + addressData.address.hamlet + ',';
				}
				if (addressData.address.town) {
					street += ' ' + addressData.address.town + ',';
				}
				/* street */

				/* city */
				if (addressData.address.city) {
					city += ' ' + addressData.address.city + ',';
				}
				if (addressData.address.state_district) {
					city += ' ' + addressData.address.state_district + ',';
				}
				/* city */

				this.setState({ street: street });
				this.setState({ city: city });

				/* landmark */
				if (addressData.address.county) {
					this.setState({ landmark: addressData.address.county });
				}
				/* landmark */

				if (addressData.address.postcode) {
					let pincodeNumber = addressData.address.postcode;
					pincodeNumber = pincodeNumber.replace(/\s/g, '');
					pincodeNumber = pincodeNumber.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');

					this.setState({ pincode: pincodeNumber });
				}
				if (addressData.address.state) {
					this.setState({ state: addressData.address.state });
				}

				if (addressData.address.country) {
					this.setState({ country: addressData.address.country });
				}
			}
		}

	}

	
	/** render method */
	render() {
		const { navigate } = this.props.navigation;
		const { loading } = this.state;

		if (!loading) {
			return (
				<KeyboardAvoidingView behavior={Platform.select({ android: 'height', ios:'padding' })} style={{ flex: 1 }} >
					{ /* <Row style={{height: '49%'}}>
						<Col>
							<Map parentMethod={this.locationChanged}/>
						</Col>
					</Row> */}

				<ScrollView style={{flexGrow: 1 ,}}>
					<Row style={{height: '45%',}}>
						<Col style={{marginBottom: '30%',}}>
							<View style={styles.AddressHeader}>
									<Text style={styles.AddressHeaderText}>{ this.state.id ? 'Update': 'Add'} Address</Text>
								</View>

									<View style={styles.input}>
										<TextInput style={styles.textbox}
											placeholder="Enter Street Name"
											onChangeText={(street) => this.setAddressData(street)}
											value={this.state.street}
										>
										</TextInput>
									</View>
									{this.state.street_Err ? <Text style={styles.error}>{this.state.street_Err}</Text> : null}

									<View style={styles.input}>
										<TextInput style={styles.textbox}
											placeholder="Enter Landmark"
											onChangeText={(landmark) => this.setState({ landmark })}
											value={this.state.landmark}
										>
										</TextInput>
									</View>
									{this.state.landmark_Err ? <Text style={styles.error}>{this.state.landmark_Err}</Text> : null}

									<View style={styles.TwoInputTogether}>
										<View style={styles.Cityinput}>
											<TextInput style={styles.textbox}
												placeholder="Enter City Name"
												onChangeText={(city) => this.setState({ city })}
												value={this.state.city}
											>
											</TextInput>
										</View>

										<View style={styles.Pincodeinput}>
											<TextInput style={styles.textbox}
												placeholder="Enter Pincode"
												onChangeText={(pincode) => this.setState({ pincode })}
												maxLength={10}
												value={this.state.pincode}
												keyboardType="numeric">
											</TextInput>
										</View>
									</View>
									<View style={styles.TwoInputTogether}>
										{this.state.city_Err ? <Text style={styles.errorcity}>{this.state.city_Err}</Text> : null}
										{this.state.pincode_Err && this.state.city_Err ? <Text style={styles.errorleft}>{this.state.pincode_Err}</Text> : this.state.pincode_Err ? <Text style={styles.errorright}>{this.state.pincode_Err}</Text> : null}
									</View>

									<View style={styles.input}>
										<Picker style={{ width: '100%', height: 30 }} itemStyle={{ height: 30 }}
											selectedValue={this.state.address_type}
											onValueChange={(itemValue, itemIndex) =>
												this.setState({ address_type: itemValue })
											}>
											<Picker.Item label='- Select Address Type -'></Picker.Item>
											<Picker.Item label='Pick up' value="Pickup"></Picker.Item>
											<Picker.Item label='Drop-off' value="Drop-off"></Picker.Item>
										</Picker>
									</View>
									{this.state.address_type_Err ? <Text style={styles.error}>{this.state.address_type_Err}</Text> : null}
									<View style={styles.input}>
										<TextInput style={styles.textbox}
											placeholder="Enter Receiver Name"
											onChangeText={(receiver_name) => this.setState({ receiver_name })}
											value={this.state.receiver_name}
										>
										</TextInput>
									</View>
									<View style={styles.input}>
										<TextInput style={styles.textbox}
											placeholder="Enter Receiver Contact"
											onChangeText={(receiver_contact) => this.setState({ receiver_contact })}
											maxLength={10}
											value={this.state.receiver_contact}
											keyboardType="numeric"
										>
										</TextInput>
									</View>
									{
										this.state.latitude != '' &&
										<View style={{flexDirection: 'row'}}>
											<Text style={{width: '50%', fontSize: 16}}>Lat: {this.state.latitude}</Text>
											<Text style={{width: '50%', fontSize: 16}}>Long: {this.state.longitude}</Text>
										</View>
									}
									<View style={[styles.SubmitButtonContainer, {flexDirection: 'row'}]}>
										<TouchableOpacity
											style={styles.SubmitButton}
											onPress={() => this.clear()}>
											<Text style={styles.btntext}>Clear</Text>
										</TouchableOpacity>
										<TouchableOpacity
											style={styles.SubmitButton}
											onPress={() => this.submit()}>
											<Text style={styles.btntext}>{this.state.id ? 'Update' : 'Add'} Address</Text>
										</TouchableOpacity>

									</View>
						</Col>
					</Row>
				</ScrollView>
					<View style={{ flex: 1, padding: 0, }}>
						<View style={{ flex: 1, justifyContent: 'flex-start' }}>
							<SlidingUpPanel style={{ zIndex: 99999 }}
								ref={c => (this._panel = c)}
								draggableRange={{ top: height / 1.30, bottom: 45}}
								animatedValue={this._draggedValue}
								minimumDistanceThreshold={5}
								showBackdrop={true}>
								<Row style={{justifyContent: 'center' , alignItems: 'center',backgroundColor: colorPrimary, height: '5%' , alignItems: 'center',borderTopLeftRadius: 50,borderTopRightRadius: 50,marginRight: '15%', marginLeft: '15%' ,}}>
									<Text style={{fontSize: 18 , color: 'white',}}>Select Address</Text>
								</Row>
								<View style={styles.panel}>
										{/* <TouchableOpacity style={styles.panelHeader}  onPress={() => this.upButtonHandler()}>				
												<Text style={styles.btntxt}> Select Address </Text>
										</TouchableOpacity> */}
									<View style={[styles.slidContent, { height: height / 1.6 }]}>
										<ScrollView 
											refreshControl={
												<RefreshControl colors={[colorPrimary]} refreshing={this.state.loading}
													onRefresh={this.onRefresh.bind(this)} />
											}>

											<View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
												<View>
													<Text style={styles.dropoffText}>Pickup Location</Text>
												</View>
												<View style={[styles.Cityinput, {backgroundColor: 'white', borderRadius: 10, marginTop: 15}]}>
													<TextInput style={styles.textbox}
														placeholder="Search Pickup Location"
														onChangeText={(sValue) => this.searchPickupAddress(sValue)}
														value={this.state.sValue}
													>
													</TextInput>
												</View>
											</View>

											<FlatList
												ref={ref => (this.flatlist = ref)}
												data={this.state.pickLocationList}
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

											<View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
												<View>
													<Text style={styles.dropoffText}>Drop-off Location</Text>
												</View>
												<View style={[styles.Cityinput, {backgroundColor: 'white', borderRadius: 10, marginTop: 15}]}>
													<TextInput style={styles.textbox}
														placeholder="Search Drop-off Location"
														onChangeText={(sDValue) => this.searchDropoffAddress(sDValue)}
														value={this.state.sDValue}
													>
													</TextInput>
												</View>
											</View>
											
											<FlatList
												data={this.state.dropLocationList}
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
										</ScrollView>
									</View>
								</View>
							</SlidingUpPanel>
						</View>
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
										<Text style={styles.ModalHeaderText}>Delete Address</Text>
									</View>
									<View style={styles.ModalContentContainer}>
										<Text style={styles.ContentText}>Are you sure you want to delete address? </Text>
									</View>
									<View style={styles.ModalActionCancelContainer}>
										<TouchableHighlight
											style={styles.ModalOkButton}
											onPress={() => { this.deleteAddess() }}>
											<Text style={styles.modalbtn}>Yes</Text>
										</TouchableHighlight>
										<TouchableHighlight style={styles.ModalCancelButton}
											onPress={() => {
												this.closeModal();
											}}>
											<Text style={styles.modalbtn}>No</Text>
										</TouchableHighlight>
									</View>
								</View>
							</View>
						</Modal>
					</View>
				</KeyboardAvoidingView>
			);
		} else {
			return <ActivityIndicator style={styles.loading} size='large' color={colorPrimary} />
		}
	}
}

export default withNavigation(AddingAddress)

/** EmptyComponent view  */
const EmptyComponent = ({ title }) => (
	<View style={styles.emptyContainer}>
		<Text style={styles.emptyText}>{title}</Text>
	</View>
);

/** style of this page */
const { height } = Dimensions.get('window')
const styles = StyleSheet.create({
	emptyContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: '3%',
		marginBottom: '3%'
	},
	emptyText: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 18,
		color: '#ffffff'
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
	MainContainer: {
		flex: 1,
		//height : height-89
		height: height - 10
	},
	MapContainer: {
		height: 10,
		borderWidth: 1,
		borderRadius: 5,
		borderColor: "rgba(119,119,119,0.6)",
		flex: 1, justifyContent: "center", alignItems: "center"
	},
	Maplabel: {
		textAlignVertical: "center", textAlign: "center",
		fontWeight: 'bold',
		fontSize: 18,
		marginTop: 0,
		backgroundColor: 'yellow'
	},
	map: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	AddressContainer: {
		//padding: "5%",
		//height: 370,
	},
	input: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderColor: "rgba(119,119,119,0.6)",
		marginTop: 3
	},
	textbox: {
		paddingLeft: 10,
		width: '100%',

	},
	AddressHeaderText: {
		fontSize: 20,
		color: colorPrimary,
		fontWeight: '400'
	},
	TwoInputTogether: {
		flexDirection: 'row',
		marginTop: 3
	},
	Cityinput: {
		marginRight: 10,
		width: '50%',
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderColor: "rgba(119,119,119,0.6)",
	},
	Pincodeinput: {
		flexDirection: 'row',
		width: '47%',
		borderBottomWidth: 1,
		borderColor: "rgba(119,119,119,0.6)",
	},
	SubmitButtonContainer: {
		marginTop: 15,
		alignItems: 'center', 
		//marginBottom: '30%',
	},
	SubmitButton: {
		borderWidth: 1,
		backgroundColor: colorPrimary,
		borderRadius: 5,
		borderColor: colorPrimary,
		paddingTop: 8,
		marginTop: 9,
		width: 160,
		height: 40,
		textAlign: "center",
		margin: 10
	},
	btntext: {
		textAlign: 'center',
		color: '#ffffff',
		fontSize: 18,
	},
	error: {
		left: 15,
		color: colorPrimary,
		fontSize: 13,
		marginBottom: 1,
		width: "95%"
	},
	errorcity: {
		left: 15,
		color: colorPrimary,
		fontSize: 13,
		marginBottom: 1,
		width: "47%"
	},
	errorleft: {
		left: 22,
		color: colorPrimary,
		fontSize: 13,
		marginBottom: 1,
		width: "47%"
	},
	errorright: {
		left: '310%',
		color: colorPrimary,
		fontSize: 13,
		marginBottom: 1,
		width: "47%"
	},
	panel: {
		flex: 1,
		backgroundColor: colorPrimary,
		position: 'relative',
		bottom: 0,
		zIndex: 999999,
		 
	},
	panelHeader: {
		position: 'absolute',
		backgroundColor: 'green',
		top: -40,
		marginLeft:'20%',
		marginRight:'20%',
		width:'100%',
		height: '10%',
	},
	btntxt: {
		marginTop: 10,
		textAlign: 'center',
		color: '#ffffff',
		fontSize: 18,
		// fontWeight: '400',
	},
	slidContent: {
		marginTop: 40
	},
	FormContainer: {
		marginTop: 50,
		justifyContent: 'center',
		alignItems: 'center',
	},
	picktext: {
		color: "white",
		fontSize: 14,
		marginLeft: 14
	},
	dropoffText: {
		color: "white",
		fontSize: 14,
		marginLeft: 14,
		marginTop: 15,
	},
	card: {
		marginTop: 12,
		marginLeft: 10,
		marginRight: 10,
		paddingTop: 10,
		paddingBottom: 10,
		paddingRight: 10,
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
	ItemHeader: {
		color: '#333333',
		fontWeight: '500',
		fontSize: 17
	},
	InnerContainer: {
		flexDirection: 'row',
		alignItems: 'flex-start'
	},
	ActionIconContainer: {
		alignItems: 'flex-end',
		flexDirection: 'row',
		width: "25%",
		marginLeft: 10
	},
	ActionIcon: {
		marginTop: 5,
		marginLeft: 10,
		paddingBottom: 7,
		paddingTop: 7,
		paddingLeft: 7,
		paddingRight: 7,
		borderRadius: 2,
		backgroundColor: colorPrimary,
	},
	EditActionIcon: {
		marginTop: 5,
		marginLeft: 10,
		paddingBottom: 7,
		paddingTop: 7,
		paddingLeft: 7,
		paddingRight: 7,
		borderRadius: 2,
		borderWidth: 1,
		borderColor: colorPrimary,
	},
	LabelContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-start',
		width: "75%"
	},
	LabelName: {
		marginLeft: 5,
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
	modal: {
		position: 'absolute',
		top: 50,
		left: 30,
		backgroundColor: '#FFFFFF',
		height: 480,
		width: 300,
		borderRadius: 9,
		shadowColor: "#777",
		shadowOffset: { width: 0, height: 1, },
		shadowOpacity: 0.5,
		shadowRadius: 6.22,
		elevation: 5,
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
	modalbtn: {
		color: "white"
	},
	ContentText: {
		fontSize: 14,
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
});
