// From code/game/machinery/computer/aifixer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/machinery/computer/aifixer/proc/attackby  (code/game/machinery/computer/aifixer.dm:13)  may sleep
rt.def("/obj/machinery/computer/aifixer/proc/attackby", function* attackby(f: Frame) {
	if ((truthy(rt.sv(f, "occupier")) && truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)))) {
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The screws on ＀'s screen won't budge.</span>", [rt.sv(f, "name")])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The screws on ＀'s screen won't budge and it emits a warning beep.</span>", [rt.sv(f, "name")])]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/computer/aifixer/proc/attack_hand  (code/game/machinery/computer/aifixer.dm:22)  may sleep
rt.def("/obj/machinery/computer/aifixer/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "interact", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/computer/aifixer/proc/interact  (code/game/machinery/computer/aifixer.dm:28)  may sleep
rt.def("/obj/machinery/computer/aifixer/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, laws: Value = null, index: Value = null, law: Value = null, num: Value = null, number: Value = null, index_3: Value = null, law_4: Value = null, popup: Value = null;
	f.vars = () => [user, dat, laws, index, law, num, number, index_3, law_4, popup];
	dat = "";
	if (truthy(rt.fv(f, "occupier", live(f.src)))) {
		laws = null;
		dat = rt.modify(live(dat), fmt("<h3>Stored AI: ＀</h3>", [rt.gv(f, "name", rt.fv(f, "occupier", live(f.src)))]), add);
		dat = rt.modify(live(dat), fmt("<b>System integrity:</b> ＀%<br>", [divide(add(rt.gv(f, "health", rt.fv(f, "occupier", live(f.src))), 100), 2)]), add);
		if (truthy(rt.gv(f, "zeroth", rt.gv(f, "laws", rt.fv(f, "occupier", live(f.src)))))) {
			laws = rt.modify(live(laws), fmt("<b>0:</b> ＀<BR>", [rt.gv(f, "zeroth", rt.gv(f, "laws", rt.fv(f, "occupier", live(f.src))))]), add);
		}
		index = null;
		index = 1;
		while (rt.le(live(index), rt.getLen(f, rt.gv(f, "ion", rt.gv(f, "laws", rt.fv(f, "occupier", live(f.src))))))) {
			if (rt.gt(rt.length((law = rt.index(rt.gv(f, "ion", rt.gv(f, "laws", rt.fv(f, "occupier", live(f.src)))), live(index)))), 0)) {
				laws = rt.modify(live(laws), fmt("<b>＀:</b> ＀<BR>", [(num = (yield* g.call(f, P("/proc/ionnum"), null, []))), live(law)]), add);
			}
			index = rt.inc(live(index), 1);
		}
		number = 1;
		index_3 = null;
		index_3 = 1;
		while (rt.le(live(index_3), rt.getLen(f, rt.gv(f, "inherent", rt.gv(f, "laws", rt.fv(f, "occupier", live(f.src))))))) {
			if (rt.gt(rt.length((law_4 = rt.index(rt.gv(f, "inherent", rt.gv(f, "laws", rt.fv(f, "occupier", live(f.src)))), live(index_3)))), 0)) {
				laws = rt.modify(live(laws), fmt("<b>＀:</b> ＀<BR>", [live(number), live(law_4)]), add);
				number = rt.inc(live(number), 1);
			}
			index_3 = rt.inc(live(index_3), 1);
		}
		index_3 = null;
		index_3 = 1;
		while (rt.le(live(index_3), rt.getLen(f, rt.gv(f, "supplied", rt.gv(f, "laws", rt.fv(f, "occupier", live(f.src))))))) {
			if (rt.gt(rt.length((law_4 = rt.index(rt.gv(f, "supplied", rt.gv(f, "laws", rt.fv(f, "occupier", live(f.src)))), live(index_3)))), 0)) {
				laws = rt.modify(live(laws), fmt("<b>＀:</b> ＀<BR>", [live(number), live(law_4)]), add);
				number = rt.inc(live(number), 1);
			}
			index_3 = rt.inc(live(index_3), 1);
		}
		dat = rt.modify(live(dat), fmt("<b>Laws:</b><br>＀<br>", [live(laws)]), add);
		if (isEqual(rt.gv(f, "stat", rt.fv(f, "occupier", live(f.src))), 2)) {
			dat = rt.modify(live(dat), "<span class='bad'>AI non-functional</span>", add);
		} else {
			dat = rt.modify(live(dat), "<span class='good'>AI functional</span>", add);
		}
		if (!truthy(rt.fv(f, "active", live(f.src)))) {
			dat = rt.modify(live(dat), fmt("<br><br><A href='byond://?src=＃;fix=1'>Begin Reconstruction</A>", [live(f.src)]), add);
		} else {
			dat = rt.modify(live(dat), "<br><br>Reconstruction in process, please wait.<br>", add);
		}
	}
	dat = rt.modify(live(dat), fmt("<br><A href='?src=＃;mach_close=computer'>Close</A>", [live(user)]), add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "computer", "AI System Integrity Restorer", 400, 500]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(user), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true);

// /obj/machinery/computer/aifixer/proc/Fix  (code/game/machinery/computer/aifixer.dm:75)  may sleep
rt.def("/obj/machinery/computer/aifixer/proc/Fix", function* Fix(f: Frame) {
	yield* g.srcCall(f, "use_power", 1000);
	yield* g.callName(f, rt.sv(f, "occupier"), "adjustOxyLoss", [-1, 0]);
	yield* g.callName(f, rt.sv(f, "occupier"), "adjustFireLoss", [-1, 0]);
	yield* g.callName(f, rt.sv(f, "occupier"), "adjustToxLoss", [-1, 0]);
	yield* g.callName(f, rt.sv(f, "occupier"), "adjustBruteLoss", [-1, 0]);
	yield* g.callName(f, rt.sv(f, "occupier"), "updatehealth", []);
	yield* g.callName(f, rt.sv(f, "occupier"), "updatehealth", []);
	if ((rt.ge(rt.fv(f, "health", rt.sv(f, "occupier")), 0) && isEqual(rt.fv(f, "stat", rt.sv(f, "occupier")), 2))) {
		yield* g.callName(f, rt.sv(f, "occupier"), "revive", []);
	}
	return (rt.lt(rt.fv(f, "health", rt.sv(f, "occupier")), 100) ? 1 : 0);
}, true);

// /obj/machinery/computer/aifixer/proc/process  (code/game/machinery/computer/aifixer.dm:87)  may sleep
rt.def("/obj/machinery/computer/aifixer/proc/process", function* process(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (truthy(rt.sv(f, "active"))) {
		rt.setSv(f, "active", (yield* g.srcCall(f, "Fix")));
	}
	yield* g.srcCall(f, "updateDialog");
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/computer/aifixer/proc/Topic  (code/game/machinery/computer/aifixer.dm:94)  may sleep
rt.def("/obj/machinery/computer/aifixer/proc/Topic", function* Topic(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy(rt.at(live(f.args[1]), "fix"))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Reconstruction in progress. This will take several minutes.</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 25, 0]);
	rt.setSv(f, "active", 1);
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/computer/aifixer/proc/update_icon  (code/game/machinery/computer/aifixer.dm:103)
rt.def("/obj/machinery/computer/aifixer/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	} else {
		if (truthy(rt.sv(f, "active"))) {
			rt.callSrc(f, "add_overlay", ["ai-fixer-on"]);
		}
		if (truthy(rt.sv(f, "occupier"))) {
			$0 = rt.fv(f, "stat", rt.sv(f, "occupier"));
			if ($0 === 0) {
				rt.callSrc(f, "add_overlay", ["ai-fixer-full"]);
			} else if ($0 === 2) {
				rt.callSrc(f, "add_overlay", ["ai-fixer-404"]);
			}
		} else {
			rt.callSrc(f, "add_overlay", ["ai-fixer-empty"]);
		}
	}
	return f.dot;
});

// /obj/machinery/computer/aifixer/proc/transfer_ai  (code/game/machinery/computer/aifixer.dm:119)  may sleep
rt.def("/obj/machinery/computer/aifixer/proc/transfer_ai", function* transfer_ai(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (isEqual(live(f.args[0]), 2)) {
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("＀ is offline and cannot take an AI at this time!", [live(f.src)])]);
			return live(f.dot);
		}
		yield* g.callName(f, live(f.args[2]), "forceMove", [live(f.src)]);
		rt.setSv(f, "occupier", live(f.args[2]));
		rt.setFv(f, "control_disabled", live(f.args[2]), 1);
		rt.setFv(f, "radio_enabled", live(f.args[2]), 0);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[2]), "You have been uploaded to a stationary terminal. Sadly, there is no remote access from here."]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='boldnotice'>Transfer successful</span>: ＀ (＀.exe) installed and executed successfully. Local copy has been removed.", [rt.fv(f, "name", live(f.args[2])), (yield* g.call(f, P("/proc/rand"), null, [1000, 9999]))])]);
		rt.setFv(f, "AI", live(f.args[3]), null);
		yield* g.srcCall(f, "update_icon");
	} else {
		if ((truthy(rt.sv(f, "occupier")) && !truthy(rt.sv(f, "active")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "occupier"), "You have been downloaded to a mobile storage device. Still no remote access."]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='boldnotice'>Transfer successful</span>: ＀ (＀.exe) removed from host terminal and stored within local memory.", [rt.fv(f, "name", rt.sv(f, "occupier")), (yield* g.call(f, P("/proc/rand"), null, [1000, 9999]))])]);
			rt.setFv(f, "loc", rt.sv(f, "occupier"), live(f.args[3]));
			rt.setFv(f, "AI", live(f.args[3]), rt.sv(f, "occupier"));
			rt.setSv(f, "occupier", null);
			yield* g.srcCall(f, "update_icon");
		} else {
			if (truthy(rt.sv(f, "active"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='boldannounce'>ERROR</span>: Reconstruction in progress."]);
			} else {
				if (truthy(rt.sv(f, "occupier"))) return f.dot;
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='boldannounce'>ERROR</span>: Unable to locate artificial intelligence."]);
			}
		}
	}
	return f.dot;
}, true, { args: ["interaction", "user", "AI", "card"] });
