import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, AsyncStorage, ScrollView, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import { onSignOut } from '../auth';
import { NavigationActions } from 'react-navigation';
import { Entypo, FontAwesome } from 'react-native-vector-icons';

import Banner from './Banner';
import globalConst from '../globalConst';
import { addDot } from '../efunctions';

const styleGeneral = require('./styleGeneral');

const dimensions = Dimensions.get('window');
const dWidth = dimensions.width;

export default class ProfileView extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			userToken: '',
			userPid: '',
			user: [
				{
					user_name: '',
					user_point: ''
				}
			],
			stats_answered: '',
			stats_earned: '',
			stats_favorited: '',
			isLoading: false
		}
	}
	
	async getToken() {
		try {
			const userPid = await AsyncStorage.getItem('userPid');
			const userToken = await AsyncStorage.getItem('userToken');
			
			if(userPid !== null && userPid != '' && userToken !== null && userToken != '') {
				this.setState({ 
					userPid: userPid,
					userToken: userToken
				});
				
				/*
				return fetch(`${global.uri}adgo/api_controller/get_user_detail/${userPid}`)
					.then((response) => response.json())
					.then((responseJson) => {
						this.setState({
							user: responseJson
						});
				}).catch((error) => {
					console.error(error);
				});
				*/
				
				fetch(`${global.uri}api/get_user_detail`, {
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
					this.setState({
						user: responseJson['user'],
						stats_answered: responseJson['stats_answered'],
						stats_earned: responseJson['stats_earned'],
						stats_favorited: responseJson['stats_favorited'],
						isLoading: false
					});
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
	
	SignOut() {
		 return this.props
               .navigation
               .dispatch(NavigationActions.reset(
                 {
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'SignedOut'})
                    ]
                  }));
	}
	
	loadProfile() {
		const navigation = this.props.navigation;
		
		if(this.state.userPid !== null && this.state.userPid != '' && this.state.userToken !== null && this.state.userToken != '') {
			return(
				<View style={ styles.containerProfileTop }>
				<View style={ styles.containerProfile }>
					<View style={ styles.containerProfileIcon }>
						<View style={ styles.containerBorderPhoto }>
							<View style={ styles.circlePhoto }>
								<Image
									style={ styles.iconProfile }
									source={
										( (this.state.userPid !== null && this.state.userPid != '') ? { uri: `${global.uri}assets/images/user_photo/${this.state.userPid}/${this.state.user[0].user_photo}`} :
										require('../assets/images/icon_profile.png') )
									}
								/>
							</View>
						</View>
					</View>
					
					<View style={ styles.containerProfileDetails }>
						<View style={ styles.containerBtnEdit }>
							<TouchableOpacity 
								style={ styles.btnEditProfile }
								onPress={ () => navigation.navigate('EditOption')}
							>
								<Text style={ styles.btnTxtEdit }>
									Edit Profile
								</Text>
							</TouchableOpacity>
						</View>
						<View>
							<Text style={ styles.profileLabel }>
								{this.state.user[0].user_name}
							</Text>
						</View>
						<View>
							<Text style={ styles.profileLabel }>
								+62 {this.state.user[0].user_handphone}
							</Text>
						</View>
						<View>
							<Text style={ styles.profileLabel }>
								{this.state.user[0].user_email}
							</Text>
						</View>
					</View>
				</View>
				
				<View style={ styles.containerProfileStatistics }>
					
					<View style={ styles.containerStatistics }>
						<View style={ styles.containerIconStatistics }>
							<Entypo name='bar-graph' size={ 50 } color='orange' />
						</View>
						<View style={ styles.containerTxtStatistics }>
							<Text style={ styles.txtStatistics }>
								{ addDot(this.state.stats_answered) } Ads Answered
							</Text>
						</View>
					</View>
					
					<View style={ styles.containerStatistics }>
						<View style={ styles.containerIconStatistics }>
							<FontAwesome name='dollar' size={ 50 } color='orange' />
						</View>
						<View style={ styles.containerTxtStatistics }>
							<Text style={ styles.txtStatistics }>
								IDR { addDot(this.state.stats_earned) } Earned
							</Text>
						</View>
					</View>
					
					<View style={ styles.containerStatistics }>
						<View style={ styles.containerIconStatistics }>
							<Entypo name='shop' size={ 50 } color='orange' />
						</View>
						<View style={ styles.containerTxtStatistics }>
							<Text style={ styles.txtStatistics }>
								{ addDot(this.state.stats_favorited) }  Merchants Favorited
							</Text>
						</View>
					</View>
					
				</View>
				
				</View>
			);
		}
	}
	
	render() {
		if(this.state.isLoading) {
			return(
				<View style={{ flex: 1, justifyContent: 'center' }} >
					<ActivityIndicator />
				</View>
			);
		}
		
		const navigation = this.props.navigation;
		const points = this.state.user[0].user_point;
		
		if(this.state.isLoading) {
			return(
				<View style={{ flex: 1, paddingTop: 20 }} >
					<ActivityIndicator />
				</View>
			);
		}
		
		return(
			<View style={{ flex: 1 }}>
				<Banner 
					navigation={ navigation} 
					points={ points } 
					userPid={ this.state.userPid }
					userToken={ this.state.userToken }
				/>
				
				<ScrollView>
				
					{ this.loadProfile() }
					
					<View style={ styles.containerNavAccount }>
						<TouchableOpacity
							onPress={() => navigation.navigate('Terms')}
						>
							<View style={ styles.navAccountBorder }>
								<Text style={ styles.navAccount }>
									My Favorites
								</Text>
							</View>
						</TouchableOpacity>
						
						<TouchableOpacity
							onPress={() => navigation.navigate('Terms')}
						>
							<View style={ styles.navAccountBorder }>
								<Text style={ styles.navAccount }>
									Terms & Conditions
								</Text>
							</View>
						</TouchableOpacity>
						
						<TouchableOpacity
							onPress={() => navigation.navigate('Privacy')}
						>
							<View style={ styles.navAccountBorder }>
								<Text style={ styles.navAccount }>
									Privacy Policy
								</Text>
							</View>
						</TouchableOpacity>
						
						<TouchableOpacity>
							<View style={ styles.navAccountBorder }>
								<Text style={ styles.navAccount }>
									Rate Our App
								</Text>
							</View>
						</TouchableOpacity>
						
						<TouchableOpacity>
							<View style={ styles.navAccountBorder }>
								<Text style={ styles.navAccount }>
									Refer to a Friend
								</Text>
							</View>
						</TouchableOpacity>
						
						<TouchableOpacity>
							<View>
								<Text style={ styles.navAccount }>
									Help Center
								</Text>
							</View>
						</TouchableOpacity>
						
					</View>
					
					<TouchableOpacity
						onPress={() => onSignOut(navigation)}
						//onPress={ this.SignOut }
					>
						<Text style={ styles.txtSignOut }>
							{ (this.state.userPid != '' ? 'Sign Out' : 'Sign In') }
						</Text>
					</TouchableOpacity>
					
					<View style={ styles.containerTxtAppVersion }>
						<Text style={ styles.txtAppVersion }>
							{ global.appVersion }
						</Text>
					</View>
				</ScrollView>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	containerProfile: {
		paddingHorizontal: 20,
		paddingVertical: 30,
		backgroundColor: 'white',
		marginBottom: 10,
		flexDirection: 'row'
	},
	containerProfileIcon: {
		justifyContent: 'center'
	},
	containerProfileDetails: {
		paddingLeft: 35,
		paddingRight: 10,
		flex: 1
	},
	containerBorderPhoto: {
		backgroundColor: 'white',
		borderRadius: 80,
		width: 90,
		height: 90,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 2,
		borderColor: globalConst.COLOR.MAROON,
	},
	circlePhoto: {
		backgroundColor: 'white',
		borderRadius: 80,
		width: 80,
		height: 80,
		overflow: 'hidden',
	},
	iconProfile: {
		width: 75,
		height: 75
	},
	profileLabel: {
		fontSize: 13,
		paddingVertical: 5
	},
	
	// Statistics
	containerProfileStatistics: {
		backgroundColor: 'white',
		paddingVertical: 20,
		paddingHorizontal: 15,
		justifyContent: 'space-evenly',
		marginBottom: 10,
		flexDirection: 'row',
	},
	containerStatistics: {
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '25%',
	},
	containerIconStatistics: {
		height: dWidth * 0.15,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center'
	},
	containerTxtStatistics: {
		paddingTop: 5,
		width: '100%',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	txtStatistics: {
		fontSize: 12,
		textAlign: 'center'
	},
	
	// Link bottom
	containerNavAccount: {
		backgroundColor: 'white',
		paddingHorizontal: 10,
	},
	navAccount: {
		paddingVertical: 12,
		paddingLeft: 10
	},
	containerBtnEdit: {
		paddingHorizontal: 5
	},
	btnEditProfile: {
		borderWidth: 1,
		borderColor: '#cacaca',
		paddingVertical: 4,
		borderRadius: 3,

	},
	btnTxtEdit: {
		textAlign: 'center'
	},
	navAccountBorder: {
		borderBottomWidth: 0.5,
		borderColor: 'grey',
	},
	txtSignOut: {
		backgroundColor: 'white',
		color: 'red',
		textAlign: 'center',
		paddingVertical: 12,
		marginTop: 15
	},
	
	// App Version
	containerTxtAppVersion: {
		alignItems: 'center',
		paddingVertical: 15,
	},
	txtAppVersion: {
		color: 'grey'
	},
});