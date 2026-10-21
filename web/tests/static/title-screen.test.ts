// the offline build (dist) must ship config/title_screens/images, or the lobby splash turf has no image
// (the page fetches icons by path; SStitle sets the splash turf's icon to config/title_screens/images/default.dmi).
import { readFileSync, readdirSync } from "node:fs";
import assert from "node:assert";
import { resolve } from "node:path";

const root = resolve(process.cwd(), "..");
const build = readFileSync(resolve(root, "web/tools/build-static.mjs"), "utf8");
assert.ok(build.includes('"config/title_screens/images"'), "build-static.mjs copies config/title_screens/images");
const files = readdirSync(resolve(root, "config/title_screens/images"));
assert.ok(files.includes("default.dmi") && files.includes("blank.png"));
console.log("title-screen: ok");
