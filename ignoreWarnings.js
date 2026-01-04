import {LogBox} from 'react-native';

if (__DEV__) {
  const ignoreWarns = [
    'EventEmitter.removeListener',
    `Require cycle: node_modules\rn-fetch-blob\index.js -> node_modules\rn-fetch-blob\polyfill\index.js -> node_modules\rn-fetch-blob\polyfill\Blob.js -> node_modules\rn-fetch-blob\index.js `,
    `Trying to load empty source.
    at Video (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:229891:36)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at VideoPlayer (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:286928:36)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at anonymous (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:72554:62)
    at TouchableOpacity (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:116860:36)
    at TouchableOpacity
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at VirtualizedListCellContextProvider (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:79172:24)
    at CellRenderer (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:78950:36)
    at AndroidHorizontalScrollContentView
    at AndroidHorizontalScrollView
    at ScrollView (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:67874:36)
    at ScrollView
    at VirtualizedListContextProvider (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:79149:25)
    at VirtualizedList (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:76719:36)
    at FlatList (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:75983:36)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at AppSlider (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:287516:36)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at Slider (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:286518:36)
    at Connect(Slider) (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:135821:34)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at RCTScrollView
    at ScrollView (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:67874:36)
    at ScrollView
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at Home (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:285115:36)
    at Connect(Home) (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:135821:34)
    at StaticContainer (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:208569:17)
    at EnsureSingleNavigator (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:204402:24)
    at SceneView (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:208474:22)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at Background (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:210424:21)
    at Screen (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:211824:108)
    at RNSScreen
    at anonymous (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:72554:62)
    at Suspender (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:212462:22)
    at Suspense
    at Freeze (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:212481:23)
    at DelayedFreeze (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:211990:22)
    at InnerScreen (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:212039:36)
    at Screen (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:212227:36)
    at MaybeScreen (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:290463:24)
    at RNSScreenContainer
    at ScreenContainer (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:212150:31)
    at MaybeScreenContainer (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:290452:23)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at SafeAreaProviderCompat (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:211780:25)
    at BottomTabView (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:288267:30)
    at PreventRemoveProvider (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:207445:25)
    at NavigationContent (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:208265:22)
    at anonymous (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:208281:27)
    at BottomTabNavigator (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:288184:18)
    at BottomTabNavigatior
    at StaticContainer (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:208569:17)
    at EnsureSingleNavigator (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:204402:24)
    at SceneView (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:208474:22)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at Background (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:210424:21)
    at Screen (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:211824:108)
    at RNSScreen
    at anonymous (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:72554:62)
    at Suspender (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:212462:22)
    at Suspense
    at Freeze (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:212481:23)
    at DelayedFreeze (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:211990:22)
    at InnerScreen (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:212039:36)
    at Screen (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:212227:36)
    at MaybeScreen (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:314210:24)
    at RNSScreenContainer
    at ScreenContainer (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:212150:31)
    at MaybeScreenContainer (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:314199:23)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at AnimatedComponent(View) (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:291287:38)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at AnimatedComponent(View) (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:291287:38)
    at PanGestureHandler (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:250525:38)
    at Drawer (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:313650:26)
    at DrawerViewBase (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:290772:22)
    at GestureHandlerRootView
    at GestureHandlerRootView (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:250982:25)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at SafeAreaProviderCompat (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:211780:25)
    at DrawerView (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:290988:27)
    at PreventRemoveProvider (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:207445:25)
    at NavigationContent (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:208265:22)
    at anonymous (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:208281:27)
    at DrawerNavigator (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:290668:18)
    at DrawerNavigator
    at StaticContainer (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:208569:17)
    at EnsureSingleNavigator (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:204402:24)
    at SceneView (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:208474:22)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at DebugContainer (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:210036:36)
    at MaybeNestedStack (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:203000:23)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at RNSScreen
    at anonymous (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:72554:62)
    at Suspender (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:212462:22)
    at Suspense
    at Freeze (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:212481:23)
    at DelayedFreeze (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:211990:22)
    at InnerScreen (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:212039:36)
    at Screen (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:212227:36)
    at SceneView (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:203044:22)
    at Suspender (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:212462:22)
    at Suspense
    at Freeze (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:212481:23)
    at DelayedFreeze (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:211990:22)
    at RNSScreenStack
    at ScreenStack (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:212011:25)
    at NativeStackViewInner (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:203226:22)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at SafeAreaProviderCompat (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:211780:25)
    at NativeStackView
    at PreventRemoveProvider (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:207445:25)
    at NavigationContent (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:208265:22)
    at anonymous (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:208281:27)
    at NativeStackNavigator (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:202935:18)
    at AppNavigation (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:212564:27)
    at EnsureSingleNavigator (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:204402:24)
    at BaseNavigationContainer (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:204003:28)
    at ThemeProvider (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:209473:21)
    at NavigationContainerInner (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:209363:26)
    at RNCSafeAreaView
    at anonymous (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:211083:21)
    at RNCSafeAreaProvider
    at SafeAreaProvider (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:210933:24)
    at RootNavigation (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:122805:41)
    at ThemeProvider (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:350834:38)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at Portal.Host (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:356865:36)
    at RNCSafeAreaProvider
    at SafeAreaProvider (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:210933:24)
    at SafeAreaProviderCompat (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:351333:25)
    at PaperProvider (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:351219:37)
    at Provider (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:135635:32)
    at App (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:122529:36)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at RCTView
    at View (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59479:43)
    at AppContainer (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:59323:36)
    at FreizeitMedia(RootComponent) (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:108039:28)`,
    `Trying to load empty source.
    Video@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:195500:36
    RCTView
    View
    RCTView
    View
    VideoPlayer@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:197574:36
    RCTView
    View
    AnimatedComponent@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:58198:24
    AnimatedComponentWrapper
    TouchableOpacity@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:54293:36
    RCTView
    View
    RCTView
    View
    VirtualizedListCellContextProvider@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:60262:24
    CellRenderer@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:60001:36
    AndroidHorizontalScrollContentView
    AndroidHorizontalScrollView
    ScrollView@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:60741:36
    ScrollView
    VirtualizedListContextProvider@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:60232:25
    VirtualizedList@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:58803:36
    FlatList@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:58456:36
    RCTView
    View
    AppSlider@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:198288:36
    RCTView
    View
    Slider@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:197126:36
    Connect(Slider)@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:111526:34
    RCTView
    View
    RCTView
    View
    RCTScrollView
    ScrollView@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:60741:36
    ScrollView
    RCTView
    View
    RCTView
    View
    AnimatedComponent@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:58198:24
    AnimatedComponentWrapper
    SafeView@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:96552:36
    withOrientation@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:96940:38
    Home
    Connect(Home)@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:111526:34
    SceneView@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:94509:36
    RNSScreen
    AnimatedComponent@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:58198:24
    AnimatedComponentWrapper
    MaybeFreeze@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:102050:23
    Screen@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:102106:36
    ResourceSavingScene@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:178543:36
    RNSScreenContainer
    ScreenContainer@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:102224:31
    RCTView
    View
    TabNavigationView@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:173183:36
    NavigationView@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:173366:38
    Navigator@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:92656:38
    SceneView@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:94509:36
    RNSScreen
    AnimatedComponent@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:58198:24
    AnimatedComponentWrapper
    MaybeFreeze@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:102050:23
    Screen@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:102106:36
    ResourceSavingScene@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:202225:36
    RNSScreenContainer
    ScreenContainer@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:102224:31
    RCTView
    View
    AnimatedComponent(View)@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:176981:38
    RCTView
    View
    AnimatedComponent(View)@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:176981:38
    PanGestureHandler@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:97705:38
    Drawer@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:202377:36
    DrawerView@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:201824:36
    Navigator@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:92656:38
    SceneView@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:94509:36
    RCTView
    View
    RCTView
    View
    RCTView
    View
    CardSheet@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:105834:23
    RCTView
    View
    AnimatedComponent@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:58198:24
    AnimatedComponentWrapper
    PanGestureHandler@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:97705:38
    PanGestureHandler@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:101341:34
    RCTView
    View
    AnimatedComponent@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:58198:24
    AnimatedComponentWrapper
    RCTView
    View
    Card@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:103790:36
    CardContainer@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:103520:22
    RNSScreen
    AnimatedComponent@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:58198:24
    AnimatedComponentWrapper
    MaybeFreeze@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:102050:23
    Screen@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:102106:36
    MaybeScreen@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:101909:24
    RNSScreenContainer
    ScreenContainer@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:102224:31
    MaybeScreenContainer@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:101897:23
    CardStack@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:101462:36
    KeyboardManager@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:105974:36
    RNCSafeAreaView
    SafeAreaProvider@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:101205:24
    SafeAreaProviderCompat@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:106320:24
    GestureHandlerRootView
    GestureHandlerRootView@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:97333:24
    StackView@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:100840:36
    StackView@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:106436:26
    Navigator@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:92656:38
    NavigationContainer@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:95578:38
    SceneView@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:94509:36
    SwitchView@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:94467:36
    Navigator@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:92656:38
    NavigationContainer@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:95578:38
    Provider@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:111372:32
    App@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:91800:36
    RCTView
    View
    RCTView
    View
    AppContainer@http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.freizeitMedia&modulesOnly=false&runModule=true:64629:36`,
    `ViewPropTypes will be removed from React Native, along with all other PropTypes. We recommend that you migrate away from PropTypes and switch to a type system like TypeScript. If you need to continue using ViewPropTypes, migrate to the 'deprecated-react-native-prop-types' package.`,
    `ColorPropType will be removed from React Native, along with all other PropTypes. We recommend that you migrate away from PropTypes and switch to a type system like TypeScript. If you need to continue using ColorPropType, migrate to the 'deprecated-react-native-prop-types' package.`,
    // `Warning: Encountered two children with the same key, \`[object Object]\`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children 
    // to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.
    //     in RCTView (at View.js:34)
    //     in View (at ScrollView.js:1107)
    //     in RCTScrollView (at ScrollView.js:1238)
    //     in ScrollView (at ScrollView.js:1264)
    //     in ScrollView (at VirtualizedList.js:1250)
    //     in VirtualizedListContextProvider (at VirtualizedList.js:1080)
    //     in VirtualizedList (at FlatList.js:620)
    //     in FlatList (at Home/index.js:1101)
    //     in RCTView (at View.js:34)
    //     in View (at ScrollView.js:1107)
    //     in RCTScrollView (at ScrollView.js:1238)
    //     in ScrollView (at ScrollView.js:1264)
    //     in ScrollView (at Home/index.js:931)
    //     in RCTView (at View.js:34)
    //     in View (at Home/index.js:917)
    //     in RCTView (at View.js:34)
    //     in View (at createAnimatedComponent.js:217)
    //     in AnimatedComponent (at createAnimatedComponent.js:278)
    //     in AnimatedComponentWrapper (at react-native-safe-area-view/index.js:163)
    //     in SafeView (at withOrientation.js:54)
    //     in withOrientation (at Home/index.js:914)
    //     in Home (created by Connect(Home))
    //     in Connect(Home) (created by SceneView)
    //     in SceneView (created by TabNavigationView)
    //     in RNSScreen (at createAnimatedComponent.js:217)
    //     in AnimatedComponent (at createAnimatedComponent.js:278)
    //     in AnimatedComponentWrapper (at src/index.native.tsx:252)
    //     in MaybeFreeze (at src/index.native.tsx:251)
    //     in Screen (created by ResourceSavingScene)
    //     in ResourceSavingScene (created by TabNavigationView)
    //     in RNSScreenContainer (at src/index.native.tsx:330)
    //     in ScreenContainer (created by TabNavigationView)
    //     in RCTView (at View.js:34)
    //     in View (created by TabNavigationView)
    //     in TabNavigationView (created by NavigationView)
    //     in NavigationView (created by Navigator)
    //     in Navigator (created by SceneView)
    //     in SceneView (created by Drawer)
    //     in RNSScreen (at createAnimatedComponent.js:217)
    //     in AnimatedComponent (at createAnimatedComponent.js:278)
    //     in AnimatedComponentWrapper (at src/index.native.tsx:252)
    //     in MaybeFreeze (at src/index.native.tsx:251)
    //     in Screen (created by ResourceSavingScene)
    //     in ResourceSavingScene (created by Drawer)
    //     in RNSScreenContainer (at src/index.native.tsx:330)
    //     in ScreenContainer (created by Drawer)
    //     in RCTView (at View.js:34)
    //     in View (at createAnimatedComponent.js:240)
    //     in AnimatedComponent(View) (created by Drawer)
    //     in RCTView (at View.js:34)
    //     in View (at createAnimatedComponent.js:240)
    //     in AnimatedComponent(View) (created by PanGestureHandler)
    //     in PanGestureHandler (created by Drawer)
    //     in Drawer (created by DrawerView)
    //     in DrawerView (created by Navigator)
    //     in Navigator (created by SceneView)
    //     in SceneView (created by CardContainer)
    //     in RCTView (at View.js:34)
    //     in View (created by CardContainer)
    //     in RCTView (at View.js:34)
    //     in View (created by CardContainer)
    //     in RCTView (at View.js:34)
    //     in View
    //     in CardSheet (created by Card)
    //     in RCTView (at View.js:34)
    //     in View (at createAnimatedComponent.js:217)
    //     in AnimatedComponent (at createAnimatedComponent.js:278)
    //     in AnimatedComponentWrapper (created by PanGestureHandler)
    //     in PanGestureHandler (created by PanGestureHandler)
    //     in PanGestureHandler (created by Card)
    //     in RCTView (at View.js:34)
    //     in View (at createAnimatedComponent.js:217)
    //     in AnimatedComponent (at createAnimatedComponent.js:278)
    //     in AnimatedComponentWrapper (created by Card)
    //     in RCTView (at View.js:34)
    //     in View (created by Card)
    //     in Card (created by CardContainer)
    //     in CardContainer (created by CardStack)
    //     in RNSScreen (at createAnimatedComponent.js:217)
    //     in AnimatedComponent (at createAnimatedComponent.js:278)
    //     in AnimatedComponentWrapper (at src/index.native.tsx:252)
    //     in MaybeFreeze (at src/index.native.tsx:251)
    //     in Screen (created by MaybeScreen)
    //     in MaybeScreen (created by CardStack)
    //     in RNSScreenContainer (at src/index.native.tsx:330)
    //     in ScreenContainer (created by MaybeScreenContainer)
    //     in MaybeScreenContainer (created by CardStack)
    //     in CardStack
    //     in KeyboardManager
    //     in RNCSafeAreaView (at src/index.tsx:26)
    //     in SafeAreaProvider
    //     in SafeAreaProviderCompat (created by StackView)
    //     in GestureHandlerRootView (at GestureHandlerRootView.android.tsx:26)
    //     in GestureHandlerRootView (created by StackView)
    //     in StackView (created by StackView)
    //     in StackView
    //     in Unknown (created by Navigator)
    //     in Navigator (created by NavigationContainer)
    //     in NavigationContainer (created by SceneView)
    //     in SceneView (created by SwitchView)
    //     in SwitchView (created by Navigator)
    //     in Navigator (created by NavigationContainer)
    //     in NavigationContainer (at navigation/index.js:36)
    //     in Provider (at navigation/index.js:35)
    //     in App (at renderApplication.js:47)
    //     in RCTView (at View.js:34)
    //     in View (at AppContainer.js:107)
    //     in RCTView (at View.js:34)
    //     in View (at AppContainer.js:134)
    //     in AppContainer (at renderApplication.js:40)`
    // '`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.',
    // '`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.',
    // '[fuego-swr-keys-from-collection-path]',
    // 'Setting a timer for a long period of time',
    // 'ViewPropTypes will be removed from React Native',
    // 'ReactImageView: Image source "null" doesn\'t exist',
    // 'AsyncStorage has been extracted from react-native',
    // 'new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method',
    // "exported from 'deprecated-react-native-prop-types'.",
    // "Clipboard has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-clipboard/clipboard' instead of 'react-native'. See https://github.com/react-native-clipboard/clipboard",
    // 'Non-serializable values were found in the navigation state.',
    // 'VirtualizedLists should never be nested inside plain ScrollViews',
  ];

  const warn = console.warn;
  console.warn = (...arg) => {
    for (const warning of ignoreWarns) {
      if (arg[0].startsWith(warning)) {
        return;
      }
    }
    warn(...arg);
  };
  LogBox.ignoreLogs(ignoreWarns);
  LogBox.ignoreAllLogs();
}