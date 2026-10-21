// From code/modules/detectivework/scanner.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9392, "/obj/item/device/detective_scanner", "/obj/item/device", {
	scanning: 0,
	log: null,
	range: 8,
	view_check: 1,
	flags: 68,
	name: "forensic scanner",
	desc: "Used to remotely scan objects and biomass for DNA and fingerprints. Can print a report of the findings.",
	icon_state: "forensicnew",
	w_class: 2,
	item_state: "electronic",
	slot_flags: 512,
	origin_tech: "engineering=4;biotech=2;programming=5",
});

// /obj/item/device/detective_scanner/proc/<init>  (code/modules/detectivework/scanner.dm:14)
rt.def("/obj/item/device/detective_scanner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "log", rt.list());
	return f.dot;
});

// /obj/item/device/detective_scanner/proc/attack_self  (code/modules/detectivework/scanner.dm:20)  may sleep
rt.def("/obj/item/device/detective_scanner/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((truthy(rt.len(f, rt.sv(f, "log"))) && !truthy(rt.sv(f, "scanning")))) {
		rt.setSv(f, "scanning", 1);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Printing report, please wait...</span>"]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/device/detective_scanner/proc/PrintReport")])), 100]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The scanner has no logs or is in use.</span>"]);
	}
	return f.dot;
}, true);

