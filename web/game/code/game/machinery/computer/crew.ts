// From code/game/machinery/computer/crew.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10379, "/obj/machinery/computer/crew", "/obj/machinery/computer", {
	icon_screen: "crew",
	icon_keyboard: "med_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/crew"),
	light_color: "#6496FA",
	name: "crew monitoring console",
	desc: "Used to monitor active health sensors built into most of the crew's uniforms.",
	use_power: 1,
	idle_power_usage: 250,
	active_power_usage: 500,
});

// /obj/machinery/computer/crew/proc/attack_ai  (code/game/machinery/computer/crew.dm:14)  may sleep
rt.def("/obj/machinery/computer/crew/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.gl("crewmonitor"), "show", [live(user)]);
	return f.dot;
}, true);

// /obj/machinery/computer/crew/proc/attack_hand  (code/game/machinery/computer/crew.dm:19)  may sleep
rt.def("/obj/machinery/computer/crew/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.gl("crewmonitor"), "show", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["user"] });

// /datum/controller/global_vars/proc/InitGlobalcrewmonitor  (code/game/machinery/computer/crew.dm:25)
rt.def("/datum/controller/global_vars/proc/InitGlobalcrewmonitor", function InitGlobalcrewmonitor(f: Frame) {
	rt.setGl("crewmonitor", rt.new_(f, T("/datum/crewmonitor"), []));
	rt.modSrcVar(f, "gvars_datum_init_order", "crewmonitor", add);
	return f.dot;
});

rt.type(1499, "/datum/crewmonitor", "/datum", {
	jobs: null,
	interfaces: null,
	data: null,
});

// /datum/crewmonitor/proc/New  (code/game/machinery/computer/crew.dm:33)
rt.def("/datum/crewmonitor/proc/New", function New(f: Frame) {
	let jobs: Value = null;
	f.vars = () => [jobs];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setAt((jobs = rt.new_(f, T("/list"), [])), "Captain", 0);
	rt.setAt(live(jobs), "Head of Personnel", 50);
	rt.setAt(live(jobs), "Head of Security", 10);
	rt.setAt(live(jobs), "Warden", 11);
	rt.setAt(live(jobs), "Security Officer", 12);
	rt.setAt(live(jobs), "Detective", 13);
	rt.setAt(live(jobs), "Chief Medical Officer", 20);
	rt.setAt(live(jobs), "Chemist", 21);
	rt.setAt(live(jobs), "Geneticist", 22);
	rt.setAt(live(jobs), "Virologist", 23);
	rt.setAt(live(jobs), "Medical Doctor", 24);
	rt.setAt(live(jobs), "Research Director", 30);
	rt.setAt(live(jobs), "Scientist", 31);
	rt.setAt(live(jobs), "Roboticist", 32);
	rt.setAt(live(jobs), "Chief Engineer", 40);
	rt.setAt(live(jobs), "Station Engineer", 41);
	rt.setAt(live(jobs), "Atmospheric Technician", 42);
	rt.setAt(live(jobs), "Quartermaster", 51);
	rt.setAt(live(jobs), "Shaft Miner", 52);
	rt.setAt(live(jobs), "Cargo Technician", 53);
	rt.setAt(live(jobs), "Bartender", 61);
	rt.setAt(live(jobs), "Cook", 62);
	rt.setAt(live(jobs), "Botanist", 63);
	rt.setAt(live(jobs), "Curator", 64);
	rt.setAt(live(jobs), "Chaplain", 65);
	rt.setAt(live(jobs), "Clown", 66);
	rt.setAt(live(jobs), "Mime", 67);
	rt.setAt(live(jobs), "Janitor", 68);
	rt.setAt(live(jobs), "Lawyer", 69);
	rt.setAt(live(jobs), "Admiral", 200);
	rt.setAt(live(jobs), "Centcom Commander", 210);
	rt.setAt(live(jobs), "Custodian", 211);
	rt.setAt(live(jobs), "Medical Officer", 212);
	rt.setAt(live(jobs), "Research Officer", 213);
	rt.setAt(live(jobs), "Emergency Response Team Commander", 220);
	rt.setAt(live(jobs), "Security Response Officer", 221);
	rt.setAt(live(jobs), "Engineer Response Officer", 222);
	rt.setAt(live(jobs), "Medical Response Officer", 223);
	rt.setAt(live(jobs), "Assistant", 999);
	rt.setFv(f, "jobs", live(f.src), live(jobs));
	rt.setFv(f, "interfaces", live(f.src), rt.list());
	rt.setFv(f, "data", live(f.src), rt.list());
	rt.call(f, P("/proc/register_asset"), null, ["crewmonitor.js", rt.rsc("code/game/machinery/computer/crew.js")]);
	rt.call(f, P("/proc/register_asset"), null, ["crewmonitor.css", rt.rsc("code/game/machinery/computer/crew.css")]);
	return f.dot;
});

// /datum/crewmonitor/proc/Destroy  (code/game/machinery/computer/crew.dm:83)  may sleep
rt.def("/datum/crewmonitor/proc/Destroy", function* Destroy(f: Frame) {
	let hi: Value = null;
	let $e: any;
	f.vars = () => [hi, $e];
	if (truthy(rt.fv(f, "interfaces", live(f.src)))) {
		hi = null;
		rt.forList(f, 0, rt.sv(f, "interfaces"), T("/datum/html_interface"));
		while (($e = rt.next(f, 0)) !== undefined) {
			hi = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(hi)]);
		}
		rt.endFor(f, 0);
		rt.setFv(f, "interfaces", live(f.src), null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/crewmonitor/proc/show  (code/game/machinery/computer/crew.dm:91)  may sleep
rt.def("/datum/crewmonitor/proc/show", function* show(f: Frame, mob: Value, z: Value) {
	let hi: Value = null;
	f.vars = () => [mob, z, hi];
	if (truthy(rt.fv(f, "client", live(mob)))) {
		yield* g.srcCall(f, "sendResources", rt.fv(f, "client", live(mob)));
	}
	if (!truthy(live(z))) {
		z = rt.fv(f, "z", live(mob));
	}
	if (!(rt.gt(live(z), 0) && truthy(rt.fv(f, "interfaces", live(f.src))))) return f.dot;
	hi = null;
	if (!truthy(rt.index(rt.fv(f, "interfaces", live(f.src)), fmt("＀", [live(z)])))) {
		rt.setAt(rt.fv(f, "interfaces", live(f.src)), fmt("＀", [live(z)]), (yield* g.new_(f, T("/datum/html_interface/nanotrasen"), [live(f.src), "Crew Monitoring", 900, 540, fmt("<link rel=\"stylesheet\" type=\"text/css\" href=\"crewmonitor.css\" /><script type=\"text/javascript\">var z = ＀; var tile_size = ＀; var maxx = ＀; var maxy = ＀;</script><script type=\"text/javascript\" src=\"crewmonitor.js\"></script>", [live(z), rt.fv(f, "icon_size", rt.world()), rt.fv(f, "maxx", rt.world()), rt.fv(f, "maxy", rt.world())])])));
		yield* g.callName(f, (hi = rt.index(rt.fv(f, "interfaces", live(f.src)), fmt("＀", [live(z)]))), "updateContent", ["content", "<div id=\"minimap\"><a href=\"javascript:zoomIn();\" class=\"zoom in\">+</a><a href=\"javascript:zoomOut();\" class=\"zoom\">-</a></div><div id=\"textbased\"></div>"]);
		yield* g.callName(f, live(f.src), "update", [live(z), 1]);
	} else {
		hi = rt.index(rt.fv(f, "interfaces", live(f.src)), fmt("＀", [live(z)]));
		yield* g.callName(f, live(f.src), "update", [live(z), 1]);
	}
	rt.op(f, "BrowseResource", [], [live(mob), (yield* g.call(f, P("/proc/file"), null, ["code/game/machinery/computer/crew.js"])), "crew.js"], false);
	rt.op(f, "BrowseResource", [], [live(mob), (yield* g.call(f, P("/proc/file"), null, ["code/game/machinery/computer/crew.css"])), "crew.css"], false);
	yield* g.callName(f, (hi = rt.index(rt.fv(f, "interfaces", live(f.src)), fmt("＀", [live(z)]))), "show", [live(mob)]);
	yield* g.callName(f, live(f.src), "updateFor", [live(mob), live(hi), live(z)]);
	return f.dot;
}, true);

// /datum/crewmonitor/proc/updateFor  (code/game/machinery/computer/crew.dm:121)  may sleep
rt.def("/datum/crewmonitor/proc/updateFor", function* updateFor(f: Frame, hclient_or_mob: Value, hi: Value, z: Value) {
	let L: Value = null;
	let $e: any;
	f.vars = () => [hclient_or_mob, hi, z, L, $e];
	yield* g.callName(f, live(hi), "callJavaScript", ["clearAll", null, live(hclient_or_mob)]);
	L = null;
	rt.forList(f, 0, rt.sv(f, "data"), T("/list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		yield* g.callName(f, live(hi), "callJavaScript", ["add", live(L), live(hclient_or_mob)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(hi), "callJavaScript", ["onAfterUpdate", null, live(hclient_or_mob)]);
	return f.dot;
}, true);

// /datum/crewmonitor/proc/update  (code/game/machinery/computer/crew.dm:129)  may sleep
rt.def("/datum/crewmonitor/proc/update", function* update(f: Frame, z: Value, ignore_unused: Value) {
	let hi: Value = null, results: Value = null, U: Value = null, I: Value = null, pos: Value = null, ijob: Value = null, name: Value = null, assignment: Value = null, dam1: Value = null, dam2: Value = null, dam3: Value = null, dam4: Value = null, area: Value = null, pos_x: Value = null, pos_y: Value = null, life_status: Value = null, H: Value = null, player_area: Value = null;
	let $0: any, $e: any;
	f.vars = () => [z, ignore_unused, hi, results, U, I, pos, ijob, name, assignment, dam1, dam2, dam3, dam4, area, pos_x, pos_y, life_status, H, player_area, $0, $e];
	if (live(ignore_unused) === null) {
		ignore_unused = 0;
	}
	if (!truthy(rt.index(rt.fv(f, "interfaces", live(f.src)), fmt("＀", [live(z)])))) return f.dot;
	hi = rt.index(rt.fv(f, "interfaces", live(f.src)), fmt("＀", [live(z)]));
	if (!(truthy(live(ignore_unused)) || truthy((yield* g.callName(f, live(hi), "isUsed", []))))) return f.dot;
	results = rt.list();
	U = null;
	I = null;
	pos = null;
	ijob = null;
	name = null;
	assignment = null;
	dam1 = null;
	dam2 = null;
	dam3 = null;
	dam4 = null;
	area = null;
	pos_x = null;
	pos_y = null;
	life_status = null;
	H = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (((isEqual(rt.fv(f, "z", live(H)), 0) || isEqual(rt.fv(f, "z", live(H)), live(z))) && truthy((rt.istype(rt.fv(f, "w_uniform", live(H)), T("/obj/item/clothing/under")) ? 1 : 0)))) {
			if ((rt.gt(rt.gv(f, "has_sensor", (U = rt.fv(f, "w_uniform", live(H)))), 0) && truthy(rt.fv(f, "sensor_mode", live(U))))) {
				if ((isEqual(rt.fv(f, "z", live(H)), 0) || isEqual(rt.fv(f, "sensor_mode", live(U)), 3))) {
					$0 = rt.getStep(f, live(H), 0);
				} else {
					$0 = null;
				}
				pos = $0;
				if ((isEqual(rt.fv(f, "z", live(H)), 0) && (!truthy(live(pos)) || !isEqual(rt.fv(f, "z", live(pos)), live(z))))) {
					continue;
				}
				if (truthy(rt.fv(f, "wear_id", live(H)))) {
					$0 = (yield* g.callName(f, rt.fv(f, "wear_id", live(H)), "GetID", []));
				} else {
					$0 = null;
				}
				if (truthy((I = $0))) {
					name = rt.fv(f, "registered_name", live(I));
					assignment = rt.fv(f, "assignment", live(I));
					ijob = rt.index(rt.sv(f, "jobs"), rt.fv(f, "assignment", live(I)));
				} else {
					name = "<i>Unknown</i>";
					assignment = "";
					ijob = 80;
				}
				if (rt.ge(rt.fv(f, "sensor_mode", live(U)), 1)) {
					if (!truthy(rt.fv(f, "stat", live(H)))) {
						$0 = "true";
					} else {
						$0 = "false";
					}
					life_status = $0;
				} else {
					life_status = null;
				}
				if (rt.ge(rt.fv(f, "sensor_mode", live(U)), 2)) {
					dam1 = (yield* g.call(f, P("/proc/round"), null, [(yield* g.callName(f, live(H), "getOxyLoss", [])), 1]));
					dam2 = (yield* g.call(f, P("/proc/round"), null, [(yield* g.callName(f, live(H), "getToxLoss", [])), 1]));
					dam3 = (yield* g.call(f, P("/proc/round"), null, [(yield* g.callName(f, live(H), "getFireLoss", [])), 1]));
					dam4 = (yield* g.call(f, P("/proc/round"), null, [(yield* g.callName(f, live(H), "getBruteLoss", [])), 1]));
				} else {
					dam1 = null;
					dam2 = null;
					dam3 = null;
					dam4 = null;
				}
				if (rt.ge(rt.fv(f, "sensor_mode", live(U)), 3)) {
					if (!truthy(live(pos))) {
						pos = rt.getStep(f, live(H), 0);
					}
					area = (yield* g.call(f, P("/proc/format_text"), null, [rt.gv(f, "name", (player_area = (yield* g.call(f, P("/proc/get_area"), null, [live(H)]))))]));
					pos_x = rt.fv(f, "x", live(pos));
					pos_y = rt.fv(f, "y", live(pos));
				} else {
					area = null;
					pos_x = null;
					pos_y = null;
				}
				rt.setAt(live(results), rt.incField(f, live(results), "len", 1, false), rt.list(live(name), live(assignment), live(ijob), live(life_status), live(dam1), live(dam2), live(dam3), live(dam4), live(area), live(pos_x), live(pos_y), (yield* g.callName(f, live(H), "can_track", [null]))));
			}
		}
	}
	rt.endFor(f, 0);
	rt.setFv(f, "data", live(f.src), live(results));
	yield* g.callName(f, live(f.src), "updateFor", [null, live(hi), live(z)]);
	return f.dot;
}, true);

// /datum/crewmonitor/proc/hiIsValidClient  (code/game/machinery/computer/crew.dm:205)
rt.def("/datum/crewmonitor/proc/hiIsValidClient", function hiIsValidClient(f: Frame, hclient: Value, hi: Value) {
	let z: Value = null;
	let $e: any;
	f.vars = () => [z, $e];
	z = "";
	rt.forList(f, 0, rt.fv(f, "interfaces", live(f.src)));
	while (($e = rt.next(f, 0)) !== undefined) {
		z = $e;
		if (isEqual(rt.index(rt.fv(f, "interfaces", live(f.src)), live(z)), live(hi))) {
			break;
		}
	}
	rt.endFor(f, 0);
	if ((truthy(rt.gv(f, "mob", rt.fv(f, "client", live(hclient)))) && truthy(rt.call(f, P("/proc/IsAdminGhost"), null, [rt.gv(f, "mob", rt.fv(f, "client", live(hclient)))])))) {
		return 1;
	}
	if (((truthy(rt.gv(f, "mob", rt.fv(f, "client", live(hclient)))) && isEqual(rt.gv(f, "stat", rt.gv(f, "mob", rt.fv(f, "client", live(hclient)))), 0)) && isEqual(rt.gv(f, "z", rt.gv(f, "mob", rt.fv(f, "client", live(hclient)))), rt.call(f, P("/proc/text2num"), null, [live(z)])))) {
		if (truthy((rt.istype(rt.gv(f, "mob", rt.fv(f, "client", live(hclient))), T("/mob/living/silicon/ai")) ? 1 : 0))) {
			return 1;
		} else {
			if (truthy((rt.istype(rt.gv(f, "mob", rt.fv(f, "client", live(hclient))), T("/mob/living/silicon/robot")) ? 1 : 0))) {
				return (rt.locateIn(f, T("/obj/machinery/computer/crew"), rt.call(f, P("/proc/range"), null, [rt.fv(f, "view", rt.world()), rt.gv(f, "mob", rt.fv(f, "client", live(hclient)))])) || rt.locateIn(f, T("/obj/item/device/sensor_device"), rt.gv(f, "contents", rt.gv(f, "mob", rt.fv(f, "client", live(hclient))))));
			}
			return (rt.locateIn(f, T("/obj/machinery/computer/crew"), rt.call(f, P("/proc/range"), null, [1, rt.gv(f, "mob", rt.fv(f, "client", live(hclient)))])) || rt.locateIn(f, T("/obj/item/device/sensor_device"), rt.gv(f, "contents", rt.gv(f, "mob", rt.fv(f, "client", live(hclient))))));
		}
	} else {
		return 0;
	}
	return f.dot;
});

// /datum/crewmonitor/proc/Topic  (code/game/machinery/computer/crew.dm:223)  may sleep
rt.def("/datum/crewmonitor/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value, hclient: Value) {
	let AI: Value = null, x: Value = null, y: Value = null, tile: Value = null, C: Value = null;
	let $0: any;
	f.vars = () => [href, href_list, hclient, AI, x, y, tile, C, $0];
	if (!truthy((rt.istype(live(hclient), T("/datum/html_interface_client")) ? 1 : 0))) return f.dot;
	if (!(((truthy(live(hclient)) && truthy(rt.fv(f, "client", live(hclient)))) && truthy(rt.gv(f, "mob", rt.fv(f, "client", live(hclient))))) && truthy((rt.istype(rt.gv(f, "mob", rt.fv(f, "client", live(hclient))), T("/mob/living/silicon/ai")) ? 1 : 0)))) return f.dot;
	AI = rt.gv(f, "mob", rt.fv(f, "client", live(hclient)));
	$0 = rt.at(live(href_list), "action");
	if ($0 === "select_person") {
		yield* g.callName(f, live(AI), "ai_camera_track", [rt.at(live(href_list), "name")]);
	} else if ($0 === "select_position") {
		x = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "x")]));
		y = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "y")]));
		tile = rt.locate(live(x), live(y), rt.fv(f, "z", live(AI)));
		if (!truthy((C = rt.locateIn(f, T("/obj/machinery/camera"), (yield* g.call(f, P("/proc/range"), null, [5, live(tile)])))))) {
			C = rt.locateIn(f, T("/obj/machinery/camera"), (yield* g.call(f, P("/proc/urange"), null, [10, live(tile)])));
		}
		if (!truthy(live(C))) {
			C = rt.locateIn(f, T("/obj/machinery/camera"), (yield* g.call(f, P("/proc/urange"), null, [15, live(tile)])));
		}
		if (!truthy(live(C))) return f.dot;
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/crewmonitor/proc/update_ai"), live(AI), live(C), rt.gv(f, "loc", rt.fv(f, "eyeobj", live(AI)))])), (yield* g.call(f, P("/proc/min"), null, [30, divide((yield* g.call(f, P("/proc/get_dist"), null, [rt.getStep(f, live(C), 0), rt.fv(f, "eyeobj", live(AI))])), 4)]))]);
	}
	return f.dot;
}, true);

