import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, Dimensions, ScrollView, AsyncStorage } from 'react-native';

const dimensions = Dimensions.get('window');
const dWidth = dimensions.width;

export default class TabPromo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			result: [],
			scrollTop: '1',
		}
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
		const categoryPid = this.props.categoryPid;
		
		fetch(`${global.uri}api_controller/fetch_promo`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				appToken: global.appToken,
				categoryPid: categoryPid
			})
		}).then((response) => response.json())
		.then((responseJson) => {
			console.log(responseJson['data']);
			
			if(responseJson['success'] == '1') {
				this.setState({
					result: responseJson['data'],
					isLoading: false
				});
			} else {
				this.setState({
					result: [{
						campaign_pid: '0',
						campaign_title: 'abc'
					}],
					isLoading: false
				});
			}
		}).catch((error) => {
			console.error(error);
		});
	}
	
	/*
	componentWillUnmount() {
		this.setState({
			result: {
				data: [{
					campaign_pid: '1',
					campaign_title: 'abc'
				}]
			}
		});
	}
	*/
	
	ShowPromo() {
		if(this.state.result.length > 0) {
			if(this.state.result[0].campaign_pid != '0') {
				const content = this.state.result.map(function(item) {
					return(
						<View
							key={ item.campaign_pid }
							style={ styles.containerPromo }
						>
							<View style={ styles.containerImage }>
								<Image
									style={ styles.campaignImage }
									source={{ uri: `${global.uri}assets/images/campaigns/${item.company_pid}/${item.campaign_pid}/${item.campaign_image}`}}
									
								/>
							</View>
							<View style={ styles.containerImage }>
								<Image
									style={ styles.campaignImage }
									source={{ uri: `${global.uri}assets/images/campaigns/${item.company_pid}/${item.campaign_pid}/${item.campaign_image}`}}
									
								/>
							</View>
							<View style={ styles.containerImage }>
								<Image
									style={ styles.campaignImage }
									source={{ uri: `${global.uri}assets/images/campaigns/${item.company_pid}/${item.campaign_pid}/${item.campaign_image}`}}
									
								/>
							</View>
							<View style={ styles.containerImage }>
								<Image
									style={ styles.campaignImage }
									source={{ uri: `${global.uri}assets/images/campaigns/${item.company_pid}/${item.campaign_pid}/${item.campaign_image}`}}
									
								/>
							</View>
							{/*
							<View style={ styles.containerCampaignText }>
								<Text style={ styles.campaignText }>
									{ item.campaign_text}
								</Text>
							</View>
							*/}
						</View>
					);
				});
				return(content);
			} else {
				return(
					<View style={{ flex: 1, paddingTop: 20 }} >
						<Text 
							style={{
								textAlign: 'center',
								paddingTop: 10
							}}
						>
							No Promo
						</Text>
					</View>
				);
			}
			
		} else {
			return(
				<View style={{ flex: 1, paddingTop: 20 }} >
					<ActivityIndicator />
				</View>
			);
		}
	}
	
	_UpdateScroll = () => {
		//AsyncStorage.setItem('scrollTop', '3');
		this.setState({
			scrollTop: '4'
		});
		this.props.handler(this.state.scrollTop);
	}
		
	render() {
		const handler = this.props.handler;
		return(
			<View style={{ flex: 1 }}>
				<Text>{ this.props.handler }</Text>
				<ScrollView 
					style={{ flex: 1 }}
					onScroll={ () => handler('zz') }
				>
					<View style={ styles.containerContent }>
						{ this.ShowPromo() }
					</View>
				</ScrollView>
			</View>
		);
	}
	
}

const styles = StyleSheet.create({
	containerContent: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
		paddingTop: 3,
		backgroundColor: '#f2f2f2'
	},
	containerPromo: {
		borderRightWidth: 2,
		borderBottomWidth: 2,
		borderColor: '#f2f2f2',
		width: '50%',
		backgroundColor: 'white'
	},
	containerImage: {
		height: dWidth/2
	},
	campaignImage: { 
		flex: 1
	},
});