// From code/game/objects/items/weapons/melee/misc.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5654, "/obj/item/weapon/melee", "/obj/item/weapon", {
	needs_permit: 1,
});

// /obj/item/weapon/melee/proc/check_martial_counter  (code/game/objects/items/weapons/melee/misc.dm:5)  may sleep
rt.def("/obj/item/weapon/melee/proc/check_martial_counter", function* check_martial_counter(f: Frame, target: Value, user: Value) {
	f.vars = () => [target, user];
	if (!truthy((yield* g.callName(f, live(target), "check_block", [])))) return f.dot;
	yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀ blocks ＀ and twists ＀'s arm behind their back!</span>", [rt.fv(f, "name", live(target)), live(f.src), live(user)]), "<span class='userdanger'>You block the attack!</span>"]);
	yield* g.callName(f, live(user), "Stun", [40]);
	return 1;
}, true);

rt.type(5665, "/obj/item/weapon/melee/chainofcommand", "/obj/item/weapon/melee", {
	flags: 64,
	name: "chain of command",
	desc: "A tool used by great men to placate the frothing masses.",
	icon_state: "chain",
	item_state: "chain",
	slot_flags: 512,
	force: 10,
	throwforce: 7,
	w_class: 3,
	origin_tech: "combat=5",
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/chainhit.ogg"),
	materials: null,
});

// /obj/item/weapon/melee/chainofcommand/proc/<init>  (code/game/objects/items/weapons/melee/misc.dm:25)
rt.def("/obj/item/weapon/melee/chainofcommand/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("flogged", "whipped", "lashed", "disciplined"));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1000]));
	return f.dot;
});

// /obj/item/weapon/melee/chainofcommand/proc/suicide_act  (code/game/objects/items/weapons/melee/misc.dm:28)
rt.def("/obj/item/weapon/melee/chainofcommand/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is strangling ＀self with ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.callName(f, live(user), "p_them", []), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
	return 8;
});

rt.type(5687, "/obj/item/weapon/melee/sabre", "/obj/item/weapon/melee", {
	flags: 64,
	name: "officer's sabre",
	desc: "An elegant weapon, its monomolecular edge is capable of cutting through flesh and bone with ease.",
	icon_state: "sabre",
	item_state: "sabre",
	unique_rename: 1,
	force: 15,
	throwforce: 10,
	w_class: 4,
	block_chance: 50,
	armour_penetration: 75,
	sharpness: 1,
	origin_tech: "combat=5",
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/rapierhit.ogg"),
	materials: null,
});

// /obj/item/weapon/melee/sabre/proc/<init>  (code/game/objects/items/weapons/melee/misc.dm:61)
rt.def("/obj/item/weapon/melee/sabre/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("slashed", "cut"));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1000]));
	return f.dot;
});

// /obj/item/weapon/melee/sabre/proc/hit_reaction  (code/game/objects/items/weapons/melee/misc.dm:64)
rt.def("/obj/item/weapon/melee/sabre/proc/hit_reaction", function hit_reaction(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = "the attack";
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if (live(f.args[4]) === null) {
		f.args[4] = 0;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = 1;
	}
	if (isEqual(live(f.args[5]), 3)) {
		f.args[3] = 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });

rt.type(5688, "/obj/item/weapon/melee/classic_baton", "/obj/item/weapon/melee", {
	cooldown: 0,
	on: 1,
	name: "police baton",
	desc: "A wooden truncheon for beating criminal scum.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "baton",
	item_state: "classic_baton",
	slot_flags: 512,
	force: 12,
	w_class: 3,
});

// /obj/item/weapon/melee/classic_baton/proc/attack  (code/game/objects/items/weapons/melee/misc.dm:81)  may sleep
rt.def("/obj/item/weapon/melee/classic_baton/proc/attack", function* attack(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (!truthy(rt.sv(f, "on"))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if ((truthy((rt.isIn(f, 256, rt.fv(f, "disabilities", live(f.args[1]))) ? 1 : 0)) && truthy(rt.op(f, "Prob", [], [50])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class ='danger'>You club yourself over the head.</span>"]);
		yield* g.callName(f, live(f.args[1]), "Knockdown", [multiply(60, rt.sv(f, "force"))]);
		if (truthy((rt.istype(live(f.args[1]), T("/mob/living/carbon/human")) ? 1 : 0))) {
			yield* g.callName(f, (H = live(f.args[1])), "apply_damage", [multiply(2, rt.sv(f, "force")), "brute", "head"]);
		} else {
			yield* g.callName(f, live(f.args[1]), "take_bodypart_damage", [multiply(2, rt.sv(f, "force"))]);
		}
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		yield* g.callSuper(f, [], rt.Args.Same);
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
		if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
			return live(f.dot);
		}
		if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon/robot")) ? 1 : 0))) {
			return live(f.dot);
		}
	} else {
		if (!rt.le(rt.sv(f, "cooldown"), rt.worldTime(f))) return f.dot;
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, (H = live(f.args[0])), "check_shields", [live(f.src), 0, fmt("＀'s ＀", [live(f.args[1]), rt.sv(f, "name")]), 1])))) {
				return live(f.dot);
			}
			if (truthy((yield* g.srcCall(f, "check_martial_counter", live(H), live(f.args[1]))))) {
				return live(f.dot);
			}
		}
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/effects/woodhit.ogg"), 75, 1, -1]);
		yield* g.callName(f, live(f.args[0]), "Knockdown", [60]);
		yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[1]), live(f.args[0]), "stunned", live(f.src)]);
		yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.args[1])]);
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class ='danger'>＀ has knocked down ＀ with ＀!</span>", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class ='userdanger'>＀ has knocked down ＀ with ＀!</span>", [live(f.args[1]), live(f.args[0]), live(f.src)])]);
		if (!truthy((rt.istype(live(f.args[1]), T("/mob/living/carbon")) ? 1 : 0))) {
			rt.setFv(f, "LAssailant", live(f.args[0]), null);
		} else {
			rt.setFv(f, "LAssailant", live(f.args[0]), live(f.args[1]));
		}
		rt.setSv(f, "cooldown", add(rt.worldTime(f), 40));
	}
	return f.dot;
}, true, { args: ["target", "user"] });

