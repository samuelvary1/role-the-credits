import { AnyObject } from "../../utils/jsonHydration";

export interface Movie {
 Title: string;
 Year: string;
 Rated: string;
 Released: string;
 Runtime: string;
 Genre: string;
 Director: string;
 Writer: string;
 Actors: string;
 Plot: string;
 Language: string;
 Country: string;
 Awards: string;
 Poster: string;
 Ratings: AnyObject[];
 Metascore: string;
 imdbRating: string;
 imdbVotes: string;
 imdbID: string;
 Type: string;
 DVD: string;
 BoxOffice: string;
 Production: string;
 Website: string;
 Response: boolean;
}

export const makeMovie = (
	Title: string = '',
	Year: string = '',
	Rated: string = '',
	Released: string = '',
	Runtime: string = '',
	Genre: string = '',
	Director: string = '',
	Writer: string = '',
	Actors: string = '',
	Plot: string = '',
	Language: string = '',
	Country: string = '',
	Awards: string = '',
	Poster: string = '',
	Ratings: AnyObject[],
	Metascore: string = '',
	imdbRating: string = '',
	imdbVotes: string = '',
	imdbID: string = '',
	Type: string = '',
	DVD: string = '',
	BoxOffice: string = '',
	Production: string = '',
	Website: string = '',
	Response: boolean = true
): Movie => ({
	Title,
	Year,
	Rated,
	Released,
	Runtime,
	Genre,
	Director,
	Writer,
	Actors,
	Plot,
	Language,
	Country,
	Awards,
	Poster,
	Ratings,
	Metascore,
	imdbRating,
	imdbVotes,
	imdbID,
	Type,
	DVD,
	BoxOffice,
	Production,
	Website,
	Response
})