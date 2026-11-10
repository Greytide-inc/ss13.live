// Based on /tg/station's code/modules/mob/living/brain/posibrain.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


// posibrain.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalposibrain_notify_cooldown", function InitGlobalposibrain_notify_cooldown(f: Frame) {
	GLOB.posibrain_notify_cooldown = null;
	this.gvars_datum_init_order += "posibrain_notify_cooldown";
	return f.dot;
});

rt.type(9116, "/obj/item/device/mmi/posibrain", "/obj/item/device/mmi", {
	next_ask: null,
	askDelay: 600,
	searching: 0,
	autoping: 1,
	begin_activation_message: "<span class='notice'>You carefully locate the manual activation switch and start the positronic brain's boot process.</span>",
	success_message: "<span class='notice'>The positronic brain pings, and its lights start flashing. Success!</span>",
	fail_message: "<span class='notice'>The positronic brain buzzes quietly, and the golden lights fade away. Perhaps you could try again?</span>",
	new_role: "Positronic Brain",
	welcome_message: "<span class='warning'>ALL PAST LIVES ARE FORGOTTEN.</span>\n<b>You are a positronic brain, brought into existence aboard Space Station 13.\nAs a synthetic intelligence, you answer to all crewmembers and the AI.\nRemember, the purpose of your existence is to serve the crew and the station. Above all else, do no harm.</b>",
	new_mob_message: "<span class='notice'>The positronic brain chimes quietly.</span>",
	dead_message: "<span class='deadsay'>It appears to be completely inactive. The reset light is blinking.</span>",
	possible_names: null,
	picked_name: null,
	name: "positronic brain",
	desc: "A cube of shining metal, four inches to a side and covered in shallow grooves.",
	icon: rt.rsc("icons/obj/assemblies.dmi"),
	icon_state: "posibrain",
	w_class: 3,
	origin_tech: "biotech=3;programming=3;plasmatech=2",
	brainmob: null,
	req_access: null,
	mecha: null,
	braintype: "Android",
});

// posibrain.dm:14
rt.def("/obj/item/device/mmi/posibrain/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(29);
	return f.dot;
});

// posibrain.dm:32
rt.def("/obj/item/device/mmi/posibrain/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let ghost: Value = null;
	if (!rt.at(href_list, "activate")) return f.dot;
	if (!rt.istype((ghost = f.usr), T("/mob/dead/observer"))) return f.dot;
	yield* this.activate(ghost);
	return f.dot;
}, true);

// posibrain.dm:38
rt.def("/obj/item/device/mmi/posibrain/proc/ping_ghosts", function* ping_ghosts(f: Frame, msg: Value, newlymade: Value) {
	let $3: any;
	if (!(newlymade || GLOB.posibrain_notify_cooldown <= rt.worldTime(f))) return f.dot;
	let $0: any = null;
	let $1: any = `${this.name} ${msg} in ${get_area(this)}!`;
	let $2: any = "ghost_sound";
	if (!newlymade) {
		$3 = rt.rsc("sound/effects/ghost2.ogg");
	} else {
		$3 = null;
	}
	yield* g.call(f, P("/proc/notify_ghosts"), null, [$0, $1, $2, $3, "enter_link", fmt("<a href=?src=＃;activate=1>(Click to enter)</a>", [this]), "source", this, "action", "attack", "flashwindow", 0], rt.Args.Named);
	if (newlymade) return f.dot;
	GLOB.posibrain_notify_cooldown = rt.worldTime(f) + this.askDelay;
	return f.dot;
}, true);

// posibrain.dm:44
rt.def("/obj/item/device/mmi/posibrain/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!this.brainmob || this.brainmob.key) {
		return f.dot;
	}
	if (this.next_ask > rt.worldTime(f)) {
		return f.dot;
	}
	to_chat(user, this.begin_activation_message);
	yield* this.ping_ghosts("requested", 0);
	this.next_ask = rt.worldTime(f) + this.askDelay;
	this.searching = 1;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/device/mmi/posibrain/proc/check_success"))), this.askDelay);
	return f.dot;
}, true);

// posibrain.dm:57
rt.def("/obj/item/device/mmi/posibrain/proc/check_success", function check_success(f: Frame) {
	this.searching = 0;
	this.update_icon();
	if (!this.brainmob || this.brainmob.gc_destroyed) {
		return f.dot;
	}
	if (this.brainmob.client) {
		this.visible_message(this.success_message);
	} else {
		this.visible_message(this.fail_message);
	}
	return f.dot;
});

// posibrain.dm:66
rt.def("/obj/item/device/mmi/posibrain/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	yield* this.activate(user);
	return f.dot;
}, true);

// posibrain.dm:69
rt.def("/obj/item/device/mmi/posibrain/proc/is_occupied", function is_occupied(f: Frame) {
	let R: Value = null;
	if (this.brainmob.key) {
		return 1;
	}
	if (rt.istype(this.loc, T("/mob/living/silicon/robot"))) {
		if ((R = this.loc).mmi == this) {
			return 1;
		}
	}
	return 0;
});

