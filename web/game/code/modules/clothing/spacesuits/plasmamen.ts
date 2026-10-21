// From code/modules/clothing/spacesuits/plasmamen.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7745, "/obj/item/clothing/suit/space/eva/plasmaman", "/obj/item/clothing/suit/space/eva", {
	next_extinguish: 0,
	extinguish_cooldown: 100,
	extinguishes_left: 10,
	name: "EVA plasma envirosuit",
	desc: "A special plasma containment suit designed to be space-worthy, as well as worn over other clothing. Like it's smaller counterpart, it can automatically extinguish the wearer in a crisis, and holds twice as many charges.",
	allowed: null,
	armor: null,
	resistance_flags: 2,
	icon_state: "plasmaman_suit",
	item_state: "plasmaman_suit",
});

// /obj/item/clothing/suit/space/eva/plasmaman/proc/<init>  (code/modules/clothing/spacesuits/plasmamen.dm:7)
rt.def("/obj/item/clothing/suit/space/eva/plasmaman/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/gun"), T("/obj/item/ammo_casing"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/melee/energy/sword"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/weapon/tank")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 100, "rad", 0, "fire", 100, "acid", 75]));
	return f.dot;
});

// /obj/item/clothing/suit/space/eva/plasmaman/proc/examine  (code/modules/clothing/spacesuits/plasmamen.dm:18)
rt.def("/obj/item/clothing/suit/space/eva/plasmaman/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>There are ＀ extinguisher charges left in this suit.</span>", [rt.sv(f, "extinguishes_left")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/clothing/suit/space/eva/plasmaman/proc/Extinguish  (code/modules/clothing/spacesuits/plasmamen.dm:23)  may sleep
rt.def("/obj/item/clothing/suit/space/eva/plasmaman/proc/Extinguish", function* Extinguish(f: Frame, H: Value) {
	f.vars = () => [H];
	if (!truthy((rt.istype(live(H), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "fire_stacks", live(H)))) return f.dot;
	if (!truthy(rt.sv(f, "extinguishes_left"))) return f.dot;
	if (rt.gt(rt.sv(f, "next_extinguish"), rt.worldTime(f))) {
		return live(f.dot);
	}
	rt.setSv(f, "next_extinguish", add(rt.worldTime(f), rt.sv(f, "extinguish_cooldown")));
	rt.incSrcVar(f, "extinguishes_left", -1, true);
	yield* g.callName(f, live(H), "visible_message", [fmt("<span class='warning'>＀'s suit automatically extinguishes them!</span>", [live(H)]), "<span class='warning'>Your suit automatically extinguishes you.</span>"]);
	yield* g.callName(f, live(H), "ExtinguishMob", []);
	yield* g.new_(f, T("/obj/effect/particle_effect/water"), [rt.getStep(f, live(H), 0)]);
	return f.dot;
}, true);

rt.type(7978, "/obj/item/clothing/head/helmet/space/plasmaman", "/obj/item/clothing/head/helmet/space", {
	brightness_on: 4,
	on: 0,
	name: "plasma envirosuit helmet",
	desc: "A special containment helmet that allows plasma-based lifeforms to exist safely in an oxygenated environment. It is space-worthy, and may be worn in tandem with other EVA gear.",
	icon_state: "plasmaman-helm",
	item_state: "plasmaman-helm",
	strip_delay: 80,
	armor: null,
	resistance_flags: 2,
	actions_types: null,
});

// /obj/item/clothing/head/helmet/space/plasmaman/proc/<init>  (code/modules/clothing/spacesuits/plasmamen.dm:44)
rt.def("/obj/item/clothing/head/helmet/space/plasmaman/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 100, "rad", 0, "fire", 100, "acid", 75]));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle_helmet_light")));
	return f.dot;
});

// /obj/item/clothing/head/helmet/space/plasmaman/proc/attack_self  (code/modules/clothing/spacesuits/plasmamen.dm:51)  may sleep
rt.def("/obj/item/clothing/head/helmet/space/plasmaman/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let X: Value = null, A: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [user, X, A, $0, $1, $e];
	rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
	$0 = rt.initial(f, live(f.src), "icon_state");
	if (truthy(rt.sv(f, "on"))) {
		$1 = "-light";
	} else {
		$1 = "";
	}
	rt.setSv(f, "icon_state", fmt("＀＀", [$0, $1]));
	rt.setSv(f, "item_state", rt.sv(f, "icon_state"));
	yield* g.callName(f, live(user), "update_inv_head", []);
	if (truthy(rt.sv(f, "on"))) {
		yield* g.srcCall(f, "set_light", rt.sv(f, "brightness_on"));
	} else {
		yield* g.srcCall(f, "set_light", 0);
	}
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "UpdateButtonIcon", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
