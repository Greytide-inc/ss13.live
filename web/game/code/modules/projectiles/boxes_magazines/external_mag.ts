// From code/modules/projectiles/boxes_magazines/external_mag.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9893, "/obj/item/ammo_box/magazine/m10mm/rifle", "/obj/item/ammo_box/magazine/m10mm", {
	origin_tech: "combat=2",
	name: "rifle magazine (10mm)",
	desc: "A well-worn magazine fitted for the surplus rifle.",
	icon_state: "75-8",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c10mm"),
	caliber: "10mm",
	max_ammo: 10,
});

// /obj/item/ammo_box/magazine/m10mm/rifle/proc/update_icon  (code/modules/projectiles/boxes_magazines/external_mag.dm:26)
rt.def("/obj/item/ammo_box/magazine/m10mm/rifle/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.callSrc(f, "ammo_count", []))) {
		rt.setSv(f, "icon_state", "75-8");
	} else {
		rt.setSv(f, "icon_state", "75-0");
	}
	return f.dot;
});

rt.type(9897, "/obj/item/ammo_box/magazine/m45", "/obj/item/ammo_box/magazine", {
	name: "handgun magazine (.45)",
	icon_state: "45-8",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c45"),
	caliber: ".45",
	max_ammo: 8,
});

// /obj/item/ammo_box/magazine/m45/proc/update_icon  (code/modules/projectiles/boxes_magazines/external_mag.dm:58)
rt.def("/obj/item/ammo_box/magazine/m45/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.callSrc(f, "ammo_count", []))) {
		$0 = "8";
	} else {
		$0 = "0";
	}
	rt.setSv(f, "icon_state", fmt("45-＀", [$0]));
	return f.dot;
});

rt.type(9898, "/obj/item/ammo_box/magazine/wt550m9", "/obj/item/ammo_box/magazine", {
	name: "wt550 magazine (4.6x30mm)",
	icon_state: "46x30mmt-20",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c46x30mm"),
	caliber: "4.6x30mm",
	max_ammo: 20,
});

// /obj/item/ammo_box/magazine/wt550m9/proc/update_icon  (code/modules/projectiles/boxes_magazines/external_mag.dm:69)
rt.def("/obj/item/ammo_box/magazine/wt550m9/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("46x30mmt-＀", [rt.call(f, P("/proc/round"), null, [rt.callSrc(f, "ammo_count", []), 4])]));
	return f.dot;
});

rt.type(9899, "/obj/item/ammo_box/magazine/wt550m9/wtap", "/obj/item/ammo_box/magazine/wt550m9", {
	name: "wt550 magazine (Armour Piercing 4.6x30mm)",
	icon_state: "46x30mmtA-20",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c46x30mmap"),
});

// /obj/item/ammo_box/magazine/wt550m9/wtap/proc/update_icon  (code/modules/projectiles/boxes_magazines/external_mag.dm:78)
rt.def("/obj/item/ammo_box/magazine/wt550m9/wtap/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("46x30mmtA-＀", [rt.call(f, P("/proc/round"), null, [rt.callSrc(f, "ammo_count", []), 4])]));
	return f.dot;
});

rt.type(9900, "/obj/item/ammo_box/magazine/wt550m9/wttx", "/obj/item/ammo_box/magazine/wt550m9", {
	name: "wt550 magazine (Toxin Tipped 4.6x30mm)",
	icon_state: "46x30mmtT-20",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c46x30mmtox"),
});

// /obj/item/ammo_box/magazine/wt550m9/wttx/proc/update_icon  (code/modules/projectiles/boxes_magazines/external_mag.dm:87)
rt.def("/obj/item/ammo_box/magazine/wt550m9/wttx/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("46x30mmtT-＀", [rt.call(f, P("/proc/round"), null, [rt.callSrc(f, "ammo_count", []), 4])]));
	return f.dot;
});

rt.type(9901, "/obj/item/ammo_box/magazine/wt550m9/wtic", "/obj/item/ammo_box/magazine/wt550m9", {
	name: "wt550 magazine (Incindiary 4.6x30mm)",
	icon_state: "46x30mmtI-20",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c46x30mminc"),
});

// /obj/item/ammo_box/magazine/wt550m9/wtic/proc/update_icon  (code/modules/projectiles/boxes_magazines/external_mag.dm:96)
rt.def("/obj/item/ammo_box/magazine/wt550m9/wtic/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("46x30mmtI-＀", [rt.call(f, P("/proc/round"), null, [rt.callSrc(f, "ammo_count", []), 4])]));
	return f.dot;
});

