import axios from "axios";
import sqlite3 from "sqlite3";
import path from "path";
import { resolveAliasPath, ytKey } from "../../../base/utils/keys_json.js";
import { DEBUG, ERROR } from "../../../base/utils/logger.js";

export async function updatePlaylists(channelId) {
  const db = new sqlite3.Database(
    path.join(resolveAliasPath("@databases"), "playlists.db")
  );
  const dbVideos = new sqlite3.Database(
    path.join(resolveAliasPath("@databases"), "videos.db")
  );
  // Get all existing playlists for this channel from the database
  const existingPlaylists = await new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM playlist WHERE channelId = ?",
      [channelId],
      (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      }
    );
  });

  // Get all playlists for this channel from the YouTube API
  const url = `https://www.googleapis.com/youtube/v3/playlists?key=${ytKey}&channelId=${channelId}&part=snippet,id&maxResults=50`;
  const response = await axios.get(url);

  const playlists = response.data.items.filter(
    (item) => item.kind === "youtube#playlist"
  );

  // Save new playlists to the database
  for (const playlist of playlists) {
    const { id, snippet } = playlist;
    const { title, description, channelId, publishedAt } = snippet;

    const existingPlaylist = existingPlaylists.find((p) => p.playlistId === id);
    if (existingPlaylist) {
      // Playlist already exists in the database, so just update its metadata
      db.run(
        "UPDATE playlist SET name = ?, description = ?, publishTime = ? WHERE playlistId = ?",
        [title, description, publishedAt, id],
        (error) => {
          if (error) {
            ERROR(`Failed to update playlist ${id} in database: ${error}`);
          } else {
            DEBUG(`Playlist ${id} updated in database`);
          }
        }
      );
    } else {
      // Playlist doesn't exist in the database yet, so insert it
      db.run(
        "INSERT INTO playlist (playlistId, channelId, name, description, publishTime) VALUES (?, ?, ?, ?, ?)",
        [id, channelId, title, description, publishedAt],
        (error) => {
          if (error) {
            ERROR(`Failed to save playlist ${id} to database: ${error}`);
          } else {
            DEBUG(`Playlist ${id} saved to database`);
          }
        }
      );
    }

    // Get all videos in this playlist
    const playlistItemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${ytKey}&playlistId=${id}&part=snippet&maxResults=50`;
    const playlistItemsResponse = await axios.get(playlistItemsUrl);
    const playlistItems = playlistItemsResponse.data.items.filter(
      (item) => item.kind === "youtube#playlistItem"
    );

    // Assign playlistId to all videos in this playlist
    for (const item of playlistItems) {
      const videoId = item.snippet.resourceId.videoId;

      dbVideos.run(
        "UPDATE video SET playlistId = ? WHERE videoId = ?",
        [id, videoId],
        (error) => {
          if (error) {
            ERROR(`Failed to update video ${videoId} in database: ${error}`);
          } else {
            DEBUG(`Video ${videoId} updated with playlistId ${id}`);
          }
        }
      );
    }
  }
  db.close();
}
