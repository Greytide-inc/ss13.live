// Based on /tg/station's code/game/objects/items/weapons/implants/implantchair.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10874, "/obj/machinery/implantchair", "/obj/machinery", {
	ready: 1,
	replenishing: 0,
	ready_implants: 5,
	max_implants: 5,
	injection_cooldown: 600,
	replenish_cooldown: 6000,
	implant_type: rt.typePath("/obj/item/weapon/implant/mindshield"),
	auto_inject: 0,
	auto_replenish: 1,
	special: 0,
	special_name: "special function",
	anchored: 1,
	name: "mindshield implanter",
	desc: "Used to implant occupants with mindshield implants.",
	icon: rt.rsc("icons/obj/machines/implantchair.dmi"),
	icon_state: "implantchair",
	density: 1,
	opacity: 0,
});

// implantchair.dm:24
rt.def("/obj/machinery/implantchair/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.open_machine();
	yield* this.update_icon();
	return f.dot;
}, true);

// implantchair.dm:32
rt.def("/obj/machinery/implantchair/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.notcontained_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "implantchair", this.name, 375, 280, master_ui, state))).open();
	return f.dot;
}, true);

// implantchair.dm:39
rt.def("/obj/machinery/implantchair/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, mob_occupant: Value = null;
	let $0: any = (data = list());
	let $1: any = "occupied";
	rt.setAt($0, $1, this.occupant ? 1 : 0);
	rt.setAt(data, "open", this.state_open);
	rt.setAt(data, "occupant", list());
	if (this.occupant) {
		mob_occupant = this.occupant;
		rt.setAt(rt.at(data, "occupant"), "name", mob_occupant.name);
		rt.setAt(rt.at(data, "occupant"), "stat", mob_occupant.stat);
	}
	rt.setAt(data, "special_name", this.special ? this.special_name : null);
	rt.setAt(data, "ready_implants", this.ready_implants);
	rt.setAt(data, "ready", this.ready);
	rt.setAt(data, "replenishing", this.replenishing);
	return data;
});

// implantchair.dm:57
rt.def("/obj/machinery/implantchair/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "door") {
		if (this.state_open) {
			yield* this.close_machine();
		} else {
			yield* this.open_machine();
		}
		f.dot = 1;
	} else if (action === "implant") {
		yield* this.implant(this.occupant, f.usr);
		f.dot = 1;
	}
	return f.dot;
}, true);

// implantchair.dm:71
rt.def("/obj/machinery/implantchair/proc/implant", function* implant(f: Frame, M: Value, user: Value) {
	if (!rt.istype(M, T("/mob/living"))) {
		return f.dot;
	}
	if (!this.ready_implants || !this.ready) {
		return f.dot;
	}
	if (yield* this.implant_action(M, user)) {
		this.ready_implants--;
		if (!this.replenishing && this.auto_replenish) {
			this.replenishing = 1;
			yield* addtimer((yield* new_(T("/datum/callback"), this, "replenish")), this.replenish_cooldown);
		}
		if (this.injection_cooldown > 0) {
			this.ready = 0;
			yield* addtimer((yield* new_(T("/datum/callback"), this, "set_ready")), this.injection_cooldown);
		}
	} else {
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/buzz-sigh.ogg"), 25, 1);
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// implantchair.dm:88
rt.def("/obj/machinery/implantchair/proc/implant_action", function* implant_action(f: Frame, M: Value) {
	let I: Value = null;
	if (!(yield* (I = (yield* new_(this.implant_type))).implant(M))) return f.dot;
	this.visible_message(`<span class='warning'>${M} has been implanted by the ${this.name}.</span>`);
	return 1;
}, true);

// implantchair.dm:94
rt.def("/obj/machinery/implantchair/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = rt.initial(f, this, "icon_state");
	if (this.state_open) {
		this.icon_state += "_open";
	}
	if (this.occupant) {
		this.icon_state += "_occupied";
	}
	if (this.ready) {
		this.add_overlay("ready");
	} else {
		this.cut_overlays();
	}
	return f.dot;
});

// implantchair.dm:105
rt.def("/obj/machinery/implantchair/proc/replenish", function* replenish(f: Frame) {
	if (this.ready_implants < this.max_implants) {
		this.ready_implants++;
	}
	if (this.ready_implants < this.max_implants) {
		yield* addtimer((yield* new_(T("/datum/callback"), this, "replenish")), this.replenish_cooldown);
	} else {
		this.replenishing = 0;
	}
	return f.dot;
}, true);

// implantchair.dm:114
rt.def("/obj/machinery/implantchair/proc/set_ready", function set_ready(f: Frame) {
	this.ready = 1;
	this.update_icon();
	return f.dot;
});

// implantchair.dm:119
rt.def("/obj/machinery/implantchair/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	if (this.state_open) {
		return f.dot;
	}
	user.changeNext_move(100);
	user.last_special = rt.worldTime(f) + 100;
	to_chat(user, `<span class='notice'>You lean on the back of ${this} and start pushing the door open... (this will take about about a minute.)</span>`);
	yield* this.audible_message(`<span class='italics'>You hear a metallic creaking from ${this}!</span>`, { hearing_distance: 2 });
	if (!(yield* do_after(user, 600, { target: this }))) return f.dot;
	if (!user || user.stat != 0 || user.loc != this || this.state_open) {
		return f.dot;
	}
	this.visible_message(`<span class='warning'>${user} successfully broke out of ${this}!</span>`);
	to_chat(user, `<span class='notice'>You successfully break out of ${this}!</span>`);
	yield* this.open_machine();
	return f.dot;
}, true);

