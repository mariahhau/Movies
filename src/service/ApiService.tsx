import { default as axios } from "axios";
import Result from "../Result";
import StreamingInfo from "../StreamingInfo";

const fetchData = async (value: string) => {

  try {
    console.log("API call")
    const response = await fetch('http://localhost:4000/streamingAPI', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: value })
    });
    
    const results = await response.json();
    
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
