// Based on /tg/station's code/game/objects/items/devices/paicard.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(9275, "/obj/item/device/paicard", "/obj/item/device", {
	pai: null,
	name: "personal AI device",
	icon: rt.rsc("icons/obj/aicards.dmi"),
	icon_state: "pai",
	item_state: "electronic",
	w_class: 2,
	slot_flags: 512,
	origin_tech: "programming=2",
	resistance_flags: 98,
});

// paicard.dm:14
rt.def("/obj/item/device/paicard/proc/Initialize", function* Initialize(f: Frame) {
	GLOB.SSpai.pai_card_list += this;
	this.add_overlay("pai-off");
	return (yield* parent_proc());
}, true);

// paicard.dm:19
rt.def("/obj/item/device/paicard/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.SSpai.pai_card_list -= this;
	yield* qdel(this.pai);
	this.pai = null;
	return (yield* parent_proc());
}, true);

// paicard.dm:24
rt.def("/obj/item/device/paicard/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let slaws: Value = null, H: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	if (!(get_dist(this, user) <= 1)) {
		return f.dot;
	}
	yield* user.set_machine(this);
	let dat: Value = "<TT><B>Personal AI Device</B><BR>";
	if (this.pai) {
		if (!this.pai.master_dna || !this.pai.master) {
			dat += fmt("<a href='byond://?src=＃;setdna=1'>Imprint Master DNA</a><br>", [this]);
		}
		dat += `Installed Personality: ${this.pai.name}<br>`;
		dat += `Prime directive: <br>${this.pai.laws.zeroth}<br>`;
		for (slaws of each(this.pai.laws.supplied)) {
			dat += `Additional directives: <br>${slaws}<br>`;
		}
		dat += fmt("<a href='byond://?src=＃;setlaws=1'>Configure Directives</a><br>", [this]);
		dat += "<br>";
		dat += "<h3>Device Settings</h3><br>";
		if (this.pai.radio) {
			dat += "<b>Radio Uplink</b><br>";
			$0 = this;
			$1 = "Transmit";
			if (this.pai.radio.wires.is_cut("Transmit")) {
				$2 = "Disabled";
			} else {
				$2 = "Enabled";
			}
			dat += fmt("Transmit: <A href='byond://?src=＃;wires=＀'>＀</A><br>", [$0, $1, $2]);
			$0 = this;
			$1 = "Recieve";
			if (this.pai.radio.wires.is_cut("Recieve")) {
				$2 = "Disabled";
			} else {
				$2 = "Enabled";
			}
			dat += fmt("Receive: <A href='byond://?src=＃;wires=＀'>＀</A><br>", [$0, $1, $2]);
		} else {
			dat += "<b>Radio Uplink</b><br>";
			dat += "<font color=red><i>Radio firmware not loaded. Please install a pAI personality to load firmware.</i></font><br>";
		}
		if (rt.istype(user, T("/mob/living/carbon/human"))) {
			if ((H = user).real_name == this.pai.master || H.dna.unique_enzymes == this.pai.master_dna) {
				$0 = this;
				if (this.pai.canholo) {
					$1 = "Disable";
				} else {
					$1 = "Enable";
				}
				dat += fmt("<A href='byond://?src=＃;toggle_holo=1'>[＀ holomatrix projectors]</a><br>", [$0, $1]);
			}
		}
		dat += fmt("<A href='byond://?src=＃;wipe=1'>[Wipe current pAI personality]</a><br>", [this]);
	} else {
		dat += "No personality installed.<br>";
		dat += "Searching for a personality... Press view available personalities to notify potential candidates.";
		dat += fmt("<A href='byond://?src=＃;request=1'>[View available personalities]</a><br>", [this]);
	}
	rt.op(f, "Browse", [], [user, dat, "window=paicard"], false);
	onclose(user, "paicard");
	return f.dot;
}, true);

