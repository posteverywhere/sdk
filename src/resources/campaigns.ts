import type { HttpClient } from '../client';
import type { Campaign, ListCampaignsParams, ListCampaignsResponse, CreateCampaignParams, UpdateCampaignParams } from '../types';

/**
 * Campaigns — group related posts under named campaigns.
 */
export class Campaigns {
  constructor(private client: HttpClient) {}

  /** List campaigns in the workspace. */
  async list(params?: ListCampaignsParams): Promise<ListCampaignsResponse> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.limit !== undefined) query.set('limit', String(params.limit));
    if (params?.offset !== undefined) query.set('offset', String(params.offset));
    const qs = query.toString();
    return this.client.get(`/api/v1/campaigns${qs ? `?${qs}` : ''}`);
  }

  /** Get a single campaign by id. */
  async get(id: number): Promise<Campaign> {
    return this.client.get(`/api/v1/campaigns/${id}`);
  }

  /** Create a new campaign. */
  async create(params: CreateCampaignParams): Promise<Campaign> {
    return this.client.post('/api/v1/campaigns', params);
  }

  /** Update an existing campaign (name/description/color/status). */
  async update(id: number, params: UpdateCampaignParams): Promise<Campaign> {
    return this.client.patch(`/api/v1/campaigns/${id}`, params);
  }

  /** Delete a campaign. Posts that referenced it have their `campaign_id` set to NULL. */
  async delete(id: number): Promise<{ id: number; deleted: boolean }> {
    return this.client.delete(`/api/v1/campaigns/${id}`);
  }
}
