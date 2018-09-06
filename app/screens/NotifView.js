import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Button } from 'react-native';

import Header from './Header';

export default class NotifView extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			results: {
				notif: []
			}
		}
	}
	
	componentDidMount() {
		return fetch(`${global.uri}api/list_notifs`)
			.then((response) => response.json())
			.then((responseJson) => {
				this.setState({
					results: responseJson
				});
			}).catch((error) => {
				console.error(error);
			});
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
		
		const content = this.state.results.notif.map(function (item) {
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
						{ item.notification_desc }
					</Text>
				</TouchableOpacity>
			);
		});
		
		return(
			<View style={{ flex: 1 }}>
				<Header navigation={ navigation } title='Notifications' />
				
				<View style={ styles.containerNotifs }>
					<ScrollView style={ styles.scrollContainer } >
						
						{ content }
						
					</ScrollView>
				</View>
			</View>
		);
	}
	
}

const styles = StyleSheet.create({
	containerNotifs: {
		padding: 15,
	},
	scrollContainer: {
		paddingHorizontal: 15,
		backgroundColor: 'white'
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