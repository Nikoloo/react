import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchResults, Track, Artist, Album, Playlist } from '../../types';

interface SearchState {
  query: string;
  results: SearchResults | null;
  recentSearches: string[];
  isLoading: boolean;
  error: string | null;
  filters: {
    type: 'all' | 'track' | 'artist' | 'album' | 'playlist';
  };
}

const initialState: SearchState = {
  query: '',
  results: null,
  recentSearches: [],
  isLoading: false,
  error: null,
  filters: {
    type: 'all',
  },
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    setResults: (state, action: PayloadAction<SearchResults | null>) => {
      state.results = action.payload;
    },
    
    clearResults: (state) => {
      state.results = null;
      state.query = '';
      state.error = null;
    },
    
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (query && !state.recentSearches.includes(query)) {
        state.recentSearches.unshift(query);
        // Keep only last 10 searches
        state.recentSearches = state.recentSearches.slice(0, 10);
      }
    },
    
    removeRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentSearches = state.recentSearches.filter(search => search !== action.payload);
    },
    
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    
    setFilter: (state, action: PayloadAction<'all' | 'track' | 'artist' | 'album' | 'playlist'>) => {
      state.filters.type = action.payload;
    },
    
    // Quick search actions for instant results
    addQuickResult: (state, action: PayloadAction<{
      type: 'track' | 'artist' | 'album' | 'playlist';
      item: Track | Artist | Album | Playlist;
    }>) => {
      if (!state.results) {
        state.results = {
          tracks: { items: [], total: 0, limit: 0, offset: 0, next: null, previous: null },
          artists: { items: [], total: 0, limit: 0, offset: 0, next: null, previous: null },
          albums: { items: [], total: 0, limit: 0, offset: 0, next: null, previous: null },
          playlists: { items: [], total: 0, limit: 0, offset: 0, next: null, previous: null },
        };
      }
      
      const { type, item } = action.payload;
      
      switch (type) {
        case 'track':
          state.results.tracks.items.unshift(item as Track);
          state.results.tracks.total += 1;
          break;
        case 'artist':
          state.results.artists.items.unshift(item as Artist);
          state.results.artists.total += 1;
          break;
        case 'album':
          state.results.albums.items.unshift(item as Album);
          state.results.albums.total += 1;
          break;
        case 'playlist':
          state.results.playlists.items.unshift(item as Playlist);
          state.results.playlists.total += 1;
          break;
      }
    },
  },
});

export const {
  setQuery,
  setLoading,
  setError,
  setResults,
  clearResults,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
  setFilter,
  addQuickResult,
} = searchSlice.actions;

export default searchSlice.reducer;