import React from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, ScrollView, AsyncStorage } from 'react-native';
import { createTabNavigator, TabBarTop } from 'react-navigation';

import TabPromo from './TabPromo';
import Header from './Header';

const dimensions = Dimensions.get('window');
const dWidth = dimensions.width;

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class TabFlyers2 extends React.Component {
	
	constructor(props) {
		function createComponent(instance, props) {
			return () => React.createElement(instance, props);
		}
		
		super(props);
		this.state = {
			results: {},
			tabs: {},
			scrollY: new Animated.Value(0),
			scrollTop: '1',
		}
		
		//const handler = this.handler.bind(this);
	}
	
	
	
	async getToken() {
		try {
			const scrollTop = await AsyncStorage.getItem('scrollTop');
			this.setState({
				scrollTop: scrollTop
			});
		} catch(error) {
			console.log(error);
		}
	}
	
	componentDidMount() {
		this.getToken();
	}
	
	componentWillMount() {
		const navigation = this.props.navigation;
		const companyPid = navigation.state.params.company_pid;
		
		function createComponent(instance, props) {
			return () => React.createElement(instance, props);
		}
		
		handler = (e) => {
		//e.preventDefault();
			this.setState({
				scrollTop: e
			});
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
						const TabPromoS = ({ navigation }) => (
							<TabPromo navigation={navigation} handler='55' categoryPid={ item.category_pid } />
						);
						
						//arrTabs.push(item.category_name.toString());
						const objCategory = {
							screen: createComponent(TabPromo, {categoryPid: item.category_pid, handler: handler.bind(this) })
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
			const handler = this.handler;
			
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
				<MainScreenNavigator style={ styles.mainScreenNavigator } handler={ this.handler } />
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
		const handler = this.handler;
		
		const headerHeight = this.state.scrollY.interpolate({
			inputRange: [0, HEADER_SCROLL_DISTANCE],
			outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
			extrapolate: 'clamp'
		});
		
		return(
			<View style={{ flex: 1 }}>
				
				<View style={ styles.containerCompanyLogo }>
					<Text>{ this.state.scrollTop }</Text>
				</View>
				
				<View style={{flex: 1, backgroundColor: 'red', overflow: 'scroll' }}>
					{ this.ShowTabs() }
				</View>
				
				<Animated.View style={ [styles.header, { height: headerHeight }] }>
					
					<View style={ styles.bar }>
						<Text style={ styles.title }>Title</Text>
					</View>
				</Animated.View>
				
			</View>
		);
	}
	
}

const styles = StyleSheet.create({
	containerCompanyLogo: {
		backgroundColor: 'transparent',
		width: '100%',
		height: dWidth * 0.45,
	},
	mainScreenNavigator: {
		
						position: 'absolute',
						top: 0,
						left: 0,
						zIndex: 5
	},
	
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		backgroundColor: 'transparent',
		overflow: 'hidden'
	},
	bar: {
		marginTop: 28,
		height: 32,
		alignItems: 'center',
		justifyContent: 'center'
	},
	title: {
		backgroundColor: 'transparent',
		color: 'white',
		fontSize: 18
	},
});