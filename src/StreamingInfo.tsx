export default class StreamingInfo {
    service: string;
    streamingType: string;
    link: string;

    constructor (service: string, streamingType: string, link: string) {
        this.service= service;
        this.streamingType = streamingType;
        this.link = link;
                
    }
}
