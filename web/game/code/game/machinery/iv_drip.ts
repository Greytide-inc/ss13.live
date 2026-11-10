// Based on /tg/station's code/game/machinery/iv_drip.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10799, "/obj/machinery/iv_drip", "/obj/machinery", {
	attached: null,
	mode: 1,
	beaker: null,
	drip_containers: null,
	anchored: 0,
	name: "１IV drip",
	icon: rt.rsc("icons/obj/iv_drip.dmi"),
	icon_state: "iv_drip",
	mouse_drag_pointer: 1,
});

// iv_drip.dm:10
rt.def("/obj/machinery/iv_drip/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.drip_containers = list(T("/obj/item/weapon/reagent_containers/blood"), T("/obj/item/weapon/reagent_containers/food"), T("/obj/item/weapon/reagent_containers/glass"));
	return f.dot;
});

// iv_drip.dm:15
rt.def("/obj/machinery/iv_drip/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* this.update_icon();
	this.drip_containers = typecacheof(this.drip_containers);
	return f.dot;
}, true);

// iv_drip.dm:22
rt.def("/obj/machinery/iv_drip/proc/update_icon", function update_icon(f: Frame) {
	let percent: Value = null;
	if (this.attached) {
		if (this.mode) {
			this.icon_state = "injecting";
		} else {
			this.icon_state = "donating";
		}
	} else if (this.mode) {
		this.icon_state = "injectidle";
	} else {
		this.icon_state = "donateidle";
	}
	this.cut_overlays();
	if (!this.beaker) return f.dot;
	if (this.attached) {
		this.add_overlay("beakeractive");
	} else {
		this.add_overlay("beakeridle");
	}
	if (!this.beaker.reagents.total_volume) return f.dot;
	let filling_overlay: Value = mutable_appearance(rt.rsc("icons/obj/iv_drip.dmi"), "reagent");
	const subject = (percent = round(this.beaker.reagents.total_volume / this.beaker.volume * 100));
	if (rt.inRange(subject, 0, 9)) {
		filling_overlay.icon_state = "reagent0";
	} else if (rt.inRange(subject, 10, 24)) {
		filling_overlay.icon_state = "reagent10";
	} else if (rt.inRange(subject, 25, 49)) {
		filling_overlay.icon_state = "reagent25";
	} else if (rt.inRange(subject, 50, 74)) {
		filling_overlay.icon_state = "reagent50";
	} else if (rt.inRange(subject, 75, 79)) {
		filling_overlay.icon_state = "reagent75";
	} else if (rt.inRange(subject, 80, 90)) {
		filling_overlay.icon_state = "reagent80";
	} else if (rt.inRange(subject, 91, 1e+31)) {
		filling_overlay.icon_state = "reagent100";
	}
	filling_overlay.color = list("#0000", "#0000", "#0000", "#000f", mix_color_from_reagents(this.beaker.reagents.reagent_list));
	this.add_overlay(filling_overlay);
	return f.dot;
});

// iv_drip.dm:62
rt.def("/obj/machinery/iv_drip/proc/MouseDrop", function MouseDrop(f: Frame, target: Value) {
	if (!rt.istype(f.usr, T("/mob/living/carbon/human")) || !f.usr.canUseTopic(this, BE_CLOSE) || !rt.istype(target, T("/mob/living"))) {
		return f.dot;
	}
	if (this.attached) {
		this.visible_message(fmt("<span class='warning'>＀ is detached from ％！.</span>", [this.attached, this]));
		this.attached = null;
		this.update_icon();
		return f.dot;
	}
	if (!target.has_dna()) {
		to_chat(f.usr, "<span class='danger'>The drip beeps: Warning, incompatible creature!</span>");
		return f.dot;
	}
	if (!(this.Adjacent(target) && f.usr.Adjacent(target))) return f.dot;
	if (this.beaker) {
		f.usr.visible_message(fmt("<span class='warning'>＀ attaches ％！ to ％！.</span>", [f.usr, this, target]), fmt("<span class='notice'>You attach ％！ to ％！.</span>", [this, target]));
		this.attached = target;
		if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSmachines.processing += this;
		}
		this.update_icon();
	} else {
		to_chat(f.usr, "<span class='warning'>There's nothing attached to the IV drip!</span>");
	}
	return f.dot;
});

// iv_drip.dm:86
rt.def("/obj/machinery/iv_drip/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (is_type_in_typecache(W, this.drip_containers)) {
		if (this.beaker !== null) {
			to_chat(user, "<span class='warning'>There is already a reagent container loaded!</span>");
			return f.dot;
		}
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		W.loc = this;
		this.beaker = W;
		to_chat(user, fmt("<span class='notice'>You attach ％！ to ％！.</span>", [W, this]));
		yield* this.update_icon();
		return f.dot;
	} else {
		return (yield* parent_proc());
	}
}, true);

