interface ShowMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const ShowMoreButton = ({ onClick, isLoading }: ShowMoreButtonProps) => {
  return (
    <div className="flex justify-center mt-8 mb-12">
      <button
        onClick={onClick}
        disabled={isLoading}
        className="px-8 py-3 bg-purple-700 hover:bg-purple-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-lg"
      >
        {isLoading ? 'Loading...' : 'Show More'}
      </button>
    </div>
  );
};

export default ShowMoreButton;
