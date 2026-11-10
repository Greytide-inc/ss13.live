// Based on /tg/station's code/game/objects/structures/guncase.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(12777, "/obj/structure/guncase", "/obj/structure", {
	case_type: "",
	gun_category: rt.typePath("/obj/item/weapon/gun"),
	open: 1,
	capacity: 4,
	anchored: 0,
	name: "gun locker",
	desc: "A locker that holds guns.",
	icon: rt.rsc("icons/obj/closet.dmi"),
	icon_state: "shotguncase",
	density: 1,
	opacity: 0,
});

// guncase.dm:16
rt.def("/obj/structure/guncase/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	let I: Value = null;
	yield* parent_proc();
	if (mapload) {
		for (I of each(this.loc.contents, T("/obj/item"))) {
			if (rt.op(f, "IsType", [], [I, this.gun_category])) {
				yield* I.forceMove(this);
			}
			if (rt.len(f, this.contents) >= this.capacity) {
				break;
			}
		}
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// guncase.dm:26
rt.def("/obj/structure/guncase/proc/update_icon", function update_icon(f: Frame) {
	let gun_overlay: Value = null, i: Value = null;
	let $e: any;
	this.cut_overlays();
	if (this.case_type && rt.length(this.contents)) {
		gun_overlay = mutable_appearance(this.icon, this.case_type);
		rt.forRange(f, 0, 1, rt.len(f, this.contents), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			gun_overlay.pixel_x = 3 * (i - 1);
			this.add_overlay(gun_overlay);
		}
		rt.endFor(f, 0);
	}
	if (this.open) {
		this.add_overlay(`${this.icon_state}_open`);
	} else {
		this.add_overlay(`${this.icon_state}_door`);
	}
	return f.dot;
});

// guncase.dm:38
rt.def("/obj/structure/guncase/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(user, T("/mob/living/silicon/robot")) || rt.istype(user, T("/mob/living/carbon/alien"))) {
		return f.dot;
	}
	if (rt.op(f, "IsType", [], [I, this.gun_category]) && this.open) {
		if (rt.length(this.contents) < this.capacity) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			yield* I.forceMove(this);
			to_chat(user, `<span class='notice'>You place ${I} in ${this}.</span>`);
			yield* this.update_icon();
		} else {
			to_chat(user, `<span class='warning'>${this} is full.</span>`);
		}
		return f.dot;
	} else if (user.a_intent != "harm") {
		this.open = (!this.open ? 1 : 0);
		yield* this.update_icon();
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// guncase.dm:58
rt.def("/obj/structure/guncase/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (rt.istype(user, T("/mob/living/silicon/robot")) || rt.istype(user, T("/mob/living/carbon/alien"))) {
		return f.dot;
	}
	if (rt.len(f, this.contents) && this.open) {
		yield* this.ShowWindow(user);
	} else {
		this.open = (!this.open ? 1 : 0);
		yield* this.update_icon();
	}
	return f.dot;
}, true);

// guncase.dm:67
rt.def("/obj/structure/guncase/proc/ShowWindow", function* ShowWindow(f: Frame, user: Value) {
	let i: Value = null, I: Value = null, popup: Value = null;
	let $e: any;
	let dat: Value = "<div class='block'>\n\t\t\t\t<h3>Stored Guns</h3>\n\t\t\t\t<table align='center'>";
	if (rt.length(this.contents)) {
		rt.forRange(f, 0, 1, rt.len(f, this.contents), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			I = rt.index(this.contents, i);
			dat += fmt("<tr><A href='?src=＃;retrieve=＃'>＀</A><br>", [this, I, I.name]);
		}
		rt.endFor(f, 0);
	}
	dat += "</table></div>";
	(popup = (yield* new_(T("/datum/browser"), user, "gunlocker", `<div align='center'>${this.name}</div>`, 350, 300))).set_content(dat);
	yield* popup.open(0);
	return f.dot;
}, true);

// guncase.dm:81
rt.def("/obj/structure/guncase/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let O: Value = null;
	if (!rt.at(href_list, "retrieve")) return f.dot;
	if (!(O = rt.locateIn(f, rt.at(href_list, "retrieve"), this.contents)) || !rt.istype(O, T("/obj/item"))) {
		return f.dot;
	}
	if (!f.usr.canUseTopic(this) || !this.open) {
		return f.dot;
	}
	if (!rt.istype(f.usr, T("/mob/living/carbon/human"))) return f.dot;
	if (!(yield* f.usr.put_in_hands(O))) {
		yield* O.forceMove(rt.getStep(f, this, 0));
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// guncase.dm:93
rt.def("/obj/structure/guncase/proc/handle_atom_del", function handle_atom_del(f: Frame, A: Value) {
	this.update_icon();
	return f.dot;
});

// guncase.dm:96
rt.def("/obj/structure/guncase/proc/contents_explosion", function* contents_explosion(f: Frame, severity: Value, target: Value) {
	let A: Value = null;
	let $e: any, $t: any;
	for (A of each(this.contents, T("/atom"))) {
		yield* A.ex_act(($t = severity, severity = rt.inc($t, 1), $t), target);
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true);
