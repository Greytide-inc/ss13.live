// Based on /tg/station's code/game/objects/structures/tables_racks.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(12187, "/obj/structure/table", "/obj/structure", {
	framestack: rt.typePath("/obj/item/stack/rods"),
	buildstack: rt.typePath("/obj/item/stack/sheet/metal"),
	busy: 0,
	buildstackamount: 1,
	framestackamount: 2,
	deconstruction_ready: 1,
	frame: rt.typePath("/obj/structure/table_frame"),
	anchored: 1,
	pass_flags: 32,
	smooth: 1,
	canSmoothWith: null,
	name: "table",
	desc: "A square piece of metal standing on four metal legs. It can not move.",
	icon: rt.rsc("icons/obj/smooth_structures/table.dmi"),
	icon_state: "table",
	density: 1,
	layer: 2.8,
	climbable: 1,
	obj_integrity: 100,
	max_integrity: 100,
	integrity_failure: 30,
});

// tables_racks.dm:36
rt.def("/obj/structure/table/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/table"), T("/obj/structure/table/reinforced"));
	return f.dot;
});

// tables_racks.dm:39
rt.def("/obj/structure/table/proc/New", function* New(f: Frame) {
	let _T: Value = null;
	yield* parent_proc();
	for (_T of each(this.loc, T("/obj/structure/table"))) {
		if (_T != this) {
			yield* qdel(_T);
		}
	}
	return f.dot;
}, true);

// tables_racks.dm:46
rt.def("/obj/structure/table/proc/update_icon", function update_icon(f: Frame) {
	if (!this.smooth) return f.dot;
	queue_smooth(this);
	queue_smooth_neighbors(this);
	return f.dot;
});

// tables_racks.dm:50
rt.def("/obj/structure/table/proc/narsie_act", function* narsie_act(f: Frame) {
	yield* new_(T("/obj/structure/table/wood"), this.loc);
	return f.dot;
}, true);

// tables_racks.dm:53
rt.def("/obj/structure/table/proc/ratvar_act", function* ratvar_act(f: Frame) {
	yield* new_(T("/obj/structure/table/reinforced/brass"), this.loc);
	return f.dot;
}, true);

// tables_racks.dm:57
rt.def("/obj/structure/table/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	yield* this.attack_hand(user);
	return f.dot;
}, true);

