import React from 'react';
import { View, StyleSheet, Text, ScrollView, Image, Dimensions, Button, TouchableOpacity, Platform, Alert, ListView, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-navigation';

const styleGeneral = require('./styleGeneral');

export default class MerchantView extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true
		}
	}
	
	componentDidMount() {
		return fetch(`${global.uri}api/list_merchants`)
			.then((response) => response.json())
			.then((responseJson) => {
				let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
				this.setState({
					isLoading: false,
					dataSource: ds.cloneWithRows(responseJson),
				}, function() {
				});
			}).catch((error) => {
				console.error(error);
			});
	}
	
	ListViewItemSeparator = () => {
		return(
			<View
				style={{
					height: 0,
					width: '100%',
					backgroundColor: '#000',
				}}
			/>
		);
	}
	
	render() {
		
		const navigation = this.props.navigation;
		
		if(this.state.isLoading) {
			return(
				<View style={{ flex: 1, paddingTop: 20 }} >
					<ActivityIndicator />
				</View>
			);
		}
		
		return(
			<View style={{ flex: 1 }}>
				<SafeAreaView
					style={ styles.bannerContainer }
					forceInset={{ top: 'always', bottom: 'never' }}
				>
					<View style={ styles.banner }>
						<View style={ styles.bannerPadding }>
							<TouchableOpacity
								onPress={() => navigation.goBack(null)}
								color="white"
							>
								<Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>&lt;</Text>
							</TouchableOpacity>
						</View>
						<Text style={ styles.title }>Merchants</Text>
						<View style={ styles.bannerPadding }></View>
					</View>
					
					<View style={ styles.containerInputSearch }>
						<TextInput
							style={ styles.inputSearch }
							placeholder='Search Location'
						></TextInput>
					</View>
				</SafeAreaView>
				
				<View>
					<ListView
						dataSource={ this.state.dataSource }
						renderSeparator={ this.ListViewItemSeparator }
						renderRow={(rowData) => <TouchableOpacity style={ styles.rowViewContainer } 
						onPress={() => navigation.navigate('Flyer', { company_pid: rowData.company_pid } )} >
							<View style={ styles.containerLogo }>
								<Image
									style={ styles.companyLogo }
									source={{ uri:`${global.uri}adgo/assets/images/company_logo/${rowData.company_pid}/${rowData.company_logo}`}}
								/>
							</View>
							<Text style={ styles.companyName }>
								{rowData.company_name}
							</Text>
							<View>
								<Text style={ styles.companyAddress }>
									{rowData.company_address}
								</Text>
							</View>
						</TouchableOpacity>}
					/>
				</View>
			</View>
		);
		
		/*
		return(
			<View style={{ flex: 1 }}>
				<SafeAreaView
					style={ styles.bannerContainer }
					forceInset={{ top: 'always', bottom: 'never' }}
				>
					<View style={ styles.banner }>
						<Button
							onPress={() => navigation.goBack(null)}
							title="Go back"
							color="white"
						/>
						<Text style={ styles.title }>Merchants</Text>
					</View>
				</SafeAreaView>
				
				<View style={ styleGeneral.containerContent }>
					
					<TouchableOpacity
						backgroundColor='#03A9F4'
						style={ styles.navMerchant }
						onPress={() => navigation.navigate('Flyer')}
					>
						<Text style={ styles.navMerchantText }>
							Alfamart
						</Text>
					</TouchableOpacity>
					
				</View>
			</View>
		);
		*/
	}

}

const styles = StyleSheet.create({
	bannerContainer: {
		backgroundColor: '#673ab7',
		paddingTop: 20,
		paddingBottom: 0
	},
	banner: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingTop: 16
	},
	bannerPadding: { 
		width: 25, 
		height: 25,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: '200',
		color: '#fff',
		margin: 8,
		textAlign: 'center',
		flex: 1
	},
	navMerchant: {
		height: 50,
		paddingLeft: 20,
		justifyContent: 'center'
	},
	navMerchantText: {
		fontSize: 18
	},
	MainContainer: {
		justifyContent: 'center',
		flex: 1,
		margin: 10
	},
	rowViewContainer: {
		paddingRight: 20,
		paddingLeft: 20,
		paddingTop: 10,
		paddingBottom: 10,
		backgroundColor: 'white',
		marginBottom: 10
	},
	containerLogo: {
		alignItems: 'center'
	},
	companyLogo: {
		width: 250,
		height: 100
	},
	companyName: {
		fontSize: 20,
	},
	companyAddress: {
		fontSize: 12,
		color: 'grey'
	},
	containerInputSearch: {
		paddingBottom: 10,
		paddingLeft: 20,
		paddingRight: 20,
	},
	inputSearch: {
		backgroundColor: 'white',
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 10,
		paddingRight: 10,
		borderRadius: 5,
		fontSize: 18
	}
});