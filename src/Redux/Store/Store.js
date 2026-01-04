import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '../Reducers/index';
import Home from '../../screens/Home'
import Navigator from '../../navigation/index';

export default class Store extends Component {
    render() {
        return (
            <Provider store={store}>
                <Navigator />
            </Provider>
        )
    };
}