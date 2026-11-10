// Based on /tg/station's code/game/objects/structures/janicart.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(12788, "/obj/structure/janitorialcart", "/obj/structure", {
	amount_per_transfer_from_this: 5,
	mybag: null,
	mymop: null,
	myspray: null,
	myreplacer: null,
	signs: 0,
	max_signs: 4,
	anchored: 0,
	container_type: 4096,
	name: "janitorial cart",
	desc: "This is the alpha and omega of sanitation.",
	icon: rt.rsc("icons/obj/janitor.dmi"),
	icon_state: "cart",
	density: 1,
}, { const: ["max_signs"] });

// janicart.dm:20
rt.def("/obj/structure/janitorialcart/proc/New", function* New(f: Frame) {
	yield* this.create_reagents(100);
	yield* parent_proc();
	return f.dot;
}, true);

// janicart.dm:25
rt.def("/obj/structure/janitorialcart/proc/wet_mop", function* wet_mop(f: Frame, mop: Value, user: Value) {
	if (this.reagents.total_volume < 1) {
		to_chat(user, `<span class='warning'>${this} is out of water!</span>`);
		return 0;
	} else {
		yield* this.reagents.trans_to(mop, 5);
		to_chat(user, `<span class='notice'>You wet ${mop} in ${this}.</span>`);
		playsound(this.loc, rt.rsc("sound/effects/slosh.ogg"), 25, 1);
		return 1;
	}
}, true);

// janicart.dm:35
rt.def("/obj/structure/janitorialcart/proc/put_in_cart", function* put_in_cart(f: Frame, I: Value, user: Value) {
	if (!(yield* user.drop_item())) {
		return f.dot;
	}
	I.loc = this;
	yield* this.updateUsrDialog();
	to_chat(user, `<span class='notice'>You put ${I} into ${this}.</span>`);
	return f.dot;
}, true);

// janicart.dm:44
rt.def("/obj/structure/janitorialcart/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let m: Value = null, t: Value = null, l: Value = null;
	let fail_msg: Value = `<span class='warning'>There is already one of those in ${this}!</span>`;
	if (rt.istype(I, T("/obj/item/weapon/mop"))) {
		if ((m = I).reagents.total_volume < m.reagents.maximum_volume) {
			if (yield* this.wet_mop(m, user)) {
				return f.dot;
			}
		}
		if (!this.mymop) {
			yield* m.janicart_insert(user, this);
		} else {
			to_chat(user, fail_msg);
		}
	} else if (rt.istype(I, T("/obj/item/weapon/storage/bag/trash"))) {
		if (!this.mybag) {
			yield* (t = I).janicart_insert(user, this);
		} else {
			to_chat(user, fail_msg);
		}
	} else if (rt.istype(I, T("/obj/item/weapon/reagent_containers/spray/cleaner"))) {
		if (!this.myspray) {
			yield* this.put_in_cart(I, user);
			this.myspray = I;
			yield* this.update_icon();
		} else {
			to_chat(user, fail_msg);
		}
	} else if (rt.istype(I, T("/obj/item/device/lightreplacer"))) {
		if (!this.myreplacer) {
			yield* (l = I).janicart_insert(user, this);
		} else {
			to_chat(user, fail_msg);
		}
	} else if (rt.istype(I, T("/obj/item/weapon/caution"))) {
		if (this.signs < 4) {
			yield* this.put_in_cart(I, user);
			this.signs++;
			yield* this.update_icon();
		} else {
			to_chat(user, `<span class='warning'>${this} can't hold any more signs!</span>`);
		}
	} else if (this.mybag) {
		yield* this.mybag.attackby(I, user);
	} else if (rt.istype(I, T("/obj/item/weapon/crowbar"))) {
		user.visible_message(`${user} begins to empty the contents of ${this}.`, `<span class='notice'>You begin to empty the contents of ${this}...</span>`);
		if (yield* do_after(user, 30 * I.toolspeed, { target: this })) {
			to_chat(f.usr, `<span class='notice'>You empty the contents of ${this}'s bucket onto the floor.</span>`);
			yield* this.reagents.reaction(this.loc);
			yield* this.reagents.clear_reagents();
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// janicart.dm:94
rt.def("/obj/structure/janitorialcart/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let dat: Value = null, popup: Value = null;
	yield* user.set_machine(this);
	if (this.mybag) {
		dat += fmt("<a href='?src=＃;garbage=1'>＀</a><br>", [this, this.mybag.name]);
	}
	if (this.mymop) {
		dat += fmt("<a href='?src=＃;mop=1'>＀</a><br>", [this, this.mymop.name]);
	}
	if (this.myspray) {
		dat += fmt("<a href='?src=＃;spray=1'>＀</a><br>", [this, this.myspray.name]);
	}
	if (this.myreplacer) {
		dat += fmt("<a href='?src=＃;replacer=1'>＀</a><br>", [this, this.myreplacer.name]);
	}
	if (this.signs) {
		dat += fmt("<a href='?src=＃;sign=1'>＀ sign５</a><br>", [this, this.signs]);
	}
	(popup = (yield* new_(T("/datum/browser"), user, "janicart", this.name, 240, 160))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// janicart.dm:112
rt.def("/obj/structure/janitorialcart/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let Sign: Value = null;
	if (!(get_dist(this, f.usr) <= 1)) {
		return f.dot;
	}
	if (!rt.istype(f.usr, T("/mob/living"))) {
		return f.dot;
	}
	let user: Value = f.usr;
	if (rt.at(href_list, "garbage")) {
		if (this.mybag) {
			yield* user.put_in_hands(this.mybag);
			to_chat(user, `<span class='notice'>You take ${this.mybag} from ${this}.</span>`);
			this.mybag = null;
		}
	}
	if (rt.at(href_list, "mop")) {
		if (this.mymop) {
			yield* user.put_in_hands(this.mymop);
			to_chat(user, `<span class='notice'>You take ${this.mymop} from ${this}.</span>`);
			this.mymop = null;
		}
	}
	if (rt.at(href_list, "spray")) {
		if (this.myspray) {
			yield* user.put_in_hands(this.myspray);
			to_chat(user, `<span class='notice'>You take ${this.myspray} from ${this}.</span>`);
			this.myspray = null;
		}
	}
	if (rt.at(href_list, "replacer")) {
		if (this.myreplacer) {
			yield* user.put_in_hands(this.myreplacer);
			to_chat(user, `<span class='notice'>You take ${this.myreplacer} from ${this}.</span>`);
			this.myreplacer = null;
		}
	}
	if (rt.at(href_list, "sign")) {
		if (this.signs) {
			if (Sign = rt.locateIn(f, T("/obj/item/weapon/caution"), this)) {
				yield* user.put_in_hands(Sign);
				to_chat(user, fmt("<span class='notice'>You take ＇！ from ＀.</span>", [Sign, this]));
				this.signs--;
			} else {
				warning(`${`Signs (${this.signs}) didn't match contents`} in ${"code/game/objects/structures/janicart.dm"} at line ${145} src: ${this} usr: ${f.usr}.`);
				this.signs = 0;
			}
		}
	}
	yield* this.update_icon();
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// janicart.dm:153
rt.def("/obj/structure/janitorialcart/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (this.mybag) {
		this.add_overlay("cart_garbage");
	}
	if (this.mymop) {
		this.add_overlay("cart_mop");
	}
	if (this.myspray) {
		this.add_overlay("cart_spray");
	}
	if (this.myreplacer) {
		this.add_overlay("cart_replacer");
	}
	if (!this.signs) return f.dot;
	this.add_overlay(`cart_sign${this.signs}`);
	return f.dot;
});
