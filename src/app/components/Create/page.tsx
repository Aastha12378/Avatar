"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { suggestThemes } from "@/app/actions/theme-suggestion";
import { generateAvatar } from "@/app/actions/generate-avatar";

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
  const [step, setStep] = useState(1); // 1: style, 2: upload, 3: themes
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [suggestedThemes, setSuggestedThemes] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = () => {
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setIsLoading(true);

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setUploadedImage(base64);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleNextClick = async () => {
    if (step === 2 && uploadedImage) {
      setIsLoading(true);
      setError(null);
      
      try {
        // Call the theme suggestion API
        const result = await suggestThemes({
          photoDataUri: uploadedImage,
          userInput: `Style: ${avatarStyles.find(s => s.img === selectedStyle)?.title || 'Cartoon'}`
        });
                
        setSuggestedThemes(result.themes);
        setStep(3); // Move to themes step
      } catch (error) {
        console.error('Error suggesting themes:', error);
        setError('Unable to generate themes. Using default themes instead.');
        // Still move to step 3 with default themes
        setStep(3);
      } finally {
        setIsLoading(false);
      }
    } else if (step === 3 && selectedTheme) {
      setIsLoading(true);
      setError(null);

      try {
        const style = avatarStyles.find(s => s.img === selectedStyle)?.key || 'cartoon';
        
        const result = await generateAvatar({
          imageUrl: uploadedImage!,
          style,
          theme: selectedTheme
        });
        console.log('result', result);
        
        setGeneratedAvatar(result.imageUrl);
        setStep(4); // Move to final step
      } catch (error) {
        console.error('Error generating avatar:', error);
        setError('Failed to generate avatar. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setStep((s) => Math.min(4, s + 1));
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top: Title/desc (left) and Buttons (right) */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">
              {step === 1 ? 'Choose Image Style' : step === 2 ? 'Upload Photo' : step === 3 ? 'Choose Theme' : 'Generated Avatar'}
            </h1>
            <p className="text-gray-600 mt-2">
              {step === 1
                ? 'Select the artistic style for your avatar'
                : step === 2
                ? `Upload a photo of the person you'd like to generate an avatar for`
                : step === 3
                ? 'Select a theme for your avatar'
                : 'Your generated avatar is ready to download'}
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
                step === 4
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              )}
              onClick={handleNextClick}
              disabled={step === 4 || (step === 2 && !uploadedImage)}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-black transition-all duration-300" 
            style={{ width: `${(step / 4) * 100}%` }} 
          />
        </div>

        {/* Main Content */}
        <div className="bg-gray-50 rounded-xl shadow p-6 flex flex-col md:flex-row gap-6">
          {/* Left: Style Grid, Upload Card, or Theme Selection */}
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
                        <img
                          src={style.img}
                          alt={style.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
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
            ) : step === 2 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[350px]">
                {uploadedImage ? (
                  <div className="w-full h-[550px] relative rounded-xl overflow-hidden">
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-xl p-8 bg-white w-full">
                    <div className="flex flex-col items-center">
                      <div className="text-5xl mb-4 text-gray-400">
                        <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0 0V8m0 4h4m-4 0H8m12 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2m16 0V8a2 2 0 0 0-2-2h-3.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 4H6a2 2 0 0 0-2 2v8m16 4H4"/></svg>
                      </div>
                      <div className="text-lg font-medium mb-2">Upload an image of yourself</div>
                      <div className="text-gray-500 text-sm mb-4">Max size 5MB</div>
                      <label className="bg-black text-white px-4 py-2 rounded cursor-pointer">
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageUpload}
                        />
                        Choose File
                      </label>
                    </div>
                  </div>
                )}
              </div>
            ) : step === 3 ? (
              <div className="space-y-4">
                {error && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {isLoading ? (
                    <div className="col-span-2 flex items-center justify-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                    </div>
                  ) : (
                    suggestedThemes.map((theme, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedTheme(theme)}
                        className={clsx(
                          "p-4 border-2 rounded-xl text-left transition-colors",
                          selectedTheme === theme
                            ? "border-black bg-gray-50"
                            : "border-gray-200 hover:border-black"
                        )}
                      >
                        <h3 className="font-medium">{theme}</h3>
                      </button>
                    ))
                  )}
                </div>
              </div>
            ) : step === 4 ? (
              <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Generated Avatar</h4>
                    <div className="w-full h-[550px] relative rounded-xl overflow-hidden group">
                      {generatedAvatar && (
                        <>
                          <img
                            src={generatedAvatar}
                            alt="Generated Avatar"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                              className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                              onClick={() => {
                                if (generatedAvatar) {
                                  const link = document.createElement('a');
                                  link.href = generatedAvatar;
                                  link.download = 'avatar.png';
                                  link.click();
                                }
                              }}
                            >
                              Download Avatar
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold">Your Generated Avatar</h3>
                    <p className="text-gray-600 mt-2">
                      Style: {avatarStyles.find(s => s.img === selectedStyle)?.title}<br />
                      Theme: {selectedTheme}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Right: Image Preview */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            {step === 4 ? (
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
                    <p className="text-gray-600">Generating your avatar...</p>
                  </div>
                ) : (
                  <div className="w-full h-[550px] relative rounded-xl overflow-hidden">
                    {uploadedImage && (
                      <img
                        src={uploadedImage}
                        alt="Original"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                )}
              </div>
            ) : step === 3 ? (
              <div className="w-full h-[550px] relative rounded-xl overflow-hidden">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
                    <p className="text-gray-600">Generating themes...</p>
                  </div>
                ) : (
                  uploadedImage && (
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                  )
                )}
              </div>
            ) : (
              <div
                ref={containerRef}
                className="relative w-[500px] h-[550px] overflow-hidden rounded-xl shadow-lg select-none"
                onMouseDown={handleMouseDown}
              >
                <div className="absolute inset-0 z-10">
                  <img
                    src={selectedStyle}
                    alt="Styled"
                    className="w-full h-full object-cover"
                    style={{
                      clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                    }}
                  />
                </div>
                <div className="absolute inset-0 z-0">
                  <img
                    src="/images/avatar.png"
                    alt="Original"
                    className="w-full h-full object-cover"
                    style={{
                      clipPath: `inset(0 0 0 ${sliderPosition}%)`,
                    }}
                  />
                </div>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
