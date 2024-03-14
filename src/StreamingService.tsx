export default class StreamingService {
  id: string;
  name: string;
  homePage: string;
  themeColorCore: string;
  image: string;

  constructor(
    id: string,
    name: string,
    homePage: string,
    themeColorCode: string,
    image: string
  ) {
    this.id = id;
    this.name = name;
    this.homePage = homePage;
    this.themeColorCore = themeColorCode;
    this.image = image;
  }
}
