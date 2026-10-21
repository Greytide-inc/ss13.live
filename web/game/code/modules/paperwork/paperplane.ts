// From code/modules/paperwork/paperplane.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7624, "/obj/item/weapon/paperplane", "/obj/item/weapon", {
	internalPaper: null,
	throw_range: 7,
	throw_speed: 1,
	name: "paper plane",
	desc: "Paper, folded in the shape of a plane",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "paperplane",
	throwforce: 0,
	w_class: 1,
	resistance_flags: 4,
	obj_integrity: 50,
	max_integrity: 50,
});

// /obj/item/weapon/paperplane/proc/Initialize  (code/modules/paperwork/paperplane.dm:17)  may sleep
rt.def("/obj/item/weapon/paperplane/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-8, 8])));
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-9, 9])));
	if (truthy(live(f.args[1]))) {
		rt.setSv(f, "internalPaper", live(f.args[1]));
		rt.setSv(f, "flags", rt.fv(f, "flags", live(f.args[1])));
		rt.setSv(f, "color", rt.fv(f, "color", live(f.args[1])));
		yield* g.callName(f, live(f.args[1]), "forceMove", [live(f.src)]);
	} else {
		rt.setSv(f, "internalPaper", (yield* g.new_(f, T("/obj/item/weapon/paper"), [live(f.src)])));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["mapload", "newPaper"] });

// /obj/item/weapon/paperplane/proc/Destroy  (code/modules/paperwork/paperplane.dm:31)  may sleep
rt.def("/obj/item/weapon/paperplane/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "internalPaper"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "internalPaper")]);
		rt.setSv(f, "internalPaper", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/paperplane/proc/suicide_act  (code/modules/paperwork/paperplane.dm:36)  may sleep
rt.def("/obj/item/weapon/paperplane/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "Stun", [200]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ jams the ＀ in ＀ nose. It looks like ＀ trying to commit suicide!</span>", [live(user), live(f.src), (yield* g.callName(f, live(user), "p_their", [])), (yield* g.callName(f, live(user), "p_theyre", []))])]);
	yield* g.callName(f, live(user), "adjust_blurriness", [6]);
	yield* g.callName(f, live(user), "adjust_eye_damage", [(yield* g.call(f, P("/proc/rand"), null, [6, 8]))]);
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	return 1;
}, true);

// /obj/item/weapon/paperplane/proc/update_icon  (code/modules/paperwork/paperplane.dm:44)
rt.def("/obj/item/weapon/paperplane/proc/update_icon", function update_icon(f: Frame) {
	let stamped: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [stamped, S, $e];
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy((stamped = rt.fv(f, "stamped", rt.sv(f, "internalPaper"))))) return f.dot;
	S = null;
	rt.forList(f, 0, live(stamped));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		rt.callSrc(f, "add_overlay", [fmt("paperplane_＀", [live(S)])]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/weapon/paperplane/proc/attack_self  (code/modules/paperwork/paperplane.dm:51)  may sleep
rt.def("/obj/item/weapon/paperplane/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let internal_paper_tmp: Value = null;
	f.vars = () => [user, internal_paper_tmp];
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You unfold ＀.</span>", [live(f.src)])]);
	yield* g.callName(f, (internal_paper_tmp = rt.sv(f, "internalPaper")), "forceMove", [rt.sv(f, "loc")]);
	rt.setSv(f, "internalPaper", null);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	yield* g.callName(f, live(user), "put_in_hands", [live(internal_paper_tmp)]);
	return f.dot;
}, true);

// /obj/item/weapon/paperplane/proc/attackby  (code/modules/paperwork/paperplane.dm:59)  may sleep
rt.def("/obj/item/weapon/paperplane/proc/attackby", function* attackby(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/toy/crayon")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You should unfold ＀ before changing it.</span>", [live(f.src)])]);
		return live(f.dot);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/stamp")) ? 1 : 0))) {
			yield* g.callName(f, rt.sv(f, "internalPaper"), "attackby", [live(f.args[0]), live(f.args[1])]);
			yield* g.srcCall(f, "update_icon");
		} else {
			if (truthy((yield* g.callName(f, live(f.args[0]), "is_hot", [])))) {
				if ((truthy(rt.bitAnd(rt.fv(f, "disabilities", live(f.args[1])), 256)) && truthy(rt.op(f, "Prob", [], [10])))) {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ accidentally ignites themselves!</span>", [live(f.args[1])]), fmt("<span class='userdanger'>You miss the ＀ and accidentally light yourself on fire!</span>", [live(f.src)])]);
					yield* g.callName(f, live(f.args[1]), "dropItemToGround", [live(f.args[0])]);
					yield* g.callName(f, live(f.args[1]), "adjust_fire_stacks", [1]);
					yield* g.callName(f, live(f.args[1]), "IgniteMob", []);
					return live(f.dot);
				}
				if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.args[1]), live(f.src)])), 1)) {
					return live(f.dot);
				}
				yield* g.callName(f, live(f.args[1]), "dropItemToGround", [live(f.src)]);
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='danger'>＀ lights ＀ ablaze with ＀!</span>", [live(f.args[1]), live(f.src), live(f.args[0])]), fmt("<span class='danger'>You light ＀ on fire!</span>", [live(f.src)])]);
				yield* g.srcCall(f, "fire_act");
			}
		}
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	return f.dot;
}, true, { args: ["P", "user", "params"] });

