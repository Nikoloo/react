import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState } from '../../types';

// Initial state
const initialState: UIState = {
  isLibraryCollapsed: false,
  currentTheme: 'dark',
  isPlaying: false,
  volume: 0.5,
  isShuffled: false,
  repeatMode: 'off',
  currentView: 'discovery',
};

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleLibrary: (state) => {
      state.isLibraryCollapsed = !state.isLibraryCollapsed;
    },
    
    setLibraryCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isLibraryCollapsed = action.payload;
    },
    
    toggleTheme: (state) => {
      state.currentTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
    },
    
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.currentTheme = action.payload;
    },
    
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.max(0, Math.min(1, action.payload));
    },
    
    toggleShuffle: (state) => {
      state.isShuffled = !state.isShuffled;
    },
    
    setShuffle: (state, action: PayloadAction<boolean>) => {
      state.isShuffled = action.payload;
    },
    
    toggleRepeat: (state) => {
      const modes: Array<'off' | 'context' | 'track'> = ['off', 'context', 'track'];
      const currentIndex = modes.indexOf(state.repeatMode);
      const nextIndex = (currentIndex + 1) % modes.length;
      state.repeatMode = modes[nextIndex];
    },
    
    setRepeatMode: (state, action: PayloadAction<'off' | 'context' | 'track'>) => {
      state.repeatMode = action.payload;
    },
    
    setCurrentView: (state, action: PayloadAction<'discovery' | 'library' | 'search' | 'player'>) => {
      state.currentView = action.payload;
    },
    
    // Responsive UI helpers
    collapseLibraryOnMobile: (state) => {
      if (window.innerWidth < 768) {
        state.isLibraryCollapsed = true;
      }
    },
    
    // System theme detection
    setSystemTheme: (state) => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      state.currentTheme = prefersDark ? 'dark' : 'light';
    },
  },
});

export const {
  toggleLibrary,
  setLibraryCollapsed,
  toggleTheme,
  setTheme,
  setVolume,
  toggleShuffle,
  setShuffle,
  toggleRepeat,
  setRepeatMode,
  setCurrentView,
  collapseLibraryOnMobile,
  setSystemTheme,
} = uiSlice.actions;

export default uiSlice.reducer;