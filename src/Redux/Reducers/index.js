import { combineReducers, applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import reducer from '../Reducers/Reducers'
import initialState from '../Reducers/initialState';

export default configureStore = () => {

    const store = createStore(
        combineReducers({
            reducer
        }),
        applyMiddleware(thunk)
    )
    return store;
}