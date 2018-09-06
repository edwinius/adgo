import React from 'react';

import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Entypo } from 'react-native-vector-icons';
import globalConst from '../globalConst';

const timeStamp = Math.floor(Date.now() / 1000);

const Header = ({ navigation, title, screen_from }) => ( 
	<SafeAreaView
		style={ styles.bannerContainer }
		forceInset={{ top: 'always', bottom: 'never' }}
	>
		<StatusBar
			barStyle="light-content"
		/>
		<View style={ styles.banner }>
			<View style={ styles.bannerPadding }>
				<TouchableOpacity
					//onPress={() => navigation.goBack(null, { 'refresh': `${timeStamp}`})}
					onPress={ () => {
						if(screen_from) {
							navigation.navigate(`${screen_from}`,
							{
								refresh: `${timeStamp}`
							});
						} else {
							navigation.goBack(null);
						}
					}}
					color="white"
					style={ styles.containerBtnBack }
				>
					<Entypo name='chevron-left' size={ 27 } color='#ffff' />
				</TouchableOpacity>
			</View>
			<Text style={ styles.title }>
				{ title }
			</Text>
			<View style={ styles.bannerPadding }></View>
		</View>
	</SafeAreaView>
);

export default Header;

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