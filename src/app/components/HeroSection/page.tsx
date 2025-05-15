"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";

const styleOptions = [
  { src: "/images/cartoon.png", alt: "3D cartoon style" },
  { src: "/images/anime.png", alt: "Anime style" },
  { src: "/images/comic.png", alt: "Comic style" },
  { src: "/images/line-sketch.png", alt: "Sketch style" },
];

export default function Home() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [selectedStyle, setSelectedStyle] = useState(styleOptions[0].src);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleSliderChange = (value: number[]) => {
    setSliderPosition(value[0]);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newPosition = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(newPosition);
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="container mx-auto py-4 px-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold">pfp.fm</h1>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="#"
                className="text-sm font-medium hover:text-gray-600"
              >
                Before & After
              </Link>
              <Link
                href="#"
                className="text-sm font-medium hover:text-gray-600"
              >
                How It Works
              </Link>
              <Link
                href="#"
                className="text-sm font-medium hover:text-gray-600"
              >
                Pricing
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm font-medium hover:text-gray-600">
              Sign In
            </Link>
            <Button className="rounded-full bg-black text-white hover:bg-gray-800">
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Upgrade Your Profile Picture
            </h2>
            <p className="text-lg text-gray-600 max-w-md">
              Transform your photo into stunning avatars in a variety of
              artistic styles. Choose your favorite and download instantly!
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="rounded-full bg-black text-white hover:bg-gray-800 px-8 py-6">
                Get Started
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-gray-300 hover:bg-gray-100 px-8 py-6"
              >
                Examples
              </Button>
            </div>
          </div>

          {/* Right Column - Image Comparison */}
          <div className="relative flex items-center justify-center">
            {/* Thumbnails */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-4 z-40">
              <div className="flex flex-col gap-3 p-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200">
                {styleOptions.map((style) => (
                  <button
                    key={style.src}
                    onClick={() => setSelectedStyle(style.src)}
                    className={`w-14 h-14 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                      selectedStyle === style.src
                        ? "border-black scale-105"
                        : "border-gray-300 hover:border-black hover:scale-105"
                    }`}
                  >
                    <Image
                      src={style.src}
                      alt={style.alt}
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Main Image Comparison */}
            <div
              ref={containerRef}
              className="relative w-[544px] h-[768px] overflow-hidden rounded-xl shadow-xl mx-auto select-none"
              onMouseDown={handleMouseDown}
            >
              {/* Styled Image */}
              <div className="absolute top-0 left-0 w-full h-full z-10">
                <Image
                  src={selectedStyle}
                  alt="Styled"
                  fill
                  className="object-cover"
                  style={{
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                    transition: "clip-path 0.2s ease",
                  }}
                />
              </div>

              {/* Original Image */}
              <div className="absolute top-0 left-0 w-full h-full z-0">
                <Image
                  src="/images/avatar.png"
                  alt="Original"
                  fill
                  className="object-cover"
                  style={{
                    clipPath: `inset(0 0 0 ${sliderPosition}%)`,
                    transition: "clip-path 0.2s ease",
                  }}
                />
              </div>

              {/* Slider Divider */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-black z-20"
                style={{
                  left: `${sliderPosition}%`,
                  transform: "translateX(-50%)",
                }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white text-black flex items-center justify-center rounded-full cursor-pointer shadow">
                  <span className="text-xs font-bold">⇄</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
