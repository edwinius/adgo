import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TextInput, AsyncStorage, Alert, ScrollView, TouchableOpacity } from 'react-native';

const dimensions = Dimensions.get('window');
const dWidth = dimensions.width;

import Header from './Header';
import { addDot } from '../efunctions';

export default class RedeemView extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			userPid: '',
			userToken: '',
			userPoint: ''
		}
	}
	
	async getToken() {
		try {
			const userPid = await AsyncStorage.getItem('userPid');
			const userToken = await AsyncStorage.getItem('userToken');
			
			if(userPid !== null && userToken !== null) {
				// Fetch user point
				fetch(`${global.uri}api/fetch_user_point`, {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						appToken: global.appToken,
						userPid: userPid,
						userToken: userToken
					})
				}).then((response) => response.json())
				.then((responseJson) => {
					console.log(responseJson);
					if(responseJson['success'] == '1') {
						this.setState({
							userPid: userPid,
							userToken: userToken,
							userPoint: responseJson['user_point'],
						});
					} else {
						Alert.alert('Unknown Error. Please Try Again');
					}
				}).catch((error) => {
					console.error(error);
				});
			}
		} catch(error) {
			console.log(error);
		}
	}
	
	componentDidMount() {
		this.getToken();
	}

	render() {
		const navigation = this.props.navigation;
		const img = navigation.state.params.img;
		
		return(
			<View style={{ flex: 1 }}>
				<Header navigation={ navigation } title='Redeem' />
				
				<View style={ styles.containerContent }>
					<View style={ styles.containerPoint }>
						<View>
							<Text style={ styles.txtMyBalance }>
								My Balance
							</Text>
						</View>
						
						<View style={ styles.containerTxtPoint }>
							<Text style={ styles.txtIDR }>
								IDR
							</Text>
						
							<Text style={ styles.txtPoint }>
								{ addDot(this.state.userPoint) }
							</Text>
						</View>
					</View>
					
					<ScrollView style={ styles.containerScrollRedeem }>
						<View style={ styles.containerImgRedeem }>
							<Image
								style={ styles.imgRedeem }
								source={ img }
							/>
						</View>
						
						<View style={ styles.containerFormRedeem }>
							<View style={ styles.formRowRedeem }>
								<View style={ styles.rowRedeemLabel }>
									<Text style={ styles.txtRedeemLabel }>
										Jumlah di redeem
									</Text>
								</View>
								
								<View style={ styles.rowRedeemInput }>
									<TextInput 
										style={ styles.redeemInputAmount } 
									/>
								</View>
							</View>
							
							<View style={ styles.formRowRedeem }>
								<TouchableOpacity style={ styles.formBtnSubmit }>
									<Text style={ styles.txtSubmit }>
										Redeem Now
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</ScrollView>
				</View>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	// Balance
	containerPoint: {
		paddingVertical: 20,
		paddingHorizontal: 25,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	txtMyBalance: {
		paddingTop: 6
	},
	containerTxtPoint: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'flex-end',
	},
	txtIDR: {
		paddingRight: 15,
	},
	txtPoint: {
		paddingTop: 1,
		fontSize: 20,
		fontWeight: 'bold',
	},
	
	// Image Redeem
	containerScrollRedeem: {
		marginTop: 5,
		backgroundColor: 'white',
	},
	containerImgRedeem: {
		alignItems: 'center',
		justifyContent: 'center',
		width: dWidth,
		paddingVertical: 15,
		backgroundColor: 'white',
	},
	imgRedeem: {
		width: dWidth - 35,
		height: 250/800*(dWidth - 35),
	},
	
	// Form
	containerFormRedeem: {
		paddingVertical: 25,
		paddingHorizontal: 10
	},
	rowRedeemLabel: {
		paddingVertical: 10,
	},
	txtRedeemLabel: {
		fontSize: 20
	},
	rowRedeemInput: {
		paddingVertical: 10,
	},
	redeemInputAmount: {
		borderWidth: 1,
		borderColor: '#cacaca',
		paddingVertical: 10,
		paddingHorizontal: 10,
		borderRadius: 5,
	},
	formBtnSubmit: {
		backgroundColor: 'green',
		paddingVertical: 10,
		alignItems: 'center',
		marginTop: 20,
	},
	txtSubmit: {
		color: 'white',
		fontWeight: 'bold',
	}
		
});