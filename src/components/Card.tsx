import heart from '../assets/heart.svg';
import full_heart from '../assets/full_heart.svg';

interface CardProps {
    id?: number;
    title: string;
    imageSrc: string;
    year?: number;
    rating?: number;
    isLiked?: boolean;
    onToggleLike?: (id?: number) => void;
}

const Card = ({id, title, year, imageSrc, rating, isLiked = false, onToggleLike}: CardProps) => {

  return (
    <div className='flex flex-col rounded-2xl w-full max-w-[280px] bg-(--color-secondary)'>
        {/* Fixed aspect ratio image container */}
        <div className="w-full aspect-2/3 rounded-t-2xl overflow-hidden bg-gray-800 shrink-0">
          {imageSrc ? 
            <img 
              className="w-full h-full object-cover" 
              src={`https://image.tmdb.org/t/p/w500${imageSrc}`} 
              alt={title} 
            />
            : 
            <img 
              className="w-full h-full object-cover" 
              src="/No-Poster-Card.png" 
              alt={title} 
            />
          }
        </div>
        
        {/* Content area with flexible height */}
        <div className="flex flex-col flex-1 w-full px-3 sm:px-4 pt-2 sm:pt-3 pb-3 sm:pb-4 min-h-[120px] sm:min-h-[140px]">
          <h2 className="text-sm sm:text-base md:text-lg font-medium line-clamp-3 leading-snug grow">{title}</h2>
          <p className="text-gray-400 mt-1 text-xs sm:text-sm">{year}</p>
          
          <div className="flex mt-2 w-full justify-between items-center">
            <div>
              {rating ? (
                <span className="text-yellow-400 text-xs sm:text-sm font-medium">⭐ {rating.toFixed(1)}</span>
              ) : (
                <span className="text-gray-500 text-xs">No rating</span>
              )}
            </div>

            <button 
              type="button"
              className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center transition-transform hover:scale-110"
              onClick={(e) => { e.stopPropagation(); if (onToggleLike) onToggleLike(id); }}
              aria-pressed={isLiked}
            >
              {isLiked ? 
                <img src={full_heart} className="w-full h-full" alt="Remove from favorites" /> 
                : 
                <img src={heart} className="w-full h-full" alt="Add to favorites" />
              }
            </button>
          </div>
        </div>
    </div>
  )
}

export default Card

