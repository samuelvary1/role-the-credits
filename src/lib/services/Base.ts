import Config from "../../config";

export default abstract class Base {
  protected readonly apiUrl: string;
  protected readonly apiKey: string;

  protected constructor() {
    this.apiUrl = Config.get("API_URL");
    this.apiKey = Config.get("API_KEY");
  }
}
