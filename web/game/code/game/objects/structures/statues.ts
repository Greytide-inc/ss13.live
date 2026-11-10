// Based on /tg/station's code/game/objects/structures/statues.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(12829, "/obj/structure/statue", "/obj/structure", {
	oreAmount: 5,
	material_drop_type: rt.typePath("/obj/item/stack/sheet/metal"),
	anchored: 0,
	CanAtmosPass: -2,
	name: "statue",
	desc: "Placeholder. Yell at Firecage if you SOMEHOW see this.",
	icon: rt.rsc("icons/obj/statue.dmi"),
	icon_state: "",
	density: 1,
	obj_integrity: 100,
	max_integrity: 100,
});

// statues.dm:18
rt.def("/obj/structure/statue/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let D: Value = null;
	yield* this.add_fingerprint(user);
	user.changeNext_move(8);
	if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		if (this.anchored) {
			playsound(this.loc, W.usesound, 100, 1);
			user.visible_message(`${user} is loosening the ${this.name}'s bolts.`, `<span class='notice'>You are loosening the ${this.name}'s bolts...</span>`);
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				if (!this.loc || !this.anchored) {
					return f.dot;
				}
				user.visible_message(`${user} loosened the ${this.name}'s bolts!`, `<span class='notice'>You loosen the ${this.name}'s bolts!</span>`);
				this.anchored = 0;
			}
		} else {
			if (!rt.istype(this.loc, T("/turf/open/floor"))) {
				user.visible_message(`<span class='warning'>A floor must be present to secure the ${this.name}!</span>`);
				return f.dot;
			}
			playsound(this.loc, W.usesound, 100, 1);
			user.visible_message(`${user} is securing the ${this.name}'s bolts...`, `<span class='notice'>You are securing the ${this.name}'s bolts...</span>`);
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				if (!this.loc || this.anchored) {
					return f.dot;
				}
				user.visible_message(`${user} has secured the ${this.name}'s bolts.`, `<span class='notice'>You have secured the ${this.name}'s bolts.</span>`);
				this.anchored = 1;
			}
		}
	} else if (rt.istype(W, T("/obj/item/weapon/gun/energy/plasmacutter"))) {
		playsound(this, rt.rsc("sound/items/welder.ogg"), 100, 1);
		user.visible_message(`${user} is slicing apart the ${this.name}...`, `<span class='notice'>You are slicing apart the ${this.name}...</span>`);
		if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
			if (!this.loc) {
				return f.dot;
			}
			user.visible_message(`${user} slices apart the ${this.name}.`, `<span class='notice'>You slice apart the ${this.name}.</span>`);
			yield* this.deconstruct(1);
		}
	} else if (rt.istype(W, T("/obj/item/weapon/pickaxe/drill/jackhammer"))) {
		D = W;
		if (!this.loc) {
			return f.dot;
		}
		user.visible_message(`${user} destroys the ${this.name}!`, `<span class='notice'>You destroy the ${this.name}.</span>`);
		D.playDigSound();
		yield* qdel(this);
	} else if (rt.istype(W, T("/obj/item/weapon/weldingtool")) && !this.anchored) {
		playsound(this.loc, W.usesound, 40, 1);
		user.visible_message(`${user} is slicing apart the ${this.name}.`, `<span class='notice'>You are slicing apart the ${this.name}...</span>`);
		if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
			if (!this.loc) {
				return f.dot;
			}
			playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 50, 1);
			user.visible_message(`${user} slices apart the ${this.name}.`, `<span class='notice'>You slice apart the ${this.name}!</span>`);
			yield* this.deconstruct(1);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// statues.dm:80
rt.def("/obj/structure/statue/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	user.changeNext_move(8);
	yield* this.add_fingerprint(user);
	user.visible_message(`${user} rubs some dust off from the ${this.name}'s surface.`, `<span class='notice'>You rub some dust off from the ${this.name}'s surface.</span>`);
	return f.dot;
}, true);

// statues.dm:86
rt.def("/obj/structure/statue/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let drop_amt: Value = null;
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (this.material_drop_type) {
			drop_amt = this.oreAmount;
			if (!disassembled) {
				drop_amt -= 2;
			}
			if (drop_amt > 0) {
				yield* new_(this.material_drop_type, rt.getStep(f, this, 0), drop_amt);
			}
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12831, "/obj/structure/statue/uranium", "/obj/structure/statue", {
	last_event: 0,
	active: null,
	light_range: 2,
	material_drop_type: rt.typePath("/obj/item/stack/sheet/mineral/uranium"),
	obj_integrity: 300,
});

// statues.dm:116
rt.def("/obj/structure/statue/uranium/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	yield* this.radiate();
	return (yield* parent_proc());
}, true);

// statues.dm:120
rt.def("/obj/structure/statue/uranium/proc/Bumped", function* Bumped(f: Frame, user: Value) {
	yield* this.radiate();
	yield* parent_proc();
	return f.dot;
}, true);

// statues.dm:124
rt.def("/obj/structure/statue/uranium/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* this.radiate();
	yield* parent_proc();
	return f.dot;
}, true);

// statues.dm:128
rt.def("/obj/structure/statue/uranium/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	yield* this.radiate();
	yield* parent_proc();
	return f.dot;
}, true);

