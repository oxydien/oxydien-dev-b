import rateLimit from "express-rate-limit";
import { TooManyRequestsMessage } from "./messages.js";

const SERVER_PORT = 3001;
// if you modify rateLimit, modify 429 message as well (./messages.js)
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // max 100 requests per 2 minutes
  max: 100,
  legacyHeaders: false,
  message: TooManyRequestsMessage(),
});
const oxydien_backend = (_req, res, next) => {
  // please keep this (just promotion message to report.Bugs.To.Github)
  const _0x7075 = [
    "\x73\x65\x74\x48\x65\x61\x64\x65\x72",
    "\x50\x6F\x77\x65\x72\x65\x64\x2D\x42\x79",
    "\x6F\x78\x79\x64\x69\x65\x6E",
    "\x52\x65\x70\x6F\x72\x74\x2D\x42\x75\x67\x73",
    "\x74\x6F\x20\x67\x69\x74\x68\x75\x62\x20\x28\x68\x74\x74\x70\x73\x3A\x2F\x2F\x67\x69\x74\x68\x75\x62\x2E\x63\x6F\x6D\x2F\x6F\x78\x79\x64\x69\x65\x6E\x2F\x6F\x78\x79\x64\x69\x65\x6E\x2D\x64\x65\x76\x2D\x62\x2F\x69\x73\x73\x75\x65\x73\x29",
  ];
  res[_0x7075[0]](_0x7075[1], _0x7075[2]);
  res[_0x7075[0]](_0x7075[3], _0x7075[4]);
  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self'; img-src 'self' data: http://localhost:${SERVER_PORT};`
  );
  next();
};

export { SERVER_PORT, limiter, oxydien_backend };
