import React from 'react';
import { SectionList, View, Text, StyleSheet } from 'react-native';
import TabFlyerComponent from './TabFlyerComponent';

export default class TabFlyers3 extends React.Component {
	
	render() {
		const navigation = this.props.navigation;
		const A = ['1'];
		const B = ['2'];
		
		return(
			<View style={{ flex: 1 }}>
				<SectionList
					sections={[
						{ title: '', data: A },
						{ title: 'Fruits B', data: B },
					]}
					stickySectionHeadersEnabled={true}
					ListHeaderComponent={<View><Text>Header</Text></View>}
					renderSectionHeader = { ({section}) => <Text>{ section.title }</Text> }
					renderItem = { ({item}) => <TabFlyerComponent type={ item } navigation={ navigation } /> }
					keyExtractor={ (item, index) => index }
					style={{ flex: 1, backgroundColor: 'yellow' }}
				/>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	testHeader: {
		backgroundColor: 'red',
		width: 100,
		height: 40
	},
	txtItem: {
		fontSize: 40,
		paddingVertical: 20
	}
});