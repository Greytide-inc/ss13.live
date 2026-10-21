// From code/game/machinery/computer/dna_console.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10380, "/obj/machinery/computer/scan_consolenew", "/obj/machinery/computer", {
	radduration: 2,
	radstrength: 1,
	buffer: null,
	injectorready: 0,
	current_screen: "mainmenu",
	connected: null,
	diskette: null,
	delayed_action: null,
	icon_screen: "dna",
	icon_keyboard: "med_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/scan_consolenew"),
	anchored: 1,
	light_color: "#6496FA",
	name: "１DNA scanner access console",
	desc: "Scan DNA.",
	density: 1,
	use_power: 1,
	idle_power_usage: 10,
	active_power_usage: 400,
});

// /obj/machinery/computer/scan_consolenew/proc/<init>  (code/game/machinery/computer/dna_console.dm:29)
rt.def("/obj/machinery/computer/scan_consolenew/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "buffer", rt.op(f, "CreateMultidimensionalList", [1], [3]));
	return f.dot;
});

// /obj/machinery/computer/scan_consolenew/proc/attackby  (code/game/machinery/computer/dna_console.dm:44)  may sleep
rt.def("/obj/machinery/computer/scan_consolenew/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/disk/data")) ? 1 : 0))) {
		if (!truthy(rt.fv(f, "diskette", live(f.src)))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return live(f.dot);
			}
			rt.setFv(f, "loc", live(f.args[0]), live(f.src));
			rt.setFv(f, "diskette", live(f.src), live(f.args[0]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀.</span>", [live(f.args[0])])]);
			yield* g.callName(f, live(f.src), "updateUsrDialog", []);
			return live(f.dot);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/computer/scan_consolenew/proc/New  (code/game/machinery/computer/dna_console.dm:57)  may sleep
rt.def("/obj/machinery/computer/scan_consolenew/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.spawnTail(f, 5, "/obj/machinery/computer/scan_consolenew/proc/New: spawn at game/machinery/computer/dna_console.dm:59");
	return live(f.dot);
}, true);

// a spawn(5) body of /obj/machinery/computer/scan_consolenew/proc/New, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/scan_consolenew/proc/New: spawn at game/machinery/computer/dna_console.dm:59", function* (f: Frame) {
	let $e: any;
	f.vars = () => [$e];
	rt.forList(f, 0, rt.list(1, 4, 2, 8));
	while (($e = rt.next(f, 0)) !== undefined) {
		rt.setSv(f, "dir", $e);
		rt.setSv(f, "connected", rt.locateIn(f, T("/obj/machinery/dna_scannernew"), rt.getStep(f, live(f.src), rt.sv(f, "dir"))));
		if (rt.sv(f, "connected") !== null) {
			break;
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "injectorready", add(rt.worldTime(f), 100));
	return live(f.dot);
	return null;
});

// /obj/machinery/computer/scan_consolenew/proc/attack_hand  (code/game/machinery/computer/dna_console.dm:69)  may sleep
rt.def("/obj/machinery/computer/scan_consolenew/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "ShowInterface", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/computer/scan_consolenew/proc/ShowInterface  (code/game/machinery/computer/dna_console.dm:74)  may sleep
rt.def("/obj/machinery/computer/scan_consolenew/proc/ShowInterface", function* ShowInterface(f: Frame, user: Value, last_change: Value) {
	let popup: Value = null, viable_occupant: Value = null, occupant_status: Value = null, scanner_status: Value = null, temp_html: Value = null, rejuvenators: Value = null, status: Value = null, stddev: Value = null, chance_to_hit: Value = null, buttons: Value = null, max_line_len: Value = null, len: Value = null, i: Value = null, i_9: Value = null, buffer_slot: Value = null, ui: Value = null, se: Value = null, ue: Value = null, name: Value = null, label: Value = null, blood_type: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [user, last_change, popup, viable_occupant, occupant_status, scanner_status, temp_html, rejuvenators, status, stddev, chance_to_hit, buttons, max_line_len, len, i, i_9, buffer_slot, ui, se, ue, name, label, blood_type, $0, $1, $2];
	if (!truthy(live(user))) {
		return live(f.dot);
	}
	popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "scannernew", "DNA Modifier Console", 800, 630]));
	if (!(rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 1) || truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)))) {
		yield* g.callName(f, live(popup), "close", []);
		return live(f.dot);
	}
	yield* g.callName(f, live(popup), "add_stylesheet", ["scannernew", rt.rsc("html/browser/scannernew.css")]);
	viable_occupant = null;
	occupant_status = "<div class='line'><div class='statusLabel'>Subject Status:</div><div class='statusValue'>";
	scanner_status = null;
	temp_html = null;
	if ((truthy(rt.sv(f, "connected")) && truthy((yield* g.callName(f, rt.sv(f, "connected"), "is_operational", []))))) {
		if (truthy(rt.fv(f, "occupant", rt.sv(f, "connected")))) {
			if (((truthy((yield* g.callName(f, (viable_occupant = rt.fv(f, "occupant", rt.sv(f, "connected"))), "has_dna", []))) && !truthy((rt.isIn(f, 9, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(viable_occupant))))) ? 1 : 0))) && (!truthy(rt.bitAnd(rt.fv(f, "disabilities", live(viable_occupant)), 128)) || isEqual(rt.fv(f, "scan_level", rt.sv(f, "connected")), 3)))) {
				occupant_status = rt.modify(live(occupant_status), fmt("＀ => ", [rt.fv(f, "name", live(viable_occupant))]), add);
				$0 = rt.fv(f, "stat", live(viable_occupant));
				if ($0 === 0) {
					occupant_status = rt.modify(live(occupant_status), "<span class='good'>Conscious</span>", add);
				} else if ($0 === 1) {
					occupant_status = rt.modify(live(occupant_status), "<span class='average'>Unconscious</span>", add);
				} else {
					occupant_status = rt.modify(live(occupant_status), "<span class='bad'>DEAD</span>", add);
				}
				occupant_status = rt.modify(live(occupant_status), "</div></div>", add);
				occupant_status = rt.modify(live(occupant_status), fmt("<div class='line'><div class='statusLabel'>Health:</div><div class='progressBar'><div style='width: ＀%;' class='progressFill good'></div></div><div class='statusValue'>＀ %</div></div>", [rt.fv(f, "health", live(viable_occupant)), rt.fv(f, "health", live(viable_occupant))]), add);
				occupant_status = rt.modify(live(occupant_status), fmt("<div class='line'><div class='statusLabel'>Radiation Level:</div><div class='progressBar'><div style='width: ＀%;' class='progressFill bad'></div></div><div class='statusValue'>＀ %</div></div>", [rt.fv(f, "radiation", live(viable_occupant)), rt.fv(f, "radiation", live(viable_occupant))]), add);
				occupant_status = rt.modify(live(occupant_status), fmt("<div class='line'><div class='statusLabel'>Rejuvenators:</div><div class='progressBar'><div style='width: ＀%;' class='progressFill highlight'></div></div><div class='statusValue'>＀ units</div></div>", [(yield* g.call(f, P("/proc/round"), null, [multiply(divide((rejuvenators = (yield* g.callName(f, rt.fv(f, "reagents", live(viable_occupant)), "get_reagent_amount", ["potass_iodide"]))), 90), 100)])), live(rejuvenators)]), add);
				occupant_status = rt.modify(live(occupant_status), fmt("<div class='line'><div class='statusLabel'>Unique Enzymes :</div><div class='statusValue'><span class='highlight'>＀</span></div></div>", [rt.gv(f, "unique_enzymes", rt.fv(f, "dna", live(viable_occupant)))]), add);
				if (truthy(live(last_change))) {
					$0 = live(last_change);
				} else {
					$0 = "----";
				}
				occupant_status = rt.modify(live(occupant_status), fmt("<div class='line'><div class='statusLabel'>Last Operation:</div><div class='statusValue'>＀</div></div>", [$0]), add);
			} else {
				viable_occupant = null;
				occupant_status = rt.modify(live(occupant_status), "<span class='bad'>Invalid DNA structure</span></div></div>", add);
			}
		} else {
			occupant_status = rt.modify(live(occupant_status), "<span class='bad'>No subject detected</span></div></div>", add);
		}
		if (truthy(rt.fv(f, "state_open", rt.sv(f, "connected")))) {
			scanner_status = "Open";
		} else {
			scanner_status = "Closed";
			if (truthy(rt.fv(f, "locked", rt.sv(f, "connected")))) {
				scanner_status = rt.modify(live(scanner_status), " <span class='bad'>(Locked)</span>", add);
			} else {
				scanner_status = rt.modify(live(scanner_status), " <span class='good'>(Unlocked)</span>", add);
			}
		}
	} else {
		occupant_status = rt.modify(live(occupant_status), "<span class='bad'>----</span></div></div>", add);
		scanner_status = rt.modify(live(scanner_status), "<span class='bad'>Error: No scanner detected</span>", add);
	}
	status = "<div class='statusDisplay'>";
	status = rt.modify(live(status), fmt("<div class='line'><div class='statusLabel'>Scanner:</div><div class='statusValue'>＀</div></div>", [live(scanner_status)]), add);
	status = rt.modify(live(status), fmt("＀", [live(occupant_status)]), add);
	status = rt.modify(live(status), "<div class='line'><h3>Radiation Emitter Status</h3></div>", add);
	stddev = multiply(rt.sv(f, "radstrength"), 1);
	status = rt.modify(live(status), fmt("<div class='line'><div class='statusLabel'>Output Level:</div><div class='statusValue'>＀</div></div>", [rt.sv(f, "radstrength")]), add);
	status = rt.modify(live(status), fmt("<div class='line'><div class='statusLabel'>&nbsp;&nbsp;> Mutation:</div><div class='statusValue'>(-＀ to +＀ = 68 %) (-＀ to +＀ = 95 %)</div></div>", [live(stddev), live(stddev), multiply(2, live(stddev)), multiply(2, live(stddev))]), add);
	if (truthy(rt.sv(f, "connected"))) {
		stddev = divide(3, add(rt.sv(f, "radduration"), rt.power(rt.fv(f, "precision_coeff", rt.sv(f, "connected")), 2)));
	} else {
		stddev = divide(3, rt.sv(f, "radduration"));
	}
	chance_to_hit = null;
	$0 = live(stddev);
	if (rt.inRange($0, 0, 0.25)) {
		chance_to_hit = ">95 %";
	} else if (rt.inRange($0, 0.25, 0.5)) {
		chance_to_hit = "68-95 %";
	} else if (rt.inRange($0, 0.5, 0.75)) {
		chance_to_hit = "55-68 %";
	} else {
		chance_to_hit = "<38 %";
	}
	status = rt.modify(live(status), fmt("<div class='line'><div class='statusLabel'>Pulse Duration:</div><div class='statusValue'>＀</div></div>", [rt.sv(f, "radduration")]), add);
	status = rt.modify(live(status), fmt("<div class='line'><div class='statusLabel'>&nbsp;&nbsp;> Accuracy:</div><div class='statusValue'>＀</div></div>", [live(chance_to_hit)]), add);
	status = rt.modify(live(status), "<br></div>", add);
	buttons = fmt("<a href='?src=＃;'>Scan</a> ", [live(f.src)]);
	if (truthy(rt.sv(f, "connected"))) {
		$0 = live(f.src);
		if (truthy(rt.fv(f, "state_open", rt.sv(f, "connected")))) {
			$1 = "Close";
		} else {
			$1 = "Open";
		}
		buttons = rt.modify(live(buttons), fmt(" <a href='?src=＃;task=toggleopen;'>＀ Scanner</a> ", [$0, $1]), add);
		if (truthy(rt.fv(f, "state_open", rt.sv(f, "connected")))) {
			if (truthy(rt.fv(f, "locked", rt.sv(f, "connected")))) {
				$0 = "Unlock";
			} else {
				$0 = "Lock";
			}
			buttons = rt.modify(live(buttons), fmt("<span class='linkOff'>＀ Scanner</span> ", [$0]), add);
		} else {
			$0 = live(f.src);
			if (truthy(rt.fv(f, "locked", rt.sv(f, "connected")))) {
				$1 = "Unlock";
			} else {
				$1 = "Lock";
			}
			buttons = rt.modify(live(buttons), fmt("<a href='?src=＃;task=togglelock;'>＀ Scanner</a> ", [$0, $1]), add);
		}
	} else {
		buttons = rt.modify(live(buttons), "<span class='linkOff'>Open Scanner</span> <span class='linkOff'>Lock Scanner</span> ", add);
	}
	if (truthy(live(viable_occupant))) {
		buttons = rt.modify(live(buttons), fmt("<a href='?src=＃;task=rejuv'>Inject Rejuvenators</a> ", [live(f.src)]), add);
	} else {
		buttons = rt.modify(live(buttons), "<span class='linkOff'>Inject Rejuvenators</span> ", add);
	}
	if (truthy(rt.sv(f, "diskette"))) {
		buttons = rt.modify(live(buttons), fmt("<a href='?src=＃;task=ejectdisk'>Eject Disk</a> ", [live(f.src)]), add);
	} else {
		buttons = rt.modify(live(buttons), "<span class='linkOff'>Eject Disk</span> ", add);
	}
	if (isEqual(rt.sv(f, "current_screen"), "buffer")) {
		buttons = rt.modify(live(buttons), fmt("<a href='?src=＃;task=screen;text=mainmenu;'>Radiation Emitter Menu</a> ", [live(f.src)]), add);
	} else {
		buttons = rt.modify(live(buttons), fmt("<a href='?src=＃;task=screen;text=buffer;'>Buffer Menu</a> ", [live(f.src)]), add);
	}
	$0 = rt.sv(f, "current_screen");
	if ($0 === "working") {
		temp_html = rt.modify(live(temp_html), live(status), add);
		temp_html = rt.modify(live(temp_html), "<h1>System Busy</h1>", add);
		temp_html = rt.modify(live(temp_html), fmt("Working ... Please wait (＀ Seconds)", [rt.sv(f, "radduration")]), add);
	} else if ($0 === "buffer") {
		temp_html = rt.modify(live(temp_html), live(status), add);
		temp_html = rt.modify(live(temp_html), live(buttons), add);
		temp_html = rt.modify(live(temp_html), "<h1>Buffer Menu</h1>", add);
		if (truthy((rt.istype(rt.sv(f, "buffer"), T("/list")) ? 1 : 0))) {
			i_9 = null;
			i_9 = 1;
			while (rt.le(live(i_9), rt.len(f, rt.sv(f, "buffer")))) {
				temp_html = rt.modify(live(temp_html), fmt("<br>Slot ＀: ", [live(i_9)]), add);
				if ((((!truthy((buffer_slot = rt.index(rt.sv(f, "buffer"), live(i_9)))) || !truthy(rt.len(f, live(buffer_slot)))) || !truthy(rt.at(live(buffer_slot), "name"))) || !((truthy(rt.at(live(buffer_slot), "UI")) && truthy(rt.at(live(buffer_slot), "UE"))) || truthy(rt.at(live(buffer_slot), "SE"))))) {
					temp_html = rt.modify(live(temp_html), "<br>\tNo Data", add);
					if (truthy(live(viable_occupant))) {
						temp_html = rt.modify(live(temp_html), fmt("<br><a href='?src=＃;task=setbuffer;num=＀;'>Save to Buffer</a> ", [live(f.src), live(i_9)]), add);
					} else {
						temp_html = rt.modify(live(temp_html), "<br><span class='linkOff'>Save to Buffer</span> ", add);
					}
					temp_html = rt.modify(live(temp_html), "<span class='linkOff'>Clear Buffer</span> ", add);
					if (truthy(rt.sv(f, "diskette"))) {
						temp_html = rt.modify(live(temp_html), fmt("<a href='?src=＃;task=loaddisk;num=＀;'>Load from Disk</a> ", [live(f.src), live(i_9)]), add);
					} else {
						temp_html = rt.modify(live(temp_html), "<span class='linkOff'>Load from Disk</span> ", add);
					}
					temp_html = rt.modify(live(temp_html), "<span class='linkOff'>Save to Disk</span> ", add);
				} else {
					ui = rt.at(live(buffer_slot), "UI");
					se = rt.at(live(buffer_slot), "SE");
					ue = rt.at(live(buffer_slot), "UE");
					name = rt.at(live(buffer_slot), "name");
					label = rt.at(live(buffer_slot), "label");
					blood_type = rt.at(live(buffer_slot), "blood_type");
					$0 = live(f.src);
					$1 = live(i_9);
					if (truthy(live(label))) {
						$1 = $1;
						$2 = live(label);
					} else {
						$2 = live(name);
					}
					temp_html = rt.modify(live(temp_html), fmt("<br>\t<a href='?src=＃;task=setbufferlabel;num=＀;'>Label</a>: ＀", [$0, $1, $2]), add);
					temp_html = rt.modify(live(temp_html), fmt("<br>\tSubject: ＀", [live(name)]), add);
					if (((truthy(live(ue)) && truthy(live(name))) && truthy(live(blood_type)))) {
						temp_html = rt.modify(live(temp_html), fmt("<br>\tBlood Type: ＀", [live(blood_type)]), add);
						temp_html = rt.modify(live(temp_html), fmt("<br>\tUE: ＀ ", [live(ue)]), add);
						if (truthy(live(viable_occupant))) {
							temp_html = rt.modify(live(temp_html), fmt("<a href='?src=＃;task=transferbuffer;num=＀;text=ue'>Occupant</a> ", [live(f.src), live(i_9)]), add);
						} else {
							temp_html = rt.modify(live(temp_html), "<span class='linkOff'>Occupant</span>", add);
						}
						temp_html = rt.modify(live(temp_html), fmt("<a href='?src=＃;task=setdelayed;num=＀;delayaction=＀'>Occupant:Delayed</a> ", [live(f.src), live(i_9), 3]), add);
						if (rt.lt(rt.sv(f, "injectorready"), rt.worldTime(f))) {
							temp_html = rt.modify(live(temp_html), fmt("<a href='?src=＃;task=injector;num=＀;text=ue'>Injector</a>", [live(f.src), live(i_9)]), add);
						} else {
							temp_html = rt.modify(live(temp_html), "<span class='linkOff'>Injector</span>", add);
						}
					} else {
						temp_html = rt.modify(live(temp_html), "<br>\tBlood Type: No Data", add);
						temp_html = rt.modify(live(temp_html), "<br>\tUE: No Data", add);
					}
					if (truthy(live(ui))) {
						temp_html = rt.modify(live(temp_html), fmt("<br>\tUI: ＀ ", [live(ui)]), add);
						if (truthy(live(viable_occupant))) {
							temp_html = rt.modify(live(temp_html), fmt("<a href='?src=＃;task=transferbuffer;num=＀;text=ui'>Occupant</a> ", [live(f.src), live(i_9)]), add);
						} else {
							temp_html = rt.modify(live(temp_html), "<span class='linkOff'>Occupant</span>", add);
						}
						temp_html = rt.modify(live(temp_html), fmt("<a href='?src=＃;task=setdelayed;num=＀;delayaction=＀'>Occupant:Delayed</a> ", [live(f.src), live(i_9), 2]), add);
						if (rt.lt(rt.sv(f, "injectorready"), rt.worldTime(f))) {
							temp_html = rt.modify(live(temp_html), fmt("<a href='?src=＃;task=injector;num=＀;text=ui'>Injector</a>", [live(f.src), live(i_9)]), add);
						} else {
							temp_html = rt.modify(live(temp_html), "<span class='linkOff'>Injector</span>", add);
						}
					} else {
						temp_html = rt.modify(live(temp_html), "<br>\tUI: No Data", add);
					}
					if ((((truthy(live(ue)) && truthy(live(name))) && truthy(live(blood_type))) && truthy(live(ui)))) {
						temp_html = rt.modify(live(temp_html), fmt("<br>\tUI+UE: ＀/＀ ", [live(ui), live(ue)]), add);
						if (truthy(live(viable_occupant))) {
							temp_html = rt.modify(live(temp_html), fmt("<a href='?src=＃;task=transferbuffer;num=＀;text=mixed'>Occupant</a> ", [live(f.src), live(i_9)]), add);
						} else {
							temp_html = rt.modify(live(temp_html), "<span class='linkOff'>Occupant</span>", add);
						}
						temp_html = rt.modify(live(temp_html), fmt("<a href='?src=＃;task=setdelayed;num=＀;delayaction=＀'>Occupant:Delayed</a> ", [live(f.src), live(i_9), 4]), add);
						if (rt.lt(rt.sv(f, "injectorready"), rt.worldTime(f))) {
							temp_html = rt.modify(live(temp_html), fmt("<a href='?src=＃;task=injector;num=＀;text=mixed'>UI+UE Injector</a>", [live(f.src), live(i_9)]), add);
						} else {
							temp_html = rt.modify(live(temp_html), "<span class='linkOff'>UI+UE Injector</span>", add);
						}
					}
					if (truthy(live(se))) {
						temp_html = rt.modify(live(temp_html), fmt("<br>\tSE: ＀ ", [live(se)]), add);
						if (truthy(live(viable_occupant))) {
							temp_html = rt.modify(live(temp_html), fmt("<a href='?src=＃;task=transferbuffer;num=＀;text=se'>Occupant</a> ", [live(f.src), live(i_9)]), add);
						} else {
							temp_html = rt.modify(live(temp_html), "<span class='linkOff'>Occupant</span> ", add);
						}
						temp_html = rt.modify(live(temp_html), fmt("<a href='?src=＃;task=setdelayed;num=＀;delayaction=＀'>Occupant:Delayed</a> ", [live(f.src), live(i_9), 1]), add);
						if (rt.lt(rt.sv(f, "injectorready"), rt.worldTime(f))) {
							temp_html = rt.modify(live(temp_html), fmt("<a href='?src=＃;task=injector;num=＀;text=se'>Injector</a>", [live(f.src), live(i_9)]), add);
						} else {
							temp_html = rt.modify(live(temp_html), "<span class='linkOff'>Injector</span>", add);
						}
					} else {
						temp_html = rt.modify(live(temp_html), "<br>\tSE: No Data", add);
					}
					if (truthy(live(viable_occupant))) {
						temp_html = rt.modify(live(temp_html), fmt("<br><a href='?src=＃;task=setbuffer;num=＀;'>Save to Buffer</a> ", [live(f.src), live(i_9)]), add);
					} else {
						temp_html = rt.modify(live(temp_html), "<br><span class='linkOff'>Save to Buffer</span> ", add);
					}
					temp_html = rt.modify(live(temp_html), fmt("<a href='?src=＃;task=clearbuffer;num=＀;'>Clear Buffer</a> ", [live(f.src), live(i_9)]), add);
					if (truthy(rt.sv(f, "diskette"))) {
						temp_html = rt.modify(live(temp_html), fmt("<a href='?src=＃;task=loaddisk;num=＀;'>Load from Disk</a> ", [live(f.src), live(i_9)]), add);
					} else {
						temp_html = rt.modify(live(temp_html), "<span class='linkOff'>Load from Disk</span> ", add);
					}
					if ((truthy(rt.sv(f, "diskette")) && !truthy(rt.fv(f, "read_only", rt.sv(f, "diskette"))))) {
						temp_html = rt.modify(live(temp_html), fmt("<a href='?src=＃;task=savedisk;num=＀;'>Save to Disk</a> ", [live(f.src), live(i_9)]), add);
					} else {
						temp_html = rt.modify(live(temp_html), "<span class='linkOff'>Save to Disk</span> ", add);
					}
				}
				i_9 = rt.inc(live(i_9), 1);
			}
		}
	} else {
		temp_html = rt.modify(live(temp_html), live(status), add);
		temp_html = rt.modify(live(temp_html), live(buttons), add);
		temp_html = rt.modify(live(temp_html), "<h1>Radiation Emitter Menu</h1>", add);
		temp_html = rt.modify(live(temp_html), fmt("<a href='?src=＃;task=setstrength;num=＀;'>--</a> <a href='?src=＃;task=setstrength;'>Output Level</a> <a href='?src=＃;task=setstrength;num=＀;'>++</a>", [live(f.src), subtract(rt.sv(f, "radstrength"), 1), live(f.src), live(f.src), add(rt.sv(f, "radstrength"), 1)]), add);
		temp_html = rt.modify(live(temp_html), fmt("<br><a href='?src=＃;task=setduration;num=＀;'>--</a> <a href='?src=＃;task=setduration;'>Pulse Duration</a> <a href='?src=＃;task=setduration;num=＀;'>++</a>", [live(f.src), subtract(rt.sv(f, "radduration"), 1), live(f.src), live(f.src), add(rt.sv(f, "radduration"), 1)]), add);
		temp_html = rt.modify(live(temp_html), "<h3>Irradiate Subject</h3>", add);
		temp_html = rt.modify(live(temp_html), "<div class='line'><div class='statusLabel'>Unique Identifier:</div><div class='statusValue'><div class='clearBoth'>", add);
		max_line_len = 21;
		if (truthy(live(viable_occupant))) {
			temp_html = rt.modify(live(temp_html), "<div class='dnaBlockNumber'>1</div>", add);
			len = rt.length(rt.gv(f, "uni_identity", rt.fv(f, "dna", live(viable_occupant))));
			i = null;
			i = 1;
			while (rt.le(live(i), live(len))) {
				temp_html = rt.modify(live(temp_html), fmt("<a class='dnaBlock' href='?src=＃;task=pulseui;num=＀;'>＀</a>", [live(f.src), live(i), (yield* g.call(f, P("/proc/copytext"), null, [rt.gv(f, "uni_identity", rt.fv(f, "dna", live(viable_occupant))), live(i), add(live(i), 1)]))]), add);
				if (isEqual(rt.modulus(live(i), live(max_line_len)), 0)) {
					temp_html = rt.modify(live(temp_html), "</div><div class='clearBoth'>", add);
				}
				if ((isEqual(rt.modulus(live(i), 3), 0) && rt.lt(live(i), live(len)))) {
					temp_html = rt.modify(live(temp_html), fmt("<div class='dnaBlockNumber'>＀</div>", [add(divide(live(i), 3), 1)]), add);
				}
				i = rt.inc(live(i), 1);
			}
		} else {
			temp_html = rt.modify(live(temp_html), "----", add);
		}
		temp_html = rt.modify(live(temp_html), "</div></div></div><br>", add);
		temp_html = rt.modify(live(temp_html), "<br><div class='line'><div class='statusLabel'>Structural Enzymes:</div><div class='statusValue'><div class='clearBoth'>", add);
		if (truthy(live(viable_occupant))) {
			temp_html = rt.modify(live(temp_html), "<div class='dnaBlockNumber'>1</div>", add);
			len = rt.length(rt.gv(f, "struc_enzymes", rt.fv(f, "dna", live(viable_occupant))));
			i = null;
			i = 1;
			while (rt.le(live(i), live(len))) {
				temp_html = rt.modify(live(temp_html), fmt("<a class='dnaBlock' href='?src=＃;task=pulsese;num=＀;'>＀</a>", [live(f.src), live(i), (yield* g.call(f, P("/proc/copytext"), null, [rt.gv(f, "struc_enzymes", rt.fv(f, "dna", live(viable_occupant))), live(i), add(live(i), 1)]))]), add);
				if (isEqual(rt.modulus(live(i), live(max_line_len)), 0)) {
					temp_html = rt.modify(live(temp_html), "</div><div class='clearBoth'>", add);
				}
				if ((isEqual(rt.modulus(live(i), 3), 0) && rt.lt(live(i), live(len)))) {
					temp_html = rt.modify(live(temp_html), fmt("<div class='dnaBlockNumber'>＀</div>", [add(divide(live(i), 3), 1)]), add);
				}
				i = rt.inc(live(i), 1);
			}
		} else {
			temp_html = rt.modify(live(temp_html), "----", add);
		}
		temp_html = rt.modify(live(temp_html), "</div></div></div>", add);
	}
	yield* g.callName(f, live(popup), "set_content", [live(temp_html)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/computer/scan_consolenew/proc/Topic  (code/game/machinery/computer/dna_console.dm:316)  may sleep
rt.def("/obj/machinery/computer/scan_consolenew/proc/Topic", function* Topic(f: Frame) {
	let viable_occupant: Value = null, num: Value = null, last_change: Value = null, potassiodide_amount: Value = null, can_add: Value = null, text: Value = null, buffer_slot: Value = null, buffer_slot_3: Value = null, I: Value = null, powers: Value = null, HM: Value = null, time_coeff: Value = null, HM_7: Value = null, locked_state: Value = null, len: Value = null, block: Value = null, subblock: Value = null, hex: Value = null;
	let $0: any, $e: any;
	f.vars = () => [viable_occupant, num, last_change, potassiodide_amount, can_add, text, buffer_slot, buffer_slot_3, I, powers, HM, time_coeff, HM_7, locked_state, len, block, subblock, hex, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.usr))])))) {
		return live(f.dot);
	}
	if (!((truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1)) || truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "current_screen"), "working")) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	viable_occupant = (yield* g.srcCall(f, "get_viable_occupant"));
	num = (yield* g.call(f, P("/proc/round"), null, [(yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "num")]))]));
	last_change = null;
	$0 = rt.at(live(f.args[1]), "task");
	if ($0 === "togglelock") {
		if (truthy(rt.sv(f, "connected"))) {
			rt.setFv(f, "locked", rt.sv(f, "connected"), (!truthy(rt.fv(f, "locked", rt.sv(f, "connected"))) ? 1 : 0));
		}
	} else if ($0 === "toggleopen") {
		if (truthy(rt.sv(f, "connected"))) {
			yield* g.callName(f, rt.sv(f, "connected"), "toggle_open", [live(f.usr)]);
		}
	} else if ($0 === "setduration") {
		if (!truthy(live(num))) {
			num = (yield* g.call(f, P("/proc/round"), null, [(yield* g.op(f, "Prompt", [33], [null, "Input an Integer", "Choose pulse duration:", live(f.usr), null]))]));
		}
		if (truthy(live(num))) {
			rt.setSv(f, "radduration", (yield* g.call(f, P("/proc/Wrap"), null, [live(num), 1, 31])));
		}
	} else if ($0 === "setstrength") {
		if (!truthy(live(num))) {
			num = (yield* g.call(f, P("/proc/round"), null, [(yield* g.op(f, "Prompt", [33], [null, "Input an Integer", "Choose pulse strength:", live(f.usr), null]))]));
		}
		if (truthy(live(num))) {
			rt.setSv(f, "radstrength", (yield* g.call(f, P("/proc/Wrap"), null, [live(num), 1, 16])));
		}
	} else if ($0 === "screen") {
		rt.setSv(f, "current_screen", rt.at(live(f.args[1]), "text"));
	} else if ($0 === "rejuv") {
		if ((truthy(live(viable_occupant)) && truthy(rt.fv(f, "reagents", live(viable_occupant))))) {
			potassiodide_amount = (yield* g.callName(f, rt.fv(f, "reagents", live(viable_occupant)), "get_reagent_amount", ["potass_iodide"]));
			can_add = (yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/min"), null, [subtract(90, live(potassiodide_amount)), 15])), 0]));
			yield* g.callName(f, rt.fv(f, "reagents", live(viable_occupant)), "add_reagent", ["potass_iodide", live(can_add)]);
		}
	} else if ($0 === "setbufferlabel") {
		text = (yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [3], [null, "Input an Text", "Input a new label:", live(f.usr), null]))]));
		if ((truthy(live(num)) && truthy(live(text)))) {
			num = (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [live(num), 3]))]));
			if (truthy((rt.istype((buffer_slot = rt.index(rt.sv(f, "buffer"), live(num))), T("/list")) ? 1 : 0))) {
				rt.setAt(live(buffer_slot), "label", live(text));
			}
		}
	} else if ($0 === "setbuffer") {
		if ((truthy(live(num)) && truthy(live(viable_occupant)))) {
			num = (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [live(num), 3]))]));
			rt.setAt(rt.sv(f, "buffer"), live(num), rt.alist(f, ["label", fmt("Buffer＀:＀", [live(num), rt.fv(f, "real_name", live(viable_occupant))]), "UI", rt.gv(f, "uni_identity", rt.fv(f, "dna", live(viable_occupant))), "SE", rt.gv(f, "struc_enzymes", rt.fv(f, "dna", live(viable_occupant))), "UE", rt.gv(f, "unique_enzymes", rt.fv(f, "dna", live(viable_occupant))), "name", rt.fv(f, "real_name", live(viable_occupant)), "blood_type", rt.gv(f, "blood_type", rt.fv(f, "dna", live(viable_occupant)))]));
		}
	} else if ($0 === "clearbuffer") {
		if (truthy(live(num))) {
			num = (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [live(num), 3]))]));
			if (truthy((rt.istype((buffer_slot_3 = rt.index(rt.sv(f, "buffer"), live(num))), T("/list")) ? 1 : 0))) {
				yield* g.callName(f, live(buffer_slot_3), "Cut", []);
			}
		}
	} else if ($0 === "transferbuffer") {
		if ((truthy(live(num)) && truthy(live(viable_occupant)))) {
			$0 = rt.at(live(f.args[1]), "text");
			if ($0 === "se") {
				yield* g.srcCall(f, "apply_buffer", 1, live(num));
			} else if ($0 === "ui") {
				yield* g.srcCall(f, "apply_buffer", 2, live(num));
			} else if ($0 === "ue") {
				yield* g.srcCall(f, "apply_buffer", 3, live(num));
			} else if ($0 === "mixed") {
				yield* g.srcCall(f, "apply_buffer", 4, live(num));
			}
		}
	} else if ($0 === "injector") {
		if ((truthy(live(num)) && rt.lt(rt.sv(f, "injectorready"), rt.worldTime(f)))) {
			num = (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [live(num), 3]))]));
			if (truthy((rt.istype((buffer_slot_3 = rt.index(rt.sv(f, "buffer"), live(num))), T("/list")) ? 1 : 0))) {
				I = null;
				$0 = rt.at(live(f.args[1]), "text");
				if ($0 === "se") {
					if (truthy(rt.at(live(buffer_slot_3), "SE"))) {
						I = (yield* g.new_(f, T("/obj/item/weapon/dnainjector/timed"), [rt.sv(f, "loc")]));
						powers = 0;
						HM = null;
						rt.forList(f, 0, add(add(rt.gl("good_mutations"), rt.gl("bad_mutations")), rt.gl("not_good_mutations")), T("/datum/mutation/human"));
						while (($e = rt.next(f, 0)) !== undefined) {
							HM = $e;
							if (truthy((yield* g.callName(f, live(HM), "check_block_string", [rt.at(live(buffer_slot_3), "SE")])))) {
								yield* g.callName(f, rt.fv(f, "add_mutations", live(I)), "Add", [live(HM)]);
								if (truthy((rt.isIn(f, live(HM), rt.gl("good_mutations")) ? 1 : 0))) {
									powers = rt.modify(live(powers), 1, add);
								}
								if (truthy((rt.isIn(f, live(HM), add(rt.gl("bad_mutations"), rt.gl("not_good_mutations"))) ? 1 : 0))) {
									(powers = rt.modify(live(powers), 1, subtract));
								}
							} else {
								yield* g.callName(f, rt.fv(f, "remove_mutations", live(I)), "Add", [live(HM)]);
							}
						}
						rt.endFor(f, 0);
						rt.setFv(f, "origin_tech", live(I), fmt("biotech=2;engineering=＀", [(yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [6, live(powers)]))]))]));
						time_coeff = null;
						HM_7 = null;
						rt.forList(f, 0, rt.fv(f, "add_mutations", live(I)), T("/datum/mutation/human"));
						while (($e = rt.next(f, 0)) !== undefined) {
							HM_7 = $e;
							if (!truthy(live(time_coeff))) {
								time_coeff = rt.fv(f, "time_coeff", live(HM_7));
								continue;
							}
							time_coeff = (yield* g.call(f, P("/proc/min"), null, [live(time_coeff), rt.fv(f, "time_coeff", live(HM_7))]));
						}
						rt.endFor(f, 0);
						if (truthy(rt.sv(f, "connected"))) {
							rt.setFv(f, "duration", live(I), multiply(multiply(rt.fv(f, "duration", live(I)), live(time_coeff)), rt.fv(f, "damage_coeff", rt.sv(f, "connected"))));
							rt.setFv(f, "damage_coeff", live(I), rt.fv(f, "damage_coeff", rt.sv(f, "connected")));
						}
					}
				} else if ($0 === "ui") {
					if (truthy(rt.at(live(buffer_slot_3), "UI"))) {
						rt.setFv(f, "fields", (I = (yield* g.new_(f, T("/obj/item/weapon/dnainjector/timed"), [rt.sv(f, "loc")]))), rt.alist(f, ["UI", rt.at(live(buffer_slot_3), "UI")]));
						if (truthy(rt.sv(f, "connected"))) {
							rt.setFv(f, "damage_coeff", live(I), rt.fv(f, "damage_coeff", rt.sv(f, "connected")));
						}
					}
				} else if ($0 === "ue") {
					if (((truthy(rt.at(live(buffer_slot_3), "name")) && truthy(rt.at(live(buffer_slot_3), "UE"))) && truthy(rt.at(live(buffer_slot_3), "blood_type")))) {
						rt.setFv(f, "fields", (I = (yield* g.new_(f, T("/obj/item/weapon/dnainjector/timed"), [rt.sv(f, "loc")]))), rt.alist(f, ["name", rt.at(live(buffer_slot_3), "name"), "UE", rt.at(live(buffer_slot_3), "UE"), "blood_type", rt.at(live(buffer_slot_3), "blood_type")]));
						if (truthy(rt.sv(f, "connected"))) {
							rt.setFv(f, "damage_coeff", live(I), rt.fv(f, "damage_coeff", rt.sv(f, "connected")));
						}
					}
				} else if ($0 === "mixed") {
					if ((((truthy(rt.at(live(buffer_slot_3), "UI")) && truthy(rt.at(live(buffer_slot_3), "name"))) && truthy(rt.at(live(buffer_slot_3), "UE"))) && truthy(rt.at(live(buffer_slot_3), "blood_type")))) {
						rt.setFv(f, "fields", (I = (yield* g.new_(f, T("/obj/item/weapon/dnainjector/timed"), [rt.sv(f, "loc")]))), rt.alist(f, ["UI", rt.at(live(buffer_slot_3), "UI"), "name", rt.at(live(buffer_slot_3), "name"), "UE", rt.at(live(buffer_slot_3), "UE"), "blood_type", rt.at(live(buffer_slot_3), "blood_type")]));
						if (truthy(rt.sv(f, "connected"))) {
							rt.setFv(f, "damage_coeff", live(I), rt.fv(f, "damage_coeff", rt.sv(f, "connected")));
						}
					}
				}
				if (truthy(live(I))) {
					rt.setSv(f, "injectorready", add(rt.worldTime(f), 100));
				}
			}
		}
	} else if ($0 === "loaddisk") {
		if (((truthy(live(num)) && truthy(rt.sv(f, "diskette"))) && truthy(rt.fv(f, "fields", rt.sv(f, "diskette"))))) {
			num = (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [live(num), 3]))]));
			rt.setAt(rt.sv(f, "buffer"), live(num), (yield* g.callName(f, rt.fv(f, "fields", rt.sv(f, "diskette")), "Copy", [])));
		}
	} else if ($0 === "savedisk") {
		if (((truthy(live(num)) && truthy(rt.sv(f, "diskette"))) && !truthy(rt.fv(f, "read_only", rt.sv(f, "diskette"))))) {
			num = (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [live(num), 3]))]));
			if (truthy((rt.istype((buffer_slot_3 = rt.index(rt.sv(f, "buffer"), live(num))), T("/list")) ? 1 : 0))) {
				rt.setFv(f, "name", rt.sv(f, "diskette"), fmt("data disk [＀]", [rt.at(live(buffer_slot_3), "label")]));
				rt.setFv(f, "fields", rt.sv(f, "diskette"), (yield* g.callName(f, live(buffer_slot_3), "Copy", [])));
			}
		}
	} else if ($0 === "ejectdisk") {
		if (truthy(rt.sv(f, "diskette"))) {
			rt.setFv(f, "loc", rt.sv(f, "diskette"), rt.getStep(f, live(f.src), 0));
			rt.setSv(f, "diskette", null);
		}
	} else if ($0 === "setdelayed") {
		if (truthy(live(num))) {
			rt.setSv(f, "delayed_action", rt.alist(f, ["action", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "delayaction")])), "buffer", live(num)]));
		}
	} else if ($0 === "pulseui" || $0 === "pulsese") {
		if (((truthy(live(num)) && truthy(live(viable_occupant))) && truthy(rt.sv(f, "connected")))) {
			rt.setSv(f, "radduration", (yield* g.call(f, P("/proc/Wrap"), null, [rt.sv(f, "radduration"), 1, 31])));
			rt.setSv(f, "radstrength", (yield* g.call(f, P("/proc/Wrap"), null, [rt.sv(f, "radstrength"), 1, 16])));
			locked_state = rt.fv(f, "locked", rt.sv(f, "connected"));
			rt.setFv(f, "locked", rt.sv(f, "connected"), 1);
			rt.setSv(f, "current_screen", "working");
			yield* g.srcCall(f, "ShowInterface", live(f.usr));
			yield* g.call(f, P("/proc/sleep"), null, [multiply(rt.sv(f, "radduration"), 10)]);
			rt.setSv(f, "current_screen", "mainmenu");
			if (((truthy(live(viable_occupant)) && truthy(rt.sv(f, "connected"))) && isEqual(rt.fv(f, "occupant", rt.sv(f, "connected")), live(viable_occupant)))) {
				rt.modField(f, live(viable_occupant), "radiation", divide(multiply(multiply(0.20000000298023224, rt.sv(f, "radduration")), rt.sv(f, "radstrength")), rt.power(rt.fv(f, "damage_coeff", rt.sv(f, "connected")), 2)), add);
				$0 = rt.at(live(f.args[1]), "task");
				if ($0 === "pulseui") {
					len = rt.length(rt.gv(f, "uni_identity", rt.fv(f, "dna", live(viable_occupant))));
					num = (yield* g.srcCall(f, "randomize_radiation_accuracy", (num = (yield* g.call(f, P("/proc/Wrap"), null, [live(num), 1, add(live(len), 1)]))), add(rt.sv(f, "radduration"), rt.power(rt.fv(f, "precision_coeff", rt.sv(f, "connected")), 2)), live(len)));
					block = add((yield* g.call(f, P("/proc/round"), null, [divide(subtract(live(num), 1), 3)])), 1);
					subblock = subtract(live(num), multiply(live(block), 3));
					last_change = fmt("UI #＀-＀; ", [live(block), live(subblock)]);
					last_change = rt.modify(live(last_change), fmt("＀", [(hex = (yield* g.call(f, P("/proc/copytext"), null, [rt.gv(f, "uni_identity", rt.fv(f, "dna", live(viable_occupant))), live(num), add(live(num), 1)])))]), add);
					last_change = rt.modify(live(last_change), fmt("->＀", [(hex = (yield* g.srcCall(f, "scramble", live(hex), rt.sv(f, "radstrength"), rt.sv(f, "radduration"))))]), add);
					rt.setFv(f, "uni_identity", rt.fv(f, "dna", live(viable_occupant)), add(add((yield* g.call(f, P("/proc/copytext"), null, [rt.gv(f, "uni_identity", rt.fv(f, "dna", live(viable_occupant))), 1, live(num)])), live(hex)), (yield* g.call(f, P("/proc/copytext"), null, [rt.gv(f, "uni_identity", rt.fv(f, "dna", live(viable_occupant))), add(live(num), 1), 0]))));
					yield* g.callName(f, live(viable_occupant), "updateappearance", ["mutations_overlay_update", 1], rt.Args.Named);
				} else if ($0 === "pulsese") {
					len = rt.length(rt.gv(f, "struc_enzymes", rt.fv(f, "dna", live(viable_occupant))));
					num = (yield* g.srcCall(f, "randomize_radiation_accuracy", (num = (yield* g.call(f, P("/proc/Wrap"), null, [live(num), 1, add(live(len), 1)]))), add(rt.sv(f, "radduration"), rt.power(rt.fv(f, "precision_coeff", rt.sv(f, "connected")), 2)), live(len)));
					block = add((yield* g.call(f, P("/proc/round"), null, [divide(subtract(live(num), 1), 3)])), 1);
					subblock = subtract(live(num), multiply(live(block), 3));
					last_change = fmt("SE #＀-＀; ", [live(block), live(subblock)]);
					last_change = rt.modify(live(last_change), fmt("＀", [(hex = (yield* g.call(f, P("/proc/copytext"), null, [rt.gv(f, "struc_enzymes", rt.fv(f, "dna", live(viable_occupant))), live(num), add(live(num), 1)])))]), add);
					last_change = rt.modify(live(last_change), fmt("->＀", [(hex = (yield* g.srcCall(f, "scramble", live(hex), rt.sv(f, "radstrength"), rt.sv(f, "radduration"))))]), add);
					rt.setFv(f, "struc_enzymes", rt.fv(f, "dna", live(viable_occupant)), add(add((yield* g.call(f, P("/proc/copytext"), null, [rt.gv(f, "struc_enzymes", rt.fv(f, "dna", live(viable_occupant))), 1, live(num)])), live(hex)), (yield* g.call(f, P("/proc/copytext"), null, [rt.gv(f, "struc_enzymes", rt.fv(f, "dna", live(viable_occupant))), add(live(num), 1), 0]))));
					yield* g.callName(f, live(viable_occupant), "domutcheck", []);
				}
			} else {
				rt.setSv(f, "current_screen", "mainmenu");
			}
			if (truthy(rt.sv(f, "connected"))) {
				rt.setFv(f, "locked", rt.sv(f, "connected"), live(locked_state));
			}
		}
	}
	yield* g.srcCall(f, "ShowInterface", live(f.usr), live(last_change));
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/computer/scan_consolenew/proc/scramble  (code/game/machinery/computer/dna_console.dm:518)
rt.def("/obj/machinery/computer/scan_consolenew/proc/scramble", function scramble(f: Frame, input: Value, rs: Value, rd: Value) {
	let length: Value = null, ran: Value = null;
	f.vars = () => [length, ran];
	length = rt.length(live(input));
	if (isEqual((ran = rt.call(f, P("/proc/gaussian"), null, [0, multiply(live(rs), 1)])), 0)) {
		ran = rt.op(f, "PickUnweighted", [2], [-1, 1]);
	} else {
		if (rt.lt(live(ran), 0)) {
			ran = rt.call(f, P("/proc/round"), null, [live(ran)]);
		} else {
			ran = rt.neg(rt.call(f, P("/proc/round"), null, [rt.neg(live(ran))]));
		}
	}
	return rt.call(f, P("/proc/num2hex"), null, [rt.call(f, P("/proc/Wrap"), null, [add(rt.call(f, P("/proc/hex2num"), null, [live(input)]), live(ran)), 0, rt.power(16, live(length))]), live(length)]);
});

