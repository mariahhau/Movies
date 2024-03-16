import { ReactNode, useState } from "react";
import Result from "../Result";
import MovieCard from "./MovieCard";
import ListFilterGroup from "./ListFilterGroup";

interface Props {
  items: Array<Result>;
  heading: string;
  onSelectItem?: (item: Result) => void;
  children?: ReactNode;
  buttonText?: string;
  buttonType?: "add" | "delete" | "watched";
}

interface TypeFilter {
  movies: boolean;
  series: boolean;
}

interface serviceFilter {
  apple: boolean;
  curiosity: boolean;
  disney: boolean;
  hbo: boolean;
  mubi: boolean;
  netflix: boolean;
  prime: boolean;
  zee5: boolean;
}

function MovieList({
  items,
  heading,
  onSelectItem,
  buttonType,
  buttonText = "",
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [cardView, setCardView] = useState(true);
  const [moviesChecked, setMoviesChecked] = useState(true);
  const [seriesChecked, setSeriesChecked] = useState(true);
  const [platforms, setPlatforms] = useState({
    unknown: true,
    apple: true,
    curiosity: true,
    disney: true,
    hbo: true,
    mubi: true,
    netflix: true,
    prime: true,
    zee5: true,
  });

  const handleTypeChange = (event: any) => {
    if (event.target.value === "movies") {
      setMoviesChecked(!moviesChecked);
    } else if (event.target.value === "series") {
      setSeriesChecked(!seriesChecked);
    }
  };

  const handlePlatformClick = (event: any) => {
    console.log(event, event.target);
    const key = event.target.value as keyof serviceFilter;
    const stateCopy = { ...platforms, [key]: !platforms[key] };
    setPlatforms(stateCopy);
  };

  const message =
    items.length === 0 ? <p>No item found (const message)</p> : null;

  const getMessage = () => {
    return items.length === 0 ? <p>-</p> : null;
  };

  return (
    <>
      <h1 className="p-2">{heading}</h1>
      {items.length > 0 ? (
        <div>
          <button
            className={"btn btn-primary "}
            onClick={(e) => setCardView(!cardView)}
            style={{ margin: 2 }}
          >
            {cardView ? `Piilota lisätiedot` : `Näytä lisätiedot`}
          </button>

          <div>
            <label>
              <input
                className=""
                type="checkbox"
                value={"movies"}
                checked={moviesChecked}
                onChange={handleTypeChange}
              />
              Elokuvat
            </label>
            <label>
              <input
                className=""
                type="checkbox"
                value={"series"}
                checked={seriesChecked}
                onChange={handleTypeChange}
              />
              Sarjat
            </label>
            <div className="btn-group">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false"
              >
                Palvelut
              </button>
              <ul className="dropdown-menu">
                {Object.keys(platforms).map((key) => (
                  <li key={key}>
                    <button
                      onClick={handlePlatformClick}
                      className={"dropdown-item"}
                      type="button"
                      value={key}
                    >
                      {key}{" "}
                      {platforms[key as keyof serviceFilter] ? (
                        <>&#9989;</>
                      ) : (
                        ""
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <ul className="list-group list-group-flush">
        {getMessage()}
        {items
          .filter((item, index) => {
            return filterCard(
              item,
              {
                movies: moviesChecked,
                series: seriesChecked,
              },
              platforms
            );
          })
          .map((item) => {
            console.log("item ", item);
            return (
              <MovieCard
                key={item.imdbId}
                buttonType={buttonType}
                item={item}
                buttonText={buttonText}
                view={cardView}
              />
            );
          })}
      </ul>
    </>
  );
}

export default MovieList;

const filterCard = (
  item: Result,
  typeF: TypeFilter,
  platformF: serviceFilter
) => {
  if (typeF.movies === false && item.type === "movie") return false;
  if (typeF.series === false && item.type === "series") return false;
  const checkedServices = Object.keys(platformF).filter(
    (key) => platformF[key as keyof serviceFilter] === true
  );

  if (item.streamingInfo.length == 0) {
    if (checkedServices.includes("unknown")) {
      return true;
    }
  }

  if (
    item.streamingInfo.find((streamingInfo) =>
      checkedServices.includes(streamingInfo.service)
    ) === undefined
  )
    return false;

  return true;
};
