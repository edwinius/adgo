import React from 'react';
import { View, Text, AsyncStorage, StyleSheet, Image, Dimensions, StatusBar, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { Entypo } from 'react-native-vector-icons';

import HeaderNoNav from './HeaderNoNav';

const dimensions = Dimensions.get('window');
const dWidth = dimensions.width;

export default class Advertisement extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			isLoading: true,
			result: [{
				company_pid: ''
			}],
			userPid: '',
			userToken: ''
		}
	}
	
	async getToken() {
		try {
			const navigation = this.props.navigation;
			const campaignPid = navigation.state.params.campaign_pid;
		
			const userPid = await AsyncStorage.getItem('userPid');
			const userToken = await AsyncStorage.getItem('userToken');
			
			if(userPid !== null && userPid != '' && userToken !== null && userToken != '') {
				this.setState({ 
					userPid: userPid,
					userToken: userToken
				});
			} else {
				userPid = '0',
				userToken = '0'
			}
				
			fetch(`${global.uri}api/fetch_advertisement_detail`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					appToken: global.appToken,
					userPid: userPid,
					userToken: userToken,
					campaignPid: campaignPid
				})
			}).then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);
				if(responseJson['success'] == '1') {
					this.setState({
						result: responseJson['data'],
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
	
	_ShowBottomContent() {
		const userPid = this.state.userPid;
		const userToken = this.state.userToken;
		const navigation = this.props.navigation;
		
		if(userPid !== null && userPid != '' && userToken !== null && userToken != '') {
			return(
				<TouchableOpacity
					style={ styles.btnNext }
					onPress={ () => navigation.navigate('AdsQuestion', {
						'campaign_pid': `${ this.state.result[0].campaign_pid}`, 
						'company_pid': `${this.state.result[0].company_pid}`
					}) }
				>
					<Text style={ styles.txtNext }>
						Next
					</Text>
				</TouchableOpacity>
			);
		} else {
			return(
				<View style={ styles.containerNotLogged }>
					<Text>Log In to earn money from ads</Text>
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
			<View style={{ flex: 1}}>
				<HeaderNoNav title={ `${ this.state.result[0].company_name}`} />
				
				
				
				<SafeAreaView style={{ flex: 1 }}>
					<View style={ styles.containerImgPromo }>
						<Image
							style={ styles.ImgPromo }
							source={{ uri: `${global.uri}assets/images/campaigns/${this.state.result[0].company_pid}/${this.state.result[0].campaign_pid}/${this.state.result[0].campaign_image}`}}
						/>
					</View>
					
					<View style={ styles.containerTop }>
						<TouchableOpacity 
							style={ styles.containerTxtCompany }
							onPress={ () => navigation.navigate('Flyer', 
								{
									company_pid: `${this.state.result[0].company_pid}`,
									company_name: `${this.state.result[0].company_name}`,
									campaign_pid: `${this.state.result[0].campaign_pid}`
								}
							)}
						>
							<Text style={ styles.txtCompany }>
								{ this.state.result[0].company_name }
							</Text>
						</TouchableOpacity>
						
						<TouchableOpacity 
							style={ styles.containerBtnClose }
							onPress={ () => navigation.goBack(null) }
						>
							<Entypo name='cross' size={ 40 } color='white' />
						</TouchableOpacity>
					</View>
					
					<View style={ styles.containerBtnNext }>
						{ this._ShowBottomContent() }
					</View>
				</SafeAreaView>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	containerTop: {
		flexDirection: 'row',
	},
	containerTxtCompany: {
		flex: 1,
		paddingHorizontal: 10,
		paddingVertical: 14
	},
	txtCompany: {
		fontSize: 15
	},
	containerBtnClose: {
		padding: 8
	},
	containerImgPromo: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: dWidth,
		height: dWidth
	},
	ImgPromo: {
		width: dWidth,
		height: dWidth
	},
	containerBtnNext: {
		position: 'absolute',
		top: dWidth,
		left: 0,
		alignItems: 'center',
		width: dWidth
	},
	txtNext: {
		paddingVertical: 10,
		fontSize: 20
	},
	
	// Not logged
	containerNotLogged: {
		paddingTop: 15
	}
});