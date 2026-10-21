// From code/game/gamemodes/clock_cult/clock_items/judicial_visor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8206, "/obj/item/clothing/glasses/judicial_visor", "/obj/item/clothing/glasses", {
	active: 0,
	recharging: 0,
	blaster: null,
	recharge_cooldown: 300,
	name: "judicial visor",
	desc: "A strange purple-lensed visor. Looking at it inspires an odd sense of guilt.",
	icon: rt.rsc("icons/obj/clothing/clockwork_garb.dmi"),
	icon_state: "judicial_visor_0",
	item_state: "sunglasses",
	resistance_flags: 34,
	flash_protect: 1,
	actions_types: null,
});

// /obj/item/clothing/glasses/judicial_visor/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/judicial_visor.dm:14)
rt.def("/obj/item/clothing/glasses/judicial_visor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/clock/toggle_visor")));
	return f.dot;
});

// /obj/item/clothing/glasses/judicial_visor/proc/Initialize  (code/game/gamemodes/clock_cult/clock_items/judicial_visor.dm:17)  may sleep
rt.def("/obj/item/clothing/glasses/judicial_visor/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.modGl("all_clockwork_objects", live(f.src), add);
	rt.setSv(f, "blaster", (yield* g.new_(f, T("/obj/effect/proc_holder/judicial_visor"), [live(f.src)])));
	rt.setFv(f, "visor", rt.sv(f, "blaster"), live(f.src));
	return f.dot;
}, true);

// /obj/item/clothing/glasses/judicial_visor/proc/Destroy  (code/game/gamemodes/clock_cult/clock_items/judicial_visor.dm:23)  may sleep
rt.def("/obj/item/clothing/glasses/judicial_visor/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("all_clockwork_objects", live(f.src), subtract));
	if (truthy(rt.fv(f, "ranged_ability_user", rt.sv(f, "blaster")))) {
		yield* g.callName(f, rt.sv(f, "blaster"), "remove_ranged_ability", []);
	}
	rt.setFv(f, "visor", rt.sv(f, "blaster"), null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "blaster")]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/clothing/glasses/judicial_visor/proc/item_action_slot_check  (code/game/gamemodes/clock_cult/clock_items/judicial_visor.dm:31)
rt.def("/obj/item/clothing/glasses/judicial_visor/proc/item_action_slot_check", function item_action_slot_check(f: Frame) {
	if (!isEqual(live(f.args[0]), 8)) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["slot", "user"] });

// /obj/item/clothing/glasses/judicial_visor/proc/equipped  (code/game/gamemodes/clock_cult/clock_items/judicial_visor.dm:36)  may sleep
rt.def("/obj/item/clothing/glasses/judicial_visor/proc/equipped", function* equipped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!isEqual(live(f.args[1]), 8)) {
		yield* g.srcCall(f, "update_status", 0);
		if (truthy(rt.fv(f, "ranged_ability_user", rt.sv(f, "blaster")))) {
			yield* g.callName(f, rt.sv(f, "blaster"), "remove_ranged_ability", []);
		}
		return 0;
	}
	if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])))) {
		yield* g.srcCall(f, "update_status", 1);
	} else {
		yield* g.srcCall(f, "update_status", 0);
	}
	if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[0])])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='heavy_brass'>\"Consider yourself judged, whelp.\"</span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='userdanger'>You suddenly catch fire!</span>"]);
		yield* g.callName(f, live(f.args[0]), "adjust_fire_stacks", [5]);
		yield* g.callName(f, live(f.args[0]), "IgniteMob", []);
	}
	return 1;
}, true, { args: ["user", "slot"] });

