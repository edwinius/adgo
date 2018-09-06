import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, AsyncStorage, ActivityIndicator, Alert } from 'react-native';

import Header from './Header';
const styleForm = require('./styles/StyleFormEdit');

export default class EditProfileView extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			userPid: '',
			userToken: '',
			fullName: ''
		}
	}
	
	async getToken() {
		try {
			const userPid = await AsyncStorage.getItem('userPid');
			const userToken = await AsyncStorage.getItem('userToken');
			
			if(userPid !== null && userToken !== null) {
				this.setState({ 
					userPid: userPid,
					userToken: userToken
				});
			}
		} catch(error) {
			console.log(error);
		}
	}
	
	componentDidMount() {
		this.getToken();
	}
	
	ChangeProfile = () => {
		const { userPid } = this.state;
		const { userToken } = this.state;
		const { fullName } = this.state;
		
		if(fullName != '') {
			this.setState({
				isLoading: true
			});
			
			fetch(`${global.uri}api/change_profile`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					appToken: global.appToken,
					userPid: userPid,
					userToken: userToken,
					fullName: fullName
				})
			}).then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);
				
				Alert.alert(responseJson['msg']);
				
				this.setState({
					isLoading: false
				});
			}).catch((error) => {
				console.error(error);
			});	
		} else {
			Alert.alert('Input cannot be empty');
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
			<View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
				<Header navigation={ navigation } title='Edit Biodata' />
				
				<View style={ styles.containerForm }>
					<View style={ styleForm.rowForm }>
						
						<View style={ styleForm.containerFormLabel }>
							<Text style={ styleForm.txtFormLabel }>
								Full Name
							</Text>
						</View>
						<View style={ styleForm.containerFormInput }>
							<TextInput 
								style={ styleForm.txtFormInput }
								onChangeText={ fullName => this.setState({ fullName })}
								onSubmitEditing={ () => this.newPassRef.focus() }
								value={ this.state.fullName }
							></TextInput>
						</View>
						
					</View>
				</View>
				
				<TouchableOpacity
					style={ styleForm.containerBtnSave }
					onPress={ this.ChangeProfile }
				>
					<Text style={ styleForm.txtBtnSave}>
						Save Changes
					</Text>
				</TouchableOpacity>
				
			</View>
		);
	}

}

const styles = StyleSheet.create({
	containerForm: {
		backgroundColor: 'white',
		marginTop: 15,
		borderTopWidth: 1,
		borderColor: '#cacaca'
	},
});