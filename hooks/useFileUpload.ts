'use client';

import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface UseFileUploadOptions {
  /** Supabase storage folder to upload into (e.g. 'projects', 'certifications') */
  folder: string;
  /** Success toast message */
  successMessage?: string;
}

interface UseFileUploadReturn {
  uploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void
  ) => Promise<void>;
}

/**
 * Shared hook for uploading a file to /api/admin/upload.
 * Extracted from CertificationForm, CourseForm, and ProjectForm
 * where the logic was copy-pasted verbatim.
 */
export function useFileUpload({ folder, successMessage = 'File uploaded' }: UseFileUploadOptions): UseFileUploadReturn {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data: { url?: string; error?: string } = await res.json();

      if (data.url) {
        onSuccess(data.url);
        toast.success(successMessage);
      } else {
        throw new Error(data.error ?? 'Upload failed');
      }
    } catch (err: unknown) {
      toast.error('Upload failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  return { uploading, fileInputRef, handleFileUpload };
}
