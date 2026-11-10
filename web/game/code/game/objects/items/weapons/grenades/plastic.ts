// Based on /tg/station's code/game/objects/items/weapons/grenades/plastic.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(6921, "/obj/item/weapon/grenade/plastic", "/obj/item/weapon/grenade", {
	target: null,
	plastic_overlay: null,
	nadeassembly: null,
	assemblyattacher: null,
	directional: 0,
	aim_dir: 1,
	boom_sizes: null,
	flags: 4,
	det_time: 10,
	display_timer: 0,
	name: "plastic explosive",
	desc: "Used to put holes in specific areas without too much extra hole.",
	icon_state: "plastic-explosive0",
	item_state: "plastic-explosive",
});

// plastic.dm:18
rt.def("/obj/item/weapon/grenade/plastic/proc/New", function* New(f: Frame) {
	this.plastic_overlay = mutable_appearance(this.icon, `${this.item_state}2`);
	yield* parent_proc();
	return f.dot;
}, true);

// plastic.dm:22
rt.def("/obj/item/weapon/grenade/plastic/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	if (!this.secondary_flags) {
		this.secondary_flags = list();
	}
	rt.setAt(this.secondary_flags, "no_emp_wires", 1);
	return f.dot;
}, true);

// plastic.dm:26
rt.def("/obj/item/weapon/grenade/plastic/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.nadeassembly);
	this.nadeassembly = null;
	this.target = null;
	yield* parent_proc();
	return f.dot;
}, true);

// plastic.dm:32
rt.def("/obj/item/weapon/grenade/plastic/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let A: Value = null;
	if (!this.nadeassembly && rt.istype(I, T("/obj/item/device/assembly_holder"))) {
		A = I;
		if (!(yield* user.transferItemToLoc(I, this))) {
			return (yield* parent_proc());
		}
		this.nadeassembly = A;
		A.master = this;
		this.assemblyattacher = user.ckey;
		to_chat(user, `<span class='notice'>You add ${A} to the ${this.name}.</span>`);
		playsound(this, rt.rsc("sound/weapons/tap.ogg"), 20, 1);
		yield* this.update_icon();
		return f.dot;
	}
	if (this.nadeassembly && rt.istype(I, T("/obj/item/weapon/wirecutters"))) {
		playsound(this, I.usesound, 20, 1);
		yield* this.nadeassembly.forceMove(rt.getStep(f, this, 0));
		this.nadeassembly.master = null;
		this.nadeassembly = null;
		yield* this.update_icon();
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// plastic.dm:55
rt.def("/obj/item/weapon/grenade/plastic/proc/prime", function* prime(f: Frame) {
	let location: Value = null, _T: Value = null, M: Value = null;
	if (this.target) {
		if (!(!this.target || this.target.gc_destroyed)) {
			location = rt.getStep(f, this.target, 0);
			this.target.cut_overlay(this.plastic_overlay, 1);
		}
	} else {
		location = rt.getStep(f, this, 0);
	}
	if (location) {
		if (this.directional && this.target && this.target.density) {
			yield* explosion(rt.getStep(f, (_T = rt.getStep(f, location, this.aim_dir)), this.aim_dir), rt.index(this.boom_sizes, 1), rt.index(this.boom_sizes, 2), rt.index(this.boom_sizes, 3));
		} else {
			yield* explosion(location, rt.index(this.boom_sizes, 1), rt.index(this.boom_sizes, 2), rt.index(this.boom_sizes, 3));
		}
		yield* location.ex_act(2, this.target);
	}
	if (ismob(this.target)) {
		yield* (M = this.target).gib();
	}
	yield* qdel(this);
	return f.dot;
}, true);

// plastic.dm:74
rt.def("/obj/item/weapon/grenade/plastic/proc/receive_signal", function* receive_signal(f: Frame) {
	yield* this.prime();
	return f.dot;
}, true);

// plastic.dm:78
rt.def("/obj/item/weapon/grenade/plastic/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	if (!this.nadeassembly) return f.dot;
	yield* this.nadeassembly.Crossed(AM);
	return f.dot;
}, true);

// plastic.dm:82
rt.def("/obj/item/weapon/grenade/plastic/proc/on_found", function* on_found(f: Frame, finder: Value) {
	if (!this.nadeassembly) return f.dot;
	yield* this.nadeassembly.on_found(finder);
	return f.dot;
}, true);

// plastic.dm:86
rt.def("/obj/item/weapon/grenade/plastic/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (this.nadeassembly) {
		yield* this.nadeassembly.attack_self(user);
		return f.dot;
	}
	let newtime: Value = (yield* g.op(f, "Prompt", [32], [10, "Timer", "Please set the timer.", f.usr, null]));
	if (user.get_active_held_item() != this) return f.dot;
	this.det_time = (newtime = max(10, min(newtime, 60000)));
	to_chat(user, `Timer set for ${this.det_time} seconds.`);
	return f.dot;
}, true);

