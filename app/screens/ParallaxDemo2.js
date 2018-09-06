import React from 'react';
import {Animated, Dimensions, Platform, Text, TouchableOpacity, View} from "react-native";
import {Body, Header, List, ListItem as Item, ScrollableTab, Tab, TabHeading, Tabs, Title} from "native-base";
import LinearGradient from "react-native-linear-gradient";

const {width: SCREEN_WIDTH} = Dimensions.get("window");
const IMAGE_HEIGHT = 250;
const HEADER_HEIGHT = Platform.OS === "ios" ? 64 : 50;
const SCROLL_HEIGHT = IMAGE_HEIGHT - HEADER_HEIGHT;
const THEME_COLOR = "rgba(85,186,255, 1)";
const FADED_THEME_COLOR = "rgba(85,186,255, 0.8)";

export default class ParallaxDemo2 extends React.Component {
	
	async componentWillMount() {
		await Expo.Font.loadAsync({
		Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
		});
		this.setState({ loading: false });
	}
	
	nScroll = new Animated.Value(0);
	
	imgScale = this.nScroll.interpolate({
		inputRange: [-25, 0],
		outputRange: [1.1, 1],
		extrapolateRight: "clamp"
	});
	
	tabContent = (x, i) => <View style={{height: this.state.height}}>
    <List onLayout={({nativeEvent: {layout: {height}}}) => {
      this.heights[i] = height;
      if (this.state.activeTab === i) this.setState({height})
    }}>
      {new Array(x).fill(null).map((_, i) => <Item key={i}><Text>Item {i}</Text></Item>)}
    </List></View>;

	constructor(props) {
		super(props);
		this.state = { 
			loading: true
		};
		this.nScroll.addListener(Animated.event([{value: this.scroll}], {useNativeDriver: false}));
	}

	render() {
		if (this.state.loading) {
		  return (<View><Text>1</Text></View>);
		}
		
		return(
			<View>
				<Animated.View style={{position: "absolute", width: "100%", backgroundColor: this.headerBg, zIndex: 1}}>
					<Header style={{backgroundColor: "transparent"}} hasTabs>
						<Body>
						<Title>
						  <Animated.Text style={{color: this.textColor, fontWeight: "bold"}}>
							Tab Parallax
						  </Animated.Text>
						</Title>
						</Body>
					</Header>
				</Animated.View>
				
				<Animated.ScrollView
				  scrollEventThrottle={5}
				  showsVerticalScrollIndicator={false}
				  onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.nScroll}}}], {useNativeDriver: true})}
				  style={{zIndex: 0}}>
					<Animated.View style={{
						transform: [{translateY: Animated.multiply(this.nScroll, 0.65)}, {scale: this.imgScale}],
						backgroundColor: THEME_COLOR
					}}>
						<Animated.Image
						  source={{uri: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Moraine_Lake_17092005.jpg"}}
						  style={{height: IMAGE_HEIGHT, width: "100%", opacity: this.imgOpacity}}>
						  {/*gradient*/}
						  
						</Animated.Image>
					</Animated.View>
				</Animated.ScrollView>
			</View>
		);
	}

}