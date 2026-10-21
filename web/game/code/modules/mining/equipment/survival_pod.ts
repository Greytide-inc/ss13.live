// From code/modules/mining/equipment/survival_pod.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7544, "/obj/item/weapon/survivalcapsule", "/obj/item/weapon", {
	template_id: "shelter_alpha",
	template: null,
	used: 0,
	name: "bluespace shelter capsule",
	desc: "An emergency shelter stored within a pocket of bluespace.",
	icon_state: "capsule",
	icon: rt.rsc("icons/obj/mining.dmi"),
	w_class: 1,
	origin_tech: "engineering=3;bluespace=3",
});

// /obj/item/weapon/survivalcapsule/proc/get_template  (code/modules/mining/equipment/survival_pod.dm:24)  may sleep
rt.def("/obj/item/weapon/survivalcapsule/proc/get_template", function* get_template(f: Frame) {
	if (truthy(rt.sv(f, "template"))) {
		return live(f.dot);
	}
	rt.setSv(f, "template", rt.index(rt.fv(f, "shelter_templates", rt.gl("SSmapping")), rt.sv(f, "template_id")));
	if (truthy(rt.sv(f, "template"))) return f.dot;
	rt.throw_(f, (yield* g.new_(f, T("/exception"), [fmt("Shelter template (＀) not found!", [rt.sv(f, "template_id")]), "code/modules/mining/equipment/survival_pod.dm", 26])));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/survivalcapsule/proc/Destroy  (code/modules/mining/equipment/survival_pod.dm:31)  may sleep
rt.def("/obj/item/weapon/survivalcapsule/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "template", null);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/weapon/survivalcapsule/proc/examine  (code/modules/mining/equipment/survival_pod.dm:34)  may sleep
rt.def("/obj/item/weapon/survivalcapsule/proc/examine", function* examine(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "get_template");
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("This capsule has the ＀ stored.", [rt.fv(f, "name", rt.sv(f, "template"))])]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), rt.fv(f, "description", rt.sv(f, "template"))]);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/survivalcapsule/proc/attack_self  (code/modules/mining/equipment/survival_pod.dm:41)  may sleep
rt.def("/obj/item/weapon/survivalcapsule/proc/attack_self", function* attack_self(f: Frame) {
	let deploy_location: Value = null, status: Value = null, width: Value = null, height: Value = null, _T: Value = null;
	let $0: any;
	f.vars = () => [deploy_location, status, width, height, _T, $0];
	yield* g.srcCall(f, "get_template");
	if (truthy(rt.sv(f, "used"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "loc"), "visible_message", [fmt("<span class='warning'>＄！ begins to shake. Stand back!</span>", [live(f.src)])]);
	rt.setSv(f, "used", 1);
	yield* g.call(f, P("/proc/sleep"), null, [50]);
	deploy_location = rt.getStep(f, live(f.src), 0);
	$0 = (status = (yield* g.callName(f, rt.sv(f, "template"), "check_deploy", [live(deploy_location)])));
	if ($0 === "bad area") {
		yield* g.callName(f, rt.fv(f, "loc", live(f.src)), "visible_message", [fmt("<span class='warning'>＄！ will not function in this area.</span>", [live(f.src)])]);
	} else if ($0 === "bad turfs" || $0 === "anchored objects") {
		width = rt.fv(f, "width", rt.sv(f, "template"));
		height = rt.fv(f, "height", rt.sv(f, "template"));
		yield* g.callName(f, rt.fv(f, "loc", live(f.src)), "visible_message", [fmt("<span class='warning'>＄！ doesn't have room to deploy! You need to clear a ＀x＀ area!</span>", [live(f.src), live(width), live(height)])]);
	}
	if (!isEqual(live(status), "allowed")) {
		rt.setSv(f, "used", 0);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/effects/phasein.ogg"), 100, 1]);
	if ((!isEqual(rt.gv(f, "z", (_T = live(deploy_location))), 5) && !isEqual(rt.fv(f, "z", live(_T)), 5))) {
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ activated a bluespace capsule away from the mining level! ＀", [fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.usr)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.usr)])]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])]);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ activated a bluespace capsule away from the mining level at ＀＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/get_area"), null, [live(_T)])), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])]);
	}
	yield* g.callName(f, rt.sv(f, "template"), "load", [null, live(deploy_location), "centered", 1], rt.Args.Named);
	yield* g.new_(f, T("/obj/effect/particle_effect/smoke"), [rt.getStep(f, live(f.src), 0)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(12228, "/obj/structure/window/shuttle/survival_pod", "/obj/structure/window/shuttle", {
	smooth: 2,
	canSmoothWith: null,
	name: "pod window",
	icon: rt.rsc("icons/obj/smooth_structures/pod_window.dmi"),
	icon_state: "smooth",
});

// /obj/structure/window/shuttle/survival_pod/proc/<init>  (code/modules/mining/equipment/survival_pod.dm:84)
rt.def("/obj/structure/window/shuttle/survival_pod/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/closed/wall/mineral/titanium/survival"), T("/obj/machinery/door/airlock/survival_pod"), T("/obj/structure/window/shuttle/survival_pod")));
	return f.dot;
});

