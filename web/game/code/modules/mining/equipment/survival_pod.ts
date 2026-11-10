// Based on /tg/station's code/modules/mining/equipment/survival_pod.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


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

// survival_pod.dm:24
rt.def("/obj/item/weapon/survivalcapsule/proc/get_template", function* get_template(f: Frame) {
	if (this.template) {
		return f.dot;
	}
	this.template = rt.index(GLOB.SSmapping.shelter_templates, this.template_id);
	if (this.template) return f.dot;
	rt.throw_(f, (yield* new_(T("/exception"), `Shelter template (${this.template_id}) not found!`, "code/modules/mining/equipment/survival_pod.dm", 26)));
	yield* qdel(this);
	return f.dot;
}, true);

// survival_pod.dm:31
rt.def("/obj/item/weapon/survivalcapsule/proc/Destroy", function* Destroy(f: Frame) {
	this.template = null;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// survival_pod.dm:34
rt.def("/obj/item/weapon/survivalcapsule/proc/examine", function* examine(f: Frame, user: Value) {
	f.dot = (yield* parent_proc());
	yield* this.get_template();
	to_chat(user, `This capsule has the ${this.template.name} stored.`);
	to_chat(user, this.template.description);
	return f.dot;
}, true);

// survival_pod.dm:41
rt.def("/obj/item/weapon/survivalcapsule/proc/attack_self", function* attack_self(f: Frame) {
	let status: Value = null, width: Value = null, height: Value = null, _T: Value = null;
	yield* this.get_template();
	if (this.used) return f.dot;
	this.loc.visible_message(fmt("<span class='warning'>＄！ begins to shake. Stand back!</span>", [this]));
	this.used = 1;
	yield* sleep(50);
	let deploy_location: Value = rt.getStep(f, this, 0);
	const subject = (status = this.template.check_deploy(deploy_location));
	if (subject === "bad area") {
		this.loc.visible_message(fmt("<span class='warning'>＄！ will not function in this area.</span>", [this]));
	} else if (subject === "bad turfs" || subject === "anchored objects") {
		width = this.template.width;
		height = this.template.height;
		this.loc.visible_message(fmt("<span class='warning'>＄！ doesn't have room to deploy! You need to clear a ＀x＀ area!</span>", [this, width, height]));
	}
	if (status != "allowed") {
		this.used = 0;
		return f.dot;
	}
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/effects/phasein.ogg"), 100, 1);
	if ((_T = deploy_location).z != ZLEVEL_MINING && _T.z != ZLEVEL_LAVALAND) {
		message_admins(`${`${key_name_admin(f.usr)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [f.usr])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [f.usr])}`} activated a bluespace capsule away from the mining level! ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`);
		log_admin(`${key_name(f.usr)} activated a bluespace capsule away from the mining level at ${get_area(_T)}${`(${_T.x},${_T.y},${_T.z})`}`);
	}
	yield* this.template.load(deploy_location, { centered: 1 });
	yield* new_(T("/obj/effect/particle_effect/smoke"), rt.getStep(f, this, 0));
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12228, "/obj/structure/window/shuttle/survival_pod", "/obj/structure/window/shuttle", {
	smooth: 2,
	canSmoothWith: null,
	name: "pod window",
	icon: rt.rsc("icons/obj/smooth_structures/pod_window.dmi"),
	icon_state: "smooth",
});

// survival_pod.dm:84
rt.def("/obj/structure/window/shuttle/survival_pod/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/closed/wall/mineral/titanium/survival"), T("/obj/machinery/door/airlock/survival_pod"), T("/obj/structure/window/shuttle/survival_pod"));
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

// survival_pod.dm:103
rt.def("/obj/machinery/door/airlock/survival_pod/proc/setDir", function setDir(f: Frame) {
	f.args[0] = this.expected_dir;
	parent_proc();
	return f.dot;
}, false, { args: ["direction"] });

// survival_pod.dm:107
rt.def("/obj/machinery/door/airlock/survival_pod/proc/shuttleRotate", function* shuttleRotate(f: Frame, rotation: Value) {
	this.expected_dir = angle2dir(rotation + dir2angle(this.dir));
	yield* parent_proc();
	return f.dot;
}, true);

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

// survival_pod.dm:126
rt.def("/obj/structure/door_assembly/door_assembly_pod/proc/setDir", function setDir(f: Frame) {
	f.args[0] = this.expected_dir;
	parent_proc();
	return f.dot;
}, false, { args: ["direction"] });

