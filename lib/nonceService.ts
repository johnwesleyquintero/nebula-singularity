import { createHash } from 'crypto';

interface NonceRecord {
  value: string;
  timestamp: number;
}

class NonceService {
  private static instance: NonceService;
  private nonceStore: Map<string, NonceRecord>;
  private readonly NONCE_LIFETIME_MS = 3600000; // 1 hour
  private readonly CLEANUP_INTERVAL_MS = 300000; // 5 minutes

  private constructor() {
    this.nonceStore = new Map();
    this.startCleanupInterval();
  }

  public static getInstance(): NonceService {
    if (!NonceService.instance) {
      NonceService.instance = new NonceService();
    }
    return NonceService.instance;
  }

  public generateNonce(): string {
    const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64');
    const hashedNonce = this.hashNonce(nonce);
    
    this.nonceStore.set(hashedNonce, {
      value: nonce,
      timestamp: Date.now()
    });

    return nonce;
  }

  public validateNonce(nonce: string): boolean {
    const hashedNonce = this.hashNonce(nonce);
    const record = this.nonceStore.get(hashedNonce);

    if (!record) return false;

    const isValid = Date.now() - record.timestamp <= this.NONCE_LIFETIME_MS;
    if (!isValid) {
      this.nonceStore.delete(hashedNonce);
    }

    return isValid;
  }

  private hashNonce(nonce: string): string {
    return createHash('sha256').update(nonce).digest('hex');
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, record] of this.nonceStore.entries()) {
        if (now - record.timestamp > this.NONCE_LIFETIME_MS) {
          this.nonceStore.delete(key);
        }
      }
    }, this.CLEANUP_INTERVAL_MS);
  }
}

export const nonceService = NonceService.getInstance();