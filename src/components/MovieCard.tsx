import { useEffect, useState } from "react";
import Result from "../Result";
import MyButton from "./MyButton";

interface Props {
    item: Result;
    onSelectItem?: (item: Result) => void;
    addButton?: boolean;
}

function MovieCard ({item, onSelectItem, addButton=false}: Props) {
    const [selected, setSelected] = useState(false);
    const [description, setDescription] = useState("");
    const [imageSrc, setImageSrc] = useState("");

    useEffect(() => {
       
        const fetchData = async () => {
          
          const response = await fetch("http://localhost:4000/movieAPI/" + new URLSearchParams({"id": item.imdbId}), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
          const json = await response.json();
            setDescription(json.Plot);
            setImageSrc("https://picsum.photos/200/300")//json.Poster)
        }
       
        fetchData() 
          .catch(console.error);;
      }, [])


      const getShortDescription = function () {
        
        let i = description.length >= 200 ? 200 : description.length;
        let char = description[i]; 
        while (char !== ' ' && i > 0) {
            i--;
            char = description[i];
        }
        return description.toString().slice(0,i) + "...";
      }

      const getStreamingInfo = function (item: Result) {

        const unique = item.streamingInfo?.filter((obj: any, index) => {
          return index === item.streamingInfo?.findIndex((o: any) => obj.service === o.service);
        });
        return unique;
      }

    return (
        <li
                className={
                  selected
                    ? "list-group-item active"
                    : "list-group-item"
                }
                key={item.imdbId}
                onClick={() => {
                  setSelected(!selected);
                  if (onSelectItem) onSelectItem(item);
                }}
                value={JSON.stringify(item)}
              >
                <div className="row gx-1">
                  <div className="col">
                    <div className="card text-white bg-primary mb-3">
                      <div className="row gx-1">
                        <div className="col-12 col-md-4">
                          <img src={imageSrc} alt="" className={selected ? "card-img-top rounded-float-left" : "card-img-top rounded-float-left poster-closed"} loading="lazy" />
                        </div>
                        <div className="col">
                          <div className="card-body">

                            <h5 className="card-title">{item.title}</h5>
                            <h6 className="card-subtitle text-muted"> {item.startYear + "-" + item.endYear + " " + item.type}</h6>
                            <p className="card-text">

                              {selected? description : getShortDescription()}
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
}

export default MovieCard;

const msToDHMS = function (ms: number) {
    const days = Math.floor((ms) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms) / 1000 / 60 / 60 % 24);
    const minutes = Math.floor((ms) / 1000 / 60 % 60);
    const seconds = Math.floor((ms) / 1000 % 60);
  
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
    return "muutama sekunti";
  }
  