// /obj/item/clothing/glasses/judicial_visor/proc/dropped  (code/game/gamemodes/clock_cult/clock_items/judicial_visor.dm:54)  may sleep
rt.def("/obj/item/clothing/glasses/judicial_visor/proc/dropped", function* dropped(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clothing/glasses/judicial_visor/proc/check_on_mob"), live(f.args[0])])), 1]);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clothing/glasses/judicial_visor/proc/check_on_mob  (code/game/gamemodes/clock_cult/clock_items/judicial_visor.dm:58)  may sleep
rt.def("/obj/item/clothing/glasses/judicial_visor/proc/check_on_mob", function* check_on_mob(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!(truthy(live(user)) && !isEqual(live(f.src), (yield* g.callName(f, live(user), "get_item_by_slot", [8]))))) return f.dot;
	yield* g.srcCall(f, "update_status", 0);
	if (!truthy(rt.fv(f, "ranged_ability_user", rt.sv(f, "blaster")))) return f.dot;
	yield* g.callName(f, rt.sv(f, "blaster"), "remove_ranged_ability", []);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// /obj/item/clothing/glasses/judicial_visor/proc/attack_self  (code/game/gamemodes/clock_cult/clock_items/judicial_visor.dm:64)  may sleep
rt.def("/obj/item/clothing/glasses/judicial_visor/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!(truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(user)]))) && isEqual(live(f.src), (yield* g.callName(f, live(user), "get_item_by_slot", [8]))))) return f.dot;
	yield* g.callName(f, rt.sv(f, "blaster"), "toggle", [live(user)]);
	return f.dot;
}, true);

// /obj/item/clothing/glasses/judicial_visor/proc/update_status  (code/game/gamemodes/clock_cult/clock_items/judicial_visor.dm:68)  may sleep
rt.def("/obj/item/clothing/glasses/judicial_visor/proc/update_status", function* update_status(f: Frame, change_to: Value) {
	let L: Value = null;
	let $0: any;
	f.vars = () => [change_to, L, $0];
	if ((truthy(rt.sv(f, "recharging")) || !truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living")) ? 1 : 0)))) {
		rt.setSv(f, "icon_state", "judicial_visor_0");
		return 0;
	}
	if (isEqual(rt.sv(f, "active"), live(change_to))) {
		return 0;
	}
	L = rt.sv(f, "loc");
	rt.setSv(f, "active", live(change_to));
	rt.setSv(f, "icon_state", fmt("judicial_visor_＀", [rt.sv(f, "active")]));
	yield* g.callName(f, live(L), "update_action_buttons_icon", []);
	yield* g.callName(f, live(L), "update_inv_glasses", []);
	if ((!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)]))) || truthy(rt.fv(f, "stat", live(L))))) {
		return 0;
	}
	$0 = rt.sv(f, "active");
	if ($0 === 1) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(L), fmt("<span class='notice'>As you put on ＀, its lens begins to glow, information flashing before your eyes.</span>\n<span class='heavy_brass'>Judicial visor active. Use the action button to gain the ability to smite the unworthy.</span>", [live(f.src)])]);
	} else if ($0 === 0) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(L), fmt("<span class='notice'>As you take off ＀, its lens darkens once more.</span>", [live(f.src)])]);
	}
	return 1;
}, true);

