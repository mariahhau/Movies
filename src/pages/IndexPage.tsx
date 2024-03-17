import SearchBar from "../components/SearchBar";
import MovieList from "../components/MovieList";
import { useContext, useEffect, useState } from "react";
import Result from "../Result";
import { UserContext } from "../UserContext";
import Header from "../components/Header";
import { useSearchParams } from "react-router-dom";
import Statistics, { Statistic } from "../components/Statistics";
import axios from "axios";

export default function IndexPage() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [searchResults, setSearchResults] = useState(Array<Result>);
  const [clickHistory, setClickHistory] = useState(Array<Result>);
  const [resultsTitle, setResultsTitle] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [stats, setStats] = useState<Statistic | null>(null);
  const q = searchParams.get("q");

  useEffect(() => {
    axios.get("http://localhost:4000/stats").then((response: any) => {
      console.log(response.data, " set stats...");
      setStats(response.data);
    });
  }, []);

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
      <Statistics stats={stats}></Statistics>
      <Header>
        <SearchBar
          setStats={setStats}
          setResults={setSearchResults}
          setTitle={setResultsTitle}
          q={q}
        />
      </Header>
      <div className="col">
        <MovieList
          buttonType={username ? "add" : undefined}
          items={searchResults}
          heading={resultsTitle}
          onSelectItem={handleSelectItem}
          buttonText="Lisää"
        ></MovieList>
      </div>

      {/* <MovieList items={clickHistory} heading="Aiemmin katsellut" /> */}
    </>
  );
}
