import React from 'react';
import { View, Alert, StyleSheet, ActivityIndicator, Text, TextInput, TouchableOpacity, Picker, AsyncStorage, SafeAreaView, StatusBar, ScrollView, Image, BackHandler, ActionSheetIOS, Platform } from 'react-native';
import DatePicker from 'react-native-datepicker';
//import PhotoUpload from 'react-native-photo-upload';
//import ImagePicker from 'react-native-image-picker';
import { ImagePicker } from 'expo';
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';

import { onSignOut, onSignIn } from '../auth';
import HeaderNoNav from './HeaderNoNav';
import CityPicker from './CityPicker';
import { handleBackButton } from '../efunctions';
import globalConst from '../globalConst';

export default class SignUpProfile extends React.Component {
	render() {
		
		const navigation = this.props.navigation;
			
		return(
			<ActionSheetProvider>
				<SignUpProfileApp navigation={ navigation } />
			</ActionSheetProvider>
		);
	}
}

@connectActionSheet
class SignUpProfileApp extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			isLoading: true,
			userPid: '',
			userToken: '',
			UserName: '',
			UserEmail: '',
			UserAddress: '',
			UserCity: '',
			date: '',
			imageSource: null,
			imageUri: '',
			imageName: '',
			imageType: '',
			cities:[
				{ 
					label: 'Jakarta',
					value: '1',
				},
				{
					label: 'Surabaya',
					value: '2',
				}
			]
		}
	}
	
	async getToken() {
		/*
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
		*/
	}
	
	async getPermissionAsync() {
		const { CAMERA_ROLL, Permissions } = Expo;
		try {
			const status = await Permissions.askAsync(Permissions.CAMERA_ROLL);
			return(status);
		} catch(e) {
			console.log(e);
		}
		
		if (status === 'granted') {
			return CAMERA_ROLL.getCurrentPositionAsync({enableHighAccuracy: true});
		} else {
			throw new Error('Camera Roll permission not granted');
		}
	}
	
	async getPermissionCamera() {
		const { CAMERA, Permissions } = Expo;
		try {
			const status = await Permissions.askAsync(Permissions.CAMERA);
			return(status);
		} catch(e) {
			console.log(e);
		}
		
		if (status === 'granted') {
			return CAMERA.getCurrentPositionAsync({enableHighAccuracy: true});
		} else {
			throw new Error('Camera permission not granted');
		}
	}
	
	componentDidMount() {
		this.getPermissionAsync();
		this.getPermissionCamera();
		BackHandler.addEventListener('hardwareBackPress', handleBackButton);
		
		fetch(`${global.uri}api/fetch_cities`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				appToken: global.appToken
			})
		}).then((response) => response.json())
		.then((responseJson) => {
			if(responseJson['success'] == '1') {
				this.setState({
					cities: responseJson['data'],
					isLoading: false,
				});
			}
		}).catch((error) => {
			console.error(error);
		});	
	}
	
	SignUpProfile = () => {
		const { UserName } = this.state;
		const { UserEmail } = this.state;
		const { UserAddress } = this.state;
		const { UserCity } = this.state;
		const { date } = this.state;
		const { imageUri } = this.state;
		const { imageName } = this.state;
		const { imageType } = this.state;
		
		const navigation = this.props.navigation;
		const userPid = navigation.state.params.userPid;
		const userToken = navigation.state.params.userToken;
		
		if(UserName != '' && UserEmail != '' && UserAddress != '' && UserCity != '' && date != '') {
			
			function validate(text) {
				let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
				if(reg.test(text) === false) {
					console.log("Email is Not Correct");
					return false;
				} else {
					return true;
				}
			}
			
			//if(isFinite(String(UserTelephone))) {
			if(validate(UserEmail)) {
				this.setState({
					isLoading: true
				});
						
				fetch(`${global.uri}api/signup_profile`, {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						appToken: global.appToken,
						userPid: userPid,
						userToken: userToken,
						user_name: UserName,
						user_email: UserEmail,
						user_address: UserAddress,
						user_city: UserCity,
						user_dob: date
					})
				}).then((response) => response.json())
				.then((responseJson) => {
					console.log(responseJson);
					if(responseJson['success'] == '1') {
						
						if(imageUri != null && imageUri != '') {
							// Upload Image
							let formData = new FormData();
							formData.append('photo', {
								uri: (Platform.OS === 'android' ? 'file://' : '') + imageUri,
								type: imageType,
								name: imageName,
							});
							
							fetch(`${global.uri}api/signup_profile_upload_photo/${userPid}`, {
								method: 'POST',
								body: formData,
								header: {
									'content-type': 'multipart/form-data'
								}
							}).then((response) => response.json())
							.then((responseJson) => {
								if(responseJson['success'] == '1') {
									onSignIn(navigation, userPid, userToken, '1');
								} else {
									Alert.alert('Unknown Error');
								}
							}).catch((error) => {
								console.error(error);
							});
						} else {
							const timeStamp = Math.floor(Date.now() / 1000);
							//navigation.navigate('Home', { 'refresh': `${timeStamp}` });
							onSignIn(navigation, userPid, userToken, '1');
						}
					}
				}).catch((error) => {
					console.error(error);
				});	
			} else {
				Alert.alert('Invalid e-mail address');
			}
		} else {
			Alert.alert('Please complete form');
		}
	}
	
	_PickImage = async() => {
		let result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			aspect: [4, 4]
		});
		console.log(result);
		
		if(!result.cancelled) {
			let localUri = result.uri;
			let filename = localUri.split('/').pop();
			
			// Infer the type of the image
			let match = /\.(\w+)$/.exec(filename);
			let type = match ? `image/${match[1]}` : `image`;
			
			let source = { uri: result.uri };
			this.setState({ 
				imageSource: source,
				imageUri: localUri,
				imageName: filename,
				imageType: type
			});
		}
	}
	
	_PickCamera = async() => {
		let result = await ImagePicker.launchCameraAsync({
			allowsEditing: true,
			aspect: [4, 4]
		});
		console.log(result);
		
		if(!result.cancelled) {
			let localUri = result.uri;
			let filename = localUri.split('/').pop();
			
			// Infer the type of the image
			let match = /\.(\w+)$/.exec(filename);
			let type = match ? `image/${match[1]}` : `image`;
			
			let source = { uri: result.uri };
			this.setState({ 
				imageSource: source,
				imageUri: localUri,
				imageName: filename,
				imageType: type
			});
		}
	}
	
	_ShowActionSheet = () => {
		if(Platform.OS === 'ios') {
			ActionSheetIOS.showActionSheetWithOptions({
				options: ['Cancel', 'Take Photo', 'Choose From Gallery'],
				cancelButtonIndex: 0,
			},
			(buttonIndex) => {
				if(buttonIndex === 1) {
					this._PickCamera();
				} else if (buttonIndex === 2) { 
					this._PickImage();
				}
			});
		} else if(Platform.OS === 'android') {
			let options = ['Choose From Gallery', 'Take Photo', 'Cancel'];
			let cancelButtonIndex = 2;

			this.props.showActionSheetWithOptions({
				options,
				cancelButtonIndex,
			},
			(buttonIndex) => {
				if(buttonIndex === 0) {
					this._PickImage();
				} else if (buttonIndex === 1) { 
					this._PickCamera();
				}
			});
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
		
		if(this.state.isLoading) {
			return(
				<View style={{ flex: 1, paddingTop: 20, justifyContent: 'center' }} >
					<ActivityIndicator />
				</View>
			);
		}
		
		return(
			<View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
				<HeaderNoNav title='Complete Profile' />
				
				<ScrollView>
					<View style={ styles.containerForm }>
						<View style={ styles.rowPhoto }>
							<View style={ styles.containerPhoto }>
								<TouchableOpacity	
								//onPress={this.selectPhotoTapped.bind(this)}
									onPress={this._ShowActionSheet}
									style={ styles.containerBorderPhoto }
								>
									<View style={ styles.circlePhoto }>
										<Image 
											style={ styles.iconProfileAdd }
											//source={ require('../assets/images/icon_profile_add.png') }
											source={this.state.imageSource != null ? this.state.imageSource : require('../assets/images/icon_profile_add.png')}
										/>
									</View>
								</TouchableOpacity>
							</View>
						</View>
						
						<View style={ styles.formRow }>
							<View style={ styles.rowLabel }>
								<Text style={ styles.txtLabel }>
									Full Name
								</Text>
							</View>
							<View style={ styles.rowInput }>
								<TextInput 
									style={ styles.input }
									onChangeText={ UserName => this.setState({ UserName })}
									onSubmitEditing={ () => this.telephoneRef.focus() }
									underlineColorAndroid='rgba(0,0,0,0)'
								>
								</TextInput>
							</View>
						</View>
						
						<View style={ styles.formRow }>
							<View style={ styles.rowLabel }>
								<Text style={ styles.txtLabel }>
									Date of Birth
								</Text>
							</View>
							<View style={ styles.rowInput }>
								<View style={ styles.containerDatePicker }>
									<DatePicker
										style={{ width: 200 }}
										date={ this.state.date }
										mode="date"
										placeholder="Select Date"
										format="DD-MM-YYYY"
										minDate="01-01-1900"
										maxDate="20-04-2018"
										confirmBtnText="Confirm"
										cancelBtnText="Cancel"
										showIcon={false}
										customStyles={{
											dateInput: {
												borderTopWidth: 0,
												borderLeftWidth: 0,
												borderRightWidth: 0,
												borderBottomWidth: 0,
												borderColor: '#cacaca',
												flex: 1,
												paddingBottom: 0,
												height: 20,
												paddingBottom: 5,
												alignItems: 'flex-start',
												paddingHorizontal: 10
											}
										}}
										onDateChange={(date) => { this.setState({ date: date })}}
									/>
								</View>
							</View>
						</View>
						
						<View style={ styles.formRow }>
							<View style={ styles.rowLabel }>
								<Text style={ styles.txtLabel }>
									E-mail
								</Text>
							</View>
							<View style={ styles.rowInput }>
								<TextInput 
									style={ styles.input }
									onChangeText={ UserEmail => this.setState({ UserEmail })}
									ref={ telephoneRef => this.telephoneRef = telephoneRef }
									onSubmitEditing={ () => this.addressRef.focus() }
									underlineColorAndroid='rgba(0,0,0,0)'
									autoCapitalize = 'none'
								>
								</TextInput>
							</View>
						</View>
						
						<View style={ styles.formRow }>
							<View style={ styles.rowLabel }>
								<Text style={ styles.txtLabel }>
									Address
								</Text>
							</View>
							<View style={ styles.rowInput }>
								<TextInput 
									style={ styles.input }
									onChangeText={ UserAddress => this.setState({ UserAddress })}
									ref={ addressRef => this.addressRef = addressRef }
									underlineColorAndroid='rgba(0,0,0,0)'
								>
								</TextInput>
							</View>
						</View>
						
						<View style={ styles.formRow }>
							<View style={ styles.rowLabel }>
								<Text style={ styles.txtLabel }>
									City
								</Text>
							</View>
							<View style={ styles.rowInput }>	
								<CityPicker 
									items={ this.state.cities }
									value={ this.state.UserCity }
									onValueChange={(itemValue, itemIndex) =>
									this.setState({ UserCity: itemValue })}
								/>
							</View>
						</View>
					</View>
					
					<TouchableOpacity
						style={ styles.containerBtnSave }
						onPress={ this.SignUpProfile }
					>
						<Text style={ styles.txtBtnSave}>
							Save Profile
						</Text>
					</TouchableOpacity>
				</ScrollView>
				
			</View>
		);
	}

}

