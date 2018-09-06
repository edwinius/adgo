import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { createTabNavigator, TabBarTop } from 'react-navigation';

import TabPromo from './TabPromo';
import Header from './Header';

const dimensions = Dimensions.get('window');
const dWidth = dimensions.width;

export default class TabFlyers2 extends React.Component {
	
	constructor(props) {
		function createComponent(instance, props) {
			return () => React.createElement(instance, props);
		}
		
		super(props);
		this.state = {
			results: {},
			tabs: {}
		}
	}
	
	componentWillMount() {
		const navigation = this.props.navigation;
		const companyPid = navigation.state.params.company_pid;
		
		function createComponent(instance, props) {
			return () => React.createElement(instance, props);
		}
		
		return fetch(`${global.uri}api/fetch_tabs/${navigation.state.params.company_pid}`,
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					appToken: global.appToken,
					companyPid: companyPid
				})
			}).then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);
				console.log(this.state.tabs);
				
				if(responseJson['success'] == '1') {
					this.setState({
						results: responseJson['result'],
					});
				} else {
					this.setState({
						results: [{
							category_pid: '0',
							category_name: 'Tabs'
						}]
					});
				}
				
				if(this.state.results.length > 0) {
					const arrTabs = {};
					const objScreens = {};
					
					const resultTabs = this.state.results.map(function(item) {
						//arrTabs.push(item.category_name.toString());
						const objCategory = {
							screen: createComponent(TabPromo, {categoryPid: item.category_pid })
						};
						
						const objDetails = {};
						objDetails['tabBarLabel'] = item.category_name.toString();
						
						objCategory['navigationOptions'] = objDetails;
						objScreens['Tab' + item.category_pid] = objCategory;
					});
					
					arrTabs = objScreens;
					this.setState({
						tabs: arrTabs
					});
					
					console.log(arrTabs);
				}
				
			}).catch((error) => {
				console.error(error);
			});
	}
	
	ShowTabs() {
		const count = Object.keys(this.state.tabs).length;
		if(count > 0) {
			const tnv = this.state.tabs;
			const navigation = this.props.navigation;
			
			const MainScreenNavigator = createTabNavigator(tnv, {
				lazy: true,
				tabBarPosition: 'top',
				tabBarComponent: TabBarTop,
				animationEnabled: true,
				swipeEnabled: true,
				tabBarOptions: {
					showIcon: true,
					style: {
						backgroundColor: '#ffffff',
						borderTopWidth: 0.5,
						borderColor: 'grey',
						paddingTop: 0
					},
					tabStyle: {
						width: 'auto',
						flex: 1,
						paddingTop: 0
					},
					labelStyle: {
						paddingTop: 0
					},
					activeTintColor: '#673ab7',
					inactiveTintColor: 'grey',
					indicatorStyle: {
						//backgroundColor: '#673ab7',
						opacity: 0
					},
					scrollEnabled: true,
				}
			});
		
			return(
				<MainScreenNavigator />
			);
		} else {
			return(
				<Text>No Ads</Text>
			);
		}
	}
	
	render() {
		const tnv = this.state.tabs;
		const navigation = this.props.navigation;
		
		return(
			<View style={{ flex: 1 }}>
				<Header navigation={navigation} title={`${navigation.state.params.company_name}`} />
				<View style={ styles.containerCompanyLogo }>
					
				</View>
				
				<View style={{ flex: 1, height: 300 }}>
					{ this.ShowTabs() }
					<Text>ASD</Text>
				</View>
			</View>
		);
	}
	
}

const styles = StyleSheet.create({
	containerCompanyLogo: {
		backgroundColor: 'white',
		width: '100%',
		height: dWidth * 0.45,
	},
});