// paicard.dm:60
rt.def("/obj/item/device/paicard/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let M: Value = null, confirm: Value = null, wire: Value = null, newlaws: Value = null;
	if (!f.usr || f.usr.stat) {
		return f.dot;
	}
	if (rt.at(href_list, "request")) {
		yield* GLOB.SSpai.findPAI(this, f.usr);
	}
	if (this.pai) {
		if (this.loc != f.usr) {
			return f.dot;
		}
		if (rt.at(href_list, "setdna")) {
			if (this.pai.master_dna) {
				return f.dot;
			}
			if (!rt.istype(f.usr, T("/mob/living/carbon"))) {
				to_chat(f.usr, "<span class='warning'>You don't have any DNA, or your DNA is incompatible with this device!</span>");
			} else {
				M = f.usr;
				this.pai.master = M.real_name;
				this.pai.master_dna = M.dna.unique_enzymes;
				to_chat(this.pai, "<span class='notice'>You have been bound to a new master.</span>");
				this.pai.emittersemicd = 0;
			}
		}
		if (rt.at(href_list, "wipe")) {
			if ((confirm = (yield* g.op(f, "Prompt", [0], [null, null, "Personality Wipe", "Are you CERTAIN you wish to delete the current personality? This action cannot be undone.", list("Yes", "No")]))) == "Yes") {
				if (this.pai) {
					to_chat(this.pai, "<span class='warning'>You feel yourself slipping away from reality.</span>");
					to_chat(this.pai, "<span class='danger'>Byte by byte you lose your sense of self.</span>");
					to_chat(this.pai, "<span class='userdanger'>Your mental faculties leave you.</span>");
					to_chat(this.pai, "<span class='rose'>oblivion... </span>");
					yield* this.removePersonality();
				}
			}
		}
		if (rt.at(href_list, "wires")) {
			wire = rt.at(href_list, "wires"); // the wire names are text ("Transmit"): tg's text2num made this button do nothing
			// Only one of the radio's own wires (an href number could be anything, and would be stored as a "cut wire").
			if (this.pai.radio && rt.isIn(f, wire, this.pai.radio.wires.wires)) {
				yield* this.pai.radio.wires.cut(wire);
			}
		}
		if (rt.at(href_list, "setlaws")) {
			if ((newlaws = copytext(sanitize((yield* g.op(f, "Prompt", [64], [null, rt.index(this.pai.laws.supplied, 1), "pAI Directive Configuration", "Enter any additional directives you would like your pAI personality to follow. Note that these directives will not override the personality's allegiance to its imprinted master. Conflicting directives will be ignored.", null]))), 1, 1024)) && this.pai) {
				yield* this.pai.add_supplied_law(0, newlaws);
			}
		}
		if (rt.at(href_list, "toggle_holo")) {
			if (this.pai.canholo) {
				to_chat(this.pai, "<span class='userdanger'>Your owner has disabled your holomatrix projectors!</span>");
				this.pai.canholo = 0;
				to_chat(f.usr, "<span class='warning'>You disable your pAI's holomatrix!</span>");
			} else {
				to_chat(this.pai, "<span class='boldnotice'>Your owner has enabled your holomatrix projectors!</span>");
				this.pai.canholo = 1;
				to_chat(f.usr, "<span class='notice'>You enable your pAI's holomatrix!</span>");
			}
		}
	}
	yield* this.attack_self(f.usr);
	return f.dot;
}, true);

// paicard.dm:115
rt.def("/obj/item/device/paicard/proc/setPersonality", function setPersonality(f: Frame, personality: Value) {
	this.pai = personality;
	this.add_overlay("pai-null");
	playsound(this.loc, rt.rsc("sound/effects/pai_boot.ogg"), 50, 1, -1);
	this.audible_message(fmt("＄！ plays a cheerful startup noise!", [this]));
	return f.dot;
});

// paicard.dm:121
rt.def("/obj/item/device/paicard/proc/removePersonality", function* removePersonality(f: Frame) {
	yield* qdel(this.pai);
	this.pai = null;
	this.cut_overlays();
	this.add_overlay("pai-off");
	return f.dot;
}, true);

// paicard.dm:127
rt.def("/obj/item/device/paicard/proc/setEmotion", function setEmotion(f: Frame, emotion: Value) {
	if (!this.pai) return f.dot;
	this.cut_overlays();
	if (emotion === 1) {
		this.add_overlay("pai-happy");
	} else if (emotion === 2) {
		this.add_overlay("pai-cat");
	} else if (emotion === 3) {
		this.add_overlay("pai-extremely-happy");
	} else if (emotion === 4) {
		this.add_overlay("pai-face");
	} else if (emotion === 5) {
		this.add_overlay("pai-laugh");
	} else if (emotion === 6) {
		this.add_overlay("pai-off");
	} else if (emotion === 7) {
		this.add_overlay("pai-sad");
	} else if (emotion === 8) {
		this.add_overlay("pai-angry");
	} else if (emotion === 9) {
		this.add_overlay("pai-what");
	} else if (emotion === 10) {
		this.add_overlay("pai-null");
	}
	return f.dot;
});

// paicard.dm:141
rt.def("/obj/item/device/paicard/proc/alertUpdate", function alertUpdate(f: Frame) {
	this.visible_message(`<span class ='info'>${this} flashes a message across its screen, "Additional personalities available for download."`, `<span class='notice'>${this} bleeps electronically.</span>`);
	return f.dot;
});

// paicard.dm:145
rt.def("/obj/item/device/paicard/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (this.pai) {
		yield* this.pai.emp_act(severity);
	}
	yield* parent_proc();
	return f.dot;
}, true);
