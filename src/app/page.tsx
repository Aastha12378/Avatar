"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "./components/ui/button";
import "../app/components/HeroSection/HowItWorks.css";
import { InfiniteMarquee } from "./components/ui/infiniteMarquee";
import Header from "./components/Header";

const styleOptions = [
  { src: "/images/cartoon.png", alt: "3D cartoon style" },
  { src: "/images/anime.png", alt: "Anime style" },
  { src: "/images/comic.png", alt: "Comic style" },
  { src: "/images/line-sketch.png", alt: "Sketch style" },
];

const featuresSingle = [
  "One profile picture generation",
  "~60 second generation time",
  "High quality output",
  "Instant download",
  "Transparent backgrounds",
];

const featuresBundle = [
  "5 profile picture generations",
  "~60 second generation time each",
  "High quality output",
  "Instant download",
  "Transparent backgrounds",
  "Save 40%",
];

export default function Home() {
  const avatarCount = 4; // Set to your total avatar folders
  // const [showSignInModal, setShowSignInModal] = useState(false);

  const avatars = Array.from({ length: avatarCount }, (_, i) => ({
    cartoon: `/images/avatar${i + 1}/cartoon.png`,
    original: `/images/avatar${i + 1}/original.png`,
  }));

  const rowAvatars = [...avatars, ...avatars];

  const [hoveredRow0, setHoveredRow0] = useState<number | null>(null);
  const [hoveredRow1, setHoveredRow1] = useState<number | null>(null);

  const [sliderPosition, setSliderPosition] = useState(50);
  const [selectedStyle, setSelectedStyle] = useState(styleOptions[0].src);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

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
    <React.Fragment>
      {/* Header with ImageStyleSelector trigger */}
      <Header />
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
              <div className="flex flex-col gap-3 p-3 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200">
                {styleOptions.map((style) => (
                  <button
                    key={style.src}
                    onClick={() => setSelectedStyle(style.src)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedStyle === style.src
                        ? "border-black scale-105"
                        : "border-gray-300 hover:border-black hover:scale-105"
                    }`}
                  >
                    <Image
                      src={style.src}
                      alt={style.alt}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
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

      {/* Before & After */}
      <section className="py-16 bg-gray-100 w-full" id="Before-After">
        <div className="container mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold mb-6">Before & After</h2>
          <p className="mb-8">
            Hover over the images to see the transformation
          </p>
        </div>
        <div className="space-y-8 w-full">
          {/* Row 0 */}
          <div className="overflow-hidden w-full relative">
            <div className="pointer-events-none absolute top-0 left-0 h-full w-32 z-10 bg-gradient-to-r from-gray-100 to-transparent" />
            <div className="pointer-events-none absolute top-0 right-0 h-full w-32 z-10 bg-gradient-to-l from-gray-100 to-transparent" />
            <InfiniteMarquee
              avatars={rowAvatars}
              direction="left"
              speed="fast"
              hoveredIdx={hoveredRow0}
              setHoveredIdx={setHoveredRow0}
              paused={hoveredRow0 !== null}
            />
          </div>

          {/* Row 1 */}
          <div className="overflow-hidden w-full relative">
            <div className="pointer-events-none absolute top-0 left-0 h-full w-32 z-10 bg-gradient-to-r from-gray-100 to-transparent" />
            <div className="pointer-events-none absolute top-0 right-0 h-full w-32 z-10 bg-gradient-to-l from-gray-100 to-transparent" />
            <InfiniteMarquee
              avatars={rowAvatars}
              direction="right"
              speed="fast"
              hoveredIdx={hoveredRow1}
              setHoveredIdx={setHoveredRow1}
              paused={hoveredRow1 !== null}
            />
          </div>
        </div>
      </section>

      {/* how-it-works */}
      <section className="how-it-works-section" id="how-it-works">
        <p className="simple-process">Simple Process</p>
        <h2 className="how-it-works-title">How It Works</h2>
        <p className="how-it-works-desc">
          Create a beautiful profile picture in just a few simple steps:
        </p>
        <div className="steps-row">
          <div className="step">
            <div className="step-icon upload" />
            <h3>Upload Your Photo</h3>
            <p>
              Start by uploading a clear photo of yourself. Our AI works best
              with well-lit, front-facing portraits.
            </p>
          </div>
          <div className="arrow" />
          <div className="step">
            <div className="step-icon style" />
            <h3>Choose Your Style</h3>
            <p>
              Select from our curated collection of artistic styles – from 3D
              renders to anime, cartoons, and sketches.
            </p>
          </div>
          <div className="arrow" />
          <div className="step">
            <div className="step-icon ai" />
            <h3>AI Transformation</h3>
            <p>
              Our advanced AI instantly transforms your photo into a stunning
              avatar while preserving your unique features.
            </p>
          </div>
          <div className="arrow" />
          <div className="step">
            <div className="step-icon download" />
            <h3>Download & Share</h3>
            <p>
              Download your new profile picture in high resolution and share it
              across your social media platforms.
            </p>
          </div>
        </div>
      </section>

      {/* PricingCard  */}
      <div
        className="flex flex-col items-center w-full mt-8 bg-[#fafafa] py-16"
        id="pricing"
      >
        <div className="flex flex-col items-center mb-8">
          <span className="text-blue-600 font-medium text-sm mb-2">
            Simple, Affordable Pricing
          </span>
          <h2 className="text-4xl font-bold text-center mb-2">
            Generate Your Perfect
            <br />
            Profile Picture
          </h2>
          <p className="text-gray-500 text-center">
            Each generation takes about 60 seconds. Purchase as many as you'd
            like.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {/* Single Generation Card */}
          <div className="relative bg-white rounded-2xl border border-blue-200 shadow-sm p-8 w-80 flex flex-col items-center">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-4 py-1 rounded-full font-semibold shadow">
              Popular
            </span>
            <h3 className="text-xl font-semibold mb-2">Single Generation</h3>
            <div className="flex items-end mb-1">
              <span className="text-4xl font-bold">$1</span>
              <span className="text-gray-500 ml-1 mb-1 text-sm">
                /generation
              </span>
            </div>
            <p className="text-gray-500 mb-4">Generate one profile picture</p>
            <button className="w-full bg-black text-white rounded-full py-2 font-semibold mb-6 hover:bg-gray-900 transition">
              Generate Now
            </button>
            <ul className="text-left space-y-2 w-full">
              {featuresSingle.map((f, i) => (
                <li key={i} className="flex items-center text-gray-700">
                  <span className="text-blue-500 mr-2">✔</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          {/* Bundle Pack Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-80 flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-2">Bundle Pack</h3>
            <div className="flex items-end mb-1">
              <span className="text-4xl font-bold">$3</span>
              <span className="text-gray-500 ml-1 mb-1 text-sm">/bundle</span>
            </div>
            <p className="text-gray-500 mb-4">
              5 profile pictures for the price of 3
            </p>
            <button
              className="w-full bg-gray-100 text-gray-400 rounded-full py-2 font-semibold mb-6 cursor-not-allowed"
              disabled
            >
              Coming Soon
            </button>
            <ul className="text-left space-y-2 w-full">
              {featuresBundle.map((f, i) => (
                <li key={i} className="flex items-center text-gray-700">
                  <span className="text-blue-500 mr-2">✔</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* footer  */}
      <footer className="bg-white pt-16">
        {/* Call To Action Card */}
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-black to-gray-600 rounded-2xl px-12 py-16 w-full max-w-4xl text-center shadow-lg">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to transform your profile pic?
            </h1>
            <p className="text-lg md:text-xl text-white mb-8">
              Create your unique avatar in seconds.
            </p>
            <button className="bg-white text-black font-semibold px-8 py-3 rounded-full shadow hover:bg-gray-100 transition">
              Create Your Avatar
            </button>
          </div>
        </div>
        {/* Footer */}
        <div className="mt-24 border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-5 gap-8 text-gray-700 text-sm">
            <div className="md:col-span-1 flex flex-col gap-2">
              <span className="font-bold flex items-center gap-2">
                <span className="text-xl">⚪</span> pfp.fm
              </span>
              <span className="text-gray-500">
                Upgrade Your Profile Picture
              </span>
            </div>
            <div>
              <div className="font-semibold mb-2">Product</div>
              <div className="flex flex-col gap-1">
                <a href="#" className="hover:underline">
                  Before & After
                </a>
                <a href="#" className="hover:underline">
                  How It Works
                </a>
                <a href="#" className="hover:underline">
                  Pricing
                </a>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-2">Company</div>
              <div className="flex flex-col gap-1">
                <a href="#" className="hover:underline">
                  About
                </a>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-2">Legal</div>
              <div className="flex flex-col gap-1">
                <a href="#" className="hover:underline">
                  Terms
                </a>
                <a href="#" className="hover:underline">
                  Privacy
                </a>
                <a href="#" className="hover:underline">
                  Cookies
                </a>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-2">Contact</div>
              <a href="mailto:hello@pfp.fm" className="hover:underline">
                hello@pfp.fm
              </a>
            </div>
          </div>
          <div className="border-t border-gray-100 text-center text-xs text-gray-400 py-4">
            © 2025 pfp.fm. All rights reserved. &nbsp;|&nbsp; Made by{" "}
            <a href="#" className="underline">
              Charlie
            </a>{" "}
            from{" "}
            <a href="#" className="underline">
              Liinks
            </a>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
}
