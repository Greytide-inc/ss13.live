// Based on /tg/station's code/modules/reagents/reagent_containers/blood_pack.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(6498, "/obj/item/weapon/reagent_containers/blood", "/obj/item/weapon/reagent_containers", {
	blood_type: null,
	labelled: 0,
	volume: 200,
	name: "blood pack",
	desc: "Contains blood used for transfusion. Must be attached to an IV drip.",
	icon: rt.rsc("icons/obj/bloodpack.dmi"),
	icon_state: "empty",
});

// blood_pack.dm:11
rt.def("/obj/item/weapon/reagent_containers/blood/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.blood_type === null) return f.dot;
	yield* this.reagents.add_reagent("blood", 200, rt.alist(f, ["donor", null, "viruses", null, "blood_DNA", null, "blood_type", this.blood_type, "resistances", null, "trace_chem", null]));
	yield* this.update_icon();
	return f.dot;
}, true);

// blood_pack.dm:18
rt.def("/obj/item/weapon/reagent_containers/blood/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	let B: Value = null;
	if (this.reagents) {
		if ((B = this.reagents.has_reagent("blood")) && B.data && rt.index(B.data, "blood_type")) {
			this.blood_type = rt.index(B.data, "blood_type");
		} else {
			this.blood_type = null;
		}
	}
	this.update_pack_name();
	this.update_icon();
	return f.dot;
});

// blood_pack.dm:27
rt.def("/obj/item/weapon/reagent_containers/blood/proc/update_pack_name", function update_pack_name(f: Frame) {
	if (this.labelled) return f.dot;
	if (this.blood_type) {
		this.name = `blood pack - ${this.blood_type}`;
	} else {
		this.name = "blood pack";
	}
	return f.dot;
});

// blood_pack.dm:34
rt.def("/obj/item/weapon/reagent_containers/blood/proc/update_icon", function update_icon(f: Frame) {
	let percent: Value = null;
	const subject = (percent = round(this.reagents.total_volume / this.volume * 100));
	if (rt.inRange(subject, 0, 9)) {
		this.icon_state = "empty";
	} else if (rt.inRange(subject, 10, 50)) {
		this.icon_state = "half";
	} else if (rt.inRange(subject, 51, 1e+31)) {
		this.icon_state = "full";
	}
	return f.dot;
});

rt.type(6499, "/obj/item/weapon/reagent_containers/blood/random", "/obj/item/weapon/reagent_containers/blood", {});

// blood_pack.dm:44
rt.def("/obj/item/weapon/reagent_containers/blood/random/proc/Initialize", function* Initialize(f: Frame) {
	this.blood_type = pick("A+", "A-", "B+", "B-", "O+", "O-", "L");
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// blood_pack.dm:73
rt.def("/obj/item/weapon/reagent_containers/blood/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let t: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/pen")) || rt.istype(I, T("/obj/item/toy/crayon"))) {
		t = (yield* stripped_input(user, "What would you like to label the blood pack?", this.name, null, 53));
		if (!user.canUseTopic(this)) {
			return f.dot;
		}
		if (user.get_active_held_item() != I) {
			return f.dot;
		}
		if (this.loc != user) {
			return f.dot;
		}
		if (t) {
			this.labelled = 1;
			this.name = `blood pack - ${t}`;
		} else {
			this.labelled = 0;
			this.update_pack_name();
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);
