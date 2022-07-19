import React, { Component } from 'react';
import NavigationDrawerStructure from './navigationdrawerstructure';
import LogoImage from '../../Components/applogo';

import { StyleSheet, View, Text, RefreshControl, ActivityIndicator, ScrollView, AsyncStorage, KeyboardAvoidingView } from 'react-native';

import { managerPaymentOptionAction } from '../../util/action';
import { colorPrimary } from '../../Components/colors';
export default class MyBooking extends Component {

	/** navigation header */
	static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: (
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<LogoImage />
					<View style={styles.HeaderTextArea}>
						<Text style={styles.HeaderText}>Payment Options</Text>

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
			loader: false,
			account_holder_name: '', account_holder_name_Err: '',
			account_number: '', account_number_Err: '',
			bank_name: '', bank_name_Err: '',
			ifsc_code: '', ifsc_code_Err: '',
			upi_id: '', upi_id_Err: '',
		}

	};

	/** this method call when screen load */
	componentDidMount() {
		this.getUserAccountData();
	}

	/** get manager account detail */
	async getUserAccountData() {
		this.setState({ loader: true });
		const customerID = await AsyncStorage.getItem('userid');
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
					loader: false
				})

			} else {
				alert(responseJson.message);
			}
		});
	}

	/** refresh method  */
	onRefresh() {
		this.getUserAccountData();
	}

	render() {
		const { loader } = this.state;

		if (!loader) {
			return (
				// <KeyboardAvoidingView
				// 	style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }}
				// 	behavior="padding" enabled
				// 	keyboardVerticalOffset={100}>

					<ScrollView
						refreshControl={
							<RefreshControl colors={[colorPrimary]} refreshing={this.state.loading}
								onRefresh={this.onRefresh.bind(this)} />
						}>
						<View style={styles.container}>
							<View style={styles.form}>
								<View style={styles.control}>
									<View style={styles.combine}>
										<Text style={styles.label}>A/c Holder Name </Text>
										<Text style={styles.middlelabel}>: </Text>
										<Text style={styles.label}>{this.state.account_holder_name}</Text>
									</View>
									{this.state.account_holder_name_Err ? <Text style={styles.error}>{this.state.account_holder_name_Err}</Text> : null}
								</View>

								<View style={styles.control}>
									<View style={styles.combine}>
										<Text style={styles.label}>Account No. </Text>
										<Text style={styles.middlelabel}>: </Text>
										<Text style={styles.label}>{this.state.account_number}</Text>
									</View>
									{this.state.account_number_Err ? <Text style={styles.error}>{this.state.account_number_Err}</Text> : null}
								</View>
								<View style={styles.control}>
									<View style={styles.combine}>
										<Text style={styles.label}>Bank Name </Text>
										<Text style={styles.middlelabel}>: </Text>
										<Text style={styles.label}>{this.state.bank_name}</Text>
									</View>
									{this.state.bank_name_Err ? <Text style={styles.error}>{this.state.bank_name_Err}</Text> : null}
								</View>
								<View style={styles.control}>
									<View style={styles.combine}>
										<Text style={styles.label}>Branch Name </Text>
										<Text style={styles.middlelabel}>: </Text>
										<Text style={styles.label}>{this.state.branch_name}</Text>
									</View>
									{this.state.branch_name_Err ? <Text style={styles.error}>{this.state.branch_name_Err}</Text> : null}
								</View>
								<View style={styles.control}>
									<View style={styles.combine}>
										<Text style={styles.label}>IFSC Code </Text>
										<Text style={styles.middlelabel}>:</Text>
										<Text style={styles.label}>{this.state.ifsc_code}</Text>
									</View>
									{this.state.ifsc_code_Err ? <Text style={styles.error}>{this.state.ifsc_code_Err}</Text> : null}
								</View>

								<View style={styles.control}>
									<View style={styles.combine}>
										<Text style={styles.label}>UPI ID </Text>
										<Text style={styles.middlelabel}>: </Text>
										<Text style={styles.label}>{this.state.upi_id}</Text>
									</View>
									{this.state.upi_id_Err ? <Text style={styles.error}>{this.state.upi_id_Err}</Text> : null}
								</View>
							</View>
						</View>
					</ScrollView>
				// </KeyboardAvoidingView>
			)
		} else {
			return <ActivityIndicator style={styles.loading} size='large' color={colorPrimary} />
		}
	};
}

/** Style of this page */
const styles = StyleSheet.create({
	HeaderTextArea: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	HeaderText: {
		marginLeft: 30,
		color: colorPrimary,
		fontSize: 25,
		fontWeight: 'bold'
	},
	form: {
		margin: 20,
		width: "90%"
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
		marginBottom: 10,
	},
	combine: {
		flexDirection: 'row',
	},
	input: {
		paddingTop: 0,
		width: "59%",
		marginLeft: 'auto',
		borderBottomWidth: 1,
		color: "rgba(119,119,119,1)",
	},
	btncontrol: {
		flex: 1,
		alignItems: 'center',
		flexDirection: 'column',
		justifyContent: 'space-between',
		marginBottom: 50
	},
	button: {
		borderWidth: 1,
		backgroundColor: colorPrimary,
		borderRadius: 5,
		borderColor: colorPrimary,
		shadowColor: "#777",
		shadowOffset: { width: 0, height: 1, },
		shadowOpacity: 0.5,
		shadowRadius: 6.22,
		elevation: 5,
		paddingTop: 8,
		width: 180,
		marginTop: 100,
		height: 40,
		textAlign: "center"
	},
	btntext: {
		textAlign: 'center',
		color: '#ffffff',
		fontSize: 18,
	},
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	error: {
		left: 140,
		color: colorPrimary,
		fontSize: 13,
		width: 200
	},
	editbtn: {
		borderWidth: 1,
		backgroundColor: colorPrimary,
		borderRadius: 5,
		borderColor: colorPrimary,
		shadowColor: "#777",
		shadowOffset: { width: 0, height: 1, },
		shadowOpacity: 0.5,
		shadowRadius: 6.22,
		elevation: 5,
		paddingTop: 8,
		width: 50,
		marginTop: 100,
		height: 40,
		textAlign: "center"
	},
	loading: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center'
	}
});