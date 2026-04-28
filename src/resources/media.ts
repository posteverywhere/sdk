import type { HttpClient } from '../client';
import type {
  MediaItem,
  ListMediaParams,
  ListMediaResponse,
  UploadMediaParams,
  UploadResponse,
  CompleteMediaResponse,
} from '../types';

export class Media {
  constructor(private client: HttpClient) {}

  /** List media files */
  async list(params?: ListMediaParams): Promise<ListMediaResponse> {
    const query = new URLSearchParams();
    if (params?.type) query.set('type', params.type);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    const qs = query.toString();
    return this.client.get(`/api/v1/media${qs ? `?${qs}` : ''}`);
  }

  /** Get media status by ID */
  async get(id: string): Promise<MediaItem> {
    return this.client.get(`/api/v1/media/${id}`);
  }

  /** Delete a media file */
  async delete(id: string): Promise<{ message: string }> {
    return this.client.delete(`/api/v1/media/${id}`);
  }

  /**
   * Upload a file in one call.
   * Handles the full 3-step flow: presign → upload → complete.
   */
  /**
   * Upload a file in one call.
   * Handles the full 3-step flow: presign → upload → complete.
   *
   * Pass a Blob, or convert a Buffer with: `new Blob([buffer])`
   */
  async upload(
    file: Blob,
    options: { filename: string; contentType: string }
  ): Promise<CompleteMediaResponse> {
    const fileSize = file.size;

    // Step 1: Get presigned upload URL
    const presign = await this.client.post<UploadResponse>('/api/v1/media/upload', {
      filename: options.filename,
      content_type: options.contentType,
      file_size: fileSize,
    });

    // Step 2: Upload file to presigned URL
    await this.client.uploadToPresignedUrl(presign.upload_url, file, options.contentType);

    // Step 3: Complete the upload
    const complete = await this.client.post<CompleteMediaResponse>(
      `/api/v1/media/${presign.media_id}/complete`
    );

    return complete;
  }

  /**
   * Get a presigned upload URL (for manual upload flow).
   * Use `upload()` instead for a simpler one-call experience.
   */
  async getUploadUrl(params: UploadMediaParams): Promise<UploadResponse> {
    return this.client.post('/api/v1/media/upload', params);
  }

  /** Mark an upload as complete after uploading to the presigned URL */
  async complete(mediaId: string): Promise<CompleteMediaResponse> {
    return this.client.post(`/api/v1/media/${mediaId}/complete`);
  }
}
