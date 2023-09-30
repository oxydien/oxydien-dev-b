import {
  SERVER_PORT,
  limiter,
  oxydien_backend,
  LOG,
  handleNormalRequest,
  routeList,
  handleServerStart,
  resolveAliasPath,
} from "./module.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { NotFoundMessage } from "./base/keys/messages.js";
import { clearLog } from "./base/utils/logger.js";
import serveFavicon from "serve-favicon";
import path from "path";

const app = new express();
app.disable("x-powered-by");
app.use(oxydien_backend);
app.use(limiter);
app.use(cors());
app.use(bodyParser.json());
app.use(
  serveFavicon(
    path.join(resolveAliasPath("@core"), "static", "public", "favicon.ico")
  )
);

routeList.forEach((route) => {
  app[route.method.toLowerCase()](route.path, handleNormalRequest(route));
});

app.listen(SERVER_PORT, () => {
  clearLog();
  handleServerStart();
  LOG(`Server started listening at port ${SERVER_PORT}`);
});

app.use((req, res) => {
  res.status(404).send(NotFoundMessage(req));
});
