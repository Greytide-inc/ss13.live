// Based on /tg/station's code/modules/modular_computers/computers/item/computer_damage.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// computer_damage.dm:2
rt.def("/obj/item/device/modular_computer/proc/take_damage", function* take_damage(f: Frame) {
	let I: Value = null, H: Value = null;
	let $e: any;
	if (f.args[1] === null) {
		f.args[1] = "brute";
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	f.dot = (yield* parent_proc());
	let component_probability: Value = min(50, max(f.args[0] * 0.1, 1 - this.obj_integrity / this.max_integrity));
	const subject = f.args[2];
	if (subject === "bullet") {
		component_probability = f.args[0] * 0.5;
	} else if (subject === "laser") {
		component_probability = f.args[0] * 0.66;
	}
	if (!component_probability) return f.dot;
	for (I of each(this.all_components)) {
		H = rt.index(this.all_components, I);
		if (prob(component_probability)) {
			yield* H.take_damage(round(f.args[0] * 0.5), f.args[1], f.args[2], 0);
		}
	}
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect"] });

// computer_damage.dm:17
rt.def("/obj/item/device/modular_computer/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	yield* this.break_apart();
	return f.dot;
}, true);

// computer_damage.dm:20
rt.def("/obj/item/device/modular_computer/proc/break_apart", function* break_apart(f: Frame) {
	let newloc: Value = null, C: Value = null, H: Value = null;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		this.physical.visible_message(fmt("＄！ breaks apart!", [this]));
		yield* new_(T("/obj/item/stack/sheet/metal"), (newloc = rt.getStep(f, this, 0)), round(this.steel_sheet_cost / 2));
		for (C of each(this.all_components)) {
			yield* this.uninstall_component((H = rt.index(this.all_components, C)));
			yield* H.forceMove(newloc);
			if (prob(25)) {
				yield* H.take_damage(rand(10, 30), "brute", 0, 0);
			}
		}
	}
	yield* this.relay_qdel();
	yield* qdel(this);
	return f.dot;
}, true);
