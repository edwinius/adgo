import React from 'react';

import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Entypo } from 'react-native-vector-icons';
import globalConst from '../globalConst';

const HeaderNoNav = ({ navigation, title }) => ( 
	<SafeAreaView
		style={ styles.bannerContainer }
		forceInset={{ top: 'always', bottom: 'never' }}
	>
		<StatusBar
			barStyle="light-content"
		/>
		<View style={ styles.banner }>
			<Text style={ styles.title }>
				{ title }
			</Text>
		</View>
	</SafeAreaView>
);

export default HeaderNoNav;

const styles = StyleSheet.create({
	bannerContainer: {
		backgroundColor: globalConst.COLOR.MAROON,
		paddingTop: 5,
		paddingBottom: 0
	},
	banner: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 2,
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
	}
});