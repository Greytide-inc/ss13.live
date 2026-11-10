// Based on /tg/station's code/game/objects/structures/false_walls.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(12172, "/obj/structure/falsewall", "/obj/structure", {
	mineral: rt.typePath("/obj/item/stack/sheet/metal"),
	mineral_amount: 2,
	walltype: rt.typePath("/turf/closed/wall"),
	opening: 0,
	girder_type: rt.typePath("/obj/structure/girder/displaced"),
	anchored: 1,
	canSmoothWith: null,
	smooth: 1,
	can_be_unanchored: 0,
	CanAtmosPass: -2,
	name: "wall",
	desc: "A huge chunk of metal used to separate rooms.",
	icon: rt.rsc("icons/turf/walls/wall.dmi"),
	icon_state: "wall",
	density: 1,
	opacity: 1,
	obj_integrity: 100,
	max_integrity: 100,
});

// false_walls.dm:20
rt.def("/obj/structure/falsewall/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/closed/wall"), T("/turf/closed/wall/r_wall"), T("/obj/structure/falsewall"), T("/obj/structure/falsewall/brass"), T("/obj/structure/falsewall/reinforced"), T("/turf/closed/wall/rust"), T("/turf/closed/wall/r_wall/rust"), T("/turf/closed/wall/clockwork"));
	return f.dot;
});

// false_walls.dm:34
rt.def("/obj/structure/falsewall/proc/New", function* New(f: Frame, loc: Value) {
	yield* parent_proc();
	this.air_update_turf(1);
	return f.dot;
}, true);

// false_walls.dm:39
rt.def("/obj/structure/falsewall/proc/Destroy", function* Destroy(f: Frame) {
	this.density = 0;
	this.air_update_turf(1);
	return (yield* parent_proc());
}, true);

// false_walls.dm:43
rt.def("/obj/structure/falsewall/proc/ratvar_act", function* ratvar_act(f: Frame) {
	yield* new_(T("/obj/structure/falsewall/brass"), this.loc);
	yield* qdel(this);
	return f.dot;
}, true);

// false_walls.dm:52
rt.def("/obj/structure/falsewall/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let srcturf: Value = null, obstacle: Value = null;
	if (this.opening) {
		return f.dot;
	}
	this.opening = 1;
	if (this.density) {
		this.do_the_flick();
		yield* sleep(5);
		if (!(!this || this.gc_destroyed)) {
			this.density = 0;
			this.set_opacity(0);
			yield* this.update_icon();
		}
	} else {
		srcturf = rt.getStep(f, this, 0);
		for (obstacle of each(srcturf, T("/mob/living"))) {
			this.opening = 0;
			return f.dot;
		}
		this.do_the_flick();
		this.density = 1;
		yield* sleep(5);
		if (!(!this || this.gc_destroyed)) {
			this.set_opacity(1);
			yield* this.update_icon();
		}
	}
	this.air_update_turf(1);
	this.opening = 0;
	return f.dot;
}, true);

// false_walls.dm:75
rt.def("/obj/structure/falsewall/proc/do_the_flick", function do_the_flick(f: Frame) {
	if (this.density) {
		this.smooth = SMOOTH_FALSE;
		this.clear_smooth_overlays();
		this.icon_state = "fwall_opening";
	} else {
		this.icon_state = "fwall_closing";
	}
	return f.dot;
});

// false_walls.dm:83
rt.def("/obj/structure/falsewall/proc/update_icon", function update_icon(f: Frame) {
	if (this.density) {
		this.smooth = SMOOTH_TRUE;
		queue_smooth(this);
		this.icon_state = rt.initial(f, this, "icon_state");
	} else {
		this.icon_state = "fwall_open";
	}
	return f.dot;
});

// false_walls.dm:89
rt.def("/obj/structure/falsewall/proc/ChangeToWall", function* ChangeToWall(f: Frame, _delete: Value) {
	let _T: Value = null;
	_delete ??= 1;
	yield* (_T = rt.getStep(f, this, 0)).ChangeTurf(this.walltype);
	if (_delete) {
		yield* qdel(this);
	}
	return _T;
}, true);

