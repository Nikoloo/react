// Core Types
export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  duration_ms: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  uri: string;
  is_liked?: boolean;
  is_playing?: boolean;
}

export interface Artist {
  id: string;
  name: string;
  images: Image[];
  genres: string[];
  followers: {
    total: number;
  };
  external_urls: {
    spotify: string;
  };
  uri: string;
}

export interface Album {
  id: string;
  name: string;
  artists: Artist[];
  images: Image[];
  release_date: string;
  total_tracks: number;
  external_urls: {
    spotify: string;
  };
  uri: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  images: Image[];
  owner: User;
  tracks: {
    total: number;
    items: PlaylistTrack[];
  };
  public: boolean;
  collaborative: boolean;
  external_urls: {
    spotify: string;
  };
  uri: string;
}

export interface PlaylistTrack {
  added_at: string;
  track: Track;
}

export interface User {
  id: string;
  display_name: string;
  email: string;
  images: Image[];
  followers: {
    total: number;
  };
  country: string;
  product: string;
  external_urls: {
    spotify: string;
  };
}

export interface Image {
  url: string;
  height: number | null;
  width: number | null;
}

// Player State Types
export interface PlayerState {
  is_playing: boolean;
  progress_ms: number;
  item: Track | null;
  shuffle_state: boolean;
  repeat_state: 'off' | 'context' | 'track';
  context: {
    type: 'album' | 'playlist' | 'artist';
    uri: string;
  } | null;
  device: Device;
  volume_percent: number;
}

export interface Device {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

// UI State Types
export interface UIState {
  isLibraryCollapsed: boolean;
  currentTheme: 'dark' | 'light';
  isPlaying: boolean;
  volume: number;
  isShuffled: boolean;
  repeatMode: 'off' | 'context' | 'track';
  currentView: 'discovery' | 'library' | 'search' | 'player';
}

// API Response Types
export interface SpotifyApiResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

export interface SearchResults {
  tracks: SpotifyApiResponse<Track>;
  artists: SpotifyApiResponse<Artist>;
  albums: SpotifyApiResponse<Album>;
  playlists: SpotifyApiResponse<Playlist>;
}

// Auth Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export interface CardProps {
  variant?: 'default' | 'glass' | 'elevated' | 'gradient';
  hover?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export interface TrackItemProps {
  track: Track;
  index?: number;
  isPlaying?: boolean;
  onPlay: (track: Track) => void;
  onLike?: (track: Track) => void;
  onAddToPlaylist?: (track: Track) => void;
  showAlbum?: boolean;
  showArtist?: boolean;
  showDuration?: boolean;
}

// Virtual Scrolling Types
export interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

// Error Types
export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

// Mock Data Types
export interface MockConfig {
  enabled: boolean;
  scenario: 'happy' | 'error' | 'slow' | 'offline';
  delay?: number;
  errorRate?: number;
}

// Service Types
export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  strategy: 'token-bucket' | 'sliding-window';
}

// Theme Types
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  animations: {
    fast: string;
    medium: string;
    slow: string;
  };
}