// tables_racks.dm:60
rt.def("/obj/structure/table/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let pushed_mob: Value = null;
	if (user.a_intent == "grab" && user.pulling && rt.istype(user.pulling, T("/mob/living"))) {
		if ((pushed_mob = user.pulling).buckled) {
			to_chat(user, `<span class='warning'>${pushed_mob} is buckled to ${pushed_mob.buckled}!</span>`);
			return f.dot;
		}
		if (user.grab_state < 1) {
			to_chat(user, "<span class='warning'>You need a better grip to do that!</span>");
			return f.dot;
		}
		yield* this.tablepush(user, pushed_mob);
		yield* user.stop_pulling();
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// tables_racks.dm:74
rt.def("/obj/structure/table/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	height ??= 0;
	if (height == 0) {
		return 1;
	}
	if (rt.istype(mover, T("/atom/movable")) && mover.checkpass(1)) {
		return 1;
	}
	if (mover.throwing) {
		return 1;
	}
	if (rt.locateIn(f, T("/obj/structure/table"), rt.getStep(f, mover, 0))) {
		return 1;
	} else {
		return (!this.density ? 1 : 0);
	}
});

// tables_racks.dm:86
rt.def("/obj/structure/table/proc/CanAStarPass", function CanAStarPass(f: Frame, ID: Value, dir: Value, caller: Value) {
	f.dot = (!this.density ? 1 : 0);
	if (!rt.istype(caller, T("/atom/movable"))) return f.dot;
	let mover: Value = caller;
	f.dot = (f.dot || mover.checkpass(1));
	return f.dot;
});

// tables_racks.dm:92
rt.def("/obj/structure/table/proc/tablepush", function* tablepush(f: Frame, user: Value, pushed_mob: Value) {
	yield* pushed_mob.forceMove(this.loc);
	yield* pushed_mob.Knockdown(40);
	pushed_mob.visible_message(`<span class='danger'>${user} pushes ${pushed_mob} onto ${this}.</span>`, `<span class='userdanger'>${user} pushes ${pushed_mob} onto ${this}.</span>`);
	add_logs(user, pushed_mob, "pushed");
	return f.dot;
}, true);

// tables_racks.dm:100
rt.def("/obj/structure/table/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let _T: Value = null, oldContents: Value = null, C: Value = null, click_params: Value = null;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (rt.istype(I, T("/obj/item/weapon/screwdriver")) && this.deconstruction_ready) {
			to_chat(user, `<span class='notice'>You start disassembling ${this}...</span>`);
			playsound(this.loc, I.usesound, 50, 1);
			if (yield* do_after(user, 20 * I.toolspeed, { target: this })) {
				yield* this.deconstruct(1);
			}
			return f.dot;
		}
		if (rt.istype(I, T("/obj/item/weapon/wrench")) && this.deconstruction_ready) {
			to_chat(user, `<span class='notice'>You start deconstructing ${this}...</span>`);
			playsound(this.loc, I.usesound, 50, 1);
			if (yield* do_after(user, 40 * I.toolspeed, { target: this })) {
				playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
				yield* this.deconstruct(1, 1);
			}
			return f.dot;
		}
	}
	if (rt.istype(I, T("/obj/item/weapon/storage/bag/tray"))) {
		if (rt.len(f, (_T = I).contents) > 0) {
			oldContents = (yield* _T.contents.Copy());
			yield* _T.quick_empty();
			for (C of each(oldContents, T("/obj/item"))) {
				C.loc = this.loc;
			}
			user.visible_message(`${user} empties ${I} on ${this}.`);
			return f.dot;
		}
	}
	if (user.a_intent != "harm" && !rt.bitAnd(I.flags, ABSTRACT)) {
		if (yield* user.drop_item()) {
			yield* I.Move(this.loc);
			yield* I.do_drop_animation(user); // tg #90895's slide from the mob, for placing too (it waits a tick for the pixel_x/y below)
			if (!(click_params = params2list(params)) || !rt.at(click_params, "icon-x") || !rt.at(click_params, "icon-y")) {
				return f.dot;
			}
			I.pixel_x = max(-(rt.world().icon_size / 2), min(text2num(rt.at(click_params, "icon-x")) - 16, rt.world().icon_size / 2));
			I.pixel_y = max(-(rt.world().icon_size / 2), min(text2num(rt.at(click_params, "icon-y")) - 16, rt.world().icon_size / 2));
			return 1;
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// tables_racks.dm:145
rt.def("/obj/structure/table/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value, wrench_disassembly: Value) {
	let _T: Value = null;
	disassembled ??= 1;
	wrench_disassembly ??= 0;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* new_(this.buildstack, (_T = rt.getStep(f, this, 0)), this.buildstackamount);
		if (!wrench_disassembly) {
			yield* new_(this.frame, _T);
		} else {
			yield* new_(this.framestack, _T, this.framestackamount);
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12196, "/obj/structure/table/glass", "/obj/structure/table", {
	debris: null,
	buildstack: rt.typePath("/obj/item/stack/sheet/glass"),
	canSmoothWith: null,
	name: "glass table",
	desc: "What did I say about leaning on the glass tables? Now you need surgery.",
	icon: rt.rsc("icons/obj/smooth_structures/glass_table.dmi"),
	icon_state: "glass_table",
	obj_integrity: 70,
	max_integrity: 70,
	resistance_flags: 32,
	armor: null,
});

// tables_racks.dm:169
rt.def("/obj/structure/table/glass/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = null;

	this.debris = list();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 80, "acid", 100]);
	return f.dot;
});

// tables_racks.dm:172
rt.def("/obj/structure/table/glass/proc/New", function* New(f: Frame) {
	f.dot = (yield* parent_proc());
	this.debris += (yield* new_(this.frame));
	this.debris += (yield* new_(T("/obj/item/weapon/shard")));
	return f.dot;
}, true);

// tables_racks.dm:177
rt.def("/obj/structure/table/glass/proc/Destroy", function* Destroy(f: Frame) {
	let i: Value = null;
	for (i of each(this.debris)) {
		yield* qdel(i);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// tables_racks.dm:182
rt.def("/obj/structure/table/glass/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	f.dot = (yield* parent_proc());
	if (rt.bitAnd(this.flags, NODECONSTRUCT)) {
		return f.dot;
	}
	if (!rt.istype(AM, T("/mob/living"))) {
		return f.dot;
	}
	if (AM.throwing) {
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/structure/table/glass/proc/throw_check"), AM)), 5);
	} else {
		yield* this.check_break(AM);
	}
	return f.dot;
}, true);

// tables_racks.dm:194
rt.def("/obj/structure/table/glass/proc/throw_check", function* throw_check(f: Frame, M: Value) {
	if (M.loc != rt.getStep(f, this, 0)) return f.dot;
	yield* this.check_break(M);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }] });

// tables_racks.dm:198
rt.def("/obj/structure/table/glass/proc/check_break", function* check_break(f: Frame, M: Value) {
	if (!(M.has_gravity() && M.mob_size > MOB_SIZE_SMALL && !rt.bitAnd(M.movement_type, 2))) return f.dot;
	yield* this.table_shatter(M);
	return f.dot;
}, true);

// tables_racks.dm:202
rt.def("/obj/structure/table/glass/proc/table_shatter", function* table_shatter(f: Frame, L: Value) {
	let _T: Value = null, I: Value = null, AM: Value = null;
	this.visible_message(`<span class='warning'>${this} breaks!</span>`, "<span class='danger'>You hear breaking glass.</span>");
	playsound((_T = rt.getStep(f, this, 0)), "shatter", 50, 1);
	for (I of each(this.debris)) {
		yield* (AM = I).forceMove(_T);
		this.debris -= AM;
		if (rt.istype(AM, T("/obj/item/weapon/shard"))) {
			yield* AM.throw_impact(L);
		}
	}
	yield* L.Knockdown(100);
	yield* qdel(this);
	return f.dot;
}, true);

// tables_racks.dm:216
rt.def("/obj/structure/table/glass/proc/deconstruct", function* deconstruct(f: Frame) {
	let _T: Value = null, X: Value = null, AM: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (f.args[0]) {
			yield* parent_proc();
			return f.dot;
		} else {
			playsound((_T = rt.getStep(f, this, 0)), "shatter", 50, 1);
			for (X of each(this.debris)) {
				yield* (AM = X).forceMove(_T);
				this.debris -= AM;
			}
		}
	}
	yield* qdel(this);
	return f.dot;
}, true, { args: ["disassembled", "wrench_disassembly"] });

// tables_racks.dm:230
rt.def("/obj/structure/table/glass/proc/narsie_act", function narsie_act(f: Frame) {
	let S: Value = null;
	this.color = "#7D1919";
	for (S of each(this.debris, T("/obj/item/weapon/shard"))) {
		S.color = "#7D1919";
	}
	return f.dot;
});

rt.type(12197, "/obj/structure/table/wood", "/obj/structure/table", {
	framestack: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
	buildstack: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
	name: "wooden table",
	desc: "Do not apply fire to this. Rumour says it burns easily.",
	icon: rt.rsc("icons/obj/smooth_structures/wood_table.dmi"),
	icon_state: "wood_table",
	frame: rt.typePath("/obj/structure/table_frame/wood"),
	resistance_flags: 4,
	obj_integrity: 70,
	max_integrity: 70,
	canSmoothWith: null,
});

// tables_racks.dm:249
rt.def("/obj/structure/table/wood/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/table/wood"), T("/obj/structure/table/wood/poker"), T("/obj/structure/table/wood/bar"));
	return f.dot;
});

rt.type(12198, "/obj/structure/table/wood/poker", "/obj/structure/table/wood", {
	buildstack: rt.typePath("/obj/item/stack/tile/carpet"),
	name: "gambling table",
	desc: "A seedy table for seedy dealings in seedy places.",
	icon: rt.rsc("icons/obj/smooth_structures/poker_table.dmi"),
	icon_state: "poker_table",
});

