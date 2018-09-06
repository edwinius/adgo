import React from 'react';
import { View, ScrollView, Text, TextInput, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Dimensions, AsyncStorage } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { FontAwesome, Ionicons } from 'react-native-vector-icons';

import Banner from './Banner';

const dimensions = Dimensions.get('window');
const dWidth = dimensions.width;
const mHeight = dWidth * 0.3;
const iconHeight = mHeight * 0.60;

export default class PromoMenu extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			query: '',
			userPid: '',
			userToken: '',
			userPoint: ''
		}
	}
	
	async getToken() {
		try {
			const userPid = await AsyncStorage.getItem('userPid');
			const userToken = await AsyncStorage.getItem('userToken');
			
			if(userPid !== null && userPid != '' && userToken !== null && userToken != '') {
				this.setState({ 
					userPid: userPid,
					userToken: userToken,
				});
				
				fetch(`${global.uri}api/get_user_point`, {
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
					if(responseJson['success'] == '1') {
						this.setState({
							userPoint: responseJson['point'],
							isLoading: false
						});
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
		const query = this.state.query;
		const points = this.state.userPoint;
		
		if(this.state.isLoading) {
			return(
				<View style={{ flex: 1, paddingTop: 20 }} >
					<ActivityIndicator />
				</View>
			);
		}
		
		const arrCategories = ['Kecantikan', 'Kesehatan', 'Makanan & Minuman', 'Pakaian & Fashion', 'Peralatan Dapur', 'Peralatan Rumah Tangga', 'Elektronik', 'Otomotif', 'Olahraga', 'Buku', 'Alat Tulis', 'Peralatan Bayi'];
		
		const contentCategories = arrCategories.sort().map(function(item) {
			return(
				<TouchableOpacity
					key={ item }
					onPress={ () => navigation.navigate('AdsListView', { query: ''})}
				>
					<View 
						style={ styles.browseCategory }
					>
						<Text style={ styles.txtCategory}>
							{item}
						</Text>
					</View>
				</TouchableOpacity>
			);
		});
		
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
				menuName: 'Most Loved',
				menuIcon: require('../assets/images/icon_love_orange.png')
			},
			{
				menuId: '4',
				menuName: 'Most Viewed',
				menuIcon: require('../assets/images/icon_eye_orange.png')
			},
			{
				menuId: '5',
				menuName: 'Favorite',
				menuIcon: require('../assets/images/icon_star_orange.png')
			},
			{
				menuId: '6',
				menuName: 'Verified',
				menuIcon: require('../assets/images/icon_trust_orange.png')
			},
		];
		
		const contentMenu = arrMenu.map(function(item) {
			
			return(
				<TouchableOpacity
					key={ item.menuId }
					onPress={ () => navigation.navigate('AdsListView', { query: ''})}
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
					navigation={ navigation} 
					points={ points } 
					userPid={ this.state.userPid }
					userToken={ this.state.userToken } 
				/>

				<View style={ styles.banner }>
					{/*
					<TextInput 
						style={ styles.searchAds }
						placeholder='Search'
						onChangeText={ query => this.setState({ query })}
						onSubmitEditing={ () => navigation.navigate('AdsListView', { query: `${query}`}) }
						underlineColorAndroid='rgba(0,0,0,0)'
					></TextInput>
					*/}
					
					<View style={ styles.viewSearchInput }>
						<View style={ styles.searchIcon }>
							<FontAwesome name='search' size={ 20 } color='grey' />
						</View>
						
						<View style={ styles.searchTxtInput }>
							<TextInput
								style={ styles.inputSearch }
								placeholder='Search'
								onChangeText={ query => this.setState({ query })}
								onSubmitEditing={ () => navigation.navigate('AdsListView', { query: `${query}`}) }
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
					
						<View style={ styles.containerTopAds }>
							<Image 
								style={ styles.imgTopAds }
								source={{ uri: `${global.uri}assets/images/promo_ads/ads_apa1.jpg` }}
							/>
						</View>
					
						<View style={ styles.containerMenu }>
							{ contentMenu }
						</View>
						
						<View style={ styles.containerCategory }>
							<Text style={ styles.categoryHeader}>
								Browse by Category
							</Text>
							<View>
								{ contentCategories }
							</View>
						</View>
						
					</View>
				</ScrollView>
			</View>
		)
	}

}

const styles = StyleSheet.create({
	banner: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingBottom: 10,
		backgroundColor: '#800000',
		height: 40
	},
	bannerPadding: { 
		width: 25, 
		height: 25,
		alignItems: 'center',
		justifyContent: 'center',
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
	containerContent: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
	},
	containerTopAds: {
		backgroundColor: 'white',
		width: '100%',
		height: dWidth * 0.45,
		marginTop: 5
	},
	imgTopAds: {
		flex: 1
	},
	containerMenu: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 5
	},
	promoMenu: {
		backgroundColor: 'white',
		width: '30%',
		height: mHeight,
		marginHorizontal: '1.5%',
		marginVertical: 5,
		alignItems: 'center',
		paddingTop: 7
	},
	iconPromoMenu: {
		width: '60%',
		height: iconHeight
	},
	txtPromoMenu: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 12,
		paddingTop: 7,
		height: 25,
		color: '#404040'
	},
	containerCategory: {
		backgroundColor: 'white',
		width: '100%',
		paddingHorizontal: 10,
		paddingTop: 10,
		paddingBottom: 30,
	},
	categoryHeader: {
		fontWeight: 'bold',
		paddingVertical: 5
	},
	txtCategory: {
		fontSize: 16,
		color: '#404040'
	},
	browseCategory: {
		borderBottomWidth: 1,
		borderColor: '#cacaca',
		paddingVertical: 8,
		paddingHorizontal: 5
	}
});