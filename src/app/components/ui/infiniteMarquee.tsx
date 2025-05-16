// infiniteMarquee.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Avatar = {
  cartoon: string;
  original: string;
};

export function InfiniteMarquee({
  avatars,
  direction = "left",
  speed = "fast",
  hoveredIdx,
  setHoveredIdx,
  className,
  paused = false,
}: {
  avatars: Avatar[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  hoveredIdx: number | null;
  setHoveredIdx: (idx: number | null) => void;
  className?: string;
  paused?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (containerRef.current && scrollerRef.current) {
      if (scrollerRef.current.children.length === avatars.length) {
        const children = Array.from(scrollerRef.current.children);
        children.forEach((child) => {
          const clone = child.cloneNode(true);
          scrollerRef.current?.appendChild(clone);
        });
      }

      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
      const durations = { fast: "20s", normal: "40s", slow: "80s" };
      containerRef.current.style.setProperty(
        "--animation-duration",
        durations[speed] || "40s"
      );

      setStart(true);
    }
  }, [direction, speed, avatars.length]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden [--animation-direction:forwards] [--animation-duration:20s]",
        className
      )}
    >
      <div
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full gap-4 px-4 animate-marquee",
          paused && "paused"
        )}
      >
        {[...avatars, ...avatars].map((avatar, idx) => (
          <motion.div
            key={idx}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className="flex-shrink-0 rounded-xl overflow-hidden cursor-pointer bg-gray-100 p-1" // You can change p-1 to p-0.5 or p-0
          >
            <Image
              src={hoveredIdx === idx ? avatar.original : avatar.cartoon}
              alt="Avatar transformation"
              width={150}
              height={100}
              className="object-contain rounded-xl transition duration-300"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
