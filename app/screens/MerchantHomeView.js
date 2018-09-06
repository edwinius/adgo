import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Alert, AsyncStorage, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import { onSignOut } from '../auth';
import Header from './Header';

const dimensions = Dimensions.get('window');
const screenWidth = dimensions.width;

export default class MerchantHomeView extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			results: {
				data: [
					{
						campaign_pid: '',
						company_address: '',
					}
				]
			},
			userPid: '',
			userToken: '',
			follow: '',
			follower: ''
		}
	}
	
	async getToken() {
		const navigation = this.props.navigation;
		
		try {
			const userPid = await AsyncStorage.getItem('userPid');
			const userToken = await AsyncStorage.getItem('userToken');
			const companyPid = navigation.state.params.company_pid;
			
			if(userPid !== null && userPid != '' && userToken !== null && userToken != '') {
				this.setState({ 
					userPid: userPid,
					userToken: userToken
				});
				
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
						results: responseJson,
						follow: responseJson['follow'],
						follower: responseJson['follower'],
						isLoading: false
					});
				}).catch((error) => {
					console.error(error);
				});
			} else {
				fetch(`${global.uri}api_controller/fetch_merchant_home_not_logged`, {
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
					this.setState({
						results: responseJson,
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
	
	ShowAds() {
		const navigation = this.props.navigation;
		
		Answer = (answer) => {
			this.setState({
				isLoading: true
			});
			
			fetch(`${global.uri}api/submit_answer`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userPid: this.state.userPid,
					campaign_pid: navigation.state.params.campaign_pid,
					answer_option: answer,
					cpid: navigation.state.params.company_pid,
					appToken: global.appToken,
					userToken: userToken,
					
				})
			}).then((response) => response.json())
			.then((responseJson) => {
					
				this.setState({
					results: responseJson['ads'],
					isLoading: false
				});
					
				if(responseJson['result'] == '1') {
					Alert.alert('Anda mendapatkan 100 point');
				} else if(responseJson['result'] == '2') {
					Alert.alert('Maaf jawaban anda salah');
				} else {
					Alert.alert(responseJson['result']);
				}
			}).catch((error) => {
				console.error(error);
			});
		}
		
		const userPid = this.state.userPid;
		const userToken = this.state.userToken;
		
		if(this.state.results.data.length > 0) {
			const content = this.state.results.data.map(function(item) {
				
				contentBottom = () => {
					if(userPid !== null && userPid != '' && userToken !== null && userToken != '') {
						if(item.answer_pid > 0) {
							return(
								<View style={ styles.containerCompanyAddress }>
									<Text style={ styles.txtCompanyAddress }>
										You have answered this Ads before
									</Text>
								</View>
							);
						} else {
							return(
								<View>
									<View style={ styles.containerQuestion }>
										<Text style={ styles.txtQuestion }>
											{ item.campaign_question }
										</Text>
									</View>
									<View style={ styles.containerAllOptions }>
										<TouchableOpacity 
											style={ styles.containerOptions }
											onPress={ () => this.Answer('1') }
										>
											<Text style={ styles.txtOptions }>
												{ item.campaign_option1 }
											</Text>
										</TouchableOpacity>
										
										<TouchableOpacity 
											style={ styles.containerOptions }
											onPress={ () => this.Answer('2') }
										>
											<Text style={ styles.txtOptions }>
												{ item.campaign_option2 }
											</Text>
										</TouchableOpacity>
										
										<TouchableOpacity 
											style={ styles.containerOptions }
											onPress={ () => this.Answer('3') }
										>
											<Text style={ styles.txtOptions }>
												{ item.campaign_option3 }
											</Text>
										</TouchableOpacity>
										
										<TouchableOpacity 
											style={ styles.containerOptions }
											onPress={ () => this.Answer('4') }
										>
											<Text style={ styles.txtOptions }>
												{ item.campaign_option4 }
											</Text>
										</TouchableOpacity>
									</View>
								</View>
							);
						}
					} else {
						return(
							<View style={ styles.containerBottomNotLogged }>
								<TouchableOpacity
									style={ styles.btnToSignIn }
									onPress={() => onSignOut(navigation)}
								>
									<Text style={ styles.txtBotMessage }>
										Please Sign In to earn Points
									</Text>
								</TouchableOpacity>
							</View>
						);
					}
				}
				
				return(
					<View
						style={ styles.containerHomeAds }
						key={ item.campaign_pid }
					>
						<View style={ styles.containerImgAds }>
							<Image
								style={ styles.imgAds }
								source={{ uri:`${global.uri}assets/images/campaigns/${item.company_pid}/${item.campaign_pid}/${item.campaign_image}`}}
							/>
						</View>
						
						<View style={ styles.containerView }>
							<Text style={ styles.txtView }>
								0 Views
							</Text>
						</View>
						
						{ this.contentBottom() }
					</View>
				);
			});
			
			return(content);
		} else {
			return(
				<Text>No Ads</Text>
			);
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
	
	ShowFollowBtn() {
		if(this.state.follow == '1') {
			return(
				<TouchableOpacity
					style={ styles.btnUnfollow }
					onPress={ this.UnfollowConfirm }
				>
					<Text style={ styles.txtBtnFollowing }>
						Following
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
						Follow
					</Text>
				</TouchableOpacity>
			);
		}
	}
	
	render() {
		const navigation = this.props.navigation;
		const company_name = navigation.state.params.company_name;
		const compAddress = this.state.results.data[0].company_address;
		
		if(this.state.isLoading) {
			return(
				<View style={{ flex: 1, paddingTop: 20, justifyContent: 'center' }} >
					<ActivityIndicator />
				</View>
			);
		}
		
		const TopBanner = ({ navigation }) => (
			<SafeAreaView
				style={ styles.bannerContainer }
				forceInset={{ top: 'always', bottom: 'never' }}
			>
				<View style={ styles.banner }>
					<View style={ styles.bannerPadding }>
						<TouchableOpacity
							onPress={() => navigation.goBack(null)}
							color="white"
						>
							<Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>&lt;</Text>
						</TouchableOpacity>
					</View>
					<Text style={ styles.title }>
						{ company_name }
					</Text>
					<View style={ styles.bannerPadding }></View>
				</View>
			</SafeAreaView>
		);
		
		return(
			<View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
				<Header navigation={navigation} title={`${navigation.state.params.company_name}`} />
				
				<View style={ styles.containerCompanyInfo }>
					
					<View style={ styles.containerCompanyLogo }>
						<View style={ styles.companyLogo }>
						
						</View>
					</View>
					
					<View style={ styles.containerCompanyDetail }>
						<View style={ styles.containerCompanyFollowers }>
							<Text style={ styles.txtCompanyFollowers }>
								{ this.state.follower } Followers
							</Text>
						</View>
						
						{ this.ShowFollowBtn() }
					</View>
					
				</View>
				
				<ScrollView style={ styles.containerContent }>
					<View style={ styles.containerCompanyDesc }>
						<View style={ styles.companyDescRow }>
							
						</View>
						<View style={ styles.companyDescRow }>
							<Text>{ compAddress }</Text>
						</View>
					</View>
					
					{ this.ShowAds() }
				</ScrollView>
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
		backgroundColor: '#cacaca',
		width: 80,
		height: 80,
		borderRadius: 775,
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
	containerHomeAds: {
		flex: 1,
		backgroundColor: 'white'
	},
	containerImgAds: {
		borderBottomWidth: 1,
		borderColor: '#cacaca'
	},
	imgAds: {
		width: '100%',
		height: screenWidth,
		flex: 1
	},
	containerView: {
		paddingHorizontal: 15,
		paddingVertical: 5,
	},
	containerQuestion: {
		paddingVertical: 5,
		paddingHorizontal: 15
	},
	txtQuestion: {
		fontSize: 15,
		fontWeight: 'bold',
		textAlign: 'left'
	},
	containerAllOptions: {
		paddingBottom: 10
	},
	containerOptions: {
		borderWidth: 1,
		borderColor: 'orange',
		borderRadius: 5,
		paddingHorizontal: 10,
		paddingVertical: 5,
		marginVertical: 3,
		marginHorizontal: 10,
		backgroundColor: 'white'
	},
	containerCompanyAddress: {
		paddingVertical: 15,
		paddingHorizontal: 15
	},
	btnToSignIn: {
		backgroundColor: 'green',
	},
	containerBottomNotLogged: {
		paddingVertical: 15,
		paddingHorizontal: 15,
	},
	txtBotMessage: {
		color: 'white',
		textAlign: 'center',
		paddingVertical: 5
	}
});