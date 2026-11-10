// Based on /tg/station's code/modules/shuttle/supply.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// supply.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalblacklisted_cargo_types", function InitGlobalblacklisted_cargo_types(f: Frame) {
	GLOB.blacklisted_cargo_types = typecacheof(list(T("/mob/living"), T("/obj/structure/blob"), T("/obj/effect/rune"), T("/obj/structure/spider/spiderling"), T("/obj/item/weapon/disk/nuclear"), T("/obj/machinery/nuclearbomb"), T("/obj/item/device/radio/beacon"), T("/obj/singularity"), T("/obj/machinery/teleport/station"), T("/obj/machinery/teleport/hub"), T("/obj/machinery/quantumpad"), T("/obj/machinery/clonepod"), T("/obj/effect/mob_spawn"), T("/obj/effect/hierophant"), T("/obj/structure/recieving_pad"), T("/obj/effect/clockwork/spatial_gateway"), T("/obj/structure/destructible/clockwork/powered/clockwork_obelisk"), T("/obj/item/device/warp_cube")));
	this.gvars_datum_init_order += "blacklisted_cargo_types";
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

// supply.dm:39
rt.def("/obj/docking_port/mobile/supply/proc/register", function register(f: Frame) {
	f.dot = parent_proc();
	GLOB.SSshuttle.supply = this;
	return f.dot;
});

// supply.dm:43
rt.def("/obj/docking_port/mobile/supply/proc/canMove", function canMove(f: Frame) {
	if (this.z == ZLEVEL_STATION) {
		return this.check_blacklist(this.areaInstance);
	}
	return parent_proc();
});

// supply.dm:48
rt.def("/obj/docking_port/mobile/supply/proc/check_blacklist", function check_blacklist(f: Frame, areaInstance: Value) {
	let trf: Value = null, _T: Value = null, a: Value = null;
	for (trf of each(areaInstance)) {
		_T = trf;
		a = null;
		for (a of each(_T.GetAllContents())) {
			if (is_type_in_typecache(a, GLOB.blacklisted_cargo_types)) {
				return 0;
			}
		}
	}
	return 1;
});

// supply.dm:56
rt.def("/obj/docking_port/mobile/supply/proc/request", function request(f: Frame) {
	if (this.mode != "idle") {
		return 2;
	}
	return parent_proc();
});

// supply.dm:61
rt.def("/obj/docking_port/mobile/supply/proc/dock", function* dock(f: Frame) {
	if (this.getDockedId() == "supply_away") {
		yield* this.buy();
	}
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (this.getDockedId() != "supply_away") return f.dot;
	yield* this.sell();
	return f.dot;
}, true);

// supply.dm:69
rt.def("/obj/docking_port/mobile/supply/proc/buy", function* buy(f: Frame) {
	let _T: Value = null, SO: Value = null;
	if (!rt.len(f, GLOB.SSshuttle.shoppinglist)) {
		return f.dot;
	}
	let empty_turfs: Value = list();
	for (_T of each(this.areaInstance, T("/turf/open/floor"))) {
		if (is_blocked_turf(_T)) {
			continue;
		}
		empty_turfs += _T;
	}
	let value: Value = 0;
	let purchases: Value = 0;
	for (SO of each(GLOB.SSshuttle.shoppinglist, T("/datum/supply_order"))) {
		if (!rt.len(f, empty_turfs)) {
			break;
		}
		if (SO.pack.cost > GLOB.SSshuttle.points) {
			continue;
		}
		GLOB.SSshuttle.points -= SO.pack.cost;
		value += SO.pack.cost;
		GLOB.SSshuttle.shoppinglist -= SO;
		GLOB.SSshuttle.orderhistory += SO;
		yield* SO.generate(pick_n_take(empty_turfs));
		this.investigate_log(`Order #${SO.id} (${SO.pack.name}, placed by ${key_name(SO.orderer_ckey)}) has shipped.`, "cargo");
		if (SO.pack.dangerous) {
			message_admins(fmt("＆！ ordered by ＀ has shipped.", [SO.pack.name, key_name_admin(SO.orderer_ckey)]));
		}
		purchases++;
	}
	this.investigate_log(`${purchases} orders in this shipment, worth ${value} credits. ${GLOB.SSshuttle.points} credits left.`, "cargo");
	return f.dot;
}, true);

// supply.dm:104
rt.def("/obj/docking_port/mobile/supply/proc/sell", function* sell(f: Frame) {
	let AM: Value = null, a: Value = null, E: Value = null, export_text: Value = null;
	let presale_points: Value = GLOB.SSshuttle.points;
	if (!rt.len(f, GLOB.exports_list)) {
		yield* setupExports();
	}
	let msg: Value = "";
	let sold_atoms: Value = "";
	for (AM of each(this.areaInstance, T("/atom/movable"))) {
		if (AM.anchored && !rt.istype(AM, T("/obj/mecha"))) {
			continue;
		}
		sold_atoms += (yield* export_item_and_contents(AM, this.contraband, this.emagged, { dry_run: 0 }));
	}
	if (sold_atoms) {
		sold_atoms += ".";
	}
	for (a of each(GLOB.exports_list)) {
		E = a;
		if (!(export_text = E.total_printout())) {
			continue;
		}
		msg += export_text + "\n";
		GLOB.SSshuttle.points += E.total_cost;
		E.export_end();
	}
	GLOB.SSshuttle.centcom_message = msg;
	this.investigate_log(`Shuttle contents sold for ${GLOB.SSshuttle.points - presale_points} credits. Contents: ${(sold_atoms || "none.")} Message: ${(GLOB.SSshuttle.centcom_message || "none.")}`, "cargo");
	return f.dot;
}, true);
