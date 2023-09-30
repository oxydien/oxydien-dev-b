import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { resolveAliasPath } from "./keys_json.js";
import { DEBUG, ERROR, LOG } from "./logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export function setupDatabases() {
  DEBUG("Checking databases!");
  const databasesPath = path.join(__dirname, "../database");

  if (!fs.existsSync(databasesPath)) {
    fs.mkdirSync(databasesPath);
  }

  const channelsDb = new sqlite3.Database(
    path.join(databasesPath, "channels.db")
  );
  const playlistsDb = new sqlite3.Database(
    path.join(databasesPath, "playlists.db")
  );
  const videosDb = new sqlite3.Database(path.join(databasesPath, "videos.db"));

  channelsDb.run(
    `CREATE TABLE IF NOT EXISTS channel(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    channelId VARCHAR(50),
    name VARCHAR(100),
    description VARCHAR(5000),
    customUrl VARCHAR(100),
    profilePictureUrl VARCHAR(1000)
  )`,
    (err) => {
      if (err) {
        ERROR("Error creating channels table:", err);
      } else {
        LOG("Channels table created successfully.");
      }
    }
  );

  playlistsDb.run(
    `CREATE TABLE IF NOT EXISTS playlist(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    playlistId VARCHAR(50),
    channelId VARCHAR(50),
    name VARCHAR(100),
    description VARCHAR(5000),
    publishTime DATETIME
  )`,
    (err) => {
      if (err) {
        ERROR("Error creating playlists table:", err);
      } else {
        LOG("Playlists table created successfully.");
      }
    }
  );

  videosDb.run(
    `CREATE TABLE IF NOT EXISTS video(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    videoId VARCHAR(13) NOT NULL,
    playlistId VARCHAR(50),
    channelId VARCHAR(50),
    name VARCHAR(100),
    description VARCHAR(5000),
    publishTime DATETIME,
    views INTEGER,
    likes INTEGER,
    tags VARCHAR(5000),
    duration TIME
  )`,
    (err) => {
      if (err) {
        ERROR("Error creating videos table:", err);
      } else {
        LOG("Videos table created successfully.");
      }
    }
  );

  channelsDb.close();
  playlistsDb.close();
  videosDb.close();
}
