// From code/game/machinery/computer/cloning.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10377, "/obj/machinery/computer/cloning", "/obj/machinery/computer", {
	scanner: null,
	pods: null,
	temp: "Inactive",
	scantemp_ckey: null,
	scantemp: "Ready to Scan",
	menu: 1,
	records: null,
	active_record: null,
	diskette: null,
	loading: 0,
	autoprocess: 0,
	light_color: "#6496FA",
	name: "cloning console",
	desc: "Used to clone people and manage DNA.",
	icon_screen: "dna",
	icon_keyboard: "med_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/cloning"),
	req_access: null,
});

// /obj/machinery/computer/cloning/proc/<init>  (code/game/machinery/computer/cloning.dm:14)
rt.def("/obj/machinery/computer/cloning/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "records", rt.list());
	$0 = $0;
	rt.setSv(f, "req_access", rt.list(19));
	return f.dot;
});

// /obj/machinery/computer/cloning/proc/Initialize  (code/game/machinery/computer/cloning.dm:23)  may sleep
rt.def("/obj/machinery/computer/cloning/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "updatemodules", 1);
	return f.dot;
}, true);

// /obj/machinery/computer/cloning/proc/Destroy  (code/game/machinery/computer/cloning.dm:28)  may sleep
rt.def("/obj/machinery/computer/cloning/proc/Destroy", function* Destroy(f: Frame) {
	let _P: Value = null;
	let $e: any;
	f.vars = () => [_P, $e];
	if (truthy(rt.sv(f, "pods"))) {
		_P = null;
		rt.forList(f, 0, rt.sv(f, "pods"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_P = $e;
			yield* g.srcCall(f, "DetachCloner", live(_P));
		}
		rt.endFor(f, 0);
		rt.setSv(f, "pods", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/computer/cloning/proc/GetAvailablePod  (code/game/machinery/computer/cloning.dm:35)
rt.def("/obj/machinery/computer/cloning/proc/GetAvailablePod", function GetAvailablePod(f: Frame, mind: Value) {
	let _P: Value = null, pod: Value = null;
	let $e: any;
	f.vars = () => [mind, _P, pod, $e];
	if (live(mind) === null) {
		mind = null;
	}
	if (!truthy(rt.sv(f, "pods"))) return f.dot;
	_P = null;
	rt.forList(f, 0, rt.sv(f, "pods"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		if ((truthy(rt.gv(f, "occupant", (pod = live(_P)))) && isEqual(rt.fv(f, "clonemind", live(pod)), live(mind)))) {
			return null;
		}
		if ((truthy(rt.callName(f, live(pod), "is_operational", [])) && !(truthy(rt.fv(f, "occupant", live(pod))) || truthy(rt.fv(f, "mess", live(pod)))))) {
			return live(pod);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/computer/cloning/proc/HasEfficientPod  (code/game/machinery/computer/cloning.dm:44)
rt.def("/obj/machinery/computer/cloning/proc/HasEfficientPod", function HasEfficientPod(f: Frame) {
	let _P: Value = null, pod: Value = null;
	let $e: any;
	f.vars = () => [_P, pod, $e];
	if (!truthy(rt.sv(f, "pods"))) return f.dot;
	_P = null;
	rt.forList(f, 0, rt.sv(f, "pods"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		if ((truthy(rt.callName(f, (pod = live(_P)), "is_operational", [])) && rt.gt(rt.fv(f, "efficiency", live(pod)), 5))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/computer/cloning/proc/GetAvailableEfficientPod  (code/game/machinery/computer/cloning.dm:51)
rt.def("/obj/machinery/computer/cloning/proc/GetAvailableEfficientPod", function GetAvailableEfficientPod(f: Frame, mind: Value) {
	let _P: Value = null, pod: Value = null;
	let $e: any;
	f.vars = () => [mind, _P, pod, $e];
	if (live(mind) === null) {
		mind = null;
	}
	if (!truthy(rt.sv(f, "pods"))) return f.dot;
	_P = null;
	rt.forList(f, 0, rt.sv(f, "pods"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		if ((truthy(rt.gv(f, "occupant", (pod = live(_P)))) && isEqual(rt.fv(f, "clonemind", live(pod)), live(mind)))) {
			return live(pod);
		} else {
			if ((((!truthy(live(f.dot)) && truthy(rt.callName(f, live(pod), "is_operational", []))) && !(truthy(rt.fv(f, "occupant", live(pod))) || truthy(rt.fv(f, "mess", live(pod))))) && rt.gt(rt.fv(f, "efficiency", live(pod)), 5))) {
				f.dot = live(pod);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/computer/cloning/proc/process  (code/game/machinery/computer/cloning.dm:59)  may sleep
rt.def("/obj/machinery/computer/cloning/proc/process", function* process(f: Frame) {
	let R: Value = null, pod: Value = null;
	let $e: any;
	f.vars = () => [R, pod, $e];
	if (!((truthy(rt.sv(f, "scanner")) && truthy(rt.length(rt.sv(f, "pods")))) && truthy(rt.sv(f, "autoprocess")))) {
		return live(f.dot);
	}
	if ((truthy(rt.fv(f, "occupant", rt.sv(f, "scanner"))) && rt.gt(rt.fv(f, "scan_level", rt.sv(f, "scanner")), 2))) {
		yield* g.srcCall(f, "scan_occupant", rt.fv(f, "occupant", rt.sv(f, "scanner")));
	}
	R = null;
	rt.forList(f, 0, rt.sv(f, "records"), T("/datum/data/record"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (!truthy((pod = (yield* g.srcCall(f, "GetAvailableEfficientPod", rt.index(rt.fv(f, "fields", live(R)), "mind")))))) {
			return live(f.dot);
		}
		if (truthy(rt.fv(f, "occupant", live(pod)))) {
			continue;
		}
		if (truthy((yield* g.callName(f, live(pod), "growclone", [rt.index(rt.fv(f, "fields", live(R)), "ckey"), rt.index(rt.fv(f, "fields", live(R)), "name"), rt.index(rt.fv(f, "fields", live(R)), "UI"), rt.index(rt.fv(f, "fields", live(R)), "SE"), rt.index(rt.fv(f, "fields", live(R)), "mind"), rt.index(rt.fv(f, "fields", live(R)), "mrace"), rt.index(rt.fv(f, "fields", live(R)), "features"), rt.index(rt.fv(f, "fields", live(R)), "factions")])))) {
			(rt.modSrcVar(f, "records", live(R), subtract));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/computer/cloning/proc/updatemodules  (code/game/machinery/computer/cloning.dm:78)
rt.def("/obj/machinery/computer/cloning/proc/updatemodules", function updatemodules(f: Frame, findfirstcloner: Value) {
	rt.setFv(f, "scanner", live(f.src), rt.callSrc(f, "findscanner", []));
	if (!(truthy(live(findfirstcloner)) && !truthy(rt.length(rt.sv(f, "pods"))))) return f.dot;
	rt.callSrc(f, "findcloner", []);
	return f.dot;
});

// /obj/machinery/computer/cloning/proc/findscanner  (code/game/machinery/computer/cloning.dm:86)
rt.def("/obj/machinery/computer/cloning/proc/findscanner", function findscanner(f: Frame) {
	let scannerf: Value = null;
	let $e: any;
	f.vars = () => [scannerf, $e];
	scannerf = null;
	rt.forList(f, 0, rt.list(1, 4, 2, 8));
	while (($e = rt.next(f, 0)) !== undefined) {
		rt.setSv(f, "dir", $e);
		if (((scannerf = rt.locateIn(f, T("/obj/machinery/dna_scannernew"), rt.getStep(f, live(f.src), rt.sv(f, "dir")))) !== null && truthy(rt.callName(f, live(scannerf), "is_operational", [])))) {
			return live(scannerf);
		}
	}
	rt.endFor(f, 0);
	return null;
});

// /obj/machinery/computer/cloning/proc/findcloner  (code/game/machinery/computer/cloning.dm:101)
rt.def("/obj/machinery/computer/cloning/proc/findcloner", function findcloner(f: Frame) {
	let podf: Value = null;
	let $e: any;
	f.vars = () => [podf, $e];
	podf = null;
	rt.forList(f, 0, rt.list(1, 4, 2, 8));
	while (($e = rt.next(f, 0)) !== undefined) {
		rt.setSv(f, "dir", $e);
		if (((podf = rt.locateIn(f, T("/obj/machinery/clonepod"), rt.getStep(f, live(f.src), rt.sv(f, "dir")))) !== null && truthy(rt.callName(f, live(podf), "is_operational", [])))) {
			rt.callSrc(f, "AttachCloner", [live(podf)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/computer/cloning/proc/AttachCloner  (code/game/machinery/computer/cloning.dm:109)
rt.def("/obj/machinery/computer/cloning/proc/AttachCloner", function AttachCloner(f: Frame, pod: Value) {
	if (truthy(rt.fv(f, "connected", live(pod)))) return f.dot;
	rt.setFv(f, "connected", live(pod), live(f.src));
	if (!truthy(rt.sv(f, "pods"))) {
		rt.setSv(f, "pods", rt.list());
	}
	rt.modSrcVar(f, "pods", live(pod), add);
	return f.dot;
});

// /obj/machinery/computer/cloning/proc/DetachCloner  (code/game/machinery/computer/cloning.dm:114)
rt.def("/obj/machinery/computer/cloning/proc/DetachCloner", function DetachCloner(f: Frame, pod: Value) {
	rt.setFv(f, "connected", live(pod), null);
	if (!truthy(rt.sv(f, "pods"))) return f.dot;
	(rt.modSrcVar(f, "pods", live(pod), subtract));
	if (truthy(rt.len(f, rt.sv(f, "pods")))) return f.dot;
	rt.setSv(f, "pods", null);
	return f.dot;
});

// /obj/machinery/computer/cloning/proc/attackby  (code/game/machinery/computer/cloning.dm:118)  may sleep
rt.def("/obj/machinery/computer/cloning/proc/attackby", function* attackby(f: Frame) {
	let _P: Value = null, pod: Value = null;
	f.vars = () => [_P, pod];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/disk/data")) ? 1 : 0))) {
		if (!truthy(rt.fv(f, "diskette", live(f.src)))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return live(f.dot);
			}
			rt.setFv(f, "loc", live(f.args[0]), live(f.src));
			rt.setFv(f, "diskette", live(f.src), live(f.args[0]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀.</span>", [live(f.args[0])])]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_insert_disc.ogg"), 50, 0]);
			yield* g.callName(f, live(f.src), "updateUsrDialog", []);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
			if (truthy((rt.istype(rt.gv(f, "buffer", (_P = live(f.args[0]))), T("/obj/machinery/clonepod")) ? 1 : 0))) {
				if (!isEqual((yield* g.call(f, P("/proc/get_area"), null, [rt.fv(f, "buffer", live(_P))])), (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<font color = #666633>-% Cannot link machines across power zones. Buffer cleared %-</font color>"]);
					rt.setFv(f, "buffer", live(_P), null);
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<font color = #666633>-% Successfully linked ＀ with ＀ %-</font color>", [rt.fv(f, "buffer", live(_P)), live(f.src)])]);
				if (truthy(rt.gv(f, "connected", (pod = rt.fv(f, "buffer", live(_P)))))) {
					yield* g.callName(f, rt.fv(f, "connected", live(pod)), "DetachCloner", [live(pod)]);
				}
				yield* g.srcCall(f, "AttachCloner", live(pod));
			} else {
				rt.setFv(f, "buffer", live(_P), live(f.src));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<font color = #666633>-% Successfully stored ＃ ＀ in buffer %-</font color>", [rt.fv(f, "buffer", live(_P)), rt.gv(f, "name", rt.fv(f, "buffer", live(_P)))])]);
			}
			return live(f.dot);
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/computer/cloning/proc/attack_hand  (code/game/machinery/computer/cloning.dm:148)  may sleep
rt.def("/obj/machinery/computer/cloning/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "interact", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/computer/cloning/proc/interact  (code/game/machinery/computer/cloning.dm:153)  may sleep
rt.def("/obj/machinery/computer/cloning/proc/interact", function* interact(f: Frame) {
	let dat: Value = null, scanner_occupant: Value = null, R: Value = null, H: Value = null, L: Value = null, popup: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [dat, scanner_occupant, R, H, L, popup, $0, $1, $e];
	yield* g.callName(f, live(f.args[0]), "set_machine", [live(f.src)]);
	yield* g.srcCall(f, "add_fingerprint", live(f.args[0]));
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "updatemodules", 1);
	dat = "";
	dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;refresh=1'>Refresh</a>", [live(f.src)]), add);
	if (((truthy(rt.sv(f, "scanner")) && truthy((yield* g.srcCall(f, "HasEfficientPod")))) && rt.gt(rt.fv(f, "scan_level", rt.sv(f, "scanner")), 2))) {
		if (!truthy(rt.sv(f, "autoprocess"))) {
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;task=autoprocess'>Autoprocess</a>", [live(f.src)]), add);
		} else {
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;task=stopautoprocess'>Stop autoprocess</a>", [live(f.src)]), add);
		}
	} else {
		dat = rt.modify(live(dat), "<span class='linkOff'>Autoprocess</span>", add);
	}
	dat = rt.modify(live(dat), "<h3>Cloning Pod Status</h3>", add);
	dat = rt.modify(live(dat), fmt("<div class='statusDisplay'>＀&nbsp;</div>", [rt.sv(f, "temp")]), add);
	$0 = rt.fv(f, "menu", live(f.src));
	if ($0 === 1) {
		if ((rt.fv(f, "scanner", live(f.src)) === null || !truthy(rt.length(rt.sv(f, "pods"))))) {
			dat = rt.modify(live(dat), "<h3>Modules</h3>", add);
			if (rt.fv(f, "scanner", live(f.src)) === null) {
				dat = rt.modify(live(dat), "<font class='bad'>ERROR: No Scanner detected!</font><br>", add);
			}
			if (!truthy(rt.length(rt.sv(f, "pods")))) {
				dat = rt.modify(live(dat), "<font class='bad'>ERROR: No Pod detected</font><br>", add);
			}
		}
		if (rt.fv(f, "scanner", live(f.src)) !== null) {
			scanner_occupant = (yield* g.call(f, P("/proc/get_mob_or_brainmob"), null, [rt.fv(f, "occupant", rt.sv(f, "scanner"))]));
			dat = rt.modify(live(dat), "<h3>Scanner Functions</h3>", add);
			dat = rt.modify(live(dat), "<div class='statusDisplay'>", add);
			if (!truthy(live(scanner_occupant))) {
				dat = rt.modify(live(dat), "Scanner Unoccupied", add);
			} else {
				if (truthy(rt.sv(f, "loading"))) {
					dat = rt.modify(live(dat), fmt("＀ => Scanning...", [live(scanner_occupant)]), add);
				} else {
					if (!isEqual(rt.fv(f, "ckey", live(scanner_occupant)), rt.sv(f, "scantemp_ckey"))) {
						rt.setSv(f, "scantemp", "Ready to Scan");
						rt.setSv(f, "scantemp_ckey", rt.fv(f, "ckey", live(scanner_occupant)));
					}
					dat = rt.modify(live(dat), fmt("＀ => ＀", [live(scanner_occupant), rt.sv(f, "scantemp")]), add);
				}
			}
			dat = rt.modify(live(dat), "</div>", add);
			if (truthy(live(scanner_occupant))) {
				dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;scan=1'>Start Scan</a>", [live(f.src)]), add);
				$0 = live(f.src);
				if (truthy(rt.gv(f, "locked", rt.fv(f, "scanner", live(f.src))))) {
					$1 = "Unlock Scanner";
				} else {
					$1 = "Lock Scanner";
				}
				dat = rt.modify(live(dat), fmt("<br><a href='byond://?src=＃;lock=1'>＀</a>", [$0, $1]), add);
			} else {
				dat = rt.modify(live(dat), "<span class='linkOff'>Start Scan</span>", add);
			}
		}
		dat = rt.modify(live(dat), "<h3>Database Functions</h3>", add);
		if ((truthy(rt.getLen(f, rt.fv(f, "records", live(f.src)))) && rt.gt(rt.getLen(f, rt.fv(f, "records", live(f.src))), 0))) {
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;menu=2'>View Records (＀)</a><br>", [live(f.src), rt.getLen(f, rt.fv(f, "records", live(f.src)))]), add);
		} else {
			dat = rt.modify(live(dat), "<span class='linkOff'>View Records (0)</span><br>", add);
		}
		if (truthy(rt.fv(f, "diskette", live(f.src)))) {
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;disk=eject'>Eject Disk</a><br>", [live(f.src)]), add);
		}
	} else if ($0 === 2) {
		dat = rt.modify(live(dat), "<h3>Current records</h3>", add);
		dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;menu=1'><< Back</a><br><br>", [live(f.src)]), add);
		R = null;
		rt.forList(f, 0, rt.sv(f, "records"), T("/datum/data/record"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			dat = rt.modify(live(dat), fmt("<h4>＀</h4>Scan ID ＀ <a href='byond://?src=＃;view_rec=＀'>View Record</a>", [rt.index(rt.fv(f, "fields", live(R)), "name"), rt.index(rt.fv(f, "fields", live(R)), "id"), live(f.src), rt.index(rt.fv(f, "fields", live(R)), "id")]), add);
		}
		rt.endFor(f, 0);
	} else if ($0 === 3) {
		dat = rt.modify(live(dat), "<h3>Selected Record</h3>", add);
		dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;menu=2'><< Back</a><br>", [live(f.src)]), add);
		if (!truthy(rt.fv(f, "active_record", live(f.src)))) {
			dat = rt.modify(live(dat), "<font class='bad'>Record not found.</font>", add);
		} else {
			dat = rt.modify(live(dat), fmt("<h4>＀</h4>", [rt.index(rt.gv(f, "fields", rt.fv(f, "active_record", live(f.src))), "name")]), add);
			dat = rt.modify(live(dat), fmt("Scan ID ＀ <a href='byond://?src=＃;clone=＀'>Clone</a><br>", [rt.index(rt.gv(f, "fields", rt.fv(f, "active_record", live(f.src))), "id"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "active_record")), "id")]), add);
			if ((truthy((H = rt.locateIn(f, rt.index(rt.gv(f, "fields", rt.fv(f, "active_record", live(f.src))), "imp"), rt.world()))) && truthy((rt.istype(live(H), T("/obj/item/weapon/implant/health")) ? 1 : 0)))) {
				dat = rt.modify(live(dat), fmt("<b>Health Implant Data:</b><br />＀<br><br />", [(yield* g.callName(f, live(H), "sensehealth", []))]), add);
			} else {
				dat = rt.modify(live(dat), "<font class='bad'>Unable to locate Health Implant.</font><br /><br />", add);
			}
			dat = rt.modify(live(dat), fmt("<b>Unique Identifier:</b><br /><span class='highlight'>＀</span><br>", [rt.index(rt.gv(f, "fields", rt.fv(f, "active_record", live(f.src))), "UI")]), add);
			dat = rt.modify(live(dat), fmt("<b>Structural Enzymes:</b><br /><span class='highlight'>＀</span><br>", [rt.index(rt.gv(f, "fields", rt.fv(f, "active_record", live(f.src))), "SE")]), add);
			if ((truthy(rt.sv(f, "diskette")) && truthy(rt.fv(f, "fields", rt.sv(f, "diskette"))))) {
				dat = rt.modify(live(dat), "<div class='block'>", add);
				dat = rt.modify(live(dat), "<h4>Inserted Disk</h4>", add);
				dat = rt.modify(live(dat), "<b>Contents:</b> ", add);
				L = rt.list();
				if (truthy(rt.index(rt.fv(f, "fields", rt.sv(f, "diskette")), "UI"))) {
					L = rt.modify(live(L), "Unique Identifier", add);
				}
				if (((truthy(rt.index(rt.fv(f, "fields", rt.sv(f, "diskette")), "UE")) && truthy(rt.index(rt.fv(f, "fields", rt.sv(f, "diskette")), "name"))) && truthy(rt.index(rt.fv(f, "fields", rt.sv(f, "diskette")), "blood_type")))) {
					L = rt.modify(live(L), "Unique Enzymes", add);
				}
				if (truthy(rt.index(rt.fv(f, "fields", rt.sv(f, "diskette")), "SE"))) {
					L = rt.modify(live(L), "Structural Enzymes", add);
				}
				dat = rt.modify(live(dat), (yield* g.call(f, P("/proc/english_list"), null, [live(L), "Empty", " + ", " + "])), add);
				dat = rt.modify(live(dat), fmt("<br /><a href='byond://?src=＃;disk=load'>Load from Disk</a>", [live(f.src)]), add);
				dat = rt.modify(live(dat), fmt("<br /><a href='byond://?src=＃;disk=save'>Save to Disk</a>", [live(f.src)]), add);
				dat = rt.modify(live(dat), "</div>", add);
			}
			dat = rt.modify(live(dat), fmt("<font size=1><a href='byond://?src=＃;del_rec=1'>Delete Record</a></font>", [live(f.src)]), add);
		}
	} else if ($0 === 4) {
		if (!truthy(rt.fv(f, "active_record", live(f.src)))) {
			rt.setFv(f, "menu", live(f.src), 2);
		}
		dat = fmt("＀<br>", [rt.fv(f, "temp", live(f.src))]);
		dat = rt.modify(live(dat), "<h3>Confirm Record Deletion</h3>", add);
		dat = rt.modify(live(dat), fmt("<b><a href='byond://?src=＃;del_rec=1'>Scan card to confirm.</a></b><br>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<b><a href='byond://?src=＃;menu=3'>Cancel</a></b>", [live(f.src)]), add);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.args[0]), "cloning", "Cloning System Control"]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(f.args[0]), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/computer/cloning/proc/Topic  (code/game/machinery/computer/cloning.dm:280)  may sleep
rt.def("/obj/machinery/computer/cloning/proc/Topic", function* Topic(f: Frame) {
	let C: Value = null, key: Value = null, pod: Value = null;
	let $0: any, $e: any;
	f.vars = () => [C, key, pod, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "loading"))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "task"))) {
		$0 = rt.at(live(f.args[1]), "task");
		if ($0 === "autoprocess") {
			rt.setSv(f, "autoprocess", 1);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0]);
		} else if ($0 === "stopautoprocess") {
			rt.setSv(f, "autoprocess", 0);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0]);
		}
	} else {
		if (((truthy(rt.at(live(f.args[1]), "scan")) && rt.sv(f, "scanner") !== null) && truthy((yield* g.callName(f, rt.sv(f, "scanner"), "is_operational", []))))) {
			rt.setSv(f, "scantemp", "");
			rt.setSv(f, "loading", 1);
			yield* g.callName(f, live(f.src), "updateUsrDialog", []);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt.ogg"), 50, 0]);
			yield* g.srcCall(f, "say", "Initiating scan...");
			rt.spawnTail(f, 20, "/obj/machinery/computer/cloning/proc/Topic: spawn at game/machinery/computer/cloning.dm:303", C, key, pod);
		} else {
			if (((truthy(rt.at(live(f.args[1]), "lock")) && rt.sv(f, "scanner") !== null) && truthy((yield* g.callName(f, rt.sv(f, "scanner"), "is_operational", []))))) {
				if ((!truthy(rt.fv(f, "locked", rt.sv(f, "scanner"))) && truthy(rt.fv(f, "occupant", rt.sv(f, "scanner"))))) {
					rt.setFv(f, "locked", rt.sv(f, "scanner"), 1);
					yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0]);
				} else {
					rt.setFv(f, "locked", rt.sv(f, "scanner"), 0);
					yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0]);
				}
			} else {
				if (truthy(rt.at(live(f.args[1]), "view_rec"))) {
					yield* g.call(f, P("/proc/playsound"), null, [live(f.src), "terminal_type", 25, 0]);
					rt.setFv(f, "active_record", live(f.src), (yield* g.call(f, P("/proc/find_record"), null, ["id", rt.at(live(f.args[1]), "view_rec"), rt.sv(f, "records")])));
					if (truthy(rt.sv(f, "active_record"))) {
						if (!truthy(rt.index(rt.fv(f, "fields", rt.sv(f, "active_record")), "ckey"))) {
							(rt.modSrcVar(f, "records", rt.sv(f, "active_record"), subtract));
							rt.setSv(f, "active_record", null);
							rt.setFv(f, "temp", live(f.src), "<font class='bad'>Record Corrupt</font>");
						} else {
							rt.setFv(f, "menu", live(f.src), 3);
						}
					} else {
						rt.setFv(f, "temp", live(f.src), "Record missing.");
					}
				} else {
					if (truthy(rt.at(live(f.args[1]), "del_rec"))) {
						if ((!truthy(rt.fv(f, "active_record", live(f.src))) || rt.lt(rt.fv(f, "menu", live(f.src)), 3))) {
							return live(f.dot);
						}
						if (isEqual(rt.fv(f, "menu", live(f.src)), 3)) {
							rt.setFv(f, "temp", live(f.src), "Delete record?");
							rt.setFv(f, "menu", live(f.src), 4);
							yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt.ogg"), 50, 0]);
						} else {
							if (isEqual(rt.fv(f, "menu", live(f.src)), 4)) {
								if ((truthy((rt.istype((C = (yield* g.callName(f, live(f.usr), "get_active_held_item", []))), T("/obj/item/weapon/card/id")) ? 1 : 0)) || truthy((rt.istype(live(C), T("/obj/item/device/pda")) ? 1 : 0)))) {
									if (truthy((yield* g.callName(f, live(f.src), "check_access", [live(C)])))) {
										rt.setFv(f, "temp", live(f.src), fmt("＀ => Record deleted.", [rt.index(rt.gv(f, "fields", rt.fv(f, "active_record", live(f.src))), "name")]));
										yield* g.callName(f, rt.fv(f, "records", live(f.src)), "Remove", [rt.sv(f, "active_record")]);
										rt.setSv(f, "active_record", null);
										yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0]);
										rt.setFv(f, "menu", live(f.src), 2);
									} else {
										rt.setFv(f, "temp", live(f.src), "<font class='bad'>Access Denied.</font>");
										yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0]);
									}
								}
							}
						}
					} else {
						if (truthy(rt.at(live(f.args[1]), "disk"))) {
							$0 = rt.at(live(f.args[1]), "disk");
							if ($0 === "load") {
								if ((((!truthy(rt.sv(f, "diskette")) || !truthy((rt.istype(rt.fv(f, "fields", rt.sv(f, "diskette")), T("/list")) ? 1 : 0))) || !truthy(rt.index(rt.fv(f, "fields", rt.sv(f, "diskette")), "name"))) || !truthy(rt.fv(f, "fields", rt.sv(f, "diskette"))))) {
									rt.setFv(f, "temp", live(f.src), "<font class='bad'>Load error.</font>");
									yield* g.callName(f, live(f.src), "updateUsrDialog", []);
									yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0]);
									return live(f.dot);
								}
								if (!truthy(rt.fv(f, "active_record", live(f.src)))) {
									rt.setFv(f, "temp", live(f.src), "<font class='bad'>Record error.</font>");
									rt.setFv(f, "menu", live(f.src), 1);
									yield* g.callName(f, live(f.src), "updateUsrDialog", []);
									yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0]);
									return live(f.dot);
								}
								key = null;
								rt.forList(f, 0, rt.fv(f, "fields", rt.sv(f, "diskette")));
								while (($e = rt.next(f, 0)) !== undefined) {
									key = $e;
									rt.setAt(rt.gv(f, "fields", rt.fv(f, "active_record", live(f.src))), live(key), rt.index(rt.fv(f, "fields", rt.sv(f, "diskette")), live(key)));
								}
								rt.endFor(f, 0);
								rt.setFv(f, "temp", live(f.src), "Load successful.");
								yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0]);
							} else if ($0 === "eject") {
								if (truthy(rt.fv(f, "diskette", live(f.src)))) {
									rt.setFv(f, "loc", rt.fv(f, "diskette", live(f.src)), rt.fv(f, "loc", live(f.src)));
									rt.setFv(f, "diskette", live(f.src), null);
									yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_insert_disc.ogg"), 50, 0]);
								}
							} else if ($0 === "save") {
								if ((((!truthy(rt.sv(f, "diskette")) || truthy(rt.fv(f, "read_only", rt.sv(f, "diskette")))) || !truthy(rt.sv(f, "active_record"))) || !truthy(rt.fv(f, "fields", rt.sv(f, "active_record"))))) {
									rt.setFv(f, "temp", live(f.src), "<font class='bad'>Save error.</font>");
									yield* g.callName(f, live(f.src), "updateUsrDialog", []);
									yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0]);
									return live(f.dot);
								}
								rt.setFv(f, "fields", rt.sv(f, "diskette"), (yield* g.callName(f, rt.fv(f, "fields", rt.sv(f, "active_record")), "Copy", [])));
								rt.setFv(f, "name", rt.sv(f, "diskette"), fmt("data disk - '＀'", [rt.index(rt.gv(f, "fields", rt.fv(f, "diskette", live(f.src))), "name")]));
								rt.setFv(f, "temp", live(f.src), "Save successful.");
								yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0]);
							}
						} else {
							if (truthy(rt.at(live(f.args[1]), "refresh"))) {
								yield* g.callName(f, live(f.src), "updateUsrDialog", []);
								yield* g.call(f, P("/proc/playsound"), null, [live(f.src), "terminal_type", 25, 0]);
							} else {
								if (truthy(rt.at(live(f.args[1]), "clone"))) {
									if (truthy((C = (yield* g.call(f, P("/proc/find_record"), null, ["id", rt.at(live(f.args[1]), "clone"), rt.sv(f, "records")]))))) {
										pod = (yield* g.srcCall(f, "GetAvailablePod"));
										if (!truthy(rt.length(rt.sv(f, "pods")))) {
											rt.setSv(f, "temp", "<font class='bad'>No Clonepods detected.</font>");
											yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0]);
										} else {
											if (!truthy(live(pod))) {
												rt.setSv(f, "temp", "<font class='bad'>No Clonepods available.</font>");
												yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0]);
											} else {
												if (!truthy(rt.fv(f, "revival_cloning", rt.gl("config")))) {
													rt.setSv(f, "temp", "<font class='bad'>Unable to initiate cloning cycle.</font>");
													yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0]);
												} else {
													if (truthy(rt.fv(f, "occupant", live(pod)))) {
														rt.setSv(f, "temp", "<font class='bad'>Cloning cycle already in progress.</font>");
														yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0]);
													} else {
														if (truthy((yield* g.callName(f, live(pod), "growclone", [rt.index(rt.fv(f, "fields", live(C)), "ckey"), rt.index(rt.fv(f, "fields", live(C)), "name"), rt.index(rt.fv(f, "fields", live(C)), "UI"), rt.index(rt.fv(f, "fields", live(C)), "SE"), rt.index(rt.fv(f, "fields", live(C)), "mind"), rt.index(rt.fv(f, "fields", live(C)), "mrace"), rt.index(rt.fv(f, "fields", live(C)), "features"), rt.index(rt.fv(f, "fields", live(C)), "factions")])))) {
															rt.setSv(f, "temp", fmt("＀ => <font class='good'>Cloning cycle in progress...</font>", [rt.index(rt.fv(f, "fields", live(C)), "name")]));
															yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0]);
															yield* g.callName(f, rt.sv(f, "records"), "Remove", [live(C)]);
															if (isEqual(rt.sv(f, "active_record"), live(C))) {
																rt.setSv(f, "active_record", null);
															}
															rt.setSv(f, "menu", 1);
														} else {
															rt.setSv(f, "temp", fmt("＀ => <font class='bad'>Initialisation failure.</font>", [rt.index(rt.fv(f, "fields", live(C)), "name")]));
															yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0]);
														}
													}
												}
											}
										}
									} else {
										rt.setSv(f, "temp", "<font class='bad'>Data corruption.</font>");
										yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0]);
									}
								} else {
									if (truthy(rt.at(live(f.args[1]), "menu"))) {
										rt.setFv(f, "menu", live(f.src), (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "menu")])));
										yield* g.call(f, P("/proc/playsound"), null, [live(f.src), "terminal_type", 25, 0]);
									}
								}
							}
						}
					}
				}
			}
		}
	}
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.usr)]);
	yield* g.callName(f, live(f.src), "updateUsrDialog", []);
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// a spawn(20) body of /obj/machinery/computer/cloning/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/cloning/proc/Topic: spawn at game/machinery/computer/cloning.dm:303", function* (f: Frame, C: Value, key: Value, pod: Value) {
	f.vars = () => [C, key, pod];
	yield* g.callName(f, live(f.src), "scan_occupant", [rt.fv(f, "occupant", rt.sv(f, "scanner"))]);
	rt.setSv(f, "loading", 0);
	yield* g.callName(f, live(f.src), "updateUsrDialog", []);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0]);
	return null;
});

