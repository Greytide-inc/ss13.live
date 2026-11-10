// Based on /tg/station's code/game/machinery/computer/law.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10383, "/obj/machinery/computer/upload", "/obj/machinery/computer", {
	current: null,
	icon_screen: "command",
});

// law.dm:8
rt.def("/obj/machinery/computer/upload/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let M: Value = null, currentloc: Value = null;
	if (rt.istype(O, T("/obj/item/weapon/aiModule"))) {
		M = O;
		if (rt.bitAnd(this.stat, 11)) {
			return f.dot;
		}
		if (!this.current) {
			to_chat(user, "<span class='caution'>You haven't selected anything to transmit laws to!</span>");
			return f.dot;
		}
		if (!this.can_upload_to(this.current)) {
			to_chat(user, `<span class='caution'>Upload failed!</span> Check to make sure ${this.current.name} is functioning properly.`);
			this.current = null;
			return f.dot;
		}
		if ((currentloc = rt.getStep(f, this.current, 0)) && user.z != currentloc.z) {
			to_chat(user, `<span class='caution'>Upload failed!</span> Unable to establish a connection to ${this.current.name}. You're too far away!`);
			this.current = null;
			return f.dot;
		}
		yield* M.install(this.current.laws, user);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// law.dm:29
rt.def("/obj/machinery/computer/upload/proc/can_upload_to", function can_upload_to(f: Frame, S: Value) {
	if (S.stat == 2 || S.syndicate) {
		return 0;
	}
	return 1;
});

rt.type(10384, "/obj/machinery/computer/upload/ai", "/obj/machinery/computer/upload", {
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/aiupload"),
	name: "１AI upload console",
	desc: "Used to upload laws to the AI.",
});

// law.dm:39
rt.def("/obj/machinery/computer/upload/ai/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	this.current = (yield* select_active_ai(user));
	if (!this.current) {
		to_chat(user, "<span class='caution'>No active AIs detected!</span>");
	} else {
		to_chat(user, `${this.current.name} selected for law changes.`);
	}
	return f.dot;
}, true);

// law.dm:50
rt.def("/obj/machinery/computer/upload/ai/proc/can_upload_to", function can_upload_to(f: Frame, A: Value) {
	if (!A || !rt.istype(A, T("/mob/living/silicon/ai"))) {
		return 0;
	}
	if (A.control_disabled) {
		return 0;
	}
	return parent_proc();
}, false);

rt.type(10385, "/obj/machinery/computer/upload/borg", "/obj/machinery/computer/upload", {
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/borgupload"),
	name: "cyborg upload console",
	desc: "Used to upload laws to Cyborgs.",
});

// law.dm:63
rt.def("/obj/machinery/computer/upload/borg/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	this.current = (yield* select_active_free_borg(user));
	if (!this.current) {
		to_chat(user, "<span class='caution'>No active unslaved cyborgs detected!</span>");
	} else {
		to_chat(user, `${this.current.name} selected for law changes.`);
	}
	return f.dot;
}, true);

// law.dm:74
rt.def("/obj/machinery/computer/upload/borg/proc/can_upload_to", function can_upload_to(f: Frame, B: Value) {
	if (!B || !rt.istype(B, T("/mob/living/silicon/robot"))) {
		return 0;
	}
	if (B.scrambledcodes || B.emagged) {
		return 0;
	}
	return parent_proc();
}, false);
