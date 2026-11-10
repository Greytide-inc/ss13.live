// Based on /tg/station's code/game/objects/items/devices/traitordevices.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9293, "/obj/item/device/batterer", "/obj/item/device", {
	times_used: 0,
	max_uses: 2,
	throw_speed: 3,
	throw_range: 7,
	flags: 64,
	name: "mind batterer",
	desc: "A strange device with twin antennas.",
	icon_state: "batterer",
	throwforce: 5,
	w_class: 1,
	item_state: "electronic",
	origin_tech: "magnets=3;combat=3;syndicate=3",
});

// traitordevices.dm:35
rt.def("/obj/item/device/batterer/proc/attack_self", function* attack_self(f: Frame, user: Value, flag: Value, emp: Value) {
	let M: Value = null;
	flag ??= 0;
	emp ??= 0;
	if (!user) {
		return f.dot;
	}
	if (this.times_used >= this.max_uses) {
		to_chat(user, "<span class='danger'>The mind batterer has been burnt out!</span>");
		return f.dot;
	}
	add_logs(user, null, "knocked down people in the area", this);
	for (M of each(urange(10, user, 1), T("/mob/living/carbon/human"))) {
		if (prob(50)) {
			yield* M.Knockdown(rand(200, 400));
			to_chat(M, "<span class='userdanger'>You feel a tremendous, paralyzing wave flood your mind.</span>");
		} else {
			to_chat(M, "<span class='userdanger'>You feel a sudden, electric jolt travel through your head.</span>");
		}
	}
	playsound(this.loc, rt.rsc("sound/misc/interference.ogg"), 50, 1);
	to_chat(user, `<span class='notice'>You trigger ${this}.</span>`);
	if (!((this.times_used += 1) >= this.max_uses)) return f.dot;
	this.icon_state = "battererburnt";
	return f.dot;
}, true);

rt.type(9283, "/obj/item/device/healthanalyzer/rad_laser", "/obj/item/device/healthanalyzer", {
	irradiate: 1,
	intensity: 10,
	wavelength: 10,
	used: 0,
	materials: null,
	origin_tech: "magnets=3;biotech=5;syndicate=3",
});

// traitordevices.dm:70
rt.def("/obj/item/device/healthanalyzer/rad_laser/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 400]);
	return f.dot;
});

// traitordevices.dm:78
rt.def("/obj/item/device/healthanalyzer/rad_laser/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let cooldown: Value = null;
	yield* parent_proc();
	if (!this.irradiate) {
		return f.dot;
	}
	if (!this.used) {
		add_logs(user, M, "irradiated", this);
		cooldown = round(max(10, this.intensity * 5 - this.wavelength / 4)) * 10;
		this.used = 1;
		this.icon_state = "health1";
		this.handle_cooldown(cooldown);
		to_chat(user, `<span class='warning'>Successfully irradiated ${M}.</span>`);
		rt.spawnTail(f, (this.wavelength + this.intensity * 4) * 5, "/obj/item/device/healthanalyzer/rad_laser/proc/attack: spawn at game/objects/items/devices/traitordevices.dm:87", cooldown);
	} else {
		to_chat(user, "<span class='warning'>The radioactive microlaser is still recharging.</span>");
	}
	return f.dot;
}, true);

// a spawn(multiply(add(rt.srcVarI(f, $ic[12]), multiply(rt.srcVarI(f, $ic[13]), 4)), 5)) body of /obj/item/device/healthanalyzer/rad_laser/proc/attack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/healthanalyzer/rad_laser/proc/attack: spawn at game/objects/items/devices/traitordevices.dm:87", function* (f: Frame, cooldown: Value) {
	if (f.args[0]) {
		if (this.intensity >= 5) {
			yield* f.args[0].apply_effect(round(this.intensity / 0.075), 1);
		}
		yield* f.args[0].rad_act(this.intensity * 10);
	}
	return null;
});

// traitordevices.dm:97
rt.def("/obj/item/device/healthanalyzer/rad_laser/proc/handle_cooldown", function handle_cooldown(f: Frame, cooldown: Value) {
	rt.spawnTail(f, cooldown, "/obj/item/device/healthanalyzer/rad_laser/proc/handle_cooldown: spawn at game/objects/items/devices/traitordevices.dm:97", cooldown);
	return f.dot;
});

// a spawn(live(cooldown)) body of /obj/item/device/healthanalyzer/rad_laser/proc/handle_cooldown, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/healthanalyzer/rad_laser/proc/handle_cooldown: spawn at game/objects/items/devices/traitordevices.dm:97", function* (f: Frame, cooldown: Value) {
	this.used = 0;
	this.icon_state = "health";
	return null;
});

// traitordevices.dm:102
rt.def("/obj/item/device/healthanalyzer/rad_laser/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.interact(user);
	return f.dot;
}, true);

