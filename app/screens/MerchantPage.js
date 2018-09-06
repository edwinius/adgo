import React from 'react';
import { View, Text, AsyncStorage, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Thumbnail } from 'native-base';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { FontAwesome, Entypo } from 'react-native-vector-icons';

import Header from './Header';
import MerchantDetails from './MerchantDetails';
import MerchantAds from './MerchantAds';
import TabFlyers2 from './TabFlyers2';

export default class MerchantPage extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			merchant:[{
				'company_pid': '1'
			}],
			userPid: '',
			userToken: '',
		}
	}
	
	async getData() {
		try {
			const navigation = this.props.navigation;
			const userPid = await AsyncStorage.getItem('userPid');
			const userToken = await AsyncStorage.getItem('userToken');
			const companyPid = navigation.state.params.company_pid;
			
			if(userPid !== null && userPid != '' && userToken !== null && userToken != '') {
				this.setState({ 
					userPid: userPid,
					userToken: userToken
				});
			} else {
				userPid = '0',
				userToken = '0'
			}
			
			// Fetch merchant
			fetch(`${global.uri}api_controller/fetch_merchant_home`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					appToken: global.appToken,
					userPid: userPid,
					userToken: userToken,
					companyPid: companyPid
				})
			}).then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);
				this.setState({
					follow: responseJson['follow'],
					merchant: responseJson['data'],
					follower: responseJson['follower'],
					isLoading: false
				});
			}).catch((error) => {
				console.error(error);
			});
		} catch(error) {
			console.log(error);
		}
	}
	
	UnfollowConfirm = () => {
		Alert.alert(
			'Unfollow this Account ?',
			'You will not receive new promotions from this merchant anymore',
			[
				{ text: 'Unfollow', onPress: () => this.MerchantUnfollow() },
				{ text: 'Cancel' }
			],
		);
	}
	
	MerchantUnfollow = () => {
		const navigation = this.props.navigation;
		const userPid = this.state.userPid;
		const userToken = this.state.userToken;
		
		if(userPid !== null && userPid != '' && userToken !== null && userToken != '') {
			this.setState({
				isLoading: true
			});
			
			fetch(`${global.uri}api/unfollow_merchant`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userPid: this.state.userPid,
					appToken: global.appToken,
					userToken: userToken,
					companyPid: navigation.state.params.company_pid
				})
			}).then((response) => response.json())
			.then((responseJson) => {
				this.setState({
					isLoading: false,
					follow: responseJson
				});
			}).catch((error) => {
				console.error(error);
			});
		} else {
			Alert.alert('Please Sign In to Follow');
		}
	}
	
	MerchantFollow = () => {
		const navigation = this.props.navigation;
		const userPid = this.state.userPid;
		const userToken = this.state.userToken;
		
		if(userPid !== null && userPid != '' && userToken !== null && userToken != '') {
			this.setState({
				isLoading: true
			});
			
			fetch(`${global.uri}api/follow_merchant`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userPid: this.state.userPid,
					appToken: global.appToken,
					userToken: userToken,
					companyPid: navigation.state.params.company_pid
				})
			}).then((response) => response.json())
			.then((responseJson) => {
				this.setState({
					isLoading: false,
					follow: responseJson
				});
			}).catch((error) => {
				console.error(error);
			});
		} else {
			Alert.alert('Please Sign In to Follow');
		}
	}
	
	componentDidMount() {
		this.getData();
	}
	
	ShowFollowBtn() {
		if(this.state.follow == '1') {
			return(
				<TouchableOpacity
					style={ styles.btnUnfollow }
					onPress={ this.UnfollowConfirm }
				>
					<Text style={ styles.txtBtnFollowing }>
						Favorited
					</Text>
				</TouchableOpacity>
			);
		} else {
			return(
				<TouchableOpacity
					style={ styles.btnFollow }
					onPress={ this.MerchantFollow }
				>
					<Text style={ styles.txtBtnFollow }>
						Favorite
					</Text>
				</TouchableOpacity>
			);
		}
	}
	
	render() {
		const navigation = this.props.navigation;
		
		function createComponent(instance, props) {
			return () => React.createElement(instance, props);
		}
			
		const MerchantDetailScreen = createComponent(MerchantDetails, {
			company_pid: navigation.state.params.company_pid
		});
		
		const AdvertisementScreen = createComponent(MerchantAds, {
			company_pid: navigation.state.params.company_pid,
			navigation: navigation
		});
		
		const TabFlyerScreen = createComponent(TabFlyers2, {
			company_pid: navigation.state.params.company_pid,
			navigation: navigation
		});
		
		const MerchantTabs = createBottomTabNavigator({
			Flyer: {
				path: 'people/:name',
				screen: TabFlyerScreen,
				navigationOptions: {
					tabBarLabel: 'Promotions',
					tabBarPosition: 'bottom',
					tabBarIcon: ({ tintColor }) =>
						<Entypo name='book' size={ 25 } color={ tintColor } />
				}
			},
			Home: {
				screen: MerchantDetailScreen,
				navigationOptions: {
					tabBarLabel: 'Profile',
					tabBarPosition: 'bottom', 
					tabBarIcon: ({ tintColor }) =>
						<FontAwesome name='address-book' size={ 25 } color={ tintColor } />
				}
			},
		}, {
			tabBarOptions: {
				showIcon: true,
				style: {
					backgroundColor: '#ffffff',
					borderTopWidth: 0.5,
					borderColor: 'grey',
					paddingTop: 5,
				},
				activeTintColor: '#ff4d4d',
				inactiveTintColor: 'grey',
				indicatorStyle: {
					backgroundColor: '#ff4d4d',
				},
			}
		});
		
		return(
			<View style={{ flex: 1 }}>
				<Header 
					navigation={navigation} 
					title={`${navigation.state.params.company_name}`} 
					screen_from={`${ navigation.state.params.screen_from }`}
				/>
				
				<View style={ styles.containerCompanyInfo }>
					
					<View style={ styles.containerCompanyLogo }>
						<View style={ styles.companyLogo }>
							<Thumbnail
								large
								source={{ uri: `${global.uri}assets/images/company_logo/${this.state.merchant[0].company_pid}/${this.state.merchant[0].company_logo}`}}
								resizeMode='contain'
							/>
						</View>
					</View>
					
					<View style={ styles.containerCompanyDetail }>
						<View style={ styles.containerCompanyFollowers }>
							<Text style={ styles.txtCompanyFollowers }>
								{ this.state.follower } Favorites
							</Text>
						</View>
						
						{ this.ShowFollowBtn() }
					</View>
					
				</View>
				
				<View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
					<MerchantTabs />
				</View>
				
			</View>
		);
	}

}

