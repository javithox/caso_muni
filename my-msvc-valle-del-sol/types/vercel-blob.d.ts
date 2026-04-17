declare module '@vercel/blob/client' {
  import type { Request } from 'next/server';

  export type HandleUploadBody = any;

  export interface HandleUploadOptions {
    body: HandleUploadBody;
    request: Request;
    onBeforeGenerateToken?: (pathname: string) => Promise<{ allowedContentTypes?: string[]; tokenPayload?: string } | void>;
    onUploadCompleted?: (args: { blob: { url: string }; tokenPayload?: string }) => Promise<void> | void;
  }

  export function handleUpload(options: HandleUploadOptions): Promise<any>;

  export {};
}
