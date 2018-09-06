import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, Button, AsyncStorage, Dimensions } from 'react-native';

import Header from './Header';
import { addDot } from '../efunctions';

const dimensions = Dimensions.get('window');
const dWidth = dimensions.width;

export default class RewardView extends React.Component {
	
	constructor(props) {
		super(props);
		
		const navigation = this.props.navigation;
		const points = navigation.state.params.points;
		
		this.state = {
			isLoading: false,
			userPid: '',
			userToken: '',
			userPoint: points,
			results: {
				reward: []
			}
		}
		
	}
	
	async getToken() {
		try {
			const userPid = await AsyncStorage.getItem('userPid');
			const userToken = await AsyncStorage.getItem('userToken');
			
			if(userPid !== null && userToken !== null) {
				this.setState({ 
					userPid: userPid,
					userToken: userToken
				});
			}
		} catch(error) {
			console.log(error);
		}
	}
	
	componentDidMount() {
		this.getToken();
		
		fetch(`${global.uri}api/list_rewards`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				appToken: global.appToken
			})
		}).then((response) => response.json())
		.then((responseJson) => {
			this.setState({
				results: responseJson
			});
		}).catch((error) => {
			console.error(error);
		});	
	}
	
	ShowRewards() {
		const { userPoint } = this.state;
		const { userPid } = this.state;
		const { userToken } = this.state;
		const navigation = this.props.navigation;
		
		RedeemReward = (rewardPid, img) => {
			const userPointInt = parseInt(userPoint);
				
			if(userPointInt >= 50000) {
				navigation.navigate('Redeem', {
					img: img
				});
			} else {
				Alert.alert('Not enough points');
			}
		}
		
		const arrRedeem = [
			{
				redeem_category: 'Transfer Banks',
				redeem_data: [
					{
						dataImg: require('../assets/images/logo_bank_bca.png'),
						dataText: 'BCA',
						dataId: '11',
					},
					{
						dataImg: require('../assets/images/logo_bank_bni.png'),
						dataText: 'BNI',
						dataId: '12',
					},
					{
						dataImg: require('../assets/images/logo_bank_mandiri.png'),
						dataText: 'Mandiri',
						dataId: '13',
					},
					{
						dataImg: require('../assets/images/logo_bank_cimb.png'),
						dataText: 'CIMB',
						dataId: '14',
					}
				]
			},
			{
				redeem_category: 'Pulsa',
				redeem_data: [
					{
						dataImg: require('../assets/images/logo_pulsa_telkomsel.png'),
						dataText: 'Telkomsel',
						dataId: '21',
					},
					{
						dataImg: require('../assets/images/logo_pulsa_xl.png'),
						dataText: 'XL',
						dataId: '22',
					},
					{
						dataImg: require('../assets/images/logo_pulsa_indosat.png'),
						dataText: 'Indosat',
						dataId: '23',
					},
					{
						dataImg: require('../assets/images/logo_pulsa_smartfren.png'),
						dataText: 'Smartfren',
						dataId: '24',
					}
				]
			},
			{
				redeem_category: 'Lain - Lain',
				redeem_data: [
					{
						dataImg: require('../assets/images/logo_etc_gopay.png'),
						dataText: 'Go-Pay',
						dataId: '31',
					},
					{
						dataImg: require('../assets/images/logo_etc_ovo.png'),
						dataText: 'OVO',
						dataId: '32',
					},
					{
						dataImg: require('../assets/images/logo_etc_cgv.png'),
						dataText: 'CGV',
						dataId: '33',
					},
					{
						dataImg: require('../assets/images/logo_etc_xxi.png'),
						dataText: 'XXI',
						dataId: '34',
					}
				]
			}
		];
		
		const redeem = arrRedeem.map(function(item, index) {
			const content = item.redeem_data.map(function(item, index) {
				return(
					<TouchableOpacity 
						style={ styles.containerImgRedeem }
						key={ index }
						onPress={() => this.RedeemReward(`${item.dataId}`, item.dataImg)}
					>
						<Image
							style={ styles.imgRedeem }
							source={ item.dataImg }
						/>
					</TouchableOpacity>
				);
			});
			
			return(
				<View 
					style={ styles.containerRedeemCategory }
					key={ index }
				>
					<View style={ styles.containerTxtCategory }>
						<Text style={ styles.txtCategory }>
							{ item.redeem_category }
						</Text>
					</View>
					
					<View style={ styles.containerRedeemImages }>
						{content}
					</View>
				</View>
			);
		});
		
		return(redeem);
	}
	
	render() {
		const navigation = this.props.navigation;
		
		if(this.state.isLoading) {
			return(
				<View style={{ flex: 1, paddingTop: 20, justifyContent: 'center' }} >
					<ActivityIndicator />
				</View>
			);
		}
		
		return(
			<View style={{ flex: 1 }}>
				<Header navigation={ navigation } title='Redeem' />
				
				<View style={{ flex: 1 }}>
					<View style={ styles.containerPoint }>
						{/*<Image
							style={ styles.iconCoin }
							source={ require('../assets/images/icon_coin.png') }
						/>*/}
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
					
					<ScrollView style={ styles.containerRewards }>
						<View style={ styles.containerRules }>
							<Text style={ styles.txtRules }>
								How to redeem your balance: 
								{"\n"} 
								Choose the method of redeeming and input the amount that you want to redeem.
								{"\n"}
								* The minimum amount for redeeming your balance is IDR 50.000
							</Text>
						</View>
								
						<View style={ styles.containerContent }>
							{ this.ShowRewards() }
						</View>
					</ScrollView>
				</View>
				
			</View>
		);
	}

}