const styles = StyleSheet.create({
	containerCompanyInfo: {
		flexDirection: 'row',
		paddingVertical: 10,
		backgroundColor: 'white',
		borderBottomWidth: 1,
		borderColor: '#cacaca'
	},
	containerCompanyLogo: {
		width: 120,
		alignItems: 'center',
		paddingVertical: 10
	},
	companyLogo: {
		width: 85,
		height: 85,
		borderRadius: 40,
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#cacaca',
	},
	containerCompanyDetail: {
		flex: 1,
		paddingHorizontal: 10,
		paddingTop: 10,
	},
	containerCompanyFollowers: {
		paddingHorizontal: 10,
		paddingBottom: 6,
	},
	btnFollow: {
		borderWidth: 1,
		borderColor: '#cacaca',
		borderRadius: 5,
		paddingVertical: 4,
		marginHorizontal: 10
	},
	btnUnfollow: {
		paddingVertical: 4,
		marginHorizontal: 10,
		borderRadius: 5,
		backgroundColor: 'rgba(0, 128, 0, 0.8)',
		borderWidth: 1,
		borderColor: 'green'
	},
	txtBtnFollow: {
		textAlign: 'center'
	},
	txtBtnFollowing: {
		textAlign: 'center',
		color: 'white'
	},
});