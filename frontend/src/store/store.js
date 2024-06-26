// Documentation/frontend/store/store.js

import { createStore, combineReducers } from 'redux';
import pagesReducer from './pagesReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
    pages: pagesReducer,
    user: userReducer,
    // Другие редьюсеры
});

const store = createStore(rootReducer);

export default store;
