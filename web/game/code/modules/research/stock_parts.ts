// From code/modules/research/stock_parts.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5605, "/obj/item/weapon/storage/part_replacer", "/obj/item/weapon/storage", {
	works_from_distance: 0,
	pshoom_or_beepboopblorpzingshadashwoosh: rt.rsc("sound/items/rped.ogg"),
	alt_sound: null,
	storage_slots: 50,
	use_to_pickup: 1,
	allow_quick_gather: 1,
	allow_quick_empty: 1,
	collection_mode: 1,
	display_contents_with_number: 1,
	max_w_class: 3,
	max_combined_w_class: 100,
	name: "rapid part exchange device",
	desc: "Special mechanical module made to store, sort, and apply standard machine parts.",
	icon_state: "RPED",
	item_state: "RPED",
	w_class: 5,
	can_hold: null,
});

// /obj/item/weapon/storage/part_replacer/proc/<init>  (code/modules/research/stock_parts.dm:10)
rt.def("/obj/item/weapon/storage/part_replacer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/stock_parts")));
	return f.dot;
});

// /obj/item/weapon/storage/part_replacer/proc/afterattack  (code/modules/research/stock_parts.dm:25)  may sleep
rt.def("/obj/item/weapon/storage/part_replacer/proc/afterattack", function* afterattack(f: Frame, _T: Value, user: Value, flag: Value, params: Value) {
	f.vars = () => [_T, user, flag, params];
	if (truthy(live(flag))) {
		return live(f.dot);
	} else {
		if (truthy(rt.sv(f, "works_from_distance"))) {
			if (truthy((rt.istype(live(_T), T("/obj/machinery")) ? 1 : 0))) {
				if (truthy(rt.fv(f, "component_parts", live(_T)))) {
					yield* g.callName(f, live(_T), "exchange_parts", [live(user), live(f.src)]);
					yield* g.callName(f, live(user), "Beam", [null, live(_T), "icon_state", "rped_upgrade", "time", 5], rt.Args.Named);
				}
			}
		}
	}
	return live(f.dot);
}, true);

rt.type(5606, "/obj/item/weapon/storage/part_replacer/bluespace", "/obj/item/weapon/storage/part_replacer", {
	storage_slots: 400,
	max_w_class: 3,
	max_combined_w_class: 800,
	works_from_distance: 1,
	pshoom_or_beepboopblorpzingshadashwoosh: rt.rsc("sound/items/pshoom.ogg"),
	alt_sound: rt.rsc("sound/items/pshoom_2.ogg"),
	name: "bluespace rapid part exchange device",
	desc: "A version of the RPED that allows for replacement of parts and scanning from a distance, along with higher capacity for parts.",
	icon_state: "BS_RPED",
	w_class: 3,
});

// /obj/item/weapon/storage/part_replacer/bluespace/proc/content_can_dump  (code/modules/research/stock_parts.dm:46)  may sleep
rt.def("/obj/item/weapon/storage/part_replacer/bluespace/proc/content_can_dump", function* content_can_dump(f: Frame, dest_object: Value, user: Value) {
	f.vars = () => [dest_object, user];
	if (truthy((yield* g.srcCall(f, "Adjacent", live(user))))) {
		if (rt.lt((yield* g.call(f, P("/proc/get_dist"), null, [live(user), live(dest_object)])), 8)) {
			if (truthy((yield* g.callName(f, live(dest_object), "storage_contents_dump_act", [live(f.src), live(user)])))) {
				yield* g.srcCall(f, "play_rped_sound");
				yield* g.callName(f, live(user), "Beam", [null, live(dest_object), "icon_state", "rped_upgrade", "time", 5], rt.Args.Named);
				return 1;
			}
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("The ＀ buzzes.", [rt.fv(f, "name", live(f.src))])]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/buzz-sigh.ogg"), 50, 0]);
	}
	return 0;
}, true);

// /obj/item/weapon/storage/part_replacer/proc/play_rped_sound  (code/modules/research/stock_parts.dm:58)
rt.def("/obj/item/weapon/storage/part_replacer/proc/play_rped_sound", function play_rped_sound(f: Frame) {
	if ((truthy(rt.sv(f, "alt_sound")) && truthy(rt.op(f, "Prob", [], [1])))) {
		rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.sv(f, "alt_sound"), 40, 1]);
	} else {
		rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.sv(f, "pshoom_or_beepboopblorpzingshadashwoosh"), 40, 1]);
	}
	return f.dot;
});

// /proc/cmp_rped_sort  (code/modules/research/stock_parts.dm:66)
rt.def("/proc/cmp_rped_sort", function cmp_rped_sort(f: Frame, A: Value, B: Value) {
	return subtract(rt.fv(f, "rating", live(B)), rt.fv(f, "rating", live(A)));
}, false, { argTypes: [{ type: 4, path: "/obj/item/weapon/stock_parts" }, { type: 4, path: "/obj/item/weapon/stock_parts" }] });

rt.type(5706, "/obj/item/weapon/stock_parts", "/obj/item/weapon", {
	rating: 1,
	name: "stock part",
	desc: "What?",
	icon: rt.rsc("icons/obj/stock_parts.dmi"),
	w_class: 2,
});

// /obj/item/weapon/stock_parts/proc/Initialize  (code/modules/research/stock_parts.dm:76)  may sleep
rt.def("/obj/item/weapon/stock_parts/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	return f.dot;
}, true);

rt.type(5736, "/obj/item/weapon/stock_parts/console_screen", "/obj/item/weapon/stock_parts", {
	name: "console screen",
	desc: "Used in the construction of computers and other devices with a interactive console.",
	icon_state: "screen",
	origin_tech: "materials=1",
	materials: null,
});

// /obj/item/weapon/stock_parts/console_screen/proc/<init>  (code/modules/research/stock_parts.dm:87)
rt.def("/obj/item/weapon/stock_parts/console_screen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 200]));
	return f.dot;
});

rt.type(5737, "/obj/item/weapon/stock_parts/capacitor", "/obj/item/weapon/stock_parts", {
	name: "capacitor",
	desc: "A basic capacitor used in the construction of a variety of devices.",
	icon_state: "capacitor",
	origin_tech: "powerstorage=1",
	materials: null,
});

// /obj/item/weapon/stock_parts/capacitor/proc/<init>  (code/modules/research/stock_parts.dm:94)
rt.def("/obj/item/weapon/stock_parts/capacitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50, "$glass", 50]));
	return f.dot;
});

rt.type(5741, "/obj/item/weapon/stock_parts/scanning_module", "/obj/item/weapon/stock_parts", {
	name: "scanning module",
	desc: "A compact, high resolution scanning module used in the construction of certain devices.",
	icon_state: "scan_module",
	origin_tech: "magnets=1",
	materials: null,
});

// /obj/item/weapon/stock_parts/scanning_module/proc/<init>  (code/modules/research/stock_parts.dm:101)
rt.def("/obj/item/weapon/stock_parts/scanning_module/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50, "$glass", 20]));
	return f.dot;
});

rt.type(5745, "/obj/item/weapon/stock_parts/manipulator", "/obj/item/weapon/stock_parts", {
	name: "micro-manipulator",
	desc: "A tiny little manipulator used in the construction of certain devices.",
	icon_state: "micro_mani",
	origin_tech: "materials=1;programming=1",
	materials: null,
});

// /obj/item/weapon/stock_parts/manipulator/proc/<init>  (code/modules/research/stock_parts.dm:108)
rt.def("/obj/item/weapon/stock_parts/manipulator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30]));
	return f.dot;
});

rt.type(5749, "/obj/item/weapon/stock_parts/micro_laser", "/obj/item/weapon/stock_parts", {
	name: "micro-laser",
	desc: "A tiny laser used in certain devices.",
	icon_state: "micro_laser",
	origin_tech: "magnets=1",
	materials: null,
});

// /obj/item/weapon/stock_parts/micro_laser/proc/<init>  (code/modules/research/stock_parts.dm:115)
rt.def("/obj/item/weapon/stock_parts/micro_laser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10, "$glass", 20]));
	return f.dot;
});

rt.type(5753, "/obj/item/weapon/stock_parts/matter_bin", "/obj/item/weapon/stock_parts", {
	name: "matter bin",
	desc: "A container designed to hold compressed matter awaiting reconstruction.",
	icon_state: "matter_bin",
	origin_tech: "materials=1",
	materials: null,
});

// /obj/item/weapon/stock_parts/matter_bin/proc/<init>  (code/modules/research/stock_parts.dm:122)
rt.def("/obj/item/weapon/stock_parts/matter_bin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 80]));
	return f.dot;
});

rt.type(5738, "/obj/item/weapon/stock_parts/capacitor/adv", "/obj/item/weapon/stock_parts/capacitor", {
	rating: 2,
	name: "advanced capacitor",
	desc: "An advanced capacitor used in the construction of a variety of devices.",
	icon_state: "adv_capacitor",
	origin_tech: "powerstorage=3",
	materials: null,
});

// /obj/item/weapon/stock_parts/capacitor/adv/proc/<init>  (code/modules/research/stock_parts.dm:132)
rt.def("/obj/item/weapon/stock_parts/capacitor/adv/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50, "$glass", 50]));
	return f.dot;
});

rt.type(5742, "/obj/item/weapon/stock_parts/scanning_module/adv", "/obj/item/weapon/stock_parts/scanning_module", {
	rating: 2,
	name: "advanced scanning module",
	desc: "A compact, high resolution scanning module used in the construction of certain devices.",
	icon_state: "adv_scan_module",
	origin_tech: "magnets=3",
	materials: null,
});

// /obj/item/weapon/stock_parts/scanning_module/adv/proc/<init>  (code/modules/research/stock_parts.dm:140)
rt.def("/obj/item/weapon/stock_parts/scanning_module/adv/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50, "$glass", 20]));
	return f.dot;
});

rt.type(5746, "/obj/item/weapon/stock_parts/manipulator/nano", "/obj/item/weapon/stock_parts/manipulator", {
	rating: 2,
	name: "nano-manipulator",
	desc: "A tiny little manipulator used in the construction of certain devices.",
	icon_state: "nano_mani",
	origin_tech: "materials=3;programming=2",
	materials: null,
});

// /obj/item/weapon/stock_parts/manipulator/nano/proc/<init>  (code/modules/research/stock_parts.dm:148)
rt.def("/obj/item/weapon/stock_parts/manipulator/nano/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30]));
	return f.dot;
});

rt.type(5750, "/obj/item/weapon/stock_parts/micro_laser/high", "/obj/item/weapon/stock_parts/micro_laser", {
	rating: 2,
	name: "high-power micro-laser",
	desc: "A tiny laser used in certain devices.",
	icon_state: "high_micro_laser",
	origin_tech: "magnets=3",
	materials: null,
});

// /obj/item/weapon/stock_parts/micro_laser/high/proc/<init>  (code/modules/research/stock_parts.dm:156)
rt.def("/obj/item/weapon/stock_parts/micro_laser/high/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10, "$glass", 20]));
	return f.dot;
});

rt.type(5754, "/obj/item/weapon/stock_parts/matter_bin/adv", "/obj/item/weapon/stock_parts/matter_bin", {
	rating: 2,
	name: "advanced matter bin",
	desc: "A container designed to hold compressed matter awaiting reconstruction.",
	icon_state: "advanced_matter_bin",
	origin_tech: "materials=3",
	materials: null,
});

// /obj/item/weapon/stock_parts/matter_bin/adv/proc/<init>  (code/modules/research/stock_parts.dm:164)
rt.def("/obj/item/weapon/stock_parts/matter_bin/adv/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 80]));
	return f.dot;
});

rt.type(5739, "/obj/item/weapon/stock_parts/capacitor/super", "/obj/item/weapon/stock_parts/capacitor", {
	rating: 3,
	name: "super capacitor",
	desc: "A super-high capacity capacitor used in the construction of a variety of devices.",
	icon_state: "super_capacitor",
	origin_tech: "powerstorage=4;engineering=4",
	materials: null,
});

// /obj/item/weapon/stock_parts/capacitor/super/proc/<init>  (code/modules/research/stock_parts.dm:174)
rt.def("/obj/item/weapon/stock_parts/capacitor/super/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50, "$glass", 50]));
	return f.dot;
});

rt.type(5743, "/obj/item/weapon/stock_parts/scanning_module/phasic", "/obj/item/weapon/stock_parts/scanning_module", {
	rating: 3,
	name: "phasic scanning module",
	desc: "A compact, high resolution phasic scanning module used in the construction of certain devices.",
	icon_state: "super_scan_module",
	origin_tech: "magnets=4;engineering=4",
	materials: null,
});

// /obj/item/weapon/stock_parts/scanning_module/phasic/proc/<init>  (code/modules/research/stock_parts.dm:182)
rt.def("/obj/item/weapon/stock_parts/scanning_module/phasic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50, "$glass", 20]));
	return f.dot;
});

rt.type(5747, "/obj/item/weapon/stock_parts/manipulator/pico", "/obj/item/weapon/stock_parts/manipulator", {
	rating: 3,
	name: "pico-manipulator",
	desc: "A tiny little manipulator used in the construction of certain devices.",
	icon_state: "pico_mani",
	origin_tech: "materials=4;programming=4;engineering=4",
	materials: null,
});

// /obj/item/weapon/stock_parts/manipulator/pico/proc/<init>  (code/modules/research/stock_parts.dm:190)
rt.def("/obj/item/weapon/stock_parts/manipulator/pico/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30]));
	return f.dot;
});

