// Based on /tg/station's code/game/objects/items/weapons/grenades/ghettobomb.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(6920, "/obj/item/weapon/grenade/iedcasing", "/obj/item/weapon/grenade", {
	range: 3,
	times: null,
	throw_speed: 3,
	throw_range: 7,
	flags: 64,
	name: "improvised firebomb",
	desc: "A weak, improvised incendiary device.",
	w_class: 2,
	icon: rt.rsc("icons/obj/grenade.dmi"),
	icon_state: "improvised_grenade",
	item_state: "flashbang",
	slot_flags: 512,
	active: 0,
	det_time: 50,
	display_timer: 0,
});

// ghettobomb.dm:21
rt.def("/obj/item/weapon/grenade/iedcasing/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.add_overlay("improvised_grenade_filled");
	this.add_overlay("improvised_grenade_wired");
	this.times = rt.alist(f, ["5", 10, "-1", 20, `${rand(30, 80)}`, 50, `${rand(65, 180)}`, 20]);
	this.det_time = text2num(pickweight(this.times));
	if (this.det_time < 0) {
		this.range = 1;
		this.det_time = rand(30, 80);
	} else {
		this.range = pick(2, 2, 2, 3, 3, 3, 4);
	}
	return f.dot;
}, true);

// ghettobomb.dm:33
rt.def("/obj/item/weapon/grenade/iedcasing/proc/CheckParts", function* CheckParts(f: Frame, parts_list: Value) {
	let can: Value = null, can_underlay: Value = null;
	yield* parent_proc();
	if (!(can = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans"), this.contents))) return f.dot;
	can.pixel_x = 0;
	can.pixel_y = 0;
	(can_underlay = (yield* new_(T("/mutable_appearance"), can))).layer = -1;
	can_underlay.plane = -32767;
	this.underlays += can_underlay;
	return f.dot;
}, true);

// ghettobomb.dm:45
rt.def("/obj/item/weapon/grenade/iedcasing/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let C: Value = null;
	let $2: any;
	if (this.active) return f.dot;
	if (!(yield* this.clown_check(user))) return f.dot;
	to_chat(user, `<span class='warning'>You light the ${this.name}!</span>`);
	this.active = 1;
	this.cut_overlay("improvised_grenade_filled");
	this.icon_state = rt.initial(f, this, "icon_state") + "_active";
	yield* this.add_fingerprint(user);
	let bombturf: Value = rt.getStep(f, this, 0);
	let A: Value = get_area(bombturf);
	let $0: any = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
	let $1: any = this.name;
	if (bombturf) {
		$2 = `${`(${bombturf.x},${bombturf.y},${bombturf.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${bombturf.x};Y=${bombturf.y};Z=${bombturf.z}'>JMP</a>)`}`;
	} else {
		$2 = "nonexistent location";
	}
	message_admins(`${$0} has primed a ${$1} for detonation at ${`${$2}`}.`);
	log_game(`${key_name(f.usr)} has primed a ${this.name} for detonation at ${A.name} ${`(${bombturf.x},${bombturf.y},${bombturf.z})`}.`);
	if (rt.istype(user, T("/mob/living/carbon"))) {
		(C = user).throw_mode_on();
	}
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/grenade/iedcasing/proc/prime"))), this.det_time);
	return f.dot;
}, true);

// ghettobomb.dm:63
rt.def("/obj/item/weapon/grenade/iedcasing/proc/prime", function* prime(f: Frame) {
	yield* this.update_mob();
	yield* explosion(this.loc, -1, -1, 2, { flame_range: 4 });
	yield* qdel(this);
	return f.dot;
}, true);

// ghettobomb.dm:68
rt.def("/obj/item/weapon/grenade/iedcasing/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, "You can't tell when it will explode!");
	return f.dot;
}, false);
