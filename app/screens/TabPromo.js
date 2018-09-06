import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, Dimensions, ScrollView, AsyncStorage, TouchableOpacity, Platform } from 'react-native';
import { FontAwesome } from 'react-native-vector-icons';

const dimensions = Dimensions.get('window');
const dWidth = dimensions.width;

export default class TabPromo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			result: [],
			scrollTop: '1',
		}
	}
	
	componentDidMount() {
		const navigation = this.props.navigation;
		const categoryPid = this.props.categoryPid;
		
		fetch(`${global.uri}api_controller/fetch_promo`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				appToken: global.appToken,
				categoryPid: categoryPid
			})
		}).then((response) => response.json())
		.then((responseJson) => {
			//console.log(responseJson['data']);
			
			if(responseJson['success'] == '1') {
				this.setState({
					result: responseJson['data'],
					isLoading: false
				});
			} else {
				this.setState({
					result: [{
						campaign_pid: '0',
						campaign_title: 'abc'
					}],
					isLoading: false
				});
			}
		}).catch((error) => {
			console.error(error);
		});
	}
	
	/*
	componentWillUnmount() {
		this.setState({
			result: {
				data: [{
					campaign_pid: '1',
					campaign_title: 'abc'
				}]
			}
		});
	}
	*/
	
	ShowPromo() {
		const navigation = this.props.navigation;
		
		if(this.state.result.length > 0) {
			if(this.state.result[0].campaign_pid != '0') {
				const content = this.state.result.map(function(item) {
					return(
						<TouchableOpacity
							key={ item.campaign_pid }
							style={ styles.containerPromo }
							onPress={ () => navigation.navigate('PromoDetail', 
							{ 
								campaign_pid: `${ item.campaign_pid}` 
							}) }
						>
							<View style={ styles.containerImage }>
								{ 
									item.campaign_point > 0 ?
										<View style={ styles.containerDollarSign }>
											<FontAwesome name='dollar' size={ 18 } color='#800000'/>
										</View>
									: null
								}
								
								<Image
									style={ styles.campaignImage }
									source={{ uri: `${global.uri}assets/images/campaigns/${item.company_pid}/${item.campaign_pid}/${item.campaign_image}`}}
									resizeMode='contain'
								/>
							</View>
							{/*
							<View style={ styles.containerCampaignText }>
								<Text style={ styles.campaignText }>
									{ item.campaign_text}
								</Text>
							</View>
							*/}
						</TouchableOpacity>
					);
				});
				return(content);
			} else {
				return(
					<View style={{ flex: 1, paddingTop: 20 }} >
						<Text 
							style={{
								textAlign: 'center',
								paddingTop: 10
							}}
						>
							No Promo
						</Text>
					</View>
				);
			}
			
		} else {
			return(
				<View style={{ flex: 1, paddingTop: 20 }} >
					<ActivityIndicator />
				</View>
			);
		}
	}
	
	shouldComponentUpdate(nextProps, nextState) {
		if(this.state.result != nextState.result) {
			return true;
		} else {
			return false;
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
		
		var handleToUpdate = this.props.handleToUpdate;
		return(
			<View style={{ flex: 1 }}>
				<ScrollView 
					style={{ flex: 1 }}
					//onScroll={ () => handleToUpdate('zz') }
				>
					<View style={ styles.containerContent }>
						{ this.ShowPromo() }
					</View>
				</ScrollView>
			</View>
		);
	}
	
}

const styles = StyleSheet.create({
	containerContent: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
		paddingTop: 3,
		backgroundColor: '#f2f2f2'
	},
	containerPromo: {
		borderRightWidth: 2,
		borderBottomWidth: 2,
		borderColor: '#f2f2f2',
		width: '50%',
		backgroundColor: 'white'
	},
	containerImage: {
		height: dWidth/2
	},
	campaignImage: { 
		flex: 1
	},
	containerDollarSign: {
		backgroundColor: 'white',
		borderRadius: 35,
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
		shadowOffset: { width: 1.5, height: 1.5 },
		shadowRadius: 2,
		shadowOpacity: 0.85,
		
		...Platform.select({
			android: {
				borderColor: '#e0e0e0',
				borderWidth: 1.5,
			}
		})
	},
});