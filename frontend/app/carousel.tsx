"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import firstSlide from "../public/carouselBanner.png";
import secondSlide from "../public/carouselBanner2.png";
import thirdSlide from "../public/carouselBanner3.png";

const slides = [firstSlide, secondSlide, thirdSlide];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {

    const timer = window.setInterval(() => {
      setCurrent((index) => (index + 1) % slides.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative h-80 overflow-hidden rounded-lg">
      <Image
        src={slides[current]}
        alt=""
        fill
        sizes="(min-width: 1024px) 75vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}