// ss13.live draws its own lobby pictures on the page (worker/lobby-art/), so the game must find no tg title screen: the VFS bundle leaves
// config/title_screens/images out (SStitle.PreInit's flist() comes back empty, the join splash has no picture). The offline build still ships the
// folder: the lobby splash turf's own icon is config/title_screens/images/blank.png.
import { readFileSync, readdirSync } from "node:fs";
import assert from "node:assert";
import { resolve } from "node:path";

const root = resolve(process.cwd(), "..");
const build = readFileSync(resolve(root, "web/tools/build-static.mjs"), "utf8");
assert.ok(build.includes('"config/title_screens/images"'), "build-static.mjs copies config/title_screens/images");
assert.ok(readdirSync(resolve(root, "config/title_screens/images")).includes("blank.png"));
const vfs = JSON.parse(readFileSync(resolve(root, "web/build/vfs-bundle.json"), "utf8"));
const names = JSON.stringify(Object.keys(vfs.files ?? vfs));
assert.ok(!names.includes("title_screens/images/default.dmi"), "the VFS bundle has no title screen for SStitle to pick");
assert.ok(readFileSync(resolve(root, "web/tools/build-static.mjs"), "utf8").includes('"lobby-art"'), "build-static.mjs ships worker/lobby-art/");
console.log("title-screen: ok");
