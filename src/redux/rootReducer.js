import { combineReducers } from 'redux';
import userReducer from './reducers/userReducer';
import gistsReducer from './reducers/gistsReducer';
import loadReducer from './reducers/loadReducer'

const rootReducer = combineReducers({
    user: userReducer,
    gist: gistsReducer,
    loading: loadReducer
});

export default rootReducer;