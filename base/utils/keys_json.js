import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { LOG } from "module";
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

export function setupKeys() {
  const keysPath = path.join(__dirname, "..", "..", "keys.json");
  const defaultKeys = { post: "", delete: "", yt: "" };
  if (!fs.existsSync(keysPath)) {
    LOG("Creating keys.json")
    fs.writeFileSync(keysPath, JSON.stringify(defaultKeys));
  }
  const allKeys = JSON.parse(fs.readFileSync(resolveAliasPath("@keys")));
  ytKey = allKeys.yt;
  PostKey = allKeys.post;
  DeleteKey = allKeys.delete;
}

export var ytKey;
export var PostKey;
export var DeleteKey;
