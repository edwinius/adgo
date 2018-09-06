import React from 'react';
import { Platform, View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback, Picker, Alert } from 'react-native';

export default class CityPicker extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false
		}
	}
	
	render() {
		if(Platform.OS == 'android') {
			return(	
				<View style={ styles.inputContainer }>
					<Picker
						selectedValue={ this.props.value }
						onValueChange={ this.props.onValueChange }
						style={ styles.pickerAndroid }
					>
						{ this.props.items.map((i, index) => (
							<Picker.Item key={index} label={i.label} value={i.value} />
						))}
					</Picker>
				</View>
			);
		} else {
			const selectedItem = this.props.items.find(
				i => i.value === this.props.value
			);
			
			const selectedLabel = selectedItem ? selectedItem.label : '';
			
			return(
				<View style={ styles.inputContainer }>
					<TouchableOpacity
						onPress={() => this.setState({ modalVisible: true })}
					>
					{/*
						<TextInput
							style={ styles.input }
							editable={ false }
							placeholder='Select City'
							onChangeText={ searchString=> {
								this.setState({ searchString });
							}}
							value={ selectedLabel }
						/>
					*/}
						<Text style={ styles.txtSelectCity }>
							{ selectedLabel == '' ? 'Please Select' : selectedLabel }
						</Text>
					</TouchableOpacity>
					
					<Modal
						animationType='slide'
						transparent={ true }
						visible={ this.state.modalVisible }
						style={ styles.containerModal }
					>
						<TouchableWithoutFeedback
							onPress={ () => this.setState({ modalVisible: false})}
							style={ styles.containerTouchable }
						>
							<View style={ styles.modalContainer }>
								<View style={ styles.modalContent }>
									<Text
										style={ styles.btnDone }
										onPress={ () => this.setState({ modalVisible: false})}
									>
										Done
									</Text>
								</View>
								<View
									onStartShouldSetResponder={ evt => true }
									onResponderReject={ evt => {}}
									style={ styles.containerPicker }
								>
									<Picker
										selectedValue={ this.props.value }
										onValueChange={ this.props.onValueChange }
									>
										{ this.props.items.map((i, index) => (
											<Picker.Item
												key={ index }
												label={ i.label }
												value={ i.value }
											/>
										))}
									</Picker>
								</View>
							</View>
						</TouchableWithoutFeedback>
					</Modal>
				</View>
			);
		}
	}

}

const styles = StyleSheet.create({
	inputContainer: {
		...Platform.select({
			ios: {
				borderBottomColor: '#cacaca',
				borderBottomWidth: 1,
			},
			android: {
				borderBottomColor: '#cacaca',
				borderBottomWidth: 1,
				flex: 1
			}
		})
	},
	pickerAndroid: {
		height: 28
	},
	input: {
		height: 40,
		color: '#cacaca'
	},
	txtSelectCity: {
		paddingTop: 6,
		paddingBottom: 3,
		paddingHorizontal: 10,
		color: 'grey'
	},
	containerModal: {
		backgroundColor: 'white',
		zIndex: 2,
	},
	btnDone: {
		color: 'blue',
		paddingRight: 10,
		fontSize: 15,
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	containerPicker: {
		backgroundColor: 'white'
	},
	modalContent: {
		justifyContent: 'flex-end',
		flexDirection: 'row',
		padding: 4,
		backgroundColor: '#ececec'
	}
});