import React from 'react';
import { View, StyleSheet, Text, ScrollView, Image, Dimensions, Button, TouchableOpacity, Platform } from 'react-native';
import { onSignOut } from '../auth';
import { createStackNavigator, SafeAreaView } from 'react-navigation';

import MerchantView from './MerchantView';
import FlyerView from './FlyerView';

const MerchantScreen = ({ navigation }) => (
    <MerchantView banner="Merchants" navigation={navigation} />
);

const Flyers = ({ navigation }) => (
    <FlyerView navigation={navigation} />
);

const Merchant = createStackNavigator({
    Home: {
		screen: MerchantScreen,
    },
    Flyer: {
		path: 'people/:name',
		screen: Flyers,
    }
},  {
		headerMode: 'none',
});

export default Merchant;