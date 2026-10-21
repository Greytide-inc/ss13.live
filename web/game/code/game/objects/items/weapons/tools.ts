// From code/game/objects/items/weapons/tools.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7347, "/obj/item/weapon/wrench", "/obj/item/weapon", {
	flags: 64,
	name: "wrench",
	desc: "A wrench with common uses. Can be found in your hand.",
	icon: rt.rsc("icons/obj/tools.dmi"),
	icon_state: "wrench",
	slot_flags: 512,
	force: 5,
	throwforce: 7,
	w_class: 2,
	usesound: rt.rsc("sound/items/ratchet.ogg"),
	materials: null,
	origin_tech: "materials=1;engineering=1",
	attack_verb: null,
	toolspeed: 1,
	armor: null,
});

// /obj/item/weapon/wrench/proc/<init>  (code/game/objects/items/weapons/tools.dm:28)
rt.def("/obj/item/weapon/wrench/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 150]));
	rt.setSv(f, "attack_verb", rt.list("bashed", "battered", "bludgeoned", "whacked"));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 30]));
	return f.dot;
});

// /obj/item/weapon/wrench/proc/suicide_act  (code/game/objects/items/weapons/tools.dm:35)
rt.def("/obj/item/weapon/wrench/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is beating ＀self to death with ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.callName(f, live(user), "p_them", []), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/genhit.ogg"), 50, 1, -1]);
	return 1;
});

rt.type(7351, "/obj/item/weapon/wrench/power", "/obj/item/weapon/wrench", {
	name: "hand drill",
	desc: "A simple powered hand drill. It's fitted with a bolt bit.",
	icon_state: "drill_bolt",
	item_state: "drill",
	usesound: rt.rsc("sound/items/drill_use.ogg"),
	materials: null,
	origin_tech: "materials=2;engineering=2",
	force: 8,
	w_class: 2,
	throwforce: 8,
	attack_verb: null,
	toolspeed: 0.25,
});

// /obj/item/weapon/wrench/power/proc/<init>  (code/game/objects/items/weapons/tools.dm:66)
rt.def("/obj/item/weapon/wrench/power/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 150, "$silver", 50, "$titanium", 25]));
	rt.setSv(f, "attack_verb", rt.list("drilled", "screwed", "jabbed"));
	return f.dot;
});

// /obj/item/weapon/wrench/power/proc/attack_self  (code/game/objects/items/weapons/tools.dm:75)  may sleep
rt.def("/obj/item/weapon/wrench/power/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let s_drill: Value = null;
	f.vars = () => [user, s_drill];
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.rsc("sound/items/change_drill.ogg"), 50, 1]);
	s_drill = (yield* g.new_(f, T("/obj/item/weapon/screwdriver/power"), []));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You attach the screw driver bit to ＀.</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	yield* g.callName(f, live(user), "put_in_active_hand", [live(s_drill)]);
	return f.dot;
}, true);

// /obj/item/weapon/wrench/power/proc/suicide_act  (code/game/objects/items/weapons/tools.dm:82)
rt.def("/obj/item/weapon/wrench/power/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is pressing ＀ against ＀ head! It looks like ＀ trying to commit suicide!", [live(user), live(f.src), rt.callName(f, live(user), "p_their", []), rt.callName(f, live(user), "p_theyre", [])])]);
	return 1;
});

rt.type(7352, "/obj/item/weapon/wrench/medical", "/obj/item/weapon/wrench", {
	name: "medical wrench",
	desc: "A medical wrench with common(medical?) uses. Can be found in your hand.",
	icon_state: "wrench_medical",
	force: 2,
	throwforce: 4,
	origin_tech: "materials=1;engineering=1;biotech=3",
	attack_verb: null,
});

// /obj/item/weapon/wrench/medical/proc/suicide_act  (code/game/objects/items/weapons/tools.dm:95)  may sleep
rt.def("/obj/item/weapon/wrench/medical/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let W: Value = null;
	let $e: any;
	f.vars = () => [user, W, $e];
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is praying to the medical wrench to take ＀ soul. It looks like ＀ trying to commit suicide!</span>", [live(user), (yield* g.callName(f, live(user), "p_their", [])), (yield* g.callName(f, live(user), "p_theyre", []))])]);
	yield* g.callName(f, live(user), "Stun", [null, 100, "ignore_canstun", 1], rt.Args.Named);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/pray.ogg"), 50, 1, -1]);
	yield* g.call(f, P("/proc/sleep"), null, [20]);
	if (!truthy(live(user))) {
		return live(f.dot);
	}
	W = null;
	rt.forList(f, 0, live(user), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		yield* g.callName(f, live(user), "dropItemToGround", [live(W)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, (W = (yield* g.new_(f, T("/obj/item/weapon/wrench/medical"), [rt.sv(f, "loc")]))), "add_fingerprint", [live(user)]);
	rt.modField(f, live(W), "desc", fmt(" For some reason, it reminds you of ＀.", [rt.fv(f, "name", live(user))]), add);
	if (!truthy(live(user))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "dust", []);
	return 8;
}, true);

rt.type(7004, "/obj/item/weapon/screwdriver", "/obj/item/weapon", {
	flags: 64,
	throw_speed: 3,
	throw_range: 5,
	name: "screwdriver",
	desc: "You can be totally screwy with this.",
	icon: rt.rsc("icons/obj/tools.dmi"),
	icon_state: null,
	slot_flags: 512,
	force: 5,
	w_class: 1,
	throwforce: 5,
	materials: null,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	usesound: rt.rsc("sound/items/screwdriver.ogg"),
	toolspeed: 1,
	armor: null,
});

// /obj/item/weapon/screwdriver/proc/<init>  (code/game/objects/items/weapons/tools.dm:138)
rt.def("/obj/item/weapon/screwdriver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 75]));
	$0 = $0;
	rt.setSv(f, "attack_verb", rt.list("stabbed"));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 30]));
	return f.dot;
});

