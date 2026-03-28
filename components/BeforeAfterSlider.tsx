"use client";

import { useRef, useState } from "react";

interface Props {
  before: string;
  after: string;
}

export default function BeforeAfterSlider({ before, after }: Props) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateSlider = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pos = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 0), 100);
    setSliderPos(pos);
  };

  const onMouseDown = () => { dragging.current = true; };
  const onMouseMove = (e: React.MouseEvent) => { if (dragging.current) updateSlider(e.clientX); };
  const onMouseUp = () => { dragging.current = false; };

  const onTouchMove = (e: React.TouchEvent) => {
    updateSlider(e.touches[0].clientX);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm text-gray-500 px-1">
        <span>Original</span>
        <span>Result</span>
      </div>
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl border border-gray-800 select-none"
        style={{ cursor: "col-resize" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchMove={onTouchMove}
      >
        {/* After (result) - full width background with checkered pattern for transparency */}
        <div
          className="w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='10' height='10' fill='%23ccc'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23ccc'/%3E%3Crect x='10' width='10' height='10' fill='%23fff'/%3E%3Crect y='10' width='10' height='10' fill='%23fff'/%3E%3C/svg%3E")`,
          }}
        >
          <img src={after} alt="Result" className="w-full h-auto block max-h-[500px] object-contain" />
        </div>

        {/* Before (original) - clipped to left side */}
        <div
          className="absolute top-0 left-0 h-full overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img src={before} alt="Original" className="w-full h-auto block max-h-[500px] object-contain" style={{ minWidth: containerRef.current?.offsetWidth || 300 }} />
        </div>

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
          style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5">
              <path d="M21 12H3M8 7l-5 5 5 5M16 7l5 5-5 5" />
            </svg>
          </div>
        </div>
      </div>
      <p className="text-center text-gray-600 text-xs">← Drag to compare →</p>
    </div>
  );
}
