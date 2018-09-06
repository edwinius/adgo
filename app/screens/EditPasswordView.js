import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Alert, AsyncStorage, ActivityIndicator } from 'react-native';

import Header from './Header';
const styleForm = require('./styles/StyleFormEdit');

export default class EditPasswordView extends React.Component {

	constructor(props) {
		super(props);
		this.state = { 
			userPid: '',
			userToken: '',
			oldPass: '',
			newPass: '',
			newPassConfirm: ''
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
	
	ChangePassword = () => {
		const { userPid } = this.state;
		const { userToken } = this.state;
		const { oldPass } = this.state;
		const { newPass } = this.state;
		const { newPassConfirm } = this.state;
		
		if(oldPass != '' && newPass != '' && newPassConfirm != '') {
			if(newPass == newPassConfirm) {
				this.setState({
					isLoading: true
				});
				
				fetch(`${global.uri}api/change_password`, {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						appToken: global.appToken,
						userPid: userPid,
						userToken: userToken,
						oldPass: oldPass,
						newPass: newPass
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
				Alert.alert('New password and confirm password is not the same');
			}
		} else {
			Alert.alert('Please fill');
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
				<Header navigation={ navigation } title='Edit Password' />
				
				<View style={ styles.containerForm }>
					
					<View style={ styleForm.rowForm }>
						
						<View style={ styleForm.containerFormLabel }>
							<Text style={ styleForm.txtFormLabel }>
								Old Password
							</Text>
						</View>
						<View style={ styleForm.containerFormInput }>
							<TextInput 
								style={ styleForm.txtFormInput }
								onChangeText={ oldPass => this.setState({ oldPass })}
								secureTextEntry={true}
								onSubmitEditing={ () => this.newPassRef.focus() }
								value={ this.state.oldPass }
							></TextInput>
						</View>
						
					</View>
					
					<View style={ styleForm.rowForm }>
						
						<View style={ styleForm.containerFormLabel }>
							<Text style={ styleForm.txtFormLabel }>
								New Password
							</Text>
						</View>
						<View style={ styleForm.containerFormInput }>
							<TextInput 
								style={ styleForm.txtFormInput }
								onChangeText={ newPass => this.setState({ newPass })}
								secureTextEntry={true}
								ref={ newPassRef => this.newPassRef = newPassRef }
								onSubmitEditing={ () => this.confirmNewPassRef.focus() }
								value={ this.state.newPass }
							></TextInput>
						</View>
						
					</View>
					
					<View style={ styleForm.rowForm }>
						
						<View style={ styleForm.containerFormLabel }>
							<Text style={ styleForm.txtFormLabel }>
								Confirm New Password
							</Text>
						</View>
						<View style={ styleForm.containerFormInput }>
							<TextInput 
								style={ styleForm.txtFormInput }
								onChangeText={ newPassConfirm => this.setState({ newPassConfirm })}
								secureTextEntry={true}
								ref={ confirmNewPassRef => this.confirmNewPassRef = confirmNewPassRef }
								value={ this.state.confirmNewPass }
							>
							</TextInput>
						</View>
						
					</View>
					
				</View>
				
				<TouchableOpacity
					style={ styleForm.containerBtnSave }
					onPress={ this.ChangePassword }
				>
					<Text style={ styleForm.txtBtnSave}>
						Change Password
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
	}
});