rt.type(9902, "/obj/item/ammo_box/magazine/uzim9mm", "/obj/item/ammo_box/magazine", {
	name: "uzi magazine (9mm)",
	icon_state: "uzi9mm-32",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c9mm"),
	caliber: "9mm",
	max_ammo: 32,
});

// /obj/item/ammo_box/magazine/uzim9mm/proc/update_icon  (code/modules/projectiles/boxes_magazines/external_mag.dm:107)
rt.def("/obj/item/ammo_box/magazine/uzim9mm/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("uzi9mm-＀", [rt.call(f, P("/proc/round"), null, [rt.callSrc(f, "ammo_count", []), 4])]));
	return f.dot;
});

rt.type(9903, "/obj/item/ammo_box/magazine/smgm9mm", "/obj/item/ammo_box/magazine", {
	name: "SMG magazine (9mm)",
	icon_state: "smg9mm-42",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c9mm"),
	caliber: "9mm",
	max_ammo: 21,
});

// /obj/item/ammo_box/magazine/smgm9mm/proc/update_icon  (code/modules/projectiles/boxes_magazines/external_mag.dm:118)
rt.def("/obj/item/ammo_box/magazine/smgm9mm/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.callSrc(f, "ammo_count", []))) {
		$0 = "42";
	} else {
		$0 = "0";
	}
	rt.setSv(f, "icon_state", fmt("smg9mm-＀", [$0]));
	return f.dot;
});

rt.type(9907, "/obj/item/ammo_box/magazine/pistolm9mm", "/obj/item/ammo_box/magazine", {
	name: "pistol magazine (9mm)",
	icon_state: "9x19p-8",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c9mm"),
	caliber: "9mm",
	max_ammo: 15,
});

// /obj/item/ammo_box/magazine/pistolm9mm/proc/update_icon  (code/modules/projectiles/boxes_magazines/external_mag.dm:141)
rt.def("/obj/item/ammo_box/magazine/pistolm9mm/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.callSrc(f, "ammo_count", []))) {
		$0 = "8";
	} else {
		$0 = "0";
	}
	rt.setSv(f, "icon_state", fmt("9x19p-＀", [$0]));
	return f.dot;
});

rt.type(9908, "/obj/item/ammo_box/magazine/smgm45", "/obj/item/ammo_box/magazine", {
	origin_tech: "combat=2",
	name: "SMG magazine (.45)",
	icon_state: "c20r45-24",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c45nostamina"),
	caliber: ".45",
	max_ammo: 24,
});

// /obj/item/ammo_box/magazine/smgm45/proc/update_icon  (code/modules/projectiles/boxes_magazines/external_mag.dm:153)
rt.def("/obj/item/ammo_box/magazine/smgm45/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("c20r45-＀", [rt.call(f, P("/proc/round"), null, [rt.callSrc(f, "ammo_count", []), 2])]));
	return f.dot;
});

rt.type(9912, "/obj/item/ammo_box/magazine/m12g", "/obj/item/ammo_box/magazine", {
	origin_tech: "combat=3;syndicate=1",
	name: "shotgun magazine (12g taser slugs)",
	desc: "A drum magazine.",
	icon_state: "m12gs",
	ammo_type: rt.typePath("/obj/item/ammo_casing/shotgun/stunslug"),
	caliber: "shotgun",
	max_ammo: 8,
});

// /obj/item/ammo_box/magazine/m12g/proc/update_icon  (code/modules/projectiles/boxes_magazines/external_mag.dm:199)
rt.def("/obj/item/ammo_box/magazine/m12g/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("＀-＀", [rt.initial(f, live(f.src), "icon_state"), multiply(rt.call(f, P("/proc/Ceiling"), null, [divide(rt.callSrc(f, "ammo_count", [0]), 8)]), 8)]));
	return f.dot;
});

rt.type(9918, "/obj/item/ammo_box/magazine/sniper_rounds", "/obj/item/ammo_box/magazine", {
	origin_tech: "combat=6;syndicate=2",
	name: "sniper rounds (.50)",
	icon_state: ".50mag",
	ammo_type: rt.typePath("/obj/item/ammo_casing/point50"),
	max_ammo: 6,
	caliber: ".50",
});

