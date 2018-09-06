import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, Entypo } from 'react-native-vector-icons';

import Header from './Header';

export default ({ navigation }) => (
	<View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
		<Header navigation={ navigation } title='Edit Profile' />
		
		<View style={ styles.containerBtnEdit }>
			<TouchableOpacity
				style={ styles.btnEditOption }
				onPress={ () => navigation.navigate('EditPassword') }
			>
				<View style={ styles.containerTxtEdit }>
					<View style={ styles.containerIconEdit }>
						<Entypo name='lock' size={ 22 } />
					</View>
					<View style={ styles.containerBtnTxt }>
						<Text style={ styles.txtBtnEdit }>Edit Password</Text>
					</View>
				</View>
			</TouchableOpacity>
			
			<TouchableOpacity
				style={ styles.btnEditOption }
				onPress={ () => navigation.navigate('EditProfile') }
			>
				<View style={ styles.containerTxtEditBot }>
					<View style={ styles.containerIconEdit }>
						<FontAwesome name='user' size={ 22 } />
					</View>
					<View style={ styles.containerBtnTxt }>
						<Text style={ styles.txtBtnEdit }>Edit Profile</Text>
					</View>
				</View>
			</TouchableOpacity>
		</View>
		
	</View>
);

const styles = StyleSheet.create({
	containerBtnEdit: {
		backgroundColor: 'white',
		marginTop: 25
	},
	btnEditOption: {
		paddingHorizontal: 10,
	},
	containerTxtEdit: {
		borderBottomWidth: 1,
		borderColor: '#cacaca',
		paddingHorizontal: 15,
		paddingVertical: 15,
		flexDirection: 'row',
		alignItems: 'center'
	},
	containerTxtEditBot: {
		paddingHorizontal: 15,
		paddingVertical: 15,
		flexDirection: 'row',
		alignItems: 'center'
	},
	containerIconEdit: {
		width: 30,
		alignItems: 'center'
	},
	containerBtnTxt: {
		alignItems: 'center'
	}
});