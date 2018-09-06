import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, Button, AsyncStorage } from 'react-native';

import Header from './Header';

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
		
		if(this.state.results.reward.length > 0) {
			RedeemReward = (rewardPoint, rewardPid) => {
				const userPointInt = parseInt(userPoint);
				const rewardPointInt = parseInt(rewardPoint);
				
				this.setState({
					isLoading: true
				});
				
				if(userPointInt >= rewardPointInt) {
					fetch(`${global.uri}api/redeem_rewards`, {
						method: 'POST',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							appToken: global.appToken,
							userPid: userPid,
							userToken: userToken,
							rewardPid: rewardPid,
							rewardPoint: rewardPoint
						})
					}).then((response) => response.json())
					.then((responseJson) => {
						console.log(responseJson);
						Alert.alert(responseJson['msg']);
						
						if(responseJson['success'] == '1') {
							const newPoint = userPointInt - rewardPointInt;
							
							this.setState({
								isLoading: false,
								userPoint: newPoint
							});
						} else {
							this.setState({
								isLoading: false
							});
						}
						
					}).catch((error) => {
						console.error(error);
					});	
				} else {
					Alert.alert('Not enough points');
					this.setState({
						isLoading: false
					});
				}
			}
			
			const contents = this.state.results.reward.map(function (item) {
				return(
					<TouchableOpacity 
						key={ item.reward_pid } 
						style={ styles.boxReward }
						onPress={() => this.RedeemReward(`${item.reward_point}`, `${item.reward_pid}`)}
					>
						<View style={ styles.containerRewardImg }>
							<Image 
								style={ styles.imageReward }
								source={{ uri: `${global.uri}assets/images/rewards/${item.reward_image}`}}
							/>
						</View>
						
						<View style={ styles.containerRewardTxt }>
							<View style={ styles.containerRewardPoint } >
								<Text style={ styles.txtRewardPoint }>
									{item.reward_point} Points
								</Text>
							</View>
							<Text style={ styles.txtRewardTitle }>
								{item.reward_title}
							</Text>
							<Text style={ styles.txtRewardAmount }>
								Rp. {item.reward_amount}
							</Text>
						</View>
					</TouchableOpacity>
				);
			});
			
			return(contents);
		}
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
								{ this.state.userPoint }
							</Text>
						</View>
					</View>
					
					<ScrollView style={ styles.containerRewards }>
						{ this.ShowRewards() }
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
		flex: 1
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
	}
});