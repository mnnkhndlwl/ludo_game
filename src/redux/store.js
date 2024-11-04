import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import reduxStorage from './storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  PERSIST,
  REGISTER,
  REHYDRATE,
  PAUSE,
  PURGE,
} from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: ['game'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REGISTER, REHYDRATE, PAUSE, PURGE, PERSIST],
      },
    }),
});

export const persistor = persistStore(store);
