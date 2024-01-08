import SearchBar from "../components/SearchBar"
import ListGroup from "../components/ListGroup"
import { useContext, useEffect, useState } from "react";
import Result from "../Result";
import { UserContext } from "../UserContext";
import Header from "../Header";

import fetchData from "../service/ApiService";


export default function IndexPage() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [searchResults, setSearchResults] = useState(Array<Result>)
  const [clickHistory, setClickHistory] = useState(Array<Result>);
  const [resultsTitle, setResultsTitle] = useState("");

  const handleSelectItem = (item: Result) => {
    let arr = [...clickHistory];
    if (arr.indexOf(item) < 0) {
      arr.unshift(item);
      arr = arr.slice(0, 10);
      setClickHistory(arr);
    }
  };

  
  const username = userInfo?.username;
  console.log("username", username)
  return (
    <><Header>
      <SearchBar  setResults={setSearchResults} setTitle={setResultsTitle} /> </Header>
      <div className="col">
        <ListGroup
          addButton={username ? true : false}
          items={searchResults}
          heading={resultsTitle}
          onSelectItem={handleSelectItem}>
          
        </ListGroup>
      </div>

      <ListGroup
        items={clickHistory}
        heading="Aiemmin katsellut"
      /></>
  )
}
