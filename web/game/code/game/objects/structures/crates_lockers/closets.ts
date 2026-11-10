// Based on /tg/station's code/game/objects/structures/crates_lockers/closets.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(12251, "/obj/structure/closet", "/obj/structure", {
	icon_door: null,
	icon_door_override: 0,
	secure: 0,
	opened: 0,
	welded: 0,
	locked: 0,
	large: 1,
	wall_mounted: 0,
	breakout_time: 2,
	lastbang: null,
	can_weld_shut: 1,
	horizontal: 0,
	allow_objects: 0,
	allow_dense: 0,
	dense_when_open: 0,
	max_mob_size: 2,
	mob_storage_capacity: 3,
	storage_capacity: 30,
	cutting_tool: rt.typePath("/obj/item/weapon/weldingtool"),
	open_sound: rt.rsc("sound/machines/click.ogg"),
	close_sound: rt.rsc("sound/machines/click.ogg"),
	cutting_sound: rt.rsc("sound/items/welder.ogg"),
	material_drop: rt.typePath("/obj/item/stack/sheet/metal"),
	material_drop_amount: 2,
	delivery_icon: "deliverycloset",
	anchorable: 1,
	name: "closet",
	desc: "It's a basic storage unit.",
	icon: rt.rsc("icons/obj/closet.dmi"),
	icon_state: "generic",
	density: 1,
	obj_integrity: 200,
	max_integrity: 200,
	integrity_failure: 50,
	armor: null,
});

// closets.dm:18
rt.def("/obj/structure/closet/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 20, "bullet", 10, "laser", 10, "energy", 0, "bomb", 10, "bio", 0, "rad", 0, "fire", 70, "acid", 60]);
	return f.dot;
});

// closets.dm:40
rt.def("/obj/structure/closet/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	if (mapload && !this.opened) {
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/structure/closet/proc/take_contents"))), 0);
	}
	yield* parent_proc();
	yield* this.update_icon();
	yield* this.PopulateContents();
	return f.dot;
}, true);

// closets.dm:51
rt.def("/obj/structure/closet/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.dump_contents();
	return (yield* parent_proc());
}, true);

// closets.dm:55
rt.def("/obj/structure/closet/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (!this.opened) {
		if (this.icon_door) {
			this.add_overlay(`${this.icon_door}_door`);
		} else {
			this.add_overlay(`${this.icon_state}_door`);
		}
		if (this.welded) {
			this.add_overlay("welded");
		}
		if (this.secure) {
			if (!this.broken) {
				if (this.locked) {
					this.add_overlay("locked");
				} else {
					this.add_overlay("unlocked");
				}
			} else {
				this.add_overlay("off");
			}
		}
	} else if (this.icon_door_override) {
		this.add_overlay(`${this.icon_door}_open`);
	} else {
		this.add_overlay(`${this.icon_state}_open`);
	}
	return f.dot;
});

// closets.dm:79
rt.def("/obj/structure/closet/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.anchored) {
		to_chat(user, "It is anchored to the ground.");
	} else {
		if (!(this.secure && !this.opened)) return f.dot;
		to_chat(user, `<span class='notice'>Alt-click to ${this.locked ? "unlock" : "lock"}.</span>`);
	}
	return f.dot;
}, false);

// closets.dm:86
rt.def("/obj/structure/closet/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	height ??= 0;
	if (height == 0 || this.wall_mounted) {
		return 1;
	}
	return (!this.density ? 1 : 0);
});

// closets.dm:91
rt.def("/obj/structure/closet/proc/can_open", function can_open(f: Frame, user: Value) {
	let L: Value = null;
	if (this.welded || this.locked) {
		return 0;
	}
	let _T: Value = rt.getStep(f, this, 0);
	for (L of each(_T, T("/mob/living"))) {
		if (L.anchored || this.horizontal && L.mob_size > MOB_SIZE_TINY && L.density) {
			if (user) {
				to_chat(user, `<span class='danger'>There's something large on top of ${this}, preventing it from opening.</span>`);
			}
			return 0;
		}
	}
	return 1;
});

// closets.dm:102
rt.def("/obj/structure/closet/proc/can_close", function can_close(f: Frame, user: Value) {
	let closet: Value = null, L: Value = null;
	let _T: Value = rt.getStep(f, this, 0);
	for (closet of each(_T, T("/obj/structure/closet"))) {
		if (closet != this && !closet.wall_mounted) {
			return 0;
		}
	}
	for (L of each(_T, T("/mob/living"))) {
		if (L.anchored || this.horizontal && L.mob_size > MOB_SIZE_TINY && L.density) {
			if (user) {
				to_chat(user, `<span class='danger'>There's something too large in ${this}, preventing it from closing.</span>`);
			}
			return 0;
		}
	}
	return 1;
});

