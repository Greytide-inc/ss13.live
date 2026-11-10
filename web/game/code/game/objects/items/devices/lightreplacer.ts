// Based on /tg/station's code/game/objects/items/devices/lightreplacer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9260, "/obj/item/device/lightreplacer", "/obj/item/device", {
	max_uses: 20,
	uses: 0,
	emagged: 0,
	failmsg: "",
	increment: 5,
	decrement: 1,
	charge: 1,
	bulb_shards: 0,
	shards_required: 4,
	flags: 64,
	name: "light replacer",
	desc: "A device to automatically replace lights. Refill with broken or working lightbulbs, or sheets of glass.",
	icon: rt.rsc("icons/obj/janitor.dmi"),
	icon_state: "lightreplacer0",
	item_state: "electronic",
	slot_flags: 512,
	origin_tech: "magnets=3;engineering=4",
});

// lightreplacer.dm:70
rt.def("/obj/item/device/lightreplacer/proc/New", function* New(f: Frame) {
	this.uses = this.max_uses / 2;
	this.failmsg = `The ${this.name}'s refill light blinks red.`;
	yield* parent_proc();
	return f.dot;
}, true);

// lightreplacer.dm:75
rt.def("/obj/item/device/lightreplacer/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, this.status_string());
	return f.dot;
}, false);

// lightreplacer.dm:80
rt.def("/obj/item/device/lightreplacer/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let G: Value = null, L: Value = null, I: Value = null, L_4: Value = null;
	if (rt.istype(W, T("/obj/item/stack/sheet/glass"))) {
		G = W;
		if (this.uses >= this.max_uses) {
			to_chat(user, `<span class='warning'>${this.name} is full.</span>`);
			return f.dot;
		} else if (yield* G.use(this.decrement)) {
			this.AddUses(this.increment);
			to_chat(user, fmt("<span class='notice'>You insert a piece of glass into the ＀. You have ＀ light５ remaining.</span>", [this.name, this.uses]));
			return f.dot;
		} else {
			to_chat(user, "<span class='warning'>You need one sheet of glass to replace lights!</span>");
		}
	}
	if (rt.istype(W, T("/obj/item/weapon/shard"))) {
		if (this.uses >= this.max_uses) {
			to_chat(user, `<span class='warning'>${this.name} is full.</span>`);
			return f.dot;
		}
		if (!(yield* user.temporarilyRemoveItemFromInventory(W))) {
			return f.dot;
		}
		this.AddUses(round(this.increment * 0.75));
		to_chat(user, fmt("<span class='notice'>You insert a shard of glass into the ＀. You have ＀ light５ remaining.</span>", [this.name, this.uses]));
		yield* qdel(W);
		return f.dot;
	}
	if (rt.istype(W, T("/obj/item/weapon/light"))) {
		if ((L = W).status == 0) {
			if (this.uses < this.max_uses) {
				if (!(yield* user.temporarilyRemoveItemFromInventory(W))) {
					return f.dot;
				}
				this.AddUses(1);
				yield* qdel(L);
			}
		} else {
			if (!(yield* user.temporarilyRemoveItemFromInventory(W))) {
				return f.dot;
			}
			to_chat(user, `<span class='notice'>You insert the ${L.name} into the ${this.name}</span>`);
			this.AddShards(1, user);
			yield* qdel(L);
		}
		return f.dot;
	}
	if (!rt.istype(W, T("/obj/item/weapon/storage"))) return f.dot;
	let S: Value = W;
	let found_lightbulbs: Value = 0;
	let replaced_something: Value = 1;
	for (I of each(S.contents, T("/obj/item"))) {
		if (rt.istype(I, T("/obj/item/weapon/light"))) {
			L_4 = I;
			found_lightbulbs = 1;
			if (this.uses >= this.max_uses) {
				break;
			}
			if (L_4.status == 0) {
				replaced_something = 1;
				this.AddUses(1);
				yield* qdel(L_4);
			} else if (L_4.status == LIGHT_BROKEN || L_4.status == LIGHT_BURNED) {
				replaced_something = 1;
				this.AddShards(1, user);
				yield* qdel(L_4);
			}
		}
	}
	if (!found_lightbulbs) {
		to_chat(user, fmt("<span class='warning'>＄！ contains no bulbs.</span>", [S]));
		return f.dot;
	}
	if (!replaced_something && this.uses == this.max_uses) {
		to_chat(user, fmt("<span class='warning'>＄！ is full!</span>", [this]));
		return f.dot;
	}
	to_chat(user, fmt("<span class='notice'>You fill ％！ with lights from ％！. ", [this, S]) + this.status_string() + "</span>");
	return f.dot;
}, true);

// lightreplacer.dm:151
rt.def("/obj/item/device/lightreplacer/proc/emag_act", function emag_act(f: Frame) {
	if (this.emagged) return f.dot;
	this.Emag();
	return f.dot;
});

// lightreplacer.dm:155
rt.def("/obj/item/device/lightreplacer/proc/attack_self", function attack_self(f: Frame, user: Value) {
	to_chat(user, this.status_string());
	return f.dot;
});

