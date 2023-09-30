import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This file parses the keys.json into individual variables...
// You NEED to have the file written the same way or it may not work correctly
/* Example of keys.json
{ "post": "", "delete": "", "yt":"" }
*/
// This file needs to be located at the root level of this project

export const resolveAliasPath = (alias) => {
  const aliasMapping = {
    "@keys": "../../keys.json",
    "@logs": "../../logs/",
    "@databases": "../database/",
    "@base": "../",
    "@core": "../../core/",
  };

  return path.resolve(__dirname, aliasMapping[alias]);
};

const allKeys = JSON.parse(fs.readFileSync(resolveAliasPath("@keys")));
export const ytKey = allKeys.yt;
export const PostKey = allKeys.post;
export const DeleteKey = allKeys.delete;
