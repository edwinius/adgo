import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import RewardView from './RewardView';
import RedeemView from './RedeemView';

const PointScreen = ({ navigation }) => (
	<RewardView navigation={ navigation } />
);

const Reward = createStackNavigator({
	Point: {
		screen: PointScreen
	},
	Redeem: {
		screen: RedeemView
	}
}, {
	headerMode: 'none'
});

export default Reward;