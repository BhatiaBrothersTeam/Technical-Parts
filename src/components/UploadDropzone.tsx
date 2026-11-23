"use client";

import { useCallback, useId, useRef, useState, type DragEvent } from "react";
import { t } from "@/lib/locale";
import { IconUpload } from "@/components/icons";

export const ACCEPTED_EXTENSIONS = [".pdf", ".xls", ".xlsx", ".doc", ".docx", ".jpg", ".jpeg", ".png"];

// Extensions alone aren't always enough for mobile browsers to offer the
// camera/photo-library picker on an <input type="file">; MIME types make
// that reliable, so both are combined in the `accept` attribute below.
const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];
export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

function isAllowed(file: File) {
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

interface UploadDropzoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onRejected?: (message: string) => void;
  compact?: boolean;
}

export function UploadDropzone({ files, onFilesChange, onRejected, compact }: UploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const next = [...files];
      for (const file of Array.from(incoming)) {
        if (!isAllowed(file)) {
          onRejected?.(`${file.name} ${t.rfqUpload.fileTypeNotAllowed}`);
          continue;
        }
        if (file.size > MAX_FILE_SIZE) {
          onRejected?.(`${file.name} ${t.rfqUpload.fileTooLarge}`);
          continue;
        }
        next.push(file);
      }
      onFilesChange(next);
    },
    [files, onFilesChange, onRejected]
  );

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    addFiles(e.dataTransfer.files);
  }

  function removeFile(index: number) {
    onFilesChange(files.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center text-center border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
          compact ? "p-6" : "p-10"
        } ${dragActive ? "border-tp-blue bg-tp-blue-light" : "border-[var(--tp-neutral-200)] bg-tp-blue-light/40 hover:border-tp-blue"}`}
      >
        <IconUpload className="h-8 w-8 text-tp-blue mb-2" />
        <p className="font-semibold text-tp-navy">{t.rfqUpload.dropHeading}</p>
        <p className="text-sm text-[var(--tp-neutral-600)] mt-1">
          {t.rfqUpload.dropOr}{" "}
          <span className="link-blue">{t.rfqUpload.browseFiles}</span>
        </p>
        <p className="text-xs text-[var(--tp-neutral-600)] mt-2">{t.rfqUpload.maxSize}</p>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          multiple
          accept={[...ACCEPTED_EXTENSIONS, ...ACCEPTED_MIME_TYPES].join(",")}
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          <p className="text-sm font-semibold text-tp-navy">{t.rfqUpload.selectedFiles}</p>
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center justify-between gap-3 text-sm bg-[var(--tp-neutral-50)] rounded-lg px-3 py-2"
            >
              <span className="truncate">{file.name}</span>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-[var(--tp-neutral-600)]">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-red-600 font-semibold text-xs"
                >
                  {t.rfqUpload.remove}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
