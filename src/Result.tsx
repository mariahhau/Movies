import StreamingInfo from "./StreamingInfo";

export default class Result {
    title: string;
    imdbId: string;
    startYear: number;
    endYear: number;
    streamingInfo: Array<StreamingInfo>
    type: string;
    fetchedAt: string;

    constructor(title: string, imdbId: string, startYear: number, endYear: number, platforms: Array<StreamingInfo>, type: string,  fetchedAt: string){
        this.title = title;
        this.imdbId = imdbId;
        this.startYear = startYear;
        this.endYear = endYear;
        this.streamingInfo = platforms;
        this.type = type;
        this.fetchedAt = fetchedAt;
    }

    getData(): string {
        return "{" + "title: " + this.title
        + " , imdbId: " + this.imdbId
        + " , startYear: " + this.startYear
        + " , endYear: " + this.endYear 
        + " , type: " + this.type
        + " , streamingInfo: " + this.streamingInfo.toString() + "}" ;
    } 
} 