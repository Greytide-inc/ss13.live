// From code/modules/research/server.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10966, "/obj/machinery/r_n_d/server", "/obj/machinery/r_n_d", {
	files: null,
	heat_health: 100,
	id_with_upload: null,
	id_with_download: null,
	id_with_upload_string: "",
	id_with_download_string: "",
	server_id: 0,
	heat_gen: 100,
	heating_power: 40000,
	delay: 10,
	name: "R&D Server",
	icon: rt.rsc("icons/obj/machines/research.dmi"),
	icon_state: "server",
	req_access: null,
});

// /obj/machinery/r_n_d/server/proc/<init>  (code/modules/research/server.dm:7)
rt.def("/obj/machinery/r_n_d/server/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "id_with_upload", rt.list());
	$0 = $0;
	rt.setSv(f, "id_with_download", rt.list());
	$0 = $0;
	rt.setSv(f, "req_access", rt.list(30));
	return f.dot;
});

// /obj/machinery/r_n_d/server/proc/Initialize  (code/modules/research/server.dm:18)  may sleep
rt.def("/obj/machinery/r_n_d/server/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/rdserver"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6783, "/obj/item/weapon/circuitboard/machine/rdserver", "/obj/item/weapon/circuitboard/machine", {
	name: "R&D Server (Machine Board)",
	build_path: rt.typePath("/obj/machinery/r_n_d/server"),
	origin_tech: "programming=3",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/rdserver/proc/<init>  (code/modules/research/server.dm:26)
rt.def("/obj/item/weapon/circuitboard/machine/rdserver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/stack/cable_coil"), 2, T("/obj/item/weapon/stock_parts/scanning_module"), 1]));
	return f.dot;
});

