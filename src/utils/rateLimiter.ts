/**
 * Rate limiter for API requests
 * Implements token bucket algorithm to respect API rate limits
 */

export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number; // tokens per second
  private readonly queue: Array<() => void> = [];

  /**
   * Create a new rate limiter
   * @param maxRequests Maximum requests per second
   */
  constructor(maxRequests: number = 20) {
    this.maxTokens = maxRequests;
    this.refillRate = maxRequests;
    this.tokens = maxRequests;
    this.lastRefill = Date.now();
  }

  /**
   * Refill tokens based on time elapsed
   */
  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000; // convert to seconds
    const tokensToAdd = elapsed * this.refillRate;
    
    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  /**
   * Wait until a token is available
   */
  private async waitForToken(): Promise<void> {
    return new Promise((resolve) => {
      const tryAcquire = () => {
        this.refill();
        
        if (this.tokens >= 1) {
          this.tokens -= 1;
          resolve();
        } else {
          // Calculate wait time until next token is available
          const waitTime = (1 - this.tokens) / this.refillRate * 1000;
          setTimeout(tryAcquire, Math.max(10, waitTime));
        }
      };
      
      tryAcquire();
    });
  }

  /**
   * Execute a function with rate limiting
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    await this.waitForToken();
    return fn();
  }

  /**
   * Reset the rate limiter
   */
  reset(): void {
    this.tokens = this.maxTokens;
    this.lastRefill = Date.now();
    this.queue.length = 0;
  }
}

// Global rate limiter instance for InControl2 API (20 requests/second)
export const ic2RateLimiter = new RateLimiter(20);
