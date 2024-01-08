import { ReactNode, useState } from "react";
import Result from "../Result";
import MyButton from "./MyButton";

interface Props {
  items: Array<Result>;
  heading: string;
  onSelectItem?: (item: Result) => void;
  children?: ReactNode;
  addButton?: boolean;
}

function ListGroup({ items, heading, onSelectItem, children, addButton = false }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const message =
    items.length === 0 ? <p>No item found (const message)</p> : null;

  const getMessage = () => {
    return items.length === 0 ? <p>-</p> : null;
  };

  const getStreamingInfo = function (item: Result) {

    const unique = item.streamingInfo?.filter((obj: any, index) => {
      return index === item.streamingInfo?.findIndex((o: any) => obj.service === o.service);
    });
    return unique;
  }


  const getLongInfo = function () {
    return "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
  }

  // const getYearAndType = function (start: string, end: string, type: string) {
  //   if (type === "movie") {
  //   }
  // }


  return (
    <>
      <h1>{heading}</h1>
      <ul className="list-group list-group-flush">
        {getMessage()}
        {items.map((item, index) => {
          if (item != null)
            return (

              <li
                className={
                  selectedIndex === index
                    ? "list-group-item active"
                    : "list-group-item"
                }
                key={item.imdbId}
                onClick={() => {
                  setSelectedIndex(index);
                  if (onSelectItem) onSelectItem(item);
                }}
                value={JSON.stringify(item)}
              >
                <div className="row gx-1">
                  <div className="col">
                    <div className="card text-white bg-primary mb-3">
                      <div className="row gx-1">
                        <div className="col-12 col-md-4">
                          <img src="https://picsum.photos/300/200" alt="" className="card-img-top rounded-float-left" />
                        </div>
                        <div className="col">
                          <div className="card-body">

                            <h5 className="card-title">{item.title}</h5>
                            <h6 className="card-subtitle text-muted"> {item.startYear + "-" + item.endYear + " " + item.type}</h6>
                            <p className="card-text">

                              {selectedIndex === index ? getLongInfo() : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                            </p>
                            <p className="fs-6">Katsottavissa:</p>
                            <ul className="list-group list-group-horizontal">

                              {item.streamingInfo.length > 0 ? getStreamingInfo(item).map((item: any) => <li className="list-group-item" key={item.service}><a href={item.link}>{item.service}</a></li>) : "-"}
                            </ul>
                            <p className="card-text">
                              <small className="text-muted">Päivitetty {formatDHMS(msToDHMS(Date.now() - parseInt(item.fetchedAt)))} sitten</small>
                            </p>

                          </div></div>

                      </div>

                    </div>
                  </div>
                  {addButton && <div className="col-1"><MyButton data={JSON.stringify(item)}>Lisää</MyButton></div>}

                </div>
              </li>
            )
        })}

      </ul>
    </>
  );
}

export default ListGroup;


const msToDHMS = function (ms: number) {

  console.log(ms)
  const days = Math.floor((ms) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms) / 1000 / 60 / 60 % 24);
  const minutes = Math.floor((ms) / 1000 / 60 % 60);
  const seconds = Math.floor((ms) / 1000 % 60);



  console.log(days)
  return [
    days.toString().padStart(2, "0"),
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0")
  ].join(":");
}

const formatDHMS = function (dhms: string) {
  console.log(dhms)
  const parts = dhms.split(":", 4);
  const text = ["päivää", "tuntia ", "minuuttia", "sekuntia"];

  for (let i = 0; i < 4; i++) {
    if (parts[i] !== "00") {
      return parseInt(parts[i]) + " " + text[i];
    }
  }
  console.log(parts)
  return "muutama sekunti";
  // 
}
