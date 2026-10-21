// From code/modules/cargo/exports/large_objects.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1975, "/datum/export/large/crate", "/datum/export/large", {
	cost: 500,
	k_elasticity: 0,
	unit_name: "crate",
	export_types: null,
	exclude_types: null,
});

// /datum/export/large/crate/proc/<init>  (code/modules/cargo/exports/large_objects.dm:8)
rt.def("/datum/export/large/crate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/structure/closet/crate")));
	$0 = $0;
	rt.setSv(f, "exclude_types", rt.list(T("/obj/structure/closet/crate/large"), T("/obj/structure/closet/crate/wooden")));
	return f.dot;
});

// /datum/export/large/crate/proc/total_printout  (code/modules/cargo/exports/large_objects.dm:12)
rt.def("/datum/export/large/crate/proc/total_printout", function total_printout(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.dot))) return f.dot;
	f.dot = rt.modify(live(f.dot), " Thanks for participating in Nanotrasen Crates Recycling Program.", add);
	return f.dot;
});

rt.type(1976, "/datum/export/large/crate/wooden", "/datum/export/large/crate", {
	cost: 100,
	unit_name: "large wooden crate",
	exclude_types: null,
	export_types: null,
});

// /datum/export/large/crate/wooden/proc/<init>  (code/modules/cargo/exports/large_objects.dm:20)
rt.def("/datum/export/large/crate/wooden/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "exclude_types", rt.list());
	$0 = $0;
	rt.setSv(f, "export_types", rt.list(T("/obj/structure/closet/crate/large")));
	return f.dot;
});

rt.type(1977, "/datum/export/large/crate/wooden/ore", "/datum/export/large/crate/wooden", {
	unit_name: "ore box",
	export_types: null,
});

// /datum/export/large/crate/wooden/ore/proc/<init>  (code/modules/cargo/exports/large_objects.dm:24)
rt.def("/datum/export/large/crate/wooden/ore/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/structure/ore_box")));
	return f.dot;
});

rt.type(1978, "/datum/export/large/crate/wood", "/datum/export/large/crate", {
	cost: 240,
	unit_name: "wooden crate",
	exclude_types: null,
	export_types: null,
});

// /datum/export/large/crate/wood/proc/<init>  (code/modules/cargo/exports/large_objects.dm:30)
rt.def("/datum/export/large/crate/wood/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "exclude_types", rt.list());
	$0 = $0;
	rt.setSv(f, "export_types", rt.list(T("/obj/structure/closet/crate/wooden")));
	return f.dot;
});

rt.type(1979, "/datum/export/large/reagent_dispenser", "/datum/export/large", {
	contents_cost: 400,
	cost: 100,
});

// /datum/export/large/reagent_dispenser/proc/get_cost  (code/modules/cargo/exports/large_objects.dm:40)
rt.def("/datum/export/large/reagent_dispenser/proc/get_cost", function get_cost(f: Frame) {
	let D: Value = null, ratio: Value = null;
	f.vars = () => [D, ratio];
	D = live(f.args[0]);
	ratio = divide(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(D))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", live(D))));
	return add(rt.callSuper(f, [], rt.Args.Same), rt.call(f, P("/proc/round"), null, [multiply(rt.sv(f, "contents_cost"), live(ratio))]));
}, false, { args: ["O"] });

rt.type(1980, "/datum/export/large/reagent_dispenser/water", "/datum/export/large/reagent_dispenser", {
	unit_name: "watertank",
	contents_cost: 200,
	export_types: null,
});

// /datum/export/large/reagent_dispenser/water/proc/<init>  (code/modules/cargo/exports/large_objects.dm:47)
rt.def("/datum/export/large/reagent_dispenser/water/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/structure/reagent_dispensers/watertank")));
	return f.dot;
});

rt.type(1981, "/datum/export/large/reagent_dispenser/fuel", "/datum/export/large/reagent_dispenser", {
	unit_name: "fueltank",
	export_types: null,
});

// /datum/export/large/reagent_dispenser/fuel/proc/<init>  (code/modules/cargo/exports/large_objects.dm:52)
rt.def("/datum/export/large/reagent_dispenser/fuel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/structure/reagent_dispensers/fueltank")));
	return f.dot;
});

rt.type(1982, "/datum/export/large/reagent_dispenser/beer", "/datum/export/large/reagent_dispenser", {
	unit_name: "beer keg",
	contents_cost: 700,
	export_types: null,
});

// /datum/export/large/reagent_dispenser/beer/proc/<init>  (code/modules/cargo/exports/large_objects.dm:57)
rt.def("/datum/export/large/reagent_dispenser/beer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/structure/reagent_dispensers/beerkeg")));
	return f.dot;
});

