// Based on /tg/station's code/modules/ruins/objects_and_mobs/necropolis_gate.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12990, "/obj/structure/necropolis_gate", "/obj/structure", {
	open: 0,
	changing_openness: 0,
	locked: 0,
	sight_blocker: null,
	sight_blocker_distance: 1,
	anchored: 1,
	light_range: 8,
	light_color: "#C48A18",
	name: "necropolis gate",
	desc: "A massive stone gateway.",
	icon: rt.rsc("icons/effects/96x96.dmi"),
	icon_state: "gate_full",
	appearance_flags: 0,
	layer: 2.8,
	density: 1,
	pixel_x: -32,
	pixel_y: -32,
	resistance_flags: 115,
}, { global: { top_overlay: 805, door_overlay: 806, dais_overlay: 807 } });

// necropolis_gate.dm:26
rt.def("/obj/structure/necropolis_gate/proc/Initialize", function* Initialize(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.dot = (yield* parent_proc());
	let sight_blocker_turf: Value = rt.getStep(f, this, 0);
	if (this.sight_blocker_distance) {
		rt.forRange(f, 0, 1, this.sight_blocker_distance, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (!sight_blocker_turf) {
				break;
			}
			sight_blocker_turf = rt.getStep(f, sight_blocker_turf, 1);
		}
		rt.endFor(f, 0);
	}
	if (sight_blocker_turf) {
		this.sight_blocker = (yield* new_(T("/obj/structure/opacity_blocker"), sight_blocker_turf));
	}
	this.icon_state = "gate_bottom";
	GLOB.top_overlay = mutable_appearance(rt.rsc("icons/effects/96x96.dmi"), "gate_top");
	GLOB.top_overlay.layer = EDGED_TURF_LAYER;
	this.add_overlay(GLOB.top_overlay);
	GLOB.door_overlay = mutable_appearance(rt.rsc("icons/effects/96x96.dmi"), "door");
	GLOB.door_overlay.layer = EDGED_TURF_LAYER;
	this.add_overlay(GLOB.door_overlay);
	GLOB.dais_overlay = mutable_appearance(rt.rsc("icons/effects/96x96.dmi"), "gate_dais");
	GLOB.dais_overlay.layer = CLOSED_TURF_LAYER;
	this.add_overlay(GLOB.dais_overlay);
	return f.dot;
}, true);

// necropolis_gate.dm:48
rt.def("/obj/structure/necropolis_gate/proc/Destroy", function* Destroy(f: Frame, force: Value) {
	if (force) {
		yield* qdel(this.sight_blocker, 1);
		f.dot = (yield* parent_proc());
	} else {
		return 1;
	}
	return f.dot;
}, true);

rt.type(12993, "/obj/structure/opacity_blocker", "/obj/structure", {
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "nothing",
	mouse_opacity: 0,
	opacity: 1,
});

// necropolis_gate.dm:67
rt.def("/obj/structure/opacity_blocker/proc/Destroy", function* Destroy(f: Frame, force: Value) {
	if (force) {
		f.dot = (yield* parent_proc());
	} else {
		return 1;
	}
	return f.dot;
}, true);

// necropolis_gate.dm:73
rt.def("/obj/structure/necropolis_gate/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.locked) {
		to_chat(user, `<span class='boldannounce'>It's ${this.open ? "stuck open" : "locked"}.</span>`);
		return f.dot;
	}
	yield* this.toggle_the_gate(user);
	return f.dot;
}, true);

