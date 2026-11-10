// Based on /tg/station's code/game/turfs/simulated/floor/mineral_floor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(4568, "/turf/open/floor/mineral", "/turf/open/floor", {
	icons: null,
	name: "mineral floor",
	icon_state: "",
});

// mineral_floor.dm:20
rt.def("/turf/open/floor/mineral/proc/Initialize", function* Initialize(f: Frame) {
	this.broken_states = list(`${rt.initial(f, this, "icon_state")}_dam`);
	yield* parent_proc();
	if (this.icons) return f.dot;
	this.icons = list();
	return f.dot;
}, true);

// mineral_floor.dm:27
rt.def("/turf/open/floor/mineral/proc/update_icon", function update_icon(f: Frame) {
	if (!parent_proc()) {
		return 0;
	}
	if (!(!this.broken && !this.burnt)) return f.dot;
	if (rt.isIn(f, this.icon_state, this.icons)) return f.dot;
	this.icon_state = rt.initial(f, this, "icon_state");
	return f.dot;
});

rt.type(4569, "/turf/open/floor/mineral/plasma", "/turf/open/floor/mineral", {
	icons: null,
	name: "plasma floor",
	icon_state: "plasma",
	floor_tile: rt.typePath("/obj/item/stack/tile/mineral/plasma"),
});

// mineral_floor.dm:42
rt.def("/turf/open/floor/mineral/plasma/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	if (!(exposed_temperature > 300)) return f.dot;
	yield* this.PlasmaBurn(exposed_temperature);
	return f.dot;
}, true);

// mineral_floor.dm:46
rt.def("/turf/open/floor/mineral/plasma/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let $0: any, $1: any;
	if (W.is_hot() > 300) {
		$0 = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
		if (this) {
			$1 = `${`(${this.x},${this.y},${this.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${this.x};Y=${this.y};Z=${this.z}'>JMP</a>)`}`;
		} else {
			$1 = "nonexistent location";
		}
		message_admins(`Plasma flooring was ignited by ${$0} in ${`${$1}`}`, 0, 1);
		log_game(`Plasma flooring was ignited by ${key_name(user)} in ${`(${this.x},${this.y},${this.z})`}`);
		yield* this.ignite(W.is_hot());
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// mineral_floor.dm:54
rt.def("/turf/open/floor/mineral/plasma/proc/PlasmaBurn", function* PlasmaBurn(f: Frame, temperature: Value) {
	yield* this.make_plating();
	this.atmos_spawn_air(`plasma=20;TEMP=${temperature}`);
	return f.dot;
}, true);

// mineral_floor.dm:58
rt.def("/turf/open/floor/mineral/plasma/proc/ignite", function* ignite(f: Frame, exposed_temperature: Value) {
	if (!(exposed_temperature > 300)) return f.dot;
	yield* this.PlasmaBurn(exposed_temperature);
	return f.dot;
}, true);

rt.type(4583, "/turf/open/floor/mineral/bananium", "/turf/open/floor/mineral", {
	spam_flag: 0,
	icons: null,
	name: "bananium floor",
	icon_state: "bananium",
	floor_tile: rt.typePath("/obj/item/stack/tile/mineral/bananium"),
});

// mineral_floor.dm:133
rt.def("/turf/open/floor/mineral/bananium/proc/Entered", function* Entered(f: Frame, AM: Value) {
	f.dot = (yield* parent_proc());
	if (f.dot) return f.dot;
	if (!rt.istype(AM, T("/mob"))) return f.dot;
	this.squeek();
	return f.dot;
}, true);

// mineral_floor.dm:139
rt.def("/turf/open/floor/mineral/bananium/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	f.dot = (yield* parent_proc());
	if (f.dot) return f.dot;
	this.honk();
	return f.dot;
}, true);

// mineral_floor.dm:144
rt.def("/turf/open/floor/mineral/bananium/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.dot = (yield* parent_proc());
	if (f.dot) return f.dot;
	this.honk();
	return f.dot;
}, true);

// mineral_floor.dm:149
rt.def("/turf/open/floor/mineral/bananium/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.dot = (yield* parent_proc());
	if (f.dot) return f.dot;
	this.honk();
	return f.dot;
}, true);

// mineral_floor.dm:154
rt.def("/turf/open/floor/mineral/bananium/proc/honk", function honk(f: Frame) {
	if (!(this.spam_flag < rt.worldTime(f))) return f.dot;
	playsound(this, rt.rsc("sound/items/bikehorn.ogg"), 50, 1);
	this.spam_flag = rt.worldTime(f) + 20;
	return f.dot;
});

// mineral_floor.dm:159
rt.def("/turf/open/floor/mineral/bananium/proc/squeek", function squeek(f: Frame) {
	if (!(this.spam_flag < rt.worldTime(f))) return f.dot;
	playsound(this, "clownstep", 50, 1);
	this.spam_flag = rt.worldTime(f) + 10;
	return f.dot;
});

rt.type(4586, "/turf/open/floor/mineral/uranium", "/turf/open/floor/mineral", {
	last_event: 0,
	active: null,
	icons: null,
	name: "uranium floor",
	icon_state: "uranium",
	floor_tile: rt.typePath("/obj/item/stack/tile/mineral/uranium"),
});

// mineral_floor.dm:185
rt.def("/turf/open/floor/mineral/uranium/proc/Entered", function* Entered(f: Frame, AM: Value) {
	f.dot = (yield* parent_proc());
	if (f.dot) return f.dot;
	if (!rt.istype(AM, T("/mob"))) return f.dot;
	yield* this.radiate();
	return f.dot;
}, true);

// mineral_floor.dm:191
rt.def("/turf/open/floor/mineral/uranium/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	f.dot = (yield* parent_proc());
	if (f.dot) return f.dot;
	yield* this.radiate();
	return f.dot;
}, true);

// mineral_floor.dm:196
rt.def("/turf/open/floor/mineral/uranium/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.dot = (yield* parent_proc());
	if (f.dot) return f.dot;
	yield* this.radiate();
	return f.dot;
}, true);

// mineral_floor.dm:201
rt.def("/turf/open/floor/mineral/uranium/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.dot = (yield* parent_proc());
	if (f.dot) return f.dot;
	yield* this.radiate();
	return f.dot;
}, true);

// mineral_floor.dm:206
rt.def("/turf/open/floor/mineral/uranium/proc/radiate", function* radiate(f: Frame) {
	let _T: Value = null;
	if (this.active) return f.dot;
	if (!(rt.worldTime(f) > this.last_event + 15)) return f.dot;
	this.active = 1;
	yield* radiation_pulse(rt.getStep(f, this, 0), 3, 3, 1, 0);
	for (_T of each(orange(1, this), T("/turf/open/floor/mineral/uranium"))) {
		yield* _T.radiate();
	}
	this.last_event = rt.worldTime(f);
	this.active = 0;
	return f.dot;
}, true);

rt.type(4587, "/turf/open/floor/mineral/abductor", "/turf/open/floor/mineral", {
	icons: null,
	name: "alien floor",
	icon_state: "alienpod1",
	floor_tile: rt.typePath("/obj/item/stack/tile/mineral/abductor"),
});

// mineral_floor.dm:224
rt.def("/turf/open/floor/mineral/abductor/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.icon_state = `alienpod${rand(1, 9)}`;
	return f.dot;
}, true);

// mineral_floor.dm:234
rt.def("/turf/open/floor/mineral/abductor/proc/make_plating", function* make_plating(f: Frame) {
	return (yield* this.ChangeTurf(T("/turf/open/floor/plating/abductor2")));
}, true);
