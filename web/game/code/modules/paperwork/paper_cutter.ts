// Based on /tg/station's code/modules/paperwork/paper_cutter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7619, "/obj/item/weapon/papercutter", "/obj/item/weapon", {
	storedpaper: null,
	storedcutter: null,
	cuttersecured: 1,
	pass_flags: 1,
	name: "paper cutter",
	desc: "Standard office equipment. Precisely cuts paper using a large blade.",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "papercutter",
	force: 5,
	throwforce: 5,
	w_class: 3,
});

// paper_cutter.dm:16
rt.def("/obj/item/weapon/papercutter/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.storedcutter = (yield* new_(T("/obj/item/weapon/hatchet/cutterblade"), this));
	yield* this.update_icon();
	return f.dot;
}, true);

// paper_cutter.dm:23
rt.def("/obj/item/weapon/papercutter/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let C: Value = null, BP: Value = null;
	if (this.storedcutter) {
		user.visible_message(`<span class='suicide'>${user} is beheading ${user.p_them()}self with ${this.name}! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
		if (rt.istype(user, T("/mob/living/carbon"))) {
			C = user;
			if (BP = C.get_bodypart("head")) {
				yield* BP.drop_limb();
				playsound(this.loc, pick(rt.rsc("sound/misc/desceration-01.ogg"), rt.rsc("sound/misc/desceration-02.ogg"), rt.rsc("sound/misc/desceration-01.ogg")), 50, 1, -1);
			}
		}
		return 1;
	} else {
		user.visible_message(`<span class='suicide'>${user} repeatedly bashes ${this.name} against ${user.p_their()} head! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
		playsound(this.loc, rt.rsc("sound/items/gavel.ogg"), 50, 1, -1);
		return 1;
	}
}, true);

// paper_cutter.dm:38
rt.def("/obj/item/weapon/papercutter/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	parent_proc();
	this.cut_overlays();
	if (this.storedcutter) {
		$0 = `${rt.initial(f, this, "icon_state")}-cutter`;
	} else {
		$0 = `${rt.initial(f, this, "icon_state")}`;
	}
	this.icon_state = $0;
	if (!this.storedpaper) return f.dot;
	this.add_overlay("paper");
	return f.dot;
});

// paper_cutter.dm:46
rt.def("/obj/item/weapon/papercutter/proc/attackby", function* attackby(f: Frame) {
	let $0: any, $1: any, $2: any;
	if (rt.istype(f.args[0], T("/obj/item/weapon/paper")) && !this.storedpaper) {
		if (!(yield* f.args[1].drop_item())) {
			return f.dot;
		}
		playsound(this.loc, "pageturn", 60, 1);
		to_chat(f.args[1], `<span class='notice'>You place ${f.args[0]} in ${this}.</span>`);
		f.args[0].loc = this;
		this.storedpaper = f.args[0];
		yield* this.update_icon();
		return f.dot;
	}
	if (rt.istype(f.args[0], T("/obj/item/weapon/hatchet/cutterblade")) && !this.storedcutter) {
		if (!(yield* f.args[1].drop_item())) {
			return f.dot;
		}
		to_chat(f.args[1], `<span class='notice'>You replace ${this}'s ${f.args[0]}.</span>`);
		f.args[0].loc = this;
		this.storedcutter = f.args[0];
		yield* this.update_icon();
		return f.dot;
	}
	if (rt.istype(f.args[0], T("/obj/item/weapon/screwdriver")) && this.storedcutter) {
		playsound(this, f.args[0].usesound, 50, 1);
		$0 = f.args[1];
		$1 = this.storedcutter;
		if (this.cuttersecured) {

			$2 = "unsecured";
		} else {
			$2 = "secured";
		}
		to_chat($0, `<span class='notice'>${$1} has been ${$2}.</span>`);
		this.cuttersecured = (!this.cuttersecured ? 1 : 0);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["P", "user", "params"] });

// paper_cutter.dm:72
rt.def("/obj/item/weapon/papercutter/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* this.add_fingerprint(user);
	if (!this.storedcutter) {
		to_chat(user, `<span class='notice'>The cutting blade is gone! You can't use ${this} now.</span>`);
		return f.dot;
	}
	if (!this.cuttersecured) {
		to_chat(user, `<span class='notice'>You remove ${this}'s ${this.storedcutter}.</span>`);
		yield* user.put_in_hands(this.storedcutter);
		this.storedcutter = null;
		yield* this.update_icon();
	}
	if (!this.storedpaper) return f.dot;
	playsound(this.loc, rt.rsc("sound/weapons/slash.ogg"), 50, 1);
	to_chat(user, `<span class='notice'>You neatly cut ${this.storedpaper}.</span>`);
	this.storedpaper = null;
	yield* qdel(this.storedpaper);
	yield* new_(T("/obj/item/weapon/paperslip"), rt.getStep(f, this, 0));
	yield* new_(T("/obj/item/weapon/paperslip"), rt.getStep(f, this, 0));
	yield* this.update_icon();
	return f.dot;
}, true);

// paper_cutter.dm:94
rt.def("/obj/item/weapon/papercutter/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value) {
	let M: Value = null, H: Value = null;
	if ((M = f.usr).incapacitated() || !this.Adjacent(M)) {
		return f.dot;
	}
	if (over_object == M) {
		yield* M.put_in_hands(this);
	} else if (rt.istype(over_object, T("/obj/screen/inventory/hand"))) {
		H = over_object;
		yield* M.putItemFromInventoryInHandIfPossible(this, H.held_index);
	}
	yield* this.add_fingerprint(M);
	return f.dot;
}, true);

rt.type(7620, "/obj/item/weapon/paperslip", "/obj/item/weapon", {
	name: "paper slip",
	desc: "A little slip of paper left over after a larger piece was cut. Whoa.",
	icon_state: "paperslip",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	resistance_flags: 4,
	obj_integrity: 50,
	max_integrity: 50,
});

// paper_cutter.dm:117
rt.def("/obj/item/weapon/paperslip/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.pixel_x = rand(-5, 5);
	this.pixel_y = rand(-5, 5);
	return f.dot;
}, true);