rt.type(1983, "/datum/export/large/emitter", "/datum/export/large", {
	cost: 400,
	unit_name: "emitter",
	export_types: null,
});

// /datum/export/large/emitter/proc/<init>  (code/modules/cargo/exports/large_objects.dm:65)
rt.def("/datum/export/large/emitter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/machinery/power/emitter")));
	return f.dot;
});

rt.type(1984, "/datum/export/large/field_generator", "/datum/export/large", {
	cost: 400,
	unit_name: "field generator",
	export_types: null,
});

// /datum/export/large/field_generator/proc/<init>  (code/modules/cargo/exports/large_objects.dm:70)
rt.def("/datum/export/large/field_generator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/machinery/field/generator")));
	return f.dot;
});

rt.type(1985, "/datum/export/large/collector", "/datum/export/large", {
	cost: 600,
	unit_name: "collector",
	export_types: null,
});

// /datum/export/large/collector/proc/<init>  (code/modules/cargo/exports/large_objects.dm:75)
rt.def("/datum/export/large/collector/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/machinery/power/rad_collector")));
	return f.dot;
});

rt.type(1986, "/datum/export/large/collector/pa", "/datum/export/large/collector", {
	cost: 300,
	unit_name: "particle accelerator part",
	export_types: null,
});

// /datum/export/large/collector/pa/proc/<init>  (code/modules/cargo/exports/large_objects.dm:80)
rt.def("/datum/export/large/collector/pa/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/structure/particle_accelerator")));
	return f.dot;
});

rt.type(1987, "/datum/export/large/collector/pa/controls", "/datum/export/large/collector/pa", {
	cost: 500,
	unit_name: "particle accelerator control console",
	export_types: null,
});

// /datum/export/large/collector/pa/controls/proc/<init>  (code/modules/cargo/exports/large_objects.dm:85)
rt.def("/datum/export/large/collector/pa/controls/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/machinery/particle_accelerator/control_box")));
	return f.dot;
});

rt.type(1988, "/datum/export/large/pipedispenser", "/datum/export/large", {
	cost: 500,
	unit_name: "pipe dispenser",
	export_types: null,
});

// /datum/export/large/pipedispenser/proc/<init>  (code/modules/cargo/exports/large_objects.dm:90)
rt.def("/datum/export/large/pipedispenser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/machinery/pipedispenser")));
	return f.dot;
});

rt.type(1989, "/datum/export/large/supermatter", "/datum/export/large", {
	cost: 9000,
	unit_name: "supermatter shard",
	export_types: null,
});

// /datum/export/large/supermatter/proc/<init>  (code/modules/cargo/exports/large_objects.dm:95)
rt.def("/datum/export/large/supermatter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/machinery/power/supermatter_shard")));
	return f.dot;
});

rt.type(1990, "/datum/export/large/iv", "/datum/export/large", {
	cost: 300,
	unit_name: "iv drip",
	export_types: null,
});

// /datum/export/large/iv/proc/<init>  (code/modules/cargo/exports/large_objects.dm:101)
rt.def("/datum/export/large/iv/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/machinery/iv_drip")));
	return f.dot;
});

rt.type(1991, "/datum/export/large/barrier", "/datum/export/large", {
	cost: 325,
	unit_name: "security barrier",
	export_types: null,
});

// /datum/export/large/barrier/proc/<init>  (code/modules/cargo/exports/large_objects.dm:106)
rt.def("/datum/export/large/barrier/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/item/weapon/grenade/barrier"), T("/obj/structure/barricade/security")));
	return f.dot;
});

rt.type(1992, "/datum/export/large/mech", "/datum/export/large", {
	sellable: null,
	export_types: null,
});

// /datum/export/large/mech/proc/<init>  (code/modules/cargo/exports/large_objects.dm:110)
rt.def("/datum/export/large/mech/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/mecha")));
	return f.dot;
});

// /datum/export/large/mech/proc/applies_to  (code/modules/cargo/exports/large_objects.dm:114)
rt.def("/datum/export/large/mech/proc/applies_to", function applies_to(f: Frame) {
	let ME: Value = null;
	f.vars = () => [ME];
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 0;
	}
	rt.setFv(f, "wreckage", (ME = live(f.args[0])), null);
	if (!truthy(rt.sv(f, "sellable"))) return f.dot;
	return 1;
}, false, { args: ["O"] });

rt.type(1993, "/datum/export/large/mech/sellable", "/datum/export/large/mech", {
	export_types: null,
	sellable: 1,
});

// /datum/export/large/mech/sellable/proc/<init>  (code/modules/cargo/exports/large_objects.dm:123)
rt.def("/datum/export/large/mech/sellable/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list());
	return f.dot;
});

