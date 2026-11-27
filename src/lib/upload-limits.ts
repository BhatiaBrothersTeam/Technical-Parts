/**
 * Netlify (and Vercel) functions reject request bodies above roughly 6 MB, and
 * multipart uploads are base64-encoded on the way in, so the real ceiling for
 * raw files is about 4.5 MB. Everything is capped at 4 MB in total so an upload
 * never fails halfway after the customer has filled the form in.
 */
export const MAX_TOTAL_BYTES = 4 * 1024 * 1024;
export const MAX_FILES = 10;
export const MAX_TOTAL_LABEL = "4MB";

export const ACCEPTED_EXTENSIONS = [".pdf", ".xls", ".xlsx", ".doc", ".docx", ".jpg", ".jpeg", ".png"];

export function isAllowedFileName(name: string): boolean {
  const lower = name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function totalBytes(files: Array<{ size: number }>): number {
  return files.reduce((sum, f) => sum + f.size, 0);
}
