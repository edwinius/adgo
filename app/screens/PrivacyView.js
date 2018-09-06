import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Header from './Header';

export default ({ navigation }) => (
	<View style={{ flex: 1, backgroundColor: 'white' }}>
		<Header navigation={ navigation } title='ADGO' />
		
		<View style={ styles.container }>
			<Text style={ styles.title }>
				Privacy Policy
			</Text>
			
			<View style={ styles.containerContent }>
				<Text style={ styles.txtContent }>		
					ADGO fully understand the importance of privacy, and therefore respect and committed to protecting your privacy. With this Privacy Policy, we ensure that all personal data and information submitted by Users through the Application or Site will not be released to anyone without the prior consent of the relevant User(s).
					{"\n\n"}
					By registering or using the service of ADGO, you agree to be bound by this Privacy Policy. Users are strongly recommended to read this Privacy Policy and understand it thoroughly. 
					{"\n\n"}
					ADGO may update, revise or amend this Privacy Policy from time to time as we may deem necessary and/or appropriate. Any changes to this Privacy Policy may or may not be notified to you via the e-mail address you provided on registration, and will be notified via an announcement on the ADGO website. If you do not wish to accept the new updated Terms, you should not continue to use any of the service provided by ADGO. 
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