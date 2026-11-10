// Based on /tg/station's code/game/objects/structures/morgue.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12812, "/obj/structure/bodycontainer", "/obj/structure", {
	connected: null,
	locked: 0,
	opendir: 2,
	anchored: 1,
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "morgue1",
	density: 1,
	obj_integrity: 400,
	max_integrity: 400,
});

// morgue.dm:29
rt.def("/obj/structure/bodycontainer/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.open();
	if (this.connected) {
		yield* qdel(this.connected);
		this.connected = null;
	}
	return (yield* parent_proc());
}, true);

// morgue.dm:36
rt.def("/obj/structure/bodycontainer/proc/on_log", function on_log(f: Frame, login: Value) {
	parent_proc();
	this.update_icon();
	return f.dot;
}, false);

// morgue.dm:43
rt.def("/obj/structure/bodycontainer/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	if (user.stat || !isturf(this.loc)) {
		return f.dot;
	}
	yield* this.open();
	return f.dot;
}, true);

// morgue.dm:48
rt.def("/obj/structure/bodycontainer/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// morgue.dm:52
rt.def("/obj/structure/bodycontainer/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.locked) {
		to_chat(user, "<span class='danger'>It's locked.</span>");
		return f.dot;
	}
	if (!this.connected) {
		to_chat(user, "That doesn't appear to have a tray.");
		return f.dot;
	}
	if (this.connected.loc == this) {
		yield* this.open();
	} else {
		yield* this.close();
	}
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// morgue.dm:64
rt.def("/obj/structure/bodycontainer/proc/attack_robot", function* attack_robot(f: Frame, user: Value) {
	if (!user.Adjacent(this)) {
		return f.dot;
	}
	return (yield* this.attack_hand(user));
}, true);

// morgue.dm:69
rt.def("/obj/structure/bodycontainer/proc/attackby", function* attackby(f: Frame) {
	let t: Value = null;
	yield* this.add_fingerprint(f.args[1]);
	if (rt.istype(f.args[0], T("/obj/item/weapon/pen"))) {
		t = (yield* stripped_input(f.args[1], "What would you like the label to be?", `${this.name}`, null));
		if (f.args[1].get_active_held_item() != f.args[0]) {
			return f.dot;
		}
		if (!(get_dist(this, f.usr) <= 1) && this.loc != f.args[1]) {
			return f.dot;
		}
		if (t) {
			this.name = `${rt.initial(f, this, "name")}- '${t}'`;
		} else {
			this.name = rt.initial(f, this, "name");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true, { args: ["P", "user", "params"] });

// morgue.dm:84
rt.def("/obj/structure/bodycontainer/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 5);
	yield* qdel(this);
	return f.dot;
}, true);

// morgue.dm:88
rt.def("/obj/structure/bodycontainer/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	yield* this.open();
	return f.dot;
}, true);

// morgue.dm:91
rt.def("/obj/structure/bodycontainer/proc/relay_container_resist", function* relay_container_resist(f: Frame, user: Value, O: Value) {
	to_chat(user, `<span class='notice'>You slam yourself into the side of ${O}.</span>`);
	yield* this.container_resist(user);
	return f.dot;
}, true);

// morgue.dm:95
rt.def("/obj/structure/bodycontainer/proc/open", function* open(f: Frame) {
	let AM: Value = null;
	playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
	let _T: Value = rt.getStep(f, this, this.opendir);
	for (AM of each(this, T("/atom/movable"))) {
		yield* AM.forceMove(_T);
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// morgue.dm:102
rt.def("/obj/structure/bodycontainer/proc/close", function* close(f: Frame) {
	let AM: Value = null;
	playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
	for (AM of each(this.connected.loc, T("/atom/movable"))) {
		if (!AM.anchored || AM == this.connected) {
			yield* AM.forceMove(this);
		}
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// morgue.dm:109
rt.def("/obj/structure/bodycontainer/proc/get_remote_view_fullscreens", function* get_remote_view_fullscreens(f: Frame, user: Value) {
	if (!(user.stat == 2 || !rt.bitAnd(user.sight, 12))) return f.dot;
	yield* user.overlay_fullscreen("remote_view", T("/obj/screen/fullscreen/impaired"), 2);
	return f.dot;
}, true);

rt.type(12813, "/obj/structure/bodycontainer/morgue", "/obj/structure/bodycontainer", {
	opendir: 4,
	name: "morgue",
	desc: "Used to keep bodies in until someone fetches them.",
	icon_state: "morgue1",
});

// morgue.dm:121
rt.def("/obj/structure/bodycontainer/morgue/proc/New", function* New(f: Frame) {
	this.connected = (yield* new_(T("/obj/structure/tray/m_tray"), this));
	this.connected.connected = this;
	yield* parent_proc();
	return f.dot;
}, true);

// morgue.dm:126
rt.def("/obj/structure/bodycontainer/morgue/proc/update_icon", function update_icon(f: Frame) {
	let compiled: Value = null, M: Value = null;
	if (!this.connected || this.connected.loc != this) {
		this.icon_state = "morgue0";
	} else if (rt.len(f, this.contents) == 1) {
		this.icon_state = "morgue1";
	} else {
		this.icon_state = "morgue2";
		if (!rt.length((compiled = recursive_mob_check(this, 0, 0)))) {
			this.icon_state = "morgue3";
			return f.dot;
		}
		for (M of each(compiled, T("/mob/living"))) {
			if (M.client && !M.suiciding) {
				this.icon_state = "morgue4";
				break;
			}
		}
	}
	return f.dot;
});

// morgue.dm:149
rt.def("/datum/controller/global_vars/proc/InitGlobalcrematoriums", function InitGlobalcrematoriums(f: Frame) {
	GLOB.crematoriums = list();
	this.gvars_datum_init_order += "crematoriums";
	return f.dot;
});

rt.type(12814, "/obj/structure/bodycontainer/crematorium", "/obj/structure/bodycontainer", {
	id: 1,
	opendir: 2,
	name: "crematorium",
	desc: "A human incinerator. Works well on barbeque nights.",
	icon_state: "crema1",
});

// morgue.dm:158
rt.def("/obj/structure/bodycontainer/crematorium/proc/attack_robot", function attack_robot(f: Frame, user: Value) {
	to_chat(user, `<span class='warning'>${this} is locked against you.</span>`);
	return f.dot;
});

// morgue.dm:162
rt.def("/obj/structure/bodycontainer/crematorium/proc/Destroy", function* Destroy(f: Frame) {
	yield* GLOB.crematoriums.Remove(this);
	return (yield* parent_proc());
}, true);

// morgue.dm:166
rt.def("/obj/structure/bodycontainer/crematorium/proc/New", function* New(f: Frame) {
	this.connected = (yield* new_(T("/obj/structure/tray/c_tray"), this));
	this.connected.connected = this;
	GLOB.crematoriums.Add(this);
	yield* parent_proc();
	return f.dot;
}, true);

// morgue.dm:173
rt.def("/obj/structure/bodycontainer/crematorium/proc/update_icon", function update_icon(f: Frame) {
	if (!this.connected || this.connected.loc != this) {
		this.icon_state = "crema0";
	} else {
		if (rt.len(f, this.contents) > 1) {
			this.icon_state = "crema2";
		} else {
			this.icon_state = "crema1";
		}
		if (this.locked) {
			this.icon_state = "crema_active";
		}
	}
	return f.dot;
});

// morgue.dm:191
rt.def("/obj/structure/bodycontainer/crematorium/proc/cremate", function* cremate(f: Frame, user: Value) {
	let conts: Value = null, M: Value = null, O: Value = null;
	if (this.locked) {
		return f.dot;
	}
	if (!rt.len(f, (conts = this.GetAllContents() - this - this.connected))) {
		this.audible_message("<span class='italics'>You hear a hollow crackle.</span>");
		return f.dot;
	} else {
		this.audible_message("<span class='italics'>You hear a roar as the crematorium activates.</span>");
		this.locked = 1;
		yield* this.update_icon();
		for (M of each(conts, T("/mob/living"))) {
			if (M.stat != 2) {
				yield* M.emote("scream");
			}
			if (user) {
				user.log_message(`Cremated <b>${M}/${M.ckey}</b>`, "Attack log");
				log_attack(`[${time_stamp()}] <b>${user}/${user.ckey}</b> cremated <b>${M}/${M.ckey}</b>`);
			} else {
				log_attack(`[${time_stamp()}] <b>UNKNOWN</b> cremated <b>${M}/${M.ckey}</b>`);
			}
			yield* M.death(1);
			if (M) {
				yield* M.ghostize();
				yield* qdel(M);
			}
		}
		for (O of each(conts, T("/obj"))) {
			if (O != this.connected) {
				yield* qdel(O);
			}
		}
		yield* new_(T("/obj/effect/decal/cleanable/ash"), this);
		yield* sleep(30);
		if (!this || this.gc_destroyed) return f.dot;
		this.locked = 0;
		yield* this.update_icon();
		playsound(this.loc, rt.rsc("sound/machines/ding.ogg"), 50, 1);
	}
	return f.dot;
}, true);

rt.type(12815, "/obj/structure/bodycontainer/crematorium/creamatorium", "/obj/structure/bodycontainer/crematorium", {
	name: "creamatorium",
	desc: "A human incinerator. Works well during ice cream socials.",
});

// morgue.dm:232
rt.def("/obj/structure/bodycontainer/crematorium/creamatorium/proc/cremate", function* cremate(f: Frame, user: Value) {
	let i_scream: Value = null, IC: Value = null, IC_1: Value = null;
	let icecreams: Value = (yield* new_(T("/list")));
	for (i_scream of each(this.GetAllContents(), T("/mob/living"))) {
		yield* (IC = (yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/icecream")))).set_cone_type("waffle");
		yield* IC.add_mob_flavor(i_scream);
		icecreams += IC;
	}
	f.dot = (yield* parent_proc());
	for (IC_1 of each(icecreams, T("/obj"))) {
		yield* IC_1.forceMove(this);
	}
	return f.dot;
}, true);

rt.type(12816, "/obj/structure/tray", "/obj/structure", {
	connected: null,
	anchored: 1,
	pass_flags: 32,
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	density: 1,
	layer: 2.9,
	obj_integrity: 350,
	max_integrity: 350,
});

// morgue.dm:259
rt.def("/obj/structure/tray/proc/Destroy", function* Destroy(f: Frame) {
	if (this.connected) {
		this.connected.connected = null;
		yield* this.connected.update_icon();
		this.connected = null;
	}
	return (yield* parent_proc());
}, true);

// morgue.dm:265
rt.def("/obj/structure/tray/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 2);
	yield* qdel(this);
	return f.dot;
}, true);

// morgue.dm:269
rt.def("/obj/structure/tray/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// morgue.dm:272
rt.def("/obj/structure/tray/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.connected) {
		yield* this.connected.close();
		yield* this.add_fingerprint(user);
	} else {
		to_chat(user, "<span class='warning'>That's not connected to anything!</span>");
	}
	return f.dot;
}, true);

// morgue.dm:279
rt.def("/obj/structure/tray/proc/MouseDrop_T", function MouseDrop_T(f: Frame, O: Value, user: Value) {
	let M: Value = null;
	if (!rt.istype(O, T("/atom/movable")) || O.anchored || !this.Adjacent(user) || !user.Adjacent(O) || O.loc == user) {
		return f.dot;
	}
	if (!ismob(O)) {
		if (!rt.istype(O, T("/obj/structure/closet/body_bag"))) {
			return f.dot;
		}
	} else if ((M = O).buckled) {
		return f.dot;
	}
	if (!ismob(user) || user.lying || user.incapacitated()) {
		return f.dot;
	}
	O.loc = this.loc;
	if (user != O) {
		this.visible_message(`<span class='warning'>${user} stuffs ${O} into ${this}.</span>`);
	}
	return f.dot;
});

rt.type(12818, "/obj/structure/tray/m_tray", "/obj/structure/tray", {
	name: "morgue tray",
	desc: "Apply corpse before closing.",
	icon_state: "morguet",
});

// morgue.dm:312
rt.def("/obj/structure/tray/m_tray/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	height ??= 0;
	if (height == 0) {
		return 1;
	}
	if (rt.istype(mover, T("/atom/movable")) && mover.checkpass(1)) {
		return 1;
	}
	if (rt.locateIn(f, T("/obj/structure/table"), rt.getStep(f, mover, 0))) {
		return 1;
	} else {
		return 0;
	}
});

// morgue.dm:323
rt.def("/obj/structure/tray/m_tray/proc/CanAStarPass", function CanAStarPass(f: Frame, ID: Value, dir: Value, caller: Value) {
	f.dot = (!this.density ? 1 : 0);
	if (!rt.istype(caller, T("/atom/movable"))) return f.dot;
	let mover: Value = caller;
	f.dot = (f.dot || mover.checkpass(1));
	return f.dot;
});
