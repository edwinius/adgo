'use strict';

var React = require('react-native');

var { StyleSheet } = React;

module.exports = StyleSheet.create({
	rowForm: {
		flexDirection: 'row',
		paddingHorizontal: 10,
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderColor: '#cacaca',
		height: 65,
	},
	containerFormLabel: {
		width: 120,
		justifyContent: 'center'
	},
	containerFormInput: {
		flex: 1,
		paddingTop: 6,
	},
	txtFormInput: {
		paddingVertical: 7,
		paddingHorizontal: 10,
		fontSize: 14,
		width: '100%',
		borderBottomWidth: 1,
		borderColor: '#cacaca'
	},
	containerBtnSave: {
		marginTop: 15,
		marginHorizontal: 10,
		paddingHorizontal: 10,
		paddingVertical: 10,
		backgroundColor: 'green'
	},
	txtBtnSave: {
		textAlign: 'center',
		color: 'white'
	}
});