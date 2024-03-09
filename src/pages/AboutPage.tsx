import Header from "../Header";

export default function AboutPage() {
  return (
    <>
      <Header />
      The streaming availability information is provided by
      <a href="https://www.movieofthenight.com/about/api">
        {" "}
        Streaming Availability API by Movie of the Night
      </a>
      <br></br>
      This website uses <a href="http://www.omdbapi.com/">OMDb API</a> but is
      not endorsed, certified, or otherwise approved by omdbapi.com.
    </>
  );
}
