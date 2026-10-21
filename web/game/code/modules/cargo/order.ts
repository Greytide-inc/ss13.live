// From code/modules/cargo/order.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6605, "/obj/item/weapon/paper/manifest", "/obj/item/weapon/paper", {
	order_cost: 0,
	order_id: 0,
	errors: 0,
});

// /obj/item/weapon/paper/manifest/proc/New  (code/modules/cargo/order.dm:7)  may sleep
rt.def("/obj/item/weapon/paper/manifest/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "order_id", live(f.args[1]));
	rt.setSv(f, "order_cost", live(f.args[2]));
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		(rt.modSrcVar(f, "errors", 1, rt.bitOr));
	}
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		(rt.modSrcVar(f, "errors", 2, rt.bitOr));
	}
	if (!truthy(rt.op(f, "Prob", [], [5]))) return f.dot;
	(rt.modSrcVar(f, "errors", 4, rt.bitOr));
	return f.dot;
}, true, { args: ["A", "id", "cost"] });

// /obj/item/weapon/paper/manifest/proc/is_approved  (code/modules/cargo/order.dm:19)
rt.def("/obj/item/weapon/paper/manifest/proc/is_approved", function is_approved(f: Frame) {
	return ((rt.sv(f, "stamped") && rt.len(f, rt.sv(f, "stamped"))) && (!truthy(rt.callSrc(f, "is_denied", [])) ? 1 : 0));
});

// /obj/item/weapon/paper/manifest/proc/is_denied  (code/modules/cargo/order.dm:22)
rt.def("/obj/item/weapon/paper/manifest/proc/is_denied", function is_denied(f: Frame) {
	return (rt.sv(f, "stamped") && (rt.isIn(f, "stamp-deny", rt.sv(f, "stamped")) ? 1 : 0));
});

rt.type(2099, "/datum/supply_order", "/datum", {
	id: null,
	orderer: null,
	orderer_rank: null,
	orderer_ckey: null,
	reason: null,
	pack: null,
});

// /datum/supply_order/proc/New  (code/modules/cargo/order.dm:33)
rt.def("/datum/supply_order/proc/New", function New(f: Frame, pack: Value, orderer: Value, orderer_rank: Value, orderer_ckey: Value, reason: Value) {
	rt.setSv(f, "id", rt.incField(f, rt.gl("SSshuttle"), "ordernum", 1, true));
	rt.setFv(f, "pack", live(f.src), live(pack));
	rt.setFv(f, "orderer", live(f.src), live(orderer));
	rt.setFv(f, "orderer_rank", live(f.src), live(orderer_rank));
	rt.setFv(f, "orderer_ckey", live(f.src), live(orderer_ckey));
	rt.setFv(f, "reason", live(f.src), live(reason));
	return f.dot;
});

// /datum/supply_order/proc/generateRequisition  (code/modules/cargo/order.dm:41)  may sleep
rt.def("/datum/supply_order/proc/generateRequisition", function* generateRequisition(f: Frame, _T: Value) {
	let _P: Value = null;
	f.vars = () => [_T, _P];
	rt.setFv(f, "name", (_P = (yield* g.new_(f, T("/obj/item/weapon/paper"), [live(_T)]))), fmt("requisition form - #＀ (＀)", [rt.sv(f, "id"), rt.fv(f, "name", rt.sv(f, "pack"))]));
	rt.modField(f, live(_P), "info", fmt("<h2>＀ Supply Requisition</h2>", [(yield* g.call(f, P("/proc/station_name"), null, []))]), add);
	rt.modField(f, live(_P), "info", "<hr/>", add);
	rt.modField(f, live(_P), "info", fmt("Order #＀<br/>", [rt.sv(f, "id")]), add);
	rt.modField(f, live(_P), "info", fmt("Item: ＀<br/>", [rt.fv(f, "name", rt.sv(f, "pack"))]), add);
	rt.modField(f, live(_P), "info", fmt("Access Restrictions: ＀<br/>", [(yield* g.call(f, P("/proc/get_access_desc"), null, [rt.fv(f, "access", rt.sv(f, "pack"))]))]), add);
	rt.modField(f, live(_P), "info", fmt("Requested by: ＀<br/>", [rt.sv(f, "orderer")]), add);
	rt.modField(f, live(_P), "info", fmt("Rank: ＀<br/>", [rt.sv(f, "orderer_rank")]), add);
	rt.modField(f, live(_P), "info", fmt("Comment: ＀<br/>", [rt.sv(f, "reason")]), add);
	yield* g.callName(f, live(_P), "update_icon", []);
	return live(_P);
}, true);

