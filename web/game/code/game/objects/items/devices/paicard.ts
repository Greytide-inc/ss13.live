// From code/game/objects/items/devices/paicard.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/device/paicard/proc/Initialize  (code/game/objects/items/devices/paicard.dm:14)  may sleep
rt.def("/obj/item/device/paicard/proc/Initialize", function* Initialize(f: Frame) {
	rt.modField(f, rt.gl("SSpai"), "pai_card_list", live(f.src), add);
	yield* g.srcCall(f, "add_overlay", "pai-off");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/device/paicard/proc/Destroy  (code/game/objects/items/devices/paicard.dm:19)  may sleep
rt.def("/obj/item/device/paicard/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modField(f, rt.gl("SSpai"), "pai_card_list", live(f.src), subtract));
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "pai")]);
	rt.setSv(f, "pai", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/device/paicard/proc/attack_self  (code/game/objects/items/devices/paicard.dm:24)  may sleep
rt.def("/obj/item/device/paicard/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let dat: Value = null, slaws: Value = null, H: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [user, dat, slaws, H, $0, $1, $2, $e];
	if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 1)) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = "<TT><B>Personal AI Device</B><BR>";
	if (truthy(rt.sv(f, "pai"))) {
		if ((!truthy(rt.fv(f, "master_dna", rt.sv(f, "pai"))) || !truthy(rt.fv(f, "master", rt.sv(f, "pai"))))) {
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;setdna=1'>Imprint Master DNA</a><br>", [live(f.src)]), add);
		}
		dat = rt.modify(live(dat), fmt("Installed Personality: ＀<br>", [rt.fv(f, "name", rt.sv(f, "pai"))]), add);
		dat = rt.modify(live(dat), fmt("Prime directive: <br>＀<br>", [rt.gv(f, "zeroth", rt.fv(f, "laws", rt.sv(f, "pai")))]), add);
		slaws = null;
		rt.forList(f, 0, rt.gv(f, "supplied", rt.fv(f, "laws", rt.sv(f, "pai"))));
		while (($e = rt.next(f, 0)) !== undefined) {
			slaws = $e;
			dat = rt.modify(live(dat), fmt("Additional directives: <br>＀<br>", [live(slaws)]), add);
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;setlaws=1'>Configure Directives</a><br>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<br>", add);
		dat = rt.modify(live(dat), "<h3>Device Settings</h3><br>", add);
		if (truthy(rt.fv(f, "radio", rt.sv(f, "pai")))) {
			dat = rt.modify(live(dat), "<b>Radio Uplink</b><br>", add);
			$0 = live(f.src);
			$1 = "Transmit";
			if (truthy((yield* g.callName(f, rt.gv(f, "wires", rt.fv(f, "radio", rt.sv(f, "pai"))), "is_cut", ["Transmit"])))) {
				$2 = "Disabled";
			} else {
				$2 = "Enabled";
			}
			dat = rt.modify(live(dat), fmt("Transmit: <A href='byond://?src=＃;wires=＀'>＀</A><br>", [$0, $1, $2]), add);
			$0 = live(f.src);
			$1 = "Recieve";
			if (truthy((yield* g.callName(f, rt.gv(f, "wires", rt.fv(f, "radio", rt.sv(f, "pai"))), "is_cut", ["Recieve"])))) {
				$2 = "Disabled";
			} else {
				$2 = "Enabled";
			}
			dat = rt.modify(live(dat), fmt("Receive: <A href='byond://?src=＃;wires=＀'>＀</A><br>", [$0, $1, $2]), add);
		} else {
			dat = rt.modify(live(dat), "<b>Radio Uplink</b><br>", add);
			dat = rt.modify(live(dat), "<font color=red><i>Radio firmware not loaded. Please install a pAI personality to load firmware.</i></font><br>", add);
		}
		if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
			if ((isEqual(rt.gv(f, "real_name", (H = live(user))), rt.fv(f, "master", rt.sv(f, "pai"))) || isEqual(rt.gv(f, "unique_enzymes", rt.fv(f, "dna", live(H))), rt.fv(f, "master_dna", rt.sv(f, "pai"))))) {
				$0 = live(f.src);
				if (truthy(rt.fv(f, "canholo", rt.sv(f, "pai")))) {
					$1 = "Disable";
				} else {
					$1 = "Enable";
				}
				dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;toggle_holo=1'>[＀ holomatrix projectors]</a><br>", [$0, $1]), add);
			}
		}
		dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;wipe=1'>[Wipe current pAI personality]</a><br>", [live(f.src)]), add);
	} else {
		dat = rt.modify(live(dat), "No personality installed.<br>", add);
		dat = rt.modify(live(dat), "Searching for a personality... Press view available personalities to notify potential candidates.", add);
		dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;request=1'>[View available personalities]</a><br>", [live(f.src)]), add);
	}
	rt.op(f, "Browse", [], [live(user), live(dat), "window=paicard"], false);
	yield* g.call(f, P("/proc/onclose"), null, [live(user), "paicard"]);
	return live(f.dot);
}, true);

