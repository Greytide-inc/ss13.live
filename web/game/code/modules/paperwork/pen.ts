// Based on /tg/station's code/modules/paperwork/pen.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(6643, "/obj/item/weapon/pen", "/obj/item/weapon", {
	colour: "black",
	traitor_unlock_degrees: 0,
	degrees: 0,
	font: "Verdana",
	throw_speed: 3,
	throw_range: 7,
	pressure_resistance: 2,
	desc: "It's a normal black ink pen.",
	name: "pen",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "pen",
	item_state: "pen",
	slot_flags: 528,
	throwforce: 0,
	w_class: 1,
	materials: null,
});

// pen.dm:24
rt.def("/obj/item/weapon/pen/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 10]);
	return f.dot;
});

// pen.dm:32
rt.def("/obj/item/weapon/pen/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is scribbling numbers all over ${user.p_them()}self with ${this}! It looks like ${user.p_theyre()} trying to commit sudoku...</span>`);
	return 1;
});

rt.type(6648, "/obj/item/weapon/pen/fourcolor", "/obj/item/weapon/pen", {
	colour: "black",
	desc: "It's a fancy four-color ink pen, set to black.",
	name: "four-color pen",
});

// pen.dm:56
rt.def("/obj/item/weapon/pen/fourcolor/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (this.colour === "black") {
		this.colour = "red";
	} else if (this.colour === "red") {
		this.colour = "green";
	} else if (this.colour === "green") {
		this.colour = "blue";
	} else {
		this.colour = "black";
	}
	to_chat(user, fmt("<span class='notice'>＄！ will now write in ＀.</span>", [this, this.colour]));
	this.desc = `It's a fancy four-color ink pen, set to ${this.colour}.`;
	return f.dot;
});

rt.type(6650, "/obj/item/weapon/pen/fountain/captain", "/obj/item/weapon/pen/fountain", {
	throw_speed: 4,
	colour: "crimson",
	name: "captain's fountain pen",
	desc: "It's an expensive Oak fountain pen. The nib is quite sharp.",
	icon_state: "pen-fountain-o",
	force: 5,
	throwforce: 5,
	materials: null,
	sharpness: 1,
	resistance_flags: 2,
	unique_reskin: null,
});

// pen.dm:82
rt.def("/obj/item/weapon/pen/fountain/captain/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$gold", 750]);
	this.unique_reskin = rt.alist(f, ["Oak", "pen-fountain-o", "Gold", "pen-fountain-g", "Rosewood", "pen-fountain-r", "Black and Silver", "pen-fountain-b", "Command Blue", "pen-fountain-cb"]);
	return f.dot;
});

// pen.dm:93
rt.def("/obj/item/weapon/pen/fountain/captain/proc/reskin_obj", function* reskin_obj(f: Frame, M: Value) {
	yield* parent_proc();
	if (!this.current_skin) return f.dot;
	this.desc = `It's an expensive ${this.current_skin} fountain pen. The nib is quite sharp.`;
	return f.dot;
}, true);

// pen.dm:98
rt.def("/obj/item/weapon/pen/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let deg: Value = null;
	if (!((deg = (yield* g.op(f, "Prompt", [33], [null, "Rotate Pen Head", "What angle would you like to rotate the pen head to? (1-360)", user, null]))) && deg > 0 && deg <= 360)) return f.dot;
	this.degrees = deg;
	to_chat(user, `<span class='notice'>You rotate the top of the pen to ${this.degrees} degrees.</span>`);
	if (!(this.hidden_uplink && this.degrees == this.traitor_unlock_degrees)) return f.dot;
	to_chat(user, "<span class='warning'>Your pen makes a clicking noise, before quickly rotating back to 0 degrees!</span>");
	this.degrees = 0;
	yield* this.hidden_uplink.interact(user);
	return f.dot;
}, true);

// pen.dm:110
rt.def("/obj/item/weapon/pen/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (this.hidden_uplink) {
		return (yield* this.hidden_uplink.attackby(I, user, params));
	}
	return (yield* parent_proc());
}, true);

// pen.dm:116
rt.def("/obj/item/weapon/pen/proc/attack", function* attack(f: Frame, M: Value, user: Value, stealth: Value) {
	if (!rt.istype(M, T("/mob/living"))) {
		return f.dot;
	}
	if (!this.force) {
		if (yield* M.can_inject(user, 1)) {
			to_chat(user, `<span class='warning'>You stab ${M} with the pen.</span>`);
			if (!stealth) {
				to_chat(M, "<span class='danger'>You feel a tiny prick!</span>");
			}
			f.dot = 1;
		}
		add_logs(user, M, "stabbed", this);
	} else {
		f.dot = (yield* parent_proc());
	}
	return f.dot;
}, true);

