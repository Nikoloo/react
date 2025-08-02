import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Track } from '../../types';

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  queue: Track[];
  history: Track[];
  shuffle: boolean;
  repeat: 'off' | 'context' | 'track';
  device: string | null;
}

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  progress: 0,
  duration: 0,
  queue: [],
  history: [],
  shuffle: false,
  repeat: 'off',
  device: null,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<Track | null>) => {
      state.currentTrack = action.payload;
    },
    
    play: (state) => {
      state.isPlaying = true;
    },
    
    pause: (state) => {
      state.isPlaying = false;
    },
    
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.max(0, Math.min(1, action.payload));
    },
    
    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    
    addToQueue: (state, action: PayloadAction<Track>) => {
      state.queue.push(action.payload);
    },
    
    removeFromQueue: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter(track => track.id !== action.payload);
    },
    
    clearQueue: (state) => {
      state.queue = [];
    },
    
    nextTrack: (state) => {
      if (state.queue.length > 0) {
        if (state.currentTrack) {
          state.history.push(state.currentTrack);
        }
        state.currentTrack = state.queue.shift() || null;
        state.progress = 0;
      }
    },
    
    previousTrack: (state) => {
      if (state.history.length > 0) {
        if (state.currentTrack) {
          state.queue.unshift(state.currentTrack);
        }
        state.currentTrack = state.history.pop() || null;
        state.progress = 0;
      }
    },
    
    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
    },
    
    toggleRepeat: (state) => {
      const modes: Array<'off' | 'context' | 'track'> = ['off', 'context', 'track'];
      const currentIndex = modes.indexOf(state.repeat);
      const nextIndex = (currentIndex + 1) % modes.length;
      state.repeat = modes[nextIndex];
    },
    
    setDevice: (state, action: PayloadAction<string | null>) => {
      state.device = action.payload;
    },
  },
});

export const {
  setCurrentTrack,
  play,
  pause,
  togglePlayPause,
  setVolume,
  setProgress,
  setDuration,
  addToQueue,
  removeFromQueue,
  clearQueue,
  nextTrack,
  previousTrack,
  toggleShuffle,
  toggleRepeat,
  setDevice,
} = playerSlice.actions;

export default playerSlice.reducer;