import ListGroup from "../components/MovieList";
import { useState, useEffect } from "react";
import Result from "../Result";
import Header from "../components/Header";

export default function WatchListPage() {
  // const { setUserInfo, userInfo } = useContext(UserContext);
  const [watchList, setWatchList] = useState(Array<Result>);

  useEffect(() => {
    console.log("get watchlist");
    const getList = async (ev?: any) => {
      ev?.preventDefault();
      const response = await fetch("http://localhost:4000/watchlist", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        response.json().then((data) => {
          setWatchList(data);
          console.log(data, " data");
        });
      }
    };
    getList();
  }, []);

  return (
    <div>
      {/* onChange={getList}>*/}
      <Header />
      <ListGroup
        items={watchList}
        heading="Oma lista"
        buttonType="delete"
        buttonText="Poista"
      ></ListGroup>
    </div>
  );
}