// /obj/item/clothing/glasses/judicial_visor/proc/recharge_visor  (code/game/gamemodes/clock_cult/clock_items/judicial_visor.dm:89)  may sleep
rt.def("/obj/item/clothing/glasses/judicial_visor/proc/recharge_visor", function* recharge_visor(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(live(f.src))) {
		return 0;
	}
	rt.setSv(f, "recharging", 0);
	if ((truthy(live(user)) && isEqual(live(f.src), (yield* g.callName(f, live(user), "get_item_by_slot", [8]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='brass'>Your ＀ hums. It is ready.</span>", [rt.sv(f, "name")])]);
	} else {
		rt.setSv(f, "active", 0);
	}
	rt.setSv(f, "icon_state", fmt("judicial_visor_＀", [rt.sv(f, "active")]));
	if (!truthy(live(user))) return f.dot;
	yield* g.callName(f, live(user), "update_action_buttons_icon", []);
	yield* g.callName(f, live(user), "update_inv_glasses", []);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }] });

rt.type(11268, "/obj/effect/proc_holder/judicial_visor", "/obj/effect/proc_holder", {
	visor: null,
	active: 0,
	ranged_mousepointer: rt.rsc("icons/effects/visor_reticule.dmi"),
});

// /obj/effect/proc_holder/judicial_visor/proc/toggle  (code/game/gamemodes/clock_cult/clock_items/judicial_visor.dm:109)  may sleep
rt.def("/obj/effect/proc_holder/judicial_visor/proc/toggle", function* toggle(f: Frame, user: Value) {
	let message: Value = null;
	f.vars = () => [user, message];
	message = null;
	if (truthy(rt.sv(f, "active"))) {
		yield* g.srcCall(f, "remove_ranged_ability", (message = fmt("<span class='brass'>You dispel the power of ＀.</span>", [rt.sv(f, "visor")])));
	} else {
		message = fmt("<span class='brass'><i>You harness ＀'s power.</i> <b>Left-click to place a judicial marker!</b></span>", [rt.sv(f, "visor")]);
		yield* g.srcCall(f, "add_ranged_ability", live(user), live(message));
	}
	return f.dot;
}, true);

// /obj/effect/proc_holder/judicial_visor/proc/InterceptClickOn  (code/game/gamemodes/clock_cult/clock_items/judicial_visor.dm:116)  may sleep
rt.def("/obj/effect/proc_holder/judicial_visor/proc/InterceptClickOn", function* InterceptClickOn(f: Frame) {
	let _T: Value = null, V: Value = null, targetturf: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [_T, V, targetturf, $0, $1, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (((truthy((yield* g.callName(f, rt.sv(f, "ranged_ability_user"), "incapacitated", []))) || !truthy(rt.sv(f, "visor"))) || !isEqual(rt.sv(f, "visor"), (yield* g.callName(f, rt.sv(f, "ranged_ability_user"), "get_item_by_slot", [8]))))) {
		yield* g.srcCall(f, "remove_ranged_ability");
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [(_T = rt.fv(f, "loc", rt.sv(f, "ranged_ability_user")))])))) {
		return 0;
	}
	if (truthy((rt.isIn(f, live(f.args[2]), (yield* g.call(f, P("/proc/view"), null, [7, rt.getStep(f, rt.sv(f, "ranged_ability_user"), 0)]))) ? 1 : 0))) {
		rt.setFv(f, "recharging", rt.sv(f, "visor"), 1);
		yield* g.callName(f, rt.sv(f, "visor"), "update_status", []);
		V = null;
		rt.forList(f, 0, (yield* g.callName(f, rt.sv(f, "ranged_ability_user"), "GetAllContents", [])), T("/obj/item/clothing/glasses/judicial_visor"));
		while (($e = rt.next(f, 0)) !== undefined) {
			V = $e;
			if (isEqual(live(V), rt.sv(f, "visor"))) {
				continue;
			}
			rt.setFv(f, "recharging", live(V), 1);
			yield* g.callName(f, live(V), "update_status", []);
			$0 = (yield* g.new_(f, T("/datum/callback"), [live(V), P("/obj/item/clothing/glasses/judicial_visor/proc/recharge_visor"), rt.sv(f, "ranged_ability_user")]));
			if (truthy(rt.gl("ratvar_awakens"))) {
				$1 = multiply(rt.fv(f, "recharge_cooldown", rt.sv(f, "visor")), 0.10000000149011612);
			} else {
				$1 = rt.fv(f, "recharge_cooldown", rt.sv(f, "visor"));
			}
			yield* g.call(f, P("/proc/addtimer"), null, [$0, multiply($1, 2)]);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/clockwork_say"), null, [rt.sv(f, "ranged_ability_user"), (yield* g.call(f, P("/proc/text2ratvar"), null, ["Kneel, heathens!"]))]);
		yield* g.callName(f, rt.sv(f, "ranged_ability_user"), "visible_message", [fmt("<span class='warning'>＀'s judicial visor fires a stream of energy at ＀, creating a strange mark!</span>", [rt.sv(f, "ranged_ability_user"), live(f.args[2])]), fmt("<span class='heavy_brass'>You direct ＀'s power to ＀. You must wait for some time before doing this again.</span>", [rt.sv(f, "visor"), live(f.args[2])])]);
		yield* g.new_(f, T("/obj/effect/clockwork/judicial_marker"), [(targetturf = rt.getStep(f, live(f.args[2]), 0)), rt.sv(f, "ranged_ability_user")]);
		yield* g.call(f, P("/proc/add_logs"), null, [rt.sv(f, "ranged_ability_user"), live(targetturf), "created a judicial marker"]);
		yield* g.callName(f, rt.sv(f, "ranged_ability_user"), "update_action_buttons_icon", []);
		yield* g.callName(f, rt.sv(f, "ranged_ability_user"), "update_inv_glasses", []);
		$0 = (yield* g.new_(f, T("/datum/callback"), [rt.sv(f, "visor"), P("/obj/item/clothing/glasses/judicial_visor/proc/recharge_visor"), rt.sv(f, "ranged_ability_user")]));
		if (truthy(rt.gl("ratvar_awakens"))) {
			$1 = multiply(rt.fv(f, "recharge_cooldown", rt.sv(f, "visor")), 0.10000000149011612);
		} else {
			$1 = rt.fv(f, "recharge_cooldown", rt.sv(f, "visor"));
		}
		yield* g.call(f, P("/proc/addtimer"), null, [$0, $1]);
		yield* g.srcCall(f, "remove_ranged_ability");
		return 1;
	}
	return 0;
}, true, { args: ["caller", "params", "target"] });

