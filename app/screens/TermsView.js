import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Header from './Header';

export default ({ navigation }) => (
	<View style={{ flex: 1, backgroundColor: 'white' }}>
		<Header navigation={ navigation } title='ADGO' />
		
		<View style={ styles.container }>
			<Text style={ styles.title }>
				Terms & Conditions
			</Text>
			
			<View style={ styles.containerContent }>
				<Text style={ styles.txtContent }>
					This page states the terms and conditions of using the services provided by ADGO. Please read them("Terms and Conditions") carefully as they("Terms and Conditions") affect our rights and liabilities under the law. 
					{"\n\n"}
					By downloading, installing, and/or using the ADGO application, you acknowledge that you have read and understood the Terms and Conditions and that you agree to be bound by these Terms and Conditions. 
					{"\n\n"}
					If you do not accept the Terms and Conditions, please cancel your account (if you gave signed up for the Application) and pemanently delete the Applicaiton from your device, and please do not download, join or use any services offered by ADGO.
					{"\n\n"}
					ADGO may add, delete or change the Terms and conditions at any time, without notice. As such, we advise you to review Terms and Conditions from time to time.
				</Text>
			</View>
		</View>
	</View>
);

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white'
	},
	title: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 20,
		paddingVertical: 10
	},
	containerContent: {
		paddingHorizontal: 15
	},
	txtContent: {
		fontSize: 12
	}
});