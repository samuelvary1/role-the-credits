import Base from "../Base";
import fetch from "../Fetch"
import { makeMovie, Movie } from "../../entities/Movie";
import { jsonHydrateEntity } from "../../../utils/jsonHydration";

class MovieService extends Base {
  public constructor() {
    super();
  }

  async fetchMovie(Title: string = "", init: RequestInit = {}): Promise<Movie> {
    try {
      const resp = await fetch(`${this.apiUrl}/?apikey=${this.apiKey}${Title ? `&t=${Title}` : ''}`, {
        ...init,
        method: 'GET'
      });

      const { movie } = await resp.json();

      const value = jsonHydrateEntity(movie, makeMovie());

      return value;
    } catch (e) {
      if (e.error_details) {
        throw e.error_details;
      }
      throw new Error(e.message || 'Unknown error.');
    }
  }
}

export default new MovieService();
