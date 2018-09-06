import React from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, Image, AsyncStorage, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { FontAwesome } from 'react-native-vector-icons';

import Banner from './Banner';
import { parseDate } from '../efunctions';
import { onSignOut } from '../auth';

const dimensions = Dimensions.get('window');
const dWidth = dimensions.width;

export default class HomeFeeds extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			feeds: [{}],
			userPid: null,
			userToken: null,
			userPoint: '',
		}
	}
	
	async getToken() {
		try {
			const userPid = await AsyncStorage.getItem('userPid');
			const userToken = await AsyncStorage.getItem('userToken');
			const navigation = this.props.navigation;
			
			// If user is logged
			if((userPid != null || userPid != '' || userToken != null || userToken != '') && userPid > 0) {
				// Fetch feeds
				fetch(`${global.uri}api/fetch_home_feeds`,
				{
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						appToken: global.appToken,
						userPid: userPid,
						userToken: userToken,
					})
				}).then((response) => response.json())
				.then((responseJson) => {
					console.log(responseJson);
					
					if(responseJson['success'] == '1') {
						this.setState({
							isLoading: false,
							userPid: userPid,
							userToken: userToken,
							userPoint: responseJson['user_point'],
							feeds: responseJson['feeds']
						});
					}
				}).catch((error) => {
					console.error(error);
				});
			} else {
				this.setState({
					isLoading: false
				});
			}
		} catch(error) {
			console.log(error);
		}
	}
	
	componentDidMount() {
		this.getToken();
	}
	
	ShowFeeds() {
		const navigation = this.props.navigation;
		const { userPid, userToken, userPoint } = this.state;
		
		// If user is logged
		if(userPid != null && userPid != '' && userToken != null && userToken != '') {
			// If data not empty
			if(this.state.feeds.length > 0) {
				const contents = this.state.feeds.map(function(item) {
					return(
						<TouchableOpacity 
							style={ styles.containerContentFeed }
							key={ item.campaign_pid }
							onPress={ () => navigation.navigate('PromoDetail', 
							{ 
								campaign_pid: `${ item.campaign_pid}` 
							}) }
						>
							<View style={ styles.containerFeedsTop }>
								<View style={ styles.containerTxtCampaignDate }>
									<Text style={ styles.txtCampaignDate }>
										{ parseDate(item.campaign_created) }
									</Text>
								</View>
							
								<View style={ styles.containerTxtCompanyName }>
									<Text style={ styles.txtCompanyName }>
										{ item.company_name }
									</Text>
								</View>
							</View>
							
							<View style={ styles.containerImgCampaign }>
								{ 
									item.campaign_point > 0 ?
										<View style={ styles.containerDollarSign }>
											<FontAwesome name='dollar' size={ 18 } color='#800000'/>
										</View>
									: null
								}
								
								<Image 
									style={ styles.imgCampaign }
									source={{ uri: `${global.uri}assets/images/campaigns/${item.company_pid}/${item.campaign_pid}/${item.campaign_image}`}}
									resizeMode='contain'
								/>
							</View>
							
							<View style={ styles.containerFeedsBottom }>
								<View style={ styles.containerTxtTitle }>
									<Text style={ styles.txtTitle }>
										{ item.campaign_title }
									</Text>
								</View>
							</View>
						</TouchableOpacity>
					);
				});
				
				return(contents);
			} else {
				<View>
					<Text>Please Favorites to get feeds</Text>
				</View>
			}
		} else {
			return(
				<View>
					<View style={ styles.containerTxtNotLogged }>
						<Text style={ styles.txtNotLogged }>
							You are not logged in. Please Log In to Get Feeds
						</Text>
					</View>
					<View style={ styles.containerImageNotLogged }>
						<Image
							style={ styles.imageNotLogged }
							source={ require('../assets/images/icon_not_logged.png') }
						/>
					</View>
					<View style={ styles.containerBtnLogIn }>
						<TouchableOpacity 
							style={ styles.btnLogIn }
							onPress={() => onSignOut(navigation)}
						>
							<Text style={ styles.btnLogInTxt }>
								Log In
							</Text>
						</TouchableOpacity>
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
		
		return(
			<View style={{ flex: 1 }}>
				<Banner 
					navigation={ navigation } 
					points={ this.state.userPoint } 
					userPid={ this.state.userPid }
					userToken={ this.state.userToken }
				/>
				
				<ScrollView style={{ flex: 1 }}>
					<View style={ styles.containerFeeds }>
						{ this.ShowFeeds() }
					</View>
				</ScrollView>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	// Content feeds
	containerContentFeed: {
		marginVertical: 10,
		backgroundColor: 'white',
		paddingTop: 5,
	},
	
	// Feeds Top
	containerFeedsTop: {
		paddingHorizontal: 10,
		paddingVertical: 5,
	},
	txtCampaignDate: {
		fontSize: 11
	},
	
	// Image
	imgCampaign: {
		width: dWidth,
		height: dWidth
	},
	containerDollarSign: {
		backgroundColor: 'white',
		borderRadius: 40,
		position: 'absolute',
		width: 35,
		height: 35,
		justifyContent: 'center',
		alignItems: 'center',
		right: 0,
		top: 0,
		zIndex: 1,
		opacity: 0.55,
		shadowColor: 'grey',
		shadowOffset: { width: 2, height: 2 },
		shadowRadius: 3,
		shadowOpacity: 0.85,
	},
	
	// Bottom
	containerFeedsBottom: {
		paddingVertical: 5
	},
	containerTxtTitle: {
		paddingHorizontal: 10,
	},
	txtTitle: {
		textAlign: 'center',
	},
	
	// Not Logged
	containerTxtNotLogged: {
		alignItems: 'center',
		paddingTop: 25,
		paddingBottom: 50,
	},
	containerImageNotLogged: {
		alignItems: 'center'
	},
	containerBtnLogIn: {
		paddingTop: 25,
		alignItems: 'center'
	},
	btnLogIn: {
		backgroundColor: 'orange',
		paddingVertical: 10,
		alignItems: 'center',
		width: 300,
	},
	btnLogInTxt: {
		color: 'white',
		fontWeight: 'bold',
	}
});