// tables_racks.dm:264
rt.def("/obj/structure/table/wood/poker/proc/narsie_act", function* narsie_act(f: Frame) {
	yield* new_(T("/obj/structure/table/wood"), this.loc);
	return f.dot;
}, true);

rt.type(12199, "/obj/structure/table/wood/fancy", "/obj/structure/table/wood", {
	framestack: rt.typePath("/obj/item/stack/rods"),
	buildstack: rt.typePath("/obj/item/stack/tile/carpet"),
	name: "fancy table",
	desc: "A standard metal table frame covered with an amazingly fancy, patterned cloth.",
	icon: rt.rsc("icons/obj/structures.dmi"),
	icon_state: "fancy_table",
	frame: rt.typePath("/obj/structure/table_frame"),
	canSmoothWith: null,
});

// tables_racks.dm:274
rt.def("/obj/structure/table/wood/fancy/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/table/wood/fancy"), T("/obj/structure/table/wood/fancy/black"));
	return f.dot;
});

// tables_racks.dm:277
rt.def("/obj/structure/table/wood/fancy/proc/New", function* New(f: Frame) {
	this.icon = rt.rsc("icons/obj/smooth_structures/fancy_table.dmi");
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(12200, "/obj/structure/table/wood/fancy/black", "/obj/structure/table/wood/fancy", {
	buildstack: rt.typePath("/obj/item/stack/tile/carpet/black"),
	icon_state: "fancy_table_black",
});

// tables_racks.dm:285
rt.def("/obj/structure/table/wood/fancy/black/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.icon = rt.rsc("icons/obj/smooth_structures/fancy_table_black.dmi");
	return f.dot;
}, true);

rt.type(12188, "/obj/structure/table/reinforced", "/obj/structure/table", {
	canSmoothWith: null,
	name: "reinforced table",
	desc: "A reinforced version of the four legged table, much harder to simply deconstruct.",
	icon: rt.rsc("icons/obj/smooth_structures/reinforced_table.dmi"),
	icon_state: "r_table",
	deconstruction_ready: 0,
	buildstack: rt.typePath("/obj/item/stack/sheet/plasteel"),
	obj_integrity: 200,
	max_integrity: 200,
	integrity_failure: 50,
	armor: null,
});

// tables_racks.dm:298
rt.def("/obj/structure/table/reinforced/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/table/reinforced"), T("/obj/structure/table"));
	this.armor = rt.alist(f, ["melee", 10, "bullet", 30, "laser", 30, "energy", 100, "bomb", 20, "bio", 0, "rad", 0, "fire", 80, "acid", 70]);
	return f.dot;
});

// tables_racks.dm:305
rt.def("/obj/structure/table/reinforced/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let WT: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/weldingtool"))) {
		if (yield* (WT = W).remove_fuel(0, user)) {
			playsound(this.loc, W.usesound, 50, 1);
			if (this.deconstruction_ready) {
				to_chat(user, "<span class='notice'>You start strengthening the reinforced table...</span>");
				if (yield* do_after(user, 50 * W.toolspeed, { target: this })) {
					if (!this || !WT.isOn()) {
						return f.dot;
					}
					to_chat(user, "<span class='notice'>You strengthen the table.</span>");
					this.deconstruction_ready = 0;
				}
			} else {
				to_chat(user, "<span class='notice'>You start weakening the reinforced table...</span>");
				if (yield* do_after(user, 50 * W.toolspeed, { target: this })) {
					if (!this || !WT.isOn()) {
						return f.dot;
					}
					to_chat(user, "<span class='notice'>You weaken the table.</span>");
					this.deconstruction_ready = 1;
				}
			}
		}
	} else {
		f.dot = (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(12189, "/obj/structure/table/reinforced/brass", "/obj/structure/table/reinforced", {
	canSmoothWith: null,
	name: "brass table",
	desc: "A solid, slightly beveled brass table.",
	icon: rt.rsc("icons/obj/smooth_structures/brass_table.dmi"),
	icon_state: "brass_table",
	resistance_flags: 34,
	framestack: rt.typePath("/obj/item/stack/tile/brass"),
	buildstack: rt.typePath("/obj/item/stack/tile/brass"),
	framestackamount: 1,
	buildstackamount: 1,
	frame: rt.typePath("/obj/structure/table_frame/brass"),
});

// tables_racks.dm:335
rt.def("/obj/structure/table/reinforced/brass/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/table/reinforced/brass"));
	return f.dot;
});