// statues.dm:132
rt.def("/obj/structure/statue/uranium/proc/radiate", function* radiate(f: Frame) {
	if (!this.active) {
		if (rt.worldTime(f) > this.last_event + 15) {
			this.active = 1;
			yield* radiation_pulse(rt.getStep(f, this, 0), 3, 3, 12, 0);
			this.last_event = rt.worldTime(f);
			this.active = null;
			return f.dot;
		}
	}
	return f.dot;
}, true);

rt.type(12834, "/obj/structure/statue/plasma", "/obj/structure/statue", {
	material_drop_type: rt.typePath("/obj/item/stack/sheet/mineral/plasma"),
	obj_integrity: 200,
	desc: "This statue is suitably made from plasma.",
});

// statues.dm:153
rt.def("/obj/structure/statue/plasma/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	if (!(exposed_temperature > 300)) return f.dot;
	yield* this.PlasmaBurn(exposed_temperature);
	return f.dot;
}, true);

// statues.dm:159
rt.def("/obj/structure/statue/plasma/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	let _T: Value = null;
	let $0: any, $1: any;
	let burn: Value = 0;
	if (rt.istype(Proj, T("/obj/item/projectile/beam"))) {
		yield* this.PlasmaBurn(2500);
		burn = 1;
	} else if (rt.istype(Proj, T("/obj/item/projectile/ion"))) {
		yield* this.PlasmaBurn(500);
		burn = 1;
	}
	if (burn) {
		_T = rt.getStep(f, this, 0);
		if (Proj.firer) {
			$0 = `${key_name_admin(Proj.firer)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [Proj.firer])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [Proj.firer])}`;
			if (_T) {
				$1 = `${`(${_T.x},${_T.y},${_T.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`;
			} else {
				$1 = "nonexistent location";
			}
			message_admins(`Plasma statue ignited by ${$0} in ${`${$1}`}`, 0, 1);
			log_game(`Plasma statue ignited by ${key_name(Proj.firer)} in ${`(${_T.x},${_T.y},${_T.z})`}`);
		} else {
			$0 = Proj;
			if (_T) {
				$1 = `${`(${_T.x},${_T.y},${_T.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`;
			} else {
				$1 = "nonexistent location";
			}
			message_admins(`Plasma statue ignited by ${$0}. No known firer, in ${`${$1}`}`, 0, 1);
			log_game(`Plasma statue ignited by ${Proj} in ${`(${_T.x},${_T.y},${_T.z})`}. No known firer.`);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// statues.dm:176
rt.def("/obj/structure/statue/plasma/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
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
		message_admins(`Plasma statue ignited by ${$0} in ${`${$1}`}`, 0, 1);
		log_game(`Plasma statue ignited by ${key_name(user)} in ${`(${_T.x},${_T.y},${_T.z})`}`);
		yield* this.ignite(W.is_hot());
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// statues.dm:185
rt.def("/obj/structure/statue/plasma/proc/PlasmaBurn", function* PlasmaBurn(f: Frame) {
	this.atmos_spawn_air("plasma=400;TEMP=1000");
	yield* this.deconstruct(0);
	return f.dot;
}, true);

// statues.dm:189
rt.def("/obj/structure/statue/plasma/proc/ignite", function* ignite(f: Frame, exposed_temperature: Value) {
	if (!(exposed_temperature > 300)) return f.dot;
	yield* this.PlasmaBurn(exposed_temperature);
	return f.dot;
}, true);

rt.type(12852, "/obj/structure/statue/bananium", "/obj/structure/statue", {
	spam_flag: 0,
	material_drop_type: rt.typePath("/obj/item/stack/sheet/mineral/bananium"),
	obj_integrity: 300,
	desc: "A bananium statue with a small engraving:'HOOOOOOONK'.",
});

// statues.dm:278
rt.def("/obj/structure/statue/bananium/proc/Bumped", function Bumped(f: Frame, user: Value) {
	this.honk();
	parent_proc();
	return f.dot;
}, false);

// statues.dm:282
rt.def("/obj/structure/statue/bananium/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	this.honk();
	return (yield* parent_proc());
}, true);

// statues.dm:286
rt.def("/obj/structure/statue/bananium/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	this.honk();
	yield* parent_proc();
	return f.dot;
}, true);

// statues.dm:290
rt.def("/obj/structure/statue/bananium/proc/attack_paw", function attack_paw(f: Frame, user: Value) {
	this.honk();
	parent_proc();
	return f.dot;
}, false);

// statues.dm:294
rt.def("/obj/structure/statue/bananium/proc/honk", function honk(f: Frame) {
	if (this.spam_flag) return f.dot;
	this.spam_flag = 1;
	playsound(this.loc, rt.rsc("sound/items/bikehorn.ogg"), 50, 1);
	rt.spawnTail(f, 20, "/obj/structure/statue/bananium/proc/honk: spawn at game/objects/structures/statues.dm:297");
	return f.dot;
});

// a spawn(20) body of /obj/structure/statue/bananium/proc/honk, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/structure/statue/bananium/proc/honk: spawn at game/objects/structures/statues.dm:297", function* (f: Frame) {
	this.spam_flag = 0;
	return null;
});
