import React from 'react';
import { ScrollView, Text, Linking, View, StyleSheet, Image, Dimensions, Button } from 'react-native';
import { Card } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';

const dimensions = Dimensions.get('window');
const imageHeight = Math.round(dimensions.width * 9 / 16);
const imageWidth = dimensions.width;

export default ({ navigation })=> (
	<View style={{ flex: 1 }}>
		<SafeAreaView
			style={ styles.bannerContainer }
			forceInset={{ top: 'always', bottom: 'never' }}
		>
			<View style={ styles.banner }>
				<Button
					onPress={() => navigation.goBack(null)}
					title="Go back"
				/>
				<Text style={ styles.title }>ADGO</Text>
			</View>
		</SafeAreaView>
		
		<ScrollView style={ styles.containerImage }>
			<Image 
				style={ styles.imageFlyer }
				source={{uri:'http://192.168.1.5/adgo/assets/images/campaigns/3/18/test.jpg'}} 
			/>
			<Image 
				style={ styles.imageFlyer }
				source={{uri:'http://192.168.1.5/adgo/assets/images/campaigns/3/18/test.jpg'}} 
			/>
		</ScrollView>
	</View>
);

const styles = StyleSheet.create({
	bannerContainer: {
		backgroundColor: '#673ab7',
		paddingTop: 20,
		paddingBottom: 0
	},
	banner: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
	},
	title: {
		fontSize: 18,
		fontWeight: '200',
		color: '#fff',
		margin: 8,
		textAlign: 'center'
	},
	containerImage: {
	},
	imageFlyer: {
		width: 50, 
		height: 50, 
		alignSelf: 'center',
	}
});