const styles = StyleSheet.create({
	bannerContainer: {
		backgroundColor: '#673ab7',
		paddingTop: 5,
		paddingBottom: 0
	},
	banner: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 5,
		paddingHorizontal: 15,
		paddingBottom: 5
	},
	bannerPadding: { 
		width: 25, 
		height: 25,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#fff',
		margin: 8,
		textAlign: 'center',
		flex: 1
	},
	containerForm: {
		paddingVertical: 5
	},
	formRow: {
		backgroundColor: 'white',
		paddingVertical: 10,
		paddingHorizontal: 10,
		flexDirection: 'row',
		marginVertical: 3
	},
	rowLabel: {
		width: 110,
		justifyContent: 'center',
	},
	rowInput: {
		flex: 1,
		flexDirection: 'column',
		height: 30
	},
	rowPhoto: {
		paddingVertical: 10,
	},
	containerPhoto: {
		alignItems: 'center'
	},
	containerBorderPhoto: {
		backgroundColor: 'white',
		borderRadius: 80,
		width: 90,
		height: 90,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 2,
		borderColor: globalConst.COLOR.MAROON,
	},
	circlePhoto: {
		backgroundColor: 'white',
		borderRadius: 80,
		width: 80,
		height: 80,
		overflow: 'hidden',
	},
	iconProfileAdd: {
		width: 80,
		height: 80,
	},
	input: {
		borderBottomWidth: 1,
		borderColor: '#cacaca',
		paddingHorizontal: 10,
		paddingVertical: 5,
		flex: 1,
		fontSize: 14,
	},
	containerDatePicker: {
		borderBottomWidth: 1,
		borderColor: '#cacaca',
		flex: 1,
	},
	containerBtnSave: {
		marginTop: 15,
		marginHorizontal: 10,
		paddingHorizontal: 10,
		paddingVertical: 10,
		backgroundColor: 'green'
	},
	txtBtnSave: {
		textAlign: 'center',
		color: 'white'
	}
});