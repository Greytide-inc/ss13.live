// Based on /tg/station's code/game/objects/items/devices/transfer_valve.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9296, "/obj/item/device/transfer_valve", "/obj/item/device", {
	tank_one: null,
	tank_two: null,
	attached_device: null,
	attacher: null,
	valve_open: 0,
	toggle: 1,
	icon: rt.rsc("icons/obj/assemblies.dmi"),
	name: "tank transfer valve",
	icon_state: "valve_1",
	item_state: "ttv",
	desc: "Regulates the transfer of air between two tanks",
	origin_tech: "materials=1;engineering=1",
});

// transfer_valve.dm:19
rt.def("/obj/item/device/transfer_valve/proc/attackby", function* attackby(f: Frame, item: Value, user: Value, params: Value) {
	let A: Value = null;
	if (rt.istype(item, T("/obj/item/weapon/tank"))) {
		if (this.tank_one && this.tank_two) {
			to_chat(user, "<span class='warning'>There are already two tanks attached, remove one first!</span>");
			return f.dot;
		}
		if (!this.tank_one) {
			if (!(yield* user.transferItemToLoc(item, this))) {
				return f.dot;
			}
			this.tank_one = item;
			to_chat(user, "<span class='notice'>You attach the tank to the transfer valve.</span>");
			if (item.w_class > this.w_class) {
				this.w_class = item.w_class;
			}
		} else if (!this.tank_two) {
			if (!(yield* user.transferItemToLoc(item, this))) {
				return f.dot;
			}
			this.tank_two = item;
			to_chat(user, "<span class='notice'>You attach the tank to the transfer valve.</span>");
			if (item.w_class > this.w_class) {
				this.w_class = item.w_class;
			}
		}
		yield* this.update_icon();
	} else if (rt.istype(item, T("/obj/item/device/assembly"))) {
		if ((A = item).secured) {
			to_chat(user, "<span class='notice'>The device is secured.</span>");
			return f.dot;
		}
		if (this.attached_device) {
			to_chat(user, "<span class='warning'>There is already a device attached to the valve, remove it first!</span>");
			return f.dot;
		}
		if (!(yield* user.transferItemToLoc(item, this))) {
			return f.dot;
		}
		this.attached_device = A;
		to_chat(user, `<span class='notice'>You attach the ${item} to the valve controls and secure it.</span>`);
		A.holder = this;
		yield* A.toggle_secure();
		GLOB.bombers += `${key_name(user)} attached a ${item} to a transfer valve.`;
		message_admins(`${key_name_admin(user)} attached a ${item} to a transfer valve.`);
		log_game(`${key_name_admin(user)} attached a ${item} to a transfer valve.`);
		this.attacher = user;
	}
	return f.dot;
}, true);

