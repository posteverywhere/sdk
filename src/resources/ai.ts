import type { HttpClient } from '../client';
import type { GenerateImageParams, GenerateImageResponse } from '../types';

export class AI {
  constructor(private client: HttpClient) {}

  /** Generate an image from a text prompt */
  async generateImage(params: GenerateImageParams): Promise<GenerateImageResponse> {
    return this.client.post('/api/v1/ai/generate-image', params);
  }
}
