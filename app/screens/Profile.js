import React from 'react';
import { createStackNavigator } from 'react-navigation';

import ProfileView from './ProfileView';
import TermsView from './TermsView';
import PrivacyView from './PrivacyView';
import EditOptionView from './EditOptionView';
import EditPasswordView from './EditPasswordView';
import EditProfileView from './EditProfileView';

const ProfileScreen = ({ navigation }) => (
	<ProfileView navigation={navigation} />
);

const TermsScreen = ({ navigation }) => (
	<TermsView navigation={navigation} />
);

const PrivacyScreen = ({ navigation }) => (
	<PrivacyView navigation={navigation} />
);

const EditOptionScreen = ({ navigation }) => (
	<EditOptionView navigation={navigation} />
);

const EditPasswordScreen = ({ navigation }) => (
	<EditPasswordView navigation={navigation} />
);

const EditProfileScreen = ({ navigation }) => (
	<EditProfileView navigation={navigation} />
);

const Profile = createStackNavigator({
	Profile: {
		screen: ProfileScreen
	},
	Terms: {
		screen: TermsScreen
	},
	Privacy: {
		screen: PrivacyScreen
	},
	EditOption: {
		screen: EditOptionScreen
	},
	EditPassword: {
		screen: EditPasswordScreen
	},
	EditProfile: {
		screen: EditProfileScreen
	}
}, {
	headerMode: 'none'
});

export default Profile;