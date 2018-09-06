import React from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, Image, AsyncStorage, ActivityIndicator, Alert, Dimensions, TextInput } from 'react-native';
import { FontAwesome, Ionicons } from 'react-native-vector-icons';
import Carousel from 'react-native-banner-carousel';

import Banner from './Banner';
import { addDot } from '../efunctions';
import { onSignOut } from '../auth';

const styleGeneral = require('./styleGeneral');

const dimensions = Dimensions.get('window');
const dWidth = dimensions.width;
const bannerHeight = dWidth * 0.45;
const mHeight = dWidth * 0.18;
const iconHeight = mHeight * 0.45;

const bannerImages = [
	`${global.uri}assets/images/promo_ads/ads_apa1.jpg`,
	`${global.uri}assets/images/promo_ads/ads_apa2.jpg`,
	`${global.uri}assets/images/promo_ads/ads_apa3.jpg`,
];

export default class Home extends React.Component{

	constructor(props) {
		super(props);
		const navigation = this.props.navigation;
		const refresh = navigation.getParam('refresh', 'xx');
		
		this.state = {
			isLoading: true,
			refresh: '',
			query: '',
			ads: [{}],
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
			
			// If not logged set userPid & userToken to 0
			if(userPid == null || userPid == '' || userToken == null || userToken == '') {
				userPid = '',
				userToken = ''
			}
			//Alert.alert(global.appToken);
			// Fetch home data
			fetch(`${global.uri}api/fetch_home_data`,
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
						ads: responseJson['ads']
					});
				} else if(responseJson['success'] == '2') {
					onSignOut(navigation);
				}
			}).catch((error) => {
				console.error(error);
			});
			
		} catch(error) {
			console.log(error);
		}
	}
	
	componentDidMount() {
		this.getToken();
	}
	
	componentDidUpdate(prevProps, prevState) {
		const navigation = this.props.navigation;
		let refresh = navigation.getParam('refresh', 'xx');
		
		if(refresh != this.state.refresh) {
			this.setState({
				refresh: refresh,
				isLoading: true
			});
			this.getToken();
		}
	}
	
	ShowAds() {
		const navigation = this.props.navigation;
		
		if(this.state.ads.length > 0) {
			const contents = this.state.ads.map(function(item) {
				return(
					<TouchableOpacity
						style={ styles.containerHomePromo }
						key={ item.campaign_pid }
						onPress={ () => navigation.navigate('Flyer', 
							{
								company_pid: `${item.company_pid}`,
								company_name: `${item.company_name}`,
								campaign_pid: `${item.campaign_pid}`,
								screen_from: 'Home'
							} 
						)}
					>
						<View style={ styles.containerAdsCompanyName }>
							<Text style={ styles.txtAdsCompanyName }>
								{ item.company_name }
							</Text>
						</View>
						
						<View style={ styles.containerAdsImage }>
							<Image 
								style={ styles.imgHomePromo }
								source={{ uri: `${global.uri}assets/images/campaigns/${item.company_pid}/${item.campaign_pid}/${item.campaign_image}`}}
								resizeMode='center'
							/>
						</View>
					</TouchableOpacity>
				);
			});
			
			return(contents);
		} else {
			return(
				<Text>No Promo Found</Text>
			);
		}
	}
	
	renderPage(bannerImage, index) {
        return (
            <View 
				key={index}
			>
                <Image 
					style={{ width: dWidth, height: bannerHeight }} 
					source={{ uri: bannerImage }} 
				/>
            </View>
        );
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
		
		const arrMenu = [
			{
				menuId: '1',
				menuName: 'Newest',
				menuIcon: require('../assets/images/icon_new_orange.png')
			},
			{
				menuId: '2',
				menuName: 'Near Me',
				menuIcon: require('../assets/images/icon_near_me_orange.png')
			},
			{
				menuId: '3',
				menuName: 'Most View',
				menuIcon: require('../assets/images/icon_eye_orange.png')
			},
			{
				menuId: '4',
				menuName: 'Favorite',
				menuIcon: require('../assets/images/icon_star_orange.png')
			},
			{
				menuId: '5',
				menuName: 'Verified',
				menuIcon: require('../assets/images/icon_trust_orange.png')
			},
		];
		
		const contentMenu = arrMenu.map(function(item) {
			
			return(
				<TouchableOpacity
					key={ item.menuId }
					onPress={ () => navigation.navigate('AdsView', { query: ''})}
					style={ styles.promoMenu }
				>
						<Image
							style={ styles.iconPromoMenu }
							source={ item.menuIcon }
						/>
						<Text style={ styles.txtPromoMenu }>
							{ item.menuName }
						</Text>
				</TouchableOpacity>
			);
		});
		
		return(
			<View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
				<Banner 
					navigation={ navigation } 
					points={ this.state.userPoint } 
					userPid={ this.state.userPid }
					userToken={ this.state.userToken }
				/>
				
				<View style={ styles.banner }>
					
					<View style={ styles.viewSearchInput }>
						<View style={ styles.searchIcon }>
							<FontAwesome name='search' size={ 20 } color='grey' />
						</View>
						
						<View style={ styles.searchTxtInput }>
							<TextInput
								style={ styles.inputSearch }
								placeholder='Search'
								onChangeText={ (query) => this.setState({ query: query })}
								onSubmitEditing={ () => navigation.navigate('AdsView', { query: `${this.state.query}`}) }
								underlineColorAndroid='rgba(0,0,0,0)'
								value={ this.state.query }
							></TextInput>
						</View>
						
						{ this.state.query != '' ?
						<TouchableOpacity 
							style={ styles.searchDelete }
							onPress={ () => this.setState({ query: '' }) }
						>
							<Ionicons name='md-close' size={ 20 } color='grey' />
						</TouchableOpacity>
						: null }
					</View>
					
				</View>
				
				<ScrollView style={{ flex: 1 }}>
					<View style={ styles.containerContent }>
						<View style={ styles.containerCarousel }>
							{/*<Image 
								style={ styles.imgTopAds }
								source={{ uri: `${global.uri}assets/images/promo_ads/ads_apa1.jpg` }}
							/>*/}
							<Carousel
								autoplay
								autoplayTimeout={2000}
								loop
								index={0}
								pageSize={dWidth}
							>
								<Image 
									style={{ width: dWidth, height: bannerHeight }}
									source={{ uri: `${global.uri}assets/images/promo_ads/ads_apa1.jpg`}}
								/>
								<Image 
									style={{ width: dWidth, height: bannerHeight }}
									source={{ uri: `${global.uri}assets/images/promo_ads/ads_apa2.jpg`}}
								/>
								<Image 
									style={{ width: dWidth, height: bannerHeight }}
									source={{ uri: `${global.uri}assets/images/promo_ads/ads_apa3.jpg`}}
								/>
								
								{/* 
									bannerImages.map(function(bannerImage, index) {
										return(
											<View 
												key={index}
											>
												<Image 
													style={{ width: dWidth, height: bannerHeight }} 
													source={{ uri: bannerImage }} 
												/>
											</View>
										);
									});
								*/}
							</Carousel>
						</View>
						
						<View style={ styles.containerMenu }>
							{ contentMenu }
						</View>
						
						<View style={ styles.containerAds }>
							{ this.ShowAds() }
						</View>
					</View>
				</ScrollView>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	// Search Bar
	banner: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingBottom: 10,
		backgroundColor: '#800000',
		height: 40
	},
	searchAds: {
		backgroundColor: 'white',
		paddingVertical: 5,
		paddingHorizontal: 10,
		fontSize: 16,
		flex: 1,
		borderRadius: 5,
		marginLeft: 5
	},
	viewSearchInput: {
		flexDirection: 'row',
		backgroundColor: 'white',
		borderRadius: 5,
		height: 32,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	searchIcon: {
		paddingLeft: 5
	},
	searchDelete: {
		paddingRight: 10
	},
	searchTxtInput: {
		flex: 1,
	},
	inputSearch: {
		backgroundColor: 'white',
		paddingTop: 6,
		paddingBottom: 4,
		paddingHorizontal: 7,
		fontSize: 16,
		flex: 1,
		borderRadius: 5,
	},
	
	// Top ads banner
	containerTopAds: {
		backgroundColor: 'white',
		width: '100%',
		height: dWidth * 0.45,
	},
	imgTopAds: {
		flex: 1
	},
	// Carousel
	containerCarousel: {
		flex: 1,
		backgroundColor: '#fff',
		justifyContent: 'center',
	},
	
	// Category menu
	containerMenu: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		paddingVertical: 5
	},
	promoMenu: {
		backgroundColor: 'white',
		width: '18%',
		height: mHeight,
		alignItems: 'center',
		justifyContent: 'center'
	},
	iconPromoMenu: {
		width: iconHeight,
		height: iconHeight
	},
	txtPromoMenu: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 11,
		color: '#404040',
		paddingTop: 8,
	},
	
	// Ads
	containerAds: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		paddingHorizontal: dWidth * 0.005,
		backgroundColor: 'white'
	},
	containerAdsCompanyName: {
		paddingVertical: 3,
		paddingHorizontal: 5
	},
	txtAdsCompanyName: {
		fontSize: 12,
	},
	containerAdsImage: {
		width: dWidth * 0.4925,
		backgroundColor: 'white',
		height: dWidth * 0.4925,
		paddingBottom: dWidth * 0.005,
	},
	imgHomePromo: {
		flex: 1
	},
});