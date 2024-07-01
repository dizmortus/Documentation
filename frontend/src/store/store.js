// Documentation/frontend/store/store.js

import { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import pagesReducer from './pagesReducer';
import userReducer from './userReducer';
import commentsReducer from "./commentsReducer";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['pages', 'user'] // сохраняем только эти редьюсеры
};

const rootReducer = combineReducers({
    pages: pagesReducer,
    user: userReducer,
    comments: commentsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };
