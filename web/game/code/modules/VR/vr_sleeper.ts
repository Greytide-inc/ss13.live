// Based on /tg/station's code/modules/VR/vr_sleeper.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10998, "/obj/machinery/vr_sleeper", "/obj/machinery", {
	you_die_in_the_game_you_die_for_real: 0,
	sparks: null,
	vr_human: null,
	vr_category: "default",
	allow_creating_vr_humans: 1,
	outfit: rt.typePath("/datum/outfit/vr_basic"),
	state_open: 1,
	anchored: 1,
	occupant_typecache: null,
	name: "virtual reality sleeper",
	desc: "a sleeper modified to alter the subconscious state of the user, allowing them to visit virtual worlds",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper",
}, { global: { available_vr_spawnpoints: 772 } });

// vr_sleeper.dm:12
rt.def("/obj/machinery/vr_sleeper/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.occupant_typecache = list(T("/mob/living/carbon/human"));
	return f.dot;
});

// vr_sleeper.dm:22
rt.def("/obj/machinery/vr_sleeper/proc/Initialize", function* Initialize(f: Frame) {
	let V: Value = null, _T: Value = null;
	f.dot = (yield* parent_proc());
	this.sparks = (yield* new_(T("/datum/effect_system/spark_spread")));
	yield* this.sparks.set_up(2, 0);
	yield* this.sparks.attach(this);
	yield* this.update_icon();
	if (!(!GLOB.available_vr_spawnpoints || !rt.len(f, GLOB.available_vr_spawnpoints))) return f.dot;
	GLOB.available_vr_spawnpoints = list();
	for (V of each(GLOB.landmarks_list, T("/obj/effect/landmark/vr_spawn"))) {
		rt.setAt(GLOB.available_vr_spawnpoints, V.vr_category, list());
		if (_T = rt.getStep(f, V, 0)) {
			(rt.modAt(GLOB.available_vr_spawnpoints, V.vr_category, _T, rt.bitOr));
		}
	}
	return f.dot;
}, true);

// vr_sleeper.dm:40
rt.def("/obj/machinery/vr_sleeper/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.occupant) {
		yield* this.ui_interact(user);
	} else if (this.state_open) {
		yield* this.close_machine();
	} else {
		yield* this.open_machine();
	}
	return f.dot;
}, true);

// vr_sleeper.dm:49
rt.def("/obj/machinery/vr_sleeper/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	yield* this.open_machine();
	return f.dot;
}, true);

// vr_sleeper.dm:53
rt.def("/obj/machinery/vr_sleeper/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.open_machine();
	yield* this.cleanup_vr_human();
	yield* qdel(this.sparks);
	this.sparks = null;
	return (yield* parent_proc());
}, true);

// vr_sleeper.dm:62
rt.def("/obj/machinery/vr_sleeper/proc/emag_act", function emag_act(f: Frame, user: Value) {
	this.you_die_in_the_game_you_die_for_real = 1;
	this.sparks.start();
	return f.dot;
});

// vr_sleeper.dm:66
rt.def("/obj/machinery/vr_sleeper/proc/update_icon", function update_icon(f: Frame) {
	let $0: any = rt.initial(f, this, "icon_state");
	this.icon_state = `${$0}${this.state_open ? "-open" : ""}`;
	return f.dot;
});

