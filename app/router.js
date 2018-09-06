import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { createStackNavigator, createTabNavigator, TabBarBottom, TabBarTop } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { FontAwesome, Entypo } from 'react-native-vector-icons';

import SignUp from './screens/SignUp';
import SignUpProfile from './screens/SignUpProfile';
import SignIn from './screens/SignIn';

import Home from './screens/Home';
import HomeFeeds from './screens/HomeFeeds';
import HomeInbox from './screens/HomeInbox';
import Profile from './screens/Profile';

import Merchant from './screens/Merchant';
import Promo from './screens/Promo';
import Reward from './screens/Reward';

import NotifDetailView from './screens/NotifDetailView';

import Ads from './screens/Ads';
import AdsList from './screens/AdsList';
import PromoMenu from './screens/PromoMenu';
import Survey from './screens/Survey';
import FlyerView from './screens/FlyerView';
import MerchantHomeView from './screens/MerchantHomeView';
import CatalogueView from './screens/CatalogueView';
import TabFlyers2 from './screens/TabFlyers2';
import TabFlyers3 from './screens/TabFlyers3';
import TabFlyers4 from './screens/TabFlyers4';
import ParallaxDemo from './screens/ParallaxDemo';
import PromoDetail from './screens/PromoDetail';
import Advertisement from './screens/Advertisement';
import AdsQuestion from './screens/AdsQuestion';
import MerchantPage from './screens/MerchantPage';
import Logs from './screens/Logs';

const headerStyle = {
	marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
};

const Flyers = ({ navigation }) => (
    <FlyerView navigation={navigation} />
);

const MerchantHome = ({ navigation, refresh }) => (
	<MerchantHomeView navigation={navigation} refresh='1' />
);

const CatalogueScreen = ({ navigation }) => (
	<CatalogueView navigation={navigation} />
);

const TabFlyers2View = ({ navigation }) => (
	<TabFlyers2 navigation={navigation} />
);

const TF = createBottomTabNavigator({
	Home: {
		screen: TabFlyers2View,
		navigationOptions: {
			tabBarLabel: 'Home'
		}
	}
});

const TabFlyers = createBottomTabNavigator({
	Home: {
		screen: MerchantHomeView,
		navigationOptions: {
			tabBarLabel: 'Home',
			tabBarPosition: 'bottom', 
			tabBarIcon: ({ tintColor }) =>
				<FontAwesome name='home' size={ 25 } color={ tintColor } />
		}
	},
	Catalogue: {
		screen: CatalogueScreen,
		navigationOptions: {
			tabBarLabel: 'Catalogue',
			tabBarPosition: 'bottom',
			tabBarIcon: ({ tintColor }) =>
				<Entypo name='book' size={ 25 } color={ tintColor } />
		}
	},
	Flyer: {
		path: 'people/:name',
		screen: TabFlyers2,
		navigationOptions: {
			tabBarLabel: 'Promotions',
			tabBarPosition: 'bottom',
			tabBarIcon: ({ tintColor }) =>
				<Entypo name='credit' size={ 25 } color={ tintColor } />
		}
	},
}, {
	tabBarOptions: {
		showIcon: true,
		style: {
			backgroundColor: '#ffffff',
			borderTopWidth: 0.5,
			borderColor: 'grey'
		},
		activeTintColor: '#ff4d4d',
		inactiveTintColor: 'grey',
		indicatorStyle: {
            backgroundColor: '#ff4d4d',
        },
	}
});

const timeStamp = Math.floor(Date.now() / 1000);

const SignInScreen = ({ navigation, refresh }) => (
	<SignIn navigation={navigation} refresh={timeStamp} />
);

export const SignedOut = createStackNavigator({
	SignIn: {
		screen: SignInScreen,
		navigationOptions: {
			title: 'Sign In',
			headerStyle
		}
	},
	SignUp: {
		screen: SignUp,
		navigationOptions: {
			title: 'Sign Up',
			headerStyle
		}
	},
	SignUpProfile: {
		screen: SignUpProfile,
		navigationOptions: {
			headerStyle
		}
	}
},
{
	headerMode: 'none',
	mode: 'modal'
});

function createComponent(instance, props) {
	return () => React.createElement(instance, props);
}

const HomeScreen = ({ navigation, refresh }) => (
	<Home navigation={navigation} refresh={timeStamp} />
);

const Notif = createStackNavigator({
    InboxNotif: {
		screen: HomeInbox,
    },
    Detail: {
		screen: NotifDetailView,
    }
},  {
		headerMode: 'none',
});

export const SignedIn = createBottomTabNavigator({
	Home: {
		screen: (props) => <Home {...props} refresh='3' />,
		navigationOptions: ({ navigation }) => ({
			refresh: '5',
			tabBarLabel: 'Home',
			gesturesEnabled: false,
			tabBarIcon: ({ tintColor }) =>
				<FontAwesome name='home' size={ 28 } color={ tintColor } />
		})
	},
	Feeds: {
		screen: HomeFeeds,
		navigationOptions: {
			tabBarLabel: 'Feeds',
			gesturesEnabled: false,
			tabBarIcon: ({ tintColor }) =>
				<Entypo name='news' size={ 25 } color={ tintColor } />
		}
	},
	Inbox: {
		screen: Notif,
		navigationOptions: {
			tabBarLabel: 'Inbox',
			gesturesEnabled: false,
			tabBarIcon: ({ tintColor }) =>
				<FontAwesome name='inbox' size={ 25 } color={ tintColor } />
		}
	},
	Profile: {
		screen: Profile,
		gesturesEnabled: false,
		navigationOptions: {
			tabBarLabel: 'Profile',
			tabBarIcon: ({ tintColor }) =>
				<FontAwesome name='user' size={ 28 } color={ tintColor } />
		}
	}
}, {
	//animationEnabled: true,
	//swipeEnabled: true,
	tabBarOptions: {
		showIcon: true,
		style: {
			backgroundColor: '#ffffff',
			borderTopWidth: 0.5,
			borderColor: 'grey',
		},
		activeTintColor: '#ff4d4d',
		inactiveTintColor: 'grey',
		indicatorStyle: {
            backgroundColor: '#ff4d4d',
        },
		//scrollEnabled: true,
	}
});

export const createRootNavigator = (signedIn) => {
	
	return createStackNavigator({
		SignedIn: {
			screen: SignedIn,
			
			navigationOptions: ({ navigation }) => ({
				gesturesEnabled: false,
				navigation: navigation
			})
		},
		SignedOut: {
			screen: SignedOut,
			navigationOptions: {
				gesturesEnabled: false
			}
		},
		MerchantView: {
			screen: Promo,
			headerMode: 'float'
		},
		RewardView: {
			screen: Reward
		},
		NotifView: {
			screen: Notif
		},
		AdsView: {
			screen: AdsList
		},
		SurveyView: {
			screen: Survey
		},
		Company: {
			path: 'people/:name',
			screen: TabFlyers
		},
		Advertisement: {
			screen: Advertisement,
			navigationOptions: {
				gesturesEnabled: false
			}
		},
		AdsQuestion: {
			screen: AdsQuestion,
			navigationOptions: {
				gesturesEnabled: false
			}
		},
		Flyer: {
			path: 'people/:name',
			screen: MerchantPage
		},
		PromoDetail: {
			screen: PromoDetail
		},
		Logs: {
			screen: Logs
		}
	},
	{
		headerMode: 'none',
		mode: 'modal',
		initialRouteName: signedIn ? 'SignedIn' : 'SignedOut'
	});

}