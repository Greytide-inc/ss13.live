// Based on /tg/station's code/modules/surgery/bodyparts/head.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10198, "/obj/item/bodypart/head", "/obj/item/bodypart", {
	brainmob: null,
	brain: null,
	real_name: "",
	hair_color: "000",
	hair_style: "Bald",
	hair_alpha: 255,
	facial_hair_color: "000",
	facial_hair_style: "Shaved",
	eyes: null,
	lip_style: null,
	lip_color: "white",
	max_damage: 200,
	body_zone: "head",
	body_part: 1,
	w_class: 4,
	slowdown: 1,
	throw_range: 2,
	px_x: 0,
	px_y: -8,
	name: "head",
	desc: "Didn't make sense not to live for fun, your brain gets smart but your head gets dumb.",
	icon: rt.rsc("icons/mob/human_parts.dmi"),
	icon_state: "default_human_head",
});

// head.dm:35
rt.def("/obj/item/bodypart/head/proc/drop_organs", function* drop_organs(f: Frame, user: Value) {
	let I: Value = null, AP: Value = null;
	let _T: Value = rt.getStep(f, this, 0);
	if (this.status != BODYPART_ROBOTIC) {
		playsound(_T, rt.rsc("sound/misc/splort.ogg"), 50, 1, -1);
	}
	for (I of each(this, T("/obj/item"))) {
		if (I == this.brain) {
			if (user) {
				user.visible_message(`<span class='warning'>${user} saws ${this} open and pulls out a brain!</span>`, `<span class='notice'>You saw ${this} open and pull out a brain.</span>`);
			}
			if (this.brainmob) {
				this.brainmob.container = null;
				this.brainmob.loc = this.brain;
				this.brain.brainmob = this.brainmob;
				this.brainmob = null;
			}
			this.brain.loc = _T;
			this.brain = null;
			this.update_icon_dropped();
		} else {
			if (rt.istype(I, T("/obj/item/weapon/reagent_containers/pill"))) {
				AP = null;
				for (AP of each(I.actions, T("/datum/action/item_action/hands_free/activate_pill"))) {
					yield* qdel(AP);
				}
			}
			yield* I.forceMove(_T);
		}
	}
	return f.dot;
}, true);

// head.dm:59
rt.def("/obj/item/bodypart/head/proc/update_limb", function update_limb(f: Frame, dropping_limb: Value, source: Value) {
	let C: Value = null, H: Value = null, S: Value = null;
	if (source) {
		C = source;
	} else {
		C = this.owner;
	}
	this.real_name = C.real_name;
	if (rt.bitAnd(C.disabilities, 64)) {
		this.real_name = "Unknown";
		this.hair_style = "Bald";
		this.facial_hair_style = "Shaved";
		this.lip_style = null;
	} else if (!this.animal_origin) {
		H = C;
		S = H.dna.species;
		if (H.facial_hair_style && rt.isIn(f, 3, S.species_traits)) {
			this.facial_hair_style = H.facial_hair_style;
			if (S.hair_color) {
				if (S.hair_color == "mutcolor") {
					this.facial_hair_color = rt.index(H.dna.features, "mcolor");
				} else {
					this.facial_hair_color = S.hair_color;
				}
			} else {
				this.facial_hair_color = H.facial_hair_color;
			}
			this.hair_alpha = S.hair_alpha;
		} else {
			this.facial_hair_style = "Shaved";
			this.facial_hair_color = "000";
			this.hair_alpha = 255;
		}
		if (H.hair_style && rt.isIn(f, 2, S.species_traits)) {
			this.hair_style = H.hair_style;
			if (S.hair_color) {
				if (S.hair_color == "mutcolor") {
					this.hair_color = rt.index(H.dna.features, "mcolor");
				} else {
					this.hair_color = S.hair_color;
				}
			} else {
				this.hair_color = H.hair_color;
			}
			this.hair_alpha = S.hair_alpha;
		} else {
			this.hair_style = "Bald";
			this.hair_color = "000";
			this.hair_alpha = rt.initial(f, this, "hair_alpha");
		}
		if (H.lip_style && rt.isIn(f, 5, S.species_traits)) {
			this.lip_style = H.lip_style;
			this.lip_color = H.lip_color;
		} else {
			this.lip_style = null;
			this.lip_color = "white";
		}
	}
	parent_proc();
	return f.dot;
}, false);

// head.dm:114
rt.def("/obj/item/bodypart/head/proc/update_icon_dropped", function update_icon_dropped(f: Frame) {
	let standing: Value = null, I: Value = null;
	if (!rt.len(f, (standing = this.get_limb_icon(1)))) {
		this.icon_state = rt.initial(f, this, "icon_state");
		return f.dot;
	}
	for (I of each(standing, T("/image"))) {
		I.pixel_x = this.px_x;
		I.pixel_y = this.px_y;
	}
	this.add_overlay(standing);
	return f.dot;
});

// head.dm:124
rt.def("/obj/item/bodypart/head/proc/get_limb_icon", function get_limb_icon(f: Frame, dropped: Value) {
	let S: Value = null, facial_overlay: Value = null, hair_overlay: Value = null, lips_overlay: Value = null, eyes_overlay: Value = null;
	this.cut_overlays();
	f.dot = parent_proc();
	if (!dropped) return f.dot;
	if (this.status != BODYPART_ROBOTIC) {
		if (this.facial_hair_style) {
			if (S = rt.index(GLOB.facial_hair_styles_list, this.facial_hair_style)) {
				(facial_overlay = image(S.icon, `${S.icon_state}`, -8, 2)).color = "#" + this.facial_hair_color;
				facial_overlay.alpha = this.hair_alpha;
				f.dot += facial_overlay;
			}
		}
		f.dot += (hair_overlay = image({ layer: -8, dir: 2 }));
		if (!this.brain) {
			if (this.animal_origin == "alien") {
				hair_overlay.icon = rt.rsc("icons/mob/animal_parts.dmi");
				hair_overlay.icon_state = "debrained_alien";
			} else if (this.animal_origin == "larva") {
				hair_overlay.icon = rt.rsc("icons/mob/animal_parts.dmi");
				hair_overlay.icon_state = "debrained_larva";
			} else if (!rt.isIn(f, NOBLOOD, this.species_flags_list)) {
				hair_overlay.icon = rt.rsc("icons/mob/human_face.dmi");
				hair_overlay.icon_state = "debrained";
			}
		} else if (this.hair_style) {
			if (S = rt.index(GLOB.hair_styles_list, this.hair_style)) {
				hair_overlay.icon = this.icon;
				hair_overlay.icon_state = `${S.icon_state}`;
				hair_overlay.color = "#" + this.hair_color;
				hair_overlay.alpha = this.hair_alpha;
			}
		}
	}
	if (this.lip_style) {
		(lips_overlay = image(rt.rsc("icons/mob/human_face.dmi"), `lips_${this.lip_style}`, -22, 2)).color = this.lip_color;
		f.dot += lips_overlay;
	}
	f.dot += (eyes_overlay = image(rt.rsc("icons/mob/human_face.dmi"), "eyes", -22, 2));
	if (!this.eyes) {
		eyes_overlay.icon_state = "eyes_missing";
	} else {
		if (!this.eyes.eye_color) return f.dot;
		eyes_overlay.color = "#" + this.eyes.eye_color;
	}
	return f.dot;
}, false);