rt.type(10265, "/obj/machinery/door/airlock/survival_pod", "/obj/machinery/door/airlock", {
	expected_dir: 2,
	overlays_file: rt.rsc("icons/obj/doors/airlocks/survival/survival_overlays.dmi"),
	note_overlay_file: rt.rsc("icons/obj/doors/airlocks/survival/survival_overlays.dmi"),
	name: "airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/survival/survival.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_pod"),
	opacity: 0,
	glass: 1,
});

// /obj/machinery/door/airlock/survival_pod/proc/setDir  (code/modules/mining/equipment/survival_pod.dm:103)
rt.def("/obj/machinery/door/airlock/survival_pod/proc/setDir", function setDir(f: Frame) {
	f.args[0] = rt.sv(f, "expected_dir");
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["direction"] });

// /obj/machinery/door/airlock/survival_pod/proc/shuttleRotate  (code/modules/mining/equipment/survival_pod.dm:107)  may sleep
rt.def("/obj/machinery/door/airlock/survival_pod/proc/shuttleRotate", function* shuttleRotate(f: Frame) {
	rt.setSv(f, "expected_dir", (yield* g.call(f, P("/proc/angle2dir"), null, [add(live(f.args[0]), (yield* g.call(f, P("/proc/dir2angle"), null, [rt.sv(f, "dir")])))])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["rotation"] });

rt.type(12457, "/obj/structure/door_assembly/door_assembly_pod", "/obj/structure/door_assembly", {
	expected_dir: 2,
	overlays_file: rt.rsc("icons/obj/doors/airlocks/survival/survival_overlays.dmi"),
	airlock_type: rt.typePath("/obj/machinery/door/airlock/survival_pod"),
	anchored: 1,
	state: 1,
	mineral: "glass",
	material: "glass",
	name: "pod airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/survival/survival.dmi"),
});

// /obj/structure/door_assembly/door_assembly_pod/proc/setDir  (code/modules/mining/equipment/survival_pod.dm:126)
rt.def("/obj/structure/door_assembly/door_assembly_pod/proc/setDir", function setDir(f: Frame) {
	f.args[0] = rt.sv(f, "expected_dir");
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["direction"] });

// /obj/structure/door_assembly/door_assembly_pod/proc/shuttleRotate  (code/modules/mining/equipment/survival_pod.dm:130)  may sleep
rt.def("/obj/structure/door_assembly/door_assembly_pod/proc/shuttleRotate", function* shuttleRotate(f: Frame) {
	rt.setSv(f, "expected_dir", (yield* g.call(f, P("/proc/angle2dir"), null, [add(live(f.args[0]), (yield* g.call(f, P("/proc/dir2angle"), null, [rt.sv(f, "dir")])))])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["rotation"] });

rt.type(10827, "/obj/machinery/sleeper/survival_pod", "/obj/machinery/sleeper", {
	icon: rt.rsc("icons/obj/lavaland/survival_pod.dmi"),
	icon_state: "sleeper",
});

// /obj/machinery/sleeper/survival_pod/proc/update_icon  (code/modules/mining/equipment/survival_pod.dm:156)
rt.def("/obj/machinery/sleeper/survival_pod/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "state_open"))) {
		rt.callSrc(f, "cut_overlays", []);
	} else {
		rt.callSrc(f, "add_overlay", ["sleeper_cover"]);
	}
	return f.dot;
});

rt.type(9248, "/obj/item/device/gps/computer", "/obj/item/device/gps", {
	anchored: 1,
	name: "pod computer",
	icon_state: "pod_computer",
	icon: rt.rsc("icons/obj/lavaland/pod_computer.dmi"),
	density: 1,
	pixel_y: -32,
});

// /obj/item/device/gps/computer/proc/attackby  (code/modules/mining/equipment/survival_pod.dm:170)  may sleep
rt.def("/obj/item/device/gps/computer/proc/attackby", function* attackby(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ disassembles the gps.</span>", [live(f.args[1])]), "<span class='notice'>You start to disassemble the gps...</span>", "You hear clanking and banging noises."]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
			yield* g.new_(f, T("/obj/item/device/gps"), [rt.sv(f, "loc")]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

// /obj/item/device/gps/computer/proc/attack_hand  (code/modules/mining/equipment/survival_pod.dm:181)  may sleep
rt.def("/obj/item/device/gps/computer/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "attack_self", live(user));
	return f.dot;
}, true);

rt.type(10913, "/obj/machinery/smartfridge/survival_pod/empty", "/obj/machinery/smartfridge/survival_pod", {
	name: "dusty survival pod storage",
	desc: "A heated storage unit. This one's seen better days.",
});

// /obj/machinery/smartfridge/survival_pod/empty/proc/Initialize  (code/modules/mining/equipment/survival_pod.dm:208)  may sleep
rt.def("/obj/machinery/smartfridge/survival_pod/empty/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.vars = () => [mapload];
	yield* g.callSuper(f, [live(mapload), 1]);
	return f.dot;
}, true);

rt.type(10912, "/obj/machinery/smartfridge/survival_pod", "/obj/machinery/smartfridge", {
	icon_on: "donkvendor",
	icon_off: "donkvendor",
	light_range: 5,
	light_power: 1.2,
	light_color: "#DDFFD3",
	max_n_of_items: 10,
	flags: 128,
	name: "survival pod storage",
	desc: "A heated storage unit.",
	icon_state: "donkvendor",
	icon: rt.rsc("icons/obj/lavaland/donkvendor.dmi"),
	pixel_y: -4,
});

// /obj/machinery/smartfridge/survival_pod/proc/accept_check  (code/modules/mining/equipment/survival_pod.dm:211)
rt.def("/obj/machinery/smartfridge/survival_pod/proc/accept_check", function accept_check(f: Frame, O: Value) {
	return (rt.istype(live(O), T("/obj/item")) ? 1 : 0);
});

// /obj/machinery/smartfridge/survival_pod/proc/Initialize  (code/modules/mining/equipment/survival_pod.dm:214)  may sleep
rt.def("/obj/machinery/smartfridge/survival_pod/proc/Initialize", function* Initialize(f: Frame) {
	let i: Value = null, W: Value = null, D: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [i, W, D, G, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.args[1]))) {
		return live(f.dot);
	}
	i = null;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.srcCall(f, "load", (W = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/donkpocket/warm"), [live(f.src)]))));
	}
	rt.endFor(f, 0);
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		yield* g.srcCall(f, "load", (D = (yield* g.new_(f, T("/obj/item/weapon/storage/pill_bottle/dice"), [live(f.src)]))));
	} else {
		yield* g.srcCall(f, "load", (G = (yield* g.new_(f, T("/obj/item/device/instrument/guitar"), [live(f.src)]))));
	}
	return f.dot;
}, true, { args: ["mapload", "empty"] });

