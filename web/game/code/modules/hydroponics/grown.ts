// Based on /tg/station's code/modules/hydroponics/grown.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(6257, "/obj/item/weapon/reagent_containers/food/snacks/grown", "/obj/item/weapon/reagent_containers/food/snacks", {
	seed: null,
	plantname: "",
	bitesize_mod: 0,
	splat_type: rt.typePath("/obj/effect/decal/cleanable/plant_smudge"),
	dried_type: -1,
	icon: rt.rsc("icons/obj/hydroponics/harvest.dmi"),
	resistance_flags: 4,
	origin_tech: "biotech=1",
});

// grown.dm:21
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/proc/New", function* New(f: Frame) {
	let _T: Value = null;
	if (f.args[1] === null) {
		f.args[1] = null;
	}
	this.tastes = rt.alist(f, ["name", 1]);
	yield* parent_proc();
	if (f.args[1]) {
		this.seed = (yield* f.args[1].Copy());
	} else if (ispath(this.seed)) {
		this.seed = (yield* new_(this.seed));
		this.seed.adjust_potency(50 - this.seed.potency);
	}
	this.pixel_x = rand(-5, 5);
	this.pixel_y = rand(-5, 5);
	if (this.dried_type == -1) {
		this.dried_type = this.type;
	}
	if (!this.seed) return f.dot;
	for (_T of each(this.seed.genes, T("/datum/plant_gene/trait"))) {
		yield* _T.on_new(this, f.args[0]);
	}
	yield* this.seed.prepare_result(this);
	this.transform *= TransformUsingVariable(this.seed.potency, 100, 0.5);
	this.add_juice();
	return f.dot;
}, true, { args: ["newloc", "new_seed"] });

// grown.dm:48
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/proc/add_juice", function add_juice(f: Frame) {
	if (this.reagents) {
		if (this.bitesize_mod) {
			this.bitesize = 1 + round(this.reagents.total_volume / this.bitesize_mod);
		}
		return 1;
	}
	return 0;
});

// grown.dm:53
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/proc/examine", function examine(f: Frame, user: Value) {
	let _T: Value = null;
	parent_proc();
	if (!this.seed) return f.dot;
	for (_T of each(this.seed.genes, T("/datum/plant_gene/trait"))) {
		if (_T.examine_line) {
			to_chat(user, _T.examine_line);
		}
	}
	return f.dot;
}, false);

// grown.dm:60
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let msg: Value = null, reag_txt: Value = null, reagent_id: Value = null, R: Value = null, amt: Value = null, _T: Value = null;
	yield* parent_proc();
	if (rt.istype(O, T("/obj/item/device/plant_analyzer"))) {
		msg = fmt("<span class='info'>*---------*\n This is ＇<span class='name'>！</span>.\n", [this]);
		if (this.seed) {
			msg += this.seed.get_analyzer_text();
		}
		reag_txt = "";
		if (this.seed) {
			for (reagent_id of each(this.seed.reagents_add)) {
				R = rt.index(GLOB.chemical_reagents_list, reagent_id);
				amt = this.reagents.get_reagent_amount(reagent_id);
				reag_txt += `\n<span class='info'>- ${R.name}: ${amt}</span>`;
			}
		}
		if (reag_txt) {
			msg += reag_txt;
			msg += "<br><span class='info'>*---------*</span>";
		}
		to_chat(user, msg);
	} else {
		if (!this.seed) return f.dot;
		for (_T of each(this.seed.genes, T("/datum/plant_gene/trait"))) {
			yield* _T.on_attackby(this, O, user);
		}
	}
	return f.dot;
}, true);

// grown.dm:84
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (this.seed && this.seed.get_gene(T("/datum/plant_gene/trait/squash"))) {
		yield* this.squash(user);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// grown.dm:89
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value) {
	let _T: Value = null;
	if (yield* parent_proc()) return f.dot;
	if (!this.seed) return f.dot;
	for (_T of each(this.seed.genes, T("/datum/plant_gene/trait"))) {
		yield* _T.on_throw_impact(this, hit_atom);
	}
	if (!this.seed.get_gene(T("/datum/plant_gene/trait/squash"))) return f.dot;
	yield* this.squash(hit_atom);
	return f.dot;
}, true, { waitfor: false });

// grown.dm:97
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/proc/squash", function* squash(f: Frame, target: Value) {
	let O: Value = null, trait: Value = null, A: Value = null;
	let _T: Value = rt.getStep(f, target, 0);
	if (ispath(this.splat_type, T("/obj/effect/decal/cleanable/plant_smudge"))) {
		if (this.filling_color) {
			(O = (yield* new_(this.splat_type, _T))).color = this.filling_color;
			O.name = `${this.name} smudge`;
		}
	} else if (this.splat_type) {
		yield* new_(this.splat_type, _T);
	}
	if (this.trash) {
		yield* this.generate_trash(_T);
	}
	this.visible_message(`<span class='warning'>${this} has been squashed.</span>`, "<span class='italics'>You hear a smack.</span>");
	if (this.seed) {
		for (trait of each(this.seed.genes, T("/datum/plant_gene/trait"))) {
			yield* trait.on_squash(this, target);
		}
	}
	yield* this.reagents.reaction(_T);
	for (A of each(_T)) {
		yield* this.reagents.reaction(A);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// grown.dm:121
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/proc/On_Consume", function* On_Consume(f: Frame) {
	let _T: Value = null;
	if (rt.istype(f.usr, T("/mob/living/carbon"))) {
		if (this.seed) {
			for (_T of each(this.seed.genes, T("/datum/plant_gene/trait"))) {
				yield* _T.on_consume(this, f.usr);
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// grown.dm:129
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let _T: Value = null;
	if (this.seed) {
		for (_T of each(this.seed.genes, T("/datum/plant_gene/trait"))) {
			yield* _T.on_cross(this, AM);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// grown.dm:135
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/proc/generate_trash", function* generate_trash(f: Frame, location: Value) {
	if (this.trash && ispath(this.trash, T("/obj/item/weapon/grown"))) {
		f.dot = (yield* new_(this.trash, location, this.seed));
		this.trash = null;
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

rt.type(6258, "/obj/item/weapon/reagent_containers/food/snacks/grown/shell", "/obj/item/weapon/reagent_containers/food/snacks/grown", {});

// grown.dm:145
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/shell/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!this.trash) return f.dot;
	let _T: Value = (yield* this.generate_trash());
	yield* qdel(this);
	yield* user.putItemFromInventoryInHandIfPossible(_T, user.active_hand_index, 1);
	to_chat(user, fmt("<span class='notice'>You open ＀'s shell, revealing ＇！.</span>", [this, _T]));
	return f.dot;
}, true);
