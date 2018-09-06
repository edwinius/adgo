import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import TabFlyers2 from './TabFlyers2';

export default class TabFlyerComponent extends React.Component {
	
	ShowContent() {
		const navigation = this.props.navigation;
		const type = this.props.type;
		
		if(type == '2') {
			return(
				<TabFlyers2 style={{ flex: 1 }} navigation={ navigation } />
			);
		} else {
			return(
				<Text>{ type }</Text>
			);
		}
	}

	render() {
		const type = this.props.type;
		
		return(
			<View style={{ flex: 1 }}>
				{ this.ShowContent() }
			</View>
		);
	}

}

const styles = StyleSheet.create({
	
});