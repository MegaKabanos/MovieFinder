import { useState} from "react";
import heart from '../assets/heart.svg';
import full_heart from '../assets/full_heart.svg';

interface CardProps {
    title: string;
    imageSrc: string;
    year?: number;
    alt?: string;
    rating?: number;
}

const Card = ({title, year, imageSrc, alt, rating}: CardProps) => {

    const [liked, setLiked] = useState(false);

  return (
    <div className='flex flex-col border-amber-500 rounded-2xl items-start h-[400px] sm:h-[450px] md:h-[515px] bg-(--color-secondary)'>

        <img className="w-full h-[280px] sm:h-[320px] md:h-[368px] object-cover rounded-2xl shrink-0" src={imageSrc} alt={alt} />
        
        <div className="flex flex-col flex-1 w-full px-2 sm:px-3 md:px-4 pt-2 pb-3 min-h-0">
          <h2 className="text-[14px] sm:text-[16px] md:text-[18px] line-clamp-2 leading-tight">{title}</h2>
          <p className="text-gray-600 mt-1 text-[12px] sm:text-[14px]">{year}</p>
          
          <div className="flex mt-auto w-full justify-between items-center">
            <div>{rating && <span className="text-yellow-100 text-[12px] sm:text-[14px] md:text-base"><span className="opacity-90">⭐</span> {rating.toFixed(1)}</span>}</div>

            <button type="button"
              className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}>
              {liked ? <img src={full_heart} className="w-full h-full"
              alt="Remove from favorites" /> 
              : <img src={heart} className="w-full h-full" alt="Add to favorites" />}
            </button>
          </div>
        </div>
    </div>
  )
}

export default Card