// closets.dm:114
rt.def("/obj/structure/closet/proc/dump_contents", function* dump_contents(f: Frame) {
	let AM: Value = null;
	let _T: Value = rt.getStep(f, this, 0);
	for (AM of each(this, T("/atom/movable"))) {
		yield* AM.forceMove(_T);
		if (this.throwing) {
			yield* step(AM, this.dir);
		}
	}
	if (!this.throwing) return f.dot;
	yield* this.throwing.finalize(0);
	return f.dot;
}, true);

// closets.dm:123
rt.def("/obj/structure/closet/proc/take_contents", function* take_contents(f: Frame) {
	let AM: Value = null;
	let _T: Value = rt.getStep(f, this, 0);
	for (AM of each(_T, T("/atom/movable"))) {
		if (AM != this && (yield* this.insert(AM)) == -1) {
			break;
		}
	}
	return f.dot;
}, true);

// closets.dm:129
rt.def("/obj/structure/closet/proc/open", function* open(f: Frame, user: Value) {
	if (this.opened || !this.can_open(user)) {
		return f.dot;
	}
	playsound(this.loc, this.open_sound, 15, 1, -3);
	this.opened = 1;
	if (!this.dense_when_open) {
		this.density = 0;
	}
	this.climb_time *= 0.5;
	yield* this.dump_contents();
	yield* this.update_icon();
	return 1;
}, true);

// closets.dm:141
rt.def("/obj/structure/closet/proc/insert", function* insert(f: Frame, AM: Value) {
	let L: Value = null, mobs_stored: Value = null, M: Value = null;
	if (rt.len(f, this.contents) >= this.storage_capacity) {
		return -1;
	}
	if (ismob(AM)) {
		if (!rt.istype(AM, T("/mob/living"))) {
			return f.dot;
		}
		if ((L = AM).anchored || L.buckled || L.incorporeal_move || L.has_buckled_mobs()) {
			return f.dot;
		}
		if (L.mob_size > MOB_SIZE_TINY) {
			if (this.horizontal && L.density) {
				return f.dot;
			}
			if (L.mob_size > this.max_mob_size) {
				return f.dot;
			}
			mobs_stored = 0;
			for (M of each(this.contents, T("/mob/living"))) {
				if (++mobs_stored >= this.mob_storage_capacity) {
					return f.dot;
				}
			}
		}
		yield* L.stop_pulling();
	} else if (rt.istype(AM, T("/obj/structure/closet"))) {
		return f.dot;
	} else if (rt.istype(AM, T("/obj"))) {
		if (!this.allow_objects && !rt.istype(AM, T("/obj/item")) && !rt.istype(AM, T("/obj/effect/dummy/chameleon"))) {
			return f.dot;
		}
		if (!this.allow_dense && AM.density) {
			return f.dot;
		}
		if (AM.anchored || AM.has_buckled_mobs() || rt.bitAnd(AM.flags, NODROP)) {
			return f.dot;
		}
	} else {
		return f.dot;
	}
	yield* AM.forceMove(this);
	if (AM.pulledby) {
		yield* AM.pulledby.stop_pulling();
	}
	return 1;
}, true);

// closets.dm:180
rt.def("/obj/structure/closet/proc/close", function* close(f: Frame, user: Value) {
	if (!this.opened || !this.can_close(user)) {
		return 0;
	}
	yield* this.take_contents();
	playsound(this.loc, this.close_sound, 15, 1, -3);
	this.climb_time = rt.initial(f, this, "climb_time");
	this.opened = 0;
	this.density = 1;
	yield* this.update_icon();
	return 1;
}, true);

// closets.dm:192
rt.def("/obj/structure/closet/proc/toggle", function* toggle(f: Frame, user: Value) {
	if (this.opened) {
		return (yield* this.close(user));
	}
	return (yield* this.open(user));
}, true);

// closets.dm:197
rt.def("/obj/structure/closet/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (ispath(this.material_drop) && this.material_drop_amount && !rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* new_(this.material_drop, this.loc, this.material_drop_amount);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// closets.dm:202
rt.def("/obj/structure/closet/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	if (!(!this.broken && !rt.bitAnd(this.flags, NODECONSTRUCT))) return f.dot;
	yield* this.bust_open();
	return f.dot;
}, true);

