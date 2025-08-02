// Spotify OAuth 2.0 with PKCE implementation

interface SpotifyAuthConfig {
  clientId: string;
  redirectUri: string;
  scopes: string[];
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

class SpotifyAuthService {
  private clientId: string;
  private redirectUri: string;
  private scopes: string[];
  private codeVerifier: string = '';

  constructor(config: SpotifyAuthConfig) {
    this.clientId = config.clientId;
    this.redirectUri = config.redirectUri;
    this.scopes = config.scopes;
  }

  /**
   * Generate code verifier for PKCE
   */
  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, Array.from(array)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * Generate code challenge from verifier
   */
  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * Start OAuth flow - redirect to Spotify
   */
  async initiateAuth(): Promise<void> {
    // Generate PKCE parameters
    this.codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(this.codeVerifier);

    // Store code verifier for later use
    localStorage.setItem('spotify_code_verifier', this.codeVerifier);

    // Build authorization URL
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      scope: this.scopes.join(' '),
      state: this.generateState(),
    });

    const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
    
    // Redirect to Spotify
    window.location.href = authUrl;
  }

  /**
   * Generate random state for security
   */
  private generateState(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    const state = btoa(String.fromCharCode.apply(null, Array.from(array)));
    localStorage.setItem('spotify_auth_state', state);
    return state;
  }

  /**
   * Handle OAuth callback and exchange code for token
   */
  async handleCallback(code: string, state: string): Promise<TokenResponse> {
    // Verify state parameter
    const storedState = localStorage.getItem('spotify_auth_state');
    if (state !== storedState) {
      throw new Error('Invalid state parameter');
    }

    // Get stored code verifier
    const codeVerifier = localStorage.getItem('spotify_code_verifier');
    if (!codeVerifier) {
      throw new Error('Code verifier not found');
    }

    // Exchange code for token
    const tokenData = await this.exchangeCodeForToken(code, codeVerifier);

    // Clean up stored values
    localStorage.removeItem('spotify_code_verifier');
    localStorage.removeItem('spotify_auth_state');

    // Store tokens with expiration
    this.storeTokens(tokenData);

    return tokenData;
  }

  /**
   * Exchange authorization code for access token
   */
  private async exchangeCodeForToken(code: string, codeVerifier: string): Promise<TokenResponse> {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri,
        client_id: this.clientId,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Token exchange failed: ${errorData.error_description}`);
    }

    return response.json();
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<TokenResponse> {
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this.clientId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Token refresh failed: ${errorData.error_description}`);
    }

    const tokenData = await response.json();
    this.storeTokens(tokenData);
    return tokenData;
  }

  /**
   * Store tokens with expiration time
   */
  private storeTokens(tokenData: TokenResponse): void {
    const expirationTime = Date.now() + (tokenData.expires_in * 1000);
    
    localStorage.setItem('spotify_access_token', tokenData.access_token);
    localStorage.setItem('spotify_token_expiration', expirationTime.toString());
    
    if (tokenData.refresh_token) {
      localStorage.setItem('spotify_refresh_token', tokenData.refresh_token);
    }
  }

  /**
   * Get current access token, refresh if needed
   */
  async getValidToken(): Promise<string | null> {
    const token = localStorage.getItem('spotify_access_token');
    const expirationTime = localStorage.getItem('spotify_token_expiration');

    if (!token || !expirationTime) {
      return null;
    }

    // Check if token is expired (with 5 minute buffer)
    const isExpired = Date.now() > (parseInt(expirationTime) - 300000);

    if (isExpired) {
      try {
        const newTokenData = await this.refreshToken();
        return newTokenData.access_token;
      } catch (error) {
        console.error('Token refresh failed:', error);
        this.logout();
        return null;
      }
    }

    return token;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('spotify_access_token');
    const expirationTime = localStorage.getItem('spotify_token_expiration');
    
    if (!token || !expirationTime) {
      return false;
    }

    return Date.now() < parseInt(expirationTime);
  }

  /**
   * Get current user from Spotify API
   */
  async getCurrentUser() {
    const token = await this.getValidToken();
    if (!token) {
      throw new Error('No valid token available');
    }

    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user data');
    }

    return response.json();
  }

  /**
   * Logout user and clear tokens
   */
  logout(): void {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiration');
    localStorage.removeItem('spotify_code_verifier');
    localStorage.removeItem('spotify_auth_state');
  }

  /**
   * Parse URL parameters from OAuth callback
   */
  static parseCallback(url: string = window.location.href): { code?: string; state?: string; error?: string } {
    const urlParams = new URLSearchParams(new URL(url).search);
    return {
      code: urlParams.get('code') || undefined,
      state: urlParams.get('state') || undefined,
      error: urlParams.get('error') || undefined,
    };
  }
}

// Default configuration (can be overridden)
const defaultConfig: SpotifyAuthConfig = {
  clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID || '',
  redirectUri: process.env.REACT_APP_SPOTIFY_REDIRECT_URI || `${window.location.origin}/callback`,
  scopes: [
    'user-read-private',
    'user-read-email',
    'user-library-read',
    'user-library-modify',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'playlist-read-private',
    'playlist-modify-private',
    'playlist-modify-public',
    'user-follow-read',
    'user-follow-modify',
    'user-read-recently-played',
    'user-top-read',
  ],
};

// Export singleton instance
export const spotifyAuth = new SpotifyAuthService(defaultConfig);
export default SpotifyAuthService;