// Based on /tg/station's code/game/objects/items/stacks/cash.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



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

// cash.dm:17
rt.def("/obj/item/stack/spacecash/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.update_desc();
	return f.dot;
}, true);

// cash.dm:21
rt.def("/obj/item/stack/spacecash/proc/update_desc", function update_desc(f: Frame) {
	let total_worth: Value = null;
	let $0: any = (total_worth = this.amount * rt.sv(f, "value"));
	this.desc = `It's worth ${$0} credit${this.amount > 1 ? "s" : ""}`;
	return f.dot;
});

// cash.dm:26
rt.def("/obj/item/stack/spacecash/proc/merge", function* merge(f: Frame, S: Value) {
	f.dot = (yield* parent_proc());
	this.update_desc();
	return f.dot;
}, true);

// cash.dm:30
rt.def("/obj/item/stack/spacecash/proc/use", function* use(f: Frame) {
	f.dot = (yield* parent_proc());
	this.update_desc();
	return f.dot;
}, true);
