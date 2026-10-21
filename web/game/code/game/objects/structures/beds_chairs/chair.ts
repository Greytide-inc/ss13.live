// From code/game/objects/structures/beds_chairs/chair.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12731, "/obj/structure/chair", "/obj/structure", {
	buildstacktype: rt.typePath("/obj/item/stack/sheet/metal"),
	buildstackamount: 1,
	item_chair: rt.typePath("/obj/item/chair"),
	anchored: 1,
	can_buckle: 1,
	buckle_lying: 0,
	name: "chair",
	desc: "You sit in this. Either by will or force.\n<span class='notice'>Drag your sprite to sit in the chair. Alt-click to rotate it clockwise.</span>",
	icon: rt.rsc("icons/obj/chairs.dmi"),
	icon_state: "chair",
	resistance_flags: 0,
	obj_integrity: 250,
	max_integrity: 250,
	integrity_failure: 25,
	layer: 3,
});

// /obj/structure/chair/proc/Initialize  (code/game/objects/structures/beds_chairs/chair.dm:19)  may sleep
rt.def("/obj/structure/chair/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "anchored"))) return f.dot;
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/chair/proc/RemoveFromLatejoin")])), 0]);
	return f.dot;
}, true);

// /obj/structure/chair/proc/Destroy  (code/game/objects/structures/beds_chairs/chair.dm:24)  may sleep
rt.def("/obj/structure/chair/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "RemoveFromLatejoin");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/chair/proc/RemoveFromLatejoin  (code/game/objects/structures/beds_chairs/chair.dm:28)
rt.def("/obj/structure/chair/proc/RemoveFromLatejoin", function RemoveFromLatejoin(f: Frame) {
	(rt.modField(f, rt.gl("SSjob"), "latejoin_trackers", live(f.src), subtract));
	return f.dot;
});

// /obj/structure/chair/proc/deconstruct  (code/game/objects/structures/beds_chairs/chair.dm:32)  may sleep
rt.def("/obj/structure/chair/proc/deconstruct", function* deconstruct(f: Frame) {
	if ((truthy(rt.sv(f, "buildstacktype")) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) {
		yield* g.new_(f, rt.sv(f, "buildstacktype"), [rt.sv(f, "loc"), rt.sv(f, "buildstackamount")]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/structure/chair/proc/attack_paw  (code/game/objects/structures/beds_chairs/chair.dm:37)  may sleep
rt.def("/obj/structure/chair/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/structure/chair/proc/narsie_act  (code/game/objects/structures/beds_chairs/chair.dm:40)  may sleep
rt.def("/obj/structure/chair/proc/narsie_act", function* narsie_act(f: Frame) {
	let W: Value = null;
	f.vars = () => [W];
	yield* g.callName(f, (W = (yield* g.new_(f, T("/obj/structure/chair/wood"), [rt.getStep(f, live(f.src), 0)]))), "setDir", [rt.sv(f, "dir")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/chair/proc/attackby  (code/game/objects/structures/beds_chairs/chair.dm:45)  may sleep
rt.def("/obj/structure/chair/proc/attackby", function* attackby(f: Frame) {
	let SK: Value = null, E: Value = null;
	f.vars = () => [SK, E];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		yield* g.srcCall(f, "deconstruct");
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/assembly/shock_kit")) ? 1 : 0))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return live(f.dot);
			}
			SK = live(f.args[0]);
			E = (yield* g.new_(f, T("/obj/structure/chair/e_chair"), [rt.fv(f, "loc", live(f.src))]));
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			yield* g.callName(f, live(E), "setDir", [rt.sv(f, "dir")]);
			rt.setFv(f, "part", live(E), live(SK));
			rt.setFv(f, "loc", live(SK), live(E));
			rt.setFv(f, "master", live(SK), live(E));
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/chair/proc/attack_tk  (code/game/objects/structures/beds_chairs/chair.dm:63)  may sleep
rt.def("/obj/structure/chair/proc/attack_tk", function* attack_tk(f: Frame) {
	if ((!truthy(rt.sv(f, "anchored")) || truthy((yield* g.srcCall(f, "has_buckled_mobs"))))) {
		yield* g.callSuper(f, [], rt.Args.Same);
	} else {
		yield* g.srcCall(f, "rotate");
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/chair/proc/handle_rotation  (code/game/objects/structures/beds_chairs/chair.dm:69)  may sleep
rt.def("/obj/structure/chair/proc/handle_rotation", function* handle_rotation(f: Frame, direction: Value) {
	let m: Value = null, buckled_mob: Value = null;
	let $e: any;
	f.vars = () => [direction, m, buckled_mob, $e];
	yield* g.srcCall(f, "handle_layer");
	if (!truthy((yield* g.srcCall(f, "has_buckled_mobs")))) return f.dot;
	m = null;
	rt.forList(f, 0, rt.sv(f, "buckled_mobs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		m = $e;
		yield* g.callName(f, (buckled_mob = live(m)), "setDir", [live(direction)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/chair/proc/handle_layer  (code/game/objects/structures/beds_chairs/chair.dm:76)
rt.def("/obj/structure/chair/proc/handle_layer", function handle_layer(f: Frame) {
	if ((truthy(rt.callSrc(f, "has_buckled_mobs", [])) && isEqual(rt.sv(f, "dir"), 1))) {
		rt.setSv(f, "layer", 4.099999904632568);
	} else {
		rt.setSv(f, "layer", 3);
	}
	return f.dot;
});

// /obj/structure/chair/proc/post_buckle_mob  (code/game/objects/structures/beds_chairs/chair.dm:82)
rt.def("/obj/structure/chair/proc/post_buckle_mob", function post_buckle_mob(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "handle_layer", []);
	return f.dot;
}, false, { args: ["M"] });

// /obj/structure/chair/proc/spin  (code/game/objects/structures/beds_chairs/chair.dm:86)  may sleep
rt.def("/obj/structure/chair/proc/spin", function* spin(f: Frame) {
	yield* g.srcCall(f, "setDir", (yield* g.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 90])));
	return f.dot;
}, true);

// /obj/structure/chair/proc/setDir  (code/game/objects/structures/beds_chairs/chair.dm:89)  may sleep
rt.def("/obj/structure/chair/proc/setDir", function* setDir(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "handle_rotation", live(f.args[0]));
	return f.dot;
}, true, { args: ["newdir"] });

// /obj/structure/chair/verb/rotate  (code/game/objects/structures/beds_chairs/chair.dm:97)  may sleep
rt.def("/obj/structure/chair/verb/rotate", function* rotate(f: Frame) {
	if (truthy(rt.fv(f, "ghost_interaction", rt.gl("config")))) {
		yield* g.srcCall(f, "spin");
	} else {
		if ((!truthy(live(f.usr)) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.usr))]))))) {
			return live(f.dot);
		}
		if ((truthy(rt.fv(f, "stat", live(f.usr))) || truthy((yield* g.callName(f, live(f.usr), "restrained", []))))) {
			return live(f.dot);
		}
		yield* g.srcCall(f, "spin");
	}
	return f.dot;
}, true, { verb: { name: "Rotate Chair", category: "Object", src: 3, range: 1 } });

// /obj/structure/chair/proc/AltClick  (code/game/objects/structures/beds_chairs/chair.dm:107)  may sleep
rt.def("/obj/structure/chair/proc/AltClick", function* AltClick(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.callName(f, live(f.args[0]), "incapacitated", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You can't do that right now!</span>"]);
		return live(f.dot);
	}
	if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[0])])), 1)) {
		return live(f.dot);
	} else {
		yield* g.srcCall(f, "rotate");
	}
	return f.dot;
}, true, { args: ["user"] });

rt.type(12736, "/obj/structure/chair/comfy", "/obj/structure/chair", {
	armrest: null,
	buildstackamount: 2,
	item_chair: null,
	name: "comfy chair",
	desc: "It looks comfy.\n<span class='notice'>Alt-click to rotate it clockwise.</span>",
	icon_state: "comfychair",
	color: "#ffffff",
	resistance_flags: 4,
	obj_integrity: 70,
	max_integrity: 70,
});

// /obj/structure/chair/comfy/proc/Initialize  (code/game/objects/structures/beds_chairs/chair.dm:151)  may sleep
rt.def("/obj/structure/chair/comfy/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "armrest", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/chairs.dmi"), "comfychair_armrest"])));
	rt.setFv(f, "layer", rt.sv(f, "armrest"), 4.099999904632568);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/chair/comfy/proc/Destroy  (code/game/objects/structures/beds_chairs/chair.dm:156)  may sleep
rt.def("/obj/structure/chair/comfy/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "armrest")]);
	rt.setSv(f, "armrest", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/chair/comfy/proc/post_buckle_mob  (code/game/objects/structures/beds_chairs/chair.dm:160)
rt.def("/obj/structure/chair/comfy/proc/post_buckle_mob", function post_buckle_mob(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.callSrc(f, "has_buckled_mobs", []))) {
		rt.callSrc(f, "add_overlay", [rt.sv(f, "armrest")]);
	} else {
		rt.callSrc(f, "cut_overlay", [rt.sv(f, "armrest")]);
	}
	return f.dot;
}, false, { args: ["M"] });

// /obj/structure/chair/proc/MouseDrop  (code/game/objects/structures/beds_chairs/chair.dm:207)  may sleep
rt.def("/obj/structure/chair/proc/MouseDrop", function* MouseDrop(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(isEqual(live(f.args[0]), live(f.usr)) && truthy((yield* g.srcCall(f, "Adjacent", live(f.usr)))))) return f.dot;
	if ((((!truthy(rt.sv(f, "item_chair")) || !truthy((yield* g.callName(f, live(f.usr), "can_hold_items", [])))) || truthy((yield* g.srcCall(f, "has_buckled_mobs")))) || truthy(rt.bitAnd(rt.fv(f, "flags", live(f.src)), 128)))) {
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(f.usr), "incapacitated", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You can't do that right now!</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "visible_message", [fmt("<span class='notice'>＀ grabs ％！.</span>", [live(f.usr), rt.fv(f, "name", live(f.src))]), fmt("<span class='notice'>You grab ％！.</span>", [rt.fv(f, "name", live(f.src))])]);
	C = (yield* g.new_(f, rt.sv(f, "item_chair"), [rt.sv(f, "loc")]));
	yield* g.callName(f, live(f.usr), "put_in_hands", [live(C)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["over_object", "src_location", "over_location"] });

rt.type(9877, "/obj/item/chair", "/obj/item", {
	break_chance: 5,
	origin_type: rt.typePath("/obj/structure/chair"),
	item_state: "chair",
	w_class: 5,
	throw_range: 3,
	hitsound: rt.rsc("sound/items/trayhit1.ogg"),
	hit_reaction_chance: 50,
	materials: null,
	name: "chair",
	desc: "Bar brawl essential.",
	icon: rt.rsc("icons/obj/chairs.dmi"),
	icon_state: "chair_toppled",
	force: 8,
	throwforce: 10,
});

// /obj/item/chair/proc/<init>  (code/game/objects/structures/beds_chairs/chair.dm:237)
rt.def("/obj/item/chair/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000]));
	return f.dot;
});

// /obj/item/chair/proc/narsie_act  (code/game/objects/structures/beds_chairs/chair.dm:242)  may sleep
rt.def("/obj/item/chair/proc/narsie_act", function* narsie_act(f: Frame) {
	let W: Value = null;
	f.vars = () => [W];
	yield* g.callName(f, (W = (yield* g.new_(f, T("/obj/item/chair/wood"), [rt.getStep(f, live(f.src), 0)]))), "setDir", [rt.sv(f, "dir")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/chair/proc/attack_self  (code/game/objects/structures/beds_chairs/chair.dm:247)  may sleep
rt.def("/obj/item/chair/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "plant", live(user));
	return f.dot;
}, true);

// /obj/item/chair/proc/plant  (code/game/objects/structures/beds_chairs/chair.dm:250)  may sleep
rt.def("/obj/item/chair/proc/plant", function* plant(f: Frame, user: Value) {
	let A: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [user, A, C, $e];
	A = null;
	rt.forList(f, 0, rt.getStep(f, rt.sv(f, "loc"), 0), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy((rt.istype(live(A), T("/obj/structure/chair")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>There is already a chair here.</span>"]);
			return live(f.dot);
		}
		if ((truthy(rt.fv(f, "density", live(A))) && !truthy(rt.bitAnd(rt.fv(f, "flags", live(A)), 512)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>There is already something here.</span>"]);
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ rights ％！.</span>", [live(user), rt.fv(f, "name", live(f.src))]), fmt("<span class='notice'>You right ％！.</span>", [rt.sv(f, "name")])]);
	yield* g.callName(f, (C = (yield* g.new_(f, rt.sv(f, "origin_type"), [rt.getStep(f, rt.sv(f, "loc"), 0)]))), "setDir", [rt.sv(f, "dir")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/chair/proc/smash  (code/game/objects/structures/beds_chairs/chair.dm:264)  may sleep
rt.def("/obj/item/chair/proc/smash", function* smash(f: Frame, user: Value) {
	let stack_type: Value = null, remaining_mats: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [user, stack_type, remaining_mats, M, $e];
	if (!truthy((stack_type = rt.initial(f, rt.sv(f, "origin_type"), "buildstacktype")))) {
		return live(f.dot);
	}
	remaining_mats = rt.initial(f, rt.sv(f, "origin_type"), "buildstackamount");
	remaining_mats = rt.inc(live(remaining_mats), -1);
	if (truthy(live(remaining_mats))) {
		M = null;
		rt.forRange(f, 0, 1, live(remaining_mats), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* g.new_(f, live(stack_type), [rt.getStep(f, rt.sv(f, "loc"), 0)]);
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/chair/proc/hit_reaction  (code/game/objects/structures/beds_chairs/chair.dm:278)
rt.def("/obj/item/chair/proc/hit_reaction", function hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	f.vars = () => [attack_text, final_block_chance, damage, attack_type];
	if (live(attack_text) === null) {
		attack_text = "the attack";
	}
	if (live(final_block_chance) === null) {
		final_block_chance = 0;
	}
	if (live(damage) === null) {
		damage = 0;
	}
	if (live(attack_type) === null) {
		attack_type = 1;
	}
	if ((isEqual(live(attack_type), 2) && truthy(rt.op(f, "Prob", [], [rt.sv(f, "hit_reaction_chance")])))) {
		rt.callName(f, live(owner), "visible_message", [fmt("<span class='danger'>＀ fends off ＀ with ＀!</span>", [live(owner), live(attack_text), live(f.src)])]);
		return 1;
	}
	return 0;
});

// /obj/item/chair/proc/afterattack  (code/game/objects/structures/beds_chairs/chair.dm:284)  may sleep
rt.def("/obj/item/chair/proc/afterattack", function* afterattack(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[2]))) {
		return live(f.dot);
	}
	if (!truthy(rt.op(f, "Prob", [], [rt.sv(f, "break_chance")]))) return f.dot;
	yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='danger'>＀ smashes ％！ to pieces against ％！</span>", [live(f.args[1]), live(f.src), live(f.args[0])])]);
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		if (rt.lt(rt.gv(f, "health", (C = live(f.args[0]))), multiply(rt.fv(f, "maxHealth", live(C)), 0.5))) {
			yield* g.callName(f, live(C), "Knockdown", [20]);
		}
	}
	yield* g.srcCall(f, "smash", live(f.args[1]));
	return f.dot;
}, true, { args: ["target", "user", "proximity"] });

rt.type(9880, "/obj/item/chair/wood", "/obj/item/chair", {
	item_state: "woodenchair",
	hitsound: rt.rsc("sound/weapons/genhit1.ogg"),
	materials: null,
	break_chance: 50,
	name: "wooden chair",
	icon_state: "wooden_chair_toppled",
	resistance_flags: 4,
	obj_integrity: 70,
	max_integrity: 70,
	origin_type: rt.typePath("/obj/structure/chair/wood"),
});

// /obj/item/chair/wood/proc/<init>  (code/game/objects/structures/beds_chairs/chair.dm:321)
rt.def("/obj/item/chair/wood/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", null);
	return f.dot;
});
