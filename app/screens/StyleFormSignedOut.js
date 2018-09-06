'use strict';

var React = require('react-native');

var { StyleSheet } = React;

module.exports = StyleSheet.create({
	containerRow: {
		paddingVertical: 10
	},
	formLabel: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold'
	},
	rowInput: {
		paddingVertical: 3,
	},
	formInput: {
		color: 'white',
		paddingHorizontal: 5,
		marginHorizontal: 5,
		height: 30,
		justifyContent: 'center',
		flex: 1,
	},
	viewTxtInput: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderColor: 'white',
		justifyContent: 'center'
	},
	btnSignUp: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 10,
		backgroundColor: '#800000'
	},
	txtFront: {
		color: 'white'
	},
	txtBack: {
		fontWeight: 'bold',
		color: 'white',
		paddingLeft: 5,
		fontSize: 15
	},
	containerTxtCountryCode: {
		height: 30,
		justifyContent: 'center',
	},
	txtCountryCode: {
		color: 'white',
		textAlignVertical: 'bottom'
	}
});