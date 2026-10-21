// From code/game/gamemodes/sandbox/sandbox.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1099, "/datum/game_mode/sandbox", "/datum/game_mode", {
	name: "sandbox",
	config_tag: "sandbox",
	required_players: 0,
	announce_span: "info",
	announce_text: "Build your own station... or just shoot each other!",
	allow_persistence_save: 0,
});

// /datum/game_mode/sandbox/proc/pre_setup  (code/game/gamemodes/sandbox/sandbox.dm:12)  may sleep
rt.def("/datum/game_mode/sandbox/proc/pre_setup", function* pre_setup(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(M), "CanBuild", []);
	}
	rt.endFor(f, 0);
	return 1;
}, true);

// /datum/game_mode/sandbox/proc/post_setup  (code/game/gamemodes/sandbox/sandbox.dm:17)  may sleep
rt.def("/datum/game_mode/sandbox/proc/post_setup", function* post_setup(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.gl("SSshuttle"), "registerHostileEnvironment", [live(f.src)]);
	return f.dot;
}, true);
