import React from 'react';
// Intro Screens & Splash Screens
import Splash from '../screens/';
import Subscriptions from '../screens/Subscriptions';
// Auth Screens
import Signup from '../screens/Auth/Signup/';
import Signin from '../screens/Auth/Signin/';
import RecoverPassword from '../screens/Auth/RecoverPassword';

// Dashboard Main Screens
import Search from '../screens/Search';
import Details from '../screens/Details/';
import EventDetails from '../screens/EventDetails';
import Movies from '../screens/Movies/';
import Series from '../screens/Series/';
import ComingSoon from '../screens/ComingSoon';
import ComingSoonDetails from '../screens/ComingSoon/Details/';
import TrendingNow from '../screens/TrendingNow';
import VideoPlayer from '../screens/VideoPlayer/';

//Other Screens
import Wishlist from '../screens/Wishlist/';
import Download from '../screens/Downloads/';
import Profile from '../screens/MyProfile/';
import Help from '../screens/Help/';
import Privacy from '../screens/Privacy/';
import TermsConditions from '../screens/TermsCondition/';
import Settings from '../screens/Settings/';
import SideMenu from '../components/SideMenu/';
import More from '../screens/More/';
import SeeMore from '../screens/SeeMore';
import Plans from '../screens/Plans';
import Test from '../components/VideoPlayerView/Test';
import Chat from '../screens/Chat';
import Support from '../screens/Support';

//Navigator
import DrawerNavigator from './DrawerNavigator';
import Languages from '../screens/Language';
import ExclusiveDetails from '../screens/ExclusiveDetails';
import Plan from '../screens/Plan';
import MovieLanguages from '../screens/LanguagesMovieList';
import OrderHistory from '../screens/OrderHistory';
import NewsDetail from '../screens/NewsDetail';
import ConnectDevices from '../screens/ConnectDevices';
import TvMovies from '../screens/TvMovies';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Live from '../screens/Live';

const Stack = createNativeStackNavigator();
const defaultStackSettings = {
  headerShown: false,
  gestureEnabled: false,
};

const AppNavigation = props => {
  console.log({AppNavigation: props.initialRouteName});
  
  return (
    <Stack.Navigator initialRouteName={props.initialRouteName}>
      <Stack.Screen name="Signup" component={Signup} options={defaultStackSettings} />
      <Stack.Screen name="Signin" component={Signin} options={defaultStackSettings} />
      <Stack.Screen name="RecoverPassword" component={RecoverPassword} options={defaultStackSettings} />
      <Stack.Screen name="Splash" component={Splash} options={defaultStackSettings} />
      <Stack.Screen name="Home" component={DrawerNavigator} options={defaultStackSettings} />
      <Stack.Screen name="Subscriptions" component={Subscriptions} options={defaultStackSettings} />
      <Stack.Screen name="Search" component={Search} options={defaultStackSettings} />
      <Stack.Screen name="Movies" component={Movies} options={defaultStackSettings} />
      <Stack.Screen name="Live" component={Live} options={{ headerShown: false, gestureEnabled: false, orientation: 'landscape' }} />
      <Stack.Screen name="TvMovies" component={TvMovies} options={defaultStackSettings} />
      <Stack.Screen name="Series" component={Series} options={defaultStackSettings} />
      <Stack.Screen name="ComingSoon" component={ComingSoon} options={defaultStackSettings} />
      <Stack.Screen name="ComingSoonDetails" component={ComingSoonDetails} options={defaultStackSettings} />
      <Stack.Screen name="TrendingNow" component={TrendingNow} options={defaultStackSettings} />
      <Stack.Screen name="Details" component={Details} options={defaultStackSettings} />
      <Stack.Screen name="EventDetails" component={EventDetails} options={{ ...defaultStackSettings, animationEnabled: false }} />
      <Stack.Screen name="Video" component={VideoPlayer} options={defaultStackSettings} />
      <Stack.Screen name="Wishlist" component={Wishlist} options={defaultStackSettings} />
      <Stack.Screen name="Download" component={Download} options={defaultStackSettings} />
      <Stack.Screen name="Profile" component={Profile} options={defaultStackSettings} />
      <Stack.Screen name="Help" component={Help} options={defaultStackSettings} />
      <Stack.Screen name="ConnectDevices" component={ConnectDevices} options={defaultStackSettings} />
      <Stack.Screen name="Privacy" component={Privacy} options={defaultStackSettings} />
      <Stack.Screen name="TermsConditions" component={TermsConditions} options={defaultStackSettings} />
      <Stack.Screen name="Settings" component={Settings} options={defaultStackSettings} />
      <Stack.Screen name="SideMenu" component={SideMenu} options={defaultStackSettings} />
      <Stack.Screen name="More" component={More} options={defaultStackSettings} />
      <Stack.Screen name="SeeMore" component={SeeMore} options={defaultStackSettings} />
      <Stack.Screen name="Plans" component={Plans} options={defaultStackSettings} />
      <Stack.Screen name="Test" component={Test} options={defaultStackSettings} />
      <Stack.Screen name="Chat" component={Chat} options={defaultStackSettings} />
      <Stack.Screen name="Language" component={Languages} options={defaultStackSettings} />
      <Stack.Screen name="MoviesByLanguages" component={MovieLanguages} options={defaultStackSettings} />
      <Stack.Screen name="Exclusive" component={ExclusiveDetails} options={defaultStackSettings} />
      <Stack.Screen name="Support" component={Support} options={defaultStackSettings} />
      <Stack.Screen name="Order" component={OrderHistory} options={defaultStackSettings} />
      <Stack.Screen name="Plan" component={Plan} options={defaultStackSettings} />
      <Stack.Screen name="NewsDetail" component={NewsDetail} options={defaultStackSettings} />
    </Stack.Navigator>
  );
};

export default AppNavigation;
