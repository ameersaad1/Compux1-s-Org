import React from 'react';

export function LightboxModal({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[90vh] flex items-center justify-center">
        <img
          src={src}
          alt="Expanded media view"
          className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 sm:top-2 sm:right-2 w-10 h-10 rounded-full flex items-center justify-center text-white bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all active:scale-95"
          aria-label="Close image lightbox"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
