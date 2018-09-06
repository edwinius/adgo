import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import Header from './Header';

export default class CatalogueView extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			results: {
				data: []
			}
		}
	}
	
	componentDidMount() {
		const navigation = this.props.navigation;
		
		return fetch(`${global.uri}api/fetch_catalogue/${navigation.state.params.company_pid}`)
			.then((response) => response.json())
			.then((responseJson) => {
				this.setState({
					results: responseJson
				});
			}).catch((error) => {
				console.error(error);
			});
	}
	
	showCatalogue() {
		if(this.state.results.data.length > 0) {
			const contentCatalogue = this.state.results.data.map(function(item) {
				const catalogue = item.catalogue.map(function(row) {
					return(
						<View
							key={ row.catalogue_pid }
							style={ styles.boxCatalogue }
						>
							<View>
								<Image
									style={ styles.imgCatalogue }
									source={{ uri: `${global.uri}assets/images/catalogue/${row.company_pid}/${row.catalogue_pid}/${row.catalogue_image}`}}
								/>
							</View>
							<View
								style={ styles.containerCatalogueText }
							>
								<Text style={ styles.txtCatalogue }>
									{ row.catalogue_name }
								</Text>
							</View>
						</View>
					);
				});
				
				return(
					<View
						style={ styles.containerHorizontal }
						key={ item.category_pid }
					>
						<View style={ styles.containertxtCategory }>
							<Text style={ styles.txtCategory }>
								{ item.category_name }
							</Text>
						</View>
						<ScrollView
							horizontal
							style={ styles.scrollContainerHorizontal }
						>
							{ catalogue }
						</ScrollView>
					</View>
				);
				
			});
				
			return(contentCatalogue);
		} else {
			return(
				<View style={ styles.containerNotFound }>
					<Image
						style={ styles.imgNotFound }
						source={require('../assets/images/icon_not_found.png')}
					/>
					<Text style={ styles.txtNotFound }>
						No Catalogue Found
					</Text>
				</View>
			);
		}
	}
	
	render() {
		const navigation = this.props.navigation;
		
		return(
			<View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
				<Header navigation={navigation} title={`${navigation.state.params.company_name}`} />
				
				<ScrollView>
					{ this.showCatalogue() }
				</ScrollView>
			</View>
		);
	}
	
}

const styles = StyleSheet.create({
	containerHorizontal: {
		marginVertical: 15,
		shadowColor: 'grey',
		shadowOffset: { width: 1, height: 2 },
		shadowRadius: 2,
		shadowOpacity: 0.40,
	},
	scrollContainerHorizontal: {
		backgroundColor: 'white',
	},
	containertxtCategory: {
		backgroundColor: 'white',
		borderBottomWidth: 1,
		borderColor: '#cacaca'
	},
	txtCategory: {
		fontWeight: 'bold',
		paddingHorizontal: 10,
		paddingVertical: 10,
		fontSize: 16
	},
	boxCatalogue: {
		borderRightWidth: 1,
		borderColor: '#cacaca'
	},
	imgCatalogue: { 
		width: 150, 
		height: 150
	},
	containerCatalogueText: {
		height: 50,
		width: '100%'
	},
	txtCatalogue: {
		textAlign: 'center',
		paddingTop: 5,
		paddingHorizontal: 5,
	},
	containerNotFound: {
		alignItems: 'center',
		paddingTop: 55
	},
	imgNotFound: {
		width: 125,
		height: 125
	},
	txtNotFound: {
		textAlign: 'center',
		paddingTop: 35,
		fontSize: 15
	}
});