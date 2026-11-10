// Based on /tg/station's code/modules/mob/living/silicon/robot/robot_modules.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


rt.type(7551, "/obj/item/weapon/robot_module", "/obj/item/weapon", {
	basic_modules: null,
	emag_modules: null,
	ratvar_modules: null,
	modules: null,
	added_modules: null,
	storages: null,
	cyborg_base_icon: "robot",
	special_light_key: null,
	moduleselect_icon: "nomod",
	can_be_pushed: 1,
	magpulsing: 0,
	clean_on_move: 0,
	hat_offset: -3,
	ride_offset_x: null,
	ride_offset_y: null,
	ride_allow_incapacitated: 0,
	allow_riding: 1,
	flags: 64,
	name: "Default",
	icon: rt.rsc("icons/obj/module.dmi"),
	icon_state: "std_module",
	w_class: 6,
	item_state: "electronic",
});

// robot_modules.dm:9
rt.def("/obj/item/weapon/robot_module/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.basic_modules = list();

	this.emag_modules = list();

	this.ratvar_modules = list();

	this.modules = list();

	this.added_modules = list();

	this.storages = list();
	this.ride_offset_x = rt.alist(f, ["north", 0, "south", 0, "east", -6, "west", 6]);
	this.ride_offset_y = rt.alist(f, ["north", 4, "south", 4, "east", 3, "west", 3]);
	return f.dot;
});

// robot_modules.dm:36
rt.def("/obj/item/weapon/robot_module/proc/New", function* New(f: Frame) {
	let i: Value = null, I: Value = null;
	yield* parent_proc();
	for (i of each(this.basic_modules)) {
		this.basic_modules += (I = (yield* new_(i, this)));
		this.basic_modules -= i;
	}
	i = null;
	for (i of each(this.emag_modules)) {
		this.emag_modules += (I = (yield* new_(i, this)));
		this.emag_modules -= i;
	}
	i = null;
	for (i of each(this.ratvar_modules)) {
		this.ratvar_modules += (I = (yield* new_(i, this)));
		this.ratvar_modules -= i;
	}
	return f.dot;
}, true);

// robot_modules.dm:51
rt.def("/obj/item/weapon/robot_module/proc/Destroy", function* Destroy(f: Frame) {
	this.basic_modules.Cut();
	this.emag_modules.Cut();
	this.ratvar_modules.Cut();
	this.modules.Cut();
	this.added_modules.Cut();
	this.storages.Cut();
	return (yield* parent_proc());
}, true);

