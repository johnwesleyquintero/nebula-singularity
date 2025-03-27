import { ENV_CONFIG } from '@/config/env'
import { errorHandlingService } from './error-handling'

type AuthTokens = {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

type MarketplaceCredentials = {
  sellerId: string
  marketplaceId: string
  accessKey: string
  secretKey: string
}

class AuthService {
  private static instance: AuthService
  private tokens: AuthTokens | null = null
  private credentials: MarketplaceCredentials | null = null

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async authenticate(credentials: MarketplaceCredentials): Promise<boolean> {
    try {
      const response = await fetch(`${ENV_CONFIG.MARKETPLACE_API.BASE_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        throw new Error('Authentication failed')
      }

      const tokens: AuthTokens = await response.json()
      this.tokens = tokens
      this.credentials = credentials

      // Set token refresh timer
      this.scheduleTokenRefresh()

      return true
    } catch (error) {
      errorHandlingService.handleMarketplaceError(error)
      return false
    }
  }

  private scheduleTokenRefresh(): void {
    if (!this.tokens) return

    // Schedule refresh 5 minutes before expiration
    const refreshTime = (this.tokens.expiresIn - 300) * 1000
    setTimeout(() => this.refreshToken(), refreshTime)
  }

  private async refreshToken(): Promise<void> {
    if (!this.tokens?.refreshToken) return

    try {
      const response = await fetch(`${ENV_CONFIG.MARKETPLACE_API.BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.tokens.refreshToken }),
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const newTokens: AuthTokens = await response.json()
      this.tokens = newTokens

      // Schedule next refresh
      this.scheduleTokenRefresh()
    } catch (error) {
      errorHandlingService.handleMarketplaceError(error)
      // Force re-authentication
      this.logout()
    }
  }

  getAccessToken(): string | null {
    return this.tokens?.accessToken || null
  }

  isAuthenticated(): boolean {
    return !!this.tokens?.accessToken
  }

  getMarketplaceCredentials(): MarketplaceCredentials | null {
    return this.credentials
  }

  logout(): void {
    this.tokens = null
    this.credentials = null
  }
}

export const authService = AuthService.getInstance()