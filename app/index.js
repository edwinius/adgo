import React from 'react';
import { AsyncStorage, Alert } from 'react-native';
import { createRootNavigator } from './router';
import './global';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			signedIn: false,
			checkedSignIn: false
		};
	}
	
	async getToken() {
		try {
			const userPid = await AsyncStorage.getItem('userPid');
			const userToken = await AsyncStorage.getItem('userToken');
			
			if(userPid !== null && userPid != '' && userToken !== null && userToken != '') {
				this.setState({
					signedIn: true
				});
			}
		} catch(error) {
			console.log(error);
		}
	}
	
	componentDidMount() {
		this.getToken();
	}
	
	render() {
		const { checkedSignIn, signedIn } = this.state;
		
		if(!checkedSignIn) {
			//return null;
		}
		
		const Layout = createRootNavigator(signedIn);
		return <Layout />
	}
}