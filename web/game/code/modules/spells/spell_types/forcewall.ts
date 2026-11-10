// Based on /tg/station's code/modules/spells/spell_types/forcewall.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


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

// forcewall.dm:17
rt.def("/obj/effect/proc_holder/spell/targeted/forcewall/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	user ??= f.usr;
	yield* new_(this.wall_type, rt.getStep(f, user, 0), user);
	if ((user.dir == 2 || user.dir == 1)) {
		yield* new_(this.wall_type, rt.getStep(f, user, 4), user);
		yield* new_(this.wall_type, rt.getStep(f, user, 8), user);
	} else {
		yield* new_(this.wall_type, rt.getStep(f, user, 1), user);
		yield* new_(this.wall_type, rt.getStep(f, user, 2), user);
	}
	return f.dot;
}, true);

rt.type(11817, "/obj/effect/forcefield/wizard", "/obj/effect/forcefield", {
	wizard: null,
});

// forcewall.dm:30
rt.def("/obj/effect/forcefield/wizard/proc/Initialize", function* Initialize(f: Frame, mapload: Value, summoner: Value) {
	f.dot = (yield* parent_proc());
	this.wizard = summoner;
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 300, 8);
	return f.dot;
}, true);

// forcewall.dm:35
rt.def("/obj/effect/forcefield/wizard/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	height ??= 0;
	if (mover == this.wizard) {
		return 1;
	}
	return 0;
});
