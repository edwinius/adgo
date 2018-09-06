import React from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, AsyncStorage, ActivityIndicator, Alert } from 'react-native';

import Banner from './Banner';
import { parseDate } from '../efunctions';

export default class HomeInbox extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			inbox: [],
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
			
			// If not logged set userPid & userToken to ''
			if(userPid == null || userPid == '' || userToken == null || userToken == '') {
				userPid = '',
				userToken = ''
			}
			
			// Fetch Inbox
			fetch(`${global.uri}api/fetch_home_inbox`,
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
						inbox: responseJson['inbox']
					});
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
	
	ShowInbox() {
		const navigation = this.props.navigation;
		
		if(this.state.inbox.length > 0) {
			const content = this.state.inbox.map(function (item) {
				return(
					<TouchableOpacity
						key={ item.notification_pid }
						style={ styles.boxNotif }
						onPress={ () => navigation.navigate('Detail', {notif_pid: `${item.notification_pid}` }) }
					>
						<Text style={ styles.txtNotifTitle }>
							{ item.notification_title }
						</Text>
						<Text style={ styles.txtNotifDesc }>
							
						</Text>
					</TouchableOpacity>
				);
			});
			
			return(content);
		} else {
			return(
				<Text>There are no messages yet</Text>
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
				
				<ScrollView style={ styles.scrollContainerInbox }>
					<View style={ styles.containerInbox }>
						{ this.ShowInbox() }
					</View>
				</ScrollView>
			</View>
		);
	}
	
}

const styles = StyleSheet.create({
	// Inbox
	scrollContainerInbox: {
		flex: 1,
		marginTop: 10,
		marginHorizontal: 5,
	},
	containerInbox: {
		backgroundColor: 'white',
		paddingHorizontal: 15,
	},
	boxNotif: {
		borderBottomWidth: 0.5,
		borderColor: '#e0e0e0',
		paddingVertical: 10
	},
	txtNotifTitle: {
		fontSize: 15
	},
	txtNotifDesc: {
		fontSize: 12,
		color: 'grey',
		paddingTop: 5
	}
});