rt.type(5689, "/obj/item/weapon/melee/classic_baton/telescopic", "/obj/item/weapon/melee/classic_baton", {
	on: 0,
	name: "telescopic baton",
	desc: "A compact yet robust personal defense weapon. Can be concealed when folded.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "telebaton_0",
	item_state: null,
	slot_flags: 512,
	w_class: 2,
	needs_permit: 0,
	force: 0,
});

// /obj/item/weapon/melee/classic_baton/telescopic/proc/suicide_act  (code/game/objects/items/weapons/melee/misc.dm:137)  may sleep
rt.def("/obj/item/weapon/melee/classic_baton/telescopic/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let H: Value = null, B: Value = null;
	f.vars = () => [user, H, B];
	H = live(user);
	B = (yield* g.callName(f, live(H), "getorgan", [T("/obj/item/organ/brain")]));
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ stuffs ＀ up ＀ nose and presses the 'extend' button! It looks like ＀ trying to clear their mind.</span>", [live(user), live(f.src), (yield* g.callName(f, live(user), "p_their", [])), (yield* g.callName(f, live(user), "p_theyre", []))])]);
	if (!truthy(rt.sv(f, "on"))) {
		yield* g.callName(f, live(f.src), "attack_self", [live(user)]);
	} else {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/batonextend.ogg"), 50, 1]);
		yield* g.srcCall(f, "add_fingerprint", live(user));
	}
	yield* g.call(f, P("/proc/sleep"), null, [3]);
	if (!(truthy(live(H)) && !(!truthy(live(H)) || truthy(rt.fv(f, "gc_destroyed", live(H)))))) return f.dot;
	if ((truthy(live(B)) && !(!truthy(live(B)) || truthy(rt.fv(f, "gc_destroyed", live(B)))))) {
		(rt.modField(f, live(H), "internal_organs", live(B), subtract));
		yield* g.call(f, P("/proc/qdel"), null, [live(B)]);
	}
	yield* g.new_(f, T("/obj/effect/gibspawner/generic"), [rt.fv(f, "loc", live(H)), rt.fv(f, "viruses", live(H)), rt.fv(f, "dna", live(H))]);
	return 1;
}, true);

