import { persistReducer, persistStore } from 'redux-persist'

import { configureStore } from '@reduxjs/toolkit'
import customizerReducer from './slices/customizer'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage
}
export const store = configureStore({
  reducer: {
    customizer: persistReducer(persistConfig, customizerReducer)
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false, immutableCheck: false })
})

export const persistor = persistStore(store)
