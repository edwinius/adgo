import React from 'react';

import { StyleSheet, Text, View, StatusBar, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { FontAwesome } from 'react-native-vector-icons';

import globalConst from '../globalConst';
import { addDot } from '../efunctions';

export default class Banner extends React.Component {
	ShowTopBar() {
		const navigation = this.props.navigation;
		const userPid = this.props.userPid;
		const userToken = this.props.userToken;
		
		if(userPid !== null && userPid != '' && userToken !== null && userToken != '' && userPid > 0) {
			const points = this.props.points;
			
			return(
				<View style={ styles.banner }>
					<View style={ styles.bannerLeft }>
						<TouchableOpacity
							style={ styles.touchablePoints }
							onPress={ () => navigation.navigate('RewardView', { points: `${points}`}) }
						>
							<View style={ styles.containerMainLogo }>
								<Image
									style={ styles.mainLogo }
									source={ require('../assets/images/logo.png') }
								/>
							</View>
							
							<View style={ styles.containerTxtPoints }>
								<Text style={ styles.txtPoints }>
									{ addDot(points) }
								</Text>
							</View>
						</TouchableOpacity>
					</View>
					
					<View style={ styles.bannerRight }>
						<TouchableOpacity
							onPress={ () => navigation.navigate('Logs') }
							style={ styles.containerIconLogs }
						>
							<FontAwesome name='history' size={ 25 } color='white' />
						</TouchableOpacity>
					</View>
				</View>
			);
		} else {
			return(
				<View style={ styles.containerLogoNotLogged }>
					<View style={ styles.containerMainLogo }>
						<Image
							style={ styles.mainLogo }
							source={ require('../assets/images/logo.png') }
						/>
					</View>
					<View style={ styles.containerLogoApa }>
						<Image
							style={ styles.mainLogoApa }
							source={ require('../assets/images/logo_rect.png') }
						/>
					</View>
				</View>
			);
		}
	}
	
	render() {
		const navigation = this.props.navigation;
		
		return(
			<SafeAreaView
				style={ styles.bannerContainer }
				forceInset={{ top: 'always', bottom: 'never' }}
			>
				<StatusBar
					barStyle="light-content"
				/>
				
				{ this.ShowTopBar() }
					
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	bannerContainer: {
		backgroundColor: globalConst.COLOR.MAROON,
		paddingTop: 0,
	},
	banner: {
		flexDirection: 'row',
		paddingRight: 16,
		paddingLeft: 10,
		paddingBottom: 3,
	},
	bannerLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	touchablePoints: {
		flexDirection: 'row',
		flex: 1,
	},
	containerMainLogo: {
		borderWidth: 1,
		borderColor: 'white',
		borderRadius: 25,
		width: 33,
		margin: 8,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white'
	},
	mainLogo: {
		width: 32,
		height: 32,
	},
	containerBackTxtPoints: {
		backgroundColor: 'blue',
		flex: 1,
	},
	containerTxtPoints: {
		borderWidth: 1,
		borderColor: 'white',
		borderTopRightRadius: 13,
		borderBottomRightRadius: 13,
		height: 23,
		justifyContent: 'center',
		paddingRight: 10,
		paddingLeft: 28,
		position: 'absolute',
		zIndex: -1,
		left: 20,
		top: 13
	},
	txtPoints: {
		color: 'white'
	},
	
	// Not Logged
	containerLogoNotLogged: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		paddingLeft: 10
	},
	containerLogoApa: {
		paddingTop: 15
	},
	mainLogoApa: {
		width: 50,
		height: 25
	},
	
	// Logs
	bannerRight: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'flex-end',
	},
	containerIconLogs: {
		paddingRight: 10
	},
	
	iconNotif: {
		width: 20,
		height: 20,
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#fff',
		margin: 8
	}
});