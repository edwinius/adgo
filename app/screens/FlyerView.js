import React from 'react';
import { View, StyleSheet, Text, ScrollView, Image, Dimensions, Button, TouchableOpacity, ActivityIndicator, Alert, TouchableWithoutFeedback, Linking } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import * as Animatable from 'react-native-animatable';

import Header from './Header';

const dimensions = Dimensions.get('window');

export default class FlyerView extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			iwidth: '',
			iheight: '',
			results: {
				flyers: []
			},
			status: true
		}
	}
	
	componentDidMount() {
		const navigation = this.props.navigation;
		
		return fetch(`${global.uri}api_controller/list_flyers_v2/${navigation.state.params.company_pid}`)
			.then((response) => response.json())
			.then((responseJson) => {
				this.setState({
					results: responseJson
				});
			}).catch((error) => {
				console.error(error);
			});
	}
	
	ShowHide = () => {
		if(this.state.status == true) {
			this.setState({status: false});
		} else {
			this.setState({status: true});
		}
	}
	
	showPromo() {
		if(this.state.results.flyers.length > 0) {
			const contentPromo = this.state.results.flyers.map(function(item) {
				const campaign = item.campaign.map(function(row) {
					return(
						<TouchableOpacity
							key={ row.campaign_pid }
							style={ styles.boxShadow }
							onPress={ () => Linking.openURL('http://www.iklanapa.com') }
						>
							<View
								
								style={ styles.containerCampaignPromo }
							>
								<View>
									<Image
										style={ styles.campaignImage }
										source={{ uri: `${global.uri}assets/images/campaigns/${row.company_pid}/${row.campaign_pid}/${row.campaign_image}`}}
										
									/>
								</View>
								<View style={ styles.containerCampaignText }>
									<Text style={ styles.campaignText }>
										{ row.campaign_text}
									</Text>
								</View>
							</View>
						</TouchableOpacity>
					);
				});
				
				return(
					<View
						style={ styles.containerHorizontal }
						key={ item.category_pid }
					>
						<View>
							<Text style={ styles.txtCategory }>
								{ item.category_name }
							</Text>
						</View>
						<ScrollView 
							horizontal
							style={ styles.scrollContainerHorizontal }
						>
							{ campaign }
						</ScrollView>
					</View>
				);
			});
		
			return(contentPromo);
		} else {
			return(
				<View style={ styles.containerNotFound }>
					<Image
						style={ styles.imgNotFound }
						source={require('../assets/images/icon_not_found.png')}
					/>
					<Text style={ styles.txtNotFound }>
						No Promotion Found
					</Text>
				</View>
			);
		}
	}
	
	render() {
		const navigation = this.props.navigation;
		
		if(this.state.isLoading) {
			return(
				<View style={{ flex: 1, paddingTop: 20 }} >
					<ActivityIndicator />
				</View>
			);
		}
		
		const ASafeAreaView = Animatable.createAnimatableComponent(SafeAreaView);
		
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
					<Text style={ styles.title }>Promotions</Text>
					<View style={ styles.bannerPadding }></View>
				</View>
			</SafeAreaView>
		);
		
		return(
			<View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
			
				{/* this.state.status ? <TopBanner navigation={navigation} /> : null */}
				
				<Header navigation={navigation} title={`${navigation.state.params.company_name}`} />
					
				<ScrollView>
					{ this.showPromo() }
				</ScrollView>
				
			</View>
		);
	
	}
	
}

const styles = StyleSheet.create({
	bannerContainer: {
		backgroundColor: '#673ab7',
		paddingTop: 20,
		paddingBottom: 0,
		width: dimensions.width
	},
	banner: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 10
	},
	bannerPadding: { 
		width: 25, 
		height: 25,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: '200',
		color: '#fff',
		margin: 8,
		textAlign: 'center',
		flex: 1,
		fontWeight: 'bold'
	},
	navMerchant: {
		height: 50,
		paddingLeft: 20,
		justifyContent: 'center'
	},
	navMerchantText: {
		fontSize: 18
	},
	containerHorizontal: {
		marginVertical: 15
	},
	scrollContainerHorizontal: { 
		paddingBottom: 15 
	},
	txtCategory: {
		fontWeight: 'bold',
		paddingHorizontal: 10,
		paddingVertical: 10,
		fontSize: 16
	},
	boxShadow: {
		shadowColor: 'grey',
		shadowOffset: { width: 1, height: 1 },
		shadowRadius: 2,
		shadowOpacity: 0.35,
		marginHorizontal: 10,
		borderRadius: 5,
	},
	containerCampaignPromo: {
		borderWidth: 1,
		borderColor: '#cacaca',
		width: 152,
		borderRadius: 5,
		justifyContent: 'flex-end',
		alignItems: 'center',
		backgroundColor: 'white',
		overflow: 'hidden',
	},
	campaignImage: { 
		width: 150, 
		height: 150
	},
	containerCampaignText: {
		borderTopWidth: 1,
		borderColor: '#e0e0e0',
		height: 50,
		width: '100%'
	},
	campaignText: {
		textAlign: 'center',
		paddingVertical: 5,
		paddingHorizontal: 5,
	},
	containerNotFound: {
		alignItems: 'center',
		paddingTop: 55
	},
	imgNotFound: {
		width: 125,
		height: 125
	},
	txtNotFound: {
		textAlign: 'center',
		paddingTop: 35,
		fontSize: 15
	}
});