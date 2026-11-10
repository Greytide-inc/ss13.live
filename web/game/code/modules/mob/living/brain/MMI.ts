// Based on /tg/station's code/modules/mob/living/brain/MMI.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9115, "/obj/item/device/mmi", "/obj/item/device", {
	braintype: "Cyborg",
	radio: null,
	brainmob: null,
	robot: null,
	mecha: null,
	brain: null,
	laws: null,
	force_replace_ai_name: 0,
	name: "Man-Machine Interface",
	desc: "The Warrior's bland acronym, MMI, obscures the true horror of this monstrosity, that nevertheless has become standard-issue on Nanotrasen stations.",
	icon: rt.rsc("icons/obj/assemblies.dmi"),
	icon_state: "mmi_empty",
	w_class: 3,
	origin_tech: "biotech=2;programming=3;engineering=2",
});

// MMI.dm:14
rt.def("/obj/item/device/mmi/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.laws = new_(T("/datum/ai_laws"));
	return f.dot;
});

// MMI.dm:19
rt.def("/obj/item/device/mmi/proc/update_icon", function update_icon(f: Frame) {
	if (this.brain) {
		if (rt.istype(this.brain, T("/obj/item/organ/brain/alien"))) {
			if (this.brainmob && this.brainmob.stat == 2) {
				this.icon_state = "mmi_alien_dead";
			} else {
				this.icon_state = "mmi_alien";
			}
			this.braintype = "Xenoborg";
		} else {
			if (this.brainmob && this.brainmob.stat == 2) {
				this.icon_state = "mmi_dead";
			} else {
				this.icon_state = "mmi_full";
			}
			this.braintype = "Cyborg";
		}
	} else {
		this.icon_state = "mmi_empty";
	}
	return f.dot;
});

// MMI.dm:35
rt.def("/obj/item/device/mmi/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.radio = (yield* new_(T("/obj/item/device/radio"), this));
	this.radio.broadcasting = 0;
	yield* this.laws.set_laws_config();
	return f.dot;
}, true);

// MMI.dm:41
rt.def("/obj/item/device/mmi/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let newbrain: Value = null, B: Value = null;
	user.changeNext_move(8);
	if (rt.istype(O, T("/obj/item/organ/brain"))) {
		newbrain = O;
		if (this.brain) {
			to_chat(user, "<span class='warning'>There's already a brain in the MMI!</span>");
			return f.dot;
		}
		if (!newbrain.brainmob) {
			to_chat(user, "<span class='warning'>You aren't sure where this brain came from, but you're pretty sure it's a useless brain!</span>");
			return f.dot;
		}
		if (!(yield* user.transferItemToLoc(O, this))) {
			return f.dot;
		}
		if (!(B = newbrain.brainmob).key) {
			yield* B.notify_ghost_cloning("Someone has put your brain in a MMI!", { source: this });
		}
		this.visible_message(fmt("＀ sticks ＇！ into ％！.", [user, newbrain, this]));
		this.brainmob = newbrain.brainmob;
		newbrain.brainmob = null;
		this.brainmob.loc = this;
		this.brainmob.container = this;
		if (!newbrain.damaged_brain) {
			this.brainmob.stat = 0;
			GLOB.dead_mob_list -= this.brainmob;
			GLOB.living_mob_list += this.brainmob;
		}
		yield* this.brainmob.reset_perspective();
		this.brain = newbrain;
		this.name = `Man-Machine Interface: ${this.brainmob.real_name}`;
		yield* this.update_icon();
	} else if (this.brainmob) {
		yield* O.attack(this.brainmob, user);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// MMI.dm:82
rt.def("/obj/item/device/mmi/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!this.brain) {
		this.radio.on = (!this.radio.on ? 1 : 0);
		to_chat(user, `<span class='notice'>You toggle the MMI's radio system ${this.radio.on == 1 ? "on" : "off"}.</span>`);
	} else {
		to_chat(user, "<span class='notice'>You unlock and upend the MMI, spilling the brain onto the floor.</span>");
		yield* this.eject_brain(user);
		yield* this.update_icon();
		this.name = "Man-Machine Interface";
	}
	return f.dot;
}, true);

// MMI.dm:92
rt.def("/obj/item/device/mmi/proc/eject_brain", function* eject_brain(f: Frame, user: Value) {
	this.brainmob.container = null;
	this.brainmob.loc = this.brain;
	this.brainmob.stat = 2;
	this.brainmob.emp_damage = 0;
	yield* this.brainmob.reset_perspective();
	GLOB.living_mob_list -= this.brainmob;
	GLOB.dead_mob_list += this.brainmob;
	this.brain.brainmob = this.brainmob;
	this.brainmob = null;
	if (user) {
		yield* user.put_in_hands(this.brain);
	} else {
		yield* this.brain.forceMove(rt.getStep(f, this, 0));
	}
	this.brain = null;
	return f.dot;
}, true);

