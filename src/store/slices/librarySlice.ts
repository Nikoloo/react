import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Track, Playlist, Album, Artist } from '../../types';

interface LibraryState {
  likedTracks: Track[];
  playlists: Playlist[];
  albums: Album[];
  artists: Artist[];
  recentlyPlayed: Track[];
  isLoading: boolean;
  error: string | null;
}

const initialState: LibraryState = {
  likedTracks: [],
  playlists: [],
  albums: [],
  artists: [],
  recentlyPlayed: [],
  isLoading: false,
  error: null,
};

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Liked tracks
    addLikedTrack: (state, action: PayloadAction<Track>) => {
      if (!state.likedTracks.find(track => track.id === action.payload.id)) {
        state.likedTracks.unshift(action.payload);
      }
    },
    
    removeLikedTrack: (state, action: PayloadAction<string>) => {
      state.likedTracks = state.likedTracks.filter(track => track.id !== action.payload);
    },
    
    setLikedTracks: (state, action: PayloadAction<Track[]>) => {
      state.likedTracks = action.payload;
    },
    
    // Playlists
    addPlaylist: (state, action: PayloadAction<Playlist>) => {
      state.playlists.unshift(action.payload);
    },
    
    removePlaylist: (state, action: PayloadAction<string>) => {
      state.playlists = state.playlists.filter(playlist => playlist.id !== action.payload);
    },
    
    updatePlaylist: (state, action: PayloadAction<Playlist>) => {
      const index = state.playlists.findIndex(playlist => playlist.id === action.payload.id);
      if (index !== -1) {
        state.playlists[index] = action.payload;
      }
    },
    
    setPlaylists: (state, action: PayloadAction<Playlist[]>) => {
      state.playlists = action.payload;
    },
    
    // Albums
    addAlbum: (state, action: PayloadAction<Album>) => {
      if (!state.albums.find(album => album.id === action.payload.id)) {
        state.albums.unshift(action.payload);
      }
    },
    
    removeAlbum: (state, action: PayloadAction<string>) => {
      state.albums = state.albums.filter(album => album.id !== action.payload);
    },
    
    setAlbums: (state, action: PayloadAction<Album[]>) => {
      state.albums = action.payload;
    },
    
    // Artists
    followArtist: (state, action: PayloadAction<Artist>) => {
      if (!state.artists.find(artist => artist.id === action.payload.id)) {
        state.artists.unshift(action.payload);
      }
    },
    
    unfollowArtist: (state, action: PayloadAction<string>) => {
      state.artists = state.artists.filter(artist => artist.id !== action.payload);
    },
    
    setArtists: (state, action: PayloadAction<Artist[]>) => {
      state.artists = action.payload;
    },
    
    // Recently played
    addToRecentlyPlayed: (state, action: PayloadAction<Track>) => {
      // Remove if already exists
      state.recentlyPlayed = state.recentlyPlayed.filter(track => track.id !== action.payload.id);
      // Add to beginning
      state.recentlyPlayed.unshift(action.payload);
      // Keep only last 50
      state.recentlyPlayed = state.recentlyPlayed.slice(0, 50);
    },
    
    setRecentlyPlayed: (state, action: PayloadAction<Track[]>) => {
      state.recentlyPlayed = action.payload;
    },
    
    clearRecentlyPlayed: (state) => {
      state.recentlyPlayed = [];
    },
  },
});

export const {
  setLoading,
  setError,
  addLikedTrack,
  removeLikedTrack,
  setLikedTracks,
  addPlaylist,
  removePlaylist,
  updatePlaylist,
  setPlaylists,
  addAlbum,
  removeAlbum,
  setAlbums,
  followArtist,
  unfollowArtist,
  setArtists,
  addToRecentlyPlayed,
  setRecentlyPlayed,
  clearRecentlyPlayed,
} = librarySlice.actions;

export default librarySlice.reducer;