// closets.dm:206
rt.def("/obj/structure/closet/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let WT: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any;
	if (rt.isIn(f, user, this)) {
		return f.dot;
	}
	if (this.opened) {
		if (rt.op(f, "IsType", [], [W, this.cutting_tool])) {
			if (rt.istype(W, T("/obj/item/weapon/weldingtool"))) {
				if (yield* (WT = W).remove_fuel(0, user)) {
					to_chat(user, fmt("<span class='notice'>You begin cutting ％！ apart...</span>", [this]));
					playsound(this.loc, this.cutting_sound, 40, 1);
					if (yield* do_after(user, 40 * WT.toolspeed, 1, { target: this })) {
						if (!this.opened || !WT.isOn()) {
							return f.dot;
						}
						playsound(this.loc, this.cutting_sound, 50, 1);
						user.visible_message(fmt("<span class='notice'>＀ slices apart ％！.</span>", [user, this]), fmt("<span class='notice'>You cut ％！ apart with ％！.</span>", [this, WT]), "<span class='italics'>You hear welding.</span>");
						yield* this.deconstruct(1);
					}
					return 0;
				}
			} else {
				user.visible_message(fmt("<span class='notice'>＀ cut apart ％！.</span>", [user, this]), fmt("<span class='notice'>You cut ％！ apart with ％！.</span>", [this, W]));
				yield* this.deconstruct(1);
				return 0;
			}
		}
		if (yield* user.drop_item()) {
			yield* W.forceMove(this.loc);
			return 1;
		}
	} else if (rt.istype(W, T("/obj/item/weapon/weldingtool")) && this.can_weld_shut) {
		if (!(yield* (WT = W).remove_fuel(0, user))) {
			return f.dot;
		}
		to_chat(user, fmt("<span class='notice'>You begin ＀ ％！...</span>", [this.welded ? "unwelding" : "welding", this]));
		playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 40, 1);
		if (yield* do_after(user, 40 * WT.toolspeed, 1, { target: this })) {
			if (this.opened || !WT.isOn()) {
				return f.dot;
			}
			playsound(this.loc, WT.usesound, 50, 1);
			this.welded = (!this.welded ? 1 : 0);
			$0 = user;
			$1 = user;
			if (this.welded) {

				$2 = "welds shut";
			} else {
				$2 = "unweldeds";
			}
			$1 = fmt("<span class='notice'>＀ ＀ ％！.</span>", [$1, $2, this]);
			if (this.welded) {
				$2 = "weld";
			} else {
				$2 = "unwelded";
			}
			$0.visible_message($1, fmt("<span class='notice'>You ＀ ％！ with ％！.</span>", [$2, this, WT]), "<span class='italics'>You hear welding.</span>");
			yield* this.update_icon();
		}
	} else if (rt.istype(W, T("/obj/item/weapon/wrench")) && this.anchorable) {
		if (this.isinspace() && !this.anchored) {
			return f.dot;
		}
		this.anchored = (!this.anchored ? 1 : 0);
		playsound(this.loc, W.usesound, 75, 1);
		$0 = user;
		$1 = user;
		if (this.anchored) {

			$2 = "anchored";
		} else {
			$2 = "unanchored";
		}
		$3 = this;
		if (this.anchored) {
			$4 = "to";
		} else {
			$4 = "from";
		}
		$1 = fmt("<span class='notice'>＀ ＀ ％！ ＀ the ground.</span>", [$1, $2, $3, $4]);
		if (this.anchored) {
			$2 = "anchored";
		} else {
			$2 = "unanchored";
		}
		$3 = this;
		if (this.anchored) {
			$4 = "to";
		} else {
			$4 = "from";
		}
		$0.visible_message($1, fmt("<span class='notice'>You ＀ ％！ ＀ the ground.</span>", [$2, $3, $4]), "<span class='italics'>You hear a ratchet.</span>");
	} else if (user.a_intent != "harm" && !rt.bitAnd(W.flags, NOBLUDGEON)) {
		if (W.GetID() || !(yield* this.toggle(user))) {
			yield* this.togglelock(user);
		}
		return 1;
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// closets.dm:263
rt.def("/obj/structure/closet/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, O: Value, user: Value) {
	let L: Value = null;
	let $2: any;
	if (!rt.istype(O, T("/atom/movable")) || O.anchored || rt.istype(O, T("/obj/screen"))) {
		return f.dot;
	}
	if (!rt.istype(user, T("/mob/living")) || user.incapacitated() || user.lying) {
		return f.dot;
	}
	if (!this.Adjacent(user) || !user.Adjacent(O)) {
		return f.dot;
	}
	if (user == O) {
		return (yield* parent_proc());
	}
	if (!this.opened) {
		return f.dot;
	}
	if (!isturf(O.loc)) {
		return f.dot;
	}
	let actuallyismob: Value = 0;
	if (rt.istype(O, T("/mob/living"))) {
		actuallyismob = 1;
	} else if (!rt.istype(O, T("/obj/item"))) {
		return f.dot;
	}
	let _T: Value = rt.getStep(f, this, 0);
	let targets: Value = list(O, this);
	yield* this.add_fingerprint(user);
	let $0: any = user;
	let $1: any = user;
	if (actuallyismob) {

		$2 = "tries to ";
	} else {
		$2 = "";
	}
	$1 = `<span class='warning'>${$1} ${$2}stuff ${O} into ${this}.</span>`;
	if (actuallyismob) {
		$2 = "try to ";
	} else {
		$2 = "";
	}
	$0.visible_message($1, `<span class='warning'>You ${$2}stuff ${O} into ${this}.</span>`, "<span class='italics'>You hear clanging.</span>");
	if (actuallyismob) {
		if (yield* do_after_mob(user, targets, 40)) {
			user.visible_message(`<span class='notice'>${user} stuffs ${O} into ${this}.</span>`, `<span class='notice'>You stuff ${O} into ${this}.</span>`, "<span class='italics'>You hear a loud metal bang.</span>");
			if (!rt.istype((L = O), T("/mob/living/silicon"))) {
				yield* L.Knockdown(40);
			}
			yield* O.forceMove(_T);
			yield* this.close();
		}
	} else {
		yield* O.forceMove(_T);
	}
	return 1;
}, true);

