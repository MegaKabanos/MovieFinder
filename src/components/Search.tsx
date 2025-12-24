 
interface SearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Search = (props: SearchProps) => {
  return (
    <div className="w-full bg-(--color-secondary) px-4 py-3 rounded-lg mt-2 mb-0 max-w-[300px] sm:max-w-xl lg:max-w-3xl mx-auto">
        <div className="relative flex items-center">
            <img src="search.svg" alt="search" className="absolute left-2 h-5 w-5" />

            <input 
              type="text" 
              placeholder="Search through thousands of movies" 
              value={props.searchTerm}
              onChange={(e)=>props.setSearchTerm(e.target.value)}
              className="w-full bg-transparent py-2 sm:pr-10 pl-10 text-[14px] sm:text-xl text-gray-200 placeholder-light-300 outline-hidden"
            />
        
        </div>
    </div> 
  )
}

export default Search