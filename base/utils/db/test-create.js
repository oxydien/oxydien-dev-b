import sqlite3 from "sqlite3";
import path from "path";
const path_to_db = path.join("../../", "database/channels.db");
console.log(path_to_db);
const db = new sqlite3.Database(path_to_db);

// db.run(`
//   CREATE TABLE video (
//     id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
//     videoId VARCHAR(13) NOT NULL,
//     playlistId VARCHAR(50),
//     channelId VARCHAR(50),
//     name VARCHAR(100),
//     description VARCHAR(5000),
//     publishTime DATETIME,
//     views INTEGER,
//     likes INTEGER,
//     tags VARCHAR(5000),
//     duration TIME
//   );
// `);

// db.run(`
//   CREATE TABLE playlist (
//     id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
//     playlistId VARCHAR(50),
//     channelId VARCHAR(50),
//     name VARCHAR(100),
//     description VARCHAR(5000),
//     publishTime DATETIME
//   );
// `);

db.run(`
  CREATE TABLE channel (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    channelId VARCHAR(50),
    name VARCHAR(100),
    description VARCHAR(5000),
    customUrl VARCHAR(100),
    profilePictureUrl VARCHAR(1000)
  );
`);
