// From code/game/machinery/computer/prisoner.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10406, "/obj/machinery/computer/prisoner", "/obj/machinery/computer", {
	id: 0,
	temp: null,
	status: 0,
	timeleft: 60,
	stop: 0,
	screen: 0,
	inserted_id: null,
	icon_screen: "explosive",
	icon_keyboard: "security_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/prisoner"),
	light_color: "#FA8282",
	name: "prisoner management console",
	desc: "Used to manage tracking implants placed inside criminals.",
	req_access: null,
});

// /obj/machinery/computer/prisoner/proc/<init>  (code/game/machinery/computer/prisoner.dm:6)
rt.def("/obj/machinery/computer/prisoner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(2));
	return f.dot;
});

// /obj/machinery/computer/prisoner/proc/attack_hand  (code/game/machinery/computer/prisoner.dm:19)  may sleep
rt.def("/obj/machinery/computer/prisoner/proc/attack_hand", function* attack_hand(f: Frame) {
	let dat: Value = null, Tr: Value = null, C: Value = null, _T: Value = null, loc_display: Value = null, M: Value = null, mob_loc: Value = null, popup: Value = null;
	let $e: any;
	f.vars = () => [dat, Tr, C, _T, loc_display, M, mob_loc, popup, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "set_machine", [live(f.src)]);
	dat = "";
	if (isEqual(rt.sv(f, "screen"), 0)) {
		dat = rt.modify(live(dat), fmt("<HR><A href='?src=＃;lock=1'>Unlock Console</A>", [live(f.src)]), add);
	} else {
		if (isEqual(rt.sv(f, "screen"), 1)) {
			dat = rt.modify(live(dat), "<H3>Prisoner ID Management</H3>", add);
			if (truthy(rt.sv(f, "inserted_id"))) {
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;id=eject'>＀</A><br>", [live(f.src), rt.sv(f, "inserted_id")]), add);
				dat = rt.modify(live(dat), fmt("Collected Points: ＀. <A href='?src=＃;id=reset'>Reset.</A><br>", [rt.fv(f, "points", rt.sv(f, "inserted_id")), live(f.src)]), add);
				dat = rt.modify(live(dat), fmt("Card goal: ＀.  <A href='?src=＃;id=setgoal'>Set </A><br>", [rt.fv(f, "goal", rt.sv(f, "inserted_id")), live(f.src)]), add);
				dat = rt.modify(live(dat), "Space Law recommends quotas of 100 points per minute they would normally serve in the brig.<BR>", add);
			} else {
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;id=insert'>Insert Prisoner ID.</A><br>", [live(f.src)]), add);
			}
			dat = rt.modify(live(dat), "<H3>Prisoner Implant Management</H3>", add);
			dat = rt.modify(live(dat), "<HR>Chemical Implants<BR>", add);
			Tr = null;
			C = null;
			rt.forList(f, 0, rt.gl("tracked_chem_implants"), T("/obj/item/weapon/implant/chem"));
			while (($e = rt.next(f, 0)) !== undefined) {
				C = $e;
				if ((truthy((Tr = rt.getStep(f, live(C), 0))) && !isEqual(rt.fv(f, "z", live(Tr)), rt.fv(f, "z", live(f.src))))) {
					continue;
				}
				if (!truthy(rt.fv(f, "imp_in", live(C)))) {
					continue;
				}
				dat = rt.modify(live(dat), fmt("ID: ＀ | Remaining Units: ＀ <BR>", [rt.gv(f, "name", rt.fv(f, "imp_in", live(C))), rt.gv(f, "total_volume", rt.fv(f, "reagents", live(C)))]), add);
				dat = rt.modify(live(dat), "| Inject: ", add);
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;inject1=＃'>(<font class='bad'>(1)</font>)</A>", [live(f.src), live(C)]), add);
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;inject5=＃'>(<font class='bad'>(5)</font>)</A>", [live(f.src), live(C)]), add);
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;inject10=＃'>(<font class='bad'>(10)</font>)</A><BR>", [live(f.src), live(C)]), add);
				dat = rt.modify(live(dat), "********************************<BR>", add);
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "<HR>Tracking Implants<BR>", add);
			_T = null;
			rt.forList(f, 0, rt.gl("tracked_implants"), T("/obj/item/weapon/implant/tracking"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_T = $e;
				if (!truthy((rt.istype(rt.fv(f, "imp_in", live(_T)), T("/mob/living")) ? 1 : 0))) {
					continue;
				}
				if ((truthy((Tr = rt.getStep(f, live(_T), 0))) && !isEqual(rt.fv(f, "z", live(Tr)), rt.fv(f, "z", live(f.src))))) {
					continue;
				}
				loc_display = "Unknown";
				M = rt.fv(f, "imp_in", live(_T));
				if ((isEqual(rt.fv(f, "z", live(Tr)), 2) && !truthy((rt.istype(rt.fv(f, "loc", live(M)), T("/turf/open/space")) ? 1 : 0)))) {
					loc_display = rt.gv(f, "loc", (mob_loc = rt.getStep(f, live(M), 0)));
				}
				dat = rt.modify(live(dat), fmt("ID: ＀ | Location: ＀<BR>", [rt.gv(f, "name", rt.fv(f, "imp_in", live(_T))), live(loc_display)]), add);
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;warn=＃'>(<font class='bad'><i>Message Holder</i></font>)</A> |<BR>", [live(f.src), live(_T)]), add);
				dat = rt.modify(live(dat), "********************************<BR>", add);
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), fmt("<HR><A href='?src=＃;lock=1'>Lock Console</A>", [live(f.src)]), add);
		}
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.args[0]), "computer", "Prisoner Management Console", 400, 500]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(f.args[0]), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/machinery/computer/prisoner/proc/attackby  (code/game/machinery/computer/prisoner.dm:74)  may sleep
rt.def("/obj/machinery/computer/prisoner/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
		return (yield* g.srcCall(f, "attack_hand", live(f.args[1])));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/computer/prisoner/proc/process  (code/game/machinery/computer/prisoner.dm:80)  may sleep
rt.def("/obj/machinery/computer/prisoner/proc/process", function* process(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		yield* g.callName(f, live(f.src), "updateDialog", []);
	}
	return live(f.dot);
}, true, { waitfor: false });

// /obj/machinery/computer/prisoner/proc/Topic  (code/game/machinery/computer/prisoner.dm:86)  may sleep
rt.def("/obj/machinery/computer/prisoner/proc/Topic", function* Topic(f: Frame) {
	let I: Value = null, num: Value = null, warning: Value = null, I_1: Value = null, R: Value = null;
	let $0: any;
	f.vars = () => [I, num, warning, I_1, R, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (((truthy((yield* g.callName(f, rt.fv(f, "contents", live(f.usr)), "Find", [live(f.src)]))) || (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))))) || truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0)))) {
		yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
		if (truthy(rt.at(live(f.args[1]), "id"))) {
			if ((isEqual(rt.at(live(f.args[1]), "id"), "insert") && !truthy(rt.sv(f, "inserted_id")))) {
				if (truthy((rt.istype((I = (yield* g.callName(f, live(f.usr), "get_active_held_item", []))), T("/obj/item/weapon/card/id/prisoner")) ? 1 : 0))) {
					if (!truthy((yield* g.callName(f, live(f.usr), "drop_item", [])))) {
						return live(f.dot);
					}
					rt.setFv(f, "loc", live(I), live(f.src));
					rt.setSv(f, "inserted_id", live(I));
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>No valid ID.</span>"]);
				}
			} else {
				if (truthy(rt.sv(f, "inserted_id"))) {
					$0 = rt.at(live(f.args[1]), "id");
					if ($0 === "eject") {
						rt.setFv(f, "loc", rt.sv(f, "inserted_id"), rt.getStep(f, live(f.src), 0));
						yield* g.callName(f, rt.sv(f, "inserted_id"), "verb_pickup", []);
						rt.setSv(f, "inserted_id", null);
					} else if ($0 === "reset") {
						rt.setFv(f, "points", rt.sv(f, "inserted_id"), 0);
					} else if ($0 === "setgoal") {
						if (rt.ge((num = (yield* g.call(f, P("/proc/round"), null, [(yield* g.op(f, "Prompt", [33], [null, "Input an Integer", "Choose prisoner's goal:", live(f.usr), null]))]))), 0)) {
							num = (yield* g.call(f, P("/proc/min"), null, [live(num), 1000]));
							rt.setFv(f, "goal", rt.sv(f, "inserted_id"), live(num));
						}
					}
				}
			}
		} else {
			if (truthy(rt.at(live(f.args[1]), "inject1"))) {
				if ((truthy((I = rt.locateIn(f, rt.at(live(f.args[1]), "inject1"), rt.gl("tracked_chem_implants")))) && truthy((rt.istype(live(I), T("/obj/item/weapon/implant")) ? 1 : 0)))) {
					yield* g.callName(f, live(I), "activate", [1]);
				}
			} else {
				if (truthy(rt.at(live(f.args[1]), "inject5"))) {
					if ((truthy((I = rt.locateIn(f, rt.at(live(f.args[1]), "inject5"), rt.gl("tracked_chem_implants")))) && truthy((rt.istype(live(I), T("/obj/item/weapon/implant")) ? 1 : 0)))) {
						yield* g.callName(f, live(I), "activate", [5]);
					}
				} else {
					if (truthy(rt.at(live(f.args[1]), "inject10"))) {
						if ((truthy((I = rt.locateIn(f, rt.at(live(f.args[1]), "inject10"), rt.gl("tracked_chem_implants")))) && truthy((rt.istype(live(I), T("/obj/item/weapon/implant")) ? 1 : 0)))) {
							yield* g.callName(f, live(I), "activate", [10]);
						}
					} else {
						if (truthy(rt.at(live(f.args[1]), "lock"))) {
							if (truthy((yield* g.callName(f, live(f.src), "allowed", [live(f.usr)])))) {
								rt.setSv(f, "screen", (!truthy(rt.sv(f, "screen")) ? 1 : 0));
							} else {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Unauthorized Access."]);
							}
						} else {
							if (truthy(rt.at(live(f.args[1]), "warn"))) {
								if (!truthy((warning = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [2], ["", "Enter your message here!", "Message:", live(f.usr), null]))])), 1, 1024]))))) {
									return live(f.dot);
								}
								if (((truthy((I_1 = rt.locateIn(f, rt.at(live(f.args[1]), "warn"), rt.gl("tracked_implants")))) && truthy((rt.istype(live(I_1), T("/obj/item/weapon/implant")) ? 1 : 0))) && truthy(rt.fv(f, "imp_in", live(I_1))))) {
									yield* g.call(f, P("/proc/to_chat"), null, [(R = rt.fv(f, "imp_in", live(I_1))), fmt("<span class='italics'>You hear a voice in your head saying: '＀'</span>", [live(warning)])]);
									yield* g.call(f, P("/proc/log_say"), null, [fmt("＀/＀ sent an implant message to ＀/＀: '＀'", [live(f.usr), rt.fv(f, "ckey", live(f.usr)), live(R), rt.fv(f, "ckey", live(R)), live(warning)])]);
								}
							}
						}
					}
				}
			}
		}
		yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.usr)]);
	}
	yield* g.callName(f, live(f.src), "updateUsrDialog", []);
	return live(f.dot);
}, true, { args: ["href", "href_list"] });