// tables_racks.dm:338
rt.def("/obj/structure/table/reinforced/brass/proc/New", function* New(f: Frame) {
	change_construction_value(2);
	yield* parent_proc();
	return f.dot;
}, true);

// tables_racks.dm:342
rt.def("/obj/structure/table/reinforced/brass/proc/Destroy", function* Destroy(f: Frame) {
	change_construction_value(-2);
	return (yield* parent_proc());
}, true);

// tables_racks.dm:347
rt.def("/obj/structure/table/reinforced/brass/proc/narsie_act", function* narsie_act(f: Frame) {
	yield* this.take_damage(rand(15, 45), "brute");
	if (!this) return f.dot;
	let previouscolor: Value = this.color;
	this.color = "#960000";
	rt.op(f, "Animate", [2, 6], [null, this, "color", previouscolor, "time", 8]);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/atom/proc/update_atom_colour"))), 8);
	return f.dot;
}, true);

// tables_racks.dm:355
rt.def("/obj/structure/table/reinforced/brass/proc/ratvar_act", function ratvar_act(f: Frame) {
	this.obj_integrity = this.max_integrity;
	return f.dot;
});

rt.type(12194, "/obj/structure/table/optable", "/obj/structure/table", {
	patient: null,
	computer: null,
	smooth: 0,
	can_buckle: 1,
	buckle_lying: 1,
	buckle_requires_restraints: 1,
	name: "operating table",
	desc: "Used for advanced medical procedures.",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	icon_state: "optable",
	buildstack: rt.typePath("/obj/item/stack/sheet/mineral/silver"),
});

// tables_racks.dm:375
rt.def("/obj/structure/table/optable/proc/New", function* New(f: Frame) {
	let dir: Value = null;
	yield* parent_proc();
	for (dir of each(GLOB.cardinal)) {
		this.computer = rt.locateIn(f, T("/obj/machinery/computer/operating"), rt.getStep(f, this, dir));
		if (this.computer) {
			this.computer.table = this;
			break;
		}
	}
	return f.dot;
}, true);

// tables_racks.dm:383
rt.def("/obj/structure/table/optable/proc/tablepush", function* tablepush(f: Frame, user: Value, pushed_mob: Value) {
	yield* pushed_mob.forceMove(this.loc);
	pushed_mob.resting = 1;
	yield* pushed_mob.update_canmove();
	this.visible_message(`<span class='notice'>${user} has laid ${pushed_mob} on ${this}.</span>`);
	this.check_patient();
	return f.dot;
}, true);

// tables_racks.dm:390
rt.def("/obj/structure/table/optable/proc/check_patient", function check_patient(f: Frame) {
	let M: Value = null;
	if (M = rt.locateIn(f, T("/mob/living/carbon/human"), this.loc)) {
		if (M.resting) {
			this.patient = M;
			return 1;
		}
	} else {
		this.patient = null;
		return 0;
	}
	return f.dot;
});

rt.type(12876, "/obj/structure/rack", "/obj/structure", {
	anchored: 1,
	pass_flags: 32,
	name: "rack",
	desc: "Different from the Middle Ages version.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "rack",
	density: 1,
	obj_integrity: 20,
	max_integrity: 20,
});

// tables_racks.dm:416
rt.def("/obj/structure/rack/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	height ??= 0;
	if (height == 0) {
		return 1;
	}
	if (this.density == 0) {
		return 1;
	}
	if (rt.istype(mover, T("/atom/movable")) && mover.checkpass(1)) {
		return 1;
	} else {
		return 0;
	}
});

