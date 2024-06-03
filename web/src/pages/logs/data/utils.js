export let LogLevel;
(function (LogLevel) {
  LogLevel["emerg"] = "critical";
  LogLevel["fatal"] = "critical";
  LogLevel["alert"] = "critical";
  LogLevel["crit"] = "critical";
  LogLevel["critical"] = "critical";
  LogLevel["warn"] = "warning";
  LogLevel["warning"] = "warning";
  LogLevel["err"] = "error";
  LogLevel["eror"] = "error";
  LogLevel["error"] = "error";
  LogLevel["info"] = "info";
  LogLevel["information"] = "info";
  LogLevel["informational"] = "info";
  LogLevel["notice"] = "info";
  LogLevel["dbug"] = "debug";
  LogLevel["debug"] = "debug";
  LogLevel["trace"] = "trace";
  LogLevel["unknown"] = "unknown";
})(LogLevel || (LogLevel = {}));

export const getLogLevel = (line) => {
  if (!line) {
    return LogLevel.unknown;
  }
  let level = LogLevel.unknown;
  let currentIndex = undefined;

  for (const [key, value] of Object.entries(LogLevel)) {
    const regexp = new RegExp(`\\b${key}\\b`, "i");
    const result = regexp.exec(line);
    if (result) {
      if (currentIndex === undefined || result.index < currentIndex) {
        level = value;
        currentIndex = result.index;
      }
    }
  }
  return level;
};

export const getLogLevelColors = (logLevel) => {
  switch (logLevel) {
    case LogLevel.crit:
    case LogLevel.critical:
      // return "#705da0";
      return "#907aa9";
    case LogLevel.error:
    case LogLevel.err:
      // return "#e24d42";
      return "#d7827e";
    case LogLevel.warning:
    case LogLevel.warn:
      // return "#ff9900";
      return "#ea9d34";
    case LogLevel.info:
      // return "#7eb26d";
      return "#82ca9d";
    case LogLevel.debug:
      // return "#1f78c1";
      return "#3e8fb0";
    case LogLevel.trace:
      return "#6ed0e0";
  }
  // return "#ececec"
  return "#9893a5";
};

export const getLogLevelStyles = (logLevel) => {
  switch (logLevel) {
    case LogLevel.crit:
    case LogLevel.critical:
      // return "h-full w-0 rounded-lg border-4 border-[#705da0]";
      return "h-full w-0 rounded-lg border-4 border-[#907aa9]";
    case LogLevel.error:
    case LogLevel.err:
      // return "h-full w-0 rounded-lg border-4 border-[#e24d42]";
      return "h-full w-0 rounded-lg border-4 border-[#d7827e]";
    case LogLevel.warning:
    case LogLevel.warn:
      // return "h-full w-0 rounded-lg border-4 border-[#ff9900]";
      return "h-full w-0 rounded-lg border-4 border-[#ea9d34]";
    case LogLevel.info:
      // return "h-full w-0 rounded-lg border-4 border-[#7eb26d]";
      return "h-full w-0 rounded-lg border-4 border-[#82ca9d]";
    case LogLevel.debug:
      // return "h-full w-0 rounded-lg border-4 border-[#1f78c1]";
      return "h-full w-0 rounded-lg border-4 border-[#3e8fb0]";
    case LogLevel.trace:
      return "h-full w-0 rounded-lg border-4 border-[#6ed0e0]";
  }
  // return "h-full w-0 rounded-lg border-4 w-0 border-[#ececec]";
  return "h-full w-0 rounded-lg border-4 w-0 border-[#9893a5]";
};
