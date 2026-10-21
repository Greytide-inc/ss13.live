// From code/modules/mob/living/silicon/pai/personality.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(359, "/datum/paiCandidate", "/datum", {
	name: null,
	key: null,
	description: null,
	role: null,
	comments: null,
	ready: 0,
});

// /datum/paiCandidate/proc/savefile_path  (code/modules/mob/living/silicon/pai/personality.dm:11)
rt.def("/datum/paiCandidate/proc/savefile_path", function savefile_path(f: Frame, user: Value) {
	return fmt("data/player_saves/＀/＀/pai.sav", [rt.call(f, P("/proc/copytext"), null, [rt.fv(f, "ckey", live(user)), 1, 2]), rt.fv(f, "ckey", live(user))]);
});

// /datum/paiCandidate/proc/savefile_save  (code/modules/mob/living/silicon/pai/personality.dm:14)
rt.def("/datum/paiCandidate/proc/savefile_save", function savefile_save(f: Frame, user: Value) {
	let F: Value = null;
	f.vars = () => [F];
	if (truthy(rt.call(f, P("/proc/IsGuestKey"), null, [rt.fv(f, "key", live(user))]))) {
		return 0;
	}
	rt.op(f, "OutputReference", [rt.R.index], [(F = rt.new_(f, T("/savefile"), [rt.callName(f, live(f.src), "savefile_path", [live(user)])])), "name", rt.fv(f, "name", live(f.src))], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(F), "description", rt.fv(f, "description", live(f.src))], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(F), "role", rt.fv(f, "role", live(f.src))], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(F), "comments", rt.fv(f, "comments", live(f.src))], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(F), "version", 1], false);
	return 1;
});

// /datum/paiCandidate/proc/savefile_load  (code/modules/mob/living/silicon/pai/personality.dm:35)  may sleep
rt.def("/datum/paiCandidate/proc/savefile_load", function* savefile_load(f: Frame, user: Value, silent: Value) {
	let path: Value = null, F: Value = null, version: Value = null;
	f.vars = () => [user, silent, path, F, version];
	if (live(silent) === null) {
		silent = 1;
	}
	if (truthy((yield* g.call(f, P("/proc/IsGuestKey"), null, [rt.fv(f, "key", live(user))])))) {
		return 0;
	}
	if (!truthy((yield* g.call(f, P("/proc/fexists"), null, [(path = (yield* g.srcCall(f, "savefile_path", live(user))))])))) {
		return 0;
	}
	if (!truthy((F = (yield* g.new_(f, T("/savefile"), [live(path)]))))) {
		return live(f.dot);
	}
	version = null;
	version = rt.input(f, rt.R.index, null, [live(F), "version"]);
	if ((live(version) === null || !isEqual(live(version), 1))) {
		yield* g.call(f, P("/proc/fdel"), null, [live(path)]);
		if (!truthy(live(silent))) {
			yield* g.call(f, P("/proc/alert"), null, [live(user), "Your savefile was incompatible with this version and was deleted."]);
		}
		return 0;
	}
	rt.setFv(f, "name", live(f.src), rt.input(f, rt.R.index, null, [live(F), "name"]));
	rt.setFv(f, "description", live(f.src), rt.input(f, rt.R.index, null, [live(F), "description"]));
	rt.setFv(f, "role", live(f.src), rt.input(f, rt.R.index, null, [live(F), "role"]));
	rt.setFv(f, "comments", live(f.src), rt.input(f, rt.R.index, null, [live(F), "comments"]));
	return 1;
}, true);
