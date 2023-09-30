import { resolveAliasPath } from "./keys_json.js";
import chalk from "chalk";
import fs from "fs";
import path from "path";

const logLevels = {
  INFO: "info",
  DEBUG: "debug",
  WARN: "warn",
  ERROR: "error",
};

const logColors = {
  [logLevels.INFO]: chalk.green,
  [logLevels.DEBUG]: chalk.blue,
  [logLevels.WARN]: chalk.yellow,
  [logLevels.ERROR]: chalk.red,
};

const logsDir = resolveAliasPath("@logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logFilePath = path.join(logsDir, "app.log");

const log = (level, message, ...args) => {
  if (process.env.LOG_LEVEL && process.env.LOG_LEVEL !== level) return;

  const dateTime = new Date().toLocaleString();
  const logLevelColor = logColors[level] || chalk.white;
  const timestampColor = chalk.gray;
  const coloredLogMessage = `[${timestampColor(dateTime)}] (${logLevelColor(
    level
  )}): ${message}`;
  const logMessage = `[${dateTime}] (${level}): ${message}`;
  console.log(coloredLogMessage, ...args);

  fs.appendFile(logFilePath, logMessage + " " + args + "\n", (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
};

export function clearLog() {
  fs.writeFileSync(logFilePath, "");
}

export const LOG = (message, ...args) => log(logLevels.INFO, message, ...args);
export const DEBUG = (message, ...args) =>
  log(logLevels.DEBUG, message, ...args);
export const WARN = (message, ...args) => log(logLevels.WARN, message, ...args);
export const ERROR = (message, ...args) =>
  log(logLevels.ERROR, message, ...args);