// false_walls.dm:97
rt.def("/obj/structure/falsewall/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _T: Value = null, WT: Value = null, D: Value = null;
	if (this.opening) {
		to_chat(user, "<span class='warning'>You must wait until the door has stopped moving!</span>");
		return f.dot;
	}
	if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		if (this.density) {
			if ((_T = rt.getStep(f, this, 0)).density) {
				to_chat(user, `<span class='warning'>${this} is blocked!</span>`);
				return f.dot;
			}
			if (!rt.istype(_T, T("/turf/open/floor"))) {
				to_chat(user, `<span class='warning'>${this} bolts must be tightened on the floor!</span>`);
				return f.dot;
			}
			user.visible_message(`<span class='notice'>${user} tightens some bolts on the wall.</span>`, "<span class='notice'>You tighten the bolts on the wall.</span>");
			yield* this.ChangeToWall();
		} else {
			to_chat(user, "<span class='warning'>You can't reach, close it first!</span>");
		}
	} else if (rt.istype(W, T("/obj/item/weapon/weldingtool"))) {
		if (yield* (WT = W).remove_fuel(0, user)) {
			yield* this.dismantle(user, 1);
		}
	} else if (rt.istype(W, T("/obj/item/weapon/gun/energy/plasmacutter"))) {
		yield* this.dismantle(user, 1);
	} else if (rt.istype(W, T("/obj/item/weapon/pickaxe/drill/jackhammer"))) {
		(D = W).playDigSound();
		yield* this.dismantle(user, 1);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// false_walls.dm:128
rt.def("/obj/structure/falsewall/proc/dismantle", function* dismantle(f: Frame, user: Value, disassembled: Value) {
	disassembled ??= 1;
	user.visible_message(`<span class='notice'>${user} dismantles the false wall.</span>`, "<span class='notice'>You dismantle the false wall.</span>");
	playsound(this, rt.rsc("sound/items/welder.ogg"), 100, 1);
	yield* this.deconstruct(disassembled);
	return f.dot;
}, true);

// false_walls.dm:133
rt.def("/obj/structure/falsewall/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let i: Value = null;
	let $e: any;
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (disassembled) {
			yield* new_(this.girder_type, this.loc);
		}
		if (this.mineral_amount) {
			rt.forRange(f, 0, 1, this.mineral_amount, 1);
			while (($e = rt.next(f, 0)) !== undefined) {
				i = $e;
				yield* new_(this.mineral, this.loc);
			}
			rt.endFor(f, 0);
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

// false_walls.dm:145
rt.def("/obj/structure/falsewall/proc/examine_status", function examine_status(f: Frame, user: Value) {
	return null;
});

rt.type(12176, "/obj/structure/falsewall/uranium", "/obj/structure/falsewall", {
	active: null,
	last_event: 0,
	mineral: rt.typePath("/obj/item/stack/sheet/mineral/uranium"),
	walltype: rt.typePath("/turf/closed/wall/mineral/uranium"),
	canSmoothWith: null,
	name: "uranium wall",
	desc: "A wall with uranium plating. This is probably a bad idea.",
	icon: rt.rsc("icons/turf/walls/uranium_wall.dmi"),
	icon_state: "uranium",
});

// false_walls.dm:172
rt.def("/obj/structure/falsewall/uranium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/falsewall/uranium"), T("/turf/closed/wall/mineral/uranium"));
	return f.dot;
});

// false_walls.dm:175
rt.def("/obj/structure/falsewall/uranium/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	yield* this.radiate();
	return (yield* parent_proc());
}, true);

// false_walls.dm:179
rt.def("/obj/structure/falsewall/uranium/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* this.radiate();
	yield* parent_proc();
	return f.dot;
}, true);

// false_walls.dm:183
rt.def("/obj/structure/falsewall/uranium/proc/radiate", function* radiate(f: Frame) {
	let _T: Value = null;
	if (!this.active) {
		if (rt.worldTime(f) > this.last_event + 15) {
			this.active = 1;
			yield* radiation_pulse(rt.getStep(f, this, 0), 0, 3, 15, 1);
			for (_T of each(orange(1, this), T("/turf/closed/wall/mineral/uranium"))) {
				yield* _T.radiate();
			}
			this.last_event = rt.worldTime(f);
			this.active = null;
			return f.dot;
		}
	}
	return f.dot;
}, true);

rt.type(12177, "/obj/structure/falsewall/gold", "/obj/structure/falsewall", {
	mineral: rt.typePath("/obj/item/stack/sheet/mineral/gold"),
	walltype: rt.typePath("/turf/closed/wall/mineral/gold"),
	canSmoothWith: null,
	name: "gold wall",
	desc: "A wall with gold plating. Swag!",
	icon: rt.rsc("icons/turf/walls/gold_wall.dmi"),
	icon_state: "gold",
});

// false_walls.dm:204
rt.def("/obj/structure/falsewall/gold/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/falsewall/gold"), T("/turf/closed/wall/mineral/gold"));
	return f.dot;
});

