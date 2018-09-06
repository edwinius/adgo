import React from 'react';
import { View, Alert, StatusBar, StyleSheet, Image, ActivityIndicator, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Card, FormLabel, FormInput, Button } from "react-native-elements";
import { SafeAreaView } from 'react-navigation';
import { Entypo } from 'react-native-vector-icons';

import { onSignIn  } from '../auth';
import BannerIndex from './BannerIndex';
const styleForm = require('./StyleFormSignedOut');

export default class SignUp extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			UserName: '',
			UserEmail: '',
			UserPassword: '',
			UserPasswordConfirm: '',
			isLoading: false
		}
	}
	
	UserRegister = () => {
		const { UserEmail } = this.state;
		const { UserPassword } = this.state;
		const { UserPasswordConfirm } = this.state;
		const navigation = this.props.navigation;
		
		if(UserEmail != '' && UserPassword != '') {
			if(UserPassword == UserPasswordConfirm) {
				this.setState({
					isLoading: true
				});
				
				fetch(`${global.uri}api/register_user`, {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						user_email: UserEmail,
						user_password: UserPassword
					})
				}).then((response) => response.json())
					.then((responseJson) => {
						console.log(responseJson);
						if(responseJson['success'] == '1') {
							const pid = responseJson['pid'];
							const token = responseJson['token'];
							
							//onSignIn(navigation, pid, token, '0');
							navigation.navigate('SignUpProfile', 
								{ 
									'userPid': `${pid}`,
									'userToken': `${token}`
								}
							);
								
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
				Alert.alert('Password and Confirm Password does not match');
			}
			
		} else {
			Alert.alert('Please complete the form');
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
									onSubmitEditing={ () => this.passwordConfirmRef.focus() }
									value={ this.state.UserPassword }
									underlineColorAndroid='rgba(0,0,0,0)'
									returnKeyType='next'
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
						<View style={ styleForm.rowInput }>
							<View style={ styleForm.viewTxtInput }>
								<TextInput
									ref={ passwordConfirmRef => this.passwordConfirmRef = passwordConfirmRef }
									secureTextEntry={true}
									placeholder='Confirm Password'
									placeholderTextColor='white'
									style={ styleForm.formInput }
									onChangeText={ UserPasswordConfirm => this.setState({ UserPasswordConfirm })}
									value={ this.state.UserPasswordConfirm }
									underlineColorAndroid='rgba(0,0,0,0)'
									returnKeyType='done'
									autoCapitalize = 'none'
								/>
								
								{ this.state.UserPasswordConfirm != '' ?
								<TouchableOpacity 
									style={ styles.searchDelete }
									onPress={ () => this.setState({ UserPasswordConfirm: '' }) }
								>
									<Entypo name='cross' size={ 20 } color='white' />
								</TouchableOpacity>
								: null }
							</View>
						</View>
					</View>
					
					<Button
						buttonStyle={{ marginTop: 20 }}
						backgroundColor='#ffa500'
						title='Sign Up'
						onPress={ this.UserRegister }
					/>
					
				</View>
				
				{/*
				<Button
					buttonStyle={{ marginTop: 20 }}
					backgroundColor='transparent'
					textStyle={{ color: '#bcbec1' }}
					title='Sign In'
					onPress={ () => navigation.goBack(null)}
				/>
				*/}
				
				<SafeAreaView
					style={{ backgroundColor: '#800000' }}
					forceInset={{ top: 'never', bottom: 'always' }}
				>
					<TouchableOpacity
						onPress={ () => navigation.goBack(null)}
						style={ styleForm.btnSignUp }
					>
						<Text style={ styleForm.txtFront }>
							Have an account ?  
						</Text>
						<Text style={ styleForm.txtBack }>
							Sign In
						</Text>
					</TouchableOpacity>
				</SafeAreaView>
			</TouchableOpacity>
		);
	}
	
};

/*
export default SignUp = ({ navigation }) => (

	<View style={{ paddingVertical: 20 }}>
		<Card>
			<FormLabel>Email</FormLabel>
			<FormInput placeholder='Email' />
			<FormLabel>Password</FormLabel>
			<FormInput secureTextEntry placeholder='Password' />
			<FormLabel>Confirm Password</FormLabel>
			<FormInput secureTextEntry placeholder='Confirm Password' />
			
			<Button
				buttonStyle={{ marginTop: 20 }}
				backgroundColor='#03A9F4'
				title='Sign Up'
				onPress={() => {
					signUp();
				}}
			/>
			
		</Card>
	</View>
	
);
*/

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
		paddingHorizontal: 5
	},
});