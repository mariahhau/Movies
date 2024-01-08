import { default as axios } from "axios";
import Result from "../Result";
import StreamingInfo from "../StreamingInfo";

const fetchData = async (value: string) => {
 
  const options = {
    method: "GET",
    url: "https://streaming-availability.p.rapidapi.com/search/title",
    params: {
      title: value,
      country: "fi",
      show_type: "all",
      output_language: "en",
    },
    headers: {
      "X-RapidAPI-Key": your_api_key,
      "X-RapidAPI-Host": "streaming-availability.p.rapidapi.com",
    },
  };

  try {
    console.log("API call")
    const res = await axios.request(options);
    console.log(res.data.result);
    const results = res.data.result;
    
    const newResults = results.map((res: any) => {
      let yearStart = 0;
      let yearEnd = 0;
      if (res.hasOwnProperty("year")){
        yearStart = res.year;
        yearEnd = res.year;
      }
      if (res.hasOwnProperty("firstAirYear")){
        yearStart = res.firstAirYear;
      }
      if (res.hasOwnProperty("lastAirYear")){
        yearEnd = res.lastAirYear;
      }
      const streamInfo = new Array<StreamingInfo>;
      if (res.streamingInfo && res.streamingInfo.fi) {
        res.streamingInfo.fi.forEach((obj: any) => {
          streamInfo.push(new StreamingInfo(obj.service, obj.streamingType, obj.link))
        })

      }

      const r = new Result(res.title, res.imdbId, yearStart, yearEnd, streamInfo, res.type, Date.now().toString());
    
      const oldCache = JSON.parse(localStorage.getItem("cached") || '[]');
      oldCache.push(r)
      
      localStorage.setItem("cached", (JSON.stringify(oldCache)));
     
      return r;
    });
      
    return newResults;
  } catch (error) {
    console.error(error);
  }
};

export default fetchData;
