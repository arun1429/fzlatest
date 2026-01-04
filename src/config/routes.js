// Intro Screens & Splash Screens
import Splash from '../screens/'
import Welcome from '../screens/Welcome'
import Intro from '../screens/Intro'
import Subscriptions from '../screens/Subscriptions'

// Auth Screens
// import Signup from '../screens/Auth/Signup/'
// import Signin from '../screens/Auth/Signin/'
// import RecoverPassword from '../screens/Auth/RecoverPassword'

// Dashboard Main Screens
import Home from '../screens/Home'
import Search from '../screens/Search'
import Details from '../screens/Details/'
// import Episodes from '../screens/Details/episode'
import Movies from '../screens/Movies/'
import Series from '../screens/Series/'
import VideoPlayer from '../screens/VideoPlayer/'

//Other Screens
import Wishlist from '../screens/Wishlist/'
import Download from '../screens/Downloads/'
import Profile from '../screens/MyProfile/'
import Help from '../screens/Help/'
import Privacy from '../screens/Privacy/'
import Settings from '../screens/Settings/'
import VideoQuality from '../screens/VideoQuality/'
import SideMenu from '../components/SideMenu/'
import More from '../screens/More/'
import Tabs from '../navigation/BottomTabNavigatior'


const Routes = {
    Splash: {
        screen: Splash, 
        navigationOptions: ({navigation}) => ({
            header: () => false,
            drawerLockMode: 'locked-closed'
        })
    },
    Subscriptions: {
        screen: Subscriptions, 
        navigationOptions: ({navigation}) => ({
            header: () => true,
            drawerLockMode: 'locked-closed'
        })
    },
    Welcome: {
        screen: Welcome, 
        navigationOptions: ({navigation}) => ({
            header: () => false,
            drawerLockMode: 'locked-closed'
        })
    },
    Intro: {
        screen: Intro, 
        navigationOptions: ({navigation}) => ({
            header: () => false,
            drawerLockMode: 'locked-closed'
        })
    },
    // Signup: {
    //     screen: Signup, 
    //     navigationOptions: ({navigation}) => ({
    //         header: () => false,
    //         drawerLockMode: 'locked-closed'
    //     })
    // },
    // Signin: {
    //     screen: Signin, 
    //     navigationOptions: ({navigation}) => ({
    //         header: () => false,
    //         drawerLockMode: 'locked-closed'
    //     })
    // },
    // RecoverPassword: {
    //     screen: RecoverPassword, 
    //     navigationOptions: ({navigation}) => ({
    //         header: () => false
    //       })
    // },
    Home: {
        screen: Tabs, 
        navigationOptions: ({navigation}) => ({
            header: () => false,
            gestureEnabled: false,
            drawerLockMode: 'unlocked'
        })
    },
    Search: {
        screen: Search,
        navigationOptions: ({navigation}) => ({
            header: () => false,
            drawerLockMode: 'locked-closed'
        })
    },
    Movies: {
        screen: Movies,
        navigationOptions: ({navigation}) => ({
            header: () => false,
            drawerLockMode: 'locked-closed'
        })
    },
    Series: {
        screen: Series,
        navigationOptions: ({navigation}) => ({
            header: () => false,
            drawerLockMode: 'locked-closed'
        })
    },
    Details: {
        screen: Details,
        navigationOptions: ({navigation}) => ({
            header: () => false,
            drawerLockMode: 'locked-closed'
        })
    },
    // Episodes: {
    //     screen: Episodes,
    //     navigationOptions: ({navigation}) => ({
    //         header: () => false,
    //         drawerLockMode: 'locked-closed'
    //     })
    // },
    Video: {
        screen: VideoPlayer,
        navigationOptions: ({navigation}) => ({
            header: () => false,
            gestureEnabled: false,
            drawerLockMode: 'locked-closed'
        })
    },
    Wishlist: {
        screen: Wishlist,
        navigationOptions: ({navigation}) => ({
            header: () => false,
            gestureEnabled: false,
            drawerLockMode: 'locked-closed'
        })
    },
    Download: {
        screen: Download,
        navigationOptions: ({navigation}) => ({
            header: () => false,
            drawerLockMode: 'locked-closed'
        })
    },
    Profile: {
        screen: Profile,
        navigationOptions: ({navigation}) => ({
            header: () => false,
            gestureEnabled: false,
            drawerLockMode: 'locked-closed'
        })
    },
    Help: {
        screen: Help,
        navigationOptions: ({navigation}) => ({
            header: () => false,
            gestureEnabled: false,
            drawerLockMode: 'locked-closed'
        })
    },
    Privacy: {
        screen: Privacy,
        navigationOptions: ({navigation}) => ({
            header: () => false,
            gestureEnabled: false,
            drawerLockMode: 'locked-closed'
        })
    },
    Settings: {
        screen: Settings,
        navigationOptions: ({navigation}) => ({
            header: () => false,
            gestureEnabled: false,
            drawerLockMode: 'locked-closed'
        })
    },
    VideoQuality: {
        screen: VideoQuality,
        navigationOptions: ({navigation}) => ({
            header: () => true,
            gestureEnabled: false,
            drawerLockMode: 'locked-closed'
        })
    },
    SideMenu: {
        screen: SideMenu, 
        navigationOptions: ({navigation}) => ({
            header: () => false,
            drawerLockMode: 'locked-closed'
            
        })
    },
    More: {
        screen: More, 
        navigationOptions: ({navigation}) => ({
            header: () => false,
            drawerLockMode: 'locked-closed',
            gestureEnabled: false,

        })
    },
}

export default Routes