rt.type(12958, "/obj/structure/fans", "/obj/structure", {
	arbitraryatmosblockingvar: 1,
	buildstacktype: rt.typePath("/obj/item/stack/sheet/metal"),
	buildstackamount: 5,
	anchored: 1,
	CanAtmosPass: 0,
	icon: rt.rsc("icons/obj/lavaland/survival_pod.dmi"),
	icon_state: "fans",
	name: "environmental regulation system",
	desc: "A large machine releasing a constant gust of air.",
	density: 1,
});

// /obj/structure/fans/proc/deconstruct  (code/modules/mining/equipment/survival_pod.dm:241)  may sleep
rt.def("/obj/structure/fans/proc/deconstruct", function* deconstruct(f: Frame) {
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if (truthy(rt.sv(f, "buildstacktype"))) {
			yield* g.new_(f, rt.sv(f, "buildstacktype"), [rt.sv(f, "loc"), rt.sv(f, "buildstackamount")]);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/fans/proc/attackby  (code/modules/mining/equipment/survival_pod.dm:247)  may sleep
rt.def("/obj/structure/fans/proc/attackby", function* attackby(f: Frame) {
	if (!(truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
	yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ disassembles the fan.</span>", [live(f.args[1])]), "<span class='notice'>You start to disassemble the fan...</span>", "You hear clanking and banging noises."]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) return f.dot;
	yield* g.srcCall(f, "deconstruct");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

// /obj/structure/fans/proc/Initialize  (code/modules/mining/equipment/survival_pod.dm:264)
rt.def("/obj/structure/fans/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "air_update_turf", [1]);
	return f.dot;
}, false, { args: ["mapload"] });

// /obj/structure/fans/proc/Destroy  (code/modules/mining/equipment/survival_pod.dm:268)  may sleep
rt.def("/obj/structure/fans/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	_T = rt.sv(f, "loc");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, live(_T), "air_update_turf", [1]);
	return f.dot;
}, true);

rt.type(10114, "/obj/item/fakeartefact", "/obj/item", {
	possible: null,
	name: "expensive forgery",
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "x2",
});

// /obj/item/fakeartefact/proc/<init>  (code/modules/mining/equipment/survival_pod.dm:304)
rt.def("/obj/item/fakeartefact/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible", rt.list(T("/obj/item/ship_in_a_bottle"), T("/obj/item/weapon/gun/energy/pulse"), T("/obj/item/weapon/sleeping_carp_scroll"), T("/obj/item/weapon/melee/supermatter_sword"), T("/obj/item/weapon/shield/changeling"), T("/obj/item/weapon/lava_staff"), T("/obj/item/weapon/dash/energy_katana"), T("/obj/item/weapon/hierophant_club"), T("/obj/item/weapon/his_grace"), T("/obj/item/weapon/gun/ballistic/minigun"), T("/obj/item/weapon/gun/ballistic/automatic/l6_saw"), T("/obj/item/weapon/gun/magic/staff/chaos"), T("/obj/item/weapon/gun/magic/staff/spellblade"), T("/obj/item/weapon/gun/magic/wand/death"), T("/obj/item/weapon/gun/magic/wand/fireball"), T("/obj/item/stack/telecrystal/twenty"), T("/obj/item/nuke_core"), T("/obj/item/phylactery"), T("/obj/item/weapon/banhammer")));
	return f.dot;
});

// /obj/item/fakeartefact/proc/Initialize  (code/modules/mining/equipment/survival_pod.dm:325)  may sleep
rt.def("/obj/item/fakeartefact/proc/Initialize", function* Initialize(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "name", rt.initial(f, (I = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "possible")])), "name"));
	rt.setSv(f, "icon", rt.initial(f, live(I), "icon"));
	rt.setSv(f, "desc", rt.initial(f, live(I), "desc"));
	rt.setSv(f, "icon_state", rt.initial(f, live(I), "icon_state"));
	rt.setSv(f, "item_state", rt.initial(f, live(I), "item_state"));
	return f.dot;
}, true);