// transfer_valve.dm:63
rt.def("/obj/item/device/transfer_valve/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let popup: Value = null;
	let $1: any, $3: any, $4: any, $5: any, $6: any;
	yield* user.set_machine(this);
	let $0: any = this.tank_one;
	if (this.tank_one) {
		$1 = fmt("<A href='?src=＃;tankone=1'>Remove</A>", [this]);
	} else {
		$1 = "";
	}
	let $2: any = this.tank_two;
	if (this.tank_two) {
		$3 = fmt("<A href='?src=＃;tanktwo=1'>Remove</A>", [this]);
	} else {
		$3 = "";
	}
	if (this.attached_device) {
		$4 = fmt("<A href='?src=＃;device=1'>＀</A>", [this, this.attached_device]);
	} else {
		$4 = "None";
	}
	if (this.attached_device) {
		$5 = fmt("<A href='?src=＃;rem_device=1'>Remove</A>", [this]);
	} else {
		$5 = "";
	}
	if (this.valve_open) {
		$6 = fmt("<A href='?src=＃;open=1'>Closed</A> <B>Open</B>", [this]);
	} else {
		$6 = fmt("<B>Closed</B> <A href='?src=＃;open=1'>Open</A>", [this]);
	}
	let dat: Value = `<B> Valve properties: </B>\n\t<BR> <B> Attachment one:</B> ${$0} ${$1}\n\t<BR> <B> Attachment two:</B> ${$2} ${$3}\n\t<BR> <B> Valve attachment:</B> ${$4} ${$5}\n\t<BR> <B> Valve status: </B> ${$6}`;
	(popup = (yield* new_(T("/datum/browser"), user, "trans_valve", this.name))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// transfer_valve.dm:76
rt.def("/obj/item/device/transfer_valve/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	yield* parent_proc();
	if (f.usr.stat || f.usr.restrained()) {
		return f.dot;
	}
	if (this.loc == f.usr) {
		if (this.tank_one && rt.at(href_list, "tankone")) {
			yield* this.split_gases();
			this.valve_open = 0;
			this.tank_one.loc = rt.getStep(f, this, 0);
			this.tank_one = null;
			yield* this.update_icon();
			if ((!this.tank_two || this.tank_two.w_class < WEIGHT_CLASS_BULKY) && this.w_class > WEIGHT_CLASS_NORMAL) {
				this.w_class = WEIGHT_CLASS_NORMAL;
			}
		} else if (this.tank_two && rt.at(href_list, "tanktwo")) {
			yield* this.split_gases();
			this.valve_open = 0;
			this.tank_two.loc = rt.getStep(f, this, 0);
			this.tank_two = null;
			yield* this.update_icon();
			if ((!this.tank_one || this.tank_one.w_class < WEIGHT_CLASS_BULKY) && this.w_class > WEIGHT_CLASS_NORMAL) {
				this.w_class = WEIGHT_CLASS_NORMAL;
			}
		} else if (rt.at(href_list, "open")) {
			yield* this.toggle_valve();
		} else if (this.attached_device) {
			if (rt.at(href_list, "rem_device")) {
				this.attached_device.loc = rt.getStep(f, this, 0);
				this.attached_device.holder = null;
				this.attached_device = null;
				yield* this.update_icon();
			}
			if (rt.at(href_list, "device")) {
				yield* this.attached_device.attack_self(f.usr);
			}
		}
		yield* this.attack_self(f.usr);
		yield* this.add_fingerprint(f.usr);
		return f.dot;
	}
	return f.dot;
}, true);

// transfer_valve.dm:115
rt.def("/obj/item/device/transfer_valve/proc/process_activation", function* process_activation(f: Frame, D: Value) {
	if (!this.toggle) return f.dot;
	this.toggle = 0;
	yield* this.toggle_valve();
	rt.spawnTail(f, 50, "/obj/item/device/transfer_valve/proc/process_activation: spawn at game/objects/items/devices/transfer_valve.dm:116", D);
	return f.dot;
}, true);

// a spawn(50) body of /obj/item/device/transfer_valve/proc/process_activation, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/transfer_valve/proc/process_activation: spawn at game/objects/items/devices/transfer_valve.dm:116", function* (f: Frame, D: Value) {
	this.toggle = 1;
	return null;
});

// transfer_valve.dm:120
rt.def("/obj/item/device/transfer_valve/proc/update_icon", function update_icon(f: Frame) {
	let J: Value = null;
	this.cut_overlays();
	this.underlays = null;
	if (!this.tank_one && !this.tank_two && !this.attached_device) {
		this.icon_state = "valve_1";
		return f.dot;
	}
	this.icon_state = "valve";
	if (this.tank_one) {
		this.add_overlay(`${this.tank_one.icon_state}`);
	}
	if (this.tank_two) {
		(J = new_(T("/icon"), this.icon, { icon_state: `${this.tank_two.icon_state}` })).Shift(8, 13);
		this.underlays += J;
	}
	if (!this.attached_device) return f.dot;
	this.add_overlay("device");
	return f.dot;
});

// transfer_valve.dm:138
rt.def("/obj/item/device/transfer_valve/proc/merge_gases", function* merge_gases(f: Frame) {
	this.tank_two.air_contents.volume += this.tank_one.air_contents.volume;
	let temp: Value = (yield* this.tank_one.air_contents.remove_ratio(1));
	yield* this.tank_two.air_contents.merge(temp);
	return f.dot;
}, true);