// necropolis_gate.dm:81
rt.def("/obj/structure/necropolis_gate/proc/toggle_the_gate", function* toggle_the_gate(f: Frame, user: Value, legion_damaged: Value) {
	let sight_blocker_turf: Value = null, i: Value = null;
	let $e: any;
	if (this.changing_openness) {
		return f.dot;
	}
	this.changing_openness = 1;
	let _T: Value = rt.getStep(f, this, 0);
	if (this.open) {
		yield* new_(T("/obj/effect/temp_visual/necropolis"), _T);
		this.visible_message("<span class='boldwarning'>The door slams closed!</span>");
		yield* sleep(1);
		yield* playsound(_T, rt.rsc("sound/effects/stonedoor_openclose.ogg"), 300, 1, { frequency: 80000 });
		yield* sleep(1);
		this.density = 1;
		yield* sleep(1);
		sight_blocker_turf = rt.getStep(f, this, 0);
		if (this.sight_blocker_distance) {
			rt.forRange(f, 0, 1, this.sight_blocker_distance, 1);
			while (($e = rt.next(f, 0)) !== undefined) {
				i = $e;
				if (!sight_blocker_turf) {
					break;
				}
				sight_blocker_turf = rt.getStep(f, sight_blocker_turf, 1);
			}
			rt.endFor(f, 0);
		}
		if (sight_blocker_turf) {
			yield* this.sight_blocker.forceMove(sight_blocker_turf);
		}
		yield* sleep(2.5);
		yield* playsound(_T, rt.rsc("sound/magic/clockwork/invoke_general.ogg"), 30, 1, { frequency: 15000 });
		this.add_overlay(GLOB.door_overlay);
		this.open = 0;
	} else {
		this.cut_overlay(GLOB.door_overlay);
		yield* new_(T("/obj/effect/temp_visual/necropolis/open"), _T);
		yield* sleep(2);
		this.visible_message("<span class='warning'>The door starts to grind open...</span>");
		yield* playsound(_T, rt.rsc("sound/effects/stonedoor_openclose.ogg"), 300, 1, { frequency: 20000 });
		yield* sleep(22);
		yield* this.sight_blocker.forceMove(this);
		yield* sleep(5);
		this.density = 0;
		yield* sleep(5);
		this.open = 1;
	}
	this.changing_openness = 0;
	return 1;
}, true);

// necropolis_gate.dm:120
rt.def("/datum/controller/global_vars/proc/InitGlobalnecropolis_gate", function InitGlobalnecropolis_gate(f: Frame) {
	GLOB.necropolis_gate = null;
	this.gvars_datum_init_order += "necropolis_gate";
	return f.dot;
});

rt.type(12992, "/obj/structure/necropolis_gate/legion_gate", "/obj/structure/necropolis_gate", {
	sight_blocker_distance: 2,
	desc: "A tremendous, impossibly large gateway, set into a massive tower of stone.",
});

// necropolis_gate.dm:126
rt.def("/obj/structure/necropolis_gate/legion_gate/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	GLOB.necropolis_gate = this;
	return f.dot;
}, true);

// necropolis_gate.dm:131
rt.def("/obj/structure/necropolis_gate/legion_gate/proc/Destroy", function* Destroy(f: Frame, force: Value) {
	if (force) {
		if (GLOB.necropolis_gate == this) {
			GLOB.necropolis_gate = null;
		}
		f.dot = (yield* parent_proc());
	} else {
		return 1;
	}
	return f.dot;
}, true);