rt.type(12178, "/obj/structure/falsewall/silver", "/obj/structure/falsewall", {
	mineral: rt.typePath("/obj/item/stack/sheet/mineral/silver"),
	walltype: rt.typePath("/turf/closed/wall/mineral/silver"),
	canSmoothWith: null,
	name: "silver wall",
	desc: "A wall with silver plating. Shiny.",
	icon: rt.rsc("icons/turf/walls/silver_wall.dmi"),
	icon_state: "silver",
});

// false_walls.dm:213
rt.def("/obj/structure/falsewall/silver/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/falsewall/silver"), T("/turf/closed/wall/mineral/silver"));
	return f.dot;
});

rt.type(12179, "/obj/structure/falsewall/diamond", "/obj/structure/falsewall", {
	mineral: rt.typePath("/obj/item/stack/sheet/mineral/diamond"),
	walltype: rt.typePath("/turf/closed/wall/mineral/diamond"),
	canSmoothWith: null,
	name: "diamond wall",
	desc: "A wall with diamond plating. You monster.",
	icon: rt.rsc("icons/turf/walls/diamond_wall.dmi"),
	icon_state: "diamond",
	obj_integrity: 800,
	max_integrity: 800,
});

// false_walls.dm:222
rt.def("/obj/structure/falsewall/diamond/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/falsewall/diamond"), T("/turf/closed/wall/mineral/diamond"));
	return f.dot;
});

rt.type(12180, "/obj/structure/falsewall/plasma", "/obj/structure/falsewall", {
	mineral: rt.typePath("/obj/item/stack/sheet/mineral/plasma"),
	walltype: rt.typePath("/turf/closed/wall/mineral/plasma"),
	canSmoothWith: null,
	name: "plasma wall",
	desc: "A wall with plasma plating. This is definitely a bad idea.",
	icon: rt.rsc("icons/turf/walls/plasma_wall.dmi"),
	icon_state: "plasma",
});

// false_walls.dm:233
rt.def("/obj/structure/falsewall/plasma/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/falsewall/plasma"), T("/turf/closed/wall/mineral/plasma"));
	return f.dot;
});