// /obj/item/weapon/screwdriver/proc/suicide_act  (code/game/objects/items/weapons/tools.dm:146)
rt.def("/obj/item/weapon/screwdriver/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is stabbing ＀ into ＀ ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), live(f.src), rt.callName(f, live(user), "p_their", []), rt.op(f, "PickUnweighted", [2], ["temple", "heart"]), rt.callName(f, live(user), "p_theyre", [])])]);
	return 1;
});

// /obj/item/weapon/screwdriver/proc/New  (code/game/objects/items/weapons/tools.dm:150)  may sleep
rt.def("/obj/item/weapon/screwdriver/proc/New", function* New(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = null;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "icon_state"))) {
		if (!truthy(live(f.args[1]))) {
			f.args[1] = rt.op(f, "PickUnweighted", [7], ["red", "blue", "pink", "brown", "green", "cyan", "yellow"]);
		}
		rt.setSv(f, "icon_state", fmt("screwdriver_＀", [live(f.args[1])]));
	}
	if (truthy(rt.op(f, "Prob", [], [75]))) {
		rt.setFv(f, "pixel_y", live(f.src), (yield* g.call(f, P("/proc/rand"), null, [0, 16])));
	}
	return live(f.dot);
}, true, { args: ["loc", "param_color"] });

// /obj/item/weapon/screwdriver/proc/attack  (code/game/objects/items/weapons/tools.dm:161)  may sleep
rt.def("/obj/item/weapon/screwdriver/proc/attack", function* attack(f: Frame) {
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if ((!isEqual(rt.fv(f, "zone_selected", live(f.args[1])), "eyes") && !isEqual(rt.fv(f, "zone_selected", live(f.args[1])), "head"))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if ((truthy(rt.bitAnd(rt.fv(f, "disabilities", live(f.args[1])), 256)) && truthy(rt.op(f, "Prob", [], [50])))) {
		f.args[0] = live(f.args[1]);
	}
	return (yield* g.srcCall(f, "eyestab", live(f.args[0]), live(f.args[1])));
}, true, { args: ["M", "user"] });

rt.type(7008, "/obj/item/weapon/screwdriver/power", "/obj/item/weapon/screwdriver", {
	throw_speed: 2,
	throw_range: 3,
	name: "hand drill",
	desc: "A simple powered hand drill. It's fitted with a screw bit.",
	icon_state: "drill_screw",
	item_state: "drill",
	materials: null,
	origin_tech: "materials=2;engineering=2",
	force: 8,
	w_class: 2,
	throwforce: 8,
	attack_verb: null,
	hitsound: rt.rsc("sound/items/drill_hit.ogg"),
	usesound: rt.rsc("sound/items/drill_use.ogg"),
	toolspeed: 0.25,
});

// /obj/item/weapon/screwdriver/power/proc/<init>  (code/game/objects/items/weapons/tools.dm:189)
rt.def("/obj/item/weapon/screwdriver/power/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 150, "$silver", 50, "$titanium", 25]));
	rt.setSv(f, "attack_verb", rt.list("drilled", "screwed", "jabbed", "whacked"));
	return f.dot;
});

// /obj/item/weapon/screwdriver/power/proc/suicide_act  (code/game/objects/items/weapons/tools.dm:202)
rt.def("/obj/item/weapon/screwdriver/power/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is putting ＀ to ＀ temple. It looks like ＀ trying to commit suicide!</span>", [live(user), live(f.src), rt.callName(f, live(user), "p_their", []), rt.callName(f, live(user), "p_theyre", [])])]);
	return 1;
});

// /obj/item/weapon/screwdriver/power/proc/attack_self  (code/game/objects/items/weapons/tools.dm:206)  may sleep
rt.def("/obj/item/weapon/screwdriver/power/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let b_drill: Value = null;
	f.vars = () => [user, b_drill];
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.rsc("sound/items/change_drill.ogg"), 50, 1]);
	b_drill = (yield* g.new_(f, T("/obj/item/weapon/wrench/power"), []));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You attach the bolt driver bit to ＀.</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	yield* g.callName(f, live(user), "put_in_active_hand", [live(b_drill)]);
	return f.dot;
}, true);

