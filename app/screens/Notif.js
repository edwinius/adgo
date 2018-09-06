import React from 'react';
import { View, StyleSheet, Text, ScrollView, Image, Dimensions, Button, TouchableOpacity, Platform } from 'react-native';
import { onSignOut } from '../auth';
import { createStackNavigator, SafeAreaView } from 'react-navigation';

import NotifView from './NotifView';
import NotifDetailView from './NotifDetailView';

const NotifScreen = ({ navigation }) => (
    <NotifView navigation={navigation} />
);

const NotifDetailScreen = ({ navigation }) => (
    <NotifDetailView navigation={navigation} />
);

const Notif = createStackNavigator({
    Home: {
		screen: NotifScreen,
    },
    Detail: {
		path: 'people/:name',
		screen: NotifDetailScreen,
    }
},  {
		headerMode: 'none',
});

export default Notif;