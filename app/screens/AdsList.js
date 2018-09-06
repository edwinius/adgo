import React from 'react';
import { View, ScrollView, Text, TextInput, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { FontAwesome, Entypo, Ionicons } from 'react-native-vector-icons';

export default class AdsList extends React.Component {
	
	constructor(props) {
		super(props);
		
		const navigation = this.props.navigation;
		const query = navigation.state.params.query;
		
		this.state = {
			isLoading: true,
			results: [{
				company_pid: '',
				company_name: ''
			}],
			query: query
		}
	}
	
	componentDidMount() {
		this.SearchQuery();
	}
	
	SearchQuery = () => {
		const query = this.state.query;
		
		this.setState({
			isLoading: true
		});
		
		fetch(`${global.uri}api/list_merchants`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: query,
				appToken: global.appToken
			})
		}).then((response) => response.json())
		.then((responseJson) => {
			if(responseJson['success'] == '1') {
				this.setState({
					results: responseJson['data'],
					isLoading: false,
				});
			} else {
				Alert.alert('Unauthorized App');
			}
		}).catch((error) => {
			console.error(error);
		});
	}
	
	ShowAds() {
		const navigation = this.props.navigation;
		
		if(this.state.results.length > 0) {
			const contents = this.state.results.map(function(item) {
				return(
					<TouchableOpacity
						style={ styles.containerMerchant }
						key={ item.company_pid }
						onPress={ () => navigation.navigate('Flyer', 
							{
								company_pid: `${item.company_pid}`,
								company_name: `${item.company_name}`,
								campaign_pid: `${item.campaign_pid}`,
								screen_from: 'AdsView'
							}
						)}
					>
							<View style={ styles.containerMerchantName }>
								<Text style={ styles.txtMerchantName }>
									{item.company_name}
								</Text>
							</View>
							
							<View style={ styles.containerMerchantLogo }>
								<Image 
									style={ styles.imgAds }
									source={{ uri: `${global.uri}assets/images/company_logo/${item.company_pid}/${item.company_logo}`}}
									resizeMode='contain'
								/>
							</View>
							
							<View style={ styles.containerMerchantAddress }>
								<Text style={ styles.txtMerchantAddress }>
									{item.company_address}
								</Text>
							</View>
					</TouchableOpacity>
				);
			});
			
			return(contents);
		} else {
			return(
				<View style={ styles.containerNotFound }>
					<Image
						style={ styles.imgNotFound }
						source={require('../assets/images/icon_not_found.png')}
					/>
					<Text style={ styles.txtNotFound }>
						No Results Found
					</Text>
				</View>
			);
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
				<SafeAreaView
					style={ styles.bannerContainer }
					forceInset={{ top: 'always', bottom: 'never' }}
				>
					<StatusBar
						barStyle="light-content"
					/>
					
					<View style={ styles.banner }>
						<TouchableOpacity
							onPress={() => navigation.goBack(null)}
							color="white"
							style={ styles.containerBtnBack }
						>
							<Entypo name='chevron-left' size={ 27 } color='#ffff' />
						</TouchableOpacity>
						
						{/*
						<TextInput 
							style={ styles.searchAds }
							placeholder='Search'
							onChangeText={ query => this.setState({ query })}
							onSubmitEditing={ this.searchQuery }
							value={ this.state.query }
							underlineColorAndroid='rgba(0,0,0,0)'
						></TextInput>
						*/}
						
						<View style={ styles.containerSearchInput }>
							<View style={ styles.viewSearchInput }>
								<View style={ styles.searchIcon }>
									<FontAwesome name='search' size={ 20 } color='grey' />
								</View>
								
								<View style={ styles.searchTxtInput }>
									<TextInput
										style={ styles.inputSearch }
										placeholder='Search'
										onChangeText={ (query) => this.setState({ query: query })}
										onSubmitEditing={ this.SearchQuery }
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
						
					</View>
				</SafeAreaView>
				
				<ScrollView style={{ flex: 1 }}>
					<View style={ styles.containerContent }>
						{ this.ShowAds() }
					</View>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	bannerContainer: {
		backgroundColor: '#800000',
		paddingTop: 20,
		paddingBottom: 0
	},
	banner: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingRight: 10,
		paddingTop: 5,
	},
	bannerPadding: { 
		width: 25, 
		height: 25,
		alignItems: 'center',
		justifyContent: 'center',
	},
	containerBtnBack: {
		paddingRight: 5,
		paddingLeft: 10,
		justifyContent: 'center',
		height: 36
	},
	searchAds: {
		backgroundColor: 'white',
		paddingVertical: 5,
		paddingHorizontal: 10,
		fontSize: 16,
		flex: 1,
		borderRadius: 5,
		marginLeft: 10
	},
	containerContent: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
	},
	containerMerchant: {
		borderRightWidth: 1,
		borderBottomWidth: 1,
		borderColor: '#cacaca',
		width: '50%',
		height: 250,
		backgroundColor: 'white'
	},
	containerMerchantName: {
		alignItems: 'center',
	},
	txtMerchantName: {
		fontSize: 18,
		fontWeight: 'bold',
		paddingVertical: 4
	},
	containerMerchantLogo: {
		flex: 1,
	},
	imgAds: {
		height: 50,
		flex: 1
	},
	containerMerchantAddress: {
		height: 50,
		paddingVertical: 3
	},
	txtMerchantAddress: {
		fontSize: 12,
		color: 'grey',
		paddingHorizontal: 10
	},
	containerNotFound: {
		alignItems: 'center',
		paddingTop: 55,
		flex: 1,
	},
	imgNotFound: {
		width: 125,
		height: 125
	},
	txtNotFound: {
		textAlign: 'center',
		paddingTop: 35,
		fontSize: 15
	},
	containerSearchInput: {
		paddingBottom: 7,
		flex: 1,
		height: 36
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
});