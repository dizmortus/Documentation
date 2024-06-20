// Documentation/frontend/store/store.js

import { createStore, combineReducers } from 'redux';
import pagesReducer from './pagesReducer';

const rootReducer = combineReducers({
    pages: pagesReducer,
    // Другие редьюсеры
});

const store = createStore(rootReducer);

export default store;
