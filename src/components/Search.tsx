 
interface SearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Search = (props: SearchProps) => {
  return (
    <div className="search  bg-(--color-secondary)">
        <div>
            <img src="search.svg" alt="search" />

            <input type="text" placeholder="Search through thousands of movies" 
            value={props.searchTerm}
            onChange={(e)=>props.setSearchTerm(e.target.value)}/>
        
        </div>
    </div> 
  )
}

export default Search