// From code/game/objects/items/devices/aicard.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9226, "/obj/item/device/aicard", "/obj/item/device", {
	flush: 0,
	AI: null,
	flags: 4,
	name: "intelliCard",
	desc: "A storage device for AIs. Patent pending.",
	icon: rt.rsc("icons/obj/aicards.dmi"),
	icon_state: "aicard",
	item_state: "electronic",
	w_class: 2,
	slot_flags: 512,
	origin_tech: "programming=3;materials=3",
});

// /obj/item/device/aicard/proc/afterattack  (code/game/objects/items/devices/aicard.dm:15)  may sleep
rt.def("/obj/item/device/aicard/proc/afterattack", function* afterattack(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((!truthy(live(f.args[2])) || !truthy(live(f.args[0])))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "AI"))) {
		yield* g.callName(f, live(f.args[0]), "transfer_ai", [2, live(f.args[1]), rt.sv(f, "AI"), live(f.src)]);
		yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[1]), rt.sv(f, "AI"), "carded", live(f.src)]);
	} else {
		yield* g.callName(f, live(f.args[0]), "transfer_ai", [1, live(f.args[1]), null, live(f.src)]);
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["target", "user", "proximity"] });

// /obj/item/device/aicard/proc/update_icon  (code/game/objects/items/devices/aicard.dm:26)  may sleep
rt.def("/obj/item/device/aicard/proc/update_icon", function* update_icon(f: Frame) {
	yield* g.srcCall(f, "cut_overlays");
	if (truthy(rt.sv(f, "AI"))) {
		rt.setSv(f, "name", fmt("＀- ＀", [rt.initial(f, live(f.src), "name"), rt.fv(f, "name", rt.sv(f, "AI"))]));
		if (isEqual(rt.fv(f, "stat", rt.sv(f, "AI")), 2)) {
			rt.setSv(f, "icon_state", "aicard-404");
		} else {
			rt.setSv(f, "icon_state", "aicard-full");
		}
		if (!truthy(rt.fv(f, "control_disabled", rt.sv(f, "AI")))) {
			yield* g.srcCall(f, "add_overlay", "aicard-on");
		}
		yield* g.callName(f, rt.sv(f, "AI"), "cancel_camera", []);
	} else {
		rt.setSv(f, "name", rt.initial(f, live(f.src), "name"));
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	}
	return f.dot;
}, true);

// /obj/item/device/aicard/proc/ui_interact  (code/game/objects/items/devices/aicard.dm:42)  may sleep
rt.def("/obj/item/device/aicard/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("hands_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "intellicard", rt.sv(f, "name"), 500, 500, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/item/device/aicard/proc/ui_data  (code/game/objects/items/devices/aicard.dm:48)
rt.def("/obj/item/device/aicard/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [data, $0, $1, $2];
	data = rt.list();
	if (truthy(rt.sv(f, "AI"))) {
		rt.setAt(live(data), "name", rt.fv(f, "name", rt.sv(f, "AI")));
		rt.setAt(live(data), "laws", rt.callName(f, rt.fv(f, "laws", rt.sv(f, "AI")), "get_law_list", ["include_zeroth", 1], rt.Args.Named));
		rt.setAt(live(data), "health", divide(add(rt.fv(f, "health", rt.sv(f, "AI")), 100), 2));
		rt.setAt(live(data), "wireless", (!truthy(rt.fv(f, "control_disabled", rt.sv(f, "AI"))) ? 1 : 0));
		rt.setAt(live(data), "radio", rt.fv(f, "radio_enabled", rt.sv(f, "AI")));
		rt.setAt(live(data), "isDead", (isEqual(rt.fv(f, "stat", rt.sv(f, "AI")), 2) ? 1 : 0));
		$0 = live(data);
		$1 = "isBraindead";
		if (truthy(rt.fv(f, "client", rt.sv(f, "AI")))) {
			$2 = 0;
		} else {
			$2 = 1;
		}
		rt.setAt($0, $1, $2);
	}
	rt.setAt(live(data), "wiping", rt.sv(f, "flush"));
	return live(data);
});

// /obj/item/device/aicard/proc/ui_act  (code/game/objects/items/devices/aicard.dm:61)  may sleep
rt.def("/obj/item/device/aicard/proc/ui_act", function* ui_act(f: Frame) {
	let confirm: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [confirm, $0, $1, $2];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "wipe") {
		if (truthy(rt.sv(f, "flush"))) {
			rt.setSv(f, "flush", 0);
		} else {
			if ((isEqual((confirm = (yield* g.call(f, P("/proc/alert"), null, ["Are you sure you want to wipe this card's memory?", rt.sv(f, "name"), "Yes", "No"]))), "Yes") && !truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
				rt.setSv(f, "flush", 1);
				if ((truthy(rt.sv(f, "AI")) && isEqual(rt.fv(f, "loc", rt.sv(f, "AI")), live(f.src)))) {
					yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "AI"), "Your core files are being wiped!"]);
					while (!isEqual(rt.fv(f, "stat", rt.sv(f, "AI")), 2) && truthy(rt.sv(f, "flush"))) {
						yield* g.callName(f, rt.sv(f, "AI"), "adjustOxyLoss", [1]);
						yield* g.callName(f, rt.sv(f, "AI"), "updatehealth", []);
						yield* g.call(f, P("/proc/sleep"), null, [5]);
					}
					rt.setSv(f, "flush", 0);
				}
			}
		}
		f.dot = 1;
	} else if ($0 === "wireless") {
		rt.setFv(f, "control_disabled", rt.sv(f, "AI"), (!truthy(rt.fv(f, "control_disabled", rt.sv(f, "AI"))) ? 1 : 0));
		$0 = rt.sv(f, "AI");
		$1 = live(f.src);
		if (truthy(rt.fv(f, "control_disabled", rt.sv(f, "AI")))) {
			$2 = "disabled";
		} else {
			$2 = "enabled";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("＀'s wireless port has been ＀!", [$1, $2])]);
		f.dot = 1;
	} else if ($0 === "radio") {
		rt.setFv(f, "radio_enabled", rt.sv(f, "AI"), (!truthy(rt.fv(f, "radio_enabled", rt.sv(f, "AI"))) ? 1 : 0));
		$0 = rt.sv(f, "AI");
		if (truthy(rt.fv(f, "radio_enabled", rt.sv(f, "AI")))) {
			$1 = "enabled";
		} else {
			$1 = "disabled";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("Your Subspace Transceiver has been ＀!", [$1])]);
		f.dot = 1;
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["action", "params"] });