// /obj/item/ammo_box/magazine/sniper_rounds/proc/update_icon  (code/modules/projectiles/boxes_magazines/external_mag.dm:239)
rt.def("/obj/item/ammo_box/magazine/sniper_rounds/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.callSrc(f, "ammo_count", []))) {
		rt.setSv(f, "icon_state", fmt("＀-ammo", [rt.initial(f, live(f.src), "icon_state")]));
	} else {
		rt.setSv(f, "icon_state", fmt("＀", [rt.initial(f, live(f.src), "icon_state")]));
	}
	return f.dot;
});

rt.type(9924, "/obj/item/ammo_box/magazine/mm195x129", "/obj/item/ammo_box/magazine", {
	origin_tech: "combat=2",
	name: "box magazine (1.95x129mm)",
	icon_state: "a762-50",
	ammo_type: rt.typePath("/obj/item/ammo_casing/mm195x129"),
	caliber: "mm195129",
	max_ammo: 50,
});

// /obj/item/ammo_box/magazine/mm195x129/proc/update_icon  (code/modules/projectiles/boxes_magazines/external_mag.dm:311)
rt.def("/obj/item/ammo_box/magazine/mm195x129/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("a762-＀", [rt.call(f, P("/proc/round"), null, [rt.callSrc(f, "ammo_count", []), 10])]));
	return f.dot;
});

rt.type(9930, "/obj/item/ammo_box/magazine/toy/smg", "/obj/item/ammo_box/magazine/toy", {
	name: "foam force SMG magazine",
	icon_state: "smg9mm-42",
	max_ammo: 20,
});

// /obj/item/ammo_box/magazine/toy/smg/proc/update_icon  (code/modules/projectiles/boxes_magazines/external_mag.dm:330)
rt.def("/obj/item/ammo_box/magazine/toy/smg/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.callSrc(f, "ammo_count", []))) {
		rt.setSv(f, "icon_state", "smg9mm-42");
	} else {
		rt.setSv(f, "icon_state", "smg9mm-0");
	}
	return f.dot;
});

rt.type(9934, "/obj/item/ammo_box/magazine/toy/smgm45", "/obj/item/ammo_box/magazine/toy", {
	name: "donksoft SMG magazine",
	caliber: "foam_force",
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/foam_dart/riot"),
	max_ammo: 20,
});

// /obj/item/ammo_box/magazine/toy/smgm45/proc/update_icon  (code/modules/projectiles/boxes_magazines/external_mag.dm:355)
rt.def("/obj/item/ammo_box/magazine/toy/smgm45/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("c20r45-＀", [rt.call(f, P("/proc/round"), null, [rt.callSrc(f, "ammo_count", []), 2])]));
	return f.dot;
});

rt.type(9935, "/obj/item/ammo_box/magazine/toy/m762", "/obj/item/ammo_box/magazine/toy", {
	name: "donksoft box magazine",
	caliber: "foam_force",
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/foam_dart/riot"),
	max_ammo: 50,
});

// /obj/item/ammo_box/magazine/toy/m762/proc/update_icon  (code/modules/projectiles/boxes_magazines/external_mag.dm:365)
rt.def("/obj/item/ammo_box/magazine/toy/m762/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("a762-＀", [rt.call(f, P("/proc/round"), null, [rt.callSrc(f, "ammo_count", []), 10])]));
	return f.dot;
});

rt.type(9888, "/obj/item/ammo_box/magazine/recharge", "/obj/item/ammo_box/magazine", {
	name: "power pack",
	desc: "A rechargeable, detachable battery that serves as a magazine for laser rifles.",
	icon_state: "oldrifle-20",
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/laser"),
	caliber: "laser",
	max_ammo: 20,
});

// /obj/item/ammo_box/magazine/recharge/proc/update_icon  (code/modules/projectiles/boxes_magazines/external_mag.dm:382)
rt.def("/obj/item/ammo_box/magazine/recharge/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "desc", fmt("＀ It has ＀ shot５ left.", [rt.initial(f, live(f.src), "desc"), rt.len(f, rt.sv(f, "stored_ammo"))]));
	rt.setSv(f, "icon_state", fmt("oldrifle-＀", [rt.call(f, P("/proc/round"), null, [rt.callSrc(f, "ammo_count", []), 4])]));
	return f.dot;
});