rt.type(7353, "/obj/item/weapon/wirecutters", "/obj/item/weapon", {
	flags: 64,
	throw_speed: 3,
	throw_range: 7,
	name: "wirecutters",
	desc: "This cuts wires.",
	icon: rt.rsc("icons/obj/tools.dmi"),
	icon_state: null,
	slot_flags: 512,
	force: 6,
	w_class: 2,
	materials: null,
	attack_verb: null,
	hitsound: rt.rsc("sound/items/wirecutter.ogg"),
	usesound: rt.rsc("sound/items/wirecutter.ogg"),
	origin_tech: "materials=1;engineering=1",
	toolspeed: 1,
	armor: null,
});

// /obj/item/weapon/wirecutters/proc/<init>  (code/game/objects/items/weapons/tools.dm:232)
rt.def("/obj/item/weapon/wirecutters/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 80]));
	rt.setSv(f, "attack_verb", rt.list("pinched", "nipped"));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 30]));
	return f.dot;
});

// /obj/item/weapon/wirecutters/proc/New  (code/game/objects/items/weapons/tools.dm:242)  may sleep
rt.def("/obj/item/weapon/wirecutters/proc/New", function* New(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = null;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "icon_state"))) return f.dot;
	if (!truthy(live(f.args[1]))) {
		f.args[1] = rt.op(f, "PickUnweighted", [2], ["yellow", "red"]);
	}
	rt.setSv(f, "icon_state", fmt("cutters_＀", [live(f.args[1])]));
	return f.dot;
}, true, { args: ["loc", "param_color"] });

// /obj/item/weapon/wirecutters/proc/attack  (code/game/objects/items/weapons/tools.dm:249)  may sleep
rt.def("/obj/item/weapon/wirecutters/proc/attack", function* attack(f: Frame) {
	if (((truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0)) && truthy(rt.fv(f, "handcuffed", live(f.args[0])))) && truthy((rt.istype(rt.fv(f, "handcuffed", live(f.args[0])), T("/obj/item/weapon/restraints/handcuffs/cable")) ? 1 : 0)))) {
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ cuts ＀'s restraints with ＀!</span>", [live(f.args[1]), live(f.args[0]), live(f.src)])]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "handcuffed", live(f.args[0]))]);
		rt.setFv(f, "handcuffed", live(f.args[0]), null);
		if ((truthy(rt.fv(f, "buckled", live(f.args[0]))) && truthy(rt.gv(f, "buckle_requires_restraints", rt.fv(f, "buckled", live(f.args[0])))))) {
			yield* g.callName(f, rt.fv(f, "buckled", live(f.args[0])), "unbuckle_mob", [live(f.args[0])]);
		}
		yield* g.callName(f, live(f.args[0]), "update_handcuffed", []);
		return live(f.dot);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["C", "user"] });

// /obj/item/weapon/wirecutters/proc/suicide_act  (code/game/objects/items/weapons/tools.dm:261)
rt.def("/obj/item/weapon/wirecutters/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is cutting at ＀ arteries with ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.callName(f, live(user), "p_their", []), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "usesound"), 50, 1, -1]);
	return 1;
});

rt.type(7357, "/obj/item/weapon/wirecutters/power", "/obj/item/weapon/wirecutters", {
	name: "jaws of life",
	desc: "A set of jaws of life, compressed through the magic of science. It's fitted with a cutting head.",
	icon_state: "jaws_cutter",
	item_state: "jawsoflife",
	origin_tech: "materials=2;engineering=2",
	materials: null,
	usesound: rt.rsc("sound/items/jaws_cut.ogg"),
	toolspeed: 0.25,
});

// /obj/item/weapon/wirecutters/power/proc/<init>  (code/game/objects/items/weapons/tools.dm:291)
rt.def("/obj/item/weapon/wirecutters/power/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 150, "$silver", 50, "$titanium", 25]));
	return f.dot;
});

// /obj/item/weapon/wirecutters/power/proc/suicide_act  (code/game/objects/items/weapons/tools.dm:296)  may sleep
rt.def("/obj/item/weapon/wirecutters/power/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let C: Value = null, BP: Value = null;
	f.vars = () => [user, C, BP];
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is wrapping ％！ around ＀ neck. It looks like ＀ trying to rip ＀ head off!</span>", [live(user), live(f.src), (yield* g.callName(f, live(user), "p_their", [])), (yield* g.callName(f, live(user), "p_theyre", [])), (yield* g.callName(f, live(user), "p_their", []))])]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/jaws_cut.ogg"), 50, 1, -1]);
	if (truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) {
		C = live(user);
		if (truthy((BP = (yield* g.callName(f, live(C), "get_bodypart", ["head"]))))) {
			yield* g.callName(f, live(BP), "drop_limb", []);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.op(f, "PickUnweighted", [3], [rt.rsc("sound/misc/desceration-01.ogg"), rt.rsc("sound/misc/desceration-02.ogg"), rt.rsc("sound/misc/desceration-01.ogg")]), 50, 1, -1]);
		}
	}
	return 1;
}, true);

