import React, { useState } from 'react';
import { Image, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect?: (file: File | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if (onImageSelect) onImageSelect(file);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (onImageSelect) onImageSelect(null);
  };

  return (
    <div className="w-full">
      {!previewUrl ? (
        <label className="flex items-center space-x-2 rtl:space-x-reverse text-blue-500 hover:text-blue-600 cursor-pointer p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors w-max">
          <Image className="w-5 h-5" />
          <span className="text-sm font-medium">إضافة صورة</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="relative mt-2 rounded-2xl overflow-hidden max-h-64 border border-gray-200 dark:border-gray-800">
          <img src={previewUrl} alt="المعاينة" className="w-full h-full object-cover" />
          <button
            onClick={handleRemove}
            className="absolute top-2 left-2 bg-black/70 hover:bg-black text-white p-1.5 rounded-full backdrop-blur-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