// /datum/supply_order/proc/generateManifest  (code/modules/cargo/order.dm:57)  may sleep
rt.def("/datum/supply_order/proc/generateManifest", function* generateManifest(f: Frame, C: Value) {
	let _P: Value = null, station_name: Value = null, AM: Value = null;
	let $0: any, $e: any;
	f.vars = () => [C, _P, station_name, AM, $0, $e];
	_P = (yield* g.new_(f, T("/obj/item/weapon/paper/manifest"), [live(C), rt.sv(f, "id"), rt.fv(f, "cost", rt.sv(f, "pack"))]));
	if (truthy(rt.bitAnd(rt.fv(f, "errors", live(_P)), 1))) {
		$0 = (yield* g.call(f, P("/proc/new_station_name"), null, []));
	} else {
		$0 = (yield* g.call(f, P("/proc/station_name"), null, []));
	}
	station_name = $0;
	rt.setFv(f, "name", live(_P), fmt("shipping manifest - #＀ (＀)", [rt.sv(f, "id"), rt.fv(f, "name", rt.sv(f, "pack"))]));
	rt.modField(f, live(_P), "info", fmt("<h2>＀ Shipping Manifest</h2>", [(yield* g.call(f, P("/proc/command_name"), null, []))]), add);
	rt.modField(f, live(_P), "info", "<hr/>", add);
	rt.modField(f, live(_P), "info", fmt("Order #＀<br/>", [rt.sv(f, "id")]), add);
	rt.modField(f, live(_P), "info", fmt("Destination: ＀<br/>", [live(station_name)]), add);
	rt.modField(f, live(_P), "info", fmt("Item: ＀<br/>", [rt.fv(f, "name", rt.sv(f, "pack"))]), add);
	rt.modField(f, live(_P), "info", "Contents: <br/>", add);
	rt.modField(f, live(_P), "info", "<ul>", add);
	AM = null;
	rt.forList(f, 0, subtract(rt.fv(f, "contents", live(C)), live(_P)), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		if (truthy(rt.bitAnd(rt.fv(f, "errors", live(_P)), 2))) {
			if (truthy(rt.op(f, "Prob", [], [50]))) {
				rt.modField(f, live(_P), "info", fmt("<li>＀</li>", [rt.fv(f, "name", live(AM))]), add);
			} else {
				continue;
			}
		}
		rt.modField(f, live(_P), "info", fmt("<li>＀</li>", [rt.fv(f, "name", live(AM))]), add);
	}
	rt.endFor(f, 0);
	rt.modField(f, live(_P), "info", "</ul>", add);
	rt.modField(f, live(_P), "info", "<h4>Stamp below to confirm receipt of goods:</h4>", add);
	yield* g.callName(f, live(_P), "update_icon", []);
	rt.setFv(f, "loc", live(_P), live(C));
	rt.setFv(f, "manifest", live(C), live(_P));
	yield* g.callName(f, live(C), "update_icon", []);
	return live(_P);
}, true);

// /datum/supply_order/proc/generate  (code/modules/cargo/order.dm:87)  may sleep
rt.def("/datum/supply_order/proc/generate", function* generate(f: Frame, _T: Value) {
	let C: Value = null, M: Value = null, lost: Value = null;
	f.vars = () => [_T, C, M, lost];
	C = (yield* g.callName(f, rt.sv(f, "pack"), "generate", [live(_T)]));
	if (truthy(rt.bitAnd(rt.gv(f, "errors", (M = (yield* g.srcCall(f, "generateManifest", live(C))))), 4))) {
		if ((truthy((rt.istype(live(C), T("/obj/structure/closet/crate/secure")) ? 1 : 0)) || truthy((rt.istype(live(C), T("/obj/structure/closet/crate/large")) ? 1 : 0)))) {
			(rt.modField(f, live(M), "errors", 16777211, rt.bitAnd));
		} else {
			lost = (yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/round"), null, [divide(rt.getLen(f, rt.fv(f, "contents", live(C))), 10)])), 1]));
			while (rt.ge((lost = rt.inc(live(lost), -1)), 0)) {
				yield* g.call(f, P("/proc/qdel"), null, [rt.op(f, "PickUnweighted", [1], [rt.fv(f, "contents", live(C))])]);
			}
		}
	}
	return live(C);
}, true);