// /obj/item/weapon/melee/classic_baton/telescopic/proc/attack_self  (code/game/objects/items/weapons/melee/misc.dm:155)  may sleep
rt.def("/obj/item/weapon/melee/classic_baton/telescopic/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
	if (truthy(rt.sv(f, "on"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class ='warning'>You extend the baton.</span>"]);
		rt.setSv(f, "icon_state", "telebaton_1");
		rt.setSv(f, "item_state", "nullrod");
		rt.setSv(f, "w_class", 4);
		rt.setSv(f, "force", 10);
		rt.setSv(f, "attack_verb", rt.list("smacked", "struck", "cracked", "beaten"));
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class ='notice'>You collapse the baton.</span>"]);
		rt.setSv(f, "icon_state", "telebaton_0");
		rt.setSv(f, "item_state", null);
		rt.setSv(f, "slot_flags", 512);
		rt.setSv(f, "w_class", 2);
		rt.setSv(f, "force", 0);
		rt.setSv(f, "attack_verb", rt.list("hit", "poked"));
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/batonextend.ogg"), 50, 1]);
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return f.dot;
}, true);

rt.type(5690, "/obj/item/weapon/melee/supermatter_sword", "/obj/item/weapon/melee", {
	shard: null,
	balanced: 1,
	name: "supermatter sword",
	desc: "In a station full of bad ideas, this might just be the worst.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "supermatter_sword",
	item_state: "supermatter_sword",
	slot_flags: null,
	w_class: 4,
	force: 0.001,
	armour_penetration: 1000,
	origin_tech: "combat=7;materials=6",
	force_string: "INFINITE",
});

// /obj/item/weapon/melee/supermatter_sword/proc/New  (code/game/objects/items/weapons/melee/misc.dm:191)  may sleep
rt.def("/obj/item/weapon/melee/supermatter_sword/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "shard", (yield* g.new_(f, T("/obj/machinery/power/supermatter_shard"), [live(f.src)])));
	yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "countdown", rt.sv(f, "shard"))]);
	rt.setFv(f, "countdown", rt.sv(f, "shard"), null);
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ appears, balanced ever so perfectly on its hilt. This isn't ominous at all.</span>", [live(f.src)]));
	return f.dot;
}, true);

// /obj/item/weapon/melee/supermatter_sword/proc/process  (code/game/objects/items/weapons/melee/misc.dm:199)  may sleep
rt.def("/obj/item/weapon/melee/supermatter_sword/proc/process", function* process(f: Frame) {
	let target: Value = null, _T: Value = null;
	f.vars = () => [target, _T];
	if ((((truthy(rt.sv(f, "balanced")) || truthy(rt.sv(f, "throwing"))) || truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.fv(f, "loc", live(f.src))])))) || rt.fv(f, "loc", live(f.src)) === null)) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.src))])))) {
		rt.setSv(f, "loc", rt.gv(f, "loc", (target = rt.fv(f, "loc", live(f.src)))));
		yield* g.srcCall(f, "consume_everything", live(target));
	} else {
		if (truthy((rt.istype((_T = rt.getStep(f, live(f.src), 0)), T("/turf/open/space")) ? 1 : 0))) return f.dot;
		yield* g.srcCall(f, "consume_turf", live(_T));
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/melee/supermatter_sword/proc/afterattack  (code/game/objects/items/weapons/melee/misc.dm:211)  may sleep
rt.def("/obj/item/weapon/melee/supermatter_sword/proc/afterattack", function* afterattack(f: Frame) {
	if ((truthy(live(f.args[1])) && isEqual(live(f.args[0]), live(f.args[1])))) {
		yield* g.callName(f, live(f.args[1]), "drop_item", []);
	}
	if (truthy(live(f.args[2]))) {
		yield* g.srcCall(f, "consume_everything", live(f.args[0]));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user", "proximity_flag"] });

// /obj/item/weapon/melee/supermatter_sword/proc/throw_impact  (code/game/objects/items/weapons/melee/misc.dm:218)  may sleep
rt.def("/obj/item/weapon/melee/supermatter_sword/proc/throw_impact", function* throw_impact(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])])))) {
		M = null;
		if (isEqual(rt.fv(f, "loc", live(f.src)), live(M))) {
			yield* g.callName(f, live(M), "drop_item", []);
		}
	}
	yield* g.srcCall(f, "consume_everything", live(f.args[0]));
	return f.dot;
}, true, { args: ["target"], waitfor: false });

