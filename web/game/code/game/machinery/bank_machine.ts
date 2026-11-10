// Based on /tg/station's code/game/machinery/bank_machine.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10354, "/obj/machinery/computer/bank_machine", "/obj/machinery/computer", {
	siphoning: 0,
	next_warning: 0,
	radio: null,
	radio_channel: "Common",
	minimum_time_between_warnings: 400,
	name: "bank machine",
	desc: "A machine used to deposit and withdraw station funds.",
	icon_screen: "vault",
	icon_keyboard: "security_key",
	idle_power_usage: 100,
});

// bank_machine.dm:13
rt.def("/obj/machinery/computer/bank_machine/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	this.radio = (yield* new_(T("/obj/item/device/radio"), this));
	this.radio.subspace_transmission = 1;
	this.radio.canhear_range = 0;
	this.radio.recalculateChannels();
	return f.dot;
}, true);

// bank_machine.dm:20
rt.def("/obj/machinery/computer/bank_machine/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.radio);
	this.radio = null;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// bank_machine.dm:25
rt.def("/obj/machinery/computer/bank_machine/proc/attackby", function* attackby(f: Frame, I: Value, user: Value) {
	let C: Value = null;
	let value: Value = 0;
	if (rt.istype(I, T("/obj/item/stack/spacecash"))) {
		value = rt.fv(f, "value", (C = I)) * C.amount;
	}
	if (value) {
		GLOB.SSshuttle.points += value;
		to_chat(user, `<span class='notice'>You deposit ${I}. The station now has ${GLOB.SSshuttle.points} credits.</span>`);
		yield* qdel(I);
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// bank_machine.dm:37
rt.def("/obj/machinery/computer/bank_machine/proc/process", function* process(f: Frame) {
	let A: Value = null, message: Value = null;
	yield* parent_proc();
	if (!this.siphoning) return f.dot;
	if (rt.bitAnd(this.stat, 3)) {
		yield* this.say("Insufficient power. Halting siphon.");
		this.siphoning = 0;
	}
	if (GLOB.SSshuttle.points < 200) {
		yield* this.say("Station funds depleted. Halting siphon.");
		this.siphoning = 0;
	} else {
		yield* new_(T("/obj/item/stack/spacecash/c200"), rt.getStep(f, this, 0));
		playsound(this.loc, rt.rsc("sound/items/poster_being_created.ogg"), 100, 1);
		GLOB.SSshuttle.points -= 200;
		if (!(this.next_warning < rt.worldTime(f) && prob(15))) return f.dot;
		A = get_area(this.loc);
		message = `Unauthorized credit withdrawal underway in ${A.map_name}!!`;
		yield* this.radio.talk_into(this, message, this.radio_channel, this.get_spans());
		this.next_warning = rt.worldTime(f) + this.minimum_time_between_warnings;
	}
	return f.dot;
}, true, { waitfor: false });

// bank_machine.dm:56
rt.def("/obj/machinery/computer/bank_machine/proc/get_spans", function get_spans(f: Frame) {
	f.dot = rt.bitOr(parent_proc(), "robot");
	return f.dot;
});

// bank_machine.dm:59
rt.def("/obj/machinery/computer/bank_machine/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let popup: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.add_fingerprint(f.usr);
	let dat: Value = `${rt.world().name} secure vault. Authorized personnel only.<br>`;
	dat += `Current Balance: ${GLOB.SSshuttle.points} credits.<br>`;
	if (!this.siphoning) {
		dat += fmt("<A href='?src=＃;siphon=1'>Siphon Credits</A><br>", [this]);
	} else {
		dat += fmt("<A href='?src=＃;halt=1'>Halt Credit Siphon</A><br>", [this]);
	}
	dat += fmt("<a href='?src=＃;mach_close=computer'>Close</a>", [user]);
	(popup = (yield* new_(T("/datum/browser"), user, "computer", "Bank Vault", 300, 200))).set_content(`<center>${dat}</center>`);
	popup.set_title_image(f.usr.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// bank_machine.dm:77
rt.def("/obj/machinery/computer/bank_machine/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (rt.at(href_list, "siphon")) {
		yield* this.say("Siphon of station credits has begun!");
		this.siphoning = 1;
	}
	if (!rt.at(href_list, "halt")) return f.dot;
	yield* this.say("Station credit withdrawal halted.");
	this.siphoning = 0;
	return f.dot;
}, true);
