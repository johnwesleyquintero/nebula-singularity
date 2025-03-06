import { supabase } from './supabaseClient';
import * as Sentry from '@sentry/nextjs';
import { AppError } from './errorHandling';

interface SyncConfig {
  marketplaceId: string;
  refreshInterval: number;
  dataTypes: Array<'inventory' | 'pricing' | 'orders' | 'advertising'>;
}

interface SyncStatus {
  lastSync: Date;
  status: 'success' | 'error' | 'in_progress';
  error?: string;
}

class AmazonSyncService {
  private syncInterval: NodeJS.Timeout | null = null;
  private syncConfig: SyncConfig;
  private syncStatus: Record<string, SyncStatus> = {};

  constructor(config: SyncConfig) {
    this.syncConfig = config;
  }

  async startSync() {
    try {
      // Initialize sync status
      this.syncStatus[this.syncConfig.marketplaceId] = {
        lastSync: new Date(),
        status: 'in_progress'
      };

      // Start periodic sync
      this.syncInterval = setInterval(
        () => this.syncData(),
        this.syncConfig.refreshInterval
      );

      await this.syncData(); // Initial sync
    } catch (error) {
      this.handleSyncError(error);
    }
  }

  private async syncData() {
    try {
      for (const dataType of this.syncConfig.dataTypes) {
        await this.syncDataType(dataType);
      }

      this.updateSyncStatus('success');
    } catch (error) {
      this.handleSyncError(error);
    }
  }

  private async syncDataType(dataType: SyncConfig['dataTypes'][0]) {
    try {
      // Fetch data from Amazon SP-API
      const data = await this.fetchFromAmazon(dataType);

      // Store in Supabase
      await this.storeData(dataType, data);

      // Emit real-time updates
      await this.emitUpdate(dataType, data);
    } catch (error) {
      throw new AppError(
        `Failed to sync ${dataType}`,
        500,
        { dataType, error },
        'SYNC_ERROR'
      );
    }
  }

  private async fetchFromAmazon(dataType: string) {
    // TODO: Implement SP-API calls
    return [];
  }

  private async storeData(dataType: string, data: any) {
    try {
      const { error } = await supabase
        .from(`amazon_${dataType}`)
        .upsert(data);

      if (error) throw error;
    } catch (error) {
      throw new AppError(
        `Failed to store ${dataType} data`,
        500,
        { dataType, error },
        'DATABASE_ERROR'
      );
    }
  }

  private async emitUpdate(dataType: string, data: any) {
    try {
      await supabase
        .from('sync_updates')
        .insert({
          marketplace_id: this.syncConfig.marketplaceId,
          data_type: dataType,
          data: data
        });
    } catch (error) {
      Sentry.captureException(error);
      console.error('Failed to emit update:', error);
    }
  }

  private updateSyncStatus(status: SyncStatus['status'], error?: string) {
    this.syncStatus[this.syncConfig.marketplaceId] = {
      lastSync: new Date(),
      status,
      ...(error && { error })
    };
  }

  private handleSyncError(error: unknown) {
    Sentry.captureException(error);
    this.updateSyncStatus('error', error instanceof Error ? error.message : 'Unknown error');
  }

  stopSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  getSyncStatus(): SyncStatus {
    return this.syncStatus[this.syncConfig.marketplaceId];
  }
}

export default AmazonSyncService;