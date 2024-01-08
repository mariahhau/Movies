import SearchBar from "../components/SearchBar"
import ListGroup from "../components/ListGroup"
import { useContext, useState, useEffect } from "react";
import Result from "../Result";
import MyButton from "../components/MyButton";
import { UserContext } from "../UserContext";
import Header from "../Header";



export default function WatchListPage() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [watchList, setWatchList] = useState(Array<Result>);

  useEffect(() => {

    getList();

  }, []);
  async function getList(ev?: any) {
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
  }



  return (
    <div onChange={getList}>
      <Header />
      <ListGroup
        items={watchList}
        heading="Oma lista"
      >
      </ListGroup>
    </div>
  )
}