// /obj/item/weapon/wirecutters/power/proc/attack_self  (code/game/objects/items/weapons/tools.dm:307)  may sleep
rt.def("/obj/item/weapon/wirecutters/power/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let pryjaws: Value = null;
	f.vars = () => [user, pryjaws];
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.rsc("sound/items/change_jaws.ogg"), 50, 1]);
	pryjaws = (yield* g.new_(f, T("/obj/item/weapon/crowbar/power"), []));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You attach the pry jaws to ＀.</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	yield* g.callName(f, live(user), "put_in_active_hand", [live(pryjaws)]);
	return f.dot;
}, true);

rt.type(7358, "/obj/item/weapon/weldingtool", "/obj/item/weapon", {
	acti_sound: rt.rsc("sound/items/welderactivate.ogg"),
	deac_sound: rt.rsc("sound/items/welderdeactivate.ogg"),
	welding: 0,
	status: 1,
	max_fuel: 20,
	change_icons: 1,
	can_off_process: 0,
	light_intensity: 2,
	burned_fuel_for: 0,
	flags: 64,
	throw_speed: 3,
	throw_range: 5,
	name: "welding tool",
	desc: "A standard edition welder provided by NanoTrasen.",
	icon: rt.rsc("icons/obj/tools.dmi"),
	icon_state: "welder",
	item_state: "welder",
	slot_flags: 512,
	force: 3,
	throwforce: 5,
	hitsound: "swing_hit",
	usesound: rt.rsc("sound/items/welder.ogg"),
	w_class: 2,
	armor: null,
	resistance_flags: 2,
	materials: null,
	origin_tech: "engineering=1;plasmatech=1",
	heat: 3800,
	toolspeed: 1,
});

// /obj/item/weapon/weldingtool/proc/<init>  (code/game/objects/items/weapons/tools.dm:332)
rt.def("/obj/item/weapon/weldingtool/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 30]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 70, "$glass", 30]));
	return f.dot;
});

// /obj/item/weapon/weldingtool/proc/New  (code/game/objects/items/weapons/tools.dm:348)  may sleep
rt.def("/obj/item/weapon/weldingtool/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "create_reagents", rt.sv(f, "max_fuel"));
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["welding_fuel", rt.sv(f, "max_fuel")]);
	yield* g.srcCall(f, "update_icon");
	return live(f.dot);
}, true);

// /obj/item/weapon/weldingtool/proc/update_torch  (code/game/objects/items/weapons/tools.dm:356)
rt.def("/obj/item/weapon/weldingtool/proc/update_torch", function update_torch(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "welding"))) {
		rt.callSrc(f, "add_overlay", [fmt("＀-on", [rt.initial(f, live(f.src), "icon_state")])]);
		rt.setSv(f, "item_state", fmt("＀1", [rt.initial(f, live(f.src), "item_state")]));
	} else {
		rt.setSv(f, "item_state", fmt("＀", [rt.initial(f, live(f.src), "item_state")]));
	}
	return f.dot;
});

// /obj/item/weapon/weldingtool/proc/update_icon  (code/game/objects/items/weapons/tools.dm:366)
rt.def("/obj/item/weapon/weldingtool/proc/update_icon", function update_icon(f: Frame) {
	let ratio: Value = null;
	f.vars = () => [ratio];
	if (truthy(rt.sv(f, "change_icons"))) {
		if (isEqual((ratio = multiply(rt.call(f, P("/proc/Ceiling"), null, [multiply((ratio = divide(rt.callSrc(f, "get_fuel", []), rt.sv(f, "max_fuel"))), 4)]), 25)), 100)) {
			rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
		} else {
			rt.setSv(f, "icon_state", fmt("＀＀", [rt.initial(f, live(f.src), "icon_state"), live(ratio)]));
		}
	}
	rt.callSrc(f, "update_torch", []);
	return live(f.dot);
});

