// Based on /tg/station's code/game/objects/items/weapons/implants/implantpad.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7445, "/obj/item/weapon/implantpad", "/obj/item/weapon", {
	case: null,
	broadcasting: null,
	listening: 1,
	throw_speed: 3,
	throw_range: 5,
	name: "implantpad",
	desc: "Used to modify implants.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "implantpad-0",
	item_state: "electronic",
	w_class: 2,
});

// implantpad.dm:17
rt.def("/obj/item/weapon/implantpad/proc/update_icon", function update_icon(f: Frame) {
	if (this.case) {
		this.icon_state = "implantpad-1";
	} else {
		this.icon_state = "implantpad-0";
	}
	return f.dot;
});

// implantpad.dm:23
rt.def("/obj/item/weapon/implantpad/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.case && user.is_holding(this)) {
		yield* user.put_in_active_hand(this.case);
		yield* this.case.add_fingerprint(user);
		this.case = null;
		yield* this.add_fingerprint(user);
		yield* this.update_icon();
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// implantpad.dm:36
rt.def("/obj/item/weapon/implantpad/proc/attackby", function* attackby(f: Frame, C: Value, user: Value, params: Value) {
	if (rt.istype(C, T("/obj/item/weapon/implantcase"))) {
		if (!this.case) {
			if (!(yield* user.transferItemToLoc(C, this))) {
				return f.dot;
			}
			this.case = C;
		}
		yield* this.update_icon();
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// implantpad.dm:46
rt.def("/obj/item/weapon/implantpad/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* user.set_machine(this);
	let dat: Value = "<B>Implant Mini-Computer:</B><HR>";
	if (this.case) {
		if (this.case.imp) {
			if (rt.istype(this.case.imp, T("/obj/item/weapon/implant"))) {
				dat += this.case.imp.get_data();
			}
		} else {
			dat += "The implant casing is empty.";
		}
	} else {
		dat += "Please insert an implant casing!";
	}
	rt.op(f, "Browse", [], [user, dat, "window=implantpad"], false);
	onclose(user, "implantpad");
	return f.dot;
}, true);

// implantpad.dm:61
rt.def("/obj/item/weapon/implantpad/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let M: Value = null;
	yield* parent_proc();
	if (f.usr.stat) {
		return f.dot;
	}
	if (f.usr.contents.Find(this) || get_dist(this, f.usr) <= 1 && isturf(this.loc)) {
		yield* f.usr.set_machine(this);
		if (ismob(this.loc)) {
			yield* this.attack_self(this.loc);
		} else {
			for (M of each(viewers(1, this), T("/mob"))) {
				if (M.client) {
					yield* this.attack_self(M);
				}
			}
		}
		yield* this.add_fingerprint(f.usr);
	} else {
		rt.op(f, "Browse", [], [f.usr, null, "window=implantpad"], false);
	}
	return f.dot;
}, true);
