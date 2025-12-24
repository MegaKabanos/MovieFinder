import type { ReactNode } from "react";
import { useState } from "react";

interface HeroProps {
    title: ReactNode | string;
    onImageClick?: () => void;
}

const Hero = ({title, onImageClick}: HeroProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (

    <div id="site-hero" className="flex flex-col justify-center items-center p-0 mb-0 font-extrabold text-xl sm:text-4xl font-sans m-10 pb-3">
      {title}
      <img 
        className="object-cover w-100 cursor-pointer hover:scale-105 transition-transform" 
        src="/MovieFinder/public/hero-img.png" 
        alt="hero-img"
        onClick={onImageClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      
      {/* Tooltip that follows mouse */}
      {showTooltip && (
        <div 
          className="fixed pointer-events-none z-50 bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm shadow-lg"
          style={{
            left: `${mousePosition.x + 15}px`,
            top: `${mousePosition.y + 15}px`,
          }}
        >
          Home
        </div>
      )}
      </div>
    
  )
}

export default Hero