// closets.dm:302
rt.def("/obj/structure/closet/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	let M: Value = null;
	if (user.stat || !isturf(this.loc) || !rt.istype(user, T("/mob/living"))) {
		return f.dot;
	}
	let L: Value = user;
	if (yield* this.open()) return f.dot;
	if (L.last_special <= rt.worldTime(f)) {
		yield* this.container_resist(L);
	}
	if (!(rt.worldTime(f) > this.lastbang + 5)) return f.dot;
	this.lastbang = rt.worldTime(f);
	for (M of each(get_hearers_in_view(this, null), T("/mob"))) {
		M.show_message(`<FONT size=${max(0, 5 - get_dist(this, M))}>BANG, bang!</FONT>`, 2);
	}
	return f.dot;
}, true);

// closets.dm:314
rt.def("/obj/structure/closet/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* parent_proc();
	if (user.lying && get_dist(this, user) > 0) {
		return f.dot;
	}
	if (yield* this.toggle(user)) return f.dot;
	yield* this.togglelock(user);
	return f.dot;
}, true);

// closets.dm:323
rt.def("/obj/structure/closet/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// closets.dm:326
rt.def("/obj/structure/closet/proc/attack_robot", function* attack_robot(f: Frame, user: Value) {
	if (!user.Adjacent(this)) return f.dot;
	return (yield* this.attack_hand(user));
}, true);

// closets.dm:331
rt.def("/obj/structure/closet/proc/attack_self_tk", function* attack_self_tk(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// closets.dm:338
rt.def("/obj/structure/closet/verb/verb_toggleopen", function* verb_toggleopen(f: Frame) {
	if (!f.usr.canmove || f.usr.stat || f.usr.restrained()) {
		return f.dot;
	}
	if (rt.istype(f.usr, T("/mob/living/carbon")) || rt.istype(f.usr, T("/mob/living/silicon")) || rt.istype(f.usr, T("/mob/living/simple_animal/drone"))) {
		yield* this.attack_hand(f.usr);
	} else {
		to_chat(f.usr, "<span class='warning'>This mob type can't use this verb.</span>");
	}
	return f.dot;
}, true, { verb: { name: "Toggle Open", category: "Object", src: 3, range: 1 } });

// closets.dm:350
rt.def("/obj/structure/closet/proc/Exit", function* Exit(f: Frame, AM: Value) {
	yield* this.open();
	if (AM.loc == this) {
		return 0;
	}
	return 1;
}, true);

// closets.dm:358
rt.def("/obj/structure/closet/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	let AM: Value = null;
	if (this.opened) {
		return f.dot;
	}
	if (rt.istype(this.loc, T("/atom/movable"))) {
		user.changeNext_move(100);
		user.last_special = rt.worldTime(f) + 100;
		yield* (AM = this.loc).relay_container_resist(user, this);
		return f.dot;
	}
	if (!this.welded && !this.locked) {
		yield* this.open();
		return f.dot;
	}
	user.changeNext_move(100);
	user.last_special = rt.worldTime(f) + 100;
	to_chat(user, `<span class='notice'>You lean on the back of ${this} and start pushing the door open.</span>`);
	this.visible_message(`<span class='warning'>${this} begins to shake violently!</span>`);
	if (yield* do_after(user, this.breakout_time * 60 * 10, { target: this })) {
		if (!user || user.stat != 0 || user.loc != this || this.opened || !this.locked && !this.welded) {
			return f.dot;
		}
		user.visible_message(`<span class='danger'>${user} successfully broke out of ${this}!</span>`, `<span class='notice'>You successfully break out of ${this}!</span>`);
		yield* this.bust_open();
	} else {
		if (user.loc != this) return f.dot;
		to_chat(user, `<span class='warning'>You fail to break out of ${this}!</span>`);
	}
	return f.dot;
}, true);

// closets.dm:388
rt.def("/obj/structure/closet/proc/bust_open", function* bust_open(f: Frame) {
	this.welded = 0;
	this.locked = 0;
	this.broken = 1;
	yield* this.open();
	return f.dot;
}, true);

// closets.dm:391
rt.def("/obj/structure/closet/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	yield* parent_proc();
	if (!(yield* user.canUseTopic(this, { be_close: 1 }))) {
		to_chat(user, "<span class='warning'>You can't do that right now!</span>");
		return f.dot;
	}
	if (this.opened || !this.secure) {
		return f.dot;
	} else {
		yield* this.togglelock(user);
	}
	return f.dot;
}, true);

// closets.dm:401
rt.def("/obj/structure/closet/proc/togglelock", function* togglelock(f: Frame, user: Value) {
	let $0: any, $1: any, $2: any;
	if (this.secure && !this.broken) {
		if (yield* this.allowed(user)) {
			if (rt.istype(user, T("/mob/living/carbon"))) {
				yield* this.add_fingerprint(user);
			}
			this.locked = (!this.locked ? 1 : 0);
			$0 = user;
			$1 = user;
			if (this.locked) {

				$2 = null;
			} else {
				$2 = "un";
			}
			$1 = `<span class='notice'>${$1} ${$2}locks ${this}.</span>`;
			$0.visible_message($1, `<span class='notice'>You ${this.locked ? null : "un"}lock ${this}.</span>`);
			yield* this.update_icon();
		} else {
			to_chat(user, "<span class='notice'>Access Denied</span>");
		}
	} else {
		if (!(this.secure && this.broken)) return f.dot;
		to_chat(user, fmt("<span class='warning'>＄！ is broken!</span>", [this]));
	}
	return f.dot;
}, true);

// closets.dm:415
rt.def("/obj/structure/closet/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (!(this.secure && !this.broken)) return f.dot;
	user.visible_message(`<span class='warning'>Sparks fly from ${this}!</span>`, `<span class='warning'>You scramble ${this}'s lock, breaking it open!</span>`, "<span class='italics'>You hear a faint electrical spark.</span>");
	playsound(this.loc, rt.rsc("sound/effects/sparks4.ogg"), 50, 1);
	this.broken = 1;
	this.locked = 0;
	this.update_icon();
	return f.dot;
});

