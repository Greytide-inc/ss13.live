// From code/game/machinery/gulag_teleporter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10795, "/obj/machinery/gulag_teleporter", "/obj/machinery", {
	locked: 0,
	jumpsuit_type: rt.typePath("/obj/item/clothing/under/rank/prisoner"),
	shoes_type: rt.typePath("/obj/item/clothing/shoes/sneakers/orange"),
	linked_reclaimer: null,
	required_items: null,
	anchored: 1,
	name: "labor camp teleporter",
	desc: "A bluespace teleporter used for teleporting prisoners to the labor camp.",
	icon: rt.rsc("icons/obj/machines/implantchair.dmi"),
	icon_state: "implantchair",
	state_open: 0,
	density: 1,
	use_power: 1,
	idle_power_usage: 200,
	active_power_usage: 5000,
});

// /obj/machinery/gulag_teleporter/proc/New  (code/game/machinery/gulag_teleporter.dm:27)  may sleep
rt.def("/obj/machinery/gulag_teleporter/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "required_items", (yield* g.call(f, P("/proc/typecacheof"), null, [rt.list(T("/obj/item/weapon/implant"), T("/obj/item/clothing/suit/space/eva/plasmaman"), T("/obj/item/clothing/under/plasmaman"), T("/obj/item/clothing/head/helmet/space/plasmaman"), T("/obj/item/weapon/tank/internals"), T("/obj/item/clothing/mask/breath"), T("/obj/item/clothing/mask/gas"))])));
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/gulag_teleporter"), [null]))), "apply_default_parts", [live(f.src)]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/gulag_teleporter/proc/locate_reclaimer")])), 5]);
	return f.dot;
}, true);

// /obj/machinery/gulag_teleporter/proc/Destroy  (code/game/machinery/gulag_teleporter.dm:42)  may sleep
rt.def("/obj/machinery/gulag_teleporter/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "linked_reclaimer"))) {
		rt.setFv(f, "linked_teleporter", rt.sv(f, "linked_reclaimer"), null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/gulag_teleporter/proc/power_change  (code/game/machinery/gulag_teleporter.dm:46)
rt.def("/obj/machinery/gulag_teleporter/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/gulag_teleporter/proc/interact  (code/game/machinery/gulag_teleporter.dm:52)  may sleep
rt.def("/obj/machinery/gulag_teleporter/proc/interact", function* interact(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "locked"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ is locked.", [live(f.src)])]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "toggle_open");
	return f.dot;
}, true);

// /obj/machinery/gulag_teleporter/proc/attackby  (code/game/machinery/gulag_teleporter.dm:60)  may sleep
rt.def("/obj/machinery/gulag_teleporter/proc/attackby", function* attackby(f: Frame) {
	if ((!truthy(rt.sv(f, "occupant")) && truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), fmt("＀", [rt.sv(f, "icon_state")]), fmt("＀", [rt.sv(f, "icon_state")]), live(f.args[0])))))) {
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_pry_open", live(f.args[0]))))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user"] });

// /obj/machinery/gulag_teleporter/proc/update_icon  (code/game/machinery/gulag_teleporter.dm:73)
rt.def("/obj/machinery/gulag_teleporter/proc/update_icon", function update_icon(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	$0 = rt.initial(f, live(f.src), "icon_state");
	if (truthy(rt.sv(f, "state_open"))) {
		$1 = "_open";
	} else {
		$1 = "";
	}
	rt.setSv(f, "icon_state", add($0, $1));
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		rt.modSrcVar(f, "icon_state", "_unpowered", add);
		if ((truthy(rt.bitAnd(rt.sv(f, "stat"), 8)) || truthy(rt.sv(f, "panel_open")))) {
			rt.modSrcVar(f, "icon_state", "_maintenance", add);
		}
		return live(f.dot);
	}
	if ((truthy(rt.bitAnd(rt.sv(f, "stat"), 8)) || truthy(rt.sv(f, "panel_open")))) {
		rt.modSrcVar(f, "icon_state", "_maintenance", add);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "occupant"))) return f.dot;
	rt.modSrcVar(f, "icon_state", "_occupied", add);
	return live(f.dot);
});

// /obj/machinery/gulag_teleporter/proc/relaymove  (code/game/machinery/gulag_teleporter.dm:92)  may sleep
rt.def("/obj/machinery/gulag_teleporter/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!isEqual(rt.fv(f, "stat", live(user)), 0)) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "locked"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ is locked!", [live(f.src)])]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "open_machine");
	return f.dot;
}, true);

// /obj/machinery/gulag_teleporter/proc/container_resist  (code/game/machinery/gulag_teleporter.dm:101)  may sleep
rt.def("/obj/machinery/gulag_teleporter/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	let breakout_time: Value = null;
	f.vars = () => [user, breakout_time];
	breakout_time = 600;
	if (!truthy(rt.sv(f, "locked"))) {
		yield* g.srcCall(f, "open_machine");
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "changeNext_move", [100]);
	rt.setFv(f, "last_special", live(user), add(rt.worldTime(f), 100));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You lean on the back of ＀ and start pushing the door open... (this will take about a minute.)</span>", [live(f.src)])]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='italics'>You hear a metallic creaking from ＀!</span>", [live(f.src)])]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, live(breakout_time), "target", live(f.src)], rt.Args.Named)))) return f.dot;
	if (((((!truthy(live(user)) || !isEqual(rt.fv(f, "stat", live(user)), 0)) || !isEqual(rt.fv(f, "loc", live(user)), live(f.src))) || truthy(rt.sv(f, "state_open"))) || !truthy(rt.sv(f, "locked")))) {
		return live(f.dot);
	}
	rt.setSv(f, "locked", 0);
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ successfully broke out of ＀!</span>", [live(user), live(f.src)]));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You successfully break out of ＀!</span>", [live(f.src)])]);
	yield* g.srcCall(f, "open_machine");
	return f.dot;
}, true);