// /obj/item/weapon/weldingtool/proc/process  (code/game/objects/items/weapons/tools.dm:377)  may sleep
rt.def("/obj/item/weapon/weldingtool/proc/process", function* process(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "welding");
	if ($0 === 0) {
		rt.setSv(f, "force", 3);
		rt.setSv(f, "damtype", "brute");
		yield* g.srcCall(f, "update_icon");
		if (!truthy(rt.sv(f, "can_off_process"))) {
			rt.setFv(f, "isprocessing", live(f.src), 0);
			(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		}
		return live(f.dot);
	} else if ($0 === 1) {
		rt.setSv(f, "force", 15);
		rt.setSv(f, "damtype", "fire");
		rt.incSrcVar(f, "burned_fuel_for", 1, false);
		if (rt.ge(rt.sv(f, "burned_fuel_for"), 13)) {
			yield* g.srcCall(f, "remove_fuel", 1);
		}
		yield* g.srcCall(f, "update_icon");
	}
	yield* g.srcCall(f, "open_flame");
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/weldingtool/proc/suicide_act  (code/game/objects/items/weapons/tools.dm:399)
rt.def("/obj/item/weapon/weldingtool/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ welds ＀ every orifice closed! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.callName(f, live(user), "p_their", []), rt.callName(f, live(user), "p_theyre", [])])]);
	return 2;
});

// /obj/item/weapon/weldingtool/proc/attackby  (code/game/objects/items/weapons/tools.dm:404)  may sleep
rt.def("/obj/item/weapon/weldingtool/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		yield* g.srcCall(f, "flamethrower_screwdriver", live(f.args[0]), live(f.args[1]));
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/rods")) ? 1 : 0))) {
			yield* g.srcCall(f, "flamethrower_rods", live(f.args[0]), live(f.args[1]));
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/weapon/weldingtool/proc/attack  (code/game/objects/items/weapons/tools.dm:413)  may sleep
rt.def("/obj/item/weapon/weldingtool/proc/attack", function* attack(f: Frame) {
	let affecting: Value = null;
	f.vars = () => [affecting];
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (((truthy((affecting = (yield* g.callName(f, live(f.args[0]), "get_bodypart", [(yield* g.call(f, P("/proc/check_zone"), null, [rt.fv(f, "zone_selected", live(f.args[1]))]))])))) && isEqual(rt.fv(f, "status", live(affecting)), 2)) && !isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm"))) {
		if (truthy((yield* g.callName(f, live(f.src), "remove_fuel", [1])))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "usesound"), 50, 1]);
			if (isEqual(live(f.args[1]), live(f.args[0]))) {
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ starts to fix some of the dents on ＀'s ＀.</span>", [live(f.args[1]), live(f.args[0]), rt.fv(f, "name", live(affecting))]), fmt("<span class='notice'>You start fixing some of the dents on ＀'s ＀.</span>", [live(f.args[0]), rt.fv(f, "name", live(affecting))])]);
				if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(f.args[1]), live(f.args[0]), 50])))) {
					return live(f.dot);
				}
			}
			yield* g.call(f, P("/proc/item_heal_robotic"), null, [live(f.args[0]), live(f.args[1]), 15, 0]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["H", "user"] });

// /obj/item/weapon/weldingtool/proc/afterattack  (code/game/objects/items/weapons/tools.dm:431)  may sleep
rt.def("/obj/item/weapon/weldingtool/proc/afterattack", function* afterattack(f: Frame, O: Value, user: Value, proximity: Value) {
	let location: Value = null, L: Value = null;
	f.vars = () => [O, user, proximity, location, L];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "welding"))) return f.dot;
	yield* g.srcCall(f, "remove_fuel", 1);
	yield* g.callName(f, (location = rt.getStep(f, live(user), 0)), "hotspot_expose", [700, 50, 1]);
	if (rt.le((yield* g.srcCall(f, "get_fuel")), 0)) {
		yield* g.srcCall(f, "set_light", 0);
	}
	if (!truthy((rt.istype(live(O), T("/mob/living")) ? 1 : 0))) return f.dot;
	if (!truthy((yield* g.callName(f, (L = live(O)), "IgniteMob", [])))) return f.dot;
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ set ＀ on fire", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(L)]))])]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ set ＀ on fire", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), (yield* g.call(f, P("/proc/key_name"), null, [live(L)]))])]);
	return f.dot;
}, true);