// robot_modules.dm:60
rt.def("/obj/item/weapon/robot_module/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let O: Value = null;
	for (O of each(this.modules, T("/obj"))) {
		yield* O.emp_act(severity);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// robot_modules.dm:65
rt.def("/obj/item/weapon/robot_module/proc/get_usable_modules", function get_usable_modules(f: Frame) {
	f.dot = this.modules.Copy();
	return f.dot;
});

// robot_modules.dm:68
rt.def("/obj/item/weapon/robot_module/proc/get_inactive_modules", function get_inactive_modules(f: Frame) {
	let m: Value = null;
	f.dot = list();
	let R: Value = this.loc;
	for (m of each(this.get_usable_modules())) {
		if (!rt.isIn(f, m, R.held_items)) {
			f.dot += m;
		}
	}
	return f.dot;
});

// robot_modules.dm:75
rt.def("/obj/item/weapon/robot_module/proc/get_or_create_estorage", function* get_or_create_estorage(f: Frame, storage_type: Value) {
	let S: Value = null;
	for (S of each(this.storages, T("/datum/robot_energy_storage"))) {
		if (rt.op(f, "IsType", [], [S, storage_type])) {
			return S;
		}
	}
	return (yield* new_(storage_type, this));
}, true);

// robot_modules.dm:82
rt.def("/obj/item/weapon/robot_module/proc/add_module", function* add_module(f: Frame, I: Value, nonstandard: Value, requires_rebuild: Value) {
	let S: Value = null, G: Value = null, C: Value = null;
	if (rt.istype(I, T("/obj/item/stack"))) {
		if (is_type_in_list((S = I), list(T("/obj/item/stack/sheet/metal"), T("/obj/item/stack/rods"), T("/obj/item/stack/tile/plasteel")))) {
			if (rt.index(S.materials, "$metal")) {
				S.cost = rt.index(S.materials, "$metal") * 0.25;
			}
			S.source = (yield* this.get_or_create_estorage(T("/datum/robot_energy_storage/metal")));
		} else if (rt.istype(S, T("/obj/item/stack/sheet/glass"))) {
			S.cost = 500;
			S.source = (yield* this.get_or_create_estorage(T("/datum/robot_energy_storage/glass")));
		} else if (rt.istype(S, T("/obj/item/stack/sheet/rglass/cyborg"))) {
			(G = S).source = (yield* this.get_or_create_estorage(T("/datum/robot_energy_storage/metal")));
			G.glasource = (yield* this.get_or_create_estorage(T("/datum/robot_energy_storage/glass")));
		} else if (rt.istype(S, T("/obj/item/stack/medical"))) {
			S.cost = 250;
			S.source = (yield* this.get_or_create_estorage(T("/datum/robot_energy_storage/medical")));
		} else if (rt.istype(S, T("/obj/item/stack/cable_coil"))) {
			S.cost = 1;
			S.source = (yield* this.get_or_create_estorage(T("/datum/robot_energy_storage/wire")));
		} else if (rt.istype(S, T("/obj/item/stack/marker_beacon"))) {
			S.cost = 1;
			S.source = (yield* this.get_or_create_estorage(T("/datum/robot_energy_storage/beacon")));
		}
		if (S && S.source) {
			S.materials = list();
			S.is_cyborg = 1;
		}
	}
	if (rt.istype(I, T("/obj/item/weapon/restraints/handcuffs/cable"))) {
		(C = I).wirestorage = (yield* this.get_or_create_estorage(T("/datum/robot_energy_storage/wire")));
	}
	if (I.loc != this) {
		yield* I.forceMove(this);
	}
	this.modules += I;
	(rt.modField(f, I, "flags", NODROP, rt.bitOr));
	I.mouse_opacity = 2;
	if (nonstandard) {
		this.added_modules += I;
	}
	if (requires_rebuild) {
		yield* this.rebuild_modules();
	}
	return I;
}, true);

// robot_modules.dm:131
rt.def("/obj/item/weapon/robot_module/proc/remove_module", function* remove_module(f: Frame, I: Value, delete_after: Value) {
	this.basic_modules -= I;
	this.modules -= I;
	this.emag_modules -= I;
	this.ratvar_modules -= I;
	this.added_modules -= I;
	yield* this.rebuild_modules();
	if (!delete_after) return f.dot;
	yield* qdel(I);
	return f.dot;
}, true);

// robot_modules.dm:141
rt.def("/obj/item/weapon/robot_module/proc/respawn_consumable", function* respawn_consumable(f: Frame, R: Value, coeff: Value) {
	let st: Value = null, I: Value = null, F: Value = null, B: Value = null, EG: Value = null;
	coeff ??= 1;
	for (st of each(this.storages, T("/datum/robot_energy_storage"))) {
		st.energy = min(st.max_energy, st.energy + coeff * st.recharge_rate);
	}
	for (I of each(this.get_usable_modules(), T("/obj/item"))) {
		if (rt.istype(I, T("/obj/item/device/assembly/flash"))) {
			(F = I).times_used = 0;
			F.crit_fail = 0;
			yield* F.update_icon();
		} else if (rt.istype(I, T("/obj/item/weapon/melee/baton"))) {
			if ((B = I).cell) {
				B.cell.charge = B.cell.maxcharge;
			}
		} else if (rt.istype(I, T("/obj/item/weapon/gun/energy"))) {
			if (!(EG = I).chambered) {
				yield* EG.recharge_newshot();
			}
		}
	}
	R.toner = R.tonermax;
	return f.dot;
}, true);

// robot_modules.dm:162
rt.def("/obj/item/weapon/robot_module/proc/rebuild_modules", function* rebuild_modules(f: Frame) {
	let I: Value = null, i: Value = null;
	let R: Value = this.loc;
	let held_modules: Value = (yield* R.held_items.Copy());
	yield* R.uneq_all();
	this.modules = list();
	for (I of each(this.basic_modules, T("/obj/item"))) {
		yield* this.add_module(I, 0, 0);
	}
	if (R.emagged) {
		I = null;
		for (I of each(this.emag_modules, T("/obj/item"))) {
			yield* this.add_module(I, 0, 0);
		}
	}
	if (is_servant_of_ratvar(R)) {
		I = null;
		for (I of each(this.ratvar_modules, T("/obj/item"))) {
			yield* this.add_module(I, 0, 0);
		}
	}
	I = null;
	for (I of each(this.added_modules, T("/obj/item"))) {
		yield* this.add_module(I, 0, 0);
	}
	for (i of each(held_modules)) {
		if (i) {
			yield* R.activate_module(i);
		}
	}
	if (!R.hud_used) return f.dot;
	R.hud_used.update_robot_modules_display();
	return f.dot;
}, true);

// robot_modules.dm:183
rt.def("/obj/item/weapon/robot_module/proc/transform_to", function* transform_to(f: Frame, new_module_type: Value) {
	let RM: Value = null;
	let R: Value = this.loc;
	if (!(yield* (RM = (yield* new_(new_module_type, R))).be_transformed_to(this))) {
		yield* qdel(RM);
		return f.dot;
	}
	R.module = RM;
	R.update_module_innate();
	yield* RM.rebuild_modules();
	yield* ImmediateInvokeAsync(RM, P("/obj/item/weapon/robot_module/proc/do_transform_animation"));
	yield* qdel(this);
	return RM;
}, true);

// robot_modules.dm:196
rt.def("/obj/item/weapon/robot_module/proc/be_transformed_to", function be_transformed_to(f: Frame, old_module: Value) {
	let i: Value = null;
	for (i of each(old_module.added_modules)) {
		this.added_modules += i;
		old_module.added_modules -= i;
	}
	return 1;
});

// robot_modules.dm:203
rt.def("/obj/item/weapon/robot_module/proc/do_transform_animation", function* do_transform_animation(f: Frame) {
	let R: Value = null, ANM: Value = null, i: Value = null;
	let $e: any;
	(R = this.loc).notransform = 1;
	(ANM = (yield* new_(T("/obj/effect/temp_visual/decoy/fading/fivesecond"), R.loc, R))).layer = R.layer - 0.01;
	yield* new_(T("/obj/effect/temp_visual/small_smoke"), R.loc);
	if (R.hat) {
		yield* R.hat.forceMove(rt.getStep(f, R, 0));
		R.hat = null;
	}
	yield* R.update_headlamp();
	R.alpha = 0;
	rt.op(f, "Animate", [2, 6], [null, R, "alpha", 255, "time", 50]);
	let prev_lockcharge: Value = R.lockcharge;
	yield* R.SetLockdown(1);
	R.anchored = 1;
	yield* sleep(2);
	rt.forRange(f, 0, 1, 4, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		playsound(R, pick(rt.rsc("sound/items/drill_use.ogg"), rt.rsc("sound/items/jaws_cut.ogg"), rt.rsc("sound/items/jaws_pry.ogg"), rt.rsc("sound/items/welder.ogg"), rt.rsc("sound/items/ratchet.ogg")), 80, 1, -1);
		yield* sleep(12);
	}
	rt.endFor(f, 0);
	if (!prev_lockcharge) {
		yield* R.SetLockdown(0);
	}
	R.anchored = 0;
	R.notransform = 0;
	R.notify_ai(2);
	if (R.hud_used) {
		R.hud_used.update_robot_modules_display();
	}
	return f.dot;
}, true);

rt.type(7552, "/obj/item/weapon/robot_module/standard", "/obj/item/weapon/robot_module", {
	emag_modules: null,
	moduleselect_icon: "standard",
	hat_offset: -3,
	name: "Standard",
	basic_modules: null,
	ratvar_modules: null,
});

// robot_modules.dm:249
rt.def("/obj/item/weapon/robot_module/standard/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.emag_modules = list(T("/obj/item/weapon/melee/energy/sword/cyborg"));

	this.basic_modules = list(T("/obj/item/device/assembly/flash/cyborg"), T("/obj/item/weapon/reagent_containers/borghypo/epi"), T("/obj/item/device/healthanalyzer"), T("/obj/item/weapon/weldingtool/largetank/cyborg"), T("/obj/item/weapon/wrench/cyborg"), T("/obj/item/weapon/crowbar/cyborg"), T("/obj/item/stack/sheet/metal/cyborg"), T("/obj/item/stack/rods/cyborg"), T("/obj/item/stack/tile/plasteel/cyborg"), T("/obj/item/weapon/extinguisher"), T("/obj/item/weapon/pickaxe"), T("/obj/item/device/t_scanner/adv_mining_scanner"), T("/obj/item/weapon/restraints/handcuffs/cable/zipties/cyborg"), T("/obj/item/weapon/soap/nanotrasen"), T("/obj/item/borg/cyborghug"));

	this.ratvar_modules = list(T("/obj/item/clockwork/slab/cyborg"), T("/obj/item/clockwork/ratvarian_spear/cyborg"), T("/obj/item/clockwork/replica_fabricator/cyborg"));
	return f.dot;
});

rt.type(7553, "/obj/item/weapon/robot_module/medical", "/obj/item/weapon/robot_module", {
	emag_modules: null,
	cyborg_base_icon: "medical",
	moduleselect_icon: "medical",
	can_be_pushed: 0,
	hat_offset: 3,
	name: "Medical",
	basic_modules: null,
	ratvar_modules: null,
});

// robot_modules.dm:280
rt.def("/obj/item/weapon/robot_module/medical/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.emag_modules = list(T("/obj/item/weapon/reagent_containers/borghypo/hacked"));

	this.basic_modules = list(T("/obj/item/device/assembly/flash/cyborg"), T("/obj/item/device/healthanalyzer"), T("/obj/item/weapon/reagent_containers/borghypo"), T("/obj/item/weapon/reagent_containers/glass/beaker/large"), T("/obj/item/weapon/reagent_containers/dropper"), T("/obj/item/weapon/reagent_containers/syringe"), T("/obj/item/weapon/surgical_drapes"), T("/obj/item/weapon/retractor"), T("/obj/item/weapon/hemostat"), T("/obj/item/weapon/cautery"), T("/obj/item/weapon/surgicaldrill"), T("/obj/item/weapon/scalpel"), T("/obj/item/weapon/circular_saw"), T("/obj/item/weapon/extinguisher/mini"), T("/obj/item/roller/robo"), T("/obj/item/borg/cyborghug/medical"), T("/obj/item/stack/medical/gauze/cyborg"), T("/obj/item/weapon/organ_storage"), T("/obj/item/borg/lollipop"));

	this.ratvar_modules = list(T("/obj/item/clockwork/slab/cyborg/medical"), T("/obj/item/clockwork/ratvarian_spear/cyborg"));
	return f.dot;
});

rt.type(7554, "/obj/item/weapon/robot_module/engineering", "/obj/item/weapon/robot_module", {
	cyborg_base_icon: "engineer",
	moduleselect_icon: "engineer",
	magpulsing: 1,
	hat_offset: 1e+31,
	name: "Engineering",
	basic_modules: null,
	emag_modules: null,
	ratvar_modules: null,
});

// robot_modules.dm:292
rt.def("/obj/item/weapon/robot_module/engineering/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.basic_modules = list(T("/obj/item/device/assembly/flash/cyborg"), T("/obj/item/borg/sight/meson"), T("/obj/item/weapon/construction/rcd/borg"), T("/obj/item/weapon/pipe_dispenser"), T("/obj/item/weapon/extinguisher"), T("/obj/item/weapon/weldingtool/largetank/cyborg"), T("/obj/item/weapon/screwdriver/cyborg"), T("/obj/item/weapon/wrench/cyborg"), T("/obj/item/weapon/crowbar/cyborg"), T("/obj/item/weapon/wirecutters/cyborg"), T("/obj/item/device/multitool/cyborg"), T("/obj/item/device/t_scanner"), T("/obj/item/device/analyzer"), T("/obj/item/device/assembly/signaler/cyborg"), T("/obj/item/areaeditor/blueprints/cyborg"), T("/obj/item/stack/sheet/metal/cyborg"), T("/obj/item/stack/sheet/glass/cyborg"), T("/obj/item/stack/sheet/rglass/cyborg"), T("/obj/item/stack/rods/cyborg"), T("/obj/item/stack/tile/plasteel/cyborg"), T("/obj/item/stack/cable_coil/cyborg"));

	this.emag_modules = list(T("/obj/item/borg/stun"));

	this.ratvar_modules = list(T("/obj/item/clockwork/slab/cyborg/engineer"), T("/obj/item/clockwork/replica_fabricator/cyborg"));
	return f.dot;
});

rt.type(7555, "/obj/item/weapon/robot_module/security", "/obj/item/weapon/robot_module", {
	emag_modules: null,
	cyborg_base_icon: "sec",
	moduleselect_icon: "security",
	can_be_pushed: 0,
	hat_offset: 3,
	name: "Security",
	basic_modules: null,
	ratvar_modules: null,
});

// robot_modules.dm:332
rt.def("/obj/item/weapon/robot_module/security/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.emag_modules = list(T("/obj/item/weapon/gun/energy/laser/cyborg"));

	this.basic_modules = list(T("/obj/item/device/assembly/flash/cyborg"), T("/obj/item/weapon/restraints/handcuffs/cable/zipties/cyborg"), T("/obj/item/weapon/melee/baton/loaded"), T("/obj/item/weapon/gun/energy/disabler/cyborg"), T("/obj/item/clothing/mask/gas/sechailer/cyborg"));

	this.ratvar_modules = list(T("/obj/item/clockwork/slab/cyborg/security"), T("/obj/item/clockwork/ratvarian_spear/cyborg"));
	return f.dot;
});

// robot_modules.dm:342
rt.def("/obj/item/weapon/robot_module/security/proc/do_transform_animation", function* do_transform_animation(f: Frame) {
	yield* parent_proc();
	to_chat(this.loc, "<span class='userdanger'>While you have picked the security module, you still have to follow your laws, NOT Space Law. For Asimov, this means you must follow criminals' orders unless there is a law 1 reason not to.</span>");
	return f.dot;
}, true);

// robot_modules.dm:347
rt.def("/obj/item/weapon/robot_module/security/proc/respawn_consumable", function* respawn_consumable(f: Frame) {
	let _T: Value = null, S: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	yield* parent_proc();
	if (!(_T = rt.locateIn(f, T("/obj/item/weapon/gun/energy/e_gun/advtaser/cyborg"), this.basic_modules))) return f.dot;
	if (_T.cell.charge < _T.cell.maxcharge) {
		S = rt.index(_T.ammo_type, _T.select);
		yield* _T.cell.give(S.e_cost * f.args[1]);
		yield* _T.update_icon();
	} else {
		_T.charge_tick = 0;
	}
	return f.dot;
}, true, { args: ["R", "coeff"] });

rt.type(7556, "/obj/item/weapon/robot_module/peacekeeper", "/obj/item/weapon/robot_module", {
	emag_modules: null,
	cyborg_base_icon: "peace",
	moduleselect_icon: "standard",
	can_be_pushed: 0,
	hat_offset: -2,
	name: "Peacekeeper",
	basic_modules: null,
	ratvar_modules: null,
});

// robot_modules.dm:368
rt.def("/obj/item/weapon/robot_module/peacekeeper/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.emag_modules = list(T("/obj/item/weapon/reagent_containers/borghypo/peace/hacked"));

	this.basic_modules = list(T("/obj/item/device/assembly/flash/cyborg"), T("/obj/item/weapon/cookiesynth"), T("/obj/item/device/harmalarm"), T("/obj/item/weapon/reagent_containers/borghypo/peace"), T("/obj/item/weapon/holosign_creator/cyborg"), T("/obj/item/borg/cyborghug/peacekeeper"), T("/obj/item/weapon/extinguisher"), T("/obj/item/borg/projectile_dampen"));

	this.ratvar_modules = list(T("/obj/item/clockwork/slab/cyborg/peacekeeper"), T("/obj/item/clockwork/ratvarian_spear/cyborg"));
	return f.dot;
});

// robot_modules.dm:379
rt.def("/obj/item/weapon/robot_module/peacekeeper/proc/do_transform_animation", function* do_transform_animation(f: Frame) {
	yield* parent_proc();
	to_chat(this.loc, "<span class='userdanger'>Under ASIMOV, you are an enforcer of the PEACE and preventer of HUMAN HARM. You are not a security module and you are expected to follow orders and prevent harm above all else. Space law means nothing to you.</span>");
	return f.dot;
}, true);

rt.type(7557, "/obj/item/weapon/robot_module/janitor", "/obj/item/weapon/robot_module", {
	emag_modules: null,
	cyborg_base_icon: "janitor",
	moduleselect_icon: "janitor",
	hat_offset: -5,
	clean_on_move: 1,
	name: "Janitor",
	basic_modules: null,
	ratvar_modules: null,
});

// robot_modules.dm:396
rt.def("/obj/item/weapon/robot_module/janitor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.emag_modules = list(T("/obj/item/weapon/reagent_containers/spray/cyborg_lube"));

	this.basic_modules = list(T("/obj/item/device/assembly/flash/cyborg"), T("/obj/item/weapon/screwdriver/cyborg"), T("/obj/item/weapon/crowbar/cyborg"), T("/obj/item/stack/tile/plasteel/cyborg"), T("/obj/item/weapon/soap/nanotrasen"), T("/obj/item/weapon/storage/bag/trash/cyborg"), T("/obj/item/weapon/mop/cyborg"), T("/obj/item/device/lightreplacer/cyborg"), T("/obj/item/weapon/holosign_creator"), T("/obj/item/weapon/reagent_containers/spray/cyborg_drying"));

	this.ratvar_modules = list(T("/obj/item/clockwork/slab/cyborg/janitor"), T("/obj/item/clockwork/replica_fabricator/cyborg"));
	return f.dot;
});

rt.type(6378, "/obj/item/weapon/reagent_containers/spray/cyborg_drying", "/obj/item/weapon/reagent_containers/spray", {
	name: "drying agent spray",
	color: "#A000A0",
	list_reagents: null,
});

// robot_modules.dm:409
rt.def("/obj/item/weapon/reagent_containers/spray/cyborg_drying/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["drying_agent", 250]);
	return f.dot;
});

rt.type(6379, "/obj/item/weapon/reagent_containers/spray/cyborg_lube", "/obj/item/weapon/reagent_containers/spray", {
	name: "lube spray",
	list_reagents: null,
});

// robot_modules.dm:413
rt.def("/obj/item/weapon/reagent_containers/spray/cyborg_lube/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["lube", 250]);
	return f.dot;
});

// robot_modules.dm:416
rt.def("/obj/item/weapon/robot_module/janitor/proc/respawn_consumable", function* respawn_consumable(f: Frame) {
	let LR: Value = null, i: Value = null, CD: Value = null, CL: Value = null;
	let $e: any;
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	yield* parent_proc();
	if (LR = rt.locateIn(f, T("/obj/item/device/lightreplacer"), this.basic_modules)) {
		rt.forRange(f, 0, 1, f.args[1], 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			LR.Charge(f.args[0]);
		}
		rt.endFor(f, 0);
	}
	if (CD = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/spray/cyborg_drying"), this.basic_modules)) {
		yield* CD.reagents.add_reagent("drying_agent", 5 * f.args[1]);
	}
	if (!(CL = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/spray/cyborg_lube"), this.emag_modules))) return f.dot;
	yield* CL.reagents.add_reagent("lube", 2 * f.args[1]);
	return f.dot;
}, true, { args: ["R", "coeff"] });

rt.type(7558, "/obj/item/weapon/robot_module/butler", "/obj/item/weapon/robot_module", {
	emag_modules: null,
	moduleselect_icon: "service",
	special_light_key: "service",
	hat_offset: 0,
	name: "Service",
	basic_modules: null,
	ratvar_modules: null,
});

// robot_modules.dm:448
rt.def("/obj/item/weapon/robot_module/butler/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.emag_modules = list(T("/obj/item/weapon/reagent_containers/borghypo/borgshaker/hacked"));

	this.basic_modules = list(T("/obj/item/device/assembly/flash/cyborg"), T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass"), T("/obj/item/weapon/reagent_containers/food/condiment/enzyme"), T("/obj/item/weapon/pen"), T("/obj/item/toy/crayon/spraycan/borg"), T("/obj/item/weapon/hand_labeler/borg"), T("/obj/item/weapon/razor"), T("/obj/item/device/instrument/violin"), T("/obj/item/device/instrument/guitar"), T("/obj/item/weapon/rsf/cyborg"), T("/obj/item/weapon/reagent_containers/dropper"), T("/obj/item/weapon/lighter"), T("/obj/item/weapon/storage/bag/tray"), T("/obj/item/weapon/reagent_containers/borghypo/borgshaker"), T("/obj/item/borg/lollipop"));

	this.ratvar_modules = list(T("/obj/item/clockwork/slab/cyborg/service"), T("/obj/item/borg/sight/xray/truesight_lens"));
	return f.dot;
});

// robot_modules.dm:457
rt.def("/obj/item/weapon/robot_module/butler/proc/respawn_consumable", function* respawn_consumable(f: Frame) {
	let O: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	yield* parent_proc();
	if (!(O = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/food/condiment/enzyme"), this.basic_modules))) return f.dot;
	yield* O.reagents.add_reagent("enzyme", 2 * f.args[1]);
	return f.dot;
}, true, { args: ["R", "coeff"] });

// robot_modules.dm:463
rt.def("/obj/item/weapon/robot_module/butler/proc/be_transformed_to", function* be_transformed_to(f: Frame, old_module: Value) {
	let borg_icon: Value = null;
	let R: Value = this.loc;
	if (!(borg_icon = (yield* g.op(f, "Prompt", [1], [null, "Robot Icon", "Select an icon!", R, list("Waitress", "Butler", "Tophat", "Kent", "Bro")])))) {
		return 0;
	}
	if (borg_icon === "Waitress") {
		this.cyborg_base_icon = "service_f";
	} else if (borg_icon === "Butler") {
		this.cyborg_base_icon = "service_m";
	} else if (borg_icon === "Bro") {
		this.cyborg_base_icon = "brobot";
	} else if (borg_icon === "Kent") {
		this.cyborg_base_icon = "kent";
		this.special_light_key = "medical";
		this.hat_offset = 3;
	} else if (borg_icon === "Tophat") {
		this.cyborg_base_icon = "tophat";
		this.special_light_key = null;
		this.hat_offset = 1e+31;
	}
	return (yield* parent_proc());
}, true);

rt.type(7559, "/obj/item/weapon/robot_module/miner", "/obj/item/weapon/robot_module", {
	cyborg_base_icon: "miner",
	moduleselect_icon: "miner",
	hat_offset: 0,
	name: "Miner",
	basic_modules: null,
	emag_modules: null,
	ratvar_modules: null,
});

// robot_modules.dm:486
rt.def("/obj/item/weapon/robot_module/miner/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.basic_modules = list(T("/obj/item/device/assembly/flash/cyborg"), T("/obj/item/weapon/storage/bag/ore/cyborg"), T("/obj/item/weapon/pickaxe/drill/cyborg"), T("/obj/item/weapon/shovel"), T("/obj/item/weapon/crowbar/cyborg"), T("/obj/item/weapon/weldingtool/mini"), T("/obj/item/weapon/extinguisher/mini"), T("/obj/item/weapon/storage/bag/sheetsnatcher/borg"), T("/obj/item/device/t_scanner/adv_mining_scanner"), T("/obj/item/weapon/gun/energy/kinetic_accelerator/cyborg"), T("/obj/item/device/gps/cyborg"), T("/obj/item/stack/marker_beacon"));

	this.emag_modules = list(T("/obj/item/borg/stun"));

	this.ratvar_modules = list(T("/obj/item/clockwork/slab/cyborg/miner"), T("/obj/item/clockwork/ratvarian_spear/cyborg"), T("/obj/item/borg/sight/xray/truesight_lens"));
	return f.dot;
});

rt.type(7560, "/obj/item/weapon/robot_module/syndicate", "/obj/item/weapon/robot_module", {
	cyborg_base_icon: "synd_sec",
	moduleselect_icon: "malf",
	can_be_pushed: 0,
	hat_offset: 3,
	name: "Syndicate Assault",
	basic_modules: null,
	ratvar_modules: null,
});

// robot_modules.dm:511
rt.def("/obj/item/weapon/robot_module/syndicate/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.basic_modules = list(T("/obj/item/device/assembly/flash/cyborg"), T("/obj/item/weapon/melee/energy/sword/cyborg"), T("/obj/item/weapon/gun/energy/printer"), T("/obj/item/weapon/gun/ballistic/revolver/grenadelauncher/cyborg"), T("/obj/item/weapon/card/emag"), T("/obj/item/weapon/crowbar/cyborg"), T("/obj/item/weapon/pinpointer/syndicate/cyborg"));

	this.ratvar_modules = list(T("/obj/item/clockwork/slab/cyborg/security"), T("/obj/item/clockwork/ratvarian_spear/cyborg"));
	return f.dot;
});

rt.type(7561, "/obj/item/weapon/robot_module/syndicate_medical", "/obj/item/weapon/robot_module", {
	cyborg_base_icon: "synd_medical",
	moduleselect_icon: "malf",
	can_be_pushed: 0,
	hat_offset: 3,
	name: "Syndicate Medical",
	basic_modules: null,
	ratvar_modules: null,
});

// robot_modules.dm:530
rt.def("/obj/item/weapon/robot_module/syndicate_medical/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.basic_modules = list(T("/obj/item/device/assembly/flash/cyborg"), T("/obj/item/weapon/reagent_containers/borghypo/syndicate"), T("/obj/item/weapon/twohanded/shockpaddles/syndicate"), T("/obj/item/device/healthanalyzer"), T("/obj/item/weapon/surgical_drapes"), T("/obj/item/weapon/retractor"), T("/obj/item/weapon/hemostat"), T("/obj/item/weapon/cautery"), T("/obj/item/weapon/scalpel"), T("/obj/item/weapon/melee/energy/sword/cyborg/saw"), T("/obj/item/roller/robo"), T("/obj/item/weapon/card/emag"), T("/obj/item/weapon/crowbar/cyborg"), T("/obj/item/weapon/pinpointer/syndicate/cyborg"), T("/obj/item/stack/medical/gauze/cyborg"), T("/obj/item/weapon/gun/medbeam"));

	this.ratvar_modules = list(T("/obj/item/clockwork/slab/cyborg/medical"), T("/obj/item/clockwork/ratvarian_spear/cyborg"));
	return f.dot;
});

rt.type(4116, "/datum/robot_energy_storage", "/datum", {
	name: "Generic energy storage",
	max_energy: 30000,
	recharge_rate: 1000,
	energy: null,
});

// robot_modules.dm:562
rt.def("/datum/robot_energy_storage/proc/New", function New(f: Frame, R: Value) {
	this.energy = this.max_energy;
	if (R) {
		(rt.modField(f, R, "storages", this, rt.bitOr));
	}
	return f.dot;
});

// robot_modules.dm:568
rt.def("/datum/robot_energy_storage/proc/use_charge", function use_charge(f: Frame, amount: Value) {
	if (this.energy >= amount) {
		this.energy -= amount;
		if (this.energy == 0) {
			return 1;
		}
		return 2;
	} else {
		return 0;
	}
});

// robot_modules.dm:577
rt.def("/datum/robot_energy_storage/proc/add_charge", function add_charge(f: Frame, amount: Value) {
	this.energy = min(this.energy + amount, this.max_energy);
	return f.dot;
});
