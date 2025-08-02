import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

// Import slices
import authSlice from './slices/authSlice';
import playerSlice from './slices/playerSlice';
import uiSlice from './slices/uiSlice';
import librarySlice from './slices/librarySlice';
import searchSlice from './slices/searchSlice';

// API slice
import { apiSlice } from './api/apiSlice';

// Persist configuration
const persistConfig = {
  key: 'spotify-webapp',
  storage,
  whitelist: ['auth', 'ui', 'library'], // Only persist these slices
  blacklist: ['player', 'search'], // Don't persist real-time data
};

// Root reducer
const rootReducer = combineReducers({
  auth: authSlice,
  player: playerSlice,
  ui: uiSlice,
  library: librarySlice,
  search: searchSlice,
  api: apiSlice.reducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with optimized defaults
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register'],
      },
      immutableCheck: {
        warnAfter: 128,
      },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Auth selectors
export const selectAuthState = (state: RootState) => state.auth;
export const selectUser = createSelector(
  [selectAuthState],
  (auth) => auth.user
);
export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (auth) => auth.isAuthenticated
);

// Player selectors
export const selectPlayerState = (state: RootState) => state.player;
export const selectCurrentTrack = createSelector(
  [selectPlayerState],
  (player) => player.currentTrack
);
export const selectIsPlaying = createSelector(
  [selectPlayerState],
  (player) => player.isPlaying
);
export const selectVolume = createSelector(
  [selectPlayerState],
  (player) => player.volume
);

// UI selectors
export const selectUIState = (state: RootState) => state.ui;
export const selectCurrentTheme = createSelector(
  [selectUIState],
  (ui) => ui.theme
);
export const selectIsLibraryCollapsed = createSelector(
  [selectUIState],
  (ui) => ui.isLibraryCollapsed
);

// Library selectors
export const selectLibraryState = (state: RootState) => state.library;
export const selectLikedTracks = createSelector(
  [selectLibraryState],
  (library) => library.likedTracks
);
export const selectPlaylists = createSelector(
  [selectLibraryState],
  (library) => library.playlists
);

// Search selectors
export const selectSearchState = (state: RootState) => state.search;
export const selectSearchResults = createSelector(
  [selectSearchState],
  (search) => search.results
);
export const selectSearchQuery = createSelector(
  [selectSearchState],
  (search) => search.query
);

// Performance monitoring (development only)
if (process.env.NODE_ENV === 'development') {
  let renderCount = 0;

  store.subscribe(() => {
    renderCount++;
    
    if (renderCount % 100 === 0) {
      console.log(`Store updates: ${renderCount}`);
    }
  });
}