// /obj/item/weapon/weldingtool/proc/attack_self  (code/game/objects/items/weapons/tools.dm:448)  may sleep
rt.def("/obj/item/weapon/weldingtool/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "switched_on", live(user));
	if (truthy(rt.sv(f, "welding"))) {
		yield* g.srcCall(f, "set_light", rt.sv(f, "light_intensity"));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/weldingtool/proc/get_fuel  (code/game/objects/items/weapons/tools.dm:457)
rt.def("/obj/item/weapon/weldingtool/proc/get_fuel", function get_fuel(f: Frame) {
	return rt.callName(f, rt.sv(f, "reagents"), "get_reagent_amount", ["welding_fuel"]);
});

// /obj/item/weapon/weldingtool/proc/remove_fuel  (code/game/objects/items/weapons/tools.dm:462)  may sleep
rt.def("/obj/item/weapon/weldingtool/proc/remove_fuel", function* remove_fuel(f: Frame, amount: Value, M: Value) {
	f.vars = () => [amount, M];
	if (live(amount) === null) {
		amount = 1;
	}
	if (live(M) === null) {
		M = null;
	}
	if ((!truthy(rt.sv(f, "welding")) || !truthy((yield* g.srcCall(f, "check_fuel"))))) {
		return 0;
	}
	if (truthy(live(amount))) {
		rt.setSv(f, "burned_fuel_for", 0);
	}
	if (rt.ge((yield* g.srcCall(f, "get_fuel")), live(amount))) {
		yield* g.callName(f, rt.sv(f, "reagents"), "remove_reagent", ["welding_fuel", live(amount)]);
		yield* g.srcCall(f, "check_fuel");
		if (truthy(live(M))) {
			yield* g.callName(f, live(M), "flash_act", [rt.sv(f, "light_intensity")]);
		}
		return 1;
	} else {
		if (truthy(live(M))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>You need more welding fuel to complete this task!</span>"]);
		}
		return 0;
	}
	return f.dot;
}, true);

// /obj/item/weapon/weldingtool/proc/check_fuel  (code/game/objects/items/weapons/tools.dm:480)  may sleep
rt.def("/obj/item/weapon/weldingtool/proc/check_fuel", function* check_fuel(f: Frame, user: Value) {
	let M: Value = null;
	f.vars = () => [user, M];
	if ((rt.le((yield* g.srcCall(f, "get_fuel")), 0) && truthy(rt.sv(f, "welding")))) {
		yield* g.srcCall(f, "switched_on", live(user));
		yield* g.srcCall(f, "update_icon");
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) {
			yield* g.callName(f, (M = rt.sv(f, "loc")), "update_inv_hands", [0]);
		}
		return 0;
	}
	return 1;
}, true);

// /obj/item/weapon/weldingtool/proc/switched_on  (code/game/objects/items/weapons/tools.dm:493)  may sleep
rt.def("/obj/item/weapon/weldingtool/proc/switched_on", function* switched_on(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "status"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ can't be turned on while unsecured!</span>", [live(f.src)])]);
		yield* g.srcCall(f, "balloon_alert", live(user), "unsecured!");
		return live(f.dot);
	}
	rt.setSv(f, "welding", (!truthy(rt.sv(f, "welding")) ? 1 : 0));
	if (truthy(rt.sv(f, "welding"))) {
		if (rt.ge((yield* g.srcCall(f, "get_fuel")), 1)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You switch ＀ on.</span>", [live(f.src)])]);
			yield* g.srcCall(f, "balloon_alert", live(user), "welder on");
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "acti_sound"), 50, 1]);
			rt.setSv(f, "force", 15);
			rt.setSv(f, "damtype", "fire");
			rt.setSv(f, "hitsound", rt.rsc("sound/items/welder.ogg"));
			yield* g.srcCall(f, "update_icon");
			if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
				rt.setFv(f, "isprocessing", live(f.src), 1);
				rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need more fuel!</span>"]);
			yield* g.srcCall(f, "balloon_alert", live(user), "no fuel!");
			yield* g.srcCall(f, "switched_off", live(user));
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You switch ＀ off.</span>", [live(f.src)])]);
		yield* g.srcCall(f, "balloon_alert", live(user), "welder off");
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "deac_sound"), 50, 1]);
		yield* g.srcCall(f, "switched_off", live(user));
	}
	return f.dot;
}, true);

