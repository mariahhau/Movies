import { ReactNode, useState } from "react";
import fetchData from "../service/ApiService";
import Result from "../Result";

interface Props {
  children?: ReactNode;
  setResults: (arr: Array<Result>) => void;
  setTitle: (title: string) => void;
}


function SearchBar({ setResults, setTitle }: Props) {
  const [input, setInput] = useState("");

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const results = await fetchData(input.toLowerCase());
    setTitle("Tulokset haulla " + input);
    const results2 = removeDuplicants(results); 
    setResults(results2);
  };

  const handleChange = (value: string) => {
    setInput(value);
    console.log(value);
  };

  return (
      <form className="inline-flex search-form" onSubmit={onFormSubmit}>
          <input
            type="search"
            className="form-control rounded-pill custom-search-input"
            id="searchInput"
            placeholder="Hae sarjoja tai elokuvia..."
            value={input}
            onChange={(e) => handleChange(e.target.value)}
          />
  
          {<button type="submit" className="btn btn-secondary rounded-pill custom-search-button" onClick={() => onFormSubmit}>
            <i className="fa fa-search search-icon"></i>
           
          </button>}
        
      </form>
      
    );

    
}

export default SearchBar;

const removeDuplicants = (items: Array<Result>) => {
  const unique = items.filter((obj: Result, index) => {
    return index === items.findIndex((o: any) => obj.imdbId === o.imdbId);
  });
  return unique;
}
