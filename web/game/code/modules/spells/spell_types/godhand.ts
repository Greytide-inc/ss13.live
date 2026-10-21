// From code/modules/spells/spell_types/godhand.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5696, "/obj/item/weapon/melee/touch_attack", "/obj/item/weapon/melee", {
	catchphrase: "High Five!",
	on_use_sound: null,
	attached_spell: null,
	flags: 16514,
	throw_range: 0,
	throw_speed: 0,
	name: "１outstretched hand",
	desc: "High Five?",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "syndballoon",
	item_state: null,
	w_class: 5,
	force: 0,
	throwforce: 0,
});

// /obj/item/weapon/melee/touch_attack/proc/Initialize  (code/modules/spells/spell_types/godhand.dm:18)  may sleep
rt.def("/obj/item/weapon/melee/touch_attack/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "attached_spell", rt.sv(f, "loc"));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/weapon/melee/touch_attack/proc/attack  (code/modules/spells/spell_types/godhand.dm:22)  may sleep
rt.def("/obj/item/weapon/melee/touch_attack/proc/attack", function* attack(f: Frame) {
	if (!truthy((rt.istype(live(f.args[1]), T("/mob/living/carbon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if ((truthy(rt.fv(f, "lying", live(f.args[1]))) || truthy(rt.fv(f, "handcuffed", live(f.args[1]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You can't reach out!</span>"]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user"] });

// /obj/item/weapon/melee/touch_attack/proc/afterattack  (code/modules/spells/spell_types/godhand.dm:30)  may sleep
rt.def("/obj/item/weapon/melee/touch_attack/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	f.vars = () => [target, user, proximity];
	yield* g.callName(f, live(user), "say", [rt.sv(f, "catchphrase")]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.sv(f, "on_use_sound"), 50, 1]);
	if (truthy(rt.sv(f, "attached_spell"))) {
		rt.setFv(f, "attached_hand", rt.sv(f, "attached_spell"), null);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/melee/touch_attack/proc/Destroy  (code/modules/spells/spell_types/godhand.dm:38)  may sleep
rt.def("/obj/item/weapon/melee/touch_attack/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "attached_spell"))) {
		rt.setFv(f, "attached_hand", rt.sv(f, "attached_spell"), null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(5697, "/obj/item/weapon/melee/touch_attack/disintegrate", "/obj/item/weapon/melee/touch_attack", {
	catchphrase: "EI NATH!!",
	on_use_sound: rt.rsc("sound/magic/disintegrate.ogg"),
	name: "１disintegrating touch",
	desc: "This hand of mine glows with an awesome power!",
	icon_state: "disintegrate",
	item_state: "disintegrate",
});

// /obj/item/weapon/melee/touch_attack/disintegrate/proc/afterattack  (code/modules/spells/spell_types/godhand.dm:50)  may sleep
rt.def("/obj/item/weapon/melee/touch_attack/disintegrate/proc/afterattack", function* afterattack(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if ((((((!truthy(live(f.args[2])) || isEqual(live(f.args[0]), live(f.args[1]))) || !truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])])))) || !truthy((rt.istype(live(f.args[1]), T("/mob/living/carbon")) ? 1 : 0))) || truthy(rt.fv(f, "lying", live(f.args[1])))) || truthy(rt.fv(f, "handcuffed", live(f.args[1]))))) {
		return live(f.dot);
	}
	M = live(f.args[0]);
	yield* g.call(f, P("/proc/do_sparks"), null, [4, 0, rt.fv(f, "loc", live(M))]);
	yield* g.callName(f, live(M), "gib", []);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user", "proximity"] });

rt.type(5698, "/obj/item/weapon/melee/touch_attack/fleshtostone", "/obj/item/weapon/melee/touch_attack", {
	catchphrase: "STAUN EI!!",
	on_use_sound: rt.rsc("sound/magic/fleshtostone.ogg"),
	name: "１petrifying touch",
	desc: "That's the bottom line, because flesh to stone said so!",
	icon_state: "fleshtostone",
	item_state: "fleshtostone",
});

// /obj/item/weapon/melee/touch_attack/fleshtostone/proc/afterattack  (code/modules/spells/spell_types/godhand.dm:66)  may sleep
rt.def("/obj/item/weapon/melee/touch_attack/fleshtostone/proc/afterattack", function* afterattack(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if ((((((!truthy(live(f.args[2])) || isEqual(live(f.args[0]), live(f.args[1]))) || !truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) || !truthy((rt.istype(live(f.args[1]), T("/mob/living/carbon")) ? 1 : 0))) || truthy(rt.fv(f, "lying", live(f.args[1])))) || truthy(rt.fv(f, "handcuffed", live(f.args[1]))))) {
		return live(f.dot);
	}
	if ((truthy(rt.fv(f, "lying", live(f.args[1]))) || truthy(rt.fv(f, "handcuffed", live(f.args[1]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You can't reach out!</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, (M = live(f.args[0])), "Stun", [40]);
	yield* g.callName(f, live(M), "petrify", []);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user", "proximity"] });