rt.type(1994, "/datum/export/large/mech/sellable/ripley", "/datum/export/large/mech/sellable", {
	cost: 7500,
	unit_name: "APLU \"Ripley\"",
	export_types: null,
	exclude_types: null,
});

// /datum/export/large/mech/sellable/ripley/proc/<init>  (code/modules/cargo/exports/large_objects.dm:129)
rt.def("/datum/export/large/mech/sellable/ripley/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/mecha/working/ripley")));
	$0 = $0;
	rt.setSv(f, "exclude_types", rt.list(T("/obj/mecha/working/ripley/firefighter")));
	return f.dot;
});

rt.type(1995, "/datum/export/large/mech/sellable/firefighter", "/datum/export/large/mech/sellable", {
	cost: 9000,
	unit_name: "APLU \"Firefighter\"",
	export_types: null,
});

// /datum/export/large/mech/sellable/firefighter/proc/<init>  (code/modules/cargo/exports/large_objects.dm:135)
rt.def("/datum/export/large/mech/sellable/firefighter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/mecha/working/ripley/firefighter")));
	return f.dot;
});

rt.type(1996, "/datum/export/large/mech/sellable/odysseus", "/datum/export/large/mech/sellable", {
	cost: 6000,
	unit_name: "odysseus",
	export_types: null,
});

// /datum/export/large/mech/sellable/odysseus/proc/<init>  (code/modules/cargo/exports/large_objects.dm:140)
rt.def("/datum/export/large/mech/sellable/odysseus/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/mecha/medical/odysseus")));
	return f.dot;
});

rt.type(1997, "/datum/export/large/mech/sellable/gygax", "/datum/export/large/mech/sellable", {
	cost: 25000,
	unit_name: "gygax",
	export_types: null,
	exclude_types: null,
});

// /datum/export/large/mech/sellable/gygax/proc/<init>  (code/modules/cargo/exports/large_objects.dm:145)
rt.def("/datum/export/large/mech/sellable/gygax/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/mecha/combat/gygax")));
	$0 = $0;
	rt.setSv(f, "exclude_types", rt.list(T("/obj/mecha/combat/gygax/dark")));
	return f.dot;
});

rt.type(1998, "/datum/export/large/mech/sellable/honkmech", "/datum/export/large/mech/sellable", {
	cost: 80000,
	unit_name: "H.O.N.K",
	message: "- HONK HONK HONK HONK HONK HONK HONK HONK HONK HONK HONK HONK HONK HONK HONK HONK HONK HONK HONK HONK HONKHONKHONKHONK",
	export_types: null,
});

// /datum/export/large/mech/sellable/honkmech/proc/<init>  (code/modules/cargo/exports/large_objects.dm:152)
rt.def("/datum/export/large/mech/sellable/honkmech/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/mecha/combat/honker")));
	return f.dot;
});

rt.type(1999, "/datum/export/large/mech/sellable/durand", "/datum/export/large/mech/sellable", {
	cost: 12000,
	unit_name: "durand",
	export_types: null,
});

// /datum/export/large/mech/sellable/durand/proc/<init>  (code/modules/cargo/exports/large_objects.dm:157)
rt.def("/datum/export/large/mech/sellable/durand/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/mecha/combat/durand")));
	return f.dot;
});

rt.type(2000, "/datum/export/large/mech/sellable/phazon", "/datum/export/large/mech/sellable", {
	cost: 50000,
	unit_name: "phazon",
	export_types: null,
});

// /datum/export/large/mech/sellable/phazon/proc/<init>  (code/modules/cargo/exports/large_objects.dm:162)
rt.def("/datum/export/large/mech/sellable/phazon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/mecha/combat/phazon")));
	return f.dot;
});

rt.type(2001, "/datum/export/large/mech/sellable/syndiegygax", "/datum/export/large/mech/sellable", {
	cost: 50000,
	unit_name: "captured syndicate gygax",
	export_types: null,
});

// /datum/export/large/mech/sellable/syndiegygax/proc/<init>  (code/modules/cargo/exports/large_objects.dm:167)
rt.def("/datum/export/large/mech/sellable/syndiegygax/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/mecha/combat/gygax/dark")));
	return f.dot;
});

rt.type(2003, "/datum/export/large/mech/sellable/mauler", "/datum/export/large/mech/sellable", {
	cost: 87500,
	unit_name: "captured mauler",
	export_types: null,
});

// /datum/export/large/mech/sellable/mauler/proc/<init>  (code/modules/cargo/exports/large_objects.dm:177)
rt.def("/datum/export/large/mech/sellable/mauler/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "export_types", rt.list(T("/obj/mecha/combat/marauder/mauler")));
	return f.dot;
});
