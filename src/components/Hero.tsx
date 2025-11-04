import type { ReactNode } from "react";

interface HeroProps {
    title: ReactNode | string;
}

const Hero = ({title}: HeroProps) => {
  return (

    <div className="flex flex-col justify-center items-center p-0 mb-0 font-extrabold sm:text-5xl font-sans text-7xl m-10 pb-3">
      {title}
      <img className="object-cover w-100" src="./../public/hero-img.png" alt="hero-img" />
      </div>
    
  )
}

export default Hero