import React from 'react';
import { Animated, View, StyleSheet, ScrollView, Text, Image } from 'react-native';
import { createTabNavigator, TabBarTop } from 'react-navigation';

import TabPromo from './TabPromo';

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class TabFlyers4 extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			scrollY: new Animated.Value(0),
			results: {},
			tabs: {}
		};
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
	
	_ShowTabs() {
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
				<View style={ styles.scrollViewContent }>
					<MainScreenNavigator />
				</View>
			);
		} else {
			return(
				<Text>No Ads</Text>
			);
		}
	}
	
	_renderScrollViewContent() {
		const data = Array.from({ length: 30 });
		return(
			<View style={ styles.scrollViewContent }>
				{ data.map((_, i) =>
					<View key={ i } style={ styles.row }>
						<Text>{ i }</Text>
					</View>
				)}
			</View>
		);
	}
	
	render() {
		const tnv = this.state.tabs;
		const navigation = this.props.navigation;
		
		const headerHeight = this.state.scrollY.interpolate({
			inputRange: [0, HEADER_SCROLL_DISTANCE],
			outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
			extrapolate: 'clamp'
		});
		
		const imageOpacity = this.state.scrollY.interpolate({
			inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
			outputRange: [1, 1, 0],
			extrapolate: 'clamp'
		});
		
		const imageTranslate = this.state.scrollY.interpolate({
			inputRange: [0, HEADER_SCROLL_DISTANCE],
			outputRange: [0, -50],
			extrapolate: 'clamp'
		});
			
		return(
			<View style={ styles.fill }>
				
				
				<Animated.View style={ [styles.header, { height: headerHeight }] }>
					{/*<Animated.Image
						style={[
							styles.backgroundImage,
							{ opacity: imageOpacity, transform: [{ translateY: imageTranslate}]},
						]}
						source={ require('../assets/images/bg_grocery.jpg') }
					/>*/}
					
					<View style={ styles.bar }>
						<Text style={ styles.title }>Title</Text>
					</View>
				</Animated.View>
				
				<View style={{ flex: 1, height: 300 }}>
					{ this._ShowTabs() }
					<Text>ASD</Text>
				</View>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	fill: {
		flex: 1
	},
	row: {
		height: 40,
		margin: 16,
		backgroundColor: '#D3D3D3',
		alignItems: 'center',
		justifyContent: 'center'
	},
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		//backgroundColor: '#03A9F4',
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
	backgroundImage: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		width: null,
		height: HEADER_MAX_HEIGHT,
		resizeMode: 'cover'
	},
	scrollViewContent: {
		marginTop: HEADER_MAX_HEIGHT
	},
});