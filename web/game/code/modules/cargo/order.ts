// Based on /tg/station's code/modules/cargo/order.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


rt.type(6605, "/obj/item/weapon/paper/manifest", "/obj/item/weapon/paper", {
	order_cost: 0,
	order_id: 0,
	errors: 0,
});

// order.dm:7
rt.def("/obj/item/weapon/paper/manifest/proc/New", function* New(f: Frame, A: Value, id: Value, cost: Value) {
	yield* parent_proc();
	this.order_id = id;
	this.order_cost = cost;
	if (prob(MANIFEST_ERROR_CHANCE)) {
		(rt.modSrcVar(f, "errors", MANIFEST_ERROR_NAME, rt.bitOr));
	}
	if (prob(MANIFEST_ERROR_CHANCE)) {
		(rt.modSrcVar(f, "errors", MANIFEST_ERROR_CONTENTS, rt.bitOr));
	}
	if (!prob(MANIFEST_ERROR_CHANCE)) return f.dot;
	(rt.modSrcVar(f, "errors", MANIFEST_ERROR_ITEM, rt.bitOr));
	return f.dot;
}, true);

// order.dm:19
rt.def("/obj/item/weapon/paper/manifest/proc/is_approved", function is_approved(f: Frame) {
	return ((this.stamped && rt.len(f, this.stamped)) && (!this.is_denied() ? 1 : 0));
});

// order.dm:22
rt.def("/obj/item/weapon/paper/manifest/proc/is_denied", function is_denied(f: Frame) {
	return (this.stamped && (rt.isIn(f, "stamp-deny", this.stamped) ? 1 : 0));
});

rt.type(2099, "/datum/supply_order", "/datum", {
	id: null,
	orderer: null,
	orderer_rank: null,
	orderer_ckey: null,
	reason: null,
	pack: null,
});

// order.dm:33
rt.def("/datum/supply_order/proc/New", function New(f: Frame, pack: Value, orderer: Value, orderer_rank: Value, orderer_ckey: Value, reason: Value) {
	this.id = GLOB.SSshuttle.ordernum++;
	this.pack = pack;
	this.orderer = orderer;
	this.orderer_rank = orderer_rank;
	this.orderer_ckey = orderer_ckey;
	this.reason = reason;
	return f.dot;
});

// order.dm:41
rt.def("/datum/supply_order/proc/generateRequisition", function* generateRequisition(f: Frame, _T: Value) {
	let _P: Value = null;
	(_P = (yield* new_(T("/obj/item/weapon/paper"), _T))).name = `requisition form - #${this.id} (${this.pack.name})`;
	_P.info += `<h2>${station_name()} Supply Requisition</h2>`;
	_P.info += "<hr/>";
	_P.info += `Order #${this.id}<br/>`;
	_P.info += `Item: ${this.pack.name}<br/>`;
	_P.info += `Access Restrictions: ${get_access_desc(this.pack.access)}<br/>`;
	_P.info += `Requested by: ${this.orderer}<br/>`;
	_P.info += `Rank: ${this.orderer_rank}<br/>`;
	_P.info += `Comment: ${this.reason}<br/>`;
	yield* _P.update_icon();
	return _P;
}, true);

// order.dm:57
rt.def("/datum/supply_order/proc/generateManifest", function* generateManifest(f: Frame, C: Value) {
	let AM: Value = null;
	let $0: any, $e: any;
	let _P: Value = (yield* new_(T("/obj/item/weapon/paper/manifest"), C, this.id, this.pack.cost));
	if (rt.bitAnd(_P.errors, MANIFEST_ERROR_NAME)) {
		$0 = new_station_name();
	} else {
		$0 = (yield* g.call(f, P("/proc/station_name"), null, []));
	}
	let station_name: Value = $0;
	_P.name = `shipping manifest - #${this.id} (${this.pack.name})`;
	_P.info += `<h2>${command_name()} Shipping Manifest</h2>`;
	_P.info += "<hr/>";
	_P.info += `Order #${this.id}<br/>`;
	_P.info += `Destination: ${station_name}<br/>`;
	_P.info += `Item: ${this.pack.name}<br/>`;
	_P.info += "Contents: <br/>";
	_P.info += "<ul>";
	for (AM of each(C.contents - _P, T("/atom/movable"))) {
		if (rt.bitAnd(_P.errors, MANIFEST_ERROR_CONTENTS)) {
			if (prob(50)) {
				_P.info += `<li>${AM.name}</li>`;
			} else {
				continue;
			}
		}
		_P.info += `<li>${AM.name}</li>`;
	}
	_P.info += "</ul>";
	_P.info += "<h4>Stamp below to confirm receipt of goods:</h4>";
	yield* _P.update_icon();
	_P.loc = C;
	C.manifest = _P;
	yield* C.update_icon();
	return _P;
}, true);

// order.dm:87
rt.def("/datum/supply_order/proc/generate", function* generate(f: Frame, _T: Value) {
	let M: Value = null, lost: Value = null;
	let C: Value = (yield* this.pack.generate(_T));
	if (rt.bitAnd((M = (yield* this.generateManifest(C))).errors, 4)) {
		if (rt.istype(C, T("/obj/structure/closet/crate/secure")) || rt.istype(C, T("/obj/structure/closet/crate/large"))) {
			(rt.modField(f, M, "errors", 16777211, rt.bitAnd));
		} else {
			lost = max(round(rt.len(f, C.contents) / 10), 1);
			while (--lost >= 0) {
				yield* qdel(pick(C.contents));
			}
		}
	}
	return C;
}, true);