// traitordevices.dm:105
rt.def("/obj/item/device/healthanalyzer/rad_laser/proc/interact", function* interact(f: Frame, user: Value) {
	let popup: Value = null;
	yield* user.set_machine(this);
	let cooldown: Value = round(max(10, this.intensity * 5 - this.wavelength / 4));
	let $0: any = this;
	let dat: Value = fmt("Irradiation: <A href='?src=＃;rad=1'>＀</A><br>", [$0, this.irradiate ? "On" : "Off"]);
	dat += fmt("Scan Mode: <a href='?src=＃;mode=1'>", [this]);
	if (!this.scanmode) {
		dat += "Scan Health";
	} else if (this.scanmode == 1) {
		dat += "Scan Reagents";
	} else {
		dat += "Disabled";
	}
	dat += "</a><br><br>";
	dat += fmt("\n\tRadiation Intensity:\n\t<A href='?src=＃;radint=-5'>-</A><A href='?src=＃;radint=-1'>-</A>\n\t＀\n\t<A href='?src=＃;radint=1'>+</A><A href='?src=＃;radint=5'>+</A><BR>\n\n\tRadiation Wavelength:\n\t<A href='?src=＃;radwav=-5'>-</A><A href='?src=＃;radwav=-1'>-</A>\n\t＀\n\t<A href='?src=＃;radwav=1'>+</A><A href='?src=＃;radwav=5'>+</A><BR>\n\tLaser Cooldown: ＀ Seconds<BR>\n\t", [this, this, this.intensity, this, this, this, this, this.wavelength + this.intensity * 4, this, this, cooldown]);
	(popup = (yield* new_(T("/datum/browser"), user, "radlaser", "Radioactive Microlaser Interface", 400, 240))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// traitordevices.dm:136
rt.def("/obj/item/device/healthanalyzer/rad_laser/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let amount: Value = null;
	if (!f.usr.canUseTopic(this)) {
		return 1;
	}
	yield* f.usr.set_machine(this);
	if (rt.at(href_list, "rad")) {
		this.irradiate = (!this.irradiate ? 1 : 0);
	} else if (rt.at(href_list, "mode")) {
		if ((this.scanmode += 1) > 2) {
			this.scanmode = 0;
		}
	} else if (rt.at(href_list, "radint")) {
		amount = text2num(rt.at(href_list, "radint"));
		amount += this.intensity;
		this.intensity = max(1, min(20, amount));
	} else if (rt.at(href_list, "radwav")) {
		amount = text2num(rt.at(href_list, "radwav"));
		amount += this.wavelength;
		this.wavelength = max(0, min(120, amount));
	}
	yield* this.attack_self(f.usr);
	yield* this.add_fingerprint(f.usr);
	return f.dot;
}, true);

rt.type(9294, "/obj/item/device/shadowcloak", "/obj/item/device", {
	user: null,
	charge: 300,
	max_charge: 300,
	on: 0,
	old_alpha: 0,
	name: "cloaker belt",
	desc: "Makes you invisible for short periods of time. Recharges in darkness.",
	icon: rt.rsc("icons/obj/clothing/belts.dmi"),
	icon_state: "utilitybelt",
	item_state: "utility",
	slot_flags: 512,
	attack_verb: null,
	actions_types: null,
});

// traitordevices.dm:176
rt.def("/obj/item/device/shadowcloak/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("whipped", "lashed", "disciplined");

	this.actions_types = list(T("/datum/action/item_action/toggle"));
	return f.dot;
});

// traitordevices.dm:179
rt.def("/obj/item/device/shadowcloak/proc/ui_action_click", function ui_action_click(f: Frame, user: Value) {
	if (user.get_item_by_slot(slot_belt) == this) {
		if (!this.on) {
			this.Activate(f.usr);
		} else {
			this.Deactivate();
		}
	}
	return f.dot;
});

// traitordevices.dm:187
rt.def("/obj/item/device/shadowcloak/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value, user: Value) {
	if (slot != slot_belt) return f.dot;
	return 1;
});

// traitordevices.dm:191
rt.def("/obj/item/device/shadowcloak/proc/Activate", function Activate(f: Frame, user: Value) {
	if (!user) {
		return f.dot;
	}
	to_chat(user, `<span class='notice'>You activate ${this}.</span>`);
	this.user = user;
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	this.old_alpha = user.alpha;
	this.on = 1;
	return f.dot;
});

// traitordevices.dm:200
rt.def("/obj/item/device/shadowcloak/proc/Deactivate", function Deactivate(f: Frame) {
	to_chat(this.user, `<span class='notice'>You deactivate ${this}.</span>`);
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	if (this.user) {
		this.user.alpha = this.old_alpha;
	}
	this.on = 0;
	this.user = null;
	return f.dot;
});

// traitordevices.dm:208
rt.def("/obj/item/device/shadowcloak/proc/dropped", function* dropped(f: Frame, user: Value) {
	yield* parent_proc();
	if (!(user && user.get_item_by_slot(slot_belt) != this)) return f.dot;
	yield* this.Deactivate();
	return f.dot;
}, true);

// traitordevices.dm:213
rt.def("/obj/item/device/shadowcloak/proc/process", function process(f: Frame) {
	let lumcount: Value = null;
	if (this.user.get_item_by_slot(slot_belt) != this) {
		this.Deactivate();
		return f.dot;
	}
	let _T: Value = rt.getStep(f, this, 0);
	if (!this.on) return f.dot;
	if ((lumcount = _T.get_lumcount()) > 0.3) {
		this.charge = max(0, this.charge - 25);
	} else {
		this.charge = min(this.max_charge, this.charge + 50);
	}
	rt.op(f, "Animate", [2, 6], [null, this.user, "alpha", max(0, min(255 - this.charge, 255)), "time", 10]);
	return f.dot;
}, false, { waitfor: false });

rt.type(9295, "/obj/item/device/jammer", "/obj/item/device", {
	active: 0,
	range: 12,
	name: "radio jammer",
	desc: "Device used to disrupt nearby radio communication.",
	icon_state: "jammer",
});

// traitordevices.dm:234
rt.def("/obj/item/device/jammer/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $0: any = user;
	to_chat($0, `<span class='notice'>You ${this.active ? "deactivate" : "activate"} the ${this}<span>`);
	this.active = (!this.active ? 1 : 0);
	if (this.active) {
		(rt.modGl("active_jammers", this, rt.bitOr));
	} else {
		GLOB.active_jammers -= this;
	}
	this.update_icon();
	return f.dot;
});
