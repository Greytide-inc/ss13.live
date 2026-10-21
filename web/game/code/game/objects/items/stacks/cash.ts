// From code/game/objects/items/stacks/cash.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9090, "/obj/item/stack/spacecash", "/obj/item/stack", {
	value: 0,
	throw_speed: 2,
	throw_range: 2,
	name: "space cash",
	singular_name: "bill",
	icon: rt.rsc("icons/obj/economy.dmi"),
	icon_state: "spacecash",
	amount: 1,
	max_amount: 20,
	throwforce: 0,
	w_class: 1,
	full_w_class: 1,
	resistance_flags: 4,
});

// /obj/item/stack/spacecash/proc/Initialize  (code/game/objects/items/stacks/cash.dm:17)  may sleep
rt.def("/obj/item/stack/spacecash/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "update_desc");
	return f.dot;
}, true);

// /obj/item/stack/spacecash/proc/update_desc  (code/game/objects/items/stacks/cash.dm:21)
rt.def("/obj/item/stack/spacecash/proc/update_desc", function update_desc(f: Frame) {
	let total_worth: Value = null;
	let $0: any, $1: any;
	f.vars = () => [total_worth, $0, $1];
	$0 = (total_worth = multiply(rt.sv(f, "amount"), rt.sv(f, "value")));
	if (rt.gt(rt.sv(f, "amount"), 1)) {
		$1 = "s";
	} else {
		$1 = "";
	}
	rt.setSv(f, "desc", fmt("It's worth ＀ credit＀", [$0, $1]));
	return f.dot;
});

// /obj/item/stack/spacecash/proc/merge  (code/game/objects/items/stacks/cash.dm:26)  may sleep
rt.def("/obj/item/stack/spacecash/proc/merge", function* merge(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "update_desc");
	return f.dot;
}, true, { args: ["S"] });

// /obj/item/stack/spacecash/proc/use  (code/game/objects/items/stacks/cash.dm:30)  may sleep
rt.def("/obj/item/stack/spacecash/proc/use", function* use(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "update_desc");
	return f.dot;
}, true);
