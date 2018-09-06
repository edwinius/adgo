import React from 'react';

import { StyleSheet, Text, View, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-navigation';

const BannerIndex = () => ( 
	<SafeAreaView
		style={ styles.bannerContainer }
		forceInset={{ top: 'always', bottom: 'never' }}
	>
		<StatusBar
			barStyle="light-content"
		/>
		<View style={ styles.banner }>
			<Image
				style={ styles.mainLogo }
				source={ require('../assets/images/logo_rect.png') }
			/>
		</View>
	</SafeAreaView>
);

export default BannerIndex;

const styles = StyleSheet.create({
	bannerContainer: {
		paddingTop: 20,
		paddingBottom: 0
	},
	banner: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 40,
		justifyContent: 'center'
	},
	title: {
		fontSize: 24,
		color: '#fff',
		margin: 8,
		textAlign: 'center',
	},
	mainLogo: {
		width: 100,
		height: 50
	}
});