// /obj/machinery/gulag_teleporter/proc/locate_reclaimer  (code/game/machinery/gulag_teleporter.dm:120)
rt.def("/obj/machinery/gulag_teleporter/proc/locate_reclaimer", function locate_reclaimer(f: Frame) {
	rt.setSv(f, "linked_reclaimer", rt.locateIn(f, T("/obj/machinery/gulag_item_reclaimer"), rt.world()));
	if (!truthy(rt.sv(f, "linked_reclaimer"))) return f.dot;
	rt.setFv(f, "linked_teleporter", rt.sv(f, "linked_reclaimer"), live(f.src));
	return f.dot;
});

// /obj/machinery/gulag_teleporter/proc/toggle_open  (code/game/machinery/gulag_teleporter.dm:126)  may sleep
rt.def("/obj/machinery/gulag_teleporter/proc/toggle_open", function* toggle_open(f: Frame) {
	if (truthy(rt.sv(f, "panel_open"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Close the maintenance panel first.</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "state_open"))) {
		yield* g.srcCall(f, "close_machine");
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "locked"))) return f.dot;
	yield* g.srcCall(f, "open_machine");
	return f.dot;
}, true);

// /obj/machinery/gulag_teleporter/proc/strip_occupant  (code/game/machinery/gulag_teleporter.dm:138)  may sleep
rt.def("/obj/machinery/gulag_teleporter/proc/strip_occupant", function* strip_occupant(f: Frame) {
	let mob_occupant: Value = null, W: Value = null;
	let $e: any;
	f.vars = () => [mob_occupant, W, $e];
	if (truthy(rt.sv(f, "linked_reclaimer"))) {
		rt.setAt(rt.fv(f, "stored_items", rt.sv(f, "linked_reclaimer")), rt.sv(f, "occupant"), rt.list());
	}
	mob_occupant = rt.sv(f, "occupant");
	W = null;
	rt.forList(f, 0, live(mob_occupant), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		if ((!truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(W), rt.sv(f, "required_items")]))) && truthy((yield* g.callName(f, live(mob_occupant), "temporarilyRemoveItemFromInventory", [live(W)]))))) {
			if (truthy((rt.istype(live(W), T("/obj/item/weapon/restraints/handcuffs")) ? 1 : 0))) {
				yield* g.callName(f, live(W), "forceMove", [rt.getStep(f, live(f.src), 0)]);
				continue;
			}
			if (truthy(rt.sv(f, "linked_reclaimer"))) {
				rt.modAt(rt.fv(f, "stored_items", rt.sv(f, "linked_reclaimer")), live(mob_occupant), live(W), add);
				rt.modField(f, rt.sv(f, "linked_reclaimer"), "contents", live(W), add);
				yield* g.callName(f, live(W), "forceMove", [rt.sv(f, "linked_reclaimer")]);
			} else {
				yield* g.callName(f, live(W), "forceMove", [live(f.src)]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/gulag_teleporter/proc/handle_prisoner  (code/game/machinery/gulag_teleporter.dm:153)  may sleep
rt.def("/obj/machinery/gulag_teleporter/proc/handle_prisoner", function* handle_prisoner(f: Frame, id: Value, R: Value) {
	let prisoner: Value = null;
	f.vars = () => [id, R, prisoner];
	if (!truthy((rt.istype(rt.sv(f, "occupant"), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "strip_occupant");
	if ((!truthy((yield* g.call(f, P("/proc/is_species"), null, [(prisoner = rt.sv(f, "occupant")), T("/datum/species/plasmaman")]))) && truthy(rt.sv(f, "jumpsuit_type")))) {
		yield* g.callName(f, live(prisoner), "equip_to_appropriate_slot", [(yield* g.new_(f, rt.sv(f, "jumpsuit_type"), []))]);
	}
	if (truthy(rt.sv(f, "shoes_type"))) {
		yield* g.callName(f, live(prisoner), "equip_to_appropriate_slot", [(yield* g.new_(f, rt.sv(f, "shoes_type"), []))]);
	}
	if (truthy(live(id))) {
		yield* g.callName(f, live(prisoner), "equip_to_appropriate_slot", [live(id)]);
	}
	if (!truthy(live(R))) return f.dot;
	rt.setAt(rt.fv(f, "fields", live(R)), "criminal", "Incarcerated");
	return f.dot;
}, true);

rt.type(6721, "/obj/item/weapon/circuitboard/machine/gulag_teleporter", "/obj/item/weapon/circuitboard/machine", {
	name: "labor camp teleporter (Machine Board)",
	build_path: rt.typePath("/obj/machinery/gulag_teleporter"),
	origin_tech: "programming=3;engineering=4;bluespace=4;materials=4",
	req_components: null,
	def_components: null,
});

// /obj/item/weapon/circuitboard/machine/gulag_teleporter/proc/<init>  (code/game/machinery/gulag_teleporter.dm:170)
rt.def("/obj/item/weapon/circuitboard/machine/gulag_teleporter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/ore/bluespace_crystal"), 2, null, T("/obj/item/weapon/stock_parts/scanning_module"), null, T("/obj/item/weapon/stock_parts/manipulator")]));
	$0 = $0;
	rt.setSv(f, "def_components", rt.alist(f, [T("/obj/item/weapon/ore/bluespace_crystal"), T("/obj/item/weapon/ore/bluespace_crystal/artificial")]));
	return f.dot;
});