// implantchair.dm:132
rt.def("/obj/machinery/implantchair/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	yield* this.container_resist(user);
	return f.dot;
}, true);

// implantchair.dm:135
rt.def("/obj/machinery/implantchair/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, target: Value, user: Value) {
	if (user.stat || user.lying || !this.Adjacent(user) || !user.Adjacent(target) || !rt.istype(target, T("/mob/living")) || !user.IsAdvancedToolUser()) {
		return f.dot;
	}
	yield* this.close_machine(target);
	return f.dot;
}, true);

// implantchair.dm:140
rt.def("/obj/machinery/implantchair/proc/close_machine", function* close_machine(f: Frame, user: Value) {
	if (!((user === null || rt.istype(user, T("/mob/living"))) && this.state_open)) return f.dot;
	yield* parent_proc(user);
	if (!(this.auto_inject && this.ready && this.ready_implants > 0)) return f.dot;
	yield* this.implant(user, null);
	return f.dot;
}, true);

rt.type(10875, "/obj/machinery/implantchair/genepurge", "/obj/machinery/implantchair", {
	special: 1,
	special_name: "Purge genome",
	injection_cooldown: 0,
	replenish_cooldown: 300,
	name: "Genetic purifier",
	desc: "Used to purge human genome of foreign influences",
});

// implantchair.dm:154
rt.def("/obj/machinery/implantchair/genepurge/proc/implant_action", function* implant_action(f: Frame, H: Value, user: Value) {
	if (!rt.istype(H, T("/mob/living/carbon/human"))) {
		return 0;
	}
	yield* H.set_species(T("/datum/species/human"), 1);
	yield* purrbation_remove(H);
	yield* H.dna.remove_all_mutations();
	return 1;
}, true);

rt.type(10876, "/obj/machinery/implantchair/brainwash", "/obj/machinery/implantchair", {
	objective: "Obey the law. Praise Nanotrasen.",
	custom: 0,
	special_name: "Imprint",
	injection_cooldown: 3000,
	auto_inject: 0,
	auto_replenish: 0,
	special: 1,
	name: "Neural Imprinter",
	desc: "Used to <s>indoctrinate</s> rehabilitate hardened recidivists.",
});

// implantchair.dm:174
rt.def("/obj/machinery/implantchair/brainwash/proc/implant_action", function* implant_action(f: Frame, C: Value, user: Value) {
	let custom_objective: Value = null;
	if (!rt.istype(C, T("/mob/living")) || !C.mind) {
		return 0;
	}
	if (this.custom) {
		if (!user || !user.Adjacent(this)) {
			return 0;
		}
		this.objective = (yield* stripped_input(f.usr, `What order do you want to imprint on ${C}?`, "Enter the order", "", 120));
		message_admins(`${key_name_admin(user)} set brainwash machine objective to '${this.objective}'.`);
		log_game(`${key_name_admin(user)} set brainwash machine objective to '${this.objective}'.`);
	}
	(custom_objective = (yield* new_(T("/datum/objective"), this.objective))).owner = C.mind;
	C.mind.objectives += custom_objective;
	C.mind.announce_objectives();
	message_admins(`${key_name_admin(user)} brainwashed ${key_name_admin(C)} with objective '${this.objective}'.`);
	log_game(`${key_name_admin(user)} brainwashed ${key_name_admin(C)} with objective '${this.objective}'.`);
	return 1;
}, true);
