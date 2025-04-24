"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { XIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "./button";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
}

export function ImageModal({ isOpen, onClose, src, alt }: ImageModalProps) {
  const [mounted, setMounted] = React.useState(false);
  const [scale, setScale] = React.useState(1);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = React.useState({
    width: 0,
    height: 0,
  });
  const imageRef = React.useRef<HTMLImageElement>(null);

  // Handle escape key to close modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle mounting for portal
  React.useEffect(() => {
    setMounted(true);

    // Prevent body scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });

      // Get image dimensions when it loads
      const img = new Image();
      img.onload = () => {
        setImageDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = src;
    }
  }, [isOpen, src]);

  // Handle zoom in/out
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.5, 0.5));
  };

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  // Handle drag move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  // Handle drag end
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Handle double click to reset zoom
  const handleDoubleClick = () => {
    if (scale !== 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(2);
    }
  };

  // Handle wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setScale((prev) => Math.min(prev + 0.2, 5));
    } else {
      setScale((prev) => Math.max(prev - 0.2, 0.5));
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-[101] text-white hover:bg-white/20"
        onClick={onClose}
      >
        <XIcon className="h-6 w-6" />
        <span className="sr-only">Close</span>
      </Button>

      {/* Zoom controls and image info */}
      <div className="absolute bottom-4 left-0 right-0 z-[101] flex flex-col items-center gap-2">
        <div className="text-white/70 text-xs bg-black/50 px-3 py-1 rounded-full">
          {imageDimensions.width > 0 && (
            <>
              {imageDimensions.width} × {imageDimensions.height}px
              {scale !== 1 && ` • ${Math.round(scale * 100)}%`}
            </>
          )}
        </div>

        {/* Help text - only show briefly when modal first opens */}
        {scale > 1 && (
          <div className="text-white/70 text-xs bg-black/50 px-3 py-1 rounded-full animate-fade-out">
            Drag to pan • Double-click to reset
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={handleZoomOut}
          >
            <ZoomOutIcon className="h-5 w-5" />
            <span className="sr-only">Zoom out</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={handleZoomIn}
          >
            <ZoomInIcon className="h-5 w-5" />
            <span className="sr-only">Zoom in</span>
          </Button>
        </div>
      </div>

      {/* Image container */}
      <div
        className="h-full w-full overflow-hidden flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className={cn(
            "h-auto w-auto max-w-none cursor-move transition-transform duration-100",
            isDragging ? "transition-none" : ""
          )}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "center",
            maxHeight: scale === 1 ? "none" : "none", // Remove height constraints
            maxWidth: scale === 1 ? "none" : "none", // Remove width constraints
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleClick}
          onWheel={handleWheel}
          draggable="false"
        />
      </div>
    </div>,
    document.body
  );
}

export function useImageModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [imageProps, setImageProps] = React.useState<{
    src: string;
    alt: string;
  }>({ src: "", alt: "" });

  const openModal = (src: string, alt: string) => {
    setImageProps({ src, alt });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    openModal,
    closeModal,
    imageProps,
  };
}
