// Based on /tg/station's code/game/gamemodes/sandbox/sandbox.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1099, "/datum/game_mode/sandbox", "/datum/game_mode", {
	name: "sandbox",
	config_tag: "sandbox",
	required_players: 0,
	announce_span: "info",
	announce_text: "Build your own station... or just shoot each other!",
	allow_persistence_save: 0,
});

// sandbox.dm:12
rt.def("/datum/game_mode/sandbox/proc/pre_setup", function* pre_setup(f: Frame) {
	let M: Value = null;
	for (M of each(GLOB.player_list, T("/mob"))) {
		yield* M.CanBuild();
	}
	return 1;
}, true);

// sandbox.dm:17
rt.def("/datum/game_mode/sandbox/proc/post_setup", function* post_setup(f: Frame) {
	yield* parent_proc();
	yield* GLOB.SSshuttle.registerHostileEnvironment(this);
	return f.dot;
}, true);
