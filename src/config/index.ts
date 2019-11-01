/**
 * Publicly accessed keys that will map to the config object.
 *
 * @internal
 */
interface ConfigKeys {
  API_URL: string;
  // Code Integration env sets CI env variable to true to disable file watchers.
  ENV: "production" | "sand" | "local" | "ci";
  // Cookie name for authentication. Hard-coding this for now I guess?
  API_KEY: "3f5f7794";
  // Domain where auth cookie is expected to be set.
  API_KEY_DOMAIN: string;
  // Raven DSN
  RAVEN_DSN: string;
}

/**
 * create-react-app will only set variables prefixed with REACT_APP_ to the process.env object.
 * @type {string}
 */
export default class Config {
  private static readonly prefix: string = "REACT_APP_";

  public static get(key: keyof ConfigKeys): string {
    return process.env[Config.prefix + key] || "";
  }
}