// false_walls.dm:236
rt.def("/obj/structure/falsewall/plasma/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _T: Value = null;
	let $0: any, $1: any;
	if (W.is_hot() > 300) {
		_T = rt.getStep(f, this, 0);
		$0 = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
		if (_T) {
			$1 = `${`(${_T.x},${_T.y},${_T.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`;
		} else {
			$1 = "nonexistent location";
		}
		message_admins(`Plasma falsewall ignited by ${$0} in ${`${$1}`}`, 0, 1);
		log_game(`Plasma falsewall ignited by ${key_name(user)} in ${`(${_T.x},${_T.y},${_T.z})`}`);
		yield* this.burnbabyburn();
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// false_walls.dm:245
rt.def("/obj/structure/falsewall/plasma/proc/burnbabyburn", function* burnbabyburn(f: Frame, user: Value) {
	playsound(this, rt.rsc("sound/items/welder.ogg"), 100, 1);
	this.atmos_spawn_air("plasma=400;TEMP=1000");
	yield* new_(T("/obj/structure/girder/displaced"), this.loc);
	yield* qdel(this);
	return f.dot;
}, true);

// false_walls.dm:251
rt.def("/obj/structure/falsewall/plasma/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	if (!(exposed_temperature > 300)) return f.dot;
	yield* this.burnbabyburn();
	return f.dot;
}, true);

rt.type(12181, "/obj/structure/falsewall/clown", "/obj/structure/falsewall", {
	mineral: rt.typePath("/obj/item/stack/sheet/mineral/bananium"),
	walltype: rt.typePath("/turf/closed/wall/mineral/clown"),
	canSmoothWith: null,
	name: "bananium wall",
	desc: "A wall with bananium plating. Honk!",
	icon: rt.rsc("icons/turf/walls/bananium_wall.dmi"),
	icon_state: "bananium",
});

// false_walls.dm:261
rt.def("/obj/structure/falsewall/clown/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/falsewall/clown"), T("/turf/closed/wall/mineral/clown"));
	return f.dot;
});

rt.type(12182, "/obj/structure/falsewall/sandstone", "/obj/structure/falsewall", {
	mineral: rt.typePath("/obj/item/stack/sheet/mineral/sandstone"),
	walltype: rt.typePath("/turf/closed/wall/mineral/sandstone"),
	canSmoothWith: null,
	name: "sandstone wall",
	desc: "A wall with sandstone plating. Rough.",
	icon: rt.rsc("icons/turf/walls/sandstone_wall.dmi"),
	icon_state: "sandstone",
});

// false_walls.dm:271
rt.def("/obj/structure/falsewall/sandstone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/falsewall/sandstone"), T("/turf/closed/wall/mineral/sandstone"));
	return f.dot;
});

rt.type(12183, "/obj/structure/falsewall/wood", "/obj/structure/falsewall", {
	mineral: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
	walltype: rt.typePath("/turf/closed/wall/mineral/wood"),
	canSmoothWith: null,
	name: "wooden wall",
	desc: "A wall with wooden plating. Stiff.",
	icon: rt.rsc("icons/turf/walls/wood_wall.dmi"),
	icon_state: "wood",
});

// false_walls.dm:280
rt.def("/obj/structure/falsewall/wood/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/falsewall/wood"), T("/turf/closed/wall/mineral/wood"));
	return f.dot;
});

rt.type(12173, "/obj/structure/falsewall/iron", "/obj/structure/falsewall", {
	canSmoothWith: null,
	name: "rough metal wall",
	desc: "A wall with rough metal plating.",
	icon: rt.rsc("icons/turf/walls/iron_wall.dmi"),
	icon_state: "iron",
	mineral: rt.typePath("/obj/item/stack/rods"),
	walltype: rt.typePath("/turf/closed/wall/mineral/iron"),
});

// false_walls.dm:289
rt.def("/obj/structure/falsewall/iron/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/falsewall/iron"), T("/turf/closed/wall/mineral/iron"));
	return f.dot;
});

rt.type(12184, "/obj/structure/falsewall/abductor", "/obj/structure/falsewall", {
	mineral: rt.typePath("/obj/item/stack/sheet/mineral/abductor"),
	walltype: rt.typePath("/turf/closed/wall/mineral/abductor"),
	canSmoothWith: null,
	name: "alien wall",
	desc: "A wall with alien alloy plating.",
	icon: rt.rsc("icons/turf/walls/abductor_wall.dmi"),
	icon_state: "abductor",
});

// false_walls.dm:298
rt.def("/obj/structure/falsewall/abductor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/falsewall/abductor"), T("/turf/closed/wall/mineral/abductor"));
	return f.dot;
});

rt.type(12185, "/obj/structure/falsewall/titanium", "/obj/structure/falsewall", {
	mineral: rt.typePath("/obj/item/stack/sheet/mineral/titanium"),
	walltype: rt.typePath("/turf/closed/wall/mineral/titanium"),
	smooth: 2,
	name: "wall",
	desc: "A light-weight titanium wall used in shuttles.",
	icon: rt.rsc("icons/turf/walls/shuttle_wall.dmi"),
	icon_state: "shuttle",
	canSmoothWith: null,
});

// false_walls.dm:308
rt.def("/obj/structure/falsewall/titanium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/closed/wall/mineral/titanium"), T("/obj/machinery/door/airlock/shuttle"), T("/obj/machinery/door/airlock"), T("/turf/closed/wall/shuttle"), T("/obj/structure/window/shuttle"), T("/obj/structure/shuttle/engine"), T("/obj/structure/shuttle/engine/heater"));
	return f.dot;
});

rt.type(12175, "/obj/structure/falsewall/brass", "/obj/structure/falsewall", {
	canSmoothWith: null,
	name: "clockwork wall",
	desc: "A huge chunk of warm metal. The clanging of machinery emanates from within.",
	icon: rt.rsc("icons/turf/walls/clockwork_wall.dmi"),
	icon_state: "clockwork_wall",
	resistance_flags: 34,
	mineral_amount: 1,
	walltype: rt.typePath("/turf/closed/wall/clockwork"),
	mineral: rt.typePath("/obj/item/stack/tile/brass"),
	girder_type: rt.typePath("/obj/structure/destructible/clockwork/wall_gear/displaced"),
});

// false_walls.dm:326
rt.def("/obj/structure/falsewall/brass/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/effect/clockwork/overlay/wall"), T("/obj/structure/falsewall/brass"));
	return f.dot;
});

// false_walls.dm:332
rt.def("/obj/structure/falsewall/brass/proc/New", function* New(f: Frame, loc: Value) {
	let _T: Value = null;
	yield* parent_proc();
	yield* new_(T("/obj/effect/temp_visual/ratvar/wall/false"), (_T = rt.getStep(f, this, 0)));
	yield* new_(T("/obj/effect/temp_visual/ratvar/beam/falsewall"), _T);
	change_construction_value(4);
	return f.dot;
}, true);

// false_walls.dm:339
rt.def("/obj/structure/falsewall/brass/proc/Destroy", function* Destroy(f: Frame) {
	change_construction_value(-4);
	return (yield* parent_proc());
}, true);

// false_walls.dm:344
rt.def("/obj/structure/falsewall/brass/proc/ratvar_act", function ratvar_act(f: Frame) {
	if (!GLOB.ratvar_awakens) return f.dot;
	this.obj_integrity = this.max_integrity;
	return f.dot;
});
