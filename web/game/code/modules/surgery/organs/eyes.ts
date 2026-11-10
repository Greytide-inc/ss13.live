// Based on /tg/station's code/modules/surgery/organs/eyes.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(9476, "/obj/item/organ/eyes", "/obj/item/organ", {
	sight_flags: 0,
	see_in_dark: 2,
	eye_damage: 0,
	tint: 0,
	eye_color: "",
	old_eye_color: "fff",
	flash_protect: 0,
	see_invisible: 25,
	lighting_alpha: null,
	name: "eyes",
	icon_state: "eyeballs",
	desc: "I see you!",
	zone: "eyes",
	slot: "eye_sight",
	gender: "plural",
});

// eyes.dm:20
rt.def("/obj/item/organ/eyes/proc/Insert", function* Insert(f: Frame) {
	let HMN: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (rt.istype(this.owner, T("/mob/living/carbon/human"))) {
		this.old_eye_color = (HMN = this.owner).eye_color;
		if (this.eye_color) {
			HMN.eye_color = this.eye_color;
			yield* HMN.regenerate_icons();
		} else {
			this.eye_color = HMN.eye_color;
		}
	}
	yield* f.args[0].update_tint();
	yield* this.owner.update_sight();
	return f.dot;
}, true, { args: ["M", "special"] });

// eyes.dm:33
rt.def("/obj/item/organ/eyes/proc/Remove", function* Remove(f: Frame) {
	let HMN: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (rt.istype(f.args[0], T("/mob/living/carbon/human")) && this.eye_color) {
		(HMN = f.args[0]).eye_color = this.old_eye_color;
		yield* HMN.regenerate_icons();
	}
	yield* f.args[0].update_tint();
	yield* f.args[0].update_sight();
	return f.dot;
}, true, { args: ["M", "special"] });

rt.type(9477, "/obj/item/organ/eyes/night_vision", "/obj/item/organ/eyes", {
	night_vision: 1,
	see_in_dark: 8,
	lighting_alpha: 192,
	name: "shadow eyes",
	desc: "A spooky set of eyes that can see in the dark.",
	actions_types: null,
});

// eyes.dm:46
rt.def("/obj/item/organ/eyes/night_vision/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/organ_action/use"));
	return f.dot;
});

// eyes.dm:50
rt.def("/obj/item/organ/eyes/night_vision/proc/ui_action_click", function* ui_action_click(f: Frame) {
	if (this.lighting_alpha === LIGHTING_PLANE_ALPHA_VISIBLE) {
		this.lighting_alpha = LIGHTING_PLANE_ALPHA_MOSTLY_VISIBLE;
	} else if (this.lighting_alpha === LIGHTING_PLANE_ALPHA_MOSTLY_VISIBLE) {
		this.lighting_alpha = LIGHTING_PLANE_ALPHA_MOSTLY_INVISIBLE;
	} else if (this.lighting_alpha === LIGHTING_PLANE_ALPHA_MOSTLY_INVISIBLE) {
		this.lighting_alpha = LIGHTING_PLANE_ALPHA_INVISIBLE;
	} else {
		this.lighting_alpha = LIGHTING_PLANE_ALPHA_VISIBLE;
	}
	yield* this.owner.update_sight();
	return f.dot;
}, true);

rt.type(9480, "/obj/item/organ/eyes/robotic", "/obj/item/organ/eyes", {
	name: "robotic eyes",
	icon_state: "cybernetic_eyeballs",
	desc: "Your vision is augmented.",
	status: 2,
});

// eyes.dm:81
rt.def("/obj/item/organ/eyes/robotic/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (!this.owner) {
		return f.dot;
	}
	if (severity > 1) {
		if (prob(10 * severity)) {
			return f.dot;
		}
	}
	to_chat(this.owner, "<span class='warning'>Static obfuscates your vision!</span>");
	yield* this.owner.flash_act({ visual: 1 });
	return f.dot;
}, true);

