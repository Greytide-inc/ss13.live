// From code/modules/spells/spell_types/forcewall.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11314, "/obj/effect/proc_holder/spell/targeted/forcewall", "/obj/effect/proc_holder/spell/targeted", {
	wall_type: rt.typePath("/obj/effect/forcefield/wizard"),
	include_user: 1,
	name: "Forcewall",
	desc: "Create a magical barrier that only you can pass through. Does not require wizard garb.",
	school: "transmutation",
	charge_max: 100,
	clothes_req: 0,
	invocation: "TARCOL MINTI ZHERI",
	invocation_type: "shout",
	sound: rt.rsc("sound/magic/forcewall.ogg"),
	action_icon_state: "shield",
	range: -1,
	cooldown_min: 50,
});

// /obj/effect/proc_holder/spell/targeted/forcewall/proc/cast  (code/modules/spells/spell_types/forcewall.dm:17)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/forcewall/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	f.vars = () => [targets, user];
	if (live(user) === null) {
		user = live(f.usr);
	}
	yield* g.new_(f, rt.sv(f, "wall_type"), [rt.getStep(f, live(user), 0), live(user)]);
	if ((isEqual(rt.fv(f, "dir", live(user)), 2) || isEqual(rt.fv(f, "dir", live(user)), 1))) {
		yield* g.new_(f, rt.sv(f, "wall_type"), [rt.getStep(f, live(user), 4), live(user)]);
		yield* g.new_(f, rt.sv(f, "wall_type"), [rt.getStep(f, live(user), 8), live(user)]);
	} else {
		yield* g.new_(f, rt.sv(f, "wall_type"), [rt.getStep(f, live(user), 1), live(user)]);
		yield* g.new_(f, rt.sv(f, "wall_type"), [rt.getStep(f, live(user), 2), live(user)]);
	}
	return f.dot;
}, true);

rt.type(11817, "/obj/effect/forcefield/wizard", "/obj/effect/forcefield", {
	wizard: null,
});

// /obj/effect/forcefield/wizard/proc/Initialize  (code/modules/spells/spell_types/forcewall.dm:30)  may sleep
rt.def("/obj/effect/forcefield/wizard/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "wizard", live(f.args[1]));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 300, 8]);
	return f.dot;
}, true, { args: ["mapload", "summoner"] });

// /obj/effect/forcefield/wizard/proc/CanPass  (code/modules/spells/spell_types/forcewall.dm:35)
rt.def("/obj/effect/forcefield/wizard/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	f.vars = () => [height];
	if (live(height) === null) {
		height = 0;
	}
	if (isEqual(live(mover), rt.sv(f, "wizard"))) {
		return 1;
	}
	return 0;
});
