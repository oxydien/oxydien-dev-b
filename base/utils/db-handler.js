import sqlite3 from "sqlite3";
import path from "path";
import { resolveAliasPath } from "./keys_json.js";

/**
 * Executes query in filename and then returns it as JSON or error...
 * @param {String} query - Sql query that will be executed in tha database.
 * @param {String} params - Params to the SQL query...
 * @param {String} filename - The database filename (without '.db').
 * @param {Function} callback - This will be executed with the response from database as object containing error (or null) and data as JSON
 */
export function getJsonFromQuery(query, params, filename, callback) {
  try {
    const dbPath = path.join(resolveAliasPath("@databases"), `${filename}.db`);
    const db = new sqlite3.Database(dbPath);

    db.serialize(() => {
      db.all(query, params, (error, rows) => {
        if (error) {
          callback(error);
        } else {
          callback(null, rows);
        }
      });
    });
    db.close();
  } catch (e) {
    callback(e);
  }
}
