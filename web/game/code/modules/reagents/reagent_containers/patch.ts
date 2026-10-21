// From code/modules/reagents/reagent_containers/patch.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6529, "/obj/item/weapon/reagent_containers/pill/patch", "/obj/item/weapon/reagent_containers/pill", {
	possible_transfer_amounts: null,
	volume: 40,
	name: "chemical patch",
	desc: "A chemical patch for touch based applications.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "bandaid",
	item_state: "bandaid",
	apply_type: 4,
	apply_method: "apply",
	self_delay: 30,
});

// /obj/item/weapon/reagent_containers/pill/patch/proc/<init>  (code/modules/reagents/reagent_containers/patch.dm:7)
rt.def("/obj/item/weapon/reagent_containers/pill/patch/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_transfer_amounts", rt.list());
	return f.dot;
});

// /obj/item/weapon/reagent_containers/pill/patch/proc/canconsume  (code/modules/reagents/reagent_containers/patch.dm:17)
rt.def("/obj/item/weapon/reagent_containers/pill/patch/proc/canconsume", function canconsume(f: Frame, eater: Value, user: Value) {
	if (!truthy((rt.istype(live(eater), T("/mob/living/carbon")) ? 1 : 0))) {
		return 0;
	}
	return 1;
});

rt.type(6530, "/obj/item/weapon/reagent_containers/pill/patch/styptic", "/obj/item/weapon/reagent_containers/pill/patch", {
	list_reagents: null,
	name: "brute patch",
	desc: "Helps with brute injuries.",
	icon_state: "bandaid_brute",
});

// /obj/item/weapon/reagent_containers/pill/patch/styptic/proc/<init>  (code/modules/reagents/reagent_containers/patch.dm:24)
rt.def("/obj/item/weapon/reagent_containers/pill/patch/styptic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["styptic_powder", 20]));
	return f.dot;
});

rt.type(6531, "/obj/item/weapon/reagent_containers/pill/patch/silver_sulf", "/obj/item/weapon/reagent_containers/pill/patch", {
	list_reagents: null,
	name: "burn patch",
	desc: "Helps with burn injuries.",
	icon_state: "bandaid_burn",
});

// /obj/item/weapon/reagent_containers/pill/patch/silver_sulf/proc/<init>  (code/modules/reagents/reagent_containers/patch.dm:30)
rt.def("/obj/item/weapon/reagent_containers/pill/patch/silver_sulf/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["silver_sulfadiazine", 20]));
	return f.dot;
});
