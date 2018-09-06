import React from 'react';
import { AsyncStorage, Alert } from 'react-native';

export const USER_KEY = 'auth-demo-key';

export const onSignIn = (navigation, pid, token, profile) => {
	AsyncStorage.setItem('userPid', pid);
	AsyncStorage.setItem('userToken', token);
	//AsyncStorage.setItem('scrollTop', '0');
	const timeStamp = Math.floor(Date.now() / 1000);
	
	if(profile == '0') {
		navigation.navigate('SignUpProfile');
	} else if(profile == '1') {
		navigation.navigate('Home', { 'refresh': `${timeStamp}`});
	}
}

export const onSignOut = (navigation) => {
	const timeStamp = Math.floor(Date.now() / 1000);
	
	AsyncStorage.removeItem('userPid');
	AsyncStorage.removeItem('userToken');
	navigation.navigate('SignIn', { 'refresh': `${timeStamp}`});
}

export const isSignedIn = () => {
	return new Promise((resolve, reject) => {
		AsyncStorage.getItem(USER_KEY)
			.then(res => {
				if(res !== null) {
					resolve(true);
				} else {
					resolve(false);
				}
			}).catch(err => reject(err));
	});
}