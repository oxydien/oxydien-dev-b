import axios from "axios";
import sqlite3 from "sqlite3";
import path from "path";
import { ytKey, resolveAliasPath } from "../../../base/utils/keys_json.js";
import { DEBUG, ERROR, WARN } from "../../../base/utils/logger.js";

export async function checkForNewVideos(channelId) {
  const db = new sqlite3.Database(
    path.join(resolveAliasPath("@databases"), "videos.db")
  );

  axios
    .get(
      `https://www.googleapis.com/youtube/v3/search?key=${ytKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=3`
    )
    .then((response) => {
      const videos = response.data.items.filter(
        (item) => item.id.kind === "youtube#video"
      );
      if (videos.length === 0) {
        WARN(`No new videos found for channel ${channelId}`);
        return;
      }
      DEBUG(`Found ${videos.length} new videos for channel ${channelId}`);
      videos.forEach((video) => {
        const { id, snippet } = video;
        const { title, channelId, publishedAt } = snippet;

        db.get(
          "SELECT * FROM video WHERE videoId = ?",
          [id.videoId],
          (error, row) => {
            if (error) {
              ERROR(`Failed to query database: ${error}`);
            } else if (row) {
              DEBUG(`Video ${id.videoId} already exists in database`);
            } else {
              axios
                .get(
                  `https://www.googleapis.com/youtube/v3/videos?key=${ytKey}&part=snippet,contentDetails,statistics&id=${id.videoId}`
                )
                .then((response) => {
                  const { snippet, statistics, contentDetails } =
                    response.data.items[0];
                  const { description, tags } = snippet;
                  const { viewCount, likeCount } = statistics;
                  const { duration } = contentDetails;
                  let strTags = "";
                  if (tags) {
                    strTags = tags.toString();
                  }
                  db.run(
                    "INSERT INTO video (videoId,playlistId, channelId, name, description, publishTime, tags, likes, views, duration) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                      id.videoId,
                      "null",
                      channelId,
                      title,
                      description,
                      publishedAt,
                      strTags,
                      likeCount,
                      viewCount,
                      duration,
                    ],
                    (error) => {
                      if (error) {
                        ERROR(
                          `Failed to save video ${id.videoId} to database:`,
                          error
                        );
                      } else {
                        DEBUG(`Video ${id.videoId} saved to database`);
                      }
                    }
                  );
                })
                .catch((error) => {
                  ERROR(`Failed to get video info for ${id.videoId}:`, error);
                });
            }
          }
        );
      });
    })
    .catch((error) => {
      console.error(`Failed to get videos for channel ${channelId}:`, error);
    });
}
