// From code/game/objects/structures/crates_lockers/crates/secure.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12269, "/obj/structure/closet/crate/secure", "/obj/structure/closet/crate", {
	tamperproof: 0,
	secure: 1,
	locked: 1,
	desc: "A secure crate.",
	name: "secure crate",
	icon_state: "securecrate",
	obj_integrity: 500,
	max_integrity: 500,
	armor: null,
});

// /obj/structure/closet/crate/secure/proc/<init>  (code/game/objects/structures/crates_lockers/crates/secure.dm:9)
rt.def("/obj/structure/closet/crate/secure/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 50, "laser", 50, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 80, "acid", 80]));
	return f.dot;
});

// /obj/structure/closet/crate/secure/proc/run_obj_armor  (code/game/objects/structures/crates_lockers/crates/secure.dm:13)
rt.def("/obj/structure/closet/crate/secure/proc/run_obj_armor", function run_obj_armor(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if ((isEqual(live(f.args[2]), "melee") && rt.lt(live(f.args[0]), 25))) {
		return 0;
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });

// /obj/structure/closet/crate/secure/proc/update_icon  (code/game/objects/structures/crates_lockers/crates/secure.dm:18)
rt.def("/obj/structure/closet/crate/secure/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "broken"))) {
		rt.callSrc(f, "add_overlay", ["securecrateemag"]);
	} else {
		if (truthy(rt.sv(f, "locked"))) {
			rt.callSrc(f, "add_overlay", ["securecrater"]);
		} else {
			rt.callSrc(f, "add_overlay", ["securecrateg"]);
		}
	}
	return f.dot;
});

// /obj/structure/closet/crate/secure/proc/take_damage  (code/game/objects/structures/crates_lockers/crates/secure.dm:27)  may sleep
rt.def("/obj/structure/closet/crate/secure/proc/take_damage", function* take_damage(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = "brute";
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "tamperproof")]))) {
		yield* g.srcCall(f, "boom");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect"] });

// /obj/structure/closet/crate/secure/proc/boom  (code/game/objects/structures/crates_lockers/crates/secure.dm:34)  may sleep
rt.def("/obj/structure/closet/crate/secure/proc/boom", function* boom(f: Frame, user: Value) {
	let message: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [user, message, AM, $e];
	if (truthy(live(user))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>The crate's anti-tamper system activates!</span>"]);
		rt.modGl("bombers", (message = fmt("＀ has detonated ＀.", [fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(user)])]), rt.fv(f, "name", live(f.src))])), add);
		yield* g.call(f, P("/proc/message_admins"), null, [live(message)]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has detonated ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), rt.fv(f, "name", live(f.src))])]);
	}
	AM = null;
	rt.forList(f, 0, live(f.src), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(AM)]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/explosion"), null, [rt.getStep(f, live(f.src), 0), 0, 1, 5, 5]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