// vr_sleeper.dm:70
rt.def("/obj/machinery/vr_sleeper/proc/open_machine", function* open_machine(f: Frame) {
	if (this.state_open) return f.dot;
	if (this.vr_human) {
		yield* this.vr_human.revert_to_reality(0, 0);
	}
	if (this.occupant) {
		yield* GLOB.SStgui.close_user_uis(this.occupant, this);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// vr_sleeper.dm:79
rt.def("/obj/machinery/vr_sleeper/proc/close_machine", function* close_machine(f: Frame) {
	yield* parent_proc();
	if (!this.occupant) return f.dot;
	yield* this.ui_interact(this.occupant);
	return f.dot;
}, true);

// vr_sleeper.dm:85
rt.def("/obj/machinery/vr_sleeper/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "vr_sleeper", "VR Sleeper", 475, 340, master_ui, state))).open();
	return f.dot;
}, true);

// vr_sleeper.dm:92
rt.def("/obj/machinery/vr_sleeper/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let human_occupant: Value = null, _T: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "vr_connect") {
		if ((human_occupant = this.occupant) && human_occupant.mind) {
			to_chat(this.occupant, "<span class='warning'>Transfering to virtual reality...</span>");
			if (this.vr_human) {
				yield* this.vr_human.revert_to_reality(0, 0);
				yield* human_occupant.mind.transfer_to(this.vr_human);
				this.vr_human.real_me = this.occupant;
				to_chat(this.vr_human, `<span class='notice'>Transfer successful! you are now playing as ${this.vr_human} in VR!</span>`);
				yield* GLOB.SStgui.close_user_uis(this.vr_human, this);
			} else if (this.allow_creating_vr_humans) {
				to_chat(this.occupant, "<span class='warning'>Virtual avatar not found, attempting to create one...</span>");
				if (_T = this.get_vr_spawnpoint()) {
					yield* this.build_virtual_human(this.occupant, _T);
					to_chat(this.vr_human, `<span class='notice'>Transfer successful! you are now playing as ${this.vr_human} in VR!</span>`);
				} else {
					to_chat(this.occupant, "<span class='warning'>Virtual world misconfigured, aborting transfer</span>");
				}
			} else {
				to_chat(this.occupant, "<span class='warning'>The virtual world does not support the creation of new virtual avatars, aborting transfer</span>");
			}
		}
		f.dot = 1;
	} else if (action === "delete_avatar") {
		if (!this.occupant || f.usr == this.occupant) {
			if (this.vr_human) {
				yield* qdel(this.vr_human);
			}
		} else {
			to_chat(f.usr, "<span class='warning'>The VR Sleeper's safeties prevent you from doing that.");
		}
		f.dot = 1;
	} else if (action === "toggle_open") {
		if (this.state_open) {
			yield* this.close_machine();
		} else {
			yield* this.open_machine();
		}
		f.dot = 1;
	}
	return f.dot;
}, true);

// vr_sleeper.dm:133
rt.def("/obj/machinery/vr_sleeper/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let status: Value = null;
	let data: Value = list();
	if (this.vr_human && !(!this.vr_human || this.vr_human.gc_destroyed)) {
		rt.setAt(data, "can_delete_avatar", 1);
		if (user.stat === 0) {
			status = "Conscious";
		} else if (user.stat === 2) {
			status = "Dead";
		} else if (user.stat === 1) {
			status = "Unconscious";
		}
		rt.setAt(data, "vr_avatar", rt.alist(f, ["name", this.vr_human.name, "status", status, "health", this.vr_human.health, "maxhealth", this.vr_human.maxHealth]));
	}
	rt.setAt(data, "toggle_open", this.state_open);
	rt.setAt(data, "isoccupant", (user == this.occupant ? 1 : 0));
	return data;
});

// vr_sleeper.dm:151
rt.def("/obj/machinery/vr_sleeper/proc/get_vr_spawnpoint", function get_vr_spawnpoint(f: Frame) {
	return safepick(rt.index(GLOB.available_vr_spawnpoints, this.vr_category));
});

// vr_sleeper.dm:156
rt.def("/obj/machinery/vr_sleeper/proc/build_virtual_human", function* build_virtual_human(f: Frame, H: Value, location: Value, transfer: Value) {
	let O: Value = null;
	transfer ??= 1;
	if (!H) return f.dot;
	yield* this.cleanup_vr_human();
	this.vr_human = (yield* new_(T("/mob/living/carbon/human/virtual_reality"), location));
	this.vr_human.vr_sleeper = this;
	this.vr_human.real_me = H;
	yield* H.dna.transfer_identity(this.vr_human);
	this.vr_human.name = H.name;
	this.vr_human.real_name = H.real_name;
	this.vr_human.socks = H.socks;
	this.vr_human.undershirt = H.undershirt;
	this.vr_human.underwear = H.underwear;
	yield* this.vr_human.updateappearance(1, 1, 1);
	if (this.outfit) {
		yield* (O = (yield* new_(this.outfit))).equip(this.vr_human);
	}
	if (!(transfer && H.mind)) return f.dot;
	yield* H.mind.transfer_to(this.vr_human);
	return f.dot;
}, true);

// vr_sleeper.dm:176
rt.def("/obj/machinery/vr_sleeper/proc/cleanup_vr_human", function* cleanup_vr_human(f: Frame) {
	if (!this.vr_human) return f.dot;
	yield* this.vr_human.death(0);
	return f.dot;
}, true);
