import { useState } from 'react';

import { UPLOAD_API } from '@/config/mode';

interface UploadOptions {
  file: File;
  prefix?: string;
  needCompress?: boolean;
  maxSizeInBytes?: number; // Maximum file size limit (bytes)
}

interface UploadResponse {
  code: number;
  data: {
    url: string;
  };
  msg: string;
}

export const useFileUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async ({
    file,
    prefix,
    needCompress = false,
    maxSizeInBytes = 5 * 1024 * 1024, // 5MB
  }: UploadOptions): Promise<UploadResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Check file size
      if (file.size > maxSizeInBytes) {
        throw new Error(
          `File size exceeds the limit of ${maxSizeInBytes / (1024 * 1024)} MB`
        );
      }

      const formData = new FormData();

      formData.append('file', file);

      if (prefix) {
        formData.append('prefix', prefix);
      }

      formData.append('need_compress', needCompress.toString());

      const response = await fetch(UPLOAD_API, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data: UploadResponse = await response.json();

      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { upload, isLoading, error };
};

export default useFileUpload;
