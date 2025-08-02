import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Define base query with auth
const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Create API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Track', 'Playlist', 'Album', 'Artist'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    // User endpoints
    getCurrentUser: builder.query({
      query: () => '/me',
      providesTags: ['User'],
    }),
    
    // Search endpoints
    search: builder.query({
      query: ({ q, type = 'track,artist,album,playlist', limit = 20 }) => 
        `/search?q=${encodeURIComponent(q)}&type=${type}&limit=${limit}`,
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),
    
    // Track endpoints
    getTrack: builder.query({
      query: (id) => `/tracks/${id}`,
      providesTags: (result, error, id) => [{ type: 'Track', id }],
    }),
    
    // Playlist endpoints
    getUserPlaylists: builder.query({
      query: () => '/me/playlists',
      providesTags: ['Playlist'],
    }),
    
    createPlaylist: builder.mutation({
      query: ({ name, description, public: isPublic = false }) => ({
        url: '/me/playlists',
        method: 'POST',
        body: { name, description, public: isPublic },
      }),
      invalidatesTags: ['Playlist'],
    }),
    
    // Library endpoints
    getLikedTracks: builder.query({
      query: ({ limit = 50, offset = 0 } = {}) => 
        `/me/tracks?limit=${limit}&offset=${offset}`,
      providesTags: ['Track'],
    }),
    
    saveTracks: builder.mutation({
      query: (trackIds) => ({
        url: '/me/tracks',
        method: 'PUT',
        body: { ids: trackIds },
      }),
      invalidatesTags: ['Track'],
    }),
    
    removeTracks: builder.mutation({
      query: (trackIds) => ({
        url: '/me/tracks',
        method: 'DELETE',
        body: { ids: trackIds },
      }),
      invalidatesTags: ['Track'],
    }),
  }),
});

// Export hooks
export const {
  useLoginMutation,
  useGetCurrentUserQuery,
  useSearchQuery,
  useLazySearchQuery,
  useGetTrackQuery,
  useGetUserPlaylistsQuery,
  useCreatePlaylistMutation,
  useGetLikedTracksQuery,
  useSaveTracksMutation,
  useRemoveTracksMutation,
} = apiSlice;