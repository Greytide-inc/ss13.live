// Based on /tg/station's code/game/objects/items/devices/radio/electropack.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9333, "/obj/item/device/electropack", "/obj/item/device", {
	on: 1,
	code: 2,
	frequency: 1449,
	shock_cooldown: 0,
	flags: 64,
	name: "electropack",
	desc: "Dance my monkeys! DANCE!!!",
	icon: rt.rsc("icons/obj/radio.dmi"),
	icon_state: "electropack0",
	item_state: "electropack",
	slot_flags: 1024,
	w_class: 5,
	materials: null,
});

// electropack.dm:10
rt.def("/obj/item/device/electropack/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 10000, "$glass", 2500]);
	return f.dot;
});

// electropack.dm:17
rt.def("/obj/item/device/electropack/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} hooks ${user.p_them()}self to the electropack and spams the trigger! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	return 2;
});

// electropack.dm:21
rt.def("/obj/item/device/electropack/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	GLOB.SSradio.add_object(this, this.frequency, GLOB.RADIO_CHAT);
	return f.dot;
}, true);

// electropack.dm:26
rt.def("/obj/item/device/electropack/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.SSradio) {
		yield* GLOB.SSradio.remove_object(this, this.frequency);
	}
	return (yield* parent_proc());
}, true);

// electropack.dm:30
rt.def("/obj/item/device/electropack/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let C: Value = null;
	if (rt.istype(user, T("/mob/living/carbon"))) {
		C = user;
		if (this == C.back) {
			to_chat(user, "<span class='warning'>You need help taking this off!</span>");
			return f.dot;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// electropack.dm:38
rt.def("/obj/item/device/electropack/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let A: Value = null;
	if (rt.istype(W, T("/obj/item/clothing/head/helmet"))) {
		(A = (yield* new_(T("/obj/item/assembly/shock_kit"), user))).icon = rt.rsc("icons/obj/assemblies.dmi");
		if (!(yield* user.transferItemToLoc(W, A))) {
			to_chat(user, `<span class='warning'>${W} is stuck to your hand, you cannot attach it to ${this}!</span>`);
			return f.dot;
		}
		W.master = A;
		A.part1 = W;
		yield* user.transferItemToLoc(this, A, 1);
		this.master = A;
		A.part2 = this;
		yield* user.put_in_hands(A);
		yield* A.add_fingerprint(user);
		if (rt.bitAnd(this.flags, NODROP)) {
			(rt.modField(f, A, "flags", NODROP, rt.bitOr));
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// electropack.dm:61
rt.def("/obj/item/device/electropack/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let M: Value = null;
	let C: Value = f.usr;
	if (f.usr.stat || f.usr.restrained() || C.back == this) {
		return f.dot;
	}
	if (rt.istype(f.usr, T("/mob/living/carbon/human")) && f.usr.contents.Find(this) || f.usr.contents.Find(this.master) || get_dist(this, f.usr) <= 1 && isturf(this.loc)) {
		yield* f.usr.set_machine(this);
		if (rt.at(href_list, "freq")) {
			yield* GLOB.SSradio.remove_object(this, this.frequency);
			this.frequency = sanitize_frequency(this.frequency + text2num(rt.at(href_list, "freq")));
			GLOB.SSradio.add_object(this, this.frequency, GLOB.RADIO_CHAT);
		} else if (rt.at(href_list, "code")) {
			this.code = round((this.code += text2num(rt.at(href_list, "code"))));
			this.code = min(100, this.code);
			this.code = max(1, this.code);
		} else if (rt.at(href_list, "power")) {
			this.on = (!this.on ? 1 : 0);
			this.icon_state = `electropack${this.on}`;
		}
		if (!this.master) {
			if (ismob(this.loc)) {
				yield* this.attack_self(this.loc);
			} else {
				for (M of each(viewers(1, this), T("/mob"))) {
					if (M.client) {
						yield* this.attack_self(M);
					}
				}
			}
		} else if (ismob(this.master.loc)) {
			yield* this.attack_self(this.master.loc);
		} else {
			M = null;
			for (M of each(viewers(1, this.master), T("/mob"))) {
				if (M.client) {
					yield* this.attack_self(M);
				}
			}
		}
	} else {
		rt.op(f, "Browse", [], [f.usr, null, "window=radio"], false);
		return f.dot;
	}
	return f.dot;
}, true);

// electropack.dm:100
rt.def("/obj/item/device/electropack/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
	let L: Value = null, s: Value = null;
	if (!signal || signal.encryption != this.code) {
		return f.dot;
	}
	if (rt.istype(this.loc, T("/mob/living")) && this.on) {
		if (this.shock_cooldown != 0) {
			return f.dot;
		}
		this.shock_cooldown = 1;
		rt.spawnTail(f, 100, "/obj/item/device/electropack/proc/receive_signal: spawn at game/objects/items/devices/radio/electropack.dm:107", signal, L, s);
		yield* step((L = this.loc), pick(GLOB.cardinal));
		to_chat(L, "<span class='danger'>You feel a sharp shock!</span>");
		yield* (s = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(3, 1, L);
		yield* s.start();
		yield* L.Knockdown(100);
	}
	if (this.master) {
		yield* this.master.receive_signal();
	}
	return f.dot;
}, true);

// a spawn(100) body of /obj/item/device/electropack/proc/receive_signal, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/electropack/proc/receive_signal: spawn at game/objects/items/devices/radio/electropack.dm:107", function* (f: Frame, signal: Value, L: Value, s: Value) {
	this.shock_cooldown = 0;
	return null;
});

// electropack.dm:125
rt.def("/obj/item/device/electropack/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let $0: any;
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	yield* user.set_machine(this);
	if (this.on) {
		$0 = "On";
	} else {
		$0 = "Off";
	}
	let dat: Value = fmt("<TT>Turned ＀ -\n<A href='?src=＃;power=1'>Toggle</A><BR>\n<B>Frequency/Code</B> for electropack:<BR>\nFrequency:\n<A href='byond://?src=＃;freq=-10'>-</A>\n<A href='byond://?src=＃;freq=-2'>-</A> ＀\n<A href='byond://?src=＃;freq=2'>+</A>\n<A href='byond://?src=＃;freq=10'>+</A><BR>\n\nCode:\n<A href='byond://?src=＃;code=-5'>-</A>\n<A href='byond://?src=＃;code=-1'>-</A> ＀\n<A href='byond://?src=＃;code=1'>+</A>\n<A href='byond://?src=＃;code=5'>+</A><BR>\n</TT>", [$0, this, this, this, format_frequency(this.frequency), this, this, this, this, this.code, this, this]);
	rt.op(f, "Browse", [], [user, dat, "window=radio"], false);
	onclose(user, "radio");
	return f.dot;
}, true);
