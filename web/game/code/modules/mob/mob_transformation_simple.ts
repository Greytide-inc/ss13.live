// From code/modules/mob/mob_transformation_simple.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/proc/change_mob_type  (code/modules/mob/mob_transformation_simple.dm:7)  may sleep
rt.def("/mob/proc/change_mob_type", function* change_mob_type(f: Frame, new_type: Value, location: Value, new_name: Value, delete_old_mob: Value) {
	let M: Value = null, C: Value = null, D: Value = null, H: Value = null;
	f.vars = () => [new_type, location, new_name, delete_old_mob, M, C, D, H];
	if (live(new_type) === null) {
		new_type = null;
	}
	if (live(location) === null) {
		location = null;
	}
	if (live(new_name) === null) {
		new_name = null;
	}
	if (live(delete_old_mob) === null) {
		delete_old_mob = 0;
	}
	if (truthy((rt.istype(live(f.src), T("/mob/dead/new_player")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Cannot convert players who have not entered yet.</span>"]);
		return live(f.dot);
	}
	if (!truthy(live(new_type))) {
		new_type = (yield* g.op(f, "Prompt", [3], [null, null, "Mob type", "Mob type path:", null]));
	}
	if (truthy((yield* g.call(f, P("/proc/istext"), null, [live(new_type)])))) {
		new_type = (yield* g.call(f, P("/proc/text2path"), null, [live(new_type)]));
	}
	if (!truthy((yield* g.call(f, P("/proc/ispath"), null, [live(new_type)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("Invalid type path (new_type = ＀) in change_mob_type(). Contact a coder.", [live(new_type)])]);
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(new_type), T("/mob/dead/new_player")])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Cannot convert into a new_player mob type.</span>"]);
		return live(f.dot);
	}
	M = null;
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [live(location)])))) {
		M = (yield* g.new_(f, live(new_type), [live(location)]));
	} else {
		M = (yield* g.new_(f, live(new_type), [rt.fv(f, "loc", live(f.src))]));
	}
	if ((!truthy(live(M)) || !truthy((yield* g.call(f, P("/proc/ismob"), null, [live(M)]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("Type path is not a mob (new_type = ＀) in change_mob_type(). Contact a coder.", [live(new_type)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(M)]);
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/istext"), null, [live(new_name)])))) {
		rt.setFv(f, "name", live(M), live(new_name));
		rt.setFv(f, "real_name", live(M), live(new_name));
	} else {
		rt.setFv(f, "name", live(M), rt.fv(f, "name", live(f.src)));
		rt.setFv(f, "real_name", live(M), rt.fv(f, "real_name", live(f.src)));
	}
	if ((truthy((yield* g.srcCall(f, "has_dna"))) && truthy((yield* g.callName(f, live(M), "has_dna", []))))) {
		C = live(f.src);
		D = live(M);
		yield* g.callName(f, rt.fv(f, "dna", live(C)), "transfer_identity", [live(D)]);
		yield* g.callName(f, live(D), "updateappearance", ["mutcolor_update", 1, "mutations_overlay_update", 1], rt.Args.Named);
	} else {
		if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
			H = live(M);
			yield* g.callName(f, rt.fv(f, "prefs", rt.sv(f, "client")), "copy_to", [live(H)]);
			yield* g.callName(f, rt.fv(f, "dna", live(H)), "update_dna_identity", []);
		}
	}
	if ((truthy(rt.sv(f, "mind")) && truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0)))) {
		yield* g.callName(f, rt.sv(f, "mind"), "transfer_to", [live(M), 1]);
	} else {
		rt.setFv(f, "key", live(M), rt.sv(f, "key"));
	}
	if (truthy(live(delete_old_mob))) {
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 1, 8]);
	}
	return live(M);
}, true);