// tables_racks.dm:425
rt.def("/obj/structure/rack/proc/CanAStarPass", function CanAStarPass(f: Frame, ID: Value, dir: Value, caller: Value) {
	f.dot = (!this.density ? 1 : 0);
	if (!rt.istype(caller, T("/atom/movable"))) return f.dot;
	let mover: Value = caller;
	f.dot = (f.dot || mover.checkpass(1));
	return f.dot;
});

// tables_racks.dm:431
rt.def("/obj/structure/rack/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, O: Value, user: Value) {
	if (!rt.istype(O, T("/obj/item/weapon")) || user.get_active_held_item() != O) {
		return f.dot;
	}
	if (!(yield* user.drop_item())) {
		return f.dot;
	}
	if (O.loc == this.loc) return f.dot;
	yield* step(O, rt.getDir(f, O, this));
	return f.dot;
}, true);

// tables_racks.dm:440
rt.def("/obj/structure/rack/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/wrench")) && !rt.bitAnd(this.flags, NODECONSTRUCT)) {
		playsound(this.loc, W.usesound, 50, 1);
		yield* this.deconstruct(1);
		return f.dot;
	}
	if (user.a_intent == "harm") {
		return (yield* parent_proc());
	}
	if (!(yield* user.drop_item())) return f.dot;
	yield* W.Move(this.loc);
	yield* W.do_drop_animation(user); // the slide from the mob, as tables
	return 1;
}, true);

// tables_racks.dm:451
rt.def("/obj/structure/rack/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	yield* this.attack_hand(user);
	return f.dot;
}, true);

// tables_racks.dm:454
rt.def("/obj/structure/rack/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (user.IsKnockdown() || user.resting || user.lying || user.get_num_legs() < 2) {
		return f.dot;
	}
	user.changeNext_move(8);
	yield* user.do_attack_animation(this, "kick");
	user.visible_message(`<span class='danger'>${user} kicks ${this}.</span>`, null, null, 3);
	yield* this.take_damage(rand(4, 8), "brute", "melee", 1);
	return f.dot;
}, true);

// tables_racks.dm:463
rt.def("/obj/structure/rack/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		if (damage_amount) {
			playsound(this.loc, rt.rsc("sound/items/dodgeball.ogg"), 80, 1);
		} else {
			playsound(this.loc, rt.rsc("sound/weapons/tap.ogg"), 50, 1);
		}
	} else if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 40, 1);
	}
	return f.dot;
});

// tables_racks.dm:477
rt.def("/obj/structure/rack/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let newparts: Value = null;
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		this.density = 0;
		this.transfer_fingerprints_to((newparts = (yield* new_(T("/obj/item/weapon/rack_parts"), this.loc))));
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(7478, "/obj/item/weapon/rack_parts", "/obj/item/weapon", {
	building: 0,
	flags: 64,
	name: "rack parts",
	desc: "Parts of a rack.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "rack_parts",
	materials: null,
});

// tables_racks.dm:494
rt.def("/obj/item/weapon/rack_parts/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 2000]);
	return f.dot;
});

// tables_racks.dm:498
rt.def("/obj/item/weapon/rack_parts/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		yield* new_(T("/obj/item/stack/sheet/metal"), user.loc);
		yield* qdel(this);
	} else {
		f.dot = (yield* parent_proc());
	}
	return f.dot;
}, true);

// tables_racks.dm:508
rt.def("/obj/item/weapon/rack_parts/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let R: Value = null;
	if (this.building) {
		return f.dot;
	}
	this.building = 1;
	to_chat(user, "<span class='notice'>You start constructing a rack...</span>");
	if (yield* do_after(user, 50, { target: this, progress: 1 })) {
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		R = (yield* new_(T("/obj/structure/rack"), user.loc));
		user.visible_message(fmt("<span class='notice'>＀ assembles ＇！.</span>", [user, R]), fmt("<span class='notice'>You assemble ＇！.</span>", [R]));
		yield* R.add_fingerprint(user);
		yield* qdel(this);
	}
	this.building = 0;
	return f.dot;
}, true);
