// Based on /tg/station's code/game/objects/structures/crates_lockers/crates.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12253, "/obj/structure/closet/crate", "/obj/structure/closet", {
	manifest: null,
	can_weld_shut: 0,
	horizontal: 1,
	allow_objects: 1,
	allow_dense: 1,
	dense_when_open: 1,
	delivery_icon: "deliverycrate",
	name: "crate",
	desc: "A rectangular steel crate.",
	icon: rt.rsc("icons/obj/crates.dmi"),
	icon_state: "crate",
	req_access: null,
	climbable: 1,
	climb_time: 10,
	climb_stun: 0,
});

// crates.dm:19
rt.def("/obj/structure/closet/crate/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.update_icon();
	return f.dot;
}, true);

// crates.dm:23
rt.def("/obj/structure/closet/crate/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	let locatedcrate: Value = null;
	height ??= 0;
	if (!rt.istype(mover, T("/obj/structure/closet"))) {
		if (locatedcrate = rt.locateIn(f, T("/obj/structure/closet/crate"), rt.getStep(f, mover, 0))) {
			if (this.opened) {
				return 1;
			}
			if (!locatedcrate.opened) {
				return 1;
			}
		}
	}
	return (!this.density ? 1 : 0);
});

// crates.dm:33
rt.def("/obj/structure/closet/crate/proc/update_icon", function update_icon(f: Frame) {
	let $0: any = rt.initial(f, this, "icon_state");
	this.icon_state = `${$0}${this.opened ? "open" : ""}`;
	this.cut_overlays();
	if (!this.manifest) return f.dot;
	this.add_overlay("manifest");
	return f.dot;
});

// crates.dm:41
rt.def("/obj/structure/closet/crate/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.manifest) {
		yield* this.tear_manifest(user);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// crates.dm:46
rt.def("/obj/structure/closet/crate/proc/open", function* open(f: Frame, user: Value) {
	f.dot = (yield* parent_proc());
	if (!(f.dot && this.manifest)) return f.dot;
	to_chat(user, `<span class='notice'>The manifest is torn off ${this}.</span>`);
	playsound(this, rt.rsc("sound/items/poster_ripped.ogg"), 75, 1);
	yield* this.manifest.forceMove(rt.getStep(f, this, 0));
	this.manifest = null;
	yield* this.update_icon();
	return f.dot;
}, true);

// crates.dm:55
rt.def("/obj/structure/closet/crate/proc/tear_manifest", function* tear_manifest(f: Frame, user: Value) {
	to_chat(user, `<span class='notice'>You tear the manifest off of ${this}.</span>`);
	playsound(this, rt.rsc("sound/items/poster_ripped.ogg"), 75, 1);
	yield* this.manifest.forceMove(this.loc);
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		yield* user.put_in_hands(this.manifest);
	}
	this.manifest = null;
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(12258, "/obj/structure/closet/crate/freezer/blood", "/obj/structure/closet/crate/freezer", {
	name: "blood freezer",
	desc: "A freezer containing packs of blood.",
});

// crates.dm:89
rt.def("/obj/structure/closet/crate/freezer/blood/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.dot = (yield* parent_proc());
	yield* new_(T("/obj/item/weapon/reagent_containers/blood/empty"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/blood/empty"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/blood/AMinus"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/blood/BMinus"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/blood/BPlus"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/blood/OMinus"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/blood/OPlus"), this);
	yield* new_(T("/obj/item/weapon/reagent_containers/blood/lizard"), this);
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/blood/random"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12259, "/obj/structure/closet/crate/freezer/surplus_limbs", "/obj/structure/closet/crate/freezer", {
	name: "surplus prosthetic limbs",
	desc: "A crate containing an assortment of cheap prosthetic limbs.",
});

// crates.dm:106
rt.def("/obj/structure/closet/crate/freezer/surplus_limbs/proc/PopulateContents", function* PopulateContents(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* new_(T("/obj/item/bodypart/l_arm/robot/surplus"), this);
	yield* new_(T("/obj/item/bodypart/l_arm/robot/surplus"), this);
	yield* new_(T("/obj/item/bodypart/r_arm/robot/surplus"), this);
	yield* new_(T("/obj/item/bodypart/r_arm/robot/surplus"), this);
	yield* new_(T("/obj/item/bodypart/l_leg/robot/surplus"), this);
	yield* new_(T("/obj/item/bodypart/l_leg/robot/surplus"), this);
	yield* new_(T("/obj/item/bodypart/r_leg/robot/surplus"), this);
	yield* new_(T("/obj/item/bodypart/r_leg/robot/surplus"), this);
	return f.dot;
}, true);

rt.type(12264, "/obj/structure/closet/crate/rcd", "/obj/structure/closet/crate", {
	desc: "A crate for the storage of an RCD.",
	name: "１RCD crate",
	icon_state: "engi_crate",
});

// crates.dm:139
rt.def("/obj/structure/closet/crate/rcd/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	rt.forRange(f, 0, 1, 4, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/rcd_ammo"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/weapon/construction/rcd"), this);
	return f.dot;
}, true);
