import React from 'react';
import { View, StatusBar, StyleSheet, TextInput, Alert, AsyncStorage, Image, ActivityIndicator, Text, TouchableOpacity, SafeAreaView, Keyboard } from 'react-native';
import { Card, Button, FormLabel, FormInput } from 'react-native-elements';
import { Entypo } from 'react-native-vector-icons';

import { onSignIn } from '../auth';
import BannerIndex from './BannerIndex';
const styleForm = require('./StyleFormSignedOut');

export default class SignIn extends React.Component {
	
	constructor(props) {
		super(props);
		const navigation = this.props.navigation;
		const refresh = navigation.getParam('refresh', 'xx');
		
		this.state = {
			UserEmail: '',
			UserPassword: '',
			isLoading: false,
			refresh: refresh
		}
	}
	
	componentDidUpdate(prevProps, prevState) {
		const navigation = this.props.navigation;
		const refresh = navigation.getParam('refresh', 'xx');
		
		if(refresh != this.state.refresh) {
			this.setState({
				refresh: refresh,
				UserEmail: '',
				UserPassword: ''
			});
		}
	}
	
	UserLogin = () => {
		const { UserEmail } = this.state;
		const { UserPassword } = this.state;
		const navigation = this.props.navigation;
		
		if(UserEmail != '' && UserPassword != '') {
			this.setState({
				isLoading: true
			});
				
			fetch(`${global.uri}api_controller/auth_user`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					user_handphone: UserEmail,
					user_password: UserPassword,
					appToken: global.appToken
				})
			}).then((response) => response.json())
				.then((responseJson) => {
					console.log(responseJson);
					if(responseJson['success'] == '1') {
						const pid = responseJson['pid'];
						const token = responseJson['token'];
						const stats = '';
						
						if(responseJson['name'] != '') {
							stats = '1';
						} else {
							stats = '0';
						}
							
						//onSignIn(navigation, pid, token, stats);
						
						const timeStamp = Math.floor(Date.now() / 1000);
						if(stats == '0') {
							navigation.navigate('SignUpProfile',
								{ 
									userPid: pid,
									userToken: token
								}
							);
						} else if(stats == '1') {
							AsyncStorage.setItem('userPid', pid);
							AsyncStorage.setItem('userToken', token);
							navigation.navigate('Home', { 'refresh': `${timeStamp}` });
						}
					} else {
						Alert.alert(responseJson['msg']);
					}
					
					this.setState({
						isLoading: false
					});
					
				}).catch((error) => {
					console.error(error);
				});
		} else {
			Alert.alert('Please Fill Phone Number and Password');
		}
	}
	
	UserLogins = () => {
		const navigation = this.props.navigation;
		navigation.navigate('Home', { 'refresh': '3' });
	}
	
	render() {
		
		const navigation = this.props.navigation;
		const timeStamp = Math.floor(Date.now() / 1000);
		
		if(this.state.isLoading) {
			return(
				<View style={{ flex: 1, paddingTop: 20, justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.5)' }} >
					<ActivityIndicator />
				</View>
			);
		}
		
		return(
			<TouchableOpacity 
				style={ styles.container } 
				activeOpacity={1} 
				onPress={ Keyboard.dismiss }
			>
			
				<View style={ styles.containerBackground }>
					<Image
						style={ styles.background }
						source={ require('../assets/images/signedout.jpg') }
					/>
				</View>
				
				<StatusBar
					barStyle="light-content"
				/>
				
				<BannerIndex />
				
				<View style={ styles.containerForm }>
					<View style={ styleForm.containerRow }>
						<View style={ styleForm.rowInput }>
							<View style={ styleForm.viewTxtInput }>
								<View style={ styleForm.containerTxtCountryCode }>
									<Text style={ styleForm.txtCountryCode }>
										+62
									</Text>
								</View>
								
								<TextInput
									placeholder='Phone Number (812xxxxxxx)'
									placeholderTextColor='white'
									style={ styleForm.formInput }
									onChangeText={ UserEmail => this.setState({ UserEmail })}
									onSubmitEditing={ () => this.passwordRef.focus() }
									value={ this.state.UserEmail }
									underlineColorAndroid='rgba(0,0,0,0)'
									keyboardType="numeric"
									returnKeyType='done'
								/>
								
								{ this.state.UserEmail != '' ?
								<TouchableOpacity 
									style={ styles.searchDelete }
									onPress={ () => this.setState({ UserEmail: '' }) }
								>
									<Entypo name='cross' size={ 20 } color='white' />
								</TouchableOpacity>
								: null }
							</View>
						</View>
					</View>
					
					<View style={ styleForm.containerRow }>
						<View style={ styleForm.rowInput }>
							<View style={ styleForm.viewTxtInput }>
								<TextInput
									ref={ passwordRef => this.passwordRef = passwordRef }
									secureTextEntry={true}
									placeholder='Password'
									placeholderTextColor='white'
									style={ styleForm.formInput }
									onChangeText={ UserPassword => this.setState({ UserPassword })}
									value={ this.state.UserPassword }
									underlineColorAndroid='rgba(0,0,0,0)'
									keyboardType="default"
									returnKeyType='done'
									autoCapitalize = 'none'
								/>
								
								{ this.state.UserPassword != '' ?
								<TouchableOpacity 
									style={ styles.searchDelete }
									onPress={ () => this.setState({ UserPassword: '' }) }
								>
									<Entypo name='cross' size={ 20 } color='white' />
								</TouchableOpacity>
								: null }
							</View>
						</View>
					</View>
					
					<View style={ styleForm.containerRow }>
						
						<Button
							buttonStyle={{ marginTop: 20 }}
							backgroundColor='#ffa500'
							title='Sign In'
							/*
							onPress={() => {
								onSignIn().then(() => navigation.navigate('SignedIn'));
							}}
							*/
							
							onPress={ this.UserLogin }
						/>
						
						{/*
						<TouchableOpacity
							onPress={ this.UserLogin }
						>
							<Text>Sign In</Text>
						</TouchableOpacity>
						*/}
					</View>
					
					<Button
						buttonStyle={{ marginTop: 20 }}
						backgroundColor='transparent'
						textStyle={{ color: '#bcbec1' }}
						title='Continue without signing in'
						onPress={() => navigation.navigate('Home', { 'refresh': `${this.state.refresh}` })}
					/>
					
				</View>
				
				{/*
				<View>
					<Button
						buttonStyle={{ marginTop: 20 }}
						backgroundColor='transparent'
						textStyle={{ color: '#bcbec1' }}
						title='No account yet ? Sign Up'
						onPress={() => navigation.navigate('SignUp')}
					/>
				</View>
				*/}
				
				<SafeAreaView
					style={{ backgroundColor: '#800000' }}
					forceInset={{ top: 'never', bottom: 'always' }}
				>
					<TouchableOpacity
						onPress={() => navigation.navigate('SignUp')}
						style={ styleForm.btnSignUp }
					>
						<Text style={ styleForm.txtFront }>
							No account yet ?  
						</Text>
						<Text style={ styleForm.txtBack }>
							Sign Up
						</Text>
					</TouchableOpacity>
				</SafeAreaView>
			</TouchableOpacity>
			
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 0,
		backgroundColor: '#800000',
		flex: 1
	},
	containerBackground: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		flex: 1
	},
	background: {
		flex: 1,
		justifyContent: 'center',
		width: '100%',
		height: '100%'
	},
	containerForm: {
		paddingTop: 50,
		paddingHorizontal: 45,
		flex: 1
	},
	formLabel: {
		color: 'white'
	},
	formInput: {
		color: 'white',
		paddingHorizontal: 5,
	},
});