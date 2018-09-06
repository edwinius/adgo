import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import { TabNavigator, TabBarTop } from 'react-navigation';
import { createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { Thumbnail } from 'native-base';

import TabPromo from './TabPromo';
import Header from './Header';

const dimensions = Dimensions.get('window');
const dWidth = dimensions.width;

export default class TabFlyers2 extends React.Component {
	
	constructor(props) {
		super(props);
		var handleToUpdate  = this.handleToUpdate.bind(this);
		this.state = {
			results: {},
			tabs: {},
			scrollTop: '1',
			follow: '',
			userPid: '',
			userToken: '',
			merchant:[{
				'company_pid': '1'
			}],
			follower: ''
		}
	}
	
	handleToUpdate = (arg) => {
        
    }
	
	async getToken() {
		try {
			const navigation = this.props.navigation;
			const userPid = await AsyncStorage.getItem('userPid');
			const userToken = await AsyncStorage.getItem('userToken');
			const companyPid = navigation.state.params.company_pid;
			var handleToUpdate = this.handleToUpdate;
			
			function createComponent(instance, props) {
				return () => React.createElement(instance, props);
			}
			
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
				
				// Fetch tabs and promo
				fetch(`${global.uri}api/fetch_tabs/${navigation.state.params.company_pid}`, {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						appToken: global.appToken,
						companyPid: companyPid
					})
				}).then((response) => response.json())
				.then((responseJson) => {
					//console.log(responseJson);
					//console.log(this.state.tabs);
					
					if(responseJson['success'] == '1') {
						const arrTabs = {};
						const objScreens = {};
						
						const resultTabs = responseJson['result'].map(function(item) {
							//arrTabs.push(item.category_name.toString());
							const objCategory = {
								screen: createComponent(TabPromo, {categoryPid: item.category_pid, handleToUpdate: handleToUpdate.bind(this) })
							};
							
							const objDetails = {};
							objDetails['tabBarLabel'] = item.category_name.toString();
							
							objCategory['navigationOptions'] = objDetails;
							objScreens['Tab' + item.category_pid] = objCategory;
						});
						
						arrTabs = objScreens;
						this.setState({
							tabs: arrTabs
						});
						
						//console.log(arrTabs);
					}
						
				}).catch((error) => {
					console.error(error);
				});
			//}
		} catch(error) {
			console.log(error);
		}
	}
	
	componentWillMount() {
		
	}
	
	componentWillUnmount() {
		this.isCancelled = true;
	}
	
	componentDidMount() {
		this.getToken();
	}
	
	ShowTabs() {
		const count = Object.keys(this.state.tabs).length;
		if(count > 0) {
			const tnv = this.state.tabs;
			const navigation = this.props.navigation;
			
			const MainScreenNavigator = createMaterialTopTabNavigator(tnv, {
				lazy: true,
				animationEnabled: true,
				swipeEnabled: true,
				tabBarOptions: {
					showIcon: true,
					style: {
						backgroundColor: '#ffffff',
						borderTopWidth: 0.5,
						borderColor: 'grey',
						paddingVertical: 0,
					},
					tabStyle: {
						width: 'auto',
						flex: 1,
						paddingTop: 0
					},
					labelStyle: {
						paddingTop: 0
					},
					activeTintColor: '#673ab7',
					inactiveTintColor: 'grey',
					indicatorStyle: {
						//backgroundColor: '#673ab7',
						opacity: 0
					},
					scrollEnabled: true,
				}
			});
		
			return(
				<MainScreenNavigator />
			);
		} else {
			return(
				<Text>No Ads</Text>
			);
		}
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
	
	UnfollowConfirm = () => {
		Alert.alert(
			'Unfollow this Account ?',
			'',
			[
				{ text: 'Unfollow', onPress: () => this.MerchantUnfollow() },
				{ text: 'Cancel' }
			],
		);
	}
	
	render() {
		const navigation = this.props.navigation;
		var handleToUpdate  =   this.handleToUpdate;
		return(
			<View style={{ flex: 1 }}>
				<Header navigation={navigation} title={`${navigation.state.params.company_name}`} />
				
				<View style={ styles.containerCompanyInfo }>
					
					<View style={ styles.containerCompanyLogo }>
						<View style={ styles.companyLogo }>
							<Thumbnail
								large
								source={{ uri: `${global.uri}assets/images/company_logo/${this.state.merchant[0].company_pid}/${this.state.merchant[0].company_logo}`}}
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
				
				<View style={{ flex: 1, height: 300 }}>
					{ this.ShowTabs() }
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
	containerCompanyDesc: {
		backgroundColor: 'white',
		paddingHorizontal: 10,
		marginBottom: 10,
		paddingVertical: 10
	},
	companyDescRow: {
		paddingVertical: 5
	},
	containerContent: {
		flex: 1,
		paddingVertical: 2
	},
});