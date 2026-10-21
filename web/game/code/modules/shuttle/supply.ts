// From code/modules/shuttle/supply.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalblacklisted_cargo_types  (code/modules/shuttle/supply.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalblacklisted_cargo_types", function InitGlobalblacklisted_cargo_types(f: Frame) {
	rt.setGl("blacklisted_cargo_types", rt.call(f, P("/proc/typecacheof"), null, [rt.list(T("/mob/living"), T("/obj/structure/blob"), T("/obj/effect/rune"), T("/obj/structure/spider/spiderling"), T("/obj/item/weapon/disk/nuclear"), T("/obj/machinery/nuclearbomb"), T("/obj/item/device/radio/beacon"), T("/obj/singularity"), T("/obj/machinery/teleport/station"), T("/obj/machinery/teleport/hub"), T("/obj/machinery/quantumpad"), T("/obj/machinery/clonepod"), T("/obj/effect/mob_spawn"), T("/obj/effect/hierophant"), T("/obj/structure/recieving_pad"), T("/obj/effect/clockwork/spatial_gateway"), T("/obj/structure/destructible/clockwork/powered/clockwork_obelisk"), T("/obj/item/device/warp_cube"))]));
	rt.modSrcVar(f, "gvars_datum_init_order", "blacklisted_cargo_types", add);
	return f.dot;
});

rt.type(13052, "/obj/docking_port/mobile/supply", "/obj/docking_port/mobile", {
	contraband: 0,
	emagged: 0,
	callTime: 600,
	port_angle: 90,
	roundstart_move: "supply_away",
	name: "supply shuttle",
	id: "supply",
	dir: 8,
	width: 12,
	dwidth: 5,
	height: 7,
});

// /obj/docking_port/mobile/supply/proc/register  (code/modules/shuttle/supply.dm:39)
rt.def("/obj/docking_port/mobile/supply/proc/register", function register(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "supply", rt.gl("SSshuttle"), live(f.src));
	return f.dot;
});