// /obj/machinery/computer/cloning/proc/scan_occupant  (code/game/machinery/computer/cloning.dm:437)  may sleep
rt.def("/obj/machinery/computer/cloning/proc/scan_occupant", function* scan_occupant(f: Frame, occupant: Value) {
	let mob_occupant: Value = null, dna: Value = null, C: Value = null, B: Value = null, R: Value = null, rando_race: Value = null, imp: Value = null, HI: Value = null;
	let $e: any;
	f.vars = () => [occupant, mob_occupant, dna, C, B, R, rando_race, imp, HI, $e];
	mob_occupant = (yield* g.call(f, P("/proc/get_mob_or_brainmob"), null, [live(occupant)]));
	dna = null;
	if (truthy((rt.istype(live(mob_occupant), T("/mob/living/carbon")) ? 1 : 0))) {
		dna = (yield* g.callName(f, (C = live(mob_occupant)), "has_dna", []));
	}
	if (truthy((rt.istype(live(mob_occupant), T("/mob/living/brain")) ? 1 : 0))) {
		dna = rt.gv(f, "stored_dna", (B = live(mob_occupant)));
	}
	if (!truthy((rt.istype(live(dna), T("/datum/dna")) ? 1 : 0))) {
		rt.setSv(f, "scantemp", "<font class='bad'>Unable to locate valid genetic data.</font>");
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0]);
		return live(f.dot);
	}
	if ((truthy(rt.fv(f, "suiciding", live(mob_occupant))) || truthy(rt.fv(f, "hellbound", live(mob_occupant))))) {
		rt.setSv(f, "scantemp", "<font class='bad'>Subject's brain is not responding to scanning stimuli.</font>");
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0]);
		return live(f.dot);
	}
	if ((truthy(rt.bitAnd(rt.fv(f, "disabilities", live(mob_occupant)), 128)) && rt.lt(rt.gv(f, "scan_level", rt.fv(f, "scanner", live(f.src))), 2))) {
		rt.setSv(f, "scantemp", "<font class='bad'>Subject no longer contains the fundamental materials required to create a living clone.</font>");
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_alert.ogg"), 50, 0]);
		return live(f.dot);
	}
	if ((!truthy(rt.fv(f, "ckey", live(mob_occupant))) || !truthy(rt.fv(f, "client", live(mob_occupant))))) {
		rt.setSv(f, "scantemp", "<font class='bad'>Mental interface failure.</font>");
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0]);
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/find_record"), null, ["ckey", rt.fv(f, "ckey", live(mob_occupant)), rt.sv(f, "records")])))) {
		rt.setSv(f, "scantemp", "<font class='average'>Subject already in database.</font>");
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0]);
		return live(f.dot);
	}
	R = (yield* g.new_(f, T("/datum/data/record"), []));
	if (truthy(rt.fv(f, "species", live(dna)))) {
		rt.setAt(rt.fv(f, "fields", live(R)), "mrace", rt.fv(f, "species", live(dna)));
	} else {
		rando_race = rt.op(f, "PickUnweighted", [1], [rt.fv(f, "roundstart_races", rt.gl("config"))]);
		rt.setAt(rt.fv(f, "fields", live(R)), "mrace", rt.fv(f, "type", live(rando_race)));
	}
	rt.setAt(rt.fv(f, "fields", live(R)), "ckey", rt.fv(f, "ckey", live(mob_occupant)));
	rt.setAt(rt.fv(f, "fields", live(R)), "name", rt.fv(f, "real_name", live(mob_occupant)));
	rt.setAt(rt.fv(f, "fields", live(R)), "id", (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/md5"), null, [rt.fv(f, "real_name", live(mob_occupant))])), 2, 6])));
	rt.setAt(rt.fv(f, "fields", live(R)), "UE", rt.fv(f, "unique_enzymes", live(dna)));
	rt.setAt(rt.fv(f, "fields", live(R)), "UI", rt.fv(f, "uni_identity", live(dna)));
	rt.setAt(rt.fv(f, "fields", live(R)), "SE", rt.fv(f, "struc_enzymes", live(dna)));
	rt.setAt(rt.fv(f, "fields", live(R)), "blood_type", rt.fv(f, "blood_type", live(dna)));
	rt.setAt(rt.fv(f, "fields", live(R)), "features", rt.fv(f, "features", live(dna)));
	rt.setAt(rt.fv(f, "fields", live(R)), "factions", rt.fv(f, "faction", live(mob_occupant)));
	if (rt.fv(f, "mind", live(mob_occupant)) !== null) {
		rt.setAt(rt.fv(f, "fields", live(R)), "mind", fmt("＃", [rt.fv(f, "mind", live(mob_occupant))]));
	}
	imp = null;
	HI = null;
	rt.forList(f, 0, rt.fv(f, "implants", live(mob_occupant)), T("/obj/item/weapon/implant/health"));
	if (($e = rt.next(f, 0)) !== undefined) {
		HI = $e;
		imp = live(HI);
	}
	rt.endFor(f, 0);
	if (!truthy(live(imp))) {
		yield* g.callName(f, (imp = (yield* g.new_(f, T("/obj/item/weapon/implant/health"), [live(mob_occupant)]))), "implant", [live(mob_occupant)]);
	}
	rt.setAt(rt.fv(f, "fields", live(R)), "imp", fmt("＃", [live(imp)]));
	rt.modField(f, live(f.src), "records", live(R), add);
	rt.setSv(f, "scantemp", "Subject successfully scanned.");
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0]);
	return f.dot;
}, true);