// /obj/item/weapon/weldingtool/proc/switched_off  (code/game/objects/items/weapons/tools.dm:521)
rt.def("/obj/item/weapon/weldingtool/proc/switched_off", function switched_off(f: Frame, user: Value) {
	rt.setSv(f, "welding", 0);
	rt.callSrc(f, "set_light", [0]);
	rt.setSv(f, "force", 3);
	rt.setSv(f, "damtype", "brute");
	rt.setSv(f, "hitsound", "swing_hit");
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/item/weapon/weldingtool/proc/examine  (code/game/objects/items/weapons/tools.dm:530)
rt.def("/obj/item/weapon/weldingtool/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("It contains ＀ unit５ of fuel out of ＀.", [rt.callSrc(f, "get_fuel", []), rt.sv(f, "max_fuel")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/weldingtool/proc/is_hot  (code/game/objects/items/weapons/tools.dm:534)
rt.def("/obj/item/weapon/weldingtool/proc/is_hot", function is_hot(f: Frame) {
	return multiply(rt.sv(f, "welding"), rt.sv(f, "heat"));
});

// /obj/item/weapon/weldingtool/proc/flamethrower_screwdriver  (code/game/objects/items/weapons/tools.dm:543)  may sleep
rt.def("/obj/item/weapon/weldingtool/proc/flamethrower_screwdriver", function* flamethrower_screwdriver(f: Frame, I: Value, user: Value) {
	f.vars = () => [I, user];
	if (truthy(rt.sv(f, "welding"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Turn it off first!</span>"]);
		return live(f.dot);
	}
	rt.setSv(f, "status", (!truthy(rt.sv(f, "status")) ? 1 : 0));
	if (truthy(rt.sv(f, "status"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You resecure ＀.</span>", [live(f.src)])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ can now be attached and modified.</span>", [live(f.src)])]);
	}
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return f.dot;
}, true);

// /obj/item/weapon/weldingtool/proc/flamethrower_rods  (code/game/objects/items/weapons/tools.dm:553)  may sleep
rt.def("/obj/item/weapon/weldingtool/proc/flamethrower_rods", function* flamethrower_rods(f: Frame, I: Value, user: Value) {
	let R: Value = null, F: Value = null;
	f.vars = () => [I, user, R, F];
	if (truthy(rt.sv(f, "status"))) return f.dot;
	if (truthy((yield* g.callName(f, (R = live(I)), "use", [1])))) {
		if (!truthy((yield* g.srcCall(f, "remove_item_from_storage", (F = (yield* g.new_(f, T("/obj/item/weapon/flamethrower"), [rt.fv(f, "loc", live(user))]))))))) {
			yield* g.callName(f, live(user), "transferItemToLoc", [live(f.src), live(F), 1]);
		}
		rt.setFv(f, "weldtool", live(F), live(f.src));
		yield* g.srcCall(f, "add_fingerprint", live(user));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You add a rod to a welder, starting to build a flamethrower.</span>"]);
		yield* g.callName(f, live(user), "put_in_hands", [live(F)]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need one rod to start building a flamethrower!</span>"]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/weldingtool/proc/ignition_effect  (code/game/objects/items/weapons/tools.dm:567)  may sleep
rt.def("/obj/item/weapon/weldingtool/proc/ignition_effect", function* ignition_effect(f: Frame, A: Value, user: Value) {
	f.vars = () => [A, user];
	if ((truthy(rt.sv(f, "welding")) && truthy((yield* g.srcCall(f, "remove_fuel", 1, live(user)))))) {
		f.dot = fmt("<span class='notice'>＀ casually lights ＀ with ＀, what a badass.</span>", [live(user), live(A), live(f.src)]);
	} else {
		f.dot = "";
	}
	return f.dot;
}, true);

rt.type(7359, "/obj/item/weapon/weldingtool/largetank", "/obj/item/weapon/weldingtool", {
	max_fuel: 40,
	name: "industrial welding tool",
	desc: "A slightly larger welder with a larger tank.",
	icon_state: "indwelder",
	materials: null,
	origin_tech: "engineering=2;plasmatech=2",
});

// /obj/item/weapon/weldingtool/largetank/proc/<init>  (code/game/objects/items/weapons/tools.dm:577)
rt.def("/obj/item/weapon/weldingtool/largetank/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 60]));
	return f.dot;
});

rt.type(7361, "/obj/item/weapon/weldingtool/mini", "/obj/item/weapon/weldingtool", {
	max_fuel: 10,
	change_icons: 0,
	name: "emergency welding tool",
	desc: "A miniature welder used during emergencies.",
	icon_state: "miniwelder",
	w_class: 1,
	materials: null,
});

// /obj/item/weapon/weldingtool/mini/proc/<init>  (code/game/objects/items/weapons/tools.dm:595)
rt.def("/obj/item/weapon/weldingtool/mini/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30, "$glass", 10]));
	return f.dot;
});

rt.type(7362, "/obj/item/weapon/weldingtool/abductor", "/obj/item/weapon/weldingtool", {
	light_intensity: 0,
	change_icons: 0,
	name: "alien welding tool",
	desc: "An alien welding tool. Whatever fuel it uses, it never runs out.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "welder",
	toolspeed: 0.1,
	origin_tech: "plasmatech=5;engineering=5;abductor=3",
});

// /obj/item/weapon/weldingtool/abductor/proc/process  (code/game/objects/items/weapons/tools.dm:612)  may sleep
rt.def("/obj/item/weapon/weldingtool/abductor/proc/process", function* process(f: Frame) {
	if (rt.le((yield* g.srcCall(f, "get_fuel")), rt.sv(f, "max_fuel"))) {
		yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["welding_fuel", 1]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { waitfor: false });

rt.type(7363, "/obj/item/weapon/weldingtool/hugetank", "/obj/item/weapon/weldingtool", {
	max_fuel: 80,
	name: "upgraded industrial welding tool",
	desc: "An upgraded welder based of the industrial welder.",
	icon_state: "upindwelder",
	item_state: "upindwelder",
	materials: null,
	origin_tech: "engineering=3;plasmatech=2",
});

// /obj/item/weapon/weldingtool/hugetank/proc/<init>  (code/game/objects/items/weapons/tools.dm:622)
rt.def("/obj/item/weapon/weldingtool/hugetank/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 70, "$glass", 120]));
	return f.dot;
});

rt.type(7364, "/obj/item/weapon/weldingtool/experimental", "/obj/item/weapon/weldingtool", {
	last_gen: 0,
	nextrefueltick: 0,
	max_fuel: 40,
	change_icons: 0,
	can_off_process: 1,
	light_intensity: 1,
	name: "experimental welding tool",
	desc: "An experimental welder capable of self-fuel generation and less harmful to the eyes.",
	icon_state: "exwelder",
	item_state: "exwelder",
	materials: null,
	origin_tech: "materials=4;engineering=4;bluespace=3;plasmatech=4",
	toolspeed: 0.5,
});

// /obj/item/weapon/weldingtool/experimental/proc/<init>  (code/game/objects/items/weapons/tools.dm:631)
rt.def("/obj/item/weapon/weldingtool/experimental/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 70, "$glass", 120]));
	return f.dot;
});

// /obj/item/weapon/weldingtool/experimental/proc/process  (code/game/objects/items/weapons/tools.dm:649)  may sleep
rt.def("/obj/item/weapon/weldingtool/experimental/proc/process", function* process(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(rt.lt((yield* g.srcCall(f, "get_fuel")), rt.sv(f, "max_fuel")) && rt.lt(rt.sv(f, "nextrefueltick"), rt.worldTime(f)))) return f.dot;
	rt.setSv(f, "nextrefueltick", add(rt.worldTime(f), 10));
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["welding_fuel", 1]);
	return f.dot;
}, true, { waitfor: false });

rt.type(7366, "/obj/item/weapon/crowbar", "/obj/item/weapon", {
	flags: 64,
	name: "pocket crowbar",
	desc: "A small crowbar. This handy tool is useful for lots of things, such as prying floor tiles or opening unpowered doors.",
	icon: rt.rsc("icons/obj/tools.dmi"),
	icon_state: "crowbar",
	usesound: rt.rsc("sound/items/crowbar.ogg"),
	slot_flags: 512,
	force: 5,
	throwforce: 7,
	w_class: 2,
	materials: null,
	origin_tech: "engineering=1;combat=1",
	attack_verb: null,
	toolspeed: 1,
	armor: null,
});

// /obj/item/weapon/crowbar/proc/<init>  (code/game/objects/items/weapons/tools.dm:670)
rt.def("/obj/item/weapon/crowbar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50]));
	rt.setSv(f, "attack_verb", rt.list("attacked", "bashed", "battered", "bludgeoned", "whacked"));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 30]));
	return f.dot;
});