// lightreplacer.dm:158
rt.def("/obj/item/device/lightreplacer/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `lightreplacer${this.emagged}`;
	return f.dot;
});

// lightreplacer.dm:161
rt.def("/obj/item/device/lightreplacer/proc/status_string", function status_string(f: Frame) {
	return fmt("It has ＀ light５ remaining (plus ＀ fragment５).", [this.uses, this.bulb_shards]);
});

// lightreplacer.dm:164
rt.def("/obj/item/device/lightreplacer/proc/Use", function Use(f: Frame, user: Value) {
	playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 50, 1);
	this.AddUses(-1);
	return 1;
});

// lightreplacer.dm:170
rt.def("/obj/item/device/lightreplacer/proc/AddUses", function AddUses(f: Frame, amount: Value) {
	amount ??= 1;
	this.uses = max(0, min(this.uses + amount, this.max_uses));
	return f.dot;
});

// lightreplacer.dm:173
rt.def("/obj/item/device/lightreplacer/proc/AddShards", function AddShards(f: Frame, amount: Value, user: Value) {
	let new_bulbs: Value = null;
	amount ??= 1;
	this.bulb_shards += amount;
	if ((new_bulbs = round(this.bulb_shards / this.shards_required)) > 0) {
		this.AddUses(new_bulbs);
	}
	this.bulb_shards = this.bulb_shards % this.shards_required;
	if (new_bulbs != 0) {
		to_chat(user, fmt("<span class='notice'>＄！ has fabricated a new bulb from the broken glass it has stored. It now has ＀ uses.</span>", [this, this.uses]));
		playsound(this.loc, rt.rsc("sound/machines/ding.ogg"), 50, 1);
	}
	return new_bulbs;
});

// lightreplacer.dm:184
rt.def("/obj/item/device/lightreplacer/proc/Charge", function Charge(f: Frame, user: Value) {
	if (!((this.charge += 1) > 3)) return f.dot;
	this.AddUses(1);
	this.charge = 1;
	return f.dot;
});

// lightreplacer.dm:191
rt.def("/obj/item/device/lightreplacer/proc/ReplaceLight", function* ReplaceLight(f: Frame, target: Value, U: Value) {
	let L2: Value = null;
	if (target.status != LIGHT_OK) {
		if (yield* this.CanUse(U)) {
			if (!this.Use(U)) {
				return f.dot;
			}
			to_chat(U, fmt("<span class='notice'>You replace the ＀ with ％！.</span>", [target.fitting, this]));
			if (target.status != LIGHT_EMPTY) {
				this.AddShards(1, U);
				target.status = LIGHT_EMPTY;
				yield* target.update();
			}
			L2 = (yield* new_(target.light_type));
			target.status = L2.status;
			target.switchcount = L2.switchcount;
			target.rigged = this.emagged;
			target.brightness = L2.brightness;
			target.on = target.has_power();
			yield* target.update();
			yield* qdel(L2);
			if (target.on && target.rigged) {
				yield* target.explode();
			}
			return f.dot;
		} else {
			to_chat(U, this.failmsg);
			return f.dot;
		}
	} else {
		to_chat(U, `<span class='warning'>There is a working ${target.fitting} already inserted!</span>`);
		return f.dot;
	}
}, true);

// lightreplacer.dm:223
rt.def("/obj/item/device/lightreplacer/proc/Emag", function Emag(f: Frame) {
	this.emagged = (!this.emagged ? 1 : 0);
	playsound(this.loc, "sparks", 100, 1);
	if (this.emagged) {
		this.name = `shortcircuited ${rt.initial(f, this, "name")}`;
	} else {
		this.name = rt.initial(f, this, "name");
	}
	this.update_icon();
	return f.dot;
});

// lightreplacer.dm:232
rt.def("/obj/item/device/lightreplacer/proc/CanUse", function* CanUse(f: Frame, user: Value) {
	yield* this.add_fingerprint(user);
	if (this.uses > 0) {
		return 1;
	} else {
		return 0;
	}
}, true);

// lightreplacer.dm:239
rt.def("/obj/item/device/lightreplacer/proc/afterattack", function* afterattack(f: Frame, _T: Value, U: Value, proximity: Value) {
	let A: Value = null;
	if (!proximity) {
		return f.dot;
	}
	if (!isturf(_T)) {
		return f.dot;
	}
	let used: Value = 0;
	for (A of each(_T, T("/atom"))) {
		if (!(yield* this.CanUse(U))) {
			break;
		}
		used = 1;
		if (rt.istype(A, T("/obj/machinery/light"))) {
			yield* this.ReplaceLight(A, U);
		}
	}
	if (used) return f.dot;
	to_chat(U, this.failmsg);
	return f.dot;
}, true);

// lightreplacer.dm:256
rt.def("/obj/item/device/lightreplacer/proc/janicart_insert", function* janicart_insert(f: Frame, user: Value, J: Value) {
	yield* J.put_in_cart(this, user);
	J.myreplacer = this;
	yield* J.update_icon();
	return f.dot;
}, true);
