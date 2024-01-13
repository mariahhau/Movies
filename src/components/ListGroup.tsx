import { ReactNode, useState } from "react";
import Result from "../Result";
import MovieCard from "./MovieCard";

interface Props {
  items: Array<Result>;
  heading: string;
  onSelectItem?: (item: Result) => void;
  children?: ReactNode;
  buttonText?: string;
  buttonType?: "add" | "delete" | "watched"
}

function ListGroup({ items, heading, onSelectItem, buttonType,buttonText="" }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const message =
    items.length === 0 ? <p>No item found (const message)</p> : null;

  const getMessage = () => {
    return items.length === 0 ? <p>-</p> : null;
  };

  return (
    <>
      <h1>{heading}</h1>
      <ul className="list-group list-group-flush">
        {getMessage()}
        {items.map((item, index) => {
          if (item != null)
            return (
              <MovieCard buttonType={buttonType} item={item} buttonText={buttonText}/>
            )
        })}

      </ul>
    </>
  );
}

export default ListGroup;
