interface Props {
  children: string;
  color?: "primary" | "secondary" | "dark";
  data?: string;
}

function MyButton({ children,  color = "primary" , data}: Props) {

  const handleClick = async (e: any) => {
    // const data = e.target.parentElement.getAttribute("value")
      console.log(data, " data", e.target.parentElement)
    const response = await fetch ('http://localhost:4000/saved', {
      method: 'POST',
      body: data,
      headers: { "Content-Type": "application/json" },
      credentials: 'include'
    });
    console.log(response)
  }
  
  return (
    <button className={"btn btn-" + color} onClick={e => handleClick(e)}>
      {children}
    </button>
  );
  
}

export default MyButton;
