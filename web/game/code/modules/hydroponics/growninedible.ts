// Based on /tg/station's code/modules/hydroponics/growninedible.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7492, "/obj/item/weapon/grown", "/obj/item/weapon", {
	seed: null,
	name: "grown_weapon",
	icon: rt.rsc("icons/obj/hydroponics/harvest.dmi"),
	resistance_flags: 4,
});

// growninedible.dm:12
rt.def("/obj/item/weapon/grown/proc/New", function* New(f: Frame) {
	let _T: Value = null;
	if (f.args[1] === null) {
		f.args[1] = null;
	}
	yield* parent_proc();
	yield* this.create_reagents(50);
	if (f.args[1]) {
		this.seed = (yield* f.args[1].Copy());
	} else if (ispath(this.seed)) {
		this.seed = (yield* new_(this.seed));
		this.seed.adjust_potency(50 - this.seed.potency);
	}
	this.pixel_x = rand(-5, 5);
	this.pixel_y = rand(-5, 5);
	if (!this.seed) return f.dot;
	for (_T of each(this.seed.genes, T("/datum/plant_gene/trait"))) {
		yield* _T.on_new(this, f.args[0]);
	}
	if (rt.op(f, "IsType", [], [this, this.seed.product])) {
		yield* this.seed.prepare_result(this);
	}
	this.transform *= TransformUsingVariable(this.seed.potency, 100, 0.5);
	this.add_juice();
	return f.dot;
}, true, { args: ["newloc", "new_seed"] });

// growninedible.dm:36
rt.def("/obj/item/weapon/grown/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	yield* parent_proc();
	if (!rt.istype(O, T("/obj/item/device/plant_analyzer"))) return f.dot;
	let msg: Value = fmt("<span class='info'>*---------*\n This is ＇<span class='name'>！</span>\n", [this]);
	if (this.seed) {
		msg += this.seed.get_analyzer_text();
	}
	msg += "</span>";
	to_chat(f.usr, msg);
	return f.dot;
}, true);

// growninedible.dm:53
rt.def("/obj/item/weapon/grown/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let _T: Value = null;
	if (this.seed) {
		for (_T of each(this.seed.genes, T("/datum/plant_gene/trait"))) {
			yield* _T.on_cross(this, AM);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// growninedible.dm:58
rt.def("/obj/item/weapon/grown/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value) {
	let _T: Value = null;
	if (yield* parent_proc()) return f.dot;
	if (!this.seed) return f.dot;
	for (_T of each(this.seed.genes, T("/datum/plant_gene/trait"))) {
		yield* _T.on_throw_impact(this, hit_atom);
	}
	return f.dot;
}, true, { waitfor: false });
