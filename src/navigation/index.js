import React from 'react';
//Navigators
import {PaperProvider} from 'react-native-paper';
//Store
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducer from '../Redux/Reducers/Reducers';
//Library
import Orientation from 'react-native-orientation';
import RootNavigation from './RootNavigation';
import {notificationListener, requestUserPermission} from '../components/Firebase';


console.disableYellowBox = true;

const Store = createStore(reducer);
const config = {
  dependencies: {
    'linear-gradient': require('react-native-linear-gradient').default,
  },
};

class App extends React.Component {
  componentDidMount = () => {
    Orientation.lockToPortrait();
    requestUserPermission();
    notificationListener();
  };

  render() {
    return (
      <Provider store={Store}>
        <PaperProvider>
          <RootNavigation />
        </PaperProvider>
      </Provider>
    );
  }
}

export default App;