// /obj/item/device/paicard/proc/Topic  (code/game/objects/items/devices/paicard.dm:60)  may sleep
rt.def("/obj/item/device/paicard/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let M: Value = null, confirm: Value = null, wire: Value = null, newlaws: Value = null;
	f.vars = () => [href, href_list, M, confirm, wire, newlaws];
	if ((!truthy(live(f.usr)) || truthy(rt.fv(f, "stat", live(f.usr))))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(href_list), "request"))) {
		yield* g.callName(f, rt.gl("SSpai"), "findPAI", [live(f.src), live(f.usr)]);
	}
	if (truthy(rt.sv(f, "pai"))) {
		if (!isEqual(rt.sv(f, "loc"), live(f.usr))) {
			return live(f.dot);
		}
		if (truthy(rt.at(live(href_list), "setdna"))) {
			if (truthy(rt.fv(f, "master_dna", rt.sv(f, "pai")))) {
				return live(f.dot);
			}
			if (!truthy((rt.istype(live(f.usr), T("/mob/living/carbon")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You don't have any DNA, or your DNA is incompatible with this device!</span>"]);
			} else {
				M = live(f.usr);
				rt.setFv(f, "master", rt.sv(f, "pai"), rt.fv(f, "real_name", live(M)));
				rt.setFv(f, "master_dna", rt.sv(f, "pai"), rt.gv(f, "unique_enzymes", rt.fv(f, "dna", live(M))));
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "pai"), "<span class='notice'>You have been bound to a new master.</span>"]);
				rt.setFv(f, "emittersemicd", rt.sv(f, "pai"), 0);
			}
		}
		if (truthy(rt.at(live(href_list), "wipe"))) {
			if (isEqual((confirm = (yield* g.op(f, "Prompt", [0], [null, null, "Personality Wipe", "Are you CERTAIN you wish to delete the current personality? This action cannot be undone.", rt.list("Yes", "No")]))), "Yes")) {
				if (truthy(rt.sv(f, "pai"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "pai"), "<span class='warning'>You feel yourself slipping away from reality.</span>"]);
					yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "pai"), "<span class='danger'>Byte by byte you lose your sense of self.</span>"]);
					yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "pai"), "<span class='userdanger'>Your mental faculties leave you.</span>"]);
					yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "pai"), "<span class='rose'>oblivion... </span>"]);
					yield* g.srcCall(f, "removePersonality");
				}
			}
		}
		if (truthy(rt.at(live(href_list), "wires"))) {
			wire = rt.at(live(href_list), "wires"); // the wire names are text ("Transmit"): tg's text2num made this button do nothing
			// Only one of the radio's own wires (an href number could be anything, and would be stored as a "cut wire").
			if (truthy(rt.fv(f, "radio", rt.sv(f, "pai"))) && truthy((rt.isIn(f, live(wire), rt.gv(f, "wires", rt.gv(f, "wires", rt.fv(f, "radio", rt.sv(f, "pai"))))) ? 1 : 0))) {
				yield* g.callName(f, rt.gv(f, "wires", rt.fv(f, "radio", rt.sv(f, "pai"))), "cut", [live(wire)]);
			}
		}
		if (truthy(rt.at(live(href_list), "setlaws"))) {
			if ((truthy((newlaws = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [64], [null, rt.index(rt.gv(f, "supplied", rt.fv(f, "laws", rt.sv(f, "pai"))), 1), "pAI Directive Configuration", "Enter any additional directives you would like your pAI personality to follow. Note that these directives will not override the personality's allegiance to its imprinted master. Conflicting directives will be ignored.", null]))])), 1, 1024])))) && truthy(rt.sv(f, "pai")))) {
				yield* g.callName(f, rt.sv(f, "pai"), "add_supplied_law", [0, live(newlaws)]);
			}
		}
		if (truthy(rt.at(live(href_list), "toggle_holo"))) {
			if (truthy(rt.fv(f, "canholo", rt.sv(f, "pai")))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "pai"), "<span class='userdanger'>Your owner has disabled your holomatrix projectors!</span>"]);
				rt.setFv(f, "canholo", rt.sv(f, "pai"), 0);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You disable your pAI's holomatrix!</span>"]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "pai"), "<span class='boldnotice'>Your owner has enabled your holomatrix projectors!</span>"]);
				rt.setFv(f, "canholo", rt.sv(f, "pai"), 1);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>You enable your pAI's holomatrix!</span>"]);
			}
		}
	}
	yield* g.srcCall(f, "attack_self", live(f.usr));
	return f.dot;
}, true);

