import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Button, ActivityIndicator } from 'react-native';

import Header from './Header';

export default class NotifDetailView extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			results: {
				notif: [{notification_message:''}]
			}
		}
	}
	
	componentDidMount() {
		const navigation = this.props.navigation;
		
		return fetch(`${global.uri}api_controller/fetch_message/${navigation.state.params.notif_pid}`)
			.then((response) => response.json())
			.then((responseJson) => {
				this.setState({
					results: responseJson,
					isLoading: false
				});
			}).catch((error) => {
				console.error(error);
			})
	}
	
	

	render() {
		function parseDate(date) {
			date = String(date).split(' ');
			var days = String(date[0]).split('-');
			var hours = String(date[1]).split(':');
			return days[2] + '-' + days[1] + '-' + days[0] + ' ' + hours[0] + ':' + hours[1];
		}
		
		const navigation = this.props.navigation;
		const date = this.state.results.notif[0].notification_datetime;
		const datetime = parseDate(date);
		
		if(this.state.isLoading) {
			return(
				<View style={{ flex: 1, paddingTop: 20, justifyContent: 'center' }} >
					<ActivityIndicator />
				</View>
			);
		}
		
		return(
			<View style={{ flex: 1 }}>
				<Header navigation={ navigation } title='Message' />
	
				<View style={ styles.containerMessage }>
					<View style={ styles.containerContent }>
						<Text style={ styles.txtDate }>
							{ datetime }
						</Text>
						
						<Text style={ styles.txtMsg }>
							{ this.state.results.notif[0].notification_message }
						</Text>
					</View>
				</View>
				
			</View>
		);
	}
	
}

const styles = StyleSheet.create({
	containerMessage: {
		padding: 15
	},
	containerContent: {
		backgroundColor: 'white',
		padding: 15
	},
	txtDate: {
		fontSize: 12
	},
	txtMsg: {
		paddingTop: 15,
		fontSize: 15
	}
});