const styles = StyleSheet.create({
	containerPoint: {
		paddingVertical: 20,
		paddingHorizontal: 25,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	iconCoin: {
		width: 25,
		height: 25,
		marginRight: 10
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
	containerRewards: {
		flex: 1,
	},
	boxReward: {
		shadowColor: 'grey',
		shadowOffset: { width: 1, height: 1 },
		shadowRadius: 2,
		shadowOpacity: 0.35,
		paddingHorizontal: 10,
		height: 100,
		margin: 5,
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: 'white'
	},
	containerRewardImg: {
		width: 120,
	},
	containerRewardTxt: {
		justifyContent: 'flex-start',
		flex: 1,
		height: 100
	},
	imageReward: {
		width: 100,
		height: 100,
	},
	containerRewardPoint: { 
		flexDirection: 'row',
		marginTop: 10
	},
	txtRewardPoint: {
		backgroundColor: 'teal',
		color: 'white',
		paddingVertical: 3,
		paddingHorizontal: 6,
		flexWrap: 'wrap',
		alignItems: 'flex-start',
        flexDirection:'row',
	},
	txtRewardTitle: {
		textAlign: 'left',
		fontWeight: 'bold',
		fontSize: 18,
		paddingTop: 5,
		paddingBottom: 3
	},
	
	containerContent: {
		flex: 1,
		paddingTop: 3,
		paddingLeft: 2,
		paddingBottom: 30
	},
	containerRules: {
		backgroundColor: 'white',
		paddingVertical: 5,
		paddingHorizontal: 15,
		marginTop: 4,
	},
	txtRules: {
		fontSize: 12,
	},
	
	// Content Redeem Images
	containerRedeemCategory: {
		flex: 1,
		paddingTop: 5,
	},
	containerTxtCategory: {
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
	containerRedeemImages: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
	},
	containerImgRedeem: {
		backgroundColor: 'white',
		width: '50%',
		borderRightWidth: 2,
		borderBottomWidth: 2,
		borderColor: '#f2f2f2',
		height: dWidth/3,
		alignItems: 'center',
		justifyContent: 'center'
	},
	imgRedeem: {
		width: (dWidth/2)-20,
		height: 250/800*((dWidth/2) - 20),
	}
});