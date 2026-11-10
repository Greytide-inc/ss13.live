// Based on /tg/station's code/game/turfs/simulated/wall/reinf_walls.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4441, "/turf/closed/wall/r_wall", "/turf/closed/wall", {
	d_state: 0,
	name: "reinforced wall",
	desc: "A huge chunk of reinforced metal used to separate rooms.",
	icon: rt.rsc("icons/turf/walls/reinforced_wall.dmi"),
	icon_state: "r_wall",
	opacity: 1,
	density: 1,
	hardness: 10,
	sheet_amount: 1,
	explosion_block: 2,
	sheet_type: rt.typePath("/obj/item/stack/sheet/plasteel"),
	girder_type: rt.typePath("/obj/structure/girder/reinforced"),
});

// reinf_walls.dm:17
rt.def("/turf/closed/wall/r_wall/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.d_state === INTACT) {
		to_chat(user, "<span class='notice'>The outer <b>grille</b> is fully intact.</span>");
	} else if (this.d_state === SUPPORT_LINES) {
		to_chat(user, "<span class='notice'>The outer <i>grille</i> has been cut, and the support lines are <b>screwed</b> securely to the outer cover.</span>");
	} else if (this.d_state === COVER) {
		to_chat(user, "<span class='notice'>The support lines have been <i>unscrewed</i>, and the metal cover is <b>welded</b> firmly in place.</span>");
	} else if (this.d_state === CUT_COVER) {
		to_chat(user, "<span class='notice'>The metal cover has been <i>sliced through</i>, and is <b>connected loosely</b> to the girder.</span>");
	} else if (this.d_state === BOLTS) {
		to_chat(user, "<span class='notice'>The outer cover has been <i>pried away</i>, and the bolts anchoring the support rods are <b>wrenched</b> in place.</span>");
	} else if (this.d_state === SUPPORT_RODS) {
		to_chat(user, "<span class='notice'>The bolts anchoring the support rods have been <i>loosened</i>, but are still <b>welded</b> firmly to the girder.</span>");
	} else if (this.d_state === SHEATH) {
		to_chat(user, "<span class='notice'>The support rods have been <i>sliced through</i>, and the outer sheath is <b>connected loosely</b> to the girder.</span>");
	}
	return f.dot;
}, false);

// reinf_walls.dm:35
rt.def("/turf/closed/wall/r_wall/proc/devastate_wall", function* devastate_wall(f: Frame) {
	yield* new_(this.sheet_type, this, this.sheet_amount);
	yield* new_(T("/obj/item/stack/sheet/metal"), this, 2);
	return f.dot;
}, true);

// reinf_walls.dm:39
rt.def("/turf/closed/wall/r_wall/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	M.changeNext_move(8);
	yield* M.do_attack_animation(this);
	if (!M.environment_smash) {
		return f.dot;
	}
	if (M.environment_smash == 3) {
		yield* this.dismantle_wall(1);
		playsound(this, rt.rsc("sound/effects/meteorimpact.ogg"), 100, 1);
	} else {
		playsound(this, rt.rsc("sound/effects/bang.ogg"), 50, 1);
		to_chat(M, "<span class='warning'>This wall is far too strong for you to destroy.</span>");
	}
	return f.dot;
}, true);

// reinf_walls.dm:51
rt.def("/turf/closed/wall/r_wall/proc/try_destroy", function* try_destroy(f: Frame, W: Value, user: Value, _T: Value) {
	let D: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/pickaxe/drill/jackhammer"))) {
		D = W;
		to_chat(user, `<span class='notice'>You begin to smash though the ${this.name}...</span>`);
		if (yield* do_after(user, 50, { target: this })) {
			if (!rt.istype(this, T("/turf/closed/wall/r_wall")) || !W) {
				return 1;
			}
			D.playDigSound();
			this.visible_message(`<span class='warning'>${user} smashes through the ${this.name} with the ${D.name}!</span>`, "<span class='italics'>You hear the grinding of metal.</span>");
			yield* this.dismantle_wall();
			return 1;
		}
	}
	return 0;
}, true);

