// From code/modules/spells/spell_types/devil.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11303, "/obj/effect/proc_holder/spell/targeted/summon_contract", "/obj/effect/proc_holder/spell/targeted", {
	include_user: 0,
	name: "Summon infernal contract",
	desc: "Skip making a contract by hand, just do it by magic.",
	invocation_type: "whisper",
	invocation: "Just sign on the dotted line.",
	range: 5,
	clothes_req: 0,
	school: "conjuration",
	charge_max: 150,
	cooldown_min: 10,
	action_icon_state: "spell_default",
	action_background_icon_state: "bg_demon",
});

// /obj/effect/proc_holder/spell/targeted/summon_contract/proc/cast  (code/modules/spells/spell_types/devil.dm:47)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/summon_contract/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let C: Value = null, contract: Value = null, contractTypeName: Value = null;
	let $0: any, $e: any;
	f.vars = () => [targets, user, C, contract, contractTypeName, $0, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	C = null;
	rt.forList(f, 0, live(targets), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if ((truthy(rt.fv(f, "mind", live(C))) && truthy(rt.fv(f, "mind", live(user))))) {
			if (isEqual(rt.fv(f, "stat", live(C)), 2)) {
				if (truthy((yield* g.callName(f, live(user), "drop_item", [])))) {
					contract = (yield* g.new_(f, T("/obj/item/weapon/paper/contract/infernal/revive"), [rt.fv(f, "loc", live(user)), rt.fv(f, "mind", live(C)), rt.fv(f, "mind", live(user))]));
					yield* g.callName(f, live(user), "put_in_hands", [live(contract)]);
				}
			} else {
				contract = null;
				$0 = (contractTypeName = (yield* g.op(f, "Prompt", [0], [null, null, "What type of contract?", live(user), rt.list("Power", "Wealth", "Prestige", "Magic", "Knowledge", "Friendship")])));
				if ($0 === "Power") {
					contract = (yield* g.new_(f, T("/obj/item/weapon/paper/contract/infernal/power"), [rt.fv(f, "loc", live(C)), rt.fv(f, "mind", live(C)), rt.fv(f, "mind", live(user))]));
				} else if ($0 === "Wealth") {
					contract = (yield* g.new_(f, T("/obj/item/weapon/paper/contract/infernal/wealth"), [rt.fv(f, "loc", live(C)), rt.fv(f, "mind", live(C)), rt.fv(f, "mind", live(user))]));
				} else if ($0 === "Prestige") {
					contract = (yield* g.new_(f, T("/obj/item/weapon/paper/contract/infernal/prestige"), [rt.fv(f, "loc", live(C)), rt.fv(f, "mind", live(C)), rt.fv(f, "mind", live(user))]));
				} else if ($0 === "Magic") {
					contract = (yield* g.new_(f, T("/obj/item/weapon/paper/contract/infernal/magic"), [rt.fv(f, "loc", live(C)), rt.fv(f, "mind", live(C)), rt.fv(f, "mind", live(user))]));
				} else if ($0 === "Knowledge") {
					contract = (yield* g.new_(f, T("/obj/item/weapon/paper/contract/infernal/knowledge"), [rt.fv(f, "loc", live(C)), rt.fv(f, "mind", live(C)), rt.fv(f, "mind", live(user))]));
				} else if ($0 === "Friendship") {
					contract = (yield* g.new_(f, T("/obj/item/weapon/paper/contract/infernal/friend"), [rt.fv(f, "loc", live(C)), rt.fv(f, "mind", live(C)), rt.fv(f, "mind", live(user))]));
				}
				yield* g.callName(f, live(C), "put_in_hands", [live(contract)]);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ seems to not be sentient.  You cannot summon a contract for ＀.</span>", [live(C), (yield* g.callName(f, live(C), "p_them", []))])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(11304, "/obj/effect/proc_holder/spell/targeted/infernal_jaunt", "/obj/effect/proc_holder/spell/targeted", {
	include_user: 1,
	name: "Infernal Jaunt",
	desc: "Use hellfire to phase out of existence.",
	charge_max: 200,
	clothes_req: 0,
	selection_type: "range",
	range: -1,
	cooldown_min: 0,
	overlay: null,
	action_icon_state: "jaunt",
	action_background_icon_state: "bg_demon",
	phase_allowed: 1,
});

// /obj/effect/proc_holder/spell/targeted/infernal_jaunt/proc/cast  (code/modules/spells/spell_types/devil.dm:104)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/infernal_jaunt/proc/cast", function* cast(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = live(f.usr);
	}
	if (truthy((rt.istype(live(f.args[1]), T("/mob/living")) ? 1 : 0))) {
		if (truthy((rt.istype(rt.fv(f, "loc", live(f.args[1])), T("/obj/effect/dummy/slaughter")) ? 1 : 0))) {
			if (truthy((yield* g.srcCall(f, "valid_location", live(f.args[1]))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You are now phasing in.</span>"]);
				if (truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(f.args[1]), live(f.args[1]), 150])))) {
					if (truthy((yield* g.srcCall(f, "valid_location", live(f.args[1]))))) {
						yield* g.callName(f, live(f.args[1]), "infernalphasein", []);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You are no longer near a potential signer.</span>"]);
					}
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You can only re-appear near a potential signer."]);
				yield* g.srcCall(f, "revert_cast");
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
		} else {
			rt.setFv(f, "notransform", live(f.args[1]), 1);
			yield* g.callName(f, live(f.args[1]), "fakefire", []);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You begin to phase back into sinful flames.</span>"]);
			if (truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(f.args[1]), live(f.args[1]), 150])))) {
				yield* g.callName(f, live(f.args[1]), "infernalphaseout", []);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You must remain still while exiting.</span>"]);
				yield* g.callName(f, live(f.args[1]), "ExtinguishMob", []);
			}
		}
		yield* g.srcCall(f, "start_recharge");
		return live(f.dot);
	}
	yield* g.srcCall(f, "revert_cast");
	return f.dot;
}, true, { args: ["targets", "user"] });

