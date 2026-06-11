import type { HttpClient } from '../client';
import type { AnalyticsSummaryParams, AnalyticsSummaryResponse } from '../types';

/**
 * Analytics — aggregate metrics for the workspace.
 */
export class Analytics {
  constructor(private client: HttpClient) {}

  /** Get an aggregated summary over a time window. */
  async summary(params?: AnalyticsSummaryParams): Promise<AnalyticsSummaryResponse> {
    const query = new URLSearchParams();
    if (params?.period) query.set('period', params.period);
    if (params?.from) query.set('from', params.from);
    if (params?.to) query.set('to', params.to);
    const qs = query.toString();
    return this.client.get(`/api/v1/analytics/summary${qs ? `?${qs}` : ''}`);
  }
}