// reinf_walls.dm:65
rt.def("/turf/closed/wall/r_wall/proc/try_decon", function* try_decon(f: Frame, W: Value, user: Value, _T: Value) {
	let WT: Value = null;
	if (this.d_state === INTACT) {
		if (rt.istype(W, T("/obj/item/weapon/wirecutters"))) {
			playsound(this, W.usesound, 100, 1);
			this.d_state = SUPPORT_LINES;
			yield* this.update_icon();
			to_chat(user, "<span class='notice'>You cut the outer grille.</span>");
			return 1;
		}
	} else if (this.d_state === SUPPORT_LINES) {
		if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
			to_chat(user, "<span class='notice'>You begin unsecuring the support lines...</span>");
			playsound(this, W.usesound, 100, 1);
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				if (!rt.istype(this, T("/turf/closed/wall/r_wall")) || !W || this.d_state != SUPPORT_LINES) {
					return 1;
				}
				this.d_state = COVER;
				yield* this.update_icon();
				to_chat(user, "<span class='notice'>You unsecure the support lines.</span>");
			}
			return 1;
		} else if (rt.istype(W, T("/obj/item/weapon/wirecutters"))) {
			playsound(this, W.usesound, 100, 1);
			this.d_state = INTACT;
			yield* this.update_icon();
			to_chat(user, "<span class='notice'>You repair the outer grille.</span>");
			return 1;
		}
	} else if (this.d_state === COVER) {
		if (rt.istype(W, T("/obj/item/weapon/weldingtool"))) {
			if (yield* (WT = W).remove_fuel(0, user)) {
				to_chat(user, "<span class='notice'>You begin slicing through the metal cover...</span>");
				playsound(this, W.usesound, 100, 1);
				if (yield* do_after(user, 60 * W.toolspeed, { target: this })) {
					if (!rt.istype(this, T("/turf/closed/wall/r_wall")) || !WT || !WT.isOn() || this.d_state != COVER) {
						return 1;
					}
					this.d_state = CUT_COVER;
					yield* this.update_icon();
					to_chat(user, "<span class='notice'>You press firmly on the cover, dislodging it.</span>");
				}
			}
			return 1;
		}
		if (rt.istype(W, T("/obj/item/weapon/gun/energy/plasmacutter"))) {
			to_chat(user, "<span class='notice'>You begin slicing through the metal cover...</span>");
			playsound(this, rt.rsc("sound/items/welder.ogg"), 100, 1);
			if (yield* do_after(user, 60 * W.toolspeed, { target: this })) {
				if (!rt.istype(this, T("/turf/closed/wall/r_wall")) || !W || this.d_state != COVER) {
					return 1;
				}
				this.d_state = CUT_COVER;
				yield* this.update_icon();
				to_chat(user, "<span class='notice'>You press firmly on the cover, dislodging it.</span>");
			}
			return 1;
		}
		if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
			to_chat(user, "<span class='notice'>You begin securing the support lines...</span>");
			playsound(this, W.usesound, 100, 1);
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				if (!rt.istype(this, T("/turf/closed/wall/r_wall")) || !W || this.d_state != COVER) {
					return 1;
				}
				this.d_state = SUPPORT_LINES;
				yield* this.update_icon();
				to_chat(user, "<span class='notice'>The support lines have been secured.</span>");
			}
			return 1;
		}
	} else if (this.d_state === CUT_COVER) {
		if (rt.istype(W, T("/obj/item/weapon/crowbar"))) {
			to_chat(user, "<span class='notice'>You struggle to pry off the cover...</span>");
			playsound(this, W.usesound, 100, 1);
			if (yield* do_after(user, 100 * W.toolspeed, { target: this })) {
				if (!rt.istype(this, T("/turf/closed/wall/r_wall")) || !W || this.d_state != CUT_COVER) {
					return 1;
				}
				this.d_state = BOLTS;
				yield* this.update_icon();
				to_chat(user, "<span class='notice'>You pry off the cover.</span>");
			}
			return 1;
		}
		if (rt.istype(W, T("/obj/item/weapon/weldingtool"))) {
			if (yield* (WT = W).remove_fuel(0, user)) {
				to_chat(user, "<span class='notice'>You begin welding the metal cover back to the frame...</span>");
				playsound(this, WT.usesound, 100, 1);
				if (yield* do_after(user, 60 * WT.toolspeed, { target: this })) {
					if (!rt.istype(this, T("/turf/closed/wall/r_wall")) || !WT || !WT.isOn() || this.d_state != CUT_COVER) {
						return 1;
					}
					this.d_state = COVER;
					yield* this.update_icon();
					to_chat(user, "<span class='notice'>The metal cover has been welded securely to the frame.</span>");
				}
			}
			return 1;
		}
	} else if (this.d_state === BOLTS) {
		if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
			to_chat(user, "<span class='notice'>You start loosening the anchoring bolts which secure the support rods to their frame...</span>");
			playsound(this, W.usesound, 100, 1);
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				if (!rt.istype(this, T("/turf/closed/wall/r_wall")) || !W || this.d_state != BOLTS) {
					return 1;
				}
				this.d_state = SUPPORT_RODS;
				yield* this.update_icon();
				to_chat(user, "<span class='notice'>You remove the bolts anchoring the support rods.</span>");
			}
			return 1;
		}
		if (rt.istype(W, T("/obj/item/weapon/crowbar"))) {
			to_chat(user, "<span class='notice'>You start to pry the cover back into place...</span>");
			playsound(this, W.usesound, 100, 1);
			if (yield* do_after(user, 20 * W.toolspeed, { target: this })) {
				if (!rt.istype(this, T("/turf/closed/wall/r_wall")) || !W || this.d_state != BOLTS) {
					return 1;
				}
				this.d_state = CUT_COVER;
				yield* this.update_icon();
				to_chat(user, "<span class='notice'>The metal cover has been pried back into place.</span>");
			}
			return 1;
		}
	} else if (this.d_state === SUPPORT_RODS) {
		if (rt.istype(W, T("/obj/item/weapon/weldingtool"))) {
			if (yield* (WT = W).remove_fuel(0, user)) {
				to_chat(user, "<span class='notice'>You begin slicing through the support rods...</span>");
				playsound(this, W.usesound, 100, 1);
				if (yield* do_after(user, 100 * W.toolspeed, { target: this })) {
					if (!rt.istype(this, T("/turf/closed/wall/r_wall")) || !WT || !WT.isOn() || this.d_state != SUPPORT_RODS) {
						return 1;
					}
					this.d_state = SHEATH;
					yield* this.update_icon();
					to_chat(user, "<span class='notice'>You slice through the support rods.</span>");
				}
			}
			return 1;
		}
		if (rt.istype(W, T("/obj/item/weapon/gun/energy/plasmacutter"))) {
			to_chat(user, "<span class='notice'>You begin slicing through the support rods...</span>");
			playsound(this, rt.rsc("sound/items/welder.ogg"), 100, 1);
			if (yield* do_after(user, 100 * W.toolspeed, { target: this })) {
				if (!rt.istype(this, T("/turf/closed/wall/r_wall")) || !W || this.d_state != SUPPORT_RODS) {
					return 1;
				}
				this.d_state = SHEATH;
				yield* this.update_icon();
				to_chat(user, "<span class='notice'>You slice through the support rods.</span>");
			}
			return 1;
		}
		if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
			to_chat(user, "<span class='notice'>You start tightening the bolts which secure the support rods to their frame...</span>");
			playsound(this, W.usesound, 100, 1);
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				if (!rt.istype(this, T("/turf/closed/wall/r_wall")) || !W || this.d_state != SUPPORT_RODS) {
					return 1;
				}
				this.d_state = BOLTS;
				yield* this.update_icon();
				to_chat(user, "<span class='notice'>You tighten the bolts anchoring the support rods.</span>");
			}
			return 1;
		}
	} else if (this.d_state === SHEATH) {
		if (rt.istype(W, T("/obj/item/weapon/crowbar"))) {
			to_chat(user, "<span class='notice'>You struggle to pry off the outer sheath...</span>");
			playsound(this, W.usesound, 100, 1);
			if (yield* do_after(user, 100 * W.toolspeed, { target: this })) {
				if (!rt.istype(this, T("/turf/closed/wall/r_wall")) || !W || this.d_state != SHEATH) {
					return 1;
				}
				to_chat(user, "<span class='notice'>You pry off the outer sheath.</span>");
				yield* this.dismantle_wall();
			}
			return 1;
		}
		if (rt.istype(W, T("/obj/item/weapon/weldingtool"))) {
			if (yield* (WT = W).remove_fuel(0, user)) {
				to_chat(user, "<span class='notice'>You begin welding the support rods back together...</span>");
				playsound(this, WT.usesound, 100, 1);
				if (yield* do_after(user, 100 * WT.toolspeed, { target: this })) {
					if (!rt.istype(this, T("/turf/closed/wall/r_wall")) || !WT || !WT.isOn() || this.d_state != SHEATH) {
						return 1;
					}
					this.d_state = SUPPORT_RODS;
					yield* this.update_icon();
					to_chat(user, "<span class='notice'>You weld the support rods back together.</span>");
				}
				return 1;
			}
		}
	}
	return 0;
}, true);

