import { ReactNode, useEffect, useState } from "react";
import fetchData from "../service/ApiService";
import Result from "../Result";
import { useSearchParams } from "react-router-dom";

interface Props {
  children?: ReactNode;
  setResults: (arr: Array<Result>) => void;
  setTitle: (title: string) => void;
  q?: string | null;
}

function SearchBar({ setResults, setTitle, q }: Props) {
  const [input, setInput] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (q) {
      getSearchResults(q);
    }
  }, []);

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submit, fetchData call to ApiService from SearchBar");
    getSearchResults(input.toLowerCase());
    /*const results = await fetchData(input.toLowerCase());
    setTitle("Tulokset haulla " + input);
    const results2 = removeDuplicants(results);
    setResults(results2);
    setSearchParams({ q: input });*/
  };

  const getSearchResults = async (keyword: string) => {
    console.log("Get search results - searchbar");
    const results = await fetchData(keyword);
    setTitle("Tulokset haulla " + keyword);
    const results2 = removeDuplicants(results);
    setResults(results2);
    setSearchParams({ q: keyword });
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

      {
        <button
          type="submit"
          className="btn btn-secondary rounded-pill custom-search-button"
          onClick={() => onFormSubmit}
        >
          <i className="fa fa-search search-icon"></i>
        </button>
      }
    </form>
  );
}

export default SearchBar;

const removeDuplicants = (items: Array<Result>) => {
  const unique = items.filter((obj: Result, index) => {
    return index === items.findIndex((o: any) => obj.imdbId === o.imdbId);
  });
  return unique;
};