// survival_pod.dm:130
rt.def("/obj/structure/door_assembly/door_assembly_pod/proc/shuttleRotate", function* shuttleRotate(f: Frame, rotation: Value) {
	this.expected_dir = angle2dir(rotation + dir2angle(this.dir));
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(10827, "/obj/machinery/sleeper/survival_pod", "/obj/machinery/sleeper", {
	icon: rt.rsc("icons/obj/lavaland/survival_pod.dmi"),
	icon_state: "sleeper",
});

// survival_pod.dm:156
rt.def("/obj/machinery/sleeper/survival_pod/proc/update_icon", function update_icon(f: Frame) {
	if (this.state_open) {
		this.cut_overlays();
	} else {
		this.add_overlay("sleeper_cover");
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

// survival_pod.dm:170
rt.def("/obj/item/device/gps/computer/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/wrench")) && !rt.bitAnd(this.flags, NODECONSTRUCT)) {
		playsound(this.loc, W.usesound, 50, 1);
		user.visible_message(`<span class='warning'>${user} disassembles the gps.</span>`, "<span class='notice'>You start to disassemble the gps...</span>", "You hear clanking and banging noises.");
		if (yield* do_after(user, 20 * W.toolspeed, { target: this })) {
			yield* new_(T("/obj/item/device/gps"), this.loc);
			yield* qdel(this);
		}
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// survival_pod.dm:181
rt.def("/obj/item/device/gps/computer/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* this.attack_self(user);
	return f.dot;
}, true);

rt.type(10913, "/obj/machinery/smartfridge/survival_pod/empty", "/obj/machinery/smartfridge/survival_pod", {
	name: "dusty survival pod storage",
	desc: "A heated storage unit. This one's seen better days.",
});

// survival_pod.dm:208
rt.def("/obj/machinery/smartfridge/survival_pod/empty/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc(mapload, 1);
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

// survival_pod.dm:211
rt.def("/obj/machinery/smartfridge/survival_pod/proc/accept_check", function accept_check(f: Frame, O: Value) {
	return (rt.istype(O, T("/obj/item")) ? 1 : 0);
});

// survival_pod.dm:214
rt.def("/obj/machinery/smartfridge/survival_pod/proc/Initialize", function* Initialize(f: Frame, mapload: Value, empty: Value) {
	let i: Value = null, W: Value = null, D: Value = null, G: Value = null;
	let $e: any;
	f.dot = (yield* parent_proc());
	if (empty) {
		return f.dot;
	}
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* this.load((W = (yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/donkpocket/warm"), this))));
	}
	rt.endFor(f, 0);
	if (prob(50)) {
		yield* this.load((D = (yield* new_(T("/obj/item/weapon/storage/pill_bottle/dice"), this))));
	} else {
		yield* this.load((G = (yield* new_(T("/obj/item/device/instrument/guitar"), this))));
	}
	return f.dot;
}, true);

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

// survival_pod.dm:241
rt.def("/obj/structure/fans/proc/deconstruct", function* deconstruct(f: Frame) {
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (this.buildstacktype) {
			yield* new_(this.buildstacktype, this.loc, this.buildstackamount);
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

// survival_pod.dm:247
rt.def("/obj/structure/fans/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (!(rt.istype(W, T("/obj/item/weapon/wrench")) && !rt.bitAnd(this.flags, NODECONSTRUCT))) return f.dot;
	playsound(this.loc, W.usesound, 50, 1);
	user.visible_message(`<span class='warning'>${user} disassembles the fan.</span>`, "<span class='notice'>You start to disassemble the fan...</span>", "You hear clanking and banging noises.");
	if (!(yield* do_after(user, 20 * W.toolspeed, { target: this }))) return f.dot;
	yield* this.deconstruct();
	return (yield* parent_proc());
}, true);

// survival_pod.dm:264
rt.def("/obj/structure/fans/proc/Initialize", function Initialize(f: Frame, mapload: Value) {
	f.dot = parent_proc();
	this.air_update_turf(1);
	return f.dot;
}, false);

// survival_pod.dm:268
rt.def("/obj/structure/fans/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = this.loc;
	f.dot = (yield* parent_proc());
	_T.air_update_turf(1);
	return f.dot;
}, true);

rt.type(10114, "/obj/item/fakeartefact", "/obj/item", {
	possible: null,
	name: "expensive forgery",
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "x2",
});

// survival_pod.dm:304
rt.def("/obj/item/fakeartefact/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible = list(T("/obj/item/ship_in_a_bottle"), T("/obj/item/weapon/gun/energy/pulse"), T("/obj/item/weapon/sleeping_carp_scroll"), T("/obj/item/weapon/melee/supermatter_sword"), T("/obj/item/weapon/shield/changeling"), T("/obj/item/weapon/lava_staff"), T("/obj/item/weapon/dash/energy_katana"), T("/obj/item/weapon/hierophant_club"), T("/obj/item/weapon/his_grace"), T("/obj/item/weapon/gun/ballistic/minigun"), T("/obj/item/weapon/gun/ballistic/automatic/l6_saw"), T("/obj/item/weapon/gun/magic/staff/chaos"), T("/obj/item/weapon/gun/magic/staff/spellblade"), T("/obj/item/weapon/gun/magic/wand/death"), T("/obj/item/weapon/gun/magic/wand/fireball"), T("/obj/item/stack/telecrystal/twenty"), T("/obj/item/nuke_core"), T("/obj/item/phylactery"), T("/obj/item/weapon/banhammer"));
	return f.dot;
});

// survival_pod.dm:325
rt.def("/obj/item/fakeartefact/proc/Initialize", function* Initialize(f: Frame) {
	let I: Value = null;
	f.dot = (yield* parent_proc());
	this.name = rt.initial(f, (I = pick(this.possible)), "name");
	this.icon = rt.initial(f, I, "icon");
	this.desc = rt.initial(f, I, "desc");
	this.icon_state = rt.initial(f, I, "icon_state");
	this.item_state = rt.initial(f, I, "item_state");
	return f.dot;
}, true);