rt.type(9483, "/obj/item/organ/eyes/robotic/flashlight", "/obj/item/organ/eyes/robotic", {
	eye: null,
	eye_color: "fee5a3",
	flash_protect: 2,
	tint: 1e+31,
	name: "flashlight eyes",
	desc: "It's two flashlights rigged together with some wire. Why would you put these in someones head?",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "flashlight_eyes",
});

// eyes.dm:120
rt.def("/obj/item/organ/eyes/robotic/flashlight/proc/Insert", function* Insert(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (!this.eye) {
		this.eye = (yield* new_(T("/obj/item/device/flashlight/eyelight")));
	}
	this.eye.on = 1;
	yield* this.eye.forceMove(f.args[0]);
	this.eye.update_brightness(f.args[0]);
	return f.dot;
}, true, { args: ["M", "special"] });

// eyes.dm:129
rt.def("/obj/item/organ/eyes/robotic/flashlight/proc/Remove", function* Remove(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	this.eye.on = 0;
	this.eye.update_brightness(f.args[0]);
	yield* this.eye.forceMove(this);
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "special"] });

rt.type(9485, "/obj/item/organ/eyes/robotic/glow", "/obj/item/organ/eyes/robotic", {
	current_color_string: "#ffffff",
	active: 0,
	max_light_beam_distance: 5,
	light_beam_distance: 5,
	light_object_range: 1,
	light_object_power: 2,
	eye_lighting: null,
	on_mob: null,
	mob_overlay: null,
	eye_color: "000",
	name: "High Luminosity Eyes",
	desc: "Special glowing eyes, used by snowflakes who want to be special.",
	origin_tech: "materials=3;biotech=3;engineering=3;magnets=4",
	actions_types: null,
});

// eyes.dm:151
rt.def("/obj/item/organ/eyes/robotic/glow/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/organ_action/use"), T("/datum/action/item_action/organ_action/toggle"));
	return f.dot;
});

// eyes.dm:163
rt.def("/obj/item/organ/eyes/robotic/glow/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.mob_overlay = image(rt.rsc("icons/mob/human_face.dmi"), "eyes_glow_gs");
	return f.dot;
}, true);

