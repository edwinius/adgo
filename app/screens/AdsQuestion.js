import React from 'react';
import { View, Text, AsyncStorage, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, Alert, ActivityIndicator } from 'react-native';

import HeaderNoNav from './HeaderNoNav';
import { addDot } from '../efunctions';

export default class AdsQuestion extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			isLoading: true,
			result: [{
				campaign_pid: ''
			}]
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
				
				fetch(`${global.uri}api/fetch_advertisement_questions`, {
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
					} else if(responseJson['success'] == '2') {
						// User answered
						let timeStamp = Math.floor(Date.now() / 1000);
						navigation.navigate('PromoDetail', 
						{ 
							campaign_pid: `${ campaignPid }`,
							refresh: `${timeStamp}`
						}); 
					};
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
	
	_ShowQuestion() {
		let timeStamp = Math.floor(Date.now() / 1000);
		const navigation = this.props.navigation;
		
		if(!(this.state.isLoading)) {
		if(this.state.result[0].answer_option == '0') {
			return(
				<View style={{ flex: 1 }}>
					<View style={ styles.containerQuestion }>
						<Text style={ styles.txtQuestion }>
							{ this.state.result[0].campaign_question }
						</Text>
					</View>
					
					<View style={ styles.containerOptions }>
						<TouchableOpacity 
							style={ styles.containerOption }
							onPress={ () => this.Answer('1') }
						>
							<Text style={ styles.txtOption }>
								{ this.state.result[0].campaign_option1 }
							</Text>
						</TouchableOpacity>
						
						<TouchableOpacity 
							style={ styles.containerOption }
							onPress={ () => this.Answer('2') }
						>
							<Text style={ styles.txtOption }>
								{ this.state.result[0].campaign_option2 }
							</Text>
						</TouchableOpacity>
						
						<TouchableOpacity 
							style={ styles.containerOption }
							onPress={ () => this.Answer('3') }
						>
							<Text style={ styles.txtOption }>
								{ this.state.result[0].campaign_option3 }
							</Text>
						</TouchableOpacity>
						
						<TouchableOpacity 
							style={ styles.containerOption }
							onPress={ () => this.Answer('4') }
						>
							<Text style={ styles.txtOption }>
								{ this.state.result[0].campaign_option4 }
							</Text>
						</TouchableOpacity>
					</View>
					
					<View style={ styles.containerBottomWarning }>
						<View style={ styles.containerTxtWarning }>
							<Text style={ styles.txtBottomWarning }>
								Peringatan: Mohon untuk tidak menekan tombol 'Back' atau 'Home' atau 'Power', apabila anda menekan tombol tsb atau menutup aplikasi sebelum menyelesaikan pertanyaan diatas, anda tidak akan mendapatkan point dari iklan ini.
							</Text>
						</View>
					</View>
					
					<TouchableOpacity 
						style={ styles.containerBtnBack }
						onPress={ () => this._Close() }
					>
						<Text style={ styles.txtBtnBack }>
							Tutup dan Kembali
						</Text>
					</TouchableOpacity>
				</View>
			);	
		} else {
			navigation.navigate('PromoDetail', 
			{ 
				campaign_pid: `${ this.state.result[0].campaign_pid }`,
				refresh: `${timeStamp}`
			}); 
		}
		}
	}
	
	Answer = (answer) => {
		const navigation = this.props.navigation;
		const userPid = this.state.userPid;
		const userToken = this.state.userToken;
		
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
				//results: responseJson['ads'],
				isLoading: false
			});
				
			if(responseJson['result'] == '1') {
				Alert.alert('Anda mendapatkan IDR ' + addDot(`${ this.state.result[0].campaign_point}`));
			} else if(responseJson['result'] == '2') {
				Alert.alert('Maaf jawaban anda salah');
			} else {
				Alert.alert(responseJson['result']);
			}
			
			let timeStamp = Math.floor(Date.now() / 1000);
			navigation.goBack(null, { 'refresh': `${timeStamp}`})
			
			navigation.navigate('PromoDetail', 
			{ 
				campaign_pid: `${ navigation.state.params.campaign_pid }`,
				refresh: `${timeStamp}`
			});
		}).catch((error) => {
			console.error(error);
		});
	}
	
	_Close() {
		const timeStamp = Math.floor(Date.now() / 1000);
		const navigation = this.props.navigation;
		
		Alert.alert(
			'Tutup iklan ini ?',
			'Dengan menutup dan kembali anda tidak akan mendapatkan point dan tidak bisa mengulangi iklan ini',
			[
				{
					text: 'Tutup', 
					onPress: () => {
						this.setState({
							isLoading: true
						});
						
						navigation.navigate('PromoDetail', 
						{ 
							campaign_pid: `${ navigation.state.params.campaign_pid }`,
							refresh: `${timeStamp}`
						})
					}
				},
				{
					text: 'Batal', 
					onPress: '', 
					style: 'cancel'
				},
			]
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
		
		return(
			<View style={{ flex: 1 }}>
				<StatusBar hidden={false} />
				<HeaderNoNav title={ `${ this.state.result[0].company_name}`} />
				
				<ScrollView style={ styles.containerBottom }>
					{ this._ShowQuestion() }
				</ScrollView>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	containerCompany: {
		borderBottomWidth: 1,
		borderColor: 'grey',
	},
	containerCompanyName: {
		paddingVertical: 10,
		paddingHorizontal: 10
	},
	txtCompanyName: {
		fontWeight: 'bold',
	},
	
	containerBottom: {
		backgroundColor: 'white'
	},
	containerQuestion: {
		paddingTop: 20,
		paddingBottom: 10
	},
	txtQuestion: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 20
	},
	containerOptions: {
		paddingTop: 10,
		paddingHorizontal: 15
	},
	containerOption: {
		paddingVertical: 5,
		paddingHorizontal: 5,
		borderWidth: 1,
		borderColor: 'green',
		borderRadius: 5,
		marginVertical: 5
	},
	
	// Bottom Warning
	containerBottomWarning: {
		padding: 15,
		marginTop: 50,
	},
	containerTxtWarning: {
		borderWidth: 2,
		borderColor: 'red',
		borderRadius: 10,
		padding: 10
	},
	
	// Btn Close
	containerBtnBack: {
		backgroundColor: 'orange',
		alignItems: 'center',
		paddingVertical: 10,
		marginTop: 35,
	},
	txtBtnBack: {
		color: 'white',
		fontSize: 16,
	},
});