// necropolis_gate.dm:138
rt.def("/obj/structure/necropolis_gate/legion_gate/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let safety: Value = null;
	if (!this.open && !this.changing_openness) {
		if ((safety = (yield* alert(user, "You think this might be a bad idea...", "Knock on the door?", "Proceed", "Abort"))) == "Abort" || !(get_dist(this, user) <= 1) || !this || this.open || this.changing_openness || user.incapacitated()) {
			return f.dot;
		}
		user.visible_message(`<span class='warning'>${user} knocks on ${this}...</span>`, `<span class='boldannounce'>You tentatively knock on ${this}...</span>`);
		playsound(user.loc, rt.rsc("sound/effects/shieldbash.ogg"), 100, 1);
		yield* sleep(50);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// necropolis_gate.dm:150
rt.def("/obj/structure/necropolis_gate/legion_gate/proc/toggle_the_gate", function* toggle_the_gate(f: Frame, user: Value, legion_damaged: Value) {
	let M: Value = null;
	let $e: any;
	if (this.open) {
		return f.dot;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	this.locked = 1;
	let _T: Value = rt.getStep(f, this, 0);
	this.visible_message("<span class='userdanger'>Something horrible emerges from the Necropolis!</span>");
	if (legion_damaged) {
		message_admins("Legion took damage while the necropolis gate was closed, and has released itself!");
		log_game("Legion took damage while the necropolis gate was closed and released itself.");
	} else {
		message_admins(`${user ? "key_name_admin(user)" : "Unknown"} has released Legion!`);
		log_game(`${user ? "key_name(user)" : "Unknown"} released Legion.`);
	}
	for (M of each(GLOB.player_list, T("/mob"))) {
		if (M.z == this.z) {
			to_chat(M, "<span class='userdanger'>Discordant whispers flood your mind in a thousand voices. Each one speaks your name, over and over. Something horrible has been released.</span>");
			yield* M.playsound_local(_T, rt.rsc("sound/creatures/legion_spawn.ogg"), 100, 0, 0, 0, { pressure_affected: 0 });
			yield* flash_color(M, { flash_color: "#FF0000", flash_time: 50 });
		}
	}
	let release_overlay: Value = mutable_appearance(rt.rsc("icons/effects/effects.dmi"), "legiondoor");
	yield* notify_ghosts(`Legion has been released in the ${get_area(this)}!`, { source: this, alert_overlay: release_overlay, action: "jump" });
	return f.dot;
}, true);

rt.type(12994, "/obj/structure/necropolis_arch", "/obj/structure", {
	open: 0,
	anchored: 1,
	name: "necropolis arch",
	desc: "A massive arch over the necropolis gate, set into a massive tower of stone.",
	icon: rt.rsc("icons/effects/160x160.dmi"),
	icon_state: "arch_full",
	appearance_flags: 0,
	layer: 2.8,
	pixel_x: -64,
	pixel_y: -40,
	resistance_flags: 115,
}, { global: { top_overlay: 808 } });

// necropolis_gate.dm:197
rt.def("/obj/structure/necropolis_arch/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	this.icon_state = "arch_bottom";
	rt.setGl("top_overlay#2", mutable_appearance(rt.rsc("icons/effects/160x160.dmi"), "arch_top"));
	rt.gl("top_overlay#2").layer = EDGED_TURF_LAYER;
	this.add_overlay(rt.gl("top_overlay#2"));
	return f.dot;
});

// necropolis_gate.dm:208
rt.def("/obj/structure/necropolis_arch/proc/Destroy", function* Destroy(f: Frame, force: Value) {
	if (force) {
		f.dot = (yield* parent_proc());
	} else {
		return 1;
	}
	return f.dot;
}, true);

rt.type(12995, "/obj/structure/stone_tile", "/obj/structure", {
	tile_key: "pristine_tile",
	tile_random_sprite_max: 24,
	anchored: 1,
	name: "stone tile",
	icon: rt.rsc("icons/turf/boss_floors.dmi"),
	icon_state: "pristine_tile1",
	layer: 2.04,
	resistance_flags: 115,
});

// necropolis_gate.dm:224
rt.def("/obj/structure/stone_tile/proc/Initialize", function Initialize(f: Frame, mapload: Value) {
	f.dot = parent_proc();
	this.icon_state = `${this.tile_key}${rand(1, this.tile_random_sprite_max)}`;
	return f.dot;
}, false);

// necropolis_gate.dm:229
rt.def("/obj/structure/stone_tile/proc/Destroy", function* Destroy(f: Frame, force: Value) {
	if (force) {
		f.dot = (yield* parent_proc());
	} else {
		return 1;
	}
	return f.dot;
}, true);
