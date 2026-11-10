// Based on /tg/station's code/modules/reagents/reagent_containers/spray.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(6372, "/obj/item/weapon/reagent_containers/spray", "/obj/item/weapon/reagent_containers", {
	stream_mode: 0,
	current_range: 3,
	spray_range: 3,
	stream_range: 1,
	stream_amount: 10,
	flags: 4,
	container_type: 4096,
	throw_speed: 3,
	throw_range: 7,
	name: "spray bottle",
	desc: "A spray bottle, with an unscrewable top.",
	icon: rt.rsc("icons/obj/janitor.dmi"),
	icon_state: "cleaner",
	item_state: "cleaner",
	slot_flags: 512,
	throwforce: 0,
	w_class: 2,
	amount_per_transfer_from_this: 5,
	volume: 250,
	possible_transfer_amounts: null,
});

// spray.dm:25
rt.def("/obj/item/weapon/reagent_containers/spray/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value) {
	let trans: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	if (rt.istype(A, T("/obj/structure/sink")) || rt.istype(A, T("/obj/structure/janitorialcart")) || rt.istype(A, T("/obj/machinery/hydroponics"))) {
		return f.dot;
	}
	if (rt.istype(A, T("/obj/structure/reagent_dispensers")) && get_dist(this, A) <= 1) {
		if (!A.reagents.total_volume && A.reagents) {
			to_chat(user, fmt("<span class='notice'>＄！ is empty.</span>", [A]));
			return f.dot;
		}
		if (this.reagents.total_volume >= this.reagents.maximum_volume) {
			to_chat(user, fmt("<span class='notice'>＄！ is full.</span>", [this]));
			return f.dot;
		}
		trans = (yield* A.reagents.trans_to(this, 50));
		to_chat(user, fmt("<span class='notice'>You fill ％！ with ＀ units of the contents of ％！.</span>", [this, trans, A]));
		return f.dot;
	}
	if (this.reagents.total_volume < this.amount_per_transfer_from_this) {
		to_chat(user, fmt("<span class='warning'>＄！ is empty!</span>", [this]));
		return f.dot;
	}
	yield* this.spray(A);
	playsound(this.loc, rt.rsc("sound/effects/spray2.ogg"), 50, 1, -6);
	user.changeNext_move(8);
	yield* user.newtonian_move(rt.getDir(f, A, user));
	let _T: Value = rt.getStep(f, this, 0);
	let area: Value = get_area(this);
	if (this.reagents.has_reagent("sacid")) {
		$0 = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
		$1 = this;
		$2 = area;
		if (_T) {
			$3 = `${`(${_T.x},${_T.y},${_T.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`;
		} else {
			$3 = "nonexistent location";
		}
		message_admins(fmt("＀ fired sulphuric acid from ＇！ at ＀ ＀.", [$0, $1, $2, `${$3}`]));
		log_game(fmt("＀ fired sulphuric acid from ＇！ at ＀ (＀, ＀, ＀).", [key_name(user), this, area, _T.x, _T.y, _T.z]));
	}
	if (this.reagents.has_reagent("facid")) {
		$0 = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
		$1 = this;
		$2 = area;
		if (_T) {
			$3 = `${`(${_T.x},${_T.y},${_T.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`;
		} else {
			$3 = "nonexistent location";
		}
		message_admins(fmt("＀ fired Fluacid from ＇！ at ＀ ＀.", [$0, $1, $2, `${$3}`]));
		log_game(fmt("＀ fired Fluacid from ＇！ at ＀ ＀.", [key_name(user), this, area, `(${_T.x},${_T.y},${_T.z})`]));
	}
	if (this.reagents.has_reagent("lube")) {
		$0 = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
		$1 = this;
		$2 = area;
		if (_T) {
			$3 = `${`(${_T.x},${_T.y},${_T.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`;
		} else {
			$3 = "nonexistent location";
		}
		message_admins(fmt("＀ fired Space lube from ＇！ at ＀ ＀.", [$0, $1, $2, `${$3}`]));
		log_game(fmt("＀ fired Space lube from ＇！ at ＀ ＀.", [key_name(user), this, area, `(${_T.x},${_T.y},${_T.z})`]));
	}
	return f.dot;
}, true);

// spray.dm:65
rt.def("/obj/item/weapon/reagent_containers/spray/proc/spray", function* spray(f: Frame, A: Value) {
	let D: Value = null, range_left: Value = null, i: Value = null, _T: Value = null, M: Value = null;
	let range: Value = max(min(this.current_range, get_dist(this, A)), 1);
	yield* (D = (yield* new_(T("/obj/effect/decal/chempuff"), rt.getStep(f, this, 0)))).create_reagents(this.amount_per_transfer_from_this);
	let puff_reagent_left: Value = range;
	if (this.stream_mode) {
		yield* this.reagents.trans_to(D, this.amount_per_transfer_from_this);
		puff_reagent_left = 1;
	} else {
		yield* this.reagents.trans_to(D, this.amount_per_transfer_from_this, 1 / range);
	}
	D.color = mix_color_from_reagents(D.reagents.reagent_list);
	let wait_step: Value = max(round(2 + 3 / range), 2);
	rt.spawnTail(f, 0, "/obj/item/weapon/reagent_containers/spray/proc/spray: spawn at modules/reagents/reagent_containers/spray.dm:76", A, range, D, puff_reagent_left, wait_step, range_left, i, _T, M);
	return f.dot;
}, true);

// a spawn(0) body of /obj/item/weapon/reagent_containers/spray/proc/spray, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/reagent_containers/spray/proc/spray: spawn at modules/reagents/reagent_containers/spray.dm:76", function* (f: Frame, A: Value, range: Value, D: Value, puff_reagent_left: Value, wait_step: Value, range_left: Value, i: Value, _T: Value, M: Value) {
	range_left = range;
	i = null;
	i = 0;
	while (i < range) {
		range_left--;
		yield* step_towards(D, A);
		yield* sleep(wait_step);
		_T = null;
		for (_T of each(rt.getStep(f, D, 0), T("/atom"))) {
			if (_T == D || _T.invisibility) {
				continue;
			}
			if (puff_reagent_left <= 0) {
				break;
			}
			if (this.stream_mode) {
				if (ismob(_T)) {
					if (!(M = _T).lying || !range_left) {
						yield* D.reagents.reaction(M, 3);
						puff_reagent_left -= 1;
					}
				} else if (!range_left) {
					yield* D.reagents.reaction(_T, 3);
				}
			} else {
				yield* D.reagents.reaction(_T, 3);
				if (ismob(_T)) {
					puff_reagent_left -= 1;
				}
			}
		}
		if (puff_reagent_left > 0 && (!this.stream_mode || !range_left)) {
			yield* D.reagents.reaction(rt.getStep(f, D, 0), 3);
			puff_reagent_left -= 1;
		}
		if (puff_reagent_left <= 0) {
			yield* qdel(D);
			return f.dot;
		}
		i++;
	}
	yield* qdel(D);
	return null;
});

// spray.dm:112
rt.def("/obj/item/weapon/reagent_containers/spray/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $1: any;
	this.stream_mode = (!this.stream_mode ? 1 : 0);
	if (this.stream_mode) {
		this.amount_per_transfer_from_this = this.stream_amount;
		this.current_range = this.stream_range;
	} else {
		this.amount_per_transfer_from_this = rt.initial(f, this, "amount_per_transfer_from_this");
		this.current_range = this.spray_range;
	}
	let $0: any = user;
	if (this.stream_mode) {
		$1 = "\"stream\"";
	} else {
		$1 = "\"spray\"";
	}
	to_chat($0, `<span class='notice'>You switch the nozzle setting to ${$1}. You'll now use ${this.amount_per_transfer_from_this} units per use.</span>`);
	return f.dot;
});

// spray.dm:125
rt.def("/obj/item/weapon/reagent_containers/spray/verb/empty", function* empty(f: Frame) {
	if (f.usr.incapacitated()) {
		return f.dot;
	}
	if ((yield* alert(f.usr, "Are you sure you want to empty that?", "Empty Bottle:", "Yes", "No")) != "Yes") {
		return f.dot;
	}
	if (!(isturf(f.usr.loc) && this.loc == f.usr)) return f.dot;
	to_chat(f.usr, fmt("<span class='notice'>You empty ％！ onto the floor.</span>", [this]));
	yield* this.reagents.reaction(f.usr.loc);
	yield* this.reagents.clear_reagents();
	return f.dot;
}, true, { verb: { name: "Empty Spray Bottle", category: "Object", src: 11 } });

rt.type(6380, "/obj/item/weapon/reagent_containers/spray/cleaner", "/obj/item/weapon/reagent_containers/spray", {
	name: "space cleaner",
	desc: "BLAM!-brand non-foaming space cleaner!",
	list_reagents: null,
});

// spray.dm:138
rt.def("/obj/item/weapon/reagent_containers/spray/cleaner/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["cleaner", 250]);
	return f.dot;
});

rt.type(6381, "/obj/item/weapon/reagent_containers/spray/spraytan", "/obj/item/weapon/reagent_containers/spray", {
	name: "spray tan",
	volume: 50,
	desc: "Gyaro brand spray tan. Do not spray near eyes or other orifices.",
	list_reagents: null,
});

// spray.dm:145
rt.def("/obj/item/weapon/reagent_containers/spray/spraytan/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["spraytan", 50]);
	return f.dot;
});

rt.type(6383, "/obj/item/weapon/reagent_containers/spray/medical/sterilizer", "/obj/item/weapon/reagent_containers/spray/medical", {
	name: "sterilizer spray",
	desc: "Spray bottle loaded with non-toxic sterilizer. Useful in preparation for surgery.",
	list_reagents: null,
});

// spray.dm:158
rt.def("/obj/item/weapon/reagent_containers/spray/medical/sterilizer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["sterilizine", 100]);
	return f.dot;
});

rt.type(6384, "/obj/item/weapon/reagent_containers/spray/pepper", "/obj/item/weapon/reagent_containers/spray", {
	stream_range: 4,
	name: "pepperspray",
	desc: "Manufactured by UhangInc, used to blind and down an opponent quickly.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "pepperspray",
	item_state: "pepperspray",
	volume: 40,
	amount_per_transfer_from_this: 5,
	list_reagents: null,
});

// spray.dm:171
rt.def("/obj/item/weapon/reagent_containers/spray/pepper/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["condensedcapsaicin", 40]);
	return f.dot;
});

// spray.dm:175
rt.def("/obj/item/weapon/reagent_containers/spray/pepper/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value) {
	if (A.loc == user) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(6385, "/obj/item/weapon/reagent_containers/spray/waterflower", "/obj/item/weapon/reagent_containers/spray", {
	name: "water flower",
	desc: "A seemingly innocent sunflower...with a twist.",
	icon: rt.rsc("icons/obj/hydroponics/harvest.dmi"),
	icon_state: "sunflower",
	item_state: "sunflower",
	amount_per_transfer_from_this: 1,
	volume: 10,
	list_reagents: null,
});

// spray.dm:188
rt.def("/obj/item/weapon/reagent_containers/spray/waterflower/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["water", 10]);
	return f.dot;
});

rt.type(6386, "/obj/item/weapon/reagent_containers/spray/chemsprayer", "/obj/item/weapon/reagent_containers/spray", {
	stream_mode: 1,
	current_range: 7,
	spray_range: 4,
	stream_range: 7,
	name: "chem sprayer",
	desc: "A utility used to spray large amounts of reagents in a given area.",
	icon: rt.rsc("icons/obj/guns/projectile.dmi"),
	icon_state: "chemsprayer",
	item_state: "chemsprayer",
	throwforce: 0,
	w_class: 3,
	amount_per_transfer_from_this: 10,
	volume: 600,
	origin_tech: "combat=3;materials=3;engineering=3",
});

// spray.dm:212
rt.def("/obj/item/weapon/reagent_containers/spray/chemsprayer/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value) {
	if (A.loc == user) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// spray.dm:217
rt.def("/obj/item/weapon/reagent_containers/spray/chemsprayer/proc/spray", function* spray(f: Frame, A: Value) {
	let direction: Value = rt.getDir(f, this, A);
	let _T: Value = rt.getStep(f, A, 0);
	let T1: Value = rt.getStep(f, _T, turn(direction, 90));
	let T2: Value = rt.getStep(f, _T, turn(direction, -90));
	let the_targets: Value = list(_T, T1, T2);
	let i: Value = 1;
	while (i <= 3) {
		if (this.reagents.total_volume < 1) {
			return f.dot;
		}
		yield* parent_proc(rt.index(the_targets, i));
		i++;
	}
	return f.dot;
}, true);

rt.type(6387, "/obj/item/weapon/reagent_containers/spray/chemsprayer/bioterror", "/obj/item/weapon/reagent_containers/spray/chemsprayer", {
	list_reagents: null,
});

// spray.dm:229
rt.def("/obj/item/weapon/reagent_containers/spray/chemsprayer/bioterror/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["sodium_thiopental", 100, "coniine", 100, "venom", 100, "condensedcapsaicin", 100, "initropidril", 100, "polonium", 100]);
	return f.dot;
});

rt.type(6388, "/obj/item/weapon/reagent_containers/spray/plantbgone", "/obj/item/weapon/reagent_containers/spray", {
	name: "Plant-B-Gone",
	desc: "Kills those pesky weeds!",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "plantbgone",
	item_state: "plantbgone",
	volume: 100,
	list_reagents: null,
});

// spray.dm:239
rt.def("/obj/item/weapon/reagent_containers/spray/plantbgone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["plantbgone", 100]);
	return f.dot;
});
