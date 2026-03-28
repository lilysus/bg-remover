"use client";

import { useRef, useState } from "react";

interface Props {
  onUpload: (file: File) => void;
  loading: boolean;
}

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function ImageUploader({ onUpload, loading }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validate = (file: File): string | null => {
    if (!ACCEPTED.includes(file.type)) return "Please upload a JPG, PNG, or WebP image.";
    if (file.size > MAX_SIZE) return "File is too large. Maximum size is 10MB.";
    return null;
  };

  const handleFile = (file: File) => {
    const err = validate(file);
    if (err) { setValidationError(err); return; }
    setValidationError(null);
    onUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => !loading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all
          ${dragging ? "border-violet-500 bg-violet-500/5" : "border-gray-700 hover:border-violet-500/50 hover:bg-gray-900"}
          ${loading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <div className="text-5xl mb-4">🖼️</div>
        <p className="text-lg font-semibold text-white mb-2">
          Drag & drop your image here
        </p>
        <p className="text-gray-500 text-sm mb-6">or click to browse</p>
        <div className="inline-block bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
          Choose Image
        </div>
        <p className="text-gray-600 text-xs mt-4">JPG, PNG, WebP • Max 10MB</p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          onChange={handleChange}
          className="hidden"
        />
      </div>
      {validationError && (
        <p className="text-red-400 text-sm text-center">{validationError}</p>
      )}
    </div>
  );
}
