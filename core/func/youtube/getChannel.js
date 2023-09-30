import axios from "axios";
import sqlite3 from "sqlite3";
import { createWriteStream, unlink } from "fs";
import { join } from "path";
import { get as _get } from "https";
import { resolveAliasPath, ytKey } from "../../../base/utils/keys_json.js";
import { DEBUG, ERROR } from "../../../base/utils/logger.js";

// function to download image from URL
export function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    _get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close(resolve(true));
      });
    }).on("error", (error) => {
      unlink(dest);
      reject(error.message);
    });
  });
}

export async function getChannelProfilePicture(channelId) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${ytKey}`
    );

    const { items } = response.data;
    const { title, description, thumbnails } = items[0].snippet;
    const { url: profilePictureUrl } = thumbnails.high;
    const profilePictureFileName = `channel-${channelId}.png`;
    const profilePictureDest = join(
      resolveAliasPath("@core"),
      "static/images",
      profilePictureFileName
    );
    const profilePictureLoc = `/static/images/${profilePictureFileName}`;
    await downloadImage(profilePictureUrl, profilePictureDest);

    // Save the data to the database
    const db = new sqlite3.Database(
      join(resolveAliasPath("@databases"), "channels.db")
    );

    db.get(
      "SELECT channelId FROM channel WHERE channelId = ?",
      [channelId],
      (error, row) => {
        if (error) {
          ERROR(`Failed to query database: ${error}`);
        } else {
          if (row) {
            // If channelId already exists, update the row
            db.run(
              "UPDATE channel SET name = ?, description = ?, profilePictureUrl = ? WHERE channelId = ?",
              [title, description, profilePictureLoc, channelId],
              (error) => {
                if (error) {
                  ERROR(
                    `Failed to update channel ${channelId} in database: ${error}`
                  );
                } else {
                  DEBUG(
                    `Channel ${channelId} updated in database (${profilePictureLoc})`
                  );
                }
              }
            );
          } else {
            // If channelId does not exist, insert a new row
            db.run(
              "INSERT INTO channel (channelId, name, description, profilePictureUrl) VALUES (?, ?, ?, ?)",
              [channelId, title, description, profilePictureLoc],
              (error) => {
                if (error) {
                  ERROR(
                    `Failed to insert channel ${channelId} into database: ${error}`
                  );
                } else {
                  DEBUG(
                    `Channel ${channelId} inserted into database (${profilePictureLoc})`
                  );
                }
              }
            );
          }
        }
      }
    );

    db.close(); // Close the database connection
  } catch (error) {
    ERROR(`Failed to get channel ${channelId} data: ${error}`);
  }
}
