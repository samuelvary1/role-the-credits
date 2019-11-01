import Cookies from "universal-cookie";
import Config from "../../config";

const AUTH_TOKEN_KEY = Config.get("API_KEY");
const cookies = new Cookies();

const addAuthHeader = (init: RequestInit): RequestInit => {
  const headers: Headers =
    init.headers instanceof Headers ? (init.headers as Headers) : new Headers();
  if (headers.get("Auth-token") !== null) {
    return init;
  }
  const token: string = cookies.get(AUTH_TOKEN_KEY) || "";
  if (token === "") {
    return init;
  }
  headers.set("apiKey", token);
  //headers.set('x-auth-token', token);
  return { ...init, headers };
};

/**
 * Copied from adserver 😅
 */
export default async (
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> => {
  const json = await fetch(input, addAuthHeader(init));
  if (!json.ok) {
    throw await json.json();
  }
  return json;
};