// /obj/item/device/detective_scanner/proc/PrintReport  (code/modules/detectivework/scanner.dm:32)  may sleep
rt.def("/obj/item/device/detective_scanner/proc/PrintReport", function* PrintReport(f: Frame) {
	let _P: Value = null, M: Value = null;
	f.vars = () => [_P, M];
	rt.setFv(f, "name", (_P = (yield* g.new_(f, T("/obj/item/weapon/paper"), [rt.getStep(f, live(f.src), 0)]))), "paper- 'Scanner Report'");
	rt.setFv(f, "info", live(_P), "<center><font size='6'><B>Scanner Report</B></font></center><HR><BR>");
	rt.modField(f, live(_P), "info", (yield* g.call(f, P("/proc/jointext"), null, [rt.sv(f, "log"), "<BR>"])), add);
	rt.modField(f, live(_P), "info", "<HR><B>Notes:</B><BR>", add);
	rt.setFv(f, "info_links", live(_P), rt.fv(f, "info", live(_P)));
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) {
		yield* g.callName(f, (M = rt.sv(f, "loc")), "put_in_hands", [live(_P)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='notice'>Report printed. Log cleared.<span>"]);
	}
	rt.setSv(f, "log", rt.list());
	rt.setSv(f, "scanning", 0);
	return f.dot;
}, true);

// /obj/item/device/detective_scanner/proc/afterattack  (code/modules/detectivework/scanner.dm:49)
rt.def("/obj/item/device/detective_scanner/proc/afterattack", function afterattack(f: Frame, A: Value, user: Value, params: Value) {
	rt.callSrc(f, "scan", [live(A), live(user)]);
	return 0;
});

// /obj/item/device/detective_scanner/proc/scan  (code/modules/detectivework/scanner.dm:54)  may sleep
rt.def("/obj/item/device/detective_scanner/proc/scan", function* scan(f: Frame, A: Value, user: Value) {
	let fingerprints: Value = null, blood: Value = null, fibers: Value = null, reagents: Value = null, target_name: Value = null, H: Value = null, R: Value = null, blood_DNA: Value = null, blood_type: Value = null, found_something: Value = null, finger: Value = null, B: Value = null, fiber: Value = null, R_6: Value = null, holder: Value = null;
	let $e: any;
	f.vars = () => [A, user, fingerprints, blood, fibers, reagents, target_name, H, R, blood_DNA, blood_type, found_something, finger, B, fiber, R_6, holder, $e];
	if (truthy(rt.sv(f, "scanning"))) return f.dot;
	if (((rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(A), live(user)])), rt.sv(f, "range")) || (!truthy((rt.isIn(f, live(A), (yield* g.call(f, P("/proc/view"), null, [rt.sv(f, "range"), live(user)]))) ? 1 : 0)) && truthy(rt.sv(f, "view_check")))) || !isEqual(rt.sv(f, "loc"), live(user)))) {
		return live(f.dot);
	}
	rt.setSv(f, "scanning", 1);
	yield* g.callName(f, live(user), "visible_message", [fmt("＄！ points the ＀ at ％！ and performs a forensic scan.", [live(user), rt.fv(f, "name", live(f.src)), live(A)])]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You scan ％！. The scanner is now analysing the results...</span>", [live(A)])]);
	fingerprints = rt.list();
	blood = rt.list();
	fibers = rt.list();
	reagents = rt.list();
	target_name = rt.fv(f, "name", live(A));
	if ((truthy(rt.fv(f, "blood_DNA", live(A))) && truthy(rt.getLen(f, rt.fv(f, "blood_DNA", live(A)))))) {
		blood = (yield* g.callName(f, rt.fv(f, "blood_DNA", live(A)), "Copy", []));
	}
	if ((truthy(rt.fv(f, "suit_fibers", live(A))) && truthy(rt.getLen(f, rt.fv(f, "suit_fibers", live(A)))))) {
		fibers = (yield* g.callName(f, rt.fv(f, "suit_fibers", live(A)), "Copy", []));
	}
	if (truthy((rt.istype(live(A), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (!truthy(rt.gv(f, "gloves", (H = live(A))))) {
			fingerprints = rt.modify(live(fingerprints), (yield* g.call(f, P("/proc/md5"), null, [rt.gv(f, "uni_identity", rt.fv(f, "dna", live(H)))])), add);
		}
	} else {
		if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(A)])))) {
			if ((truthy(rt.fv(f, "fingerprints", live(A))) && truthy(rt.getLen(f, rt.fv(f, "fingerprints", live(A)))))) {
				fingerprints = (yield* g.callName(f, rt.fv(f, "fingerprints", live(A)), "Copy", []));
			}
			if ((truthy(rt.fv(f, "reagents", live(A))) && truthy(rt.getLen(f, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(A))))))) {
				R = null;
				rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(A))), T("/datum/reagent"));
				while (($e = rt.next(f, 0)) !== undefined) {
					R = $e;
					rt.setAt(live(reagents), rt.fv(f, "name", live(R)), rt.fv(f, "volume", live(R)));
					if (truthy((rt.istype(live(R), T("/datum/reagent/blood")) ? 1 : 0))) {
						if ((truthy(rt.index(rt.fv(f, "data", live(R)), "blood_DNA")) && truthy(rt.index(rt.fv(f, "data", live(R)), "blood_type")))) {
							blood_DNA = rt.index(rt.fv(f, "data", live(R)), "blood_DNA");
							blood_type = rt.index(rt.fv(f, "data", live(R)), "blood_type");
							rt.setAt(live(blood), live(blood_DNA), live(blood_type));
						}
					}
				}
				rt.endFor(f, 0);
			}
		}
	}
	found_something = 0;
	yield* g.srcCall(f, "add_log", fmt("<B>＀＀ - ＀</B>", [(yield* g.call(f, P("/proc/worldtime2text"), null, [])), (yield* g.call(f, P("/proc/get_timestamp"), null, [])), live(target_name)]), 0);
	if ((truthy(live(fingerprints)) && truthy(rt.len(f, live(fingerprints))))) {
		yield* g.call(f, P("/proc/sleep"), null, [30]);
		yield* g.srcCall(f, "add_log", "<span class='info'><B>Prints:</B></span>");
		finger = null;
		rt.forList(f, 0, live(fingerprints));
		while (($e = rt.next(f, 0)) !== undefined) {
			finger = $e;
			yield* g.srcCall(f, "add_log", fmt("＀", [live(finger)]));
		}
		rt.endFor(f, 0);
		found_something = 1;
	}
	if ((truthy(live(blood)) && truthy(rt.len(f, live(blood))))) {
		yield* g.call(f, P("/proc/sleep"), null, [30]);
		yield* g.srcCall(f, "add_log", "<span class='info'><B>Blood:</B></span>");
		found_something = 1;
		B = null;
		rt.forList(f, 0, live(blood));
		while (($e = rt.next(f, 0)) !== undefined) {
			B = $e;
			yield* g.srcCall(f, "add_log", fmt("Type: <font color='red'>＀</font> DNA: <font color='red'>＀</font>", [rt.index(live(blood), live(B)), live(B)]));
		}
		rt.endFor(f, 0);
	}
	if ((truthy(live(fibers)) && truthy(rt.len(f, live(fibers))))) {
		yield* g.call(f, P("/proc/sleep"), null, [30]);
		yield* g.srcCall(f, "add_log", "<span class='info'><B>Fibers:</B></span>");
		fiber = null;
		rt.forList(f, 0, live(fibers));
		while (($e = rt.next(f, 0)) !== undefined) {
			fiber = $e;
			yield* g.srcCall(f, "add_log", fmt("＀", [live(fiber)]));
		}
		rt.endFor(f, 0);
		found_something = 1;
	}
	if ((truthy(live(reagents)) && truthy(rt.len(f, live(reagents))))) {
		yield* g.call(f, P("/proc/sleep"), null, [30]);
		yield* g.srcCall(f, "add_log", "<span class='info'><B>Reagents:</B></span>");
		R_6 = null;
		rt.forList(f, 0, live(reagents));
		while (($e = rt.next(f, 0)) !== undefined) {
			R_6 = $e;
			yield* g.srcCall(f, "add_log", fmt("Reagent: <font color='red'>＀</font> Volume: <font color='red'>＀</font>", [live(R_6), rt.index(live(reagents), live(R_6))]));
		}
		rt.endFor(f, 0);
		found_something = 1;
	}
	holder = null;
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.fv(f, "loc", live(f.src))])))) {
		holder = rt.fv(f, "loc", live(f.src));
	}
	if (!truthy(live(found_something))) {
		yield* g.srcCall(f, "add_log", "<I># No forensic traces found #</I>", 0);
		if (truthy(live(holder))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(holder), fmt("<span class='warning'>Unable to locate any fingerprints, materials, fibers, or blood on ％！!</span>", [live(target_name)])]);
		}
	} else {
		if (truthy(live(holder))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(holder), fmt("<span class='notice'>You finish scanning ％！.</span>", [live(target_name)])]);
		}
	}
	yield* g.srcCall(f, "add_log", "---------------------------------------------------------", 0);
	rt.setSv(f, "scanning", 0);
	return live(f.dot);
}, true, { waitfor: false });

// /obj/item/device/detective_scanner/proc/add_log  (code/modules/detectivework/scanner.dm:164)
rt.def("/obj/item/device/detective_scanner/proc/add_log", function add_log(f: Frame, msg: Value, broadcast: Value) {
	let M: Value = null;
	f.vars = () => [broadcast, M];
	if (live(broadcast) === null) {
		broadcast = 1;
	}
	if (truthy(rt.sv(f, "scanning"))) {
		if ((truthy(live(broadcast)) && truthy(rt.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) {
			rt.call(f, P("/proc/to_chat"), null, [(M = rt.sv(f, "loc")), live(msg)]);
		}
		rt.modSrcVar(f, "log", fmt("&nbsp;&nbsp;＀", [live(msg)]), add);
	} else {
		rt.call(f, P("/proc/CRASH"), null, [fmt("＀ ＃ is adding a log when it was never put in scanning mode!", [live(f.src), live(f.src)])]);
	}
	return f.dot;
});

// /proc/get_timestamp  (code/modules/detectivework/scanner.dm:172)
rt.def("/proc/get_timestamp", function get_timestamp(f: Frame) {
	return rt.call(f, P("/proc/time2text"), null, [add(rt.worldTime(f), 432000), ":ss"]);
});