// closets.dm:425
rt.def("/obj/structure/closet/proc/get_remote_view_fullscreens", function* get_remote_view_fullscreens(f: Frame, user: Value) {
	if (!(user.stat == 2 || !rt.bitAnd(user.sight, 12))) return f.dot;
	yield* user.overlay_fullscreen("remote_view", T("/obj/screen/fullscreen/impaired"), 1);
	return f.dot;
}, true);

// closets.dm:429
rt.def("/obj/structure/closet/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let O: Value = null;
	for (O of each(this, T("/obj"))) {
		yield* O.emp_act(severity);
	}
	if (this.secure && !this.broken) {
		if (prob(50 / severity)) {
			this.locked = (!this.locked ? 1 : 0);
			yield* this.update_icon();
		}
		if (prob(20 / severity) && !this.opened) {
			if (!this.locked) {
				yield* this.open();
			} else {
				this.req_access = list();
				this.req_access += pick(get_all_accesses());
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// closets.dm:445
rt.def("/obj/structure/closet/proc/contents_explosion", function* contents_explosion(f: Frame, severity: Value, target: Value) {
	let A: Value = null;
	for (A of each(this.contents, T("/atom"))) {
		yield* A.ex_act(severity, target);
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true);

// closets.dm:450
rt.def("/obj/structure/closet/proc/singularity_act", function* singularity_act(f: Frame) {
	yield* this.dump_contents();
	yield* parent_proc();
	return f.dot;
}, true);