rt.type(5751, "/obj/item/weapon/stock_parts/micro_laser/ultra", "/obj/item/weapon/stock_parts/micro_laser", {
	rating: 3,
	name: "ultra-high-power micro-laser",
	icon_state: "ultra_high_micro_laser",
	desc: "A tiny laser used in certain devices.",
	origin_tech: "magnets=4;engineering=4",
	materials: null,
});

// /obj/item/weapon/stock_parts/micro_laser/ultra/proc/<init>  (code/modules/research/stock_parts.dm:198)
rt.def("/obj/item/weapon/stock_parts/micro_laser/ultra/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10, "$glass", 20]));
	return f.dot;
});

rt.type(5755, "/obj/item/weapon/stock_parts/matter_bin/super", "/obj/item/weapon/stock_parts/matter_bin", {
	rating: 3,
	name: "super matter bin",
	desc: "A container designed to hold compressed matter awaiting reconstruction.",
	icon_state: "super_matter_bin",
	origin_tech: "materials=4;engineering=4",
	materials: null,
});

// /obj/item/weapon/stock_parts/matter_bin/super/proc/<init>  (code/modules/research/stock_parts.dm:206)
rt.def("/obj/item/weapon/stock_parts/matter_bin/super/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 80]));
	return f.dot;
});

rt.type(5740, "/obj/item/weapon/stock_parts/capacitor/quadratic", "/obj/item/weapon/stock_parts/capacitor", {
	rating: 4,
	name: "quadratic capacitor",
	desc: "An capacity capacitor used in the construction of a variety of devices.",
	icon_state: "quadratic_capacitor",
	origin_tech: "powerstorage=5;materials=4;engineering=4",
	materials: null,
});

// /obj/item/weapon/stock_parts/capacitor/quadratic/proc/<init>  (code/modules/research/stock_parts.dm:216)
rt.def("/obj/item/weapon/stock_parts/capacitor/quadratic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50, "$glass", 50]));
	return f.dot;
});

rt.type(5744, "/obj/item/weapon/stock_parts/scanning_module/triphasic", "/obj/item/weapon/stock_parts/scanning_module", {
	rating: 4,
	name: "triphasic scanning module",
	desc: "A compact, ultra resolution triphasic scanning module used in the construction of certain devices.",
	icon_state: "triphasic_scan_module",
	origin_tech: "magnets=5;materials=4;engineering=4",
	materials: null,
});

// /obj/item/weapon/stock_parts/scanning_module/triphasic/proc/<init>  (code/modules/research/stock_parts.dm:224)
rt.def("/obj/item/weapon/stock_parts/scanning_module/triphasic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50, "$glass", 20]));
	return f.dot;
});

rt.type(5748, "/obj/item/weapon/stock_parts/manipulator/femto", "/obj/item/weapon/stock_parts/manipulator", {
	rating: 4,
	name: "femto-manipulator",
	desc: "A tiny little manipulator used in the construction of certain devices.",
	icon_state: "femto_mani",
	origin_tech: "materials=6;programming=4;engineering=4",
	materials: null,
});

// /obj/item/weapon/stock_parts/manipulator/femto/proc/<init>  (code/modules/research/stock_parts.dm:232)
rt.def("/obj/item/weapon/stock_parts/manipulator/femto/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30]));
	return f.dot;
});

rt.type(5752, "/obj/item/weapon/stock_parts/micro_laser/quadultra", "/obj/item/weapon/stock_parts/micro_laser", {
	rating: 4,
	name: "quad-ultra micro-laser",
	icon_state: "quadultra_micro_laser",
	desc: "A tiny laser used in certain devices.",
	origin_tech: "magnets=5;materials=4;engineering=4",
	materials: null,
});

// /obj/item/weapon/stock_parts/micro_laser/quadultra/proc/<init>  (code/modules/research/stock_parts.dm:240)
rt.def("/obj/item/weapon/stock_parts/micro_laser/quadultra/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10, "$glass", 20]));
	return f.dot;
});

rt.type(5756, "/obj/item/weapon/stock_parts/matter_bin/bluespace", "/obj/item/weapon/stock_parts/matter_bin", {
	rating: 4,
	name: "bluespace matter bin",
	desc: "A container designed to hold compressed matter awaiting reconstruction.",
	icon_state: "bluespace_matter_bin",
	origin_tech: "materials=6;programming=4;engineering=4",
	materials: null,
});

// /obj/item/weapon/stock_parts/matter_bin/bluespace/proc/<init>  (code/modules/research/stock_parts.dm:248)
rt.def("/obj/item/weapon/stock_parts/matter_bin/bluespace/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 80]));
	return f.dot;
});