// /obj/item/weapon/melee/supermatter_sword/proc/pickup  (code/game/objects/items/weapons/melee/misc.dm:226)
rt.def("/obj/item/weapon/melee/supermatter_sword/proc/pickup", function pickup(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "balanced", 0);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/melee/supermatter_sword/proc/ex_act  (code/game/objects/items/weapons/melee/misc.dm:230)  may sleep
rt.def("/obj/item/weapon/melee/supermatter_sword/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	f.vars = () => [severity, target];
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>The blast wave smacks into ＀ and rapidly flashes to ash.</span>", [live(f.src)]), "<span class='italics'>You hear a loud crack as you are washed with a wave of heat.</span>");
	yield* g.srcCall(f, "consume_everything");
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/melee/supermatter_sword/proc/acid_act  (code/game/objects/items/weapons/melee/misc.dm:235)  may sleep
rt.def("/obj/item/weapon/melee/supermatter_sword/proc/acid_act", function* acid_act(f: Frame) {
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>The acid smacks into ＀ and rapidly flashes to ash.</span>", [live(f.src)]), "<span class='italics'>You hear a loud crack as you are washed with a wave of heat.</span>");
	yield* g.srcCall(f, "consume_everything");
	return f.dot;
}, true);

// /obj/item/weapon/melee/supermatter_sword/proc/bullet_act  (code/game/objects/items/weapons/melee/misc.dm:240)  may sleep
rt.def("/obj/item/weapon/melee/supermatter_sword/proc/bullet_act", function* bullet_act(f: Frame, _P: Value) {
	f.vars = () => [_P];
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ smacks into ＀ and rapidly flashes to ash.</span>", [live(_P), live(f.src)]), "<span class='italics'>You hear a loud crack as you are washed with a wave of heat.</span>");
	yield* g.srcCall(f, "consume_everything");
	return f.dot;
}, true);

// /obj/item/weapon/melee/supermatter_sword/proc/suicide_act  (code/game/objects/items/weapons/melee/misc.dm:245)  may sleep
rt.def("/obj/item/weapon/melee/supermatter_sword/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ touches ＀'s blade. It looks like ＀ tired of waiting for the radiation to kill ＀!</span>", [live(user), live(f.src), (yield* g.callName(f, live(user), "p_theyre", [])), (yield* g.callName(f, live(user), "p_them", []))])]);
	yield* g.callName(f, live(user), "drop_item", []);
	yield* g.callName(f, rt.sv(f, "shard"), "Bumped", [live(user)]);
	return f.dot;
}, true);

// /obj/item/weapon/melee/supermatter_sword/proc/consume_everything  (code/game/objects/items/weapons/melee/misc.dm:250)  may sleep
rt.def("/obj/item/weapon/melee/supermatter_sword/proc/consume_everything", function* consume_everything(f: Frame, target: Value) {
	f.vars = () => [target];
	if (live(target) === null) {
		yield* g.callName(f, rt.sv(f, "shard"), "Consume", []);
	} else {
		if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [live(target)])))) {
			yield* g.callName(f, rt.sv(f, "shard"), "Bumped", [live(target)]);
		} else {
			yield* g.srcCall(f, "consume_turf", live(target));
		}
	}
	return f.dot;
}, true);

// /obj/item/weapon/melee/supermatter_sword/proc/consume_turf  (code/game/objects/items/weapons/melee/misc.dm:258)  may sleep
rt.def("/obj/item/weapon/melee/supermatter_sword/proc/consume_turf", function* consume_turf(f: Frame, _T: Value) {
	f.vars = () => [_T];
	if (truthy(rt.op(f, "IsType", [], [live(_T), rt.fv(f, "baseturf", live(_T))]))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/effects/supermatter.ogg"), 50, 1]);
	yield* g.callName(f, live(_T), "visible_message", [fmt("<span class='danger'>＀ smacks into ＀ and rapidly flashes to ash.</span>", [live(_T), live(f.src)]), "<span class='italics'>You hear a loud crack as you are washed with a wave of heat.</span>"]);
	yield* g.callName(f, rt.sv(f, "shard"), "Consume", []);
	yield* g.callName(f, live(_T), "ChangeTurf", [rt.fv(f, "baseturf", live(_T))]);
	yield* g.callName(f, live(_T), "CalculateAdjacentTurfs", []);
	return f.dot;
}, true);

rt.type(5691, "/obj/item/weapon/melee/curator_whip", "/obj/item/weapon/melee", {
	name: "curator's whip",
	desc: "Somewhat eccentric and outdated, it still stings like hell to be hit by.",
	icon_state: "whip",
	item_state: "chain",
	slot_flags: 512,
	force: 15,
	w_class: 3,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/chainhit.ogg"),
});

// /obj/item/weapon/melee/curator_whip/proc/afterattack  (code/game/objects/items/weapons/melee/misc.dm:282)  may sleep
rt.def("/obj/item/weapon/melee/curator_whip/proc/afterattack", function* afterattack(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if ((truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy(live(f.args[2])))) {
		yield* g.callName(f, (H = live(f.args[0])), "drop_all_held_items", []);
		yield* g.callName(f, live(H), "visible_message", [fmt("<span class='danger'>＀ disarms ＀!</span>", [live(f.args[1]), live(H)]), fmt("<span class='userdanger'>＀ disarmed you!</span>", [live(f.args[1])])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user", "proximity_flag"] });