// iv_drip.dm:102
rt.def("/obj/machinery/iv_drip/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* new_(T("/obj/item/stack/sheet/metal"), this.loc);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// iv_drip.dm:107
rt.def("/obj/machinery/iv_drip/proc/process", function* process(f: Frame) {
	let transfer_amount: Value = null, fraction: Value = null, amount: Value = null;
	if (!this.attached) {
		return PROCESS_KILL;
	}
	if (!(get_dist(this, this.attached) <= 1 && isturf(this.attached.loc))) {
		to_chat(this.attached, "<span class='userdanger'>The IV drip needle is ripped out of you!</span>");
		yield* this.attached.apply_damage(3, "brute", pick("r_arm", "l_arm"));
		this.attached = null;
		yield* this.update_icon();
		return PROCESS_KILL;
	}
	if (!this.beaker) return f.dot;
	if (this.mode) {
		if (this.beaker.volume > 0) {
			transfer_amount = 5;
			if (rt.istype(this.beaker, T("/obj/item/weapon/reagent_containers/blood"))) {
				transfer_amount = 10;
			}
			fraction = min(transfer_amount / this.beaker.volume, 1);
			yield* this.beaker.reagents.reaction(this.attached, INJECT, fraction, 0);
			yield* this.beaker.reagents.trans_to(this.attached, transfer_amount);
			yield* this.update_icon();
		}
	} else {
		if ((amount = min((amount = this.beaker.reagents.maximum_volume - this.beaker.reagents.total_volume), 4)) == 0) {
			if (prob(5)) {
				this.visible_message(fmt("＄！ pings.", [this]));
			}
			return f.dot;
		}
		if (this.attached.blood_volume < BLOOD_VOLUME_SAFE && prob(5)) {
			this.visible_message(fmt("＄！ beeps loudly.", [this]));
			playsound(this.loc, rt.rsc("sound/machines/twobeep.ogg"), 50, 1);
		}
		yield* this.attached.transfer_blood_to(this.beaker, amount);
		yield* this.update_icon();
	}
	return f.dot;
}, true, { waitfor: false });

// iv_drip.dm:147
rt.def("/obj/machinery/iv_drip/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (this.attached) {
		this.visible_message(fmt("＀ is detached from ％！", [this.attached, this]));
		this.attached = null;
		this.update_icon();
		return f.dot;
	} else if (this.beaker) {
		this.eject_beaker(user);
	} else {
		this.toggle_mode();
	}
	return f.dot;
});

// iv_drip.dm:164
rt.def("/obj/machinery/iv_drip/verb/eject_beaker", function eject_beaker(f: Frame, user: Value) {
	if (!rt.istype(f.usr, T("/mob/living"))) {
		to_chat(f.usr, "<span class='warning'>You can't do that!</span>");
		return f.dot;
	}
	if (f.usr.stat) {
		return f.dot;
	}
	if (!this.beaker) return f.dot;
	this.beaker.loc = rt.getStep(f, this, 0);
	this.beaker = null;
	this.update_icon();
	return f.dot;
}, false, { verb: { name: "Remove IV Container", category: "Object", src: 1, range: 1 }, argTypes: [{ type: 8, path: "/mob" }] });

// iv_drip.dm:181
rt.def("/obj/machinery/iv_drip/verb/toggle_mode", function toggle_mode(f: Frame) {
	if (!rt.istype(f.usr, T("/mob/living"))) {
		to_chat(f.usr, "<span class='warning'>You can't do that!</span>");
		return f.dot;
	}
	if (f.usr.stat) {
		return f.dot;
	}
	this.mode = (!this.mode ? 1 : 0);
	let $0: any = f.usr;
	to_chat($0, `The IV drip is now ${this.mode ? "injecting" : "taking blood"}.`);
	this.update_icon();
	return f.dot;
}, false, { verb: { name: "Toggle Mode", category: "Object", src: 1, range: 1 } });

// iv_drip.dm:194
rt.def("/obj/machinery/iv_drip/proc/examine", function examine(f: Frame) {
	parent_proc();
	if (!rt.isIn(f, f.usr, view(2)) && f.usr != this.loc) {
		return f.dot;
	}
	let $0: any = f.usr;
	to_chat($0, `The IV drip is ${this.mode ? "injecting" : "taking blood"}.`);
	if (this.beaker) {
		if (this.beaker.reagents && rt.len(f, this.beaker.reagents.reagent_list)) {
			to_chat(f.usr, fmt("<span class='notice'>Attached is ＇！ with ＀ units of liquid.</span>", [this.beaker, this.beaker.reagents.total_volume]));
		} else {
			to_chat(f.usr, `<span class='notice'>Attached is an empty ${this.beaker.name}.</span>`);
		}
	} else {
		to_chat(f.usr, "<span class='notice'>No chemicals are attached.</span>");
	}
	to_chat(f.usr, `<span class='notice'>${this.attached ? this.attached : "No one"} is attached.</span>`);
	return f.dot;
}, false, { verb: { src: 1 } });