// /obj/machinery/r_n_d/server/proc/Destroy  (code/modules/research/server.dm:31)  may sleep
rt.def("/obj/machinery/r_n_d/server/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "griefProtection");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/r_n_d/server/proc/RefreshParts  (code/modules/research/server.dm:36)
rt.def("/obj/machinery/r_n_d/server/proc/RefreshParts", function RefreshParts(f: Frame) {
	let tot_rating: Value = null, SP: Value = null;
	let $e: any;
	f.vars = () => [tot_rating, SP, $e];
	tot_rating = 0;
	SP = null;
	rt.forList(f, 0, live(f.src), T("/obj/item/weapon/stock_parts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SP = $e;
		tot_rating = rt.modify(live(tot_rating), rt.fv(f, "rating", live(SP)), add);
	}
	rt.endFor(f, 0);
	(rt.modSrcVar(f, "heat_gen", rt.call(f, P("/proc/max"), null, [1, live(tot_rating)]), divide));
	return f.dot;
});

// /obj/machinery/r_n_d/server/proc/Initialize  (code/modules/research/server.dm:41)  may sleep
rt.def("/obj/machinery/r_n_d/server/proc/Initialize", function* Initialize(f: Frame) {
	let temp_list: Value = null, N: Value = null;
	let $e: any;
	f.vars = () => [temp_list, N, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "files"))) {
		rt.setSv(f, "files", (yield* g.new_(f, T("/datum/research"), [live(f.src)])));
	}
	temp_list = null;
	if (!truthy(rt.len(f, rt.sv(f, "id_with_upload")))) {
		temp_list = rt.list();
		temp_list = (yield* g.call(f, P("/proc/splittext"), null, [rt.sv(f, "id_with_upload_string"), ";"]));
		N = null;
		rt.forList(f, 0, live(temp_list));
		while (($e = rt.next(f, 0)) !== undefined) {
			N = $e;
			rt.modSrcVar(f, "id_with_upload", (yield* g.call(f, P("/proc/text2num"), null, [live(N)])), add);
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.len(f, rt.sv(f, "id_with_download")))) return f.dot;
	temp_list = rt.list();
	temp_list = (yield* g.call(f, P("/proc/splittext"), null, [rt.sv(f, "id_with_download_string"), ";"]));
	N = null;
	rt.forList(f, 0, live(temp_list));
	while (($e = rt.next(f, 0)) !== undefined) {
		N = $e;
		rt.modSrcVar(f, "id_with_download", (yield* g.call(f, P("/proc/text2num"), null, [live(N)])), add);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/machinery/r_n_d/server/proc/process  (code/modules/research/server.dm:56)  may sleep
rt.def("/obj/machinery/r_n_d/server/proc/process", function* process(f: Frame) {
	let environment: Value = null, updateRD: Value = null, v: Value = null, _T: Value = null;
	let $0: any, $e: any;
	f.vars = () => [environment, updateRD, v, _T, $0, $e];
	$0 = rt.gv(f, "temperature", (environment = (yield* g.callName(f, rt.sv(f, "loc"), "return_air", []))));
	if (rt.inRange($0, 0, 273.1499938964844)) {
		rt.setSv(f, "heat_health", (yield* g.call(f, P("/proc/min"), null, [100, add(rt.sv(f, "heat_health"), 1)])));
	} else if (rt.inRange($0, 273.1499938964844, 313.1499938964844)) {
		rt.setSv(f, "heat_health", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [rt.sv(f, "heat_health"), 100]))])));
	} else if (rt.inRange($0, 313.1499938964844, 343.1499938964844)) {
		rt.setSv(f, "heat_health", (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "heat_health"), 1)])));
	}
	if (rt.le(rt.sv(f, "heat_health"), 0)) {
		updateRD = 0;
		rt.setFv(f, "known_designs", rt.sv(f, "files"), rt.list());
		v = null;
		rt.forList(f, 0, rt.fv(f, "known_tech", rt.sv(f, "files")));
		while (($e = rt.next(f, 0)) !== undefined) {
			v = $e;
			_T = rt.index(rt.fv(f, "known_tech", rt.sv(f, "files")), live(v));
			if (truthy(rt.op(f, "Prob", [], [1]))) {
				updateRD = rt.inc(live(updateRD), 1);
				rt.incField(f, live(_T), "level", -1, true);
			}
		}
		rt.endFor(f, 0);
		if (truthy(live(updateRD))) {
			yield* g.callName(f, rt.sv(f, "files"), "RefreshResearch", []);
		}
	}
	if (truthy(rt.sv(f, "delay"))) {
		rt.incSrcVar(f, "delay", -1, true);
	} else {
		yield* g.srcCall(f, "produce_heat", rt.sv(f, "heat_gen"));
		rt.setSv(f, "delay", rt.initial(f, live(f.src), "delay"));
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/r_n_d/server/proc/emp_act  (code/modules/research/server.dm:84)  may sleep
rt.def("/obj/machinery/r_n_d/server/proc/emp_act", function* emp_act(f: Frame) {
	yield* g.srcCall(f, "griefProtection");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /obj/machinery/r_n_d/server/proc/ex_act  (code/modules/research/server.dm:88)  may sleep
rt.def("/obj/machinery/r_n_d/server/proc/ex_act", function* ex_act(f: Frame) {
	yield* g.srcCall(f, "griefProtection");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity", "target"], waitfor: false });

// /obj/machinery/r_n_d/server/proc/griefProtection  (code/modules/research/server.dm:93)  may sleep
rt.def("/obj/machinery/r_n_d/server/proc/griefProtection", function* griefProtection(f: Frame) {
	let C: Value = null, v: Value = null, _T: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [C, v, _T, D, $e];
	C = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/r_n_d/server/centcom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		v = null;
		rt.forList(f, 1, rt.fv(f, "known_tech", rt.sv(f, "files")));
		while (($e = rt.next(f, 1)) !== undefined) {
			v = $e;
			_T = rt.index(rt.fv(f, "known_tech", rt.sv(f, "files")), live(v));
			yield* g.callName(f, rt.fv(f, "files", live(C)), "AddTech2Known", [live(_T)]);
		}
		rt.endFor(f, 1);
		v = null;
		rt.forList(f, 1, rt.fv(f, "known_designs", rt.sv(f, "files")));
		while (($e = rt.next(f, 1)) !== undefined) {
			v = $e;
			D = rt.index(rt.fv(f, "known_designs", rt.sv(f, "files")), live(v));
			yield* g.callName(f, rt.fv(f, "files", live(C)), "AddDesign2Known", [live(D)]);
		}
		rt.endFor(f, 1);
		yield* g.callName(f, rt.fv(f, "files", live(C)), "RefreshResearch", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/r_n_d/server/proc/produce_heat  (code/modules/research/server.dm:103)  may sleep
rt.def("/obj/machinery/r_n_d/server/proc/produce_heat", function* produce_heat(f: Frame, heat_amt: Value) {
	let L: Value = null, env: Value = null, transfer_moles: Value = null, removed: Value = null, heat_capacity: Value = null;
	f.vars = () => [heat_amt, L, env, transfer_moles, removed, heat_capacity];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) return f.dot;
	if (!truthy((rt.istype((L = rt.sv(f, "loc")), T("/turf")) ? 1 : 0))) return f.dot;
	if (!rt.lt(rt.gv(f, "temperature", (env = (yield* g.callName(f, live(L), "return_air", [])))), add(live(heat_amt), 273.1499938964844))) return f.dot;
	transfer_moles = multiply(0.25, (yield* g.callName(f, live(env), "total_moles", [])));
	if (truthy((removed = (yield* g.callName(f, live(env), "remove", [live(transfer_moles)]))))) {
		if ((isEqual((heat_capacity = (yield* g.callName(f, live(removed), "heat_capacity", []))), 0) || live(heat_capacity) === null)) {
			heat_capacity = 1;
		}
		rt.setFv(f, "temperature", live(removed), (yield* g.call(f, P("/proc/min"), null, [divide(add(multiply(rt.fv(f, "temperature", live(removed)), live(heat_capacity)), rt.sv(f, "heating_power")), live(heat_capacity)), 1000])));
	}
	yield* g.callName(f, live(env), "merge", [live(removed)]);
	yield* g.srcCall(f, "air_update_turf");
	return f.dot;
}, true);

// /obj/machinery/r_n_d/server/proc/on_deconstruction  (code/modules/research/server.dm:125)  may sleep
rt.def("/obj/machinery/r_n_d/server/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	yield* g.srcCall(f, "griefProtection");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/r_n_d/server/proc/attack_hand  (code/modules/research/server.dm:132)  may sleep
rt.def("/obj/machinery/r_n_d/server/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "disabled"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "shocked"))) {
		yield* g.srcCall(f, "shock", live(user), 50);
	}
	return live(f.dot);
}, true);

rt.type(10967, "/obj/machinery/r_n_d/server/centcom", "/obj/machinery/r_n_d/server", {
	server_id: -1,
	name: "Centcom Central R&D Database",
});

// /obj/machinery/r_n_d/server/centcom/proc/Initialize  (code/modules/research/server.dm:140)  may sleep
rt.def("/obj/machinery/r_n_d/server/centcom/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/fix_noid_research_servers"), null, []);
	return f.dot;
}, true);

// /proc/fix_noid_research_servers  (code/modules/research/server.dm:144)
rt.def("/proc/fix_noid_research_servers", function fix_noid_research_servers(f: Frame) {
	let no_id_servers: Value = null, server_ids: Value = null, S: Value = null, num: Value = null;
	let $0: any, $e: any;
	f.vars = () => [no_id_servers, server_ids, S, num, $0, $e];
	no_id_servers = rt.list();
	server_ids = rt.list();
	S = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/r_n_d/server"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		$0 = rt.fv(f, "server_id", live(S));
		if ($0 === -1) {
			continue;
		} else if ($0 === 0) {
			no_id_servers = rt.modify(live(no_id_servers), live(S), add);
		} else {
			server_ids = rt.modify(live(server_ids), rt.fv(f, "server_id", live(S)), add);
		}
	}
	rt.endFor(f, 0);
	S = null;
	rt.forList(f, 0, live(no_id_servers), T("/obj/machinery/r_n_d/server"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		num = 1;
		while (!truthy(rt.fv(f, "server_id", live(S)))) {
			if (truthy((rt.isIn(f, live(num), live(server_ids)) ? 1 : 0))) {
				num = rt.inc(live(num), 1);
			} else {
				rt.setFv(f, "server_id", live(S), live(num));
				server_ids = rt.modify(live(server_ids), live(num), add);
			}
		}
		(no_id_servers = rt.modify(live(no_id_servers), live(S), subtract));
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(10432, "/obj/machinery/computer/rdservercontrol", "/obj/machinery/computer", {
	screen: 0,
	temp_server: null,
	servers: null,
	consoles: null,
	badmin: 0,
	icon_screen: "rdcomp",
	icon_keyboard: "rd_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/rdservercontrol"),
	name: "R&D Server Controller",
	desc: "Used to manage access to research and manufacturing databases.",
});

// /obj/machinery/computer/rdservercontrol/proc/<init>  (code/modules/research/server.dm:176)
rt.def("/obj/machinery/computer/rdservercontrol/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "servers", rt.list());
	$0 = $0;
	rt.setSv(f, "consoles", rt.list());
	return f.dot;
});

// /obj/machinery/computer/rdservercontrol/proc/Topic  (code/modules/research/server.dm:182)  may sleep
rt.def("/obj/machinery/computer/rdservercontrol/proc/Topic", function* Topic(f: Frame) {
	let S: Value = null, C: Value = null, num: Value = null, choice: Value = null, _T: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [S, C, num, choice, _T, D, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	if ((!truthy((yield* g.callName(f, live(f.src), "allowed", [live(f.usr)]))) && !truthy(rt.sv(f, "emagged")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>You do not have the required access level.</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "main"))) {
		rt.setSv(f, "screen", 0);
	} else {
		if (((truthy(rt.at(live(f.args[1]), "access")) || truthy(rt.at(live(f.args[1]), "data"))) || truthy(rt.at(live(f.args[1]), "transfer")))) {
			rt.setSv(f, "temp_server", null);
			rt.setSv(f, "consoles", rt.list());
			rt.setSv(f, "servers", rt.list());
			S = null;
			rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/r_n_d/server"));
			while (($e = rt.next(f, 0)) !== undefined) {
				S = $e;
				if (((isEqual(rt.fv(f, "server_id", live(S)), (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "access")]))) || isEqual(rt.fv(f, "server_id", live(S)), (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "data")])))) || isEqual(rt.fv(f, "server_id", live(S)), (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "transfer")]))))) {
					rt.setSv(f, "temp_server", live(S));
					break;
				}
			}
			rt.endFor(f, 0);
			if (truthy(rt.at(live(f.args[1]), "access"))) {
				rt.setSv(f, "screen", 1);
				C = null;
				rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/computer/rdconsole"));
				while (($e = rt.next(f, 0)) !== undefined) {
					C = $e;
					if (truthy(rt.fv(f, "sync", live(C)))) {
						rt.modSrcVar(f, "consoles", live(C), add);
					}
				}
				rt.endFor(f, 0);
			} else {
				if (truthy(rt.at(live(f.args[1]), "data"))) {
					rt.setSv(f, "screen", 2);
				} else {
					if (truthy(rt.at(live(f.args[1]), "transfer"))) {
						rt.setSv(f, "screen", 3);
						S = null;
						rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/r_n_d/server"));
						while (($e = rt.next(f, 0)) !== undefined) {
							S = $e;
							if (isEqual(live(S), live(f.src))) {
								continue;
							}
							rt.modSrcVar(f, "servers", live(S), add);
						}
						rt.endFor(f, 0);
					}
				}
			}
		} else {
			if (truthy(rt.at(live(f.args[1]), "upload_toggle"))) {
				if (truthy((rt.isIn(f, (num = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "upload_toggle")]))), rt.fv(f, "id_with_upload", rt.sv(f, "temp_server"))) ? 1 : 0))) {
					(rt.modField(f, rt.sv(f, "temp_server"), "id_with_upload", live(num), subtract));
				} else {
					rt.modField(f, rt.sv(f, "temp_server"), "id_with_upload", live(num), add);
				}
			} else {
				if (truthy(rt.at(live(f.args[1]), "download_toggle"))) {
					if (truthy((rt.isIn(f, (num = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "download_toggle")]))), rt.fv(f, "id_with_download", rt.sv(f, "temp_server"))) ? 1 : 0))) {
						(rt.modField(f, rt.sv(f, "temp_server"), "id_with_download", live(num), subtract));
					} else {
						rt.modField(f, rt.sv(f, "temp_server"), "id_with_download", live(num), add);
					}
				} else {
					if (truthy(rt.at(live(f.args[1]), "reset_tech"))) {
						if ((isEqual((choice = (yield* g.call(f, P("/proc/alert"), null, ["Technology Data Reset", "Are you sure you want to reset this technology to its default data? Data lost cannot be recovered.", "Continue", "Cancel"]))), "Continue") && truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src)]))))) {
							if (truthy((_T = rt.index(rt.gv(f, "known_tech", rt.fv(f, "files", rt.sv(f, "temp_server"))), rt.at(live(f.args[1]), "reset_tech"))))) {
								rt.setFv(f, "level", live(_T), 1);
							}
						}
						yield* g.callName(f, rt.fv(f, "files", rt.sv(f, "temp_server")), "RefreshResearch", []);
					} else {
						if (truthy(rt.at(live(f.args[1]), "reset_design"))) {
							if ((isEqual((choice = (yield* g.call(f, P("/proc/alert"), null, ["Design Data Deletion", "Are you sure you want to delete this design? Data lost cannot be recovered.", "Continue", "Cancel"]))), "Continue") && truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src)]))))) {
								if (truthy((D = rt.index(rt.gv(f, "known_designs", rt.fv(f, "files", rt.sv(f, "temp_server"))), rt.at(live(f.args[1]), "reset_design"))))) {
									(rt.modField(f, rt.fv(f, "files", rt.sv(f, "temp_server")), "known_designs", rt.fv(f, "id", live(D)), subtract));
								}
							}
							yield* g.callName(f, rt.fv(f, "files", rt.sv(f, "temp_server")), "RefreshResearch", []);
						}
					}
				}
			}
		}
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/machinery/computer/rdservercontrol/proc/attack_hand  (code/modules/research/server.dm:250)  may sleep
rt.def("/obj/machinery/computer/rdservercontrol/proc/attack_hand", function* attack_hand(f: Frame) {
	let dat: Value = null, S: Value = null, C: Value = null, console_turf: Value = null, v: Value = null, _T: Value = null, D: Value = null;
	let $0: any, $e: any;
	f.vars = () => [dat, S, C, console_turf, v, _T, D, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "set_machine", [live(f.src)]);
	dat = "";
	$0 = rt.sv(f, "screen");
	if ($0 === 0) {
		dat = rt.modify(live(dat), "Connected Servers:<BR><BR>", add);
		S = null;
		rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/r_n_d/server"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			if ((truthy((rt.istype(live(S), T("/obj/machinery/r_n_d/server/centcom")) ? 1 : 0)) && !truthy(rt.sv(f, "badmin")))) {
				continue;
			}
			dat = rt.modify(live(dat), fmt("＀ || ", [rt.fv(f, "name", live(S))]), add);
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;access=＀'>Access Rights</A> | ", [live(f.src), rt.fv(f, "server_id", live(S))]), add);
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;data=＀'>Data Management</A>", [live(f.src), rt.fv(f, "server_id", live(S))]), add);
			if (truthy(rt.sv(f, "badmin"))) {
				dat = rt.modify(live(dat), fmt(" | <A href='?src=＃;transfer=＀'>Server-to-Server Transfer</A>", [live(f.src), rt.fv(f, "server_id", live(S))]), add);
			}
			dat = rt.modify(live(dat), "<BR>", add);
		}
		rt.endFor(f, 0);
	} else if ($0 === 1) {
		dat = rt.modify(live(dat), fmt("＀ Access Rights<BR><BR>", [rt.fv(f, "name", rt.sv(f, "temp_server"))]), add);
		dat = rt.modify(live(dat), "Consoles with Upload Access<BR>", add);
		C = null;
		rt.forList(f, 0, rt.sv(f, "consoles"), T("/obj/machinery/computer/rdconsole"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			console_turf = rt.getStep(f, live(C), 0);
			dat = rt.modify(live(dat), fmt("* <A href='?src=＃;upload_toggle=＀'>＀", [live(f.src), rt.fv(f, "id", live(C)), rt.fv(f, "loc", live(console_turf))]), add);
			if (truthy((rt.isIn(f, rt.fv(f, "id", live(C)), rt.fv(f, "id_with_upload", rt.sv(f, "temp_server"))) ? 1 : 0))) {
				dat = rt.modify(live(dat), " (Remove)</A><BR>", add);
			} else {
				dat = rt.modify(live(dat), " (Add)</A><BR>", add);
			}
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), "Consoles with Download Access<BR>", add);
		C = null;
		rt.forList(f, 0, rt.sv(f, "consoles"), T("/obj/machinery/computer/rdconsole"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			console_turf = rt.getStep(f, live(C), 0);
			dat = rt.modify(live(dat), fmt("* <A href='?src=＃;download_toggle=＀'>＀", [live(f.src), rt.fv(f, "id", live(C)), rt.fv(f, "loc", live(console_turf))]), add);
			if (truthy((rt.isIn(f, rt.fv(f, "id", live(C)), rt.fv(f, "id_with_download", rt.sv(f, "temp_server"))) ? 1 : 0))) {
				dat = rt.modify(live(dat), " (Remove)</A><BR>", add);
			} else {
				dat = rt.modify(live(dat), " (Add)</A><BR>", add);
			}
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), fmt("<HR><A href='?src=＃;main=1'>Main Menu</A>", [live(f.src)]), add);
	} else if ($0 === 2) {
		dat = rt.modify(live(dat), fmt("＀ Data ManagementP<BR><BR>", [rt.fv(f, "name", rt.sv(f, "temp_server"))]), add);
		dat = rt.modify(live(dat), "Known Technologies<BR>", add);
		v = null;
		rt.forList(f, 0, rt.gv(f, "known_tech", rt.fv(f, "files", rt.sv(f, "temp_server"))));
		while (($e = rt.next(f, 0)) !== undefined) {
			v = $e;
			if (rt.le(rt.gv(f, "level", (_T = rt.index(rt.gv(f, "known_tech", rt.fv(f, "files", rt.sv(f, "temp_server"))), live(v)))), 0)) {
				continue;
			}
			dat = rt.modify(live(dat), fmt("* ＀ ", [rt.fv(f, "name", live(_T))]), add);
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;reset_tech=＀'>(Reset)</A><BR>", [live(f.src), rt.fv(f, "id", live(_T))]), add);
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), "Known Designs<BR>", add);
		v = null;
		rt.forList(f, 0, rt.gv(f, "known_designs", rt.fv(f, "files", rt.sv(f, "temp_server"))));
		while (($e = rt.next(f, 0)) !== undefined) {
			v = $e;
			dat = rt.modify(live(dat), fmt("* ＀ ", [rt.gv(f, "name", (D = rt.index(rt.gv(f, "known_designs", rt.fv(f, "files", rt.sv(f, "temp_server"))), live(v))))]), add);
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;reset_design=＀'>(Delete)</A><BR>", [live(f.src), rt.fv(f, "id", live(D))]), add);
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), fmt("<HR><A href='?src=＃;main=1'>Main Menu</A>", [live(f.src)]), add);
	} else if ($0 === 3) {
		dat = rt.modify(live(dat), fmt("＀ Server to Server Transfer<BR><BR>", [rt.fv(f, "name", rt.sv(f, "temp_server"))]), add);
		dat = rt.modify(live(dat), "Send Data to what server?<BR>", add);
		S = null;
		rt.forList(f, 0, rt.sv(f, "servers"), T("/obj/machinery/r_n_d/server"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			dat = rt.modify(live(dat), fmt("＀ <A href='?src=＃;send_to=＀'>(Transfer)</A><BR>", [rt.fv(f, "name", live(S)), live(f.src), rt.fv(f, "server_id", live(S))]), add);
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), fmt("<HR><A href='?src=＃;main=1'>Main Menu</A>", [live(f.src)]), add);
	}
	rt.op(f, "Browse", [], [live(f.args[0]), fmt("<TITLE>R&D Server Control</TITLE><HR>＀", [live(dat)]), "window=server_control;size=575x400"], false);
	yield* g.call(f, P("/proc/onclose"), null, [live(f.args[0]), "server_control"]);
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/machinery/computer/rdservercontrol/proc/attackby  (code/modules/research/server.dm:315)  may sleep
rt.def("/obj/machinery/computer/rdservercontrol/proc/attackby", function* attackby(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, live(f.src), "updateUsrDialog", []);
	return f.dot;
}, true, { args: ["D", "user", "params"] });

// /obj/machinery/computer/rdservercontrol/proc/emag_act  (code/modules/research/server.dm:319)
rt.def("/obj/machinery/computer/rdservercontrol/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/sparks4.ogg"), 75, 1]);
	rt.setSv(f, "emagged", 1);
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You you disable the security protocols.</span>"]);
	return f.dot;
});
