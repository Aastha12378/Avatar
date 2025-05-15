'use client'
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const SecondHeroSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const avatars = [
    { before: "/images/avatar.png", after: "/images/cartoon.png" },
    { before: "/images/line-sketch.png", after: "/images/comic.png" },
    { before: "/images/anime.png", after: "/images/after-image.png" },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Before & After</h2>
        <p className="mb-8">Hover over the images to see the transformation</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {avatars.map((avatar, index) => (
            <motion.div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative w-full h-64 overflow-hidden rounded-lg shadow-lg"
            >
              <Image
                src={hoveredIndex === index ? avatar.after : avatar.before}
                alt="Avatar transformation"
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecondHeroSection;