// reinf_walls.dm:239
rt.def("/turf/closed/wall/r_wall/proc/update_icon", function update_icon(f: Frame) {
	if (this.d_state != INTACT) {
		this.smooth = SMOOTH_FALSE;
		this.clear_smooth_overlays();
		this.icon_state = `r_wall-${this.d_state}`;
	} else {
		this.smooth = SMOOTH_TRUE;
		queue_smooth_neighbors(this);
		queue_smooth(this);
		this.icon_state = "r_wall";
	}
	return f.dot;
});

// reinf_walls.dm:250
rt.def("/turf/closed/wall/r_wall/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	if (!(current_size >= STAGE_FIVE)) return f.dot;
	if (!prob(30)) return f.dot;
	yield* this.dismantle_wall();
	return f.dot;
}, true);

// reinf_walls.dm:255
rt.def("/turf/closed/wall/r_wall/proc/rcd_vals", function rcd_vals(f: Frame, user: Value, the_rcd: Value) {
	if (!the_rcd.canRturf) {
		return 0;
	}
	return parent_proc();
}, false);

// reinf_walls.dm:260
rt.def("/turf/closed/wall/r_wall/proc/rcd_act", function* rcd_act(f: Frame, user: Value, the_rcd: Value, passed_mode: Value) {
	if (!the_rcd.canRturf) {
		return 0;
	}
	return (yield* parent_proc());
}, true);
