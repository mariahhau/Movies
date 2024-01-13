interface Props {
  color?: "primary" | "secondary" | "dark";
  text: string
  handleClick : (e: any) => void;
}

function CardButton({color = "primary", text, handleClick}: Props) {

  return (
    <button className={"btn btn-" + color} onClick={e => handleClick(e)}>
      {text}
    </button>
  );
  
}

export default CardButton;
