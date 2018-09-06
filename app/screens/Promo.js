import React from 'react';
import { View, StyleSheet, Text, ScrollView, Image, Dimensions, Button, TouchableOpacity, Platform } from 'react-native';
import { onSignOut } from '../auth';
import { createStackNavigator, SafeAreaView, TabBarBottom } from 'react-navigation';
import { FontAwesome, Entypo } from 'react-native-vector-icons';

import PromoMenu from './PromoMenu';
import AdsList from './AdsList';
import FlyerView from './FlyerView';
import MerchantHomeView from './MerchantHomeView';
import CatalogueView from './CatalogueView';

const PromoMenuScreen = ({ navigation }) => (
    <PromoMenu navigation={navigation} />
);

const AdsListScreen = ({ navigation }) => (
	<AdsList navigation={navigation} />
);

const Promo = createStackNavigator({
    PromoMenus: {
		screen: PromoMenuScreen,
    },
	AdsListView: {
		screen: AdsListScreen
	}
},  {
		headerMode: 'none',
});

export default Promo;