// eyes.dm:167
rt.def("/obj/item/organ/eyes/robotic/glow/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.terminate_effects();
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// eyes.dm:171
rt.def("/obj/item/organ/eyes/robotic/glow/proc/Remove", function* Remove(f: Frame) {
	yield* this.terminate_effects();
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// eyes.dm:175
rt.def("/obj/item/organ/eyes/robotic/glow/proc/terminate_effects", function* terminate_effects(f: Frame) {
	if (this.owner && this.active) {
		yield* this.deactivate();
	}
	this.active = 0;
	yield* this.clear_visuals(1);
	this.isprocessing = 0;
	GLOB.SSfastprocess.processing -= this;
	return f.dot;
}, true);

// eyes.dm:182
rt.def("/obj/item/organ/eyes/robotic/glow/proc/ui_action_click", function* ui_action_click(f: Frame, owner: Value, action: Value) {
	if (rt.istype(action, T("/datum/action/item_action/organ_action/toggle"))) {
		yield* this.toggle_active();
	} else {
		if (!rt.istype(action, T("/datum/action/item_action/organ_action/use"))) return f.dot;
		yield* this.prompt_for_controls(owner);
	}
	return f.dot;
}, true);

// eyes.dm:189
rt.def("/obj/item/organ/eyes/robotic/glow/proc/toggle_active", function* toggle_active(f: Frame) {
	if (this.active) {
		yield* this.deactivate();
	} else {
		yield* this.activate();
	}
	return f.dot;
}, true);

// eyes.dm:194
rt.def("/obj/item/organ/eyes/robotic/glow/proc/prompt_for_controls", function* prompt_for_controls(f: Frame, user: Value) {
	let C: Value = null;
	if (!(C = (yield* g.op(f, "Prompt", [257], ["#ffffff", "Select color", "Select Color", this.owner, null]))) || !this || this.gc_destroyed || !user || user.gc_destroyed || !this.owner || this.owner.gc_destroyed || this.owner != user) {
		return f.dot;
	}
	let range: Value = (yield* g.op(f, "Prompt", [33], [0, "Range Select", `Enter range (0 - ${this.max_light_beam_distance})`, user, null]));
	yield* this.set_distance(max(0, min(range, this.max_light_beam_distance)));
	yield* this.assume_rgb(C);
	return f.dot;
}, true);

// eyes.dm:203
rt.def("/obj/item/organ/eyes/robotic/glow/proc/assume_rgb", function* assume_rgb(f: Frame, newcolor: Value) {
	this.current_color_string = newcolor;
	this.eye_color = `${copytext(this.current_color_string, 2, 3)}${copytext(this.current_color_string, 4, 5)}${copytext(this.current_color_string, 6, 7)}`;
	this.sync_light_effects();
	this.cycle_mob_overlay();
	if (!(!(!this.owner || this.owner.gc_destroyed) && rt.istype(this.owner, T("/mob/living/carbon/human")))) return f.dot;
	yield* this.owner.dna.species.handle_body(this.owner);
	return f.dot;
}, true);

// eyes.dm:211
rt.def("/obj/item/organ/eyes/robotic/glow/proc/cycle_mob_overlay", function cycle_mob_overlay(f: Frame) {
	this.remove_mob_overlay();
	this.mob_overlay.color = this.current_color_string;
	this.add_mob_overlay();
	return f.dot;
});

// eyes.dm:216
rt.def("/obj/item/organ/eyes/robotic/glow/proc/add_mob_overlay", function add_mob_overlay(f: Frame) {
	if (!this.owner || this.owner.gc_destroyed) return f.dot;
	this.owner.add_overlay(this.mob_overlay);
	return f.dot;
});

// eyes.dm:220
rt.def("/obj/item/organ/eyes/robotic/glow/proc/remove_mob_overlay", function remove_mob_overlay(f: Frame) {
	if (!this.owner || this.owner.gc_destroyed) return f.dot;
	this.owner.cut_overlay(this.mob_overlay);
	return f.dot;
});

// eyes.dm:225
rt.def("/obj/item/organ/eyes/robotic/glow/proc/emp_act", function* emp_act(f: Frame) {
	if (!this.active) return f.dot;
	yield* this.deactivate({ silent: 1 });
	return f.dot;
}, true);

// eyes.dm:228
rt.def("/obj/item/organ/eyes/robotic/glow/proc/on_mob_move", function* on_mob_move(f: Frame) {
	if (!this.owner || this.owner.gc_destroyed || !this.active) {
		return f.dot;
	}
	yield* this.update_visuals();
	return f.dot;
}, true);

// eyes.dm:233
rt.def("/obj/item/organ/eyes/robotic/glow/proc/on_mob_turn", function* on_mob_turn(f: Frame) {
	if (!this.owner || this.owner.gc_destroyed || !this.active) {
		return f.dot;
	}
	yield* this.update_visuals();
	return f.dot;
}, true);

// eyes.dm:238
rt.def("/obj/item/organ/eyes/robotic/glow/proc/activate", function* activate(f: Frame, silent: Value) {
	silent ??= 0;
	yield* this.start_visuals();
	if (!silent) {
		to_chat(this.owner, `<span class='warning'>Your ${this} clicks and makes a whining noise, before shooting out a beam of light!</span>`);
	}
	this.active = 1;
	this.cycle_mob_overlay();
	return f.dot;
}, true);

// eyes.dm:245
rt.def("/obj/item/organ/eyes/robotic/glow/proc/deactivate", function* deactivate(f: Frame, silent: Value) {
	silent ??= 0;
	yield* this.clear_visuals();
	if (!silent) {
		to_chat(this.owner, `<span class='warning'>Your ${this} shuts off!</span>`);
	}
	this.active = 0;
	this.remove_mob_overlay();
	return f.dot;
}, true);

// eyes.dm:252
rt.def("/obj/item/organ/eyes/robotic/glow/proc/update_visuals", function* update_visuals(f: Frame) {
	let i: Value = null, L: Value = null;
	let $0: any, $e: any;
	if (rt.length(this.eye_lighting) < this.light_beam_distance || !this.on_mob) {
		yield* this.regenerate_light_effects();
	}
	let scanfrom: Value = rt.getStep(f, this.owner, 0);
	let scandir: Value = this.owner.dir;
	if (!rt.istype(scanfrom, T("/turf"))) {
		yield* this.clear_visuals();
	}
	let scanning: Value = scanfrom;
	let stop: Value = 0;
	yield* this.on_mob.forceMove(scanning);
	rt.forRange(f, 0, 1, this.light_beam_distance, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if ((scanning = rt.getStep(f, scanning, scandir)).opacity || scanning.has_opaque_atom) {
			stop = 1;
		}
		if (this.eye_lighting) {
			if (isnum(i)) {
				if (i > 0 && i <= rt.len(f, this.eye_lighting)) {
					$0 = rt.index(this.eye_lighting, i);
				} else {
					$0 = null;
				}
			} else {
				$0 = rt.index(this.eye_lighting, i);
			}
		} else {
			$0 = null;
		}
		L = $0;
		if (stop) {
			yield* L.forceMove(this);
		} else {
			yield* L.forceMove(scanning);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// eyes.dm:273
rt.def("/obj/item/organ/eyes/robotic/glow/proc/clear_visuals", function* clear_visuals(f: Frame, delete_everything: Value) {
	let I: Value = null, i: Value = null, L: Value = null;
	delete_everything ??= 0;
	if (delete_everything) {
		if (this.eye_lighting) {
			for (I of each(this.eye_lighting)) {
				yield* qdel(I);
			}
			this.eye_lighting.Cut();
		}
		yield* qdel(this.on_mob);
		this.on_mob = null;
	} else {
		for (i of each(this.eye_lighting)) {
			yield* (L = i).forceMove(this);
		}
		if (!this.on_mob || this.on_mob.gc_destroyed) return f.dot;
		yield* this.on_mob.forceMove(this);
	}
	return f.dot;
}, true);

// eyes.dm:283
rt.def("/obj/item/organ/eyes/robotic/glow/proc/start_visuals", function* start_visuals(f: Frame) {
	if (!rt.istype(this.eye_lighting, T("/list"))) {
		yield* this.regenerate_light_effects();
	}
	if (rt.len(f, this.eye_lighting) < this.light_beam_distance || !this.on_mob) {
		yield* this.regenerate_light_effects();
	}
	this.sync_light_effects();
	yield* this.update_visuals();
	return f.dot;
}, true);

// eyes.dm:291
rt.def("/obj/item/organ/eyes/robotic/glow/proc/set_distance", function* set_distance(f: Frame, dist: Value) {
	this.light_beam_distance = dist;
	yield* this.regenerate_light_effects();
	return f.dot;
}, true);

// eyes.dm:295
rt.def("/obj/item/organ/eyes/robotic/glow/proc/regenerate_light_effects", function* regenerate_light_effects(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* this.clear_visuals(1);
	this.on_mob = (yield* new_(T("/obj/effect/abstract/eye_lighting"), this));
	rt.forRange(f, 0, 1, this.light_beam_distance, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!this.eye_lighting) {
			this.eye_lighting = list();
		}
		this.eye_lighting += (yield* new_(T("/obj/effect/abstract/eye_lighting"), this));
	}
	rt.endFor(f, 0);
	this.sync_light_effects();
	return f.dot;
}, true);

// eyes.dm:302
rt.def("/obj/item/organ/eyes/robotic/glow/proc/sync_light_effects", function sync_light_effects(f: Frame) {
	let I: Value = null, L: Value = null;
	for (I of each(this.eye_lighting)) {
		(L = I).set_light(this.light_object_range, this.light_object_power, this.current_color_string);
	}
	if (!this.on_mob) return f.dot;
	this.on_mob.set_light(1, 1, this.current_color_string);
	return f.dot;
});

rt.type(11809, "/obj/effect/abstract/eye_lighting", "/obj/effect/abstract", {
	parent: null,
});

// eyes.dm:312
rt.def("/obj/effect/abstract/eye_lighting/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	this.parent = this.loc;
	if (rt.istype(this.parent, T("/obj/item/organ/eyes/robotic/glow"))) return f.dot;
	return INITIALIZE_HINT_QDEL;
});
