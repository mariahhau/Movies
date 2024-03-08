import SearchBar from "../components/SearchBar";
import ListGroup from "../components/ListGroup";
import { useContext, useEffect, useState } from "react";
import Result from "../Result";
import { UserContext } from "../UserContext";
import Header from "../Header";
import { useSearchParams } from "react-router-dom";

export default function IndexPage() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [searchResults, setSearchResults] = useState(Array<Result>);
  const [clickHistory, setClickHistory] = useState(Array<Result>);
  const [resultsTitle, setResultsTitle] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q");

  const handleSelectItem = (item: Result) => {
    let arr = [...clickHistory];
    if (arr.indexOf(item) < 0) {
      arr.unshift(item);
      arr = arr.slice(0, 10);
      setClickHistory(arr);
    }
  };

  const username = userInfo?.username;
  console.log("username", username);
  return (
    <>
      <Header>
        <SearchBar
          setResults={setSearchResults}
          setTitle={setResultsTitle}
          q={q}
        />
      </Header>
      <div className="col">
        <ListGroup
          buttonType={username ? "add" : undefined}
          items={searchResults}
          heading={resultsTitle}
          onSelectItem={handleSelectItem}
          buttonText="Lisää"
        ></ListGroup>
      </div>

      <ListGroup items={clickHistory} heading="Aiemmin katsellut" />
    </>
  );
}