// /datum/crewmonitor/proc/update_ai  (code/game/machinery/computer/crew.dm:245)  may sleep
rt.def("/datum/crewmonitor/proc/update_ai", function* update_ai(f: Frame, AI: Value, C: Value, current_loc: Value) {
	f.vars = () => [AI, C, current_loc];
	if (!((truthy(live(AI)) && truthy(rt.fv(f, "eyeobj", live(AI)))) && isEqual(live(current_loc), rt.gv(f, "loc", rt.fv(f, "eyeobj", live(AI)))))) return f.dot;
	yield* g.callName(f, live(AI), "switchCamera", [live(C)]);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/silicon/ai" }, { type: 4, path: "/obj/machinery/camera" }, { path: "/turf" }] });

// /mob/living/carbon/human/proc/Move  (code/game/machinery/computer/crew.dm:249)  may sleep
rt.def("/mob/living/carbon/human/proc/Move", function* Move(f: Frame) {
	let old_z: Value = null;
	f.vars = () => [old_z];
	if (truthy(rt.fv(f, "w_uniform", live(f.src)))) {
		old_z = rt.fv(f, "z", live(f.src));
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
		if (!isEqual(live(old_z), rt.fv(f, "z", live(f.src)))) {
			yield* g.callName(f, rt.gl("crewmonitor"), "queueUpdate", [live(old_z)]);
		}
		yield* g.callName(f, rt.gl("crewmonitor"), "queueUpdate", [rt.fv(f, "z", live(f.src))]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true);

// /datum/crewmonitor/proc/queueUpdate  (code/game/machinery/computer/crew.dm:260)  may sleep
rt.def("/datum/crewmonitor/proc/queueUpdate", function* queueUpdate(f: Frame, z: Value) {
	f.vars = () => [z];
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/crewmonitor/proc/update"), live(z)])), 5, 1]);
	return f.dot;
}, true);

// /datum/crewmonitor/proc/sendResources  (code/game/machinery/computer/crew.dm:263)  may sleep
rt.def("/datum/crewmonitor/proc/sendResources", function* sendResources(f: Frame, client: Value) {
	f.vars = () => [client];
	yield* g.call(f, P("/proc/send_asset"), null, [live(client), "crewmonitor.js"]);
	yield* g.call(f, P("/proc/send_asset"), null, [live(client), "crewmonitor.css"]);
	yield* g.callName(f, rt.gl("SSminimap"), "send", [live(client)]);
	return f.dot;
}, true);
