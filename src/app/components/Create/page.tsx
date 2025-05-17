"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

const avatarStyles = [
  {
    key: "cartoon",
    title: "Cartoon",
    description: "Bold, colorful cartoonish style",
    img: "/images/cartoon.png",
  },
  {
    key: "anime",
    title: "Anime",
    description: "Clean lines and vibrant anime style",
    img: "/images/anime.png",
  },
  {
    key: "comic",
    title: "Comic",
    description: "Halftone dots and comic book texture",
    img: "/images/comic.png",
  },
  {
    key: "sketch",
    title: "Sketch",
    description: "Pencil-drawn black & white look",
    img: "/images/line-sketch.png",
  },
];

export default function ChooseStylePage() {
  const [selectedStyle, setSelectedStyle] = useState(avatarStyles[0].img);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [step, setStep] = useState(1); // 1: style, 2: upload
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = () => {
    // const startX = e.clientX;
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const newPosition = (offsetX / rect.width) * 100;
      setSliderPosition(Math.min(100, Math.max(0, newPosition)));
    };
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="min-h-screen bg-white px-6 py-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top: Title/desc (left) and Buttons (right) */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">
              {step === 1 ? 'Choose Image Style' : 'Upload Photo'}
            </h1>
            <p className="text-gray-600 mt-2">
              {step === 1
                ? 'Select the artistic style for your avatar'
                : `Upload a photo of the person you'd like to generate an avatar for`}
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button
              className={clsx(
                "px-4 py-2 rounded transition-colors",
                step === 1 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : "bg-gray-200 hover:bg-gray-300"
              )}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              ← Previous
            </button>
            <button
              className={clsx(
                "px-4 py-2 rounded transition-colors",
                step === 2
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              )}
              onClick={() => setStep((s) => Math.min(2, s + 1))}
              disabled={step === 2}
            >
              Next →
            </button>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-black" style={{ width: step === 1 ? '33%' : '66%' }} />
        </div>

        {/* Card with left (styles/upload) and right (preview) */}
        <div className="bg-gray-50 rounded-xl shadow p-6 flex flex-col md:flex-row gap-6">
          {/* Left: Style Grid (2x2) or Upload Card */}
          <div className="w-full md:w-1/2">
            {step === 1 ? (
              <div className="grid grid-cols-2 gap-4">
                {avatarStyles.map((style) => {
                  const isSelected = selectedStyle === style.img;
                  return (
                    <button
                      key={style.key}
                      onClick={() => setSelectedStyle(style.img)}
                      className={clsx(
                        "aspect-square w-full h-full block relative rounded-xl overflow-hidden border-2 group transition-all duration-200",
                        isSelected
                          ? "border-black shadow-lg"
                          : "border-gray-200 hover:border-black"
                      )}
                      tabIndex={0}
                      style={{ minHeight: 0, minWidth: 0 }}
                    >
                      <div className="absolute inset-0">
                        <Image
                          src={style.img}
                          alt={style.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                          priority
                        />
                      </div>
                      {/* Overlay with animation */}
                      <div
                        className={clsx(
                          "absolute bottom-0 left-0 w-full px-2 py-3 bg-black bg-opacity-80 text-white text-center transition-all duration-300",
                          "translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
                          isSelected && "translate-y-0 opacity-100"
                        )}
                        style={{
                          borderBottomLeftRadius: "0.75rem",
                          borderBottomRightRadius: "0.75rem",
                        }}
                      >
                        <div className="font-bold text-base">{style.title}</div>
                        <div className="text-xs mt-1">{style.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-xl p-8 bg-white min-h-[350px]">
                <div className="flex flex-col items-center">
                  <div className="text-5xl mb-4 text-gray-400">
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0 0V8m0 4h4m-4 0H8m12 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2m16 0V8a2 2 0 0 0-2-2h-3.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 4H6a2 2 0 0 0-2 2v8m16 4H4"/></svg>
                  </div>
                  <div className="text-lg font-medium mb-2">Upload an image of yourself</div>
                  <div className="text-gray-500 text-sm mb-4">Max size 5MB</div>
                  <label className="bg-black text-white px-4 py-2 rounded cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" />
                    Choose File
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Right: Image Comparison */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div
              ref={containerRef}
              className="relative w-[500px] h-[550px] overflow-hidden rounded-xl shadow-lg select-none"
              onMouseDown={handleMouseDown}
            >
              {/* Styled */}
              <div className="absolute inset-0 z-10">
                <Image
                  src={selectedStyle}
                  alt="Styled"
                  fill
                  className="object-cover"
                  style={{
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                  }}
                />
              </div>

              {/* Original */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/avatar.png"
                  alt="Original"
                  fill
                  className="object-cover"
                  style={{
                    clipPath: `inset(0 0 0 ${sliderPosition}%)`,
                  }}
                />
              </div>

              {/* Slider Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-black z-20"
                style={{
                  left: `${sliderPosition}%`,
                  transform: "translateX(-50%)",
                }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white text-black flex items-center justify-center rounded-full cursor-pointer shadow">
                  ⇄
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