// pen.dm:133
rt.def("/obj/item/weapon/pen/proc/afterattack", function* afterattack(f: Frame, O: Value, user: Value, proximity: Value) {
	let penchoice: Value = null, input: Value = null, oldname: Value = null;
	if (rt.istype(O, T("/obj")) && proximity) {
		if (O.unique_rename) {
			penchoice = (yield* g.op(f, "Prompt", [1], [null, "Rename or change description?", "What would you like to edit?", user, list("Rename", "Change description")]));
			if (!(!O || O.gc_destroyed) && (yield* user.canUseTopic(O, { be_close: 1 }))) {
				if (penchoice == "Rename") {
					input = (yield* stripped_input(user, fmt("What do you want to name ％！?", [O.name]), null, "", 42));
					oldname = O.name;
					if (!(!O || O.gc_destroyed) && (yield* user.canUseTopic(O, { be_close: 1 }))) {
						if (oldname == input) {
							to_chat(user, fmt("You changed ％！ to... well... ％！.", [O.name, O.name]));
							return f.dot;
						} else {
							O.name = input;
							to_chat(user, fmt("＄！ has been successfully been renamed to ％！.", [oldname, input]));
							return f.dot;
						}
					} else {
						to_chat(user, "You are too far away!");
					}
				}
				if (penchoice == "Change description") {
					input = (yield* stripped_input(user, fmt("Describe ％！ here", [O.name]), null, "", 100));
					if (!(!O || O.gc_destroyed) && (yield* user.canUseTopic(O, { be_close: 1 }))) {
						O.desc = input;
						to_chat(user, fmt("You have successfully changed ％！'s description.", [O.name]));
						return f.dot;
					} else {
						to_chat(user, "You are too far away!");
					}
				}
			} else {
				to_chat(user, "You are too far away!");
				return f.dot;
			}
		}
	} else {
		return f.dot;
	}
	return f.dot;
}, true);

rt.type(6651, "/obj/item/weapon/pen/sleepy", "/obj/item/weapon/pen", {
	container_type: 4096,
	origin_tech: "engineering=4;syndicate=2",
});

// pen.dm:175
rt.def("/obj/item/weapon/pen/sleepy/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (!rt.istype(M, T("/mob/living"))) {
		return f.dot;
	}
	if (!(yield* parent_proc())) return f.dot;
	if (!this.reagents.total_volume) return f.dot;
	if (!M.reagents) return f.dot;
	yield* this.reagents.trans_to(M, this.reagents.total_volume);
	return f.dot;
}, true);

// pen.dm:185
rt.def("/obj/item/weapon/pen/sleepy/proc/New", function* New(f: Frame) {
	yield* this.create_reagents(45);
	yield* this.reagents.add_reagent("chloralhydrate2", 20);
	yield* this.reagents.add_reagent("mutetoxin", 15);
	yield* this.reagents.add_reagent("tirizene", 10);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(6652, "/obj/item/weapon/pen/edagger", "/obj/item/weapon/pen", {
	on: 0,
	origin_tech: "combat=3;syndicate=1",
	attack_verb: null,
});

// pen.dm:202
rt.def("/obj/item/weapon/pen/edagger/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (this.on) {
		this.on = 0;
		this.force = rt.initial(f, this, "force");
		this.w_class = rt.initial(f, this, "w_class");
		this.name = rt.initial(f, this, "name");
		this.hitsound = rt.initial(f, this, "hitsound");
		this.embed_chance = rt.initial(f, this, "embed_chance");
		this.throwforce = rt.initial(f, this, "throwforce");
		playsound(user, rt.rsc("sound/weapons/saberoff.ogg"), 5, 1);
		to_chat(user, `<span class='warning'>${this} can now be concealed.</span>`);
	} else {
		this.on = 1;
		this.force = 18;
		this.w_class = 3;
		this.name = "energy dagger";
		this.hitsound = rt.rsc("sound/weapons/blade1.ogg");
		this.embed_chance = 100;
		this.throwforce = 35;
		playsound(user, rt.rsc("sound/weapons/saberon.ogg"), 5, 1);
		to_chat(user, `<span class='warning'>${this} is now active.</span>`);
	}
	this.update_icon();
	return f.dot;
});

// pen.dm:224
rt.def("/obj/item/weapon/pen/edagger/proc/update_icon", function update_icon(f: Frame) {
	if (this.on) {
		this.icon_state = "edagger";
		this.item_state = "edagger";
	} else {
		this.icon_state = rt.initial(f, this, "icon_state");
		this.item_state = rt.initial(f, this, "item_state");
	}
	return f.dot;
});
