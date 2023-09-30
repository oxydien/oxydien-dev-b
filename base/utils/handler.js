import {
  InternalServerErrorMessage,
  OkMessage,
  UnauthorizedMessage,
} from "../keys/messages.js";
import { PostKey, setupKeys } from "./keys_json.js";
import {
  DEBUG,
  channelIds,
  // eslint-disable-next-line no-unused-vars
  checkForNewVideos,
  // eslint-disable-next-line no-unused-vars
  getChannelProfilePicture,
  // eslint-disable-next-line no-unused-vars
  updatePlaylists,
} from "../../module.js";
import { setupDatabases } from "./db-handler.js";

export function handleNormalRequest(route) {
  return async (req, res) => {
    DEBUG("Got request", req.method, req.path, req.query);
    try {
      if (route.authorization) {
        if (req.headers.authorization !== PostKey) {
          res.status(401).send(UnauthorizedMessage(req));
          return;
        }
      }
      if (route.res) {
        await route.handler(req, res);
      } else {
        const data = await route.handler(req);
        res.status(200).send(OkMessage(req, data));
      }
    } catch (e) {
      res.status(500).send(InternalServerErrorMessage(req, e));
    }
  };
}

export function handleServerStart() {
  setupDatabases();
  setupKeys();
  // eslint-disable-next-line no-unused-vars
  for (const channel in channelIds) {
    checkForNewVideos(channelIds[channel]);
    getChannelProfilePicture(channelIds[channel]);
    updatePlaylists(channelIds[channel]);
  }
}