rt.type(11423, "/obj/effect/clockwork/judicial_marker", "/obj/effect/clockwork", {
	user: null,
	clockwork_desc: "A sigil that will soon erupt and smite any unenlightened nearby.",
	name: "judicial marker",
	desc: "You get the feeling that you shouldn't be standing here.",
	icon: rt.rsc("icons/effects/96x96.dmi"),
	pixel_x: -32,
	pixel_y: -32,
	layer: 3.7,
});

// /obj/effect/clockwork/judicial_marker/proc/Initialize  (code/game/gamemodes/clock_cult/clock_items/judicial_visor.dm:160)
rt.def("/obj/effect/clockwork/judicial_marker/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "set_light", [1.399999976158142, 2, "#FE9C11"]);
	rt.setSv(f, "user", live(f.args[1]));
	rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/effect/clockwork/judicial_marker/proc/judicialblast")]);
	return f.dot;
}, false, { args: ["mapload", "caster"] });

// /obj/effect/clockwork/judicial_marker/proc/judicialblast  (code/game/gamemodes/clock_cult/clock_items/judicial_visor.dm:166)  may sleep
rt.def("/obj/effect/clockwork/judicial_marker/proc/judicialblast", function* judicialblast(f: Frame) {
	let targetsjudged: Value = null, L: Value = null, I: Value = null, C: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [targetsjudged, L, I, C, $0, $1, $2, $e];
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/magic/magic_missile.ogg"), 50, 1, 1, 1]);
	yield* g.call(f, P("/proc/flick"), null, ["judicial_marker", live(f.src)]);
	yield* g.call(f, P("/proc/sleep"), null, [16]);
	rt.setSv(f, "layer", 4.5);
	yield* g.call(f, P("/proc/flick"), null, ["judicial_explosion", live(f.src)]);
	yield* g.srcCall(f, "set_light", 1.399999976158142, 2, "#B451A1");
	yield* g.call(f, P("/proc/sleep"), null, [13]);
	targetsjudged = 0;
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/explosionfar.ogg"), 100, 1, 1, 1]);
	yield* g.srcCall(f, "set_light", 0);
	L = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)])))) {
			continue;
		}
		if (truthy((yield* g.callName(f, live(L), "null_rod_check", [])))) {
			I = (yield* g.callName(f, live(L), "null_rod_check", []));
			yield* g.callName(f, live(L), "visible_message", [fmt("<span class='warning'>Strange energy flows into ＀'s ＀!</span>", [live(L), rt.fv(f, "name", live(I))]), fmt("<span class='userdanger'>Your ＀ shields you from ＀!</span>", [rt.fv(f, "name", live(I)), live(f.src)])]);
			continue;
		}
		if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(L)])))) {
			$0 = live(L);
			$1 = fmt("<span class='warning'>＀ is struck by a judicial explosion!</span>", [live(L)]);
			if (!truthy((rt.istype(live(L), T("/mob/living/silicon")) ? 1 : 0))) {
				$2 = "An unseen force slams you into the ground!";
			} else {
				$2 = "ERROR: Motor servos disabled by external source!";
			}
			yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='userdanger'>＀</span>", [$2])]);
			yield* g.callName(f, live(L), "Knockdown", [160]);
		} else {
			yield* g.callName(f, live(L), "visible_message", [fmt("<span class='warning'>＀ is struck by a judicial explosion!</span>", [live(L)]), "<span class='heavy_brass'>\"Keep an eye out, filth.\"</span>\n<span class='userdanger'>A burst of heat crushes you against the ground!</span>"]);
			yield* g.callName(f, live(L), "Knockdown", [80]);
			yield* g.callName(f, live(L), "adjust_fire_stacks", [2]);
			yield* g.callName(f, live(L), "IgniteMob", []);
		}
		if (truthy((rt.istype(live(L), T("/mob/living/carbon")) ? 1 : 0))) {
			rt.modField(f, (C = live(L)), "silent", 6, add);
		}
		targetsjudged = rt.inc(live(targetsjudged), 1);
		yield* g.callName(f, live(L), "adjustBruteLoss", [10]);
		yield* g.call(f, P("/proc/add_logs"), null, [rt.sv(f, "user"), live(L), "struck with a judicial blast"]);
	}
	rt.endFor(f, 0);
	$0 = rt.sv(f, "user");
	if (truthy(live(targetsjudged))) {
		$1 = fmt("Successfully judged <span class='neovgre'>＀</span>", [live(targetsjudged)]);
	} else {
		$1 = "Judged no";
	}
	if (isEqual(live(targetsjudged), 1)) {
		$2 = "";
	} else {
		$2 = "s";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='brass'><b>＀ heretic＀.</b></span>", [$1, $2])]);
	yield* g.call(f, P("/proc/sleep"), null, [3]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
