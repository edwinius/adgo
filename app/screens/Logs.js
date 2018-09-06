import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, AsyncStorage, TouchableOpacity } from 'react-native';

import Header from './Header';
import { onSignOut } from '../auth';
import { parseDate, addDot } from '../efunctions';

export default class Logs extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			logs: [],
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
			if(userPid != null || userPid != '' || userToken != null || userToken != '') {
				// Fetch Logs
				fetch(`${global.uri}api/fetch_logs`,
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
					let logsData = [];
					
					if(responseJson['success'] == '1') {
						logsData = responseJson['logs'];
					}
					
					this.setState({
						isLoading: false,
						userPid: userPid,
						userToken: userToken,
						userPoint: responseJson['user_point'],
						logs: logsData
					});
				}).catch((error) => {
					console.error(error);
				});
			} else {
				onSignOut(navigation);
			}
		} catch(error) {
			console.log(error);
		}
	}
	
	componentDidMount() {
		this.getToken();
	}
	
	ShowLogs() {
		const navigation = this.props.navigation;
		
		if(this.state.logs.length > 0) {
			const contents = this.state.logs.map(function(item) {
				return(
					<TouchableOpacity
						style={ styles.containerListLogs }
						key={ item.answer_pid }
						onPress={ () => navigation.navigate('PromoDetail', 
						{ 
							campaign_pid: `${ item.campaign_pid}` 
						}) }
					>
						<View style={ styles.containerListLogsTop }>
							<View style={ styles.containerTxtAnswerDate }>
								<Text style={ styles.txtAnswerDate }>
									{ parseDate(item.answer_datetime) }
								</Text>
							</View>
							<View style={ styles.containerCampaignPoint }>
								<Text style={ styles.txtCampaignPoint }>
									{ item.answer_correct == '1' ? '+ ' + addDot(item.campaign_point) : null }
								</Text>
							</View>
						</View>
						
						<View style={ styles.containerTxtCampaignTitle }>
							<Text style={ styles.txtCampaignTitle }>
								{ item.campaign_title }
							</Text>
						</View>
					</TouchableOpacity>
				);
			});
			
			return(contents);
		} else {
			return(
				<View style={ styles.containerLogsNoData }>
					<Text>You don't have any history yet.</Text>
				</View>
			);
		}
	}
	
	render() {
		const navigation = this.props.navigation;
		
		return(
			<View style={{ flex: 1 }}>
				<Header 
					title='History' 
					navigation={navigation}
				/>
				
				<View style={ styles.containerLogsTop }>
					<View style={ styles.containerPoint }>
						<View>
							<Text style={ styles.txtMyBalance }>
								My Balance
							</Text>
						</View>
						
						<View style={ styles.containerTxtPoint }>
							<Text style={ styles.txtIDR }>
								IDR
							</Text>
						
							<Text style={ styles.txtPoint }>
								{ addDot(this.state.userPoint) }
							</Text>
						</View>
					</View>
				</View>
				
				<ScrollView style={{ flex: 1 }}>
					<View style={ styles.containerLogs }>
						{ this.ShowLogs() }
					</View>
				</ScrollView>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	// User Points
	containerPoint: {
		paddingVertical: 20,
		paddingHorizontal: 25,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	txtMyBalance: {
		paddingTop: 6
	},
	containerTxtPoint: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'flex-end',
	},
	txtIDR: {
		paddingRight: 15,
	},
	txtPoint: {
		paddingTop: 1,
		fontSize: 20,
		fontWeight: 'bold',
	},
	
	// Content Logs
	containerLogs: {
		paddingTop: 5,
	},
	containerListLogs: {
		marginBottom: 4,
		paddingVertical: 10,
		paddingHorizontal: 10,
		backgroundColor: 'white'
	},
	
	// Logs Top
	containerListLogsTop: {
		flexDirection: 'row',
	},
	// Logs Top Date
	containerTxtAnswerDate: {
		flex: 1,
	},
	// Logs Top Point
	containerCampaignPoint: {
		paddingHorizontal: 10,
	},
	txtCampaignPoint: {
		color: 'green'
	},
	
	// No Data
	containerLogsNoData: {
		alignItems: 'center',
		paddingTop: 30
	}
});