// /obj/docking_port/mobile/supply/proc/canMove  (code/modules/shuttle/supply.dm:43)
rt.def("/obj/docking_port/mobile/supply/proc/canMove", function canMove(f: Frame) {
	if (isEqual(rt.sv(f, "z"), 2)) {
		return rt.callSrc(f, "check_blacklist", [rt.sv(f, "areaInstance")]);
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /obj/docking_port/mobile/supply/proc/check_blacklist  (code/modules/shuttle/supply.dm:48)
rt.def("/obj/docking_port/mobile/supply/proc/check_blacklist", function check_blacklist(f: Frame, areaInstance: Value) {
	let trf: Value = null, _T: Value = null, a: Value = null;
	let $e: any;
	f.vars = () => [trf, _T, a, $e];
	trf = null;
	rt.forList(f, 0, live(areaInstance));
	while (($e = rt.next(f, 0)) !== undefined) {
		trf = $e;
		_T = live(trf);
		a = null;
		rt.forList(f, 1, rt.callName(f, live(_T), "GetAllContents", []));
		while (($e = rt.next(f, 1)) !== undefined) {
			a = $e;
			if (truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(a), rt.gl("blacklisted_cargo_types")]))) {
				return 0;
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return 1;
});

// /obj/docking_port/mobile/supply/proc/request  (code/modules/shuttle/supply.dm:56)
rt.def("/obj/docking_port/mobile/supply/proc/request", function request(f: Frame) {
	if (!isEqual(rt.sv(f, "mode"), "idle")) {
		return 2;
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /obj/docking_port/mobile/supply/proc/dock  (code/modules/shuttle/supply.dm:61)  may sleep
rt.def("/obj/docking_port/mobile/supply/proc/dock", function* dock(f: Frame) {
	if (isEqual((yield* g.srcCall(f, "getDockedId")), "supply_away")) {
		yield* g.srcCall(f, "buy");
	}
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!isEqual((yield* g.srcCall(f, "getDockedId")), "supply_away")) return f.dot;
	yield* g.srcCall(f, "sell");
	return f.dot;
}, true);

// /obj/docking_port/mobile/supply/proc/buy  (code/modules/shuttle/supply.dm:69)  may sleep
rt.def("/obj/docking_port/mobile/supply/proc/buy", function* buy(f: Frame) {
	let empty_turfs: Value = null, _T: Value = null, value: Value = null, purchases: Value = null, SO: Value = null;
	let $e: any;
	f.vars = () => [empty_turfs, _T, value, purchases, SO, $e];
	if (!truthy(rt.getLen(f, rt.fv(f, "shoppinglist", rt.gl("SSshuttle"))))) {
		return live(f.dot);
	}
	empty_turfs = rt.list();
	_T = null;
	rt.forList(f, 0, rt.sv(f, "areaInstance"), T("/turf/open/floor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [live(_T)])))) {
			continue;
		}
		empty_turfs = rt.modify(live(empty_turfs), live(_T), add);
	}
	rt.endFor(f, 0);
	value = 0;
	purchases = 0;
	SO = null;
	rt.forList(f, 0, rt.fv(f, "shoppinglist", rt.gl("SSshuttle")), T("/datum/supply_order"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SO = $e;
		if (!truthy(rt.len(f, live(empty_turfs)))) {
			break;
		}
		if (rt.gt(rt.gv(f, "cost", rt.fv(f, "pack", live(SO))), rt.fv(f, "points", rt.gl("SSshuttle")))) {
			continue;
		}
		(rt.modField(f, rt.gl("SSshuttle"), "points", rt.gv(f, "cost", rt.fv(f, "pack", live(SO))), subtract));
		value = rt.modify(live(value), rt.gv(f, "cost", rt.fv(f, "pack", live(SO))), add);
		(rt.modField(f, rt.gl("SSshuttle"), "shoppinglist", live(SO), subtract));
		rt.modField(f, rt.gl("SSshuttle"), "orderhistory", live(SO), add);
		yield* g.callName(f, live(SO), "generate", [(yield* g.call(f, P("/proc/pick_n_take"), null, [live(empty_turfs)]))]);
		yield* g.srcCall(f, "investigate_log", fmt("Order #＀ (＀, placed by ＀) has shipped.", [rt.fv(f, "id", live(SO)), rt.gv(f, "name", rt.fv(f, "pack", live(SO))), (yield* g.call(f, P("/proc/key_name"), null, [rt.fv(f, "orderer_ckey", live(SO))]))]), "cargo");
		if (truthy(rt.gv(f, "dangerous", rt.fv(f, "pack", live(SO))))) {
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＆！ ordered by ＀ has shipped.", [rt.gv(f, "name", rt.fv(f, "pack", live(SO))), (yield* g.call(f, P("/proc/key_name_admin"), null, [rt.fv(f, "orderer_ckey", live(SO))]))])]);
		}
		purchases = rt.inc(live(purchases), 1);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "investigate_log", fmt("＀ orders in this shipment, worth ＀ credits. ＀ credits left.", [live(purchases), live(value), rt.fv(f, "points", rt.gl("SSshuttle"))]), "cargo");
	return f.dot;
}, true);

// /obj/docking_port/mobile/supply/proc/sell  (code/modules/shuttle/supply.dm:104)  may sleep
rt.def("/obj/docking_port/mobile/supply/proc/sell", function* sell(f: Frame) {
	let presale_points: Value = null, msg: Value = null, sold_atoms: Value = null, AM: Value = null, a: Value = null, E: Value = null, export_text: Value = null;
	let $e: any;
	f.vars = () => [presale_points, msg, sold_atoms, AM, a, E, export_text, $e];
	presale_points = rt.fv(f, "points", rt.gl("SSshuttle"));
	if (!truthy(rt.len(f, rt.gl("exports_list")))) {
		yield* g.call(f, P("/proc/setupExports"), null, []);
	}
	msg = "";
	sold_atoms = "";
	AM = null;
	rt.forList(f, 0, rt.sv(f, "areaInstance"), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		if ((truthy(rt.fv(f, "anchored", live(AM))) && !truthy((rt.istype(live(AM), T("/obj/mecha")) ? 1 : 0)))) {
			continue;
		}
		sold_atoms = rt.modify(live(sold_atoms), (yield* g.call(f, P("/proc/export_item_and_contents"), null, [null, live(AM), null, rt.sv(f, "contraband"), null, rt.sv(f, "emagged"), "dry_run", 0], rt.Args.Named)), add);
	}
	rt.endFor(f, 0);
	if (truthy(live(sold_atoms))) {
		sold_atoms = rt.modify(live(sold_atoms), ".", add);
	}
	a = null;
	rt.forList(f, 0, rt.gl("exports_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		a = $e;
		E = live(a);
		if (!truthy((export_text = (yield* g.callName(f, live(E), "total_printout", []))))) {
			continue;
		}
		msg = rt.modify(live(msg), add(live(export_text), "\n"), add);
		rt.modField(f, rt.gl("SSshuttle"), "points", rt.fv(f, "total_cost", live(E)), add);
		yield* g.callName(f, live(E), "export_end", []);
	}
	rt.endFor(f, 0);
	rt.setFv(f, "centcom_message", rt.gl("SSshuttle"), live(msg));
	yield* g.srcCall(f, "investigate_log", fmt("Shuttle contents sold for ＀ credits. Contents: ＀ Message: ＀", [subtract(rt.fv(f, "points", rt.gl("SSshuttle")), live(presale_points)), (live(sold_atoms) || "none."), (rt.fv(f, "centcom_message", rt.gl("SSshuttle")) || "none.")]), "cargo");
	return f.dot;
}, true);
