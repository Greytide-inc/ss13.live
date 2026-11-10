// Based on /tg/station's code/modules/projectiles/guns/misc/blastcannon.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(5285, "/obj/item/weapon/gun/blastcannon", "/obj/item/weapon/gun", {
	icon_state_loaded: "loaded_blastcannon",
	bomb: null,
	air1: null,
	air2: null,
	fire_sound: rt.rsc("sound/weapons/blastcannon.ogg"),
	clumsy_check: 0,
	randomspread: 0,
	name: "pipe gun",
	desc: "A pipe welded onto a gun stock, with a mechanical trigger. The pipe has an opening near the top, and there seems to be a spring loaded wheel in the hole.",
	icon_state: "empty_blastcannon",
	item_state: "blastcannon_empty",
	w_class: 3,
	force: 10,
	needs_permit: 0,
});

// blastcannon.dm:19
rt.def("/obj/item/weapon/gun/blastcannon/proc/New", function* New(f: Frame) {
	if (!this.pin) {
		this.pin = (yield* new_(T("/obj/item/device/firing_pin")));
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// blastcannon.dm:25
rt.def("/obj/item/weapon/gun/blastcannon/proc/Destroy", function* Destroy(f: Frame) {
	if (this.bomb) {
		yield* qdel(this.bomb);
		this.bomb = null;
	}
	this.air1 = null;
	this.air2 = null;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// blastcannon.dm:33
rt.def("/obj/item/weapon/gun/blastcannon/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (this.bomb) {
		yield* this.bomb.forceMove(user.loc);
		yield* user.put_in_hands(this.bomb);
		user.visible_message(`<span class='warning'>${user} detaches the ${this.bomb} from the ${this}</span>`);
		this.bomb = null;
	}
	yield* this.update_icon();
	f.dot = (yield* parent_proc(user));
	return f.dot;
}, true);

// blastcannon.dm:42
rt.def("/obj/item/weapon/gun/blastcannon/proc/update_icon", function update_icon(f: Frame) {
	if (this.bomb) {
		this.icon_state = this.icon_state_loaded;
		this.name = "blast cannon";
		this.desc = "A makeshift device used to concentrate a bomb's blast energy to a narrow wave.";
	} else {
		this.icon_state = rt.initial(f, this, "icon_state");
		this.name = rt.initial(f, this, "name");
		this.desc = rt.initial(f, this, "desc");
	}
	f.dot = parent_proc();
	return f.dot;
});

// blastcannon.dm:52
rt.def("/obj/item/weapon/gun/blastcannon/proc/attackby", function* attackby(f: Frame, O: Value, user: Value) {
	let _T: Value = null;
	if (rt.istype(O, T("/obj/item/device/transfer_valve"))) {
		if (!(_T = O).tank_one || !_T.tank_two) {
			to_chat(user, "<span class='warning'>What good would an incomplete bomb do?</span>");
			return 0;
		}
		if (!(yield* user.drop_item(O))) {
			to_chat(user, `<span class='warning'>The ${O} seems to be stuck to your hand!</span>`);
			return 0;
		}
		user.visible_message(`<span class='warning'>${user} attaches the ${O} to the ${this}!</span>`);
		this.bomb = O;
		O.loc = this;
		yield* this.update_icon();
		return 1;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// blastcannon.dm:68
rt.def("/obj/item/weapon/gun/blastcannon/proc/calculate_bomb", function* calculate_bomb(f: Frame) {
	let temp: Value = null, i: Value = null;
	let $e: any;
	if (!rt.istype(this.bomb, T("/obj/item/device/transfer_valve")) || !rt.istype(this.bomb.tank_one, T("/obj/item/weapon/tank")) || !rt.istype(this.bomb.tank_two, T("/obj/item/weapon/tank"))) {
		return 0;
	}
	this.air1 = this.bomb.tank_one.air_contents;
	this.air2 = this.bomb.tank_two.air_contents;
	temp.volume = this.air1.volume + this.air2.volume;
	yield* temp.merge(this.air1);
	yield* temp.merge(this.air2);
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* temp.react();
	}
	rt.endFor(f, 0);
	let pressure: Value = temp.return_pressure();
	yield* qdel(temp);
	if (pressure < TANK_FRAGMENT_PRESSURE) {
		return 0;
	}
	return pressure / 607.94995;
}, true);

// blastcannon.dm:85
rt.def("/obj/item/weapon/gun/blastcannon/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value, params: Value) {
	let log_str: Value = null;
	let $0: any;
	if (!this.bomb || target == user || target.loc == user || !target || target.loc == user.loc || rt.isIn(f, target.loc, range(user, 2)) || rt.isIn(f, target, range(user, 2))) {
		return (yield* parent_proc());
	}
	let power: Value = (yield* this.calculate_bomb());
	yield* qdel(this.bomb);
	yield* this.update_icon();
	let heavy: Value = power * 0.2;
	let medium: Value = power * 0.5;
	let light: Value = power;
	user.visible_message(fmt("<span class='danger'>＀ opens ％！ on ＋ ＀ and fires a blast wave at ％！!</span>", [user, this.bomb, this.name, target]), fmt("<span class='danger'>You open ％！ on your ＀ and fire a blast wave at ％！!</span>", [this.bomb, this.name, target]));
	playsound(user, "explosion", 100, 1);
	let starting: Value = rt.getStep(f, user, 0);
	let A: Value = get_area(user);
	if (starting) {
		$0 = `${`(${starting.x},${starting.y},${starting.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${starting.x};Y=${starting.y};Z=${starting.z}'>JMP</a>)`}`;
	} else {
		$0 = "nonexistent location";
	}
	message_admins((log_str = `Blast wave fired at ${`${$0}`} (${A.name}) by ${user.name}(${user.ckey}) with power ${heavy}/${medium}/${light}.`));
	log_game(log_str);
	return f.dot;
}, true);

rt.type(8902, "/obj/item/projectile/blastwave", "/obj/item/projectile", {
	heavyr: 0,
	mediumr: 0,
	lightr: 0,
	damage: 0,
	nodamage: 0,
	forcedodge: 1,
	range: 150,
	name: "blast wave",
	icon_state: "blastwave",
});

// blastcannon.dm:113
rt.def("/obj/item/projectile/blastwave/proc/Range", function* Range(f: Frame) {
	yield* parent_proc();
	if (this.heavyr) {
		yield* this.loc.ex_act(1);
	} else if (this.mediumr) {
		yield* this.loc.ex_act(2);
	} else if (this.lightr) {
		yield* this.loc.ex_act(3);
	} else {
		yield* qdel(this);
	}
	this.heavyr--;
	this.mediumr--;
	this.lightr--;
	return f.dot;
}, true);