// /obj/effect/proc_holder/spell/targeted/infernal_jaunt/proc/valid_location  (code/modules/spells/spell_types/devil.dm:132)
rt.def("/obj/effect/proc_holder/spell/targeted/infernal_jaunt/proc/valid_location", function valid_location(f: Frame, user: Value) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [user, C, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (truthy((rt.istype(rt.call(f, P("/proc/get_area"), null, [live(user)]), T("/area/shuttle")) ? 1 : 0))) {
		return 1;
	} else {
		C = null;
		rt.forList(f, 0, rt.call(f, P("/proc/orange"), null, [2, rt.getStep(f, live(user), 0)]), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			if (truthy(rt.callName(f, live(C), "owns_soul", []))) {
				return 1;
			}
		}
		rt.endFor(f, 0);
	}
	return 0;
});

// /mob/living/proc/infernalphaseout  (code/modules/spells/spell_types/devil.dm:141)  may sleep
rt.def("/mob/living/proc/infernalphaseout", function* infernalphaseout(f: Frame) {
	let holder: Value = null;
	f.vars = () => [holder];
	yield* g.srcCall(f, "dust_animation");
	yield* g.srcCall(f, "spawn_dust");
	yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='warning'>＀ disappears in a flashfire!</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/magic/enter_blood.ogg"), 100, 1, -1]);
	holder = (yield* g.new_(f, T("/obj/effect/dummy/slaughter"), [rt.sv(f, "loc")]));
	yield* g.callName(f, live(f.src), "ExtinguishMob", []);
	if (truthy(rt.sv(f, "buckled"))) {
		yield* g.callName(f, rt.sv(f, "buckled"), "unbuckle_mob", [null, live(f.src), "force", 1], rt.Args.Named);
	}
	if (truthy((yield* g.srcCall(f, "has_buckled_mobs")))) {
		yield* g.callSrc(f, "unbuckle_all_mobs", ["force", 1], rt.Args.Named);
	}
	if (truthy(rt.sv(f, "pulledby"))) {
		yield* g.callName(f, rt.sv(f, "pulledby"), "stop_pulling", []);
	}
	if (truthy(rt.sv(f, "pulling"))) {
		yield* g.srcCall(f, "stop_pulling");
	}
	rt.setFv(f, "loc", live(f.src), live(holder));
	rt.setFv(f, "holder", live(f.src), live(holder));
	rt.setFv(f, "notransform", live(f.src), 0);
	yield* g.srcCall(f, "fakefireextinguish");
	return f.dot;
}, true);

// /mob/living/proc/infernalphasein  (code/modules/spells/spell_types/devil.dm:161)  may sleep
rt.def("/mob/living/proc/infernalphasein", function* infernalphasein(f: Frame) {
	if (truthy(rt.fv(f, "notransform", live(f.src)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You're too busy to jaunt in.</span>"]);
		return 0;
	}
	yield* g.srcCall(f, "fakefire");
	rt.setFv(f, "loc", live(f.src), rt.getStep(f, live(f.src), 0));
	rt.setFv(f, "eye", rt.fv(f, "client", live(f.src)), live(f.src));
	yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='warning'><B>＀ appears in a fiery blaze!</B>", [live(f.src)])]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/magic/exit_blood.ogg"), 100, 1, -1]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/proc/fakefireextinguish")])), 15, 1]);
	return f.dot;
}, true);

rt.type(11305, "/obj/effect/proc_holder/spell/targeted/sintouch", "/obj/effect/proc_holder/spell/targeted", {
	include_user: 0,
	random_target: 1,
	random_target_priority: 2,
	max_targets: 3,
	name: "Sin Touch",
	desc: "Subtly encourage someone to sin.",
	charge_max: 1800,
	clothes_req: 0,
	selection_type: "range",
	range: 2,
	cooldown_min: 0,
	overlay: null,
	action_icon_state: "sintouch",
	action_background_icon_state: "bg_demon",
	phase_allowed: 0,
	invocation: "TASTE SIN AND INDULGE!!",
	invocation_type: "shout",
});