rt.type(5758, "/obj/item/weapon/stock_parts/subspace/ansible", "/obj/item/weapon/stock_parts/subspace", {
	name: "subspace ansible",
	icon_state: "subspace_ansible",
	desc: "A compact module capable of sensing extradimensional activity.",
	origin_tech: "programming=2;magnets=2;materials=2;bluespace=1",
	materials: null,
});

// /obj/item/weapon/stock_parts/subspace/ansible/proc/<init>  (code/modules/research/stock_parts.dm:257)
rt.def("/obj/item/weapon/stock_parts/subspace/ansible/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30, "$glass", 10]));
	return f.dot;
});

rt.type(5759, "/obj/item/weapon/stock_parts/subspace/filter", "/obj/item/weapon/stock_parts/subspace", {
	name: "hyperwave filter",
	icon_state: "hyperwave_filter",
	desc: "A tiny device capable of filtering and converting super-intense radiowaves.",
	origin_tech: "programming=2;magnets=2",
	materials: null,
});

// /obj/item/weapon/stock_parts/subspace/filter/proc/<init>  (code/modules/research/stock_parts.dm:264)
rt.def("/obj/item/weapon/stock_parts/subspace/filter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30, "$glass", 10]));
	return f.dot;
});

rt.type(5760, "/obj/item/weapon/stock_parts/subspace/amplifier", "/obj/item/weapon/stock_parts/subspace", {
	name: "subspace amplifier",
	icon_state: "subspace_amplifier",
	desc: "A compact micro-machine capable of amplifying weak subspace transmissions.",
	origin_tech: "programming=2;magnets=2;materials=2;bluespace=2",
	materials: null,
});

// /obj/item/weapon/stock_parts/subspace/amplifier/proc/<init>  (code/modules/research/stock_parts.dm:271)
rt.def("/obj/item/weapon/stock_parts/subspace/amplifier/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30, "$glass", 10]));
	return f.dot;
});

rt.type(5761, "/obj/item/weapon/stock_parts/subspace/treatment", "/obj/item/weapon/stock_parts/subspace", {
	name: "subspace treatment disk",
	icon_state: "treatment_disk",
	desc: "A compact micro-machine capable of stretching out hyper-compressed radio waves.",
	origin_tech: "programming=2;magnets=2;materials=2;bluespace=2",
	materials: null,
});

// /obj/item/weapon/stock_parts/subspace/treatment/proc/<init>  (code/modules/research/stock_parts.dm:278)
rt.def("/obj/item/weapon/stock_parts/subspace/treatment/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30, "$glass", 10]));
	return f.dot;
});

rt.type(5762, "/obj/item/weapon/stock_parts/subspace/analyzer", "/obj/item/weapon/stock_parts/subspace", {
	name: "subspace wavelength analyzer",
	icon_state: "wavelength_analyzer",
	desc: "A sophisticated analyzer capable of analyzing cryptic subspace wavelengths.",
	origin_tech: "programming=2;magnets=2;materials=2;bluespace=2",
	materials: null,
});

// /obj/item/weapon/stock_parts/subspace/analyzer/proc/<init>  (code/modules/research/stock_parts.dm:285)
rt.def("/obj/item/weapon/stock_parts/subspace/analyzer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30, "$glass", 10]));
	return f.dot;
});

rt.type(5763, "/obj/item/weapon/stock_parts/subspace/crystal", "/obj/item/weapon/stock_parts/subspace", {
	name: "ansible crystal",
	icon_state: "ansible_crystal",
	desc: "A crystal made from pure glass used to transmit laser databursts to subspace.",
	origin_tech: "magnets=2;materials=2;bluespace=2;plasmatech=2",
	materials: null,
});

// /obj/item/weapon/stock_parts/subspace/crystal/proc/<init>  (code/modules/research/stock_parts.dm:292)
rt.def("/obj/item/weapon/stock_parts/subspace/crystal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 50]));
	return f.dot;
});

rt.type(5764, "/obj/item/weapon/stock_parts/subspace/transmitter", "/obj/item/weapon/stock_parts/subspace", {
	name: "subspace transmitter",
	icon_state: "subspace_transmitter",
	desc: "A large piece of equipment used to open a window into the subspace dimension.",
	origin_tech: "magnets=2;materials=2;bluespace=2",
	materials: null,
});

// /obj/item/weapon/stock_parts/subspace/transmitter/proc/<init>  (code/modules/research/stock_parts.dm:299)
rt.def("/obj/item/weapon/stock_parts/subspace/transmitter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50]));
	return f.dot;
});
