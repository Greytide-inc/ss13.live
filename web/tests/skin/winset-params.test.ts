// winset params as list2params writes them ("&"-joined, url-encoded values), which html_interface's window setup uses.
import { parseWinsetParams } from "../../src/vm/skin.js";
import assert from "node:assert";

const enc = parseWinsetParams("parent=browser_%5b0x30013c1%5d&type=browser&pos=0%2c0&size=900x540&use-title=true");
assert.deepStrictEqual(enc, [["parent", "browser_[0x30013c1]"], ["type", "browser"], ["pos", "0,0"], ["size", "900x540"], ["use-title", "true"]]);
assert.deepStrictEqual(parseWinsetParams("a=1;b=2 c=3"), [["a", "1"], ["b", "2"], ["c", "3"]]); // ";" and space still split
assert.deepStrictEqual(parseWinsetParams('command="say \\"hi\\" & more";x=y'), [["command", 'say "hi" & more'], ["x", "y"]]); // quoted values keep "&"
console.log("winset-params: ok");
