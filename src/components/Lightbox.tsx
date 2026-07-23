import React, { useEffect, useState, useRef } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface LightboxProps {
  images: string[];
  initialIndex: number;
  caption?: string;
  onClose: () => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

export default function Lightbox({ images, initialIndex, caption, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowRight") setIndex((p) => (p + 1) % images.length);
      if (e.key === "ArrowLeft")  setIndex((p) => (p - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, onClose]);

  useEffect(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [index]);

  const doZoomIn  = (e: React.MouseEvent) => { e.stopPropagation(); setZoom((z) => Math.min(z + ZOOM_STEP, MAX_ZOOM)); };
  const doZoomOut = (e: React.MouseEvent) => { e.stopPropagation(); setZoom((z) => { const n = Math.max(z - ZOOM_STEP, MIN_ZOOM); if (n <= MIN_ZOOM) setOffset({ x: 0, y: 0 }); return n; }); };
  const doReset   = (e: React.MouseEvent) => { e.stopPropagation(); setZoom(1); setOffset({ x: 0, y: 0 }); };

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    setZoom((z) => {
      const n = e.deltaY < 0 ? Math.min(z + ZOOM_STEP, MAX_ZOOM) : Math.max(z - ZOOM_STEP, MIN_ZOOM);
      if (n <= MIN_ZOOM) setOffset({ x: 0, y: 0 });
      return n;
    });
  };

  const handleImgDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (zoom > 1) { setZoom(1); setOffset({ x: 0, y: 0 }); } else { setZoom(2); }
  };

  const handleImgMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  // mousemove/mouseup on window so drag works even when cursor leaves img
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    const onUp   = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging, dragStart]);

  return (
    /* Backdrop — click anywhere on it closes the lightbox */
    <div
      className="fixed inset-0 bg-black/95 z-[100] select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 cursor-pointer bg-white/5 hover:bg-white/10 rounded-full transition-colors z-20"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Zoom toolbar */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={doZoomOut} disabled={zoom <= MIN_ZOOM} className="p-1.5 text-white/70 hover:text-white disabled:opacity-30 cursor-pointer">
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-white/60 text-xs font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={doZoomIn} disabled={zoom >= MAX_ZOOM} className="p-1.5 text-white/70 hover:text-white disabled:opacity-30 cursor-pointer">
          <ZoomIn className="w-4 h-4" />
        </button>
        {zoom > 1 && (
          <button onClick={doReset} className="p-1.5 text-amber-400 hover:text-amber-300 cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setIndex((p) => (p - 1 + images.length) % images.length); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 cursor-pointer text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors z-20"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIndex((p) => (p + 1) % images.length); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 cursor-pointer text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors z-20"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </>
      )}

      {/* Image — pointer-events only on img, container is pass-through */}
      <div className="absolute inset-0 flex items-center justify-center px-20 pt-16 pb-24 pointer-events-none z-10">
        <img
          ref={imgRef}
          src={images[index]}
          alt={`Ảnh ${index + 1}`}
          draggable={false}
          onDoubleClick={handleImgDoubleClick}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={handleImgMouseDown}
          onWheel={handleWheel}
          className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
          style={{
            pointerEvents: "auto",
            cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default",
            transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
            transformOrigin: "center center",
            transition: dragging ? "none" : "transform 0.15s ease",
          }}
        />
      </div>

      {/* Caption + dots */}
      <div
        className="absolute bottom-4 left-0 right-0 text-center space-y-1.5 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm font-semibold text-white">Hình {index + 1} / {images.length}</p>
        {caption && <p className="text-xs text-slate-400">{caption}</p>}
        {images.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                className={`rounded-full transition-all cursor-pointer ${
                  i === index ? "w-4 h-2 bg-amber-500" : "w-2 h-2 bg-slate-600 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        )}
        <p className="text-[10px] text-slate-600">Cuộn chuột để zoom • Double-click để phóng to • Click ngoài ảnh để đóng</p>
      </div>
    </div>
  );
}
