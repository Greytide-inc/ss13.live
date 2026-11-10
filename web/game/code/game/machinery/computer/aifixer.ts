// Based on /tg/station's code/game/machinery/computer/aifixer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10362, "/obj/machinery/computer/aifixer", "/obj/machinery/computer", {
	occupier: null,
	active: 0,
	light_color: "#E17DE1",
	name: "１AI system integrity restorer",
	desc: "Used with intelliCards containing nonfunctioning AIs to restore them to working order.",
	req_access: null,
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/aifixer"),
	icon_keyboard: "tech_key",
	icon_screen: "ai-fixer",
});

// aifixer.dm:13
rt.def("/obj/machinery/computer/aifixer/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (this.occupier && rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		if (rt.bitAnd(this.stat, 3)) {
			to_chat(user, `<span class='warning'>The screws on ${this.name}'s screen won't budge.</span>`);
		} else {
			to_chat(user, `<span class='warning'>The screws on ${this.name}'s screen won't budge and it emits a warning beep.</span>`);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// aifixer.dm:22
rt.def("/obj/machinery/computer/aifixer/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.interact(user);
	return f.dot;
}, true);

// aifixer.dm:28
rt.def("/obj/machinery/computer/aifixer/proc/interact", function* interact(f: Frame, user: Value) {
	let laws: Value = null, index: Value = null, law: Value = null, num: Value = null, number: Value = null, index_3: Value = null, law_4: Value = null, popup: Value = null;
	let dat: Value = "";
	if (this.occupier) {
		dat += `<h3>Stored AI: ${this.occupier.name}</h3>`;
		dat += `<b>System integrity:</b> ${(this.occupier.health + 100) / 2}%<br>`;
		if (this.occupier.laws.zeroth) {
			laws += `<b>0:</b> ${this.occupier.laws.zeroth}<BR>`;
		}
		index = 1;
		while (index <= rt.len(f, this.occupier.laws.ion)) {
			if (rt.length((law = rt.index(this.occupier.laws.ion, index))) > 0) {
				laws += `<b>${(num = ionnum())}:</b> ${law}<BR>`;
			}
			index++;
		}
		number = 1;
		index_3 = 1;
		while (index_3 <= rt.len(f, this.occupier.laws.inherent)) {
			if (rt.length((law_4 = rt.index(this.occupier.laws.inherent, index_3))) > 0) {
				laws += `<b>${number}:</b> ${law_4}<BR>`;
				number++;
			}
			index_3++;
		}
		index_3 = 1;
		while (index_3 <= rt.len(f, this.occupier.laws.supplied)) {
			if (rt.length((law_4 = rt.index(this.occupier.laws.supplied, index_3))) > 0) {
				laws += `<b>${number}:</b> ${law_4}<BR>`;
				number++;
			}
			index_3++;
		}
		dat += `<b>Laws:</b><br>${laws}<br>`;
		if (this.occupier.stat == 2) {
			dat += "<span class='bad'>AI non-functional</span>";
		} else {
			dat += "<span class='good'>AI functional</span>";
		}
		if (!this.active) {
			dat += fmt("<br><br><A href='byond://?src=＃;fix=1'>Begin Reconstruction</A>", [this]);
		} else {
			dat += "<br><br>Reconstruction in process, please wait.<br>";
		}
	}
	dat += fmt("<br><A href='?src=＃;mach_close=computer'>Close</A>", [user]);
	(popup = (yield* new_(T("/datum/browser"), user, "computer", "AI System Integrity Restorer", 400, 500))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// aifixer.dm:75
rt.def("/obj/machinery/computer/aifixer/proc/Fix", function* Fix(f: Frame) {
	yield* this.use_power(1000);
	yield* this.occupier.adjustOxyLoss(-1, 0);
	yield* this.occupier.adjustFireLoss(-1, 0);
	yield* this.occupier.adjustToxLoss(-1, 0);
	yield* this.occupier.adjustBruteLoss(-1, 0);
	yield* this.occupier.updatehealth();
	yield* this.occupier.updatehealth();
	if (this.occupier.health >= 0 && this.occupier.stat == 2) {
		yield* this.occupier.revive();
	}
	return (this.occupier.health < 100 ? 1 : 0);
}, true);

// aifixer.dm:87
rt.def("/obj/machinery/computer/aifixer/proc/process", function* process(f: Frame) {
	if (!(yield* parent_proc())) return f.dot;
	if (this.active) {
		this.active = (yield* this.Fix());
	}
	yield* this.updateDialog();
	yield* this.update_icon();
	return f.dot;
}, true, { waitfor: false });

// aifixer.dm:94
rt.def("/obj/machinery/computer/aifixer/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!rt.at(href_list, "fix")) return f.dot;
	to_chat(f.usr, "<span class='notice'>Reconstruction in progress. This will take several minutes.</span>");
	playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 25, 0);
	this.active = 1;
	yield* this.add_fingerprint(f.usr);
	return f.dot;
}, true);

// aifixer.dm:103
rt.def("/obj/machinery/computer/aifixer/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	} else {
		if (this.active) {
			this.add_overlay("ai-fixer-on");
		}
		if (this.occupier) {
			if (this.occupier.stat === 0) {
				this.add_overlay("ai-fixer-full");
			} else if (this.occupier.stat === 2) {
				this.add_overlay("ai-fixer-404");
			}
		} else {
			this.add_overlay("ai-fixer-empty");
		}
	}
	return f.dot;
});

// aifixer.dm:119
rt.def("/obj/machinery/computer/aifixer/proc/transfer_ai", function* transfer_ai(f: Frame, interaction: Value, user: Value, AI: Value, card: Value) {
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	if (interaction == AI_TRANS_FROM_CARD) {
		if (rt.bitAnd(this.stat, 3)) {
			to_chat(user, `${this} is offline and cannot take an AI at this time!`);
			return f.dot;
		}
		yield* AI.forceMove(this);
		this.occupier = AI;
		AI.control_disabled = 1;
		AI.radio_enabled = 0;
		to_chat(AI, "You have been uploaded to a stationary terminal. Sadly, there is no remote access from here.");
		to_chat(user, `<span class='boldnotice'>Transfer successful</span>: ${AI.name} (${rand(1000, 9999)}.exe) installed and executed successfully. Local copy has been removed.`);
		card.AI = null;
		yield* this.update_icon();
	} else if (this.occupier && !this.active) {
		to_chat(this.occupier, "You have been downloaded to a mobile storage device. Still no remote access.");
		to_chat(user, `<span class='boldnotice'>Transfer successful</span>: ${this.occupier.name} (${rand(1000, 9999)}.exe) removed from host terminal and stored within local memory.`);
		this.occupier.loc = card;
		card.AI = this.occupier;
		this.occupier = null;
		yield* this.update_icon();
	} else if (this.active) {
		to_chat(user, "<span class='boldannounce'>ERROR</span>: Reconstruction in progress.");
	} else {
		if (this.occupier) return f.dot;
		to_chat(user, "<span class='boldannounce'>ERROR</span>: Unable to locate artificial intelligence.");
	}
	return f.dot;
}, true);
