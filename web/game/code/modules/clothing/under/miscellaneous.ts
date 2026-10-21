// From code/modules/clothing/under/miscellaneous.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8354, "/obj/item/clothing/under/acj", "/obj/item/clothing/under", {
	can_adjust: 0,
	name: "administrative cybernetic jumpsuit",
	icon_state: "syndicate",
	item_state: "bl_suit",
	item_color: "syndicate",
	desc: "A cybernetically enhanced jumpsuit used for administrative duties.",
	gas_transfer_coefficient: 0.01,
	permeability_coefficient: 0.01,
	body_parts_covered: 2046,
	armor: null,
	cold_protection: 2046,
	min_cold_protection_temperature: 2,
	heat_protection: 2046,
	max_heat_protection_temperature: 1500,
	resistance_flags: 34,
});

// /obj/item/clothing/under/acj/proc/<init>  (code/modules/clothing/under/miscellaneous.dm:147)
rt.def("/obj/item/clothing/under/acj/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 100, "bio", 100, "rad", 100, "fire", 100, "acid", 100]));
	return f.dot;
});

rt.type(8403, "/obj/item/clothing/under/maid", "/obj/item/clothing/under", {
	fitted: 2,
	can_adjust: 0,
	name: "maid costume",
	desc: "Maid in China.",
	icon_state: "maid",
	item_state: "maid",
	item_color: "maid",
	body_parts_covered: 6,
});

// /obj/item/clothing/under/maid/proc/Initialize  (code/modules/clothing/under/miscellaneous.dm:507)  may sleep
rt.def("/obj/item/clothing/under/maid/proc/Initialize", function* Initialize(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, (A = (yield* g.new_(f, T("/obj/item/clothing/accessory/maidapron"), [live(f.src)]))), "attach", [live(f.src), null]);
	return f.dot;
}, true);

rt.type(8415, "/obj/item/clothing/under/plasmaman", "/obj/item/clothing/under", {
	next_extinguish: 0,
	extinguish_cooldown: 100,
	extinguishes_left: 5,
	can_adjust: 0,
	name: "plasma envirosuit",
	desc: "A special containment suit that allows plasma-based lifeforms to exist safely in an oxygenated environment, and automatically extinguishes them in a crisis. Despite being airtight, it's not spaceworthy.",
	icon_state: "plasmaman",
	item_state: "plasmaman",
	item_color: "plasmaman",
	armor: null,
	body_parts_covered: 2046,
	strip_delay: 80,
});

// /obj/item/clothing/under/plasmaman/proc/<init>  (code/modules/clothing/under/miscellaneous.dm:617)
rt.def("/obj/item/clothing/under/plasmaman/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 100, "rad", 0, "fire", 95, "acid", 95]));
	return f.dot;
});

// /obj/item/clothing/under/plasmaman/proc/examine  (code/modules/clothing/under/miscellaneous.dm:627)
rt.def("/obj/item/clothing/under/plasmaman/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>There are ＀ extinguisher charges left in this suit.</span>", [rt.sv(f, "extinguishes_left")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/clothing/under/plasmaman/proc/Extinguish  (code/modules/clothing/under/miscellaneous.dm:632)  may sleep
rt.def("/obj/item/clothing/under/plasmaman/proc/Extinguish", function* Extinguish(f: Frame, H: Value) {
	f.vars = () => [H];
	if (!truthy((rt.istype(live(H), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "on_fire", live(H)))) {
		if (truthy(rt.sv(f, "extinguishes_left"))) {
			if (rt.gt(rt.sv(f, "next_extinguish"), rt.worldTime(f))) {
				return live(f.dot);
			}
			rt.setSv(f, "next_extinguish", add(rt.worldTime(f), rt.sv(f, "extinguish_cooldown")));
			rt.incSrcVar(f, "extinguishes_left", -1, true);
			yield* g.callName(f, live(H), "visible_message", [fmt("<span class='warning'>＀'s suit automatically extinguishes them!</span>", [live(H)]), "<span class='warning'>Your suit automatically extinguishes you.</span>"]);
			yield* g.callName(f, live(H), "ExtinguishMob", []);
			yield* g.new_(f, T("/obj/effect/particle_effect/water"), [rt.getStep(f, live(H), 0)]);
		}
	}
	return 0;
}, true);

// /obj/item/clothing/under/plasmaman/proc/attackby  (code/modules/clothing/under/miscellaneous.dm:647)  may sleep
rt.def("/obj/item/clothing/under/plasmaman/proc/attackby", function* attackby(f: Frame, E: Value, user: Value, params: Value) {
	f.vars = () => [E, user, params];
	if (truthy((rt.istype(live(E), T("/obj/item/device/extinguisher_refill")) ? 1 : 0))) {
		if (isEqual(rt.sv(f, "extinguishes_left"), 5)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The inbuilt extinguisher is full.</span>"]);
			return live(f.dot);
		} else {
			rt.setSv(f, "extinguishes_left", 5);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You refill the suit's built-in extinguisher, using up the cartridge.</span>"]);
			yield* g.call(f, P("/proc/qdel"), null, [live(E)]);
			return live(f.dot);
		}
		return live(f.dot);
	}
	return live(f.dot);
}, true);
