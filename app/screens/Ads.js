import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';

const dimensions = Dimensions.get('window');

export default class Ads extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			ads: [
				{advertisement_image:''}
			],
			status: true
				
		}
	}
	
	componentDidMount() {
		const navigation = this.props.navigation;
		
		return fetch(`${global.uri}api_controller/fetch_ads`)
			.then((response) => response.json())
			.then((responseJson) => {
				this.setState({
					ads: responseJson
				});
			}).catch((error) => {
				console.error(error);
			});
	}
	
	ShowQuestion = () => {
		if(this.state.status == true) {
			this.setState({status: false});
		}
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
		
		const AdsImage = () => (
			<View style={{ flex: 1 }}>
				<SafeAreaView>
					<TouchableOpacity
							onPress={this.ShowQuestion}
						>
						<Image
							resizeMode= 'contain'
							source={{uri:`${global.uri}adgo/assets/images/ads/${this.state.ads[0].company_pid}/${this.state.ads[0].advertisement_pid}/${this.state.ads[0].advertisement_image}`}}
							style={{ width: dimensions.width, height: dimensions.height }}
						/>
					</TouchableOpacity>
				</SafeAreaView>
			</View>
		);
		
		const Question = () => (
			<View style={{ flex: 1, backgroundColor: 'purple' }}>
				<SafeAreaView>
					<View style={ styles.containerQuestion }>
						<Text style={ styles.txtQuestion }>
							{ this.state.ads[0].advertisement_question }
						</Text>
						
						<View style={ styles.containerOptions }>
							<TouchableOpacity>
								<Text style={ styles.options }>
									{ this.state.ads[0].option1 }
								</Text>
							</TouchableOpacity>
							<TouchableOpacity>
								<Text style={ styles.options }>
									{ this.state.ads[0].option2 }
								</Text>
							</TouchableOpacity>
							<TouchableOpacity>
								<Text style={ styles.options }>
									{ this.state.ads[0].option3 }
								</Text>
							</TouchableOpacity>
							<TouchableOpacity>
								<Text style={ styles.options }>
									{ this.state.ads[0].option4 }
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</SafeAreaView>
			</View>
		);
		
		return(
			<View style={{ flex: 1 }}>
				{ this.state.status ? <AdsImage /> : <Question /> }
			</View>
		);
	}

}

const styles = StyleSheet.create({
	txtQuestion: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 20,
		paddingTop: 90,
		paddingBottom: 35,
		paddingHorizontal: 15
	},
	containerOptions: {
		paddingHorizontal: 25,
	},
	options: {
		color: 'white',
		borderWidth: 1,
		borderColor: 'white',
		borderRadius: 5,
		paddingVertical: 10,
		paddingHorizontal: 15,
		marginTop: 10,
		marginBottom: 10,
		fontSize: 15
	}
});