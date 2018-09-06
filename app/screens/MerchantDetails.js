import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Images from './Images';

export default class MerchantDetails extends React.Component {
	
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
		fetch(`${global.uri}api_controller/fetch_merchant`, {
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
			console.log(responseJson);
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
	
	_ShowMerchantDetail() {
		if(this.state.data.length > 0) {
			const arrData = [
				{
					dataIcon: require('../assets/images/icon_fb.png'),
					dataText: `${this.state.data[0].company_fb}`
				},
				{
					dataIcon: require('../assets/images/icon_ig.png'),
					dataText: `${this.state.data[0].company_ig}`
				},
				{
					dataIcon: require('../assets/images/icon_twitter.png'),
					dataText: `${this.state.data[0].company_twitter}`
				},
				{
					dataIcon: require('../assets/images/icon_phone.png'),
					dataText: `${this.state.data[0].company_telephone}`, 
				},
				{
					dataIcon: require('../assets/images/icon_web.png'),
					dataText: `${this.state.data[0].company_web}`
				},
				{
					dataIcon: require('../assets/images/icon_mail.png'),
					dataText: `${this.state.data[0].company_email}`
				},
				{
					dataIcon: require('../assets/images/icon_location.png'),
					dataText: `${this.state.data[0].company_address}`
				}
			];
			
			const details = arrData.map(function(item, index) {
				return(
					<View 
						style={ styles.rowDetails }
						key={ index }
					>
						<View style={ styles.containerIconDetails }>
							<Image
								style={ styles.iconDetails }
								source={ item.dataIcon }
							/>
						</View>
						
						<View style={ styles.containerTxtDetails }>
							<Text style={ styles.txtDetails }>
								{ item.dataText != 'null' ? item.dataText : null }
							</Text>
						</View>
					</View>
				);
			});
			
			return(details);
		}
	}
	
	render() {
		return(
			<View>
				<View style={ styles.containerCompanyDetails }>
					{ this._ShowMerchantDetail() }
				</View>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	containerCompanyDetails: {
		padding: 10,
		backgroundColor: 'white',
		marginTop: 4,
	},
	rowDetails: {
		paddingVertical: 6,
		flexDirection: 'row'
	},
	containerIconDetails: {
		paddingHorizontal: 15
	},
	iconDetails: {
		width: 22,
		height: 22,
	},
	containerTxtDetails: {
		paddingTop: 2,
		flex: 1
	}
});