// /obj/item/weapon/crowbar/proc/suicide_act  (code/game/objects/items/weapons/tools.dm:677)
rt.def("/obj/item/weapon/crowbar/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is beating ＀self to death with ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.callName(f, live(user), "p_them", []), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/genhit.ogg"), 50, 1, -1]);
	return 1;
});

rt.type(7370, "/obj/item/weapon/crowbar/large", "/obj/item/weapon/crowbar", {
	throw_speed: 3,
	throw_range: 3,
	name: "crowbar",
	desc: "It's a big crowbar. It doesn't fit in your pockets, because it's big.",
	force: 12,
	w_class: 3,
	materials: null,
	icon_state: "crowbar_large",
	item_state: "crowbar",
	toolspeed: 0.5,
});

// /obj/item/weapon/crowbar/large/proc/<init>  (code/game/objects/items/weapons/tools.dm:708)
rt.def("/obj/item/weapon/crowbar/large/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 70]));
	return f.dot;
});

rt.type(7372, "/obj/item/weapon/crowbar/power", "/obj/item/weapon/crowbar", {
	name: "jaws of life",
	desc: "A set of jaws of life, compressed through the magic of science. It's fitted with a prying head.",
	icon_state: "jaws_pry",
	item_state: "jawsoflife",
	materials: null,
	origin_tech: "materials=2;engineering=2",
	usesound: rt.rsc("sound/items/jaws_pry.ogg"),
	force: 15,
	toolspeed: 0.25,
});

// /obj/item/weapon/crowbar/power/proc/<init>  (code/game/objects/items/weapons/tools.dm:725)
rt.def("/obj/item/weapon/crowbar/power/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 150, "$silver", 50, "$titanium", 25]));
	return f.dot;
});

// /obj/item/weapon/crowbar/power/proc/suicide_act  (code/game/objects/items/weapons/tools.dm:732)
rt.def("/obj/item/weapon/crowbar/power/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is putting ＀ head in ＀, it looks like ＀ trying to commit suicide!</span>", [live(user), rt.callName(f, live(user), "p_their", []), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/jaws_pry.ogg"), 50, 1, -1]);
	return 1;
});

// /obj/item/weapon/crowbar/power/proc/attack_self  (code/game/objects/items/weapons/tools.dm:737)  may sleep
rt.def("/obj/item/weapon/crowbar/power/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let cutjaws: Value = null;
	f.vars = () => [user, cutjaws];
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.rsc("sound/items/change_jaws.ogg"), 50, 1]);
	cutjaws = (yield* g.new_(f, T("/obj/item/weapon/wirecutters/power"), []));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You attach the cutting jaws to ＀.</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	yield* g.callName(f, live(user), "put_in_active_hand", [live(cutjaws)]);
	return f.dot;
}, true);