// plastic.dm:95
rt.def("/obj/item/weapon/grenade/plastic/proc/afterattack", function* afterattack(f: Frame, AM: Value, user: Value, flag: Value) {
	let I: Value = null;
	let $3: any;
	this.aim_dir = rt.getDir(f, user, AM);
	if (!flag) {
		return f.dot;
	}
	if (ismob(AM)) {
		return f.dot;
	}
	to_chat(user, `<span class='notice'>You start planting the ${this}. The timer is set to ${this.det_time}...</span>`);
	if (!(yield* do_after(user, 30, { target: AM }))) return f.dot;
	if (!(yield* user.temporarilyRemoveItemFromInventory(this))) {
		return f.dot;
	}
	this.target = AM;
	yield* this.forceMove(null);
	if (rt.istype(AM, T("/obj/item"))) {
		(I = AM).throw_speed = max(1, I.throw_speed - 3);
		I.throw_range = max(1, I.throw_range - 3);
		I.embed_chance = 0;
	}
	let $0: any = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
	let $1: any = this.name;
	let $2: any = this.target.name;
	if (this.target) {
		$3 = `${`(${this.target.x},${this.target.y},${this.target.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${this.target.x};Y=${this.target.y};Z=${this.target.z}'>JMP</a>)`}`;
	} else {
		$3 = "nonexistent location";
	}
	message_admins(`${$0} planted ${$1} on ${$2} at ${`${$3}`} with ${this.det_time} second fuse`, 0, 1);
	log_game(`${key_name(user)} planted ${this.name} on ${this.target.name} at ${`(${this.x},${this.y},${this.z})`} with ${this.det_time} second fuse`);
	this.target.add_overlay(this.plastic_overlay, 1);
	if (!this.nadeassembly) {
		to_chat(user, `<span class='notice'>You plant the bomb. Timer counting down from ${this.det_time}.</span>`);
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/grenade/plastic/proc/prime"))), this.det_time * 10);
	} else {
		yield* qdel(this);
	}
	return f.dot;
}, true);

// plastic.dm:126
rt.def("/obj/item/weapon/grenade/plastic/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let role: Value = null;
	let $2: any;
	let $0: any = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
	let $1: any = this;
	if (user) {
		$2 = `${`(${user.x},${user.y},${user.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${user.x};Y=${user.y};Z=${user.z}'>JMP</a>)`}`;
	} else {
		$2 = "nonexistent location";
	}
	message_admins(`${$0} suicided with ${$1} at ${`${$2}`}`, 0, 1);
	log_game(`${key_name(user)} suicided with ${this} at ${`(${user.x},${user.y},${user.z})`}`);
	user.visible_message(`<span class='suicide'>${user} activates the ${this} and holds it above ${user.p_their()} head! It looks like ${user.p_theyre()} going out with a bang!</span>`);
	let message_say: Value = "FOR NO RAISIN!";
	if (user.mind) {
		if (user.mind.special_role) {
			if ((role = lowertext(user.mind.special_role)) == "traitor" || role == "syndicate") {
				message_say = "FOR THE SYNDICATE!";
			} else if (role == "changeling") {
				message_say = "FOR THE HIVE!";
			} else if (role == "cultist") {
				message_say = "FOR NAR-SIE!";
			} else if (role == "revolutionary" || role == "head revolutionary") {
				message_say = "VIVA LA REVOLUTION!";
			} else if (user.mind.gang_datum) {
				message_say = `${uppertext(user.mind.gang_datum.name)} RULES!`;
			}
		}
	}
	yield* user.say(message_say);
	yield* explosion(user, 0, 2, 0);
	yield* user.gib(1, 1);
	yield* qdel(this);
	return f.dot;
}, true);

// plastic.dm:150
rt.def("/obj/item/weapon/grenade/plastic/proc/update_icon", function update_icon(f: Frame) {
	if (this.nadeassembly) {
		this.icon_state = `${this.item_state}1`;
	} else {
		this.icon_state = `${this.item_state}0`;
	}
	return f.dot;
});

rt.type(6922, "/obj/item/weapon/grenade/plastic/c4", "/obj/item/weapon/grenade/plastic", {
	timer: 10,
	open_panel: 0,
	flags: 4,
	name: "C4",
	desc: "Used to put holes in specific areas without too much extra hole. A saboteur's favorite.",
	gender: "plural",
	icon: rt.rsc("icons/obj/grenade.dmi"),
	icon_state: "plastic-explosive0",
	item_state: "plasticx",
	w_class: 2,
	origin_tech: "syndicate=1",
});

// plastic.dm:172
rt.def("/obj/item/weapon/grenade/plastic/c4/proc/New", function* New(f: Frame) {
	this.wires = (yield* new_(T("/datum/wires/explosive/c4"), this));
	this.plastic_overlay = mutable_appearance(this.icon, "plastic-explosive2");
	yield* parent_proc();
	return f.dot;
}, true);

// plastic.dm:177
rt.def("/obj/item/weapon/grenade/plastic/c4/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.wires);
	this.wires = null;
	this.target = null;
	return (yield* parent_proc());
}, true);

// plastic.dm:183
rt.def("/obj/item/weapon/grenade/plastic/c4/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let role: Value = null;
	let $2: any;
	user.visible_message(`<span class='suicide'>${user} activates the ${this.name} and holds it above ${user.p_their()} head! It looks like ${user.p_theyre()} going out with a bang!</span>`);
	let message_say: Value = "FOR NO RAISIN!";
	if (user.mind) {
		if (user.mind.special_role) {
			if ((role = lowertext(user.mind.special_role)) == "traitor" || role == "syndicate") {
				message_say = "FOR THE SYNDICATE!";
			} else if (role == "changeling") {
				message_say = "FOR THE HIVE!";
			} else if (role == "cultist") {
				message_say = "FOR NAR-SIE!";
			} else if (role == "revolutionary" || role == "head revolutionary") {
				message_say = "VIVA LA REVOLUTION!";
			} else if (user.mind.gang_datum) {
				message_say = `${uppertext(user.mind.gang_datum.name)} RULES!`;
			}
		}
	}
	yield* user.say(message_say);
	this.target = user;
	let $0: any = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
	let $1: any = this.name;
	if (this) {
		$2 = `${`(${this.x},${this.y},${this.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${this.x};Y=${this.y};Z=${this.z}'>JMP</a>)`}`;
	} else {
		$2 = "nonexistent location";
	}
	message_admins(`${$0} suicided with ${$1} at ${`${$2}`}`, 0, 1);
	message_admins(`${key_name(user)} suicided with ${this.name} at (${this.x},${this.y},${this.z})`);
	yield* sleep(10);
	yield* this.explode(rt.getStep(f, user, 0));
	yield* user.gib(1, 1);
	return f.dot;
}, true);

// plastic.dm:207
rt.def("/obj/item/weapon/grenade/plastic/c4/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		this.open_panel = (!this.open_panel ? 1 : 0);
		to_chat(user, `<span class='notice'>You ${this.open_panel ? "open" : "close"} the wire panel.</span>`);
	} else if (is_wire_tool(I)) {
		yield* this.wires.interact(user);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// plastic.dm:216
rt.def("/obj/item/weapon/grenade/plastic/c4/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let newtime: Value = (yield* g.op(f, "Prompt", [32], [10, "Timer", "Please set the timer.", f.usr, null]));
	if (user.get_active_held_item() != this) return f.dot;
	this.timer = (newtime = max(10, min(newtime, 60000)));
	to_chat(user, `Timer set for ${this.timer} seconds.`);
	return f.dot;
}, true);

// plastic.dm:223
rt.def("/obj/item/weapon/grenade/plastic/c4/proc/afterattack", function* afterattack(f: Frame, AM: Value, user: Value, flag: Value) {
	let S: Value = null, message: Value = null;
	let $3: any;
	if (!flag) {
		return f.dot;
	}
	if (ismob(AM)) {
		return f.dot;
	}
	if (this.loc == AM) {
		return f.dot;
	}
	if (rt.istype(AM, T("/obj/item/weapon/storage")) && !(rt.istype(AM, T("/obj/item/weapon/storage/secure")) || rt.istype(AM, T("/obj/item/weapon/storage/lockbox")))) {
		return f.dot;
	}
	if (rt.istype(AM, T("/obj/item/weapon/storage/secure")) || rt.istype(AM, T("/obj/item/weapon/storage/lockbox"))) {
		if (!(S = AM).locked) {
			return f.dot;
		}
	}
	to_chat(user, "<span class='notice'>You start planting the bomb...</span>");
	if (!(yield* do_after(user, 30, { target: AM }))) return f.dot;
	if (!(yield* user.temporarilyRemoveItemFromInventory(this))) {
		return f.dot;
	}
	this.target = AM;
	yield* this.forceMove(null);
	let $0: any = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
	let $1: any = this.name;
	let $2: any = this.target.name;
	if (this.target) {
		$3 = `${`(${this.target.x},${this.target.y},${this.target.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${this.target.x};Y=${this.target.y};Z=${this.target.z}'>JMP</a>)`}`;
	} else {
		$3 = "nonexistent location";
	}
	GLOB.bombers += (message = `${$0} planted ${$1} on ${$2} at ${`${$3}`} with ${this.timer} second fuse`);
	message_admins(message, 0, 1);
	log_game(`${key_name(user)} planted ${this.name} on ${this.target.name} at ${`(${this.target.x},${this.target.y},${this.target.z})`} with ${this.timer} second fuse`);
	this.target.add_overlay(this.plastic_overlay, 1);
	to_chat(user, `<span class='notice'>You plant the bomb. Timer counting down from ${this.timer}.</span>`);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/grenade/plastic/c4/proc/explode"))), this.timer * 10);
	return f.dot;
}, true);

// plastic.dm:254
rt.def("/obj/item/weapon/grenade/plastic/c4/proc/explode", function* explode(f: Frame) {
	let location: Value = null;
	if (!this || this.gc_destroyed) {
		return f.dot;
	}
	if (this.target) {
		if (!(!this.target || this.target.gc_destroyed)) {
			location = rt.getStep(f, this.target, 0);
			this.target.cut_overlay(this.plastic_overlay, 1);
		}
	} else {
		location = rt.getStep(f, this, 0);
	}
	if (location) {
		yield* location.ex_act(2, this.target);
		yield* explosion(location, 0, 0, 3);
	}
	yield* qdel(this);
	return f.dot;
}, true);
