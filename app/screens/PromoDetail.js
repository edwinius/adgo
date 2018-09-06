import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity, AsyncStorage, ActivityIndicator } from 'react-native';
import Hyperlink from 'react-native-hyperlink';

import Header from './Header';
import { parseDate } from '../efunctions';

const dimensions = Dimensions.get('window');
const dWidth = dimensions.width;

export default class PromoDetail extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			result: [{
				'company_name': ''
			}],
			userPid: '',
			userToken: '',
			refresh: ''
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
			
			// Fetch merchant
			const campaignPid = navigation.state.params.campaign_pid;
			
			fetch(`${global.uri}api/fetch_promo_detail`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					appToken: global.appToken,
					campaignPid: campaignPid,
					userPid: userPid
				})
			}).then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);
				if(responseJson['success'] == '1') {
					this.setState({
						result: responseJson['data'],
						userPid: userPid,
						userToken: userToken,
						isLoading: false
					});
				};
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
		
		if(navigation.state.params.refresh != this.state.refresh) {
			this.setState({
				refresh: navigation.state.params.refresh,
				isLoading: true
			});
			this.getToken();
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
		const campaign_pid = navigation.state.params.campaign_pid;
		const { userPid, userToken } = this.state;
		
		return(
			<View style={{ flex: 1 }}>
				<Header 
					navigation={navigation} 
					title='Promo Detail' 
				/>
				
				<ScrollView 
					style={ styles.containerContent } 
					bounces={ false } 
					contentContainerStyle={ styles.contentContainerScrollView }
				>
					<TouchableOpacity 
						style={ styles.containerMerchant }
						onPress={ () => navigation.navigate('Flyer', { 
							company_pid: `${this.state.result[0].company_pid}`,
							company_name: `${this.state.result[0].company_name}` 
						}) }
					>
						<Text style={ styles.txtMerchant }>
							{ this.state.result[0].company_name }
						</Text>
					</TouchableOpacity>
					
					<View style={ styles.containerImg }>
						<Image 
							style={ styles.imgPromo }
							source={{ uri: `${global.uri}assets/images/campaigns/${this.state.result[0].company_pid}/${this.state.result[0].campaign_pid}/${this.state.result[0].campaign_image}`}}
							resizeMode='contain'
						/>
					</View>
					
					<View style={ styles.containerTitle }>
						<Text style={ styles.txtTitle }>
							{ this.state.result[0].campaign_title }
						</Text>
					</View>
					
					<View style={ styles.containerPeriod }>
						<Text style={ styles.txtPeriod }>
							Periode: { parseDate(this.state.result[0].campaign_date_from) } - { parseDate(this.state.result[0].campaign_date_to) }
						</Text>
					</View>
					
					<View style={ styles.containerDesc }>
						<Hyperlink linkDefault={ true } linkStyle={{ color: '#666699' }}>
							<Text style={ styles.txtDesc }>
								{ (this.state.result[0].campaign_desc !== null) ? '\t' + this.state.result[0].campaign_desc : null }
							</Text>
						</Hyperlink>
					</View>
					
					<View style={{ flex: 1, justifyContent: 'flex-end' }}>
						{ 
							this.state.result[0].campaign_point > 0 ?
								((userPid != null || userPid != '' || userToken != null || userToken != '') && userPid > 0) ?
									// Logged In
									// If user has answered
									(this.state.result[0].answer_pid > 0) ?
										<SafeAreaView
										style={ styles.containerBottomButtonAnswered }
										forceInset={{ top: 'never', bottom: 'always' }}
										>
											<TouchableOpacity
												style={ styles.btnAnswered }
											>
												<Text style={ styles.txtBtnAnswered }>
													You have answered this before
												</Text>
											</TouchableOpacity>
										</SafeAreaView>
									:
										<SafeAreaView
											style={ styles.containerBottomButton }
											forceInset={{ top: 'never', bottom: 'always' }}
										>
											<TouchableOpacity
												style={ styles.btnToQuestion }
												onPress={ () => navigation.navigate('AdsQuestion', {
													'campaign_pid': `${ this.state.result[0].campaign_pid}`, 
													'company_pid': `${this.state.result[0].company_pid}`
												}) }
											>
												<Text style={ styles.txtBtnToQuestion }>
													Earn your reward
												</Text>
											</TouchableOpacity>
										</SafeAreaView>
								: 
									// Not logged
									<SafeAreaView
										style={ styles.containerBottomButtonNotLogged }
										forceInset={{ top: 'never', bottom: 'always' }}
									>
										<TouchableOpacity
											style={ styles.btnNotLogged }
											onPress={ () => navigation.navigate('SignedOut') }
										>
											<Text style={ styles.txtBtnNotLogged }>
												Log In to earn reward
											</Text>
										</TouchableOpacity>
									</SafeAreaView>
							: null
						}
					</View>
				</ScrollView>
			</View>
		)
	}

}

const styles = StyleSheet.create({
	containerContent: {
		flex: 1,
		backgroundColor: 'white'
	},
	contentContainerScrollView: {
		flexGrow: 1,
	},
	containerMerchant: {
		paddingVertical: 10,
		paddingHorizontal: 15,
		borderBottomWidth: 2,
		borderColor: '#f2f2f2'
	},
	containerTitle: {
		borderBottomWidth: 10,
		borderColor: '#f2f2f2'
	},
	txtTitle: {
		textAlign: 'center',
		fontSize: 20,
		paddingHorizontal: 10,
		paddingVertical: 5,
		color: '#262626'
	},
	containerImg: {
		alignItems: 'center',
		marginBottom: 5,
		
	},
	imgPromo: {
		width: dWidth,
		height: dWidth
	},
	containerPeriod: {
		paddingHorizontal: 15,
		paddingTop: 4,
		paddingBottom: 5,
	},
	containerDesc: {
		backgroundColor: 'white',
		paddingTop: 10,
		paddingBottom: 50,
		paddingHorizontal: 15,
	},
	txtDesc: {
		fontSize: 14,
		color: '#404040'
	},
	
	// Bottom Button
	containerBottomButton: {
		alignItems: 'center',
		backgroundColor: 'orange',
	},
	btnToQuestion: {
		paddingVertical: 10,
		width: '100%',
		alignItems: 'center'
	},
	txtBtnToQuestion: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 16,
	},
	
	// Not Logged
	containerBottomButtonNotLogged: {
		alignItems: 'center',
		backgroundColor: '#cacaca',
	},
	btnNotLogged: {
		paddingVertical: 10,
		width: '100%',
		alignItems: 'center'
	},
	txtBtnNotLogged: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 16,
	},
	
	// Answered
	containerBottomButtonAnswered: {
		alignItems: 'center',
		backgroundColor: 'green',
	},
	btnAnswered: {
		paddingVertical: 10,
		width: '100%',
		alignItems: 'center'
	},
	txtBtnAnswered: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 16,
	}
});