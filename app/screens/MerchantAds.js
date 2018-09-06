import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';

import { addDot } from '../efunctions';

const dimensions = Dimensions.get('window');
const screenWidth = dimensions.width;

export default class MerchantAds extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			companyPid: props.company_pid,
			data: []
		}
	}
	
	componentDidMount() {
		// Fetch merchant
		fetch(`${global.uri}api_controller/fetch_merchant_ads`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				appToken: global.appToken,
				companyPid: this.state.companyPid
			})
		}).then((response) => response.json())
		.then((responseJson) => {
			if(responseJson['success'] == '1') {
				this.setState({
					data: responseJson['data'],
					isLoading: false
				});
			} else {
				this.setState({
					isLoading: false
				});
			}
		}).catch((error) => {
			console.error(error);
		});
	}
	
	_ShowMerchantAds() {
		const navigation = this.props.navigation;
		
		if(this.state.data.length > 0 ) {
			const content = this.state.data.map(function(item) {
				return(
					<TouchableOpacity 
						style={ styles.containerMerchantAds }
						onPress={ () => navigation.navigate('Advertisement', { campaign_pid: item.campaign_pid }) }
						key={ item.campaign_pid }
					>
						<View style={ styles.containerAdsImg }>
							<Image
								style={ styles.imgAds }
								source={{ uri:`${global.uri}assets/images/campaigns/${item.company_pid}/${item.campaign_pid}/${item.campaign_image}`}}
							/>
						</View>
						
						<View style={ styles.containerAdsText }>
							<View style={ styles.containerAdsTitle }>
								<Text style={ styles.txtTitle }>
									{ item.campaign_title }
								</Text>
							</View>
							<View style={ styles.containerAdsPoints }>
								<Text style={ styles.txtPoints }>
									IDR { addDot(item.campaign_points) }
								</Text>
							</View>
						</View>
					</TouchableOpacity>
				);
			});
			
			return(content);
		}
	}

	render() {
		return(
			<View style={ styles.containerContent }>
				{ this._ShowMerchantAds() }
			</View>
		);
	}

}

const styles = StyleSheet.create({
	containerContent: {
		paddingVertical: 5,
		paddingHorizontal: 10
	},
	containerMerchantAds: {
		backgroundColor: 'white',
		padding: 5,
		flexDirection: 'row'
	},
	imgAds: {
		width: screenWidth/5,
		height: screenWidth/5,
	},
	containerAdsText: {
		paddingHorizontal: 15,
		paddingVertical: 5
	},
	containerAdsTitle: {
		paddingTop: 5,
		paddingBottom: 5
	},
	txtTitle: {
		fontSize: 16,
	}
});