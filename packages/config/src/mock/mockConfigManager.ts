// Mock configuration manager with multiple storage backends
export enum ConfigStorage {
  MEMORY = 'memory',
  FILE = 'file',
  DATABASE = 'database',
  CLOUD = 'cloud'
}

export interface ConfigEntry {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description?: string;
  category?: string;
  isSecret: boolean;
  isRequired: boolean;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: any[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface MockConfigManagerConfig {
  storage: ConfigStorage;
  environment: string;
  enableValidation: boolean;
  enableCaching: boolean;
  cacheTimeout: number;
}

export class MockConfigManager {
  private config: MockConfigManagerConfig;
  private configs: Map<string, ConfigEntry> = new Map();
  private cache: Map<string, { value: any; timestamp: number }> = new Map();
  private watchers: Map<string, ((value: any) => void)[]> = new Map();

  constructor(config: Partial<MockConfigManagerConfig> = {}) {
    this.config = {
      storage: ConfigStorage.MEMORY,
      environment: process.env.NODE_ENV || 'development',
      enableValidation: true,
      enableCaching: true,
      cacheTimeout: 300000, // 5 minutes
      ...config
    };

    this.initializeDefaultConfigs();
  }

  private initializeDefaultConfigs(): void {
    const defaultConfigs: ConfigEntry[] = [
      {
        key: 'app.name',
        value: 'Siriux Application',
        type: 'string',
        description: 'Application name',
        category: 'app',
        isSecret: false,
        isRequired: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        key: 'app.version',
        value: '1.0.0',
        type: 'string',
        description: 'Application version',
        category: 'app',
        isSecret: false,
        isRequired: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        key: 'database.url',
        value: 'sqlite:memory:',
        type: 'string',
        description: 'Database connection URL',
        category: 'database',
        isSecret: true,
        isRequired: true,
        validation: {
          pattern: '^(sqlite|mysql|postgresql|snowflake):.+'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        key: 'auth.jwt.expiry',
        value: '24h',
        type: 'string',
        description: 'JWT token expiry time',
        category: 'auth',
        isSecret: false,
        isRequired: true,
        validation: {
          options: ['1h', '24h', '7d', '30d']
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        key: 'logging.level',
        value: 'info',
        type: 'string',
        description: 'Logging level',
        category: 'logging',
        isSecret: false,
        isRequired: true,
        validation: {
          options: ['debug', 'info', 'warn', 'error']
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        key: 'api.rateLimit',
        value: 100,
        type: 'number',
        description: 'API rate limit per minute',
        category: 'api',
        isSecret: false,
        isRequired: true,
        validation: {
          min: 1,
          max: 10000
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        key: 'features.enableAnalytics',
        value: true,
        type: 'boolean',
        description: 'Enable analytics tracking',
        category: 'features',
        isSecret: false,
        isRequired: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    defaultConfigs.forEach(config => {
      this.configs.set(config.key, config);
    });
  }

  private validateConfig(entry: ConfigEntry, value: any): boolean {
    if (!this.config.enableValidation || !entry.validation) {
      return true;
    }

    const { validation } = entry;

    // Type validation
    if (entry.type === 'number' && typeof value !== 'number') {
      return false;
    }
    if (entry.type === 'boolean' && typeof value !== 'boolean') {
      return false;
    }
    if (entry.type === 'string' && typeof value !== 'string') {
      return false;
    }

    // Range validation
    if (validation.min !== undefined && value < validation.min) {
      return false;
    }
    if (validation.max !== undefined && value > validation.max) {
      return false;
    }

    // Pattern validation
    if (validation.pattern && typeof value === 'string') {
      const regex = new RegExp(validation.pattern);
      if (!regex.test(value)) {
        return false;
      }
    }

    // Options validation
    if (validation.options && !validation.options.includes(value)) {
      return false;
    }

    return true;
  }

  private async writeToStorage(entry: ConfigEntry): Promise<void> {
    switch (this.config.storage) {
      case ConfigStorage.MEMORY:
        // Already stored in memory
        break;
      case ConfigStorage.FILE:
        console.log(`📁 Writing config to file: ${entry.key}`);
        break;
      case ConfigStorage.DATABASE:
        console.log(`🗄️  Writing config to database: ${entry.key}`);
        break;
      case ConfigStorage.CLOUD:
        console.log(`☁️  Writing config to cloud: ${entry.key}`);
        break;
    }
  }

  private async readFromStorage(key: string): Promise<ConfigEntry | null> {
    switch (this.config.storage) {
      case ConfigStorage.MEMORY:
        return this.configs.get(key) || null;
      case ConfigStorage.FILE:
        console.log(`📁 Reading config from file: ${key}`);
        return this.configs.get(key) || null;
      case ConfigStorage.DATABASE:
        console.log(`🗄️  Reading config from database: ${key}`);
        return this.configs.get(key) || null;
      case ConfigStorage.CLOUD:
        console.log(`☁️  Reading config from cloud: ${key}`);
        return this.configs.get(key) || null;
      default:
        return null;
    }
  }

  // Public API methods
  async get(key: string): Promise<any> {
    // Check cache first
    if (this.config.enableCaching) {
      const cached = this.cache.get(key);
      if (cached && Date.now() - cached.timestamp < this.config.cacheTimeout) {
        return cached.value;
      }
    }

    const entry = await this.readFromStorage(key);
    if (!entry) {
      throw new Error(`Configuration key not found: ${key}`);
    }

    // Update cache
    if (this.config.enableCaching) {
      this.cache.set(key, {
        value: entry.value,
        timestamp: Date.now()
      });
    }

    return entry.value;
  }

  async set(key: string, value: any): Promise<void> {
    const entry = await this.readFromStorage(key);
    
    if (!entry) {
      throw new Error(`Configuration key not found: ${key}`);
    }

    // Validate value
    if (!this.validateConfig(entry, value)) {
      throw new Error(`Invalid value for configuration key: ${key}`);
    }

    // Update entry
    const updatedEntry: ConfigEntry = {
      ...entry,
      value,
      updatedAt: new Date().toISOString()
    };

    this.configs.set(key, updatedEntry);
    await this.writeToStorage(updatedEntry);

    // Update cache
    if (this.config.enableCaching) {
      this.cache.set(key, {
        value,
        timestamp: Date.now()
      });
    }

    // Notify watchers
    const watchers = this.watchers.get(key) || [];
    watchers.forEach(callback => callback(value));
  }

  async getAll(): Promise<Record<string, any>> {
    const result: Record<string, any> = {};
    
    for (const [key, entry] of this.configs) {
      result[key] = entry.value;
    }
    
    return result;
  }

  async getByCategory(category: string): Promise<Record<string, any>> {
    const result: Record<string, any> = {};
    
    for (const [key, entry] of this.configs) {
      if (entry.category === category) {
        result[key] = entry.value;
      }
    }
    
    return result;
  }

  async getSecrets(): Promise<Record<string, string>> {
    const result: Record<string, string> = {};
    
    for (const [key, entry] of this.configs) {
      if (entry.isSecret) {
        result[key] = entry.value;
      }
    }
    
    return result;
  }

  // Configuration management
  async addConfig(entry: Omit<ConfigEntry, 'createdAt' | 'updatedAt'>): Promise<void> {
    const newEntry: ConfigEntry = {
      ...entry,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.configs.set(entry.key, newEntry);
    await this.writeToStorage(newEntry);
  }

  async removeConfig(key: string): Promise<void> {
    const entry = this.configs.get(key);
    if (!entry) {
      throw new Error(`Configuration key not found: ${key}`);
    }

    if (entry.isRequired) {
      throw new Error(`Cannot remove required configuration: ${key}`);
    }

    this.configs.delete(key);
    this.cache.delete(key);
  }

  // Watchers
  watch(key: string, callback: (value: any) => void): () => void {
    const watchers = this.watchers.get(key) || [];
    watchers.push(callback);
    this.watchers.set(key, watchers);

    // Return unwatch function
    return () => {
      const currentWatchers = this.watchers.get(key) || [];
      const index = currentWatchers.indexOf(callback);
      if (index > -1) {
        currentWatchers.splice(index, 1);
        this.watchers.set(key, currentWatchers);
      }
    };
  }

  // Utility methods
  async validateAll(): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    for (const [key, entry] of this.configs) {
      if (!this.validateConfig(entry, entry.value)) {
        errors.push(`Invalid value for ${key}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  async export(): Promise<ConfigEntry[]> {
    return Array.from(this.configs.values());
  }

  async import(configs: ConfigEntry[]): Promise<void> {
    for (const config of configs) {
      this.configs.set(config.key, config);
      await this.writeToStorage(config);
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  getStats(): {
    totalConfigs: number;
    configsByCategory: Record<string, number>;
    secretsCount: number;
    cacheSize: number;
  } {
    const configsByCategory: Record<string, number> = {};
    let secretsCount = 0;

    for (const entry of this.configs.values()) {
      configsByCategory[entry.category || 'other'] = (configsByCategory[entry.category || 'other'] || 0) + 1;
      if (entry.isSecret) secretsCount++;
    }

    return {
      totalConfigs: this.configs.size,
      configsByCategory,
      secretsCount,
      cacheSize: this.cache.size
    };
  }
}

// Factory function
export const createMockConfigManager = (config?: Partial<MockConfigManagerConfig>): MockConfigManager => {
  return new MockConfigManager(config);
};

// Environment-based config manager
export const createEnvironmentConfigManager = (): MockConfigManager => {
  const config: Partial<MockConfigManagerConfig> = {
    storage: (process.env.CONFIG_STORAGE as ConfigStorage) || ConfigStorage.MEMORY,
    environment: process.env.NODE_ENV || 'development',
    enableValidation: process.env.CONFIG_VALIDATION !== 'false',
    enableCaching: process.env.CONFIG_CACHING !== 'false'
  };

  return new MockConfigManager(config);
};
