import { ERROR, getJsonFromQuery } from "../../../module.js";

export function getVideos(req) {
  return new Promise((resolve, reject) => {
    let {
      channelId = "%",
      videoId = "%",
      search = "%",
      playlistId = "%",
      limit = 5,
      sortBy = "publishTime",
      page = 1,
    } = req.query;

    let requestInfo = {};

    page = parseInt(page);
    limit = parseInt(limit);
    if (limit < 1) {
      limit = 5;
    } else if (limit > 100) {
      limit = 100;
    }

    channelId = channelId == "" ? "%" : channelId;
    search = search == "" ? "%" : search;

    requestInfo.type = "video";
    requestInfo.limit = limit;
    requestInfo.search = search == "%" ? "any" : search;
    requestInfo.videoId = videoId == "%" ? "any" : videoId;
    requestInfo.channelId = channelId == "%" ? "any" : channelId;
    requestInfo.playlistId = playlistId == "%" ? "any" : playlistId;
    requestInfo.page = page;

    let orderBy = "publishTime DESC";
    if (sortBy === "views" || sortBy === "likes") {
      orderBy = sortBy + " DESC";
    } else if (
      sortBy === "description" ||
      sortBy === "name" ||
      sortBy === "id" ||
      sortBy === "channelId"
    ) {
      orderBy = sortBy;
    }
    requestInfo.sortBy = orderBy;

    let whereClauses = [];
    let params = [];

    if (search !== "" && search !== "%") {
      whereClauses.push("(description LIKE ? OR name LIKE ?)");
      params.push(`%${search}%`);
      params.push(`%${search}%`);
    }

    if (typeof channelId === "string" && channelId !== "") {
      const channelIds = channelId.split(",");
      const channelClause =
        "(" + channelIds.map(() => "channelId LIKE ?").join(" OR ") + ")";
      whereClauses.push(channelClause);
      params.push(...channelIds);
    }

    if (playlistId !== "") {
      const playlistIds = playlistId.split(",");
      const playlistClause =
        "(" + playlistIds.map(() => "playlistId LIKE ?").join(" OR ") + ")";
      whereClauses.push(playlistClause);
      params.push(...playlistIds);
    }

    if (videoId !== "") {
      const ids = videoId.split(",");
      const idClause = "(" + ids.map(() => "videoId LIKE ?").join(" OR ") + ")";
      whereClauses.push(idClause);
      params.push(...ids);
    }

    const offset = (page - 1) * limit;
    const whereClause =
      whereClauses.length > 0 ? "WHERE " + whereClauses.join(" AND ") : "";
    const query = `
      SELECT *, COUNT(*) OVER() as totalResults
      FROM video
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ?
      OFFSET ?
      `;

    params.push(limit, offset);

    getJsonFromQuery(query, params, "videos", (error, data) => {
      if (error) {
        reject(error);
        ERROR(error);
        return;
      }
      requestInfo.totalResults = data.length > 0 ? data[0].totalResults : 0;
      resolve({
        requestInfo: requestInfo,
        // eslint-disable-next-line no-unused-vars
        items: data.map(({ totalResults, ...item }) => item),
      });
    });
  });
}

export function getPlaylists(req) {
  return new Promise((resolve, reject) => {
    let { channelId = "%", limit = 5, sortBy = "publishTime" } = req.query;
    let requestInfo = {};

    limit = parseInt(limit);
    if (limit < 1) {
      limit = 5;
    } else if (limit > 100) {
      limit = 100;
    }
    requestInfo.type = "playlist";
    requestInfo.limit = limit;
    requestInfo.channelId = channelId == "%" ? "any" : channelId;

    let orderBy = "publishTime DESC";
    if (
      sortBy === "description" ||
      sortBy === "name" ||
      sortBy === "id" ||
      sortBy === "channelId"
    ) {
      orderBy = sortBy;
    }
    requestInfo.sortBy = orderBy;

    const query = `SELECT * FROM playlist WHERE channelId LIKE ? ORDER BY ${orderBy} LIMIT ?`;
    const params = [channelId, limit];

    getJsonFromQuery(query, params, "playlists", (error, data) => {
      if (error) {
        reject(error);
        ERROR(error);
        return;
      }
      resolve({ requestInfo: requestInfo, items: data });
    });
  });
}

export function getChannels(req) {
  return new Promise((resolve, reject) => {
    let { channelId = "%", limit = 5 } = req.query;

    let requestInfo = {};

    limit = parseInt(limit);
    if (limit < 1) {
      limit = 5;
    } else if (limit > 100) {
      limit = 100;
    }
    requestInfo.type = "channel";
    requestInfo.limit = limit;

    let query = "SELECT * FROM channel";
    const params = [];

    // Check if channelId is "%" or empty, and adjust the query accordingly
    if (channelId === "%" || channelId === "") {
      query += " LIMIT ?";
      params.push(limit);
      requestInfo.channelId = channelId;
    } else {
      // Split the comma-separated channelId string into an array
      const channelIds = channelId.split(",");

      const placeholders = channelIds.map(() => "?").join(", ");
      query += ` WHERE channelId IN (${placeholders}) LIMIT ?`;
      params.push(...channelIds, limit);
      requestInfo.channelIds = channelIds;
    }

    getJsonFromQuery(query, params, "channels", (error, data) => {
      if (error) {
        reject(error);
        ERROR(error);
        return;
      }
      resolve({ requestInfo: requestInfo, items: data });
    });
  });
}