// /obj/effect/proc_holder/spell/targeted/sintouch/proc/cast  (code/modules/spells/spell_types/devil.dm:197)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/sintouch/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let H: Value = null;
	let $e: any;
	f.vars = () => [targets, user, H, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	H = null;
	rt.forList(f, 0, live(targets), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (!truthy(rt.fv(f, "mind", live(H)))) {
			continue;
		}
		if (truthy(rt.locateIn(f, T("/datum/objective/sintouched"), rt.gv(f, "objectives", rt.fv(f, "mind", live(H)))))) {
			continue;
		}
		yield* g.callName(f, live(H), "influenceSin", []);
		yield* g.callName(f, live(H), "Knockdown", [400]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(11307, "/obj/effect/proc_holder/spell/targeted/summon_dancefloor", "/obj/effect/proc_holder/spell/targeted", {
	dancefloor_turfs: null,
	dancefloor_turfs_types: null,
	dancefloor_exists: 0,
	smoke: null,
	include_user: 1,
	name: "Summon Dancefloor",
	desc: "When what a Devil really needs is funk.",
	range: -1,
	clothes_req: 0,
	school: "conjuration",
	charge_max: 10,
	cooldown_min: 50,
	action_icon_state: "funk",
	action_background_icon_state: "bg_demon",
});

// /obj/effect/proc_holder/spell/targeted/summon_dancefloor/proc/cast  (code/modules/spells/spell_types/devil.dm:226)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/summon_dancefloor/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let i: Value = null, _T: Value = null, funky_turfs: Value = null, solid: Value = null, i_1: Value = null, t: Value = null, _T_3: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [targets, user, i, _T, funky_turfs, solid, i_1, t, _T_3, $0, $1, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (!truthy(rt.sv(f, "dancefloor_turfs"))) {
		rt.setSv(f, "dancefloor_turfs", rt.list());
	}
	if (!truthy(rt.sv(f, "dancefloor_turfs_types"))) {
		rt.setSv(f, "dancefloor_turfs_types", rt.list());
	}
	if (!truthy(rt.sv(f, "smoke"))) {
		rt.setSv(f, "smoke", (yield* g.new_(f, T("/datum/effect_system/smoke_spread/transparent/dancefloor_devil"), [])));
	}
	yield* g.callName(f, rt.sv(f, "smoke"), "set_up", [0, rt.getStep(f, live(user), 0)]);
	yield* g.callName(f, rt.sv(f, "smoke"), "start", []);
	if (truthy(rt.sv(f, "dancefloor_exists"))) {
		rt.setSv(f, "dancefloor_exists", 0);
		i = null;
		rt.forRange(f, 0, 1, rt.len(f, rt.sv(f, "dancefloor_turfs")), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* g.callName(f, (_T = rt.index(rt.sv(f, "dancefloor_turfs"), live(i))), "ChangeTurf", [rt.index(rt.sv(f, "dancefloor_turfs_types"), live(i))]);
		}
		rt.endFor(f, 0);
	} else {
		funky_turfs = (yield* g.call(f, P("/proc/block"), null, [rt.locate((yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(user)), 1), 1])), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(user)), 1), 1])), rt.fv(f, "z", live(user))), rt.locate((yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(user)), 1), rt.fv(f, "maxx", rt.world())])), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(user)), 1), rt.fv(f, "maxy", rt.world())])), rt.fv(f, "z", live(user)))]));
		solid = null;
		rt.forList(f, 0, live(funky_turfs), T("/turf/closed"));
		while (($e = rt.next(f, 0)) !== undefined) {
			solid = $e;
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You're too close to a wall.</span>"]);
			return live(f.dot);
		}
		rt.endFor(f, 0);
		rt.setSv(f, "dancefloor_exists", 1);
		i_1 = 1;
		rt.setFv(f, "len", rt.sv(f, "dancefloor_turfs"), rt.len(f, live(funky_turfs)));
		rt.setFv(f, "len", rt.sv(f, "dancefloor_turfs_types"), rt.len(f, live(funky_turfs)));
		t = null;
		rt.forList(f, 0, live(funky_turfs));
		while (($e = rt.next(f, 0)) !== undefined) {
			t = $e;
			_T_3 = live(t);
			rt.setAt(rt.sv(f, "dancefloor_turfs"), live(i_1), live(_T_3));
			rt.setAt(rt.sv(f, "dancefloor_turfs_types"), live(i_1), rt.fv(f, "type", live(_T_3)));
			$0 = live(_T_3);
			if (isEqual(rt.modulus(live(i_1), 2), 0)) {
				$1 = T("/turf/open/floor/light/colour_cycle/dancefloor_a");
			} else {
				$1 = T("/turf/open/floor/light/colour_cycle/dancefloor_b");
			}
			yield* g.callName(f, $0, "ChangeTurf", [$1]);
			i_1 = rt.inc(live(i_1), 1);
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true);