// /obj/machinery/computer/scan_consolenew/proc/randomize_radiation_accuracy  (code/game/machinery/computer/dna_console.dm:529)
rt.def("/obj/machinery/computer/scan_consolenew/proc/randomize_radiation_accuracy", function randomize_radiation_accuracy(f: Frame, position_we_were_supposed_to_hit: Value, radduration: Value, number_of_blocks: Value) {
	return rt.call(f, P("/proc/Wrap"), null, [rt.call(f, P("/proc/round"), null, [add(live(position_we_were_supposed_to_hit), rt.call(f, P("/proc/gaussian"), null, [0, divide(3, live(radduration))])), 1]), 1, add(live(number_of_blocks), 1)]);
});

// /obj/machinery/computer/scan_consolenew/proc/get_viable_occupant  (code/game/machinery/computer/dna_console.dm:535)
rt.def("/obj/machinery/computer/scan_consolenew/proc/get_viable_occupant", function get_viable_occupant(f: Frame) {
	let viable_occupant: Value = null;
	f.vars = () => [viable_occupant];
	viable_occupant = null;
	if (truthy(rt.sv(f, "connected"))) {
		if (((!truthy((rt.istype((viable_occupant = rt.fv(f, "occupant", rt.sv(f, "connected"))), T("/mob/living/carbon")) ? 1 : 0)) || !truthy(rt.fv(f, "dna", live(viable_occupant)))) || truthy(rt.bitAnd(rt.fv(f, "disabilities", live(viable_occupant)), 128)))) {
			viable_occupant = null;
		}
	}
	return live(viable_occupant);
});

