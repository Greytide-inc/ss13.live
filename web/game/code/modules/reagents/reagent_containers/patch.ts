// Based on /tg/station's code/modules/reagents/reagent_containers/patch.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// patch.dm:7
rt.def("/obj/item/weapon/reagent_containers/pill/patch/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_transfer_amounts = list();
	return f.dot;
});

// patch.dm:17
rt.def("/obj/item/weapon/reagent_containers/pill/patch/proc/canconsume", function canconsume(f: Frame, eater: Value, user: Value) {
	if (!rt.istype(eater, T("/mob/living/carbon"))) {
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

// patch.dm:24
rt.def("/obj/item/weapon/reagent_containers/pill/patch/styptic/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["styptic_powder", 20]);
	return f.dot;
});

rt.type(6531, "/obj/item/weapon/reagent_containers/pill/patch/silver_sulf", "/obj/item/weapon/reagent_containers/pill/patch", {
	list_reagents: null,
	name: "burn patch",
	desc: "Helps with burn injuries.",
	icon_state: "bandaid_burn",
});

// patch.dm:30
rt.def("/obj/item/weapon/reagent_containers/pill/patch/silver_sulf/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["silver_sulfadiazine", 20]);
	return f.dot;
});