// /obj/item/device/paicard/proc/setPersonality  (code/game/objects/items/devices/paicard.dm:115)
rt.def("/obj/item/device/paicard/proc/setPersonality", function setPersonality(f: Frame, personality: Value) {
	rt.setFv(f, "pai", live(f.src), live(personality));
	rt.callName(f, live(f.src), "add_overlay", ["pai-null"]);
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/pai_boot.ogg"), 50, 1, -1]);
	rt.callSrc(f, "audible_message", [fmt("＄！ plays a cheerful startup noise!", [live(f.src)])]);
	return f.dot;
});

// /obj/item/device/paicard/proc/removePersonality  (code/game/objects/items/devices/paicard.dm:121)  may sleep
rt.def("/obj/item/device/paicard/proc/removePersonality", function* removePersonality(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "pai")]);
	rt.setSv(f, "pai", null);
	yield* g.srcCall(f, "cut_overlays");
	yield* g.srcCall(f, "add_overlay", "pai-off");
	return f.dot;
}, true);

// /obj/item/device/paicard/proc/setEmotion  (code/game/objects/items/devices/paicard.dm:127)
rt.def("/obj/item/device/paicard/proc/setEmotion", function setEmotion(f: Frame, emotion: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(rt.sv(f, "pai"))) return f.dot;
	rt.callName(f, live(f.src), "cut_overlays", []);
	$0 = live(emotion);
	if ($0 === 1) {
		rt.callName(f, live(f.src), "add_overlay", ["pai-happy"]);
	} else if ($0 === 2) {
		rt.callName(f, live(f.src), "add_overlay", ["pai-cat"]);
	} else if ($0 === 3) {
		rt.callName(f, live(f.src), "add_overlay", ["pai-extremely-happy"]);
	} else if ($0 === 4) {
		rt.callName(f, live(f.src), "add_overlay", ["pai-face"]);
	} else if ($0 === 5) {
		rt.callName(f, live(f.src), "add_overlay", ["pai-laugh"]);
	} else if ($0 === 6) {
		rt.callName(f, live(f.src), "add_overlay", ["pai-off"]);
	} else if ($0 === 7) {
		rt.callName(f, live(f.src), "add_overlay", ["pai-sad"]);
	} else if ($0 === 8) {
		rt.callName(f, live(f.src), "add_overlay", ["pai-angry"]);
	} else if ($0 === 9) {
		rt.callName(f, live(f.src), "add_overlay", ["pai-what"]);
	} else if ($0 === 10) {
		rt.callName(f, live(f.src), "add_overlay", ["pai-null"]);
	}
	return f.dot;
});

// /obj/item/device/paicard/proc/alertUpdate  (code/game/objects/items/devices/paicard.dm:141)
rt.def("/obj/item/device/paicard/proc/alertUpdate", function alertUpdate(f: Frame) {
	rt.callSrc(f, "visible_message", [fmt("<span class ='info'>＀ flashes a message across its screen, \"Additional personalities available for download.\"", [live(f.src)]), fmt("<span class='notice'>＀ bleeps electronically.</span>", [live(f.src)])]);
	return f.dot;
});

// /obj/item/device/paicard/proc/emp_act  (code/game/objects/items/devices/paicard.dm:145)  may sleep
rt.def("/obj/item/device/paicard/proc/emp_act", function* emp_act(f: Frame) {
	if (truthy(rt.sv(f, "pai"))) {
		yield* g.callName(f, rt.sv(f, "pai"), "emp_act", [live(f.args[0])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });
