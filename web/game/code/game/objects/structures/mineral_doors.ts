// Based on /tg/station's code/game/objects/structures/mineral_doors.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(12795, "/obj/structure/mineral_door", "/obj/structure", {
	initial_state: null,
	state: 0,
	isSwitchingStates: 0,
	close_delay: -1,
	sheetType: rt.typePath("/obj/item/stack/sheet/metal"),
	sheetAmount: 7,
	openSound: rt.rsc("sound/effects/stonedoor_openclose.ogg"),
	closeSound: rt.rsc("sound/effects/stonedoor_openclose.ogg"),
	anchored: 1,
	CanAtmosPass: -2,
	name: "metal door",
	density: 1,
	opacity: 1,
	icon: rt.rsc("icons/obj/doors/mineral_doors.dmi"),
	icon_state: "metal",
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
});

// mineral_doors.dm:19
rt.def("/obj/structure/mineral_door/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 10, "bullet", 0, "laser", 0, "energy", 100, "bomb", 10, "bio", 100, "rad", 100, "fire", 50, "acid", 50]);
	return f.dot;
});

// mineral_doors.dm:27
rt.def("/obj/structure/mineral_door/proc/New", function* New(f: Frame, location: Value) {
	yield* parent_proc();
	this.initial_state = this.icon_state;
	this.air_update_turf(1);
	return f.dot;
}, true);

// mineral_doors.dm:33
rt.def("/obj/structure/mineral_door/proc/Destroy", function* Destroy(f: Frame) {
	this.density = 0;
	this.air_update_turf(1);
	return (yield* parent_proc());
}, true);

// mineral_doors.dm:37
rt.def("/obj/structure/mineral_door/proc/Move", function* Move(f: Frame) {
	let _T: Value = this.loc;
	yield* parent_proc();
	this.move_update_air(_T);
	return f.dot;
}, true);

// mineral_doors.dm:42
rt.def("/obj/structure/mineral_door/proc/Bumped", function* Bumped(f: Frame, user: Value) {
	yield* parent_proc();
	if (this.state) return f.dot;
	return (yield* this.TryToSwitchState(user));
}, true);

// mineral_doors.dm:47
rt.def("/obj/structure/mineral_door/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	if (rt.istype(user, T("/mob/living/silicon/ai"))) {
		return f.dot;
	} else {
		if (!rt.istype(user, T("/mob/living/silicon/robot"))) return f.dot;
		if (!(get_dist(user, this) <= 1)) return f.dot;
		return (yield* this.TryToSwitchState(user));
	}
}, true);

// mineral_doors.dm:54
rt.def("/obj/structure/mineral_door/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.TryToSwitchState(user));
}, true);

// mineral_doors.dm:57
rt.def("/obj/structure/mineral_door/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	return (yield* this.TryToSwitchState(user));
}, true);

// mineral_doors.dm:60
rt.def("/obj/structure/mineral_door/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	height ??= 0;
	if (rt.istype(mover, T("/obj/effect/beam"))) {
		return (!this.opacity ? 1 : 0);
	}
	return (!this.density ? 1 : 0);
});

// mineral_doors.dm:67
rt.def("/obj/structure/mineral_door/proc/TryToSwitchState", function* TryToSwitchState(f: Frame, user: Value) {
	let M: Value = null, C: Value = null;
	if (this.isSwitchingStates) {
		return f.dot;
	}
	if (rt.istype(user, T("/mob/living"))) {
		M = user;
		if (rt.worldTime(f) - M.last_bumped <= 60) {
			return f.dot;
		}
		if (M.client) {
			if (rt.istype(M, T("/mob/living/carbon"))) {
				if (!(C = M).handcuffed) {
					yield* this.SwitchState();
				}
			} else {
				yield* this.SwitchState();
			}
		}
	} else {
		if (!rt.istype(user, T("/obj/mecha"))) return f.dot;
		yield* this.SwitchState();
	}
	return f.dot;
}, true);

// mineral_doors.dm:83
rt.def("/obj/structure/mineral_door/proc/SwitchState", function* SwitchState(f: Frame) {
	if (this.state) {
		yield* this.Close();
	} else {
		yield* this.Open();
	}
	return f.dot;
}, true);

// mineral_doors.dm:89
rt.def("/obj/structure/mineral_door/proc/Open", function* Open(f: Frame) {
	this.isSwitchingStates = 1;
	playsound(this, this.openSound, 100, 1);
	this.set_opacity(0);
	flick(`${this.initial_state}opening`, this);
	yield* sleep(10);
	this.density = 0;
	this.state = 1;
	this.air_update_turf(1);
	yield* this.update_icon();
	this.isSwitchingStates = 0;
	if (this.close_delay == -1) return f.dot;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/structure/mineral_door/proc/Close"))), this.close_delay);
	return f.dot;
}, true);

// mineral_doors.dm:103
rt.def("/obj/structure/mineral_door/proc/Close", function* Close(f: Frame) {
	let L: Value = null;
	if (this.isSwitchingStates || this.state != 1) {
		return f.dot;
	}
	let _T: Value = rt.getStep(f, this, 0);
	for (L of each(_T, T("/mob/living"))) {
		return f.dot;
	}
	this.isSwitchingStates = 1;
	playsound(this.loc, this.closeSound, 100, 1);
	flick(`${this.initial_state}closing`, this);
	yield* sleep(10);
	this.density = 1;
	this.set_opacity(1);
	this.state = 0;
	this.air_update_turf(1);
	yield* this.update_icon();
	this.isSwitchingStates = 0;
	return f.dot;
}, true);

// mineral_doors.dm:121
rt.def("/obj/structure/mineral_door/proc/update_icon", function update_icon(f: Frame) {
	if (this.state) {
		this.icon_state = `${this.initial_state}open`;
	} else {
		this.icon_state = this.initial_state;
	}
	return f.dot;
});

// mineral_doors.dm:126
rt.def("/obj/structure/mineral_door/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let digTool: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/pickaxe"))) {
		digTool = W;
		to_chat(user, `<span class='notice'>You start digging the ${this.name}...</span>`);
		if ((yield* do_after(user, digTool.digspeed * (1 + round(this.max_integrity * 0.01)), { target: this })) && this) {
			to_chat(user, "<span class='notice'>You finish digging.</span>");
			yield* this.deconstruct(1);
		}
	} else if (user.a_intent != "harm") {
		yield* this.attack_hand(user);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// mineral_doors.dm:138
rt.def("/obj/structure/mineral_door/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	let _T: Value = rt.getStep(f, this, 0);
	if (disassembled) {
		yield* new_(this.sheetType, _T, this.sheetAmount);
	} else {
		yield* new_(this.sheetType, _T, max(this.sheetAmount - 2, 1));
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12801, "/obj/structure/mineral_door/transparent", "/obj/structure/mineral_door", {
	opacity: 0,
});

// mineral_doors.dm:181
rt.def("/obj/structure/mineral_door/transparent/proc/Close", function* Close(f: Frame) {
	yield* parent_proc();
	this.set_opacity(0);
	return f.dot;
}, true);

rt.type(12802, "/obj/structure/mineral_door/transparent/plasma", "/obj/structure/mineral_door/transparent", {
	sheetType: rt.typePath("/obj/item/stack/sheet/mineral/plasma"),
	name: "plasma door",
	icon_state: "plasma",
});

// mineral_doors.dm:190
rt.def("/obj/structure/mineral_door/transparent/plasma/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _T: Value = null;
	let $0: any, $1: any;
	if (W.is_hot()) {
		_T = rt.getStep(f, this, 0);
		$0 = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
		if (_T) {
			$1 = `${`(${_T.x},${_T.y},${_T.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`;
		} else {
			$1 = "nonexistent location";
		}
		message_admins(`Plasma mineral door ignited by ${$0} in ${`${$1}`}`, 0, 1);
		log_game(`Plasma mineral door ignited by ${key_name(user)} in ${`(${_T.x},${_T.y},${_T.z})`}`);
		yield* this.TemperatureAct();
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// mineral_doors.dm:199
rt.def("/obj/structure/mineral_door/transparent/plasma/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	if (!(exposed_temperature > 300)) return f.dot;
	yield* this.TemperatureAct();
	return f.dot;
}, true);

// mineral_doors.dm:203
rt.def("/obj/structure/mineral_door/transparent/plasma/proc/TemperatureAct", function* TemperatureAct(f: Frame) {
	this.atmos_spawn_air("plasma=500;TEMP=1000");
	yield* this.deconstruct(0);
	return f.dot;
}, true);

rt.type(12805, "/obj/structure/mineral_door/paperframe", "/obj/structure/mineral_door", {
	openSound: rt.rsc("sound/effects/doorcreaky.ogg"),
	closeSound: rt.rsc("sound/effects/doorcreaky.ogg"),
	sheetType: rt.typePath("/obj/item/stack/sheet/paperframes"),
	sheetAmount: 3,
	name: "paper frame door",
	icon_state: "paperframe",
	resistance_flags: 4,
	obj_integrity: 20,
	max_integrity: 20,
});

// mineral_doors.dm:235
rt.def("/obj/structure/mineral_door/paperframe/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	queue_smooth_neighbors(this);
	return f.dot;
});

// mineral_doors.dm:239
rt.def("/obj/structure/mineral_door/paperframe/proc/Destroy", function* Destroy(f: Frame) {
	queue_smooth_neighbors(this);
	return (yield* parent_proc());
}, true);