// posibrain.dm:79
rt.def("/obj/item/device/mmi/posibrain/proc/activate", function* activate(f: Frame, user: Value) {
	let posi_ask: Value = null;
	if (!this.brainmob || this.brainmob.gc_destroyed) {
		return f.dot;
	}
	if (this.is_occupied() || jobban_isbanned(user, "posibrain")) {
		return f.dot;
	}
	if ((posi_ask = (yield* alert(`Become a ${this.name}? (Warning, You can no longer be cloned, and all past lives will be forgotten!)`, "Are you positive?", "Yes", "No"))) == "No" || !this || this.gc_destroyed) {
		return f.dot;
	}
	yield* this.transfer_personality(user);
	return f.dot;
}, true);

// posibrain.dm:90
rt.def("/obj/item/device/mmi/posibrain/proc/transfer_identity", function* transfer_identity(f: Frame, C: Value) {
	this.name = `${rt.initial(f, this, "name")} (${C})`;
	this.brainmob.name = C.real_name;
	this.brainmob.real_name = C.real_name;
	if (C.has_dna()) {
		if (!this.brainmob.stored_dna) {
			this.brainmob.stored_dna = (yield* new_(T("/datum/dna/stored"), this.brainmob));
		}
		yield* C.dna.copy_dna(this.brainmob.stored_dna);
	}
	this.brainmob.timeofhostdeath = C.timeofdeath;
	this.brainmob.stat = 0;
	if (this.brainmob.mind) {
		this.brainmob.mind.assigned_role = this.new_role;
	}
	if (C.mind) {
		yield* C.mind.transfer_to(this.brainmob);
	}
	yield* this.brainmob.mind.remove_all_antag();
	this.brainmob.mind.wipe_memory();
	yield* this.update_icon();
	return f.dot;
}, true);

// posibrain.dm:109
rt.def("/obj/item/device/mmi/posibrain/proc/transfer_personality", function* transfer_personality(f: Frame, candidate: Value) {
	if (!this.brainmob || this.brainmob.gc_destroyed) {
		return f.dot;
	}
	if (this.is_occupied()) {
		to_chat(candidate, "This brain has already been taken! Please try your possession again later!");
		return 0;
	}
	if (candidate.mind && !rt.istype(candidate, T("/mob/dead/observer"))) {
		yield* candidate.mind.transfer_to(this.brainmob);
	} else {
		this.brainmob.ckey = candidate.ckey;
	}
	this.name = `${rt.initial(f, this, "name")} (${this.brainmob.name})`;
	to_chat(this.brainmob, this.welcome_message);
	this.brainmob.mind.assigned_role = this.new_role;
	this.brainmob.stat = 0;
	GLOB.dead_mob_list -= this.brainmob;
	GLOB.living_mob_list += this.brainmob;
	this.visible_message(this.new_mob_message);
	yield* this.update_icon();
	return 1;
}, true);

// posibrain.dm:131
rt.def("/obj/item/device/mmi/posibrain/proc/examine", function examine(f: Frame, user: Value) {
	let msg: Value = null;
	f.dot = parent_proc();
	if (this.brainmob && this.brainmob.key) {
		if (this.brainmob.stat === 0) {
			if (!this.brainmob.client) {
				msg = "It appears to be in stand-by mode.";
			}
		} else if (this.brainmob.stat === 2) {
			msg = "<span class='deadsay'>It appears to be completely inactive.</span>";
		}
	} else {
		msg = `${this.dead_message}`;
	}
	to_chat(user, msg);
	return f.dot;
}, false);

// posibrain.dm:146
rt.def("/obj/item/device/mmi/posibrain/proc/Initialize", function* Initialize(f: Frame) {
	let new_name: Value = null;
	yield* parent_proc();
	this.brainmob = (yield* new_(T("/mob/living/brain"), this));
	if (!rt.length(this.possible_names)) {
		new_name = pick(GLOB.posibrain_names);
	} else {
		new_name = pick(this.possible_names);
	}
	this.brainmob.name = `${new_name}-${rand(100, 999)}`;
	this.brainmob.real_name = this.brainmob.name;
	this.brainmob.loc = this;
	this.brainmob.container = this;
	if (!this.autoping) return f.dot;
	yield* this.ping_ghosts("created", 1);
	return f.dot;
}, true);

// posibrain.dm:166
rt.def("/obj/item/device/mmi/posibrain/proc/update_icon", function update_icon(f: Frame) {
	if (this.searching) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}-searching`;
		return f.dot;
	}
	if (this.brainmob && this.brainmob.key) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}-occupied`;
	} else {
		this.icon_state = rt.initial(f, this, "icon_state");
	}
	return f.dot;
});
