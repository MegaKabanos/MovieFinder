interface SearchCardProps {
  title: string;
  imageSrc: string | undefined;
  year?: number;
  onClick: () => void;
}

const SearchCard = ({
  title,
  year,
  imageSrc,
  onClick,
}: SearchCardProps) => {
  return (
    <div
      className="flex items-center p-2 cursor-pointer hover:bg-white/10 rounded-md"
      onClick={onClick}
    >
      {imageSrc ? (
        <img
          src={`https://image.tmdb.org/t/p/w92${imageSrc}`}
          alt={title}
          className="w-[60px] h-[90px] object-cover mr-3 rounded"
        />
      ) : (
        <img
          src={`/public/No-Poster (1).png`}
          alt={title}
          className="w-[60px] h-[90px] object-cover mr-3 rounded"
        />
      )}

      <div>
        <span className="text-white font-medium">{title}</span>
        {year && <span className="text-gray-500 text-sm ml-2">{year}</span>}
      </div>
    </div>
  );
};

export default SearchCard;
