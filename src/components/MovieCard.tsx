import { useEffect, useState } from "react";
import Result from "../Result";
import CardButton from "./CardButton";

interface Props {
  item: Result;
  onSelectItem?: (item: Result) => void;
  buttonType?: "add" | "delete" | "watched";
  buttonText?: string;
  view: boolean;
}

function MovieCard({
  item,
  onSelectItem,
  buttonType,
  buttonText = "",
  view,
}: Props) {
  const [selected, setSelected] = useState(false);
  const [description, setDescription] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    console.log("MovieCard view=", view);
    if (!view) return;
    const fetchData = async () => {
      const response = await fetch(
        "http://localhost:4000/movieAPI/" +
          new URLSearchParams({ id: item.imdbId }),
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const json = await response.json();
      setDescription(json.Plot);
      setImageSrc(json.Poster); //"https://picsum.photos/200/300"); //json.Poster)
    };

    fetchData().catch(console.error);
  }, [view]);

  const getShortDescription = function () {
    let i = description.length >= 200 ? 200 : description.length;
    let char = description[i];
    while (char !== " " && i > 0) {
      i--;
      char = description[i];
    }
    return description.toString().slice(0, i) + "...";
  };

  const deleteFromWatchlist = async () => {
    const response = await fetch("http://localhost:4000/saved", {
      method: "DELETE",
      body: JSON.stringify(item),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    setHidden(true);
    console.log(response);
  };

  const addToWatchlist = async () => {
    const response = await fetch("http://localhost:4000/saved", {
      method: "POST",
      body: JSON.stringify(item),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    console.log(response);
  };

  const addButtons = function () {
    if (!buttonType) return "";
    if (buttonType === "add") {
      return (
        <div className="col-1">
          <CardButton handleClick={addToWatchlist} text={buttonText} />
        </div>
      );
    } else if (buttonType === "delete") {
      return (
        <div className="col-1">
          <CardButton handleClick={deleteFromWatchlist} text={buttonText} />
        </div>
      );
    }
  };

  const getStreamingInfo = function (item: Result) {
    const unique = item.streamingInfo?.filter((obj: any, index) => {
      return (
        index ===
        item.streamingInfo?.findIndex((o: any) => obj.service === o.service)
      );
    });
    return unique;
  };

  if (hidden) return "";
  return (
    <li
      className={selected ? "list-group-item active" : "list-group-item"}
      key={item.imdbId}
      onClick={(e) => {
        if (
          e.target instanceof HTMLButtonElement == false &&
          e.target instanceof HTMLAnchorElement == false
        ) {
          setSelected(!selected);
        }
        if (onSelectItem) onSelectItem(item);
      }}
      value={JSON.stringify(item)}
    >
      <div className="row gx-1">
        <div className="col">
          <div className="card text-white bg-primary mb-3">
            <div className="row gx-1">
              {(view == true || selected) && (
                <div className="col-12 col-md-4">
                  <img
                    src={imageSrc}
                    alt=""
                    className={
                      selected
                        ? "card-img-top rounded-float-left"
                        : "card-img-top rounded-float-left poster-closed"
                    }
                    loading="lazy"
                  />
                </div>
              )}
              <div className="col">
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <h6 className="card-subtitle text-muted">
                    {" "}
                    {item.startYear + "-" + item.endYear + " " + item.type}
                  </h6>
                  {(view == true || selected) && (
                    <p className="card-text">
                      {selected ? description : getShortDescription()}
                    </p>
                  )}
                  <ul className="list-group list-group-horizontal">
                    {item.streamingInfo.length > 0
                      ? getStreamingInfo(item).map((item: any) => (
                          <li key={item.service} className="list-group-item">
                            <a href={item.link}>{item.service}</a>
                          </li>
                        ))
                      : "-"}
                  </ul>
                  <p className="card-text">
                    <small className="text-muted">
                      Päivitetty{" "}
                      {formatDHMS(
                        msToDHMS(Date.now() - parseInt(item.fetchedAt))
                      )}{" "}
                      sitten
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {addButtons()}
      </div>
    </li>
  );
}

export default MovieCard;

const msToDHMS = function (ms: number) {
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms / 1000 / 60 / 60) % 24);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  const seconds = Math.floor((ms / 1000) % 60);

  return [
    days.toString().padStart(2, "0"),
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
};

const formatDHMS = function (dhms: string) {
  //console.log(dhms);
  const parts = dhms.split(":", 4);
  const text = ["päivää", "tuntia ", "minuuttia", "sekuntia"];

  for (let i = 0; i < 4; i++) {
    if (parts[i] !== "00") {
      return parseInt(parts[i]) + " " + text[i];
    }
  }
  return "muutama sekunti";
};
