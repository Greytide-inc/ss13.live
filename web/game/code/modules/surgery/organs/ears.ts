// Based on /tg/station's code/modules/surgery/organs/ears.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9516, "/obj/item/organ/ears", "/obj/item/organ", {
	deaf: 0,
	ear_damage: 0,
	bang_protect: 0,
	name: "ears",
	icon_state: "ears",
	desc: "There are three parts to the ear. Inner, middle and outer. Only one of these parts should be normally visible.",
	zone: "head",
	slot: "ears",
	gender: "plural",
});

// ears.dm:21
rt.def("/obj/item/organ/ears/proc/on_life", function on_life(f: Frame) {
	let C: Value = null;
	let $0: any;
	if (!rt.istype(this.owner, T("/mob/living/carbon"))) {
		return f.dot;
	}
	if (rt.bitAnd((C = this.owner).disabilities, 4)) {
		this.deaf = max(this.deaf, 1);
	} else {
		$0 = C.ears;
		if ($0) {
			if (C.ears.secondary_flags) {
				$0 = rt.index(C.ears.secondary_flags, "heals_ears");
			} else {
				$0 = 0;
			}
		}
		if ($0) {
			this.deaf = max(this.deaf - 1, 1);
			this.ear_damage = max(this.ear_damage - 0.1, 0);
		}
		if (!(this.ear_damage < UNHEALING_EAR_DAMAGE)) return f.dot;
		this.ear_damage = max(this.ear_damage - 0.05, 0);
		this.deaf = max(this.deaf - 1, 0);
	}
	return f.dot;
});

// ears.dm:40
rt.def("/obj/item/organ/ears/proc/restoreEars", function restoreEars(f: Frame) {
	this.deaf = 0;
	this.ear_damage = 0;
	let C: Value = this.owner;
	if (!(rt.istype(this.owner, T("/mob/living/carbon")) && rt.bitAnd(C.disabilities, 4))) return f.dot;
	this.deaf = 1;
	return f.dot;
});

// ears.dm:46
rt.def("/obj/item/organ/ears/proc/adjustEarDamage", function adjustEarDamage(f: Frame, ddmg: Value, ddeaf: Value) {
	this.ear_damage = max(this.ear_damage + ddmg, 0);
	this.deaf = max(this.deaf + ddeaf, 0);
	return f.dot;
});

// ears.dm:50
rt.def("/obj/item/organ/ears/proc/minimumDeafTicks", function minimumDeafTicks(f: Frame, value: Value) {
	this.deaf = max(this.deaf, value);
	return f.dot;
});

// ears.dm:59
rt.def("/mob/living/carbon/proc/restoreEars", function restoreEars(f: Frame) {
	let ears: Value = null;
	if (!(ears = this.getorgan(T("/obj/item/organ/ears")))) return f.dot;
	ears.restoreEars();
	return f.dot;
});

// ears.dm:66
rt.def("/mob/living/carbon/proc/adjustEarDamage", function adjustEarDamage(f: Frame, ddmg: Value, ddeaf: Value) {
	let ears: Value = null;
	if (!(ears = this.getorgan(T("/obj/item/organ/ears")))) return f.dot;
	ears.adjustEarDamage(ddmg, ddeaf);
	return f.dot;
});

// ears.dm:73
rt.def("/mob/living/carbon/proc/minimumDeafTicks", function minimumDeafTicks(f: Frame, value: Value) {
	let ears: Value = null;
	if (!(ears = this.getorgan(T("/obj/item/organ/ears")))) return f.dot;
	ears.minimumDeafTicks(value);
	return f.dot;
});

rt.type(9518, "/obj/item/organ/ears/cat", "/obj/item/organ/ears", {
	name: "cat ears",
	icon: rt.rsc("icons/obj/clothing/hats.dmi"),
	icon_state: "kitty",
});

// ears.dm:84
rt.def("/obj/item/organ/ears/cat/proc/adjustEarDamage", function adjustEarDamage(f: Frame, ddmg: Value, ddeaf: Value) {
	parent_proc(ddmg * 2, ddeaf * 2);
	return f.dot;
});

// ears.dm:87
rt.def("/obj/item/organ/ears/cat/proc/Insert", function* Insert(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	yield* parent_proc();
	this.color = f.args[0].hair_color;
	rt.setAt(f.args[0].dna.features, "ears", "Cat");
	yield* f.args[0].update_body();
	return f.dot;
}, true, { args: ["H", "special", "drop_if_replaced"] });

// ears.dm:93
rt.def("/obj/item/organ/ears/cat/proc/Remove", function* Remove(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	this.color = f.args[0].hair_color;
	rt.setAt(f.args[0].dna.features, "ears", "None");
	yield* f.args[0].update_body();
	return f.dot;
}, true, { args: ["H", "special"] });
