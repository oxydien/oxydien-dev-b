import "esm";
import { IndexPage } from "../../core/static/pages/indexPage.js";
import { SiteMapXml } from "../../core/static/pages/siteMap.js";
import {
  getChannels,
  getPlaylists,
  getVideos,
} from "../../core/api/content/youtube.js";
import { processImage } from "../../core/api/images/image_processor.js";

/* 
Every route MUST have:
- name: A simple explanation of what the page has to offer.
- path: The URL path of the page, starting and ending with a slash (/).
- method: The HTTP method used for the page (GET, POST, PUT, etc.).
- handler: The function that handles the page.

Optional properties:
- authorization: Set to 'true' if the route requires the authorization header, otherwise 'false'.
- res: Set to 'true' if the route function controls the response, otherwise 'false'.
- query: Array of queries. ex: ["limit","sortBy"]
*/
export const routeList = [
  {
    name: "Index page",
    path: "/",
    method: "GET",
    res: true,
    handler: IndexPage,
  },
  {
    name: "Site map",
    path: "/sitemap.xml",
    method: "GET",
    res: true,
    handler: SiteMapXml,
  },
  {
    name: "Youtube videos",
    path: "/api/v1/content/youtube/videos/",
    method: "GET",
    query: [
      "channelId",
      "videoId",
      "search",
      "playlistId",
      "limit",
      "sortBy",
      "page",
    ],
    handler: getVideos,
  },
  {
    name: "Youtube playlists",
    path: "/api/v1/content/youtube/playlists/",
    method: "GET",
    query: ["channelId", "limit", "sortBy"],
    handler: getPlaylists,
  },
  {
    name: "Youtube channels",
    path: "/api/v1/content/youtube/channels/",
    method: "GET",
    query: ["channelId", "limit"],
    handler: getChannels,
  },
  {
    name: "Static Image processor",
    path: "/static/images/:image_name",
    method: "GET",
    query: ["height", "width"],
    res: true,
    handler: processImage,
  },
];
