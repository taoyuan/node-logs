import _ = require("lodash");
import { Library, LoggingOptions } from "../logs";
import { Logger, LoggerOptions } from "pino";

export function initialize(library: Library, settings: LoggerOptions) {

  const pino = require("pino");

  let defaults: LoggerOptions = {};
  try {
    require("pino-pretty");
    defaults.prettyPrint = {
      colorize: true,
      translateTime: "SYS:standard"
    };
  } catch (e) {

  }

  settings = _.cloneDeep(_.defaults(defaults, settings));
  settings.level = settings.level || "info";

  library.provider = {
    setLevel: function(level) {
      settings.level = level;
    },
    getLogger: function(name: string, options: LoggingOptions) {
      if (options.parent) {
        return (<Logger>options.parent).child({ name, level: settings.level });
      }
      return pino({ ...settings, name, ...options });
    }
  };
}