// /obj/item/weapon/paperplane/proc/throw_at  (code/modules/paperwork/paperplane.dm:87)  may sleep
rt.def("/obj/item/weapon/paperplane/proc/throw_at", function* throw_at(f: Frame, target: Value, range: Value, speed: Value, thrower: Value, spin: Value, diagonals_first: Value, callback: Value) {
	f.vars = () => [target, range, speed, thrower, spin, diagonals_first, callback];
	if (live(spin) === null) {
		spin = 0;
	}
	if (live(diagonals_first) === null) {
		diagonals_first = 0;
	}
	f.dot = (yield* g.callSuper(f, [live(target), live(range), live(speed), live(thrower), 0, live(diagonals_first), live(callback)]));
	return f.dot;
}, true);

// /obj/item/weapon/paperplane/proc/throw_impact  (code/modules/paperwork/paperplane.dm:90)  may sleep
rt.def("/obj/item/weapon/paperplane/proc/throw_impact", function* throw_impact(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if ((truthy((yield* g.callSuper(f, [], rt.Args.Same))) || !truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		return live(f.dot);
	}
	H = live(f.args[0]);
	if (!truthy(rt.op(f, "Prob", [], [2]))) return f.dot;
	if ((((truthy(rt.fv(f, "head", live(H))) && truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "head", live(H))), 4))) || (truthy(rt.fv(f, "wear_mask", live(H))) && truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "wear_mask", live(H))), 2)))) || (truthy(rt.fv(f, "glasses", live(H))) && truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "glasses", live(H))), 1))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＄！ hits ＀ in the eye!</span>", [live(f.src), live(H)]));
	yield* g.callName(f, live(H), "adjust_blurriness", [6]);
	yield* g.callName(f, live(H), "adjust_eye_damage", [(yield* g.call(f, P("/proc/rand"), null, [6, 8]))]);
	yield* g.callName(f, live(H), "Knockdown", [40]);
	yield* g.callName(f, live(H), "emote", ["scream"]);
	return f.dot;
}, true, { args: ["hit_atom"], waitfor: false });

// /obj/item/weapon/paper/proc/AltClick  (code/modules/paperwork/paperplane.dm:103)  may sleep
rt.def("/obj/item/weapon/paper/proc/AltClick", function* AltClick(f: Frame, user: Value, I: Value) {
	f.vars = () => [user, I];
	if (truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) {
		if (((!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 1) || truthy(rt.fv(f, "stat", live(user)))) || truthy((yield* g.callName(f, live(user), "restrained", []))))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You fold ＀ into the shape of a plane!</span>", [live(f.src)])]);
		yield* g.callName(f, live(user), "temporarilyRemoveItemFromInventory", [live(f.src)]);
		I = (yield* g.new_(f, T("/obj/item/weapon/paperplane"), [live(user), live(f.src)]));
		yield* g.callName(f, live(user), "put_in_hands", [live(I)]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'> You lack the dexterity to fold ％！. </span>", [live(f.src)])]);
	}
	return f.dot;
}, true);