// MMI.dm:109
rt.def("/obj/item/device/mmi/proc/transfer_identity", function* transfer_identity(f: Frame, L: Value) {
	let C: Value = null, H: Value = null, newbrain: Value = null;
	if (!this.brainmob) {
		this.brainmob = (yield* new_(T("/mob/living/brain"), this));
	}
	this.brainmob.name = L.real_name;
	this.brainmob.real_name = L.real_name;
	if (L.has_dna()) {
		C = L;
		if (!this.brainmob.stored_dna) {
			this.brainmob.stored_dna = (yield* new_(T("/datum/dna/stored"), this.brainmob));
		}
		yield* C.dna.copy_dna(this.brainmob.stored_dna);
	}
	this.brainmob.container = this;
	if (rt.istype(L, T("/mob/living/carbon/human"))) {
		H = L;
		(newbrain = H.getorgan(T("/obj/item/organ/brain"))).loc = this;
		this.brain = newbrain;
	} else if (!this.brain) {
		this.brain = (yield* new_(T("/obj/item/organ/brain"), this));
		this.brain.name = `${L.real_name}'s brain`;
	}
	this.name = `Man-Machine Interface: ${this.brainmob.real_name}`;
	yield* this.update_icon();
	return f.dot;
}, true);

// MMI.dm:134
rt.def("/obj/item/device/mmi/proc/replacement_ai_name", function replacement_ai_name(f: Frame) {
	return this.brainmob.name;
});

// MMI.dm:143
rt.def("/obj/item/device/mmi/verb/Toggle_Listening", function Toggle_Listening(f: Frame) {
	let $1: any;
	if (this.brainmob.stat) {
		to_chat(this.brainmob, "<span class='warning'>Can't do that while incapacitated or dead!</span>");
	}
	if (!this.radio.on) {
		to_chat(this.brainmob, "<span class='warning'>Your radio is disabled!</span>");
		return f.dot;
	}
	let $0: any = this.radio;
	if (this.radio.listening == 1) {
		$1 = 0;
	} else {
		$1 = 1;
	}
	$0.listening = $1;
	$0 = this.brainmob;
	if (this.radio.listening == 1) {
		$1 = "now";
	} else {
		$1 = "no longer";
	}
	to_chat($0, `<span class='notice'>Radio is ${$1} receiving broadcast.</span>`);
	return f.dot;
}, false, { hidePopup: true, verb: { name: "Toggle Listening", category: "MMI", desc: "Toggle listening channel on or off.", src: 12 } });

// MMI.dm:153
rt.def("/obj/item/device/mmi/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (!this.brainmob || rt.istype(this.loc, T("/mob/living/silicon/robot"))) {
		return f.dot;
	} else {
		if (severity === 1) {
			this.brainmob.emp_damage = min(this.brainmob.emp_damage + rand(20, 30), 30);
		} else if (severity === 2) {
			this.brainmob.emp_damage = min(this.brainmob.emp_damage + rand(10, 20), 30);
		} else if (severity === 3) {
			this.brainmob.emp_damage = min(this.brainmob.emp_damage + rand(0, 10), 30);
		}
		yield* this.brainmob.emote("alarm");
	}
	yield* parent_proc();
	return f.dot;
}, true);

// MMI.dm:167
rt.def("/obj/item/device/mmi/proc/Destroy", function* Destroy(f: Frame) {
	let borg: Value = null;
	if (rt.istype(this.loc, T("/mob/living/silicon/robot"))) {
		(borg = this.loc).mmi = null;
	}
	if (this.brainmob) {
		yield* qdel(this.brainmob);
		this.brainmob = null;
	}
	if (this.brain) {
		yield* qdel(this.brain);
		this.brain = null;
	}
	if (this.mecha) {
		this.mecha = null;
	}
	if (this.radio) {
		yield* qdel(this.radio);
		this.radio = null;
	}
	return (yield* parent_proc());
}, true);

// MMI.dm:185
rt.def("/obj/item/device/mmi/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (this.brain) {
		yield* this.eject_brain();
	}
	yield* qdel(this);
	return f.dot;
}, true);

// MMI.dm:189
rt.def("/obj/item/device/mmi/proc/examine", function examine(f: Frame, user: Value) {
	let B: Value = null;
	parent_proc();
	if (!this.brainmob) return f.dot;
	if (!(B = this.brainmob).key || !B.mind || B.stat == 2) {
		to_chat(user, "<span class='warning'>The MMI indicates the brain is completely unresponsive.</span>");
	} else if (!B.client) {
		to_chat(user, "<span class='warning'>The MMI indicates the brain is currently inactive; it might change.</span>");
	} else {
		to_chat(user, "<span class='notice'>The MMI indicates the brain is active.</span>");
	}
	return f.dot;
}, false);

rt.type(9118, "/obj/item/device/mmi/syndie", "/obj/item/device/mmi", {
	name: "Syndicate Man-Machine Interface",
	desc: "Syndicate's own brand of MMI. It enforces laws designed to help Syndicate agents achieve their goals upon cyborgs and AIs created with it.",
	origin_tech: "biotech=4;programming=4;syndicate=2",
});

// MMI.dm:208
rt.def("/obj/item/device/mmi/syndie/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.laws = (yield* new_(T("/datum/ai_laws/syndicate_override")));
	this.radio.on = 0;
	return f.dot;
}, true);
