// Based on /tg/station's code/modules/assembly/bomb.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9386, "/obj/item/device/onetankbomb", "/obj/item/device", {
	status: 0,
	bombassembly: null,
	bombtank: null,
	throw_speed: 2,
	throw_range: 4,
	flags: 64,
	name: "bomb",
	icon: rt.rsc("icons/obj/tank.dmi"),
	item_state: "assembly",
	throwforce: 5,
	w_class: 3,
	origin_tech: "materials=1;engineering=1",
});

// bomb.dm:16
rt.def("/obj/item/device/onetankbomb/proc/examine", function* examine(f: Frame, user: Value) {
	yield* parent_proc();
	yield* user.examinate(this.bombtank);
	return f.dot;
}, true);

// bomb.dm:23
rt.def("/obj/item/device/onetankbomb/proc/update_icon", function update_icon(f: Frame) {
	if (this.bombtank) {
		this.icon_state = this.bombtank.icon_state;
	}
	if (!this.bombassembly) return f.dot;
	this.add_overlay(this.bombassembly.icon_state);
	this.copy_overlays(this.bombassembly);
	this.add_overlay("bomb_assembly");
	return f.dot;
});

// bomb.dm:28
rt.def("/obj/item/device/onetankbomb/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/device/analyzer"))) {
		yield* this.bombtank.attackby(W, user);
		return f.dot;
	}
	if (rt.istype(W, T("/obj/item/weapon/wrench")) && !this.status) {
		to_chat(user, `<span class='notice'>You disassemble ${this}.</span>`);
		this.bombassembly.loc = user.loc;
		this.bombassembly.master = null;
		this.bombassembly = null;
		this.bombtank.loc = user.loc;
		this.bombtank.master = null;
		this.bombtank = null;
		yield* qdel(this);
		return f.dot;
	}
	if (rt.istype(W, T("/obj/item/weapon/weldingtool")) && W.welding) {
		if (!this.status) {
			this.status = 1;
			GLOB.bombers += `${key_name(user)} welded a single tank bomb. Temp: ${this.bombtank.air_contents.temperature - T0C}`;
			message_admins(`${key_name_admin(user)} welded a single tank bomb. Temp: ${this.bombtank.air_contents.temperature - T0C}`);
			to_chat(user, fmt("<span class='notice'>A pressure hole has been bored to ＀ valve. ＄！ can now be ignited.</span>", [this.bombtank, this.bombtank]));
		} else {
			this.status = 0;
			GLOB.bombers += `${key_name(user)} unwelded a single tank bomb. Temp: ${this.bombtank.air_contents.temperature - T0C}`;
			to_chat(user, "<span class='notice'>The hole has been closed.</span>");
		}
	}
	yield* this.add_fingerprint(user);
	yield* parent_proc();
	return f.dot;
}, true);

// bomb.dm:59
rt.def("/obj/item/device/onetankbomb/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.bombassembly.attack_self(user, 1);
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// bomb.dm:64
rt.def("/obj/item/device/onetankbomb/proc/receive_signal", function* receive_signal(f: Frame) {
	this.visible_message(`${bicon(this)} *beep* *beep*`, "*beep* *beep*");
	yield* sleep(10);
	if (!this) {
		return f.dot;
	}
	if (this.status) {
		yield* this.bombtank.ignite();
	} else {
		yield* this.bombtank.release();
	}
	return f.dot;
}, true);

// bomb.dm:75
rt.def("/obj/item/device/onetankbomb/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	if (!this.bombassembly) return f.dot;
	yield* this.bombassembly.Crossed(AM);
	return f.dot;
}, true);

// bomb.dm:79
rt.def("/obj/item/device/onetankbomb/proc/on_found", function* on_found(f: Frame, finder: Value) {
	if (!this.bombassembly) return f.dot;
	yield* this.bombassembly.on_found(finder);
	return f.dot;
}, true);

// bomb.dm:85
rt.def("/obj/item/weapon/tank/proc/bomb_assemble", function* bomb_assemble(f: Frame, W: Value, user: Value) {
	let S: Value = W;
	let M: Value = user;
	if ((rt.istype(S.a_left, T("/obj/item/device/assembly/igniter")) ? 1 : 0) == (rt.istype(S.a_right, T("/obj/item/device/assembly/igniter")) ? 1 : 0)) {
		return f.dot;
	}
	if (!(yield* M.drop_item())) {
		return f.dot;
	}
	let R: Value = (yield* new_(T("/obj/item/device/onetankbomb"), this.loc));
	yield* M.temporarilyRemoveItemFromInventory(this, 1);
	if (!(yield* M.put_in_hands(R))) {
		yield* this.forceMove(rt.getStep(f, M, 0));
	}
	R.bombassembly = S;
	S.master = R;
	S.loc = R;
	R.bombtank = this;
	this.master = R;
	this.loc = R;
	yield* R.update_icon();
	return f.dot;
}, true);

// bomb.dm:109
rt.def("/obj/item/weapon/tank/proc/ignite", function* ignite(f: Frame) {
	this.air_contents.assert_gases("plasma", "o2");
	let fuel_moles: Value = rt.index(rt.index(this.air_contents.gases, "plasma"), 1) + rt.index(rt.index(this.air_contents.gases, "o2"), 1) / 6;
	this.air_contents.garbage_collect();
	let strength: Value = 1;
	let ground_zero: Value = rt.getStep(f, this.loc, 0);
	this.loc = null;
	if (this.air_contents.temperature > 673.15) {
		if ((strength = fuel_moles / 15) >= 1) {
			yield* explosion(ground_zero, round(strength, 1), round(strength * 2, 1), round(strength * 3, 1), round(strength * 4, 1));
		} else if (strength >= 0.5) {
			yield* explosion(ground_zero, 0, 1, 2, 4);
		} else if (strength >= 0.2) {
			yield* explosion(ground_zero, -1, 0, 1, 2);
		} else {
			yield* ground_zero.assume_air(this.air_contents);
			yield* ground_zero.hotspot_expose(1000, 125);
		}
	} else if (this.air_contents.temperature > 523.15) {
		if ((strength = fuel_moles / 20) >= 1) {
			yield* explosion(ground_zero, 0, round(strength, 1), round(strength * 2, 1), round(strength * 3, 1));
		} else if (strength >= 0.5) {
			yield* explosion(ground_zero, -1, 0, 1, 2);
		} else {
			yield* ground_zero.assume_air(this.air_contents);
			yield* ground_zero.hotspot_expose(1000, 125);
		}
	} else if (this.air_contents.temperature > 373.15) {
		if ((strength = fuel_moles / 25) >= 1) {
			yield* explosion(ground_zero, -1, 0, round(strength, 1), round(strength * 3, 1));
		} else {
			yield* ground_zero.assume_air(this.air_contents);
			yield* ground_zero.hotspot_expose(1000, 125);
		}
	} else {
		yield* ground_zero.assume_air(this.air_contents);
		yield* ground_zero.hotspot_expose(1000, 125);
	}
	this.air_update_turf();
	if (this.master) {
		yield* qdel(this.master);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// bomb.dm:161
rt.def("/obj/item/weapon/tank/proc/release", function* release(f: Frame) {
	let _T: Value = null;
	let removed: Value = (yield* this.air_contents.remove(this.air_contents.total_moles()));
	if (!(_T = rt.getStep(f, this, 0))) {
		return f.dot;
	}
	yield* _T.assume_air(removed);
	this.air_update_turf();
	return f.dot;
}, true);