// /obj/machinery/computer/scan_consolenew/proc/apply_buffer  (code/game/machinery/computer/dna_console.dm:540)  may sleep
rt.def("/obj/machinery/computer/scan_consolenew/proc/apply_buffer", function* apply_buffer(f: Frame, action: Value, buffer_num: Value) {
	let buffer_slot: Value = null, viable_occupant: Value = null;
	let $0: any;
	f.vars = () => [action, buffer_num, buffer_slot, viable_occupant, $0];
	buffer_num = (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [live(buffer_num), 3]))]));
	buffer_slot = rt.index(rt.sv(f, "buffer"), live(buffer_num));
	viable_occupant = (yield* g.srcCall(f, "get_viable_occupant"));
	if (!truthy((rt.istype(live(buffer_slot), T("/list")) ? 1 : 0))) return f.dot;
	rt.modField(f, live(viable_occupant), "radiation", (yield* g.call(f, P("/proc/rand"), null, [divide(10, rt.power(rt.fv(f, "damage_coeff", rt.sv(f, "connected")), 2)), divide(25, rt.power(rt.fv(f, "damage_coeff", rt.sv(f, "connected")), 2))])), add);
	$0 = live(action);
	if ($0 === 1) {
		if (truthy(rt.at(live(buffer_slot), "SE"))) {
			rt.setFv(f, "struc_enzymes", rt.fv(f, "dna", live(viable_occupant)), rt.at(live(buffer_slot), "SE"));
			yield* g.callName(f, live(viable_occupant), "domutcheck", []);
		}
	} else if ($0 === 2) {
		if (truthy(rt.at(live(buffer_slot), "UI"))) {
			rt.setFv(f, "uni_identity", rt.fv(f, "dna", live(viable_occupant)), rt.at(live(buffer_slot), "UI"));
			yield* g.callName(f, live(viable_occupant), "updateappearance", ["mutations_overlay_update", 1], rt.Args.Named);
		}
	} else if ($0 === 3) {
		if (((truthy(rt.at(live(buffer_slot), "name")) && truthy(rt.at(live(buffer_slot), "UE"))) && truthy(rt.at(live(buffer_slot), "blood_type")))) {
			rt.setFv(f, "real_name", live(viable_occupant), rt.at(live(buffer_slot), "name"));
			rt.setFv(f, "name", live(viable_occupant), rt.at(live(buffer_slot), "name"));
			rt.setFv(f, "unique_enzymes", rt.fv(f, "dna", live(viable_occupant)), rt.at(live(buffer_slot), "UE"));
			rt.setFv(f, "blood_type", rt.fv(f, "dna", live(viable_occupant)), rt.at(live(buffer_slot), "blood_type"));
		}
	} else if ($0 === 4) {
		if (truthy(rt.at(live(buffer_slot), "UI"))) {
			rt.setFv(f, "uni_identity", rt.fv(f, "dna", live(viable_occupant)), rt.at(live(buffer_slot), "UI"));
			yield* g.callName(f, live(viable_occupant), "updateappearance", ["mutations_overlay_update", 1], rt.Args.Named);
		}
		if (!((truthy(rt.at(live(buffer_slot), "name")) && truthy(rt.at(live(buffer_slot), "UE"))) && truthy(rt.at(live(buffer_slot), "blood_type")))) return f.dot;
		rt.setFv(f, "real_name", live(viable_occupant), rt.at(live(buffer_slot), "name"));
		rt.setFv(f, "name", live(viable_occupant), rt.at(live(buffer_slot), "name"));
		rt.setFv(f, "unique_enzymes", rt.fv(f, "dna", live(viable_occupant)), rt.at(live(buffer_slot), "UE"));
		rt.setFv(f, "blood_type", rt.fv(f, "dna", live(viable_occupant)), rt.at(live(buffer_slot), "blood_type"));
	}
	return f.dot;
}, true);

// /obj/machinery/computer/scan_consolenew/proc/on_scanner_close  (code/game/machinery/computer/dna_console.dm:574)  may sleep
rt.def("/obj/machinery/computer/scan_consolenew/proc/on_scanner_close", function* on_scanner_close(f: Frame) {
	yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "occupant", rt.sv(f, "connected")), fmt("<span class='notice'>＀ activates!</span>", [live(f.src)])]);
	if (truthy(rt.sv(f, "delayed_action"))) {
		yield* g.srcCall(f, "apply_buffer", rt.at(rt.sv(f, "delayed_action"), "action"), rt.at(rt.sv(f, "delayed_action"), "buffer"));
		rt.setSv(f, "delayed_action", null);
	}
	return live(f.dot);
}, true);