// transfer_valve.dm:144
rt.def("/obj/item/device/transfer_valve/proc/split_gases", function* split_gases(f: Frame) {
	if (!this.valve_open || !this.tank_one || !this.tank_two) {
		return f.dot;
	}
	let ratio1: Value = this.tank_one.air_contents.volume / this.tank_two.air_contents.volume;
	let temp: Value = (yield* this.tank_two.air_contents.remove_ratio(ratio1));
	yield* this.tank_one.air_contents.merge(temp);
	this.tank_two.air_contents.volume -= this.tank_one.air_contents.volume;
	return f.dot;
}, true);

// transfer_valve.dm:158
rt.def("/obj/item/device/transfer_valve/proc/toggle_valve", function* toggle_valve(f: Frame) {
	let bombturf: Value = null, A: Value = null, attachment: Value = null, attacher_name: Value = null, log_str1: Value = null, log_str2: Value = null, log_attacher: Value = null, mob: Value = null, last_touch_info: Value = null, log_str3: Value = null, bomb_message: Value = null, i: Value = null;
	if (!this.valve_open && this.tank_one && this.tank_two) {
		this.valve_open = 1;
		bombturf = rt.getStep(f, this, 0);
		A = get_area(bombturf);
		attachment = "no device";
		if (this.attached_device) {
			if (rt.istype(this.attached_device, T("/obj/item/device/assembly/signaler"))) {
				attachment = `<A HREF='?_src_=holder;secrets=list_signalers'>${this.attached_device}</A>`;
			} else {
				attachment = this.attached_device;
			}
		}
		attacher_name = "";
		if (!this.attacher) {
			attacher_name = "Unknown";
		} else {
			attacher_name = `${key_name_admin(this.attacher)}`;
		}
		log_str1 = "Bomb valve opened in ";
		log_str2 = `with ${attachment} attacher: ${attacher_name}`;
		log_attacher = "";
		if (this.attacher) {
			log_attacher = `${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [this.attacher])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [this.attacher])}`;
		}
		mob = get_mob_by_key(this.fingerprintslast);
		last_touch_info = "";
		if (mob) {
			last_touch_info = `${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [mob])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [mob])}`;
		}
		log_str3 = ` Last touched by: ${key_name_admin(mob)}`;
		GLOB.bombers += (bomb_message = `${log_str1} ${A.name}${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${bombturf.x};Y=${bombturf.y};Z=${bombturf.z}'>JMP</a>)`} ${log_str2}${log_attacher} ${log_str3}${last_touch_info}`);
		message_admins(bomb_message, 0, 1);
		log_game(`${log_str1} ${A.name}${`(${bombturf.x},${bombturf.y},${bombturf.z})`} ${log_str2} ${log_str3}`);
		yield* this.merge_gases();
		rt.spawnTail(f, 20, "/obj/item/device/transfer_valve/proc/toggle_valve: spawn at game/objects/items/devices/transfer_valve.dm:197", bombturf, A, attachment, attacher_name, log_str1, log_str2, log_attacher, mob, last_touch_info, log_str3, bomb_message, i);
	} else {
		if (!(this.valve_open && this.tank_one && this.tank_two)) return f.dot;
		yield* this.split_gases();
		this.valve_open = 0;
		yield* this.update_icon();
	}
	return f.dot;
}, true);

// a spawn(20) body of /obj/item/device/transfer_valve/proc/toggle_valve, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/transfer_valve/proc/toggle_valve: spawn at game/objects/items/devices/transfer_valve.dm:197", function* (f: Frame, bombturf: Value, A: Value, attachment: Value, attacher_name: Value, log_str1: Value, log_str2: Value, log_attacher: Value, mob: Value, last_touch_info: Value, log_str3: Value, bomb_message: Value, i: Value) {
	i = null;
	i = 0;
	while (i < 5) {
		yield* this.update_icon();
		yield* sleep(10);
		i++;
	}
	yield* this.update_icon();
	return null;
});
