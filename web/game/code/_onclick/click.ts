// Based on /tg/station's code/_onclick/click.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


// click.dm:21
rt.def("/mob/proc/changeNext_move", function changeNext_move(f: Frame, num: Value) {
	this.next_move = rt.worldTime(f) + (num + this.next_move_adjust) * this.next_move_modifier;
	return f.dot;
});

// BYOND built-in.
rt.def("/atom/proc/Click", undefined, false, { args: ["location", "control", "params"] });

// click.dm:35
rt.def("/atom/proc/Click", function* Click(f: Frame, location: Value, control: Value, params: Value) {
	if (!this.initialized) return f.dot;
	yield* f.usr.ClickOn(this, params);
	return f.dot;
}, true);

// BYOND built-in.
rt.def("/atom/proc/DblClick", undefined, false, { args: ["location", "control", "params"] });

// click.dm:39
rt.def("/atom/proc/DblClick", function* DblClick(f: Frame, location: Value, control: Value, params: Value) {
	if (!this.initialized) return f.dot;
	yield* f.usr.DblClickOn(this, params);
	return f.dot;
}, true);

// BYOND built-in.
rt.def("/atom/proc/MouseWheel", undefined, false, { args: ["delta_x", "delta_y", "location", "control", "params"] });

// click.dm:43
rt.def("/atom/proc/MouseWheel", function* MouseWheel(f: Frame, delta_x: Value, delta_y: Value, location: Value, control: Value, params: Value) {
	if (!this.initialized) return f.dot;
	yield* f.usr.MouseWheelOn(this, delta_x, delta_y, params);
	return f.dot;
}, true);

// click.dm:59
rt.def("/mob/proc/ClickOn", function* ClickOn(f: Frame, A: Value, params: Value) {
	let modifiers: Value = null, M: Value = null, W: Value = null;
	if (rt.worldTime(f) <= this.next_click) {
		return f.dot;
	}
	this.next_click = rt.worldTime(f) + 1;
	if (this.client && this.client.click_intercept) {
		if (yield* g.callDyn(f, this.client.click_intercept, "InterceptClickOn", [this, params, A])) {
			return f.dot;
		}
	}
	if (rt.index((modifiers = params2list(params)), "shift") && rt.at(modifiers, "middle")) {
		yield* this.ShiftMiddleClickOn(A);
		return f.dot;
	}
	if (rt.at(modifiers, "shift") && rt.at(modifiers, "ctrl")) {
		yield* this.CtrlShiftClickOn(A);
		return f.dot;
	}
	if (rt.at(modifiers, "middle")) {
		yield* this.MiddleClickOn(A);
		return f.dot;
	}
	if (rt.at(modifiers, "shift")) {
		yield* this.ShiftClickOn(A);
		return f.dot;
	}
	if (rt.at(modifiers, "alt")) {
		yield* this.AltClickOn(A);
		return f.dot;
	}
	if (rt.at(modifiers, "ctrl")) {
		yield* this.CtrlClickOn(A);
		return f.dot;
	}
	if (yield* this.incapacitated({ ignore_restraints: 1 })) {
		return f.dot;
	}
	yield* this.face_atom(A);
	if (this.next_move > rt.worldTime(f)) {
		return f.dot;
	}
	if (!rt.at(modifiers, "catcher") && A.IsObscured()) {
		return f.dot;
	}
	if (rt.istype(this.loc, T("/obj/mecha"))) {
		return (yield* (M = this.loc).click_action(A, this, params));
	}
	if (this.restrained()) {
		this.changeNext_move(10);
		yield* this.RestrainedClickOn(A);
		return f.dot;
	}
	if (this.in_throw_mode) {
		yield* this.throw_item(A);
		return f.dot;
	}
	if ((W = this.get_active_held_item()) == A) {
		yield* W.attack_self(this);
		yield* this.update_inv_hands();
		return f.dot;
	}
	if (this.DirectAccess(A)) {
		if (W) {
			yield* W.melee_attack_chain(this, A, params);
		} else {
			if (ismob(A)) {
				this.changeNext_move(8);
			}
			yield* this.UnarmedAttack(A);
		}
		return f.dot;
	}
	if (!this.loc.AllowClick()) {
		return f.dot;
	}
	if (yield* this.CanReach(A, W)) {
		if (W) {
			yield* W.melee_attack_chain(this, A, params);
		} else {
			if (ismob(A)) {
				this.changeNext_move(8);
			}
			yield* this.UnarmedAttack(A, 1);
		}
	} else if (W) {
		yield* W.afterattack(A, this, 0, params);
	} else {
		yield* this.RangedAttack(A, params);
	}
	return f.dot;
}, true);

// click.dm:149
rt.def("/atom/proc/IsObscured", function IsObscured(f: Frame) {
	let _T: Value = null, AM: Value = null;
	if (!isturf(this.loc)) {
		return 0;
	}
	if (!(_T = get_turf_pixel(this))) {
		return 0;
	}
	for (AM of each(_T, T("/atom/movable"))) {
		if (rt.bitAnd(AM.flags, PREVENT_CLICK_UNDER) && AM.density && AM.layer > this.layer) {
			return 1;
		}
	}
	return 0;
});

// click.dm:160
rt.def("/turf/proc/IsObscured", function IsObscured(f: Frame) {
	let AM: Value = null;
	for (AM of each(this, T("/atom/movable"))) {
		if (rt.bitAnd(AM.flags, PREVENT_CLICK_UNDER) && AM.density) {
			return 1;
		}
	}
	return 0;
});

// click.dm:166
rt.def("/atom/movable/proc/CanReach", function* CanReach(f: Frame, target: Value, tool: Value, view_only: Value) {
	let outer_storage: Value = null;
	let $0: any;
	view_only ??= 0;
	if (isturf(target) || isturf(target.loc) || this.DirectAccess(target)) {
		if (this.Adjacent(target) || tool && (yield* CheckToolReach(this, target, tool.reach))) {
			return 1;
		}
	} else {
		if ((outer_storage = get_atom_on_turf(target)) == target) {
			return 0;
		}
		$0 = (outer_storage && (yield* this.CanReach(outer_storage, tool)));
		if ($0) {
			$0 = outer_storage;
			$0 = $0.CanReachStorage(target, this, view_only ? STORAGE_VIEW_DEPTH : INVENTORY_DEPTH);
		}
		if ($0) {
			return 1;
		}
	}
	return 0;
}, true);

// click.dm:184
rt.def("/obj/item/weapon/storage/proc/CanReachStorage", function CanReachStorage(f: Frame, target: Value, user: Value, depth: Value) {
	while (target && depth > 0) {
		target = target.loc;
		depth--;
		if (target == this) {
			return 1;
		}
	}
	return 0;
});

// click.dm:192
rt.def("/atom/movable/proc/DirectAccess", function DirectAccess(f: Frame, target: Value) {
	if (target == this) {
		return 1;
	}
	if (target != this.loc) return f.dot;
	return 1;
});

// click.dm:198
rt.def("/mob/proc/DirectAccess", function DirectAccess(f: Frame, target: Value) {
	if (parent_proc()) {
		return 1;
	}
	if (rt.isIn(f, target, this.contents)) {
		return 1;
	}
	return 0;
}, false);

// click.dm:205
rt.def("/mob/living/proc/DirectAccess", function DirectAccess(f: Frame, target: Value) {
	if (parent_proc()) {
		return 1;
	}
	if (!rt.isIn(f, target, this.GetAllContents())) return f.dot;
	return 1;
}, false);

// click.dm:217
rt.def("/proc/CheckToolReach", function* CheckToolReach(f: Frame, here: Value, there: Value, reach: Value) {
	let dummy: Value = null, i: Value = null, _T: Value = null;
	let $e: any;
	if (!here || !there) {
		return f.dot;
	}
	if (reach === 0) {
		return 0;
	} else if (reach === 1) {
		return 0;
	} else if (rt.inRange(reach, 2, 1e+31)) {
		(rt.modField(f, (dummy = (yield* new_(T("/obj"), rt.getStep(f, here, 0)))), "pass_flags", 1, rt.bitOr));
		dummy.invisibility = INVISIBILITY_ABSTRACT;
		rt.forRange(f, 0, 1, reach, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			_T = rt.getStep(f, dummy, rt.getDir(f, dummy, there));
			if (yield* dummy.CanReach(there)) {
				yield* qdel(dummy);
				return 1;
			}
			if (!(yield* dummy.Move(_T))) {
				yield* qdel(dummy);
				return f.dot;
			}
		}
		rt.endFor(f, 0);
		yield* qdel(dummy);
	}
	return f.dot;
}, true);

// click.dm:254
rt.def("/mob/proc/UnarmedAttack", function UnarmedAttack(f: Frame, A: Value, proximity_flag: Value) {
	if (ismob(A)) {
		this.changeNext_move(8);
	}
	return f.dot;
});

// click.dm:284
rt.def("/mob/living/carbon/proc/MiddleClickOn", function* MiddleClickOn(f: Frame, A: Value) {
	if (!this.stat && this.mind && this.mind.changeling && this.mind.changeling.chosen_sting && rt.istype(A, T("/mob/living/carbon")) && A != this) {
		this.next_click = rt.worldTime(f) + 5;
		yield* this.mind.changeling.chosen_sting.try_to_sting(this, A);
	} else {
		this.swap_hand();
	}
	return f.dot;
}, true);

// click.dm:291
rt.def("/mob/living/simple_animal/drone/proc/MiddleClickOn", function MiddleClickOn(f: Frame, A: Value) {
	this.swap_hand();
	return f.dot;
});

// click.dm:305
rt.def("/mob/proc/ShiftClickOn", function* ShiftClickOn(f: Frame, A: Value) {
	yield* A.ShiftClick(this);
	return f.dot;
}, true);

// click.dm:308
rt.def("/atom/proc/ShiftClick", function* ShiftClick(f: Frame, user: Value) {
	if (user.client && user.client.eye == user || user.client.eye == user.loc) {
		yield* user.examinate(this);
	}
	return f.dot;
}, true);

// click.dm:318
rt.def("/mob/proc/CtrlClickOn", function* CtrlClickOn(f: Frame, A: Value) {
	yield* A.CtrlClick(this);
	return f.dot;
}, true);

// click.dm:322
rt.def("/atom/proc/CtrlClick", function* CtrlClick(f: Frame, user: Value) {
	let ML: Value = null;
	if (!rt.istype((ML = user), T("/mob/living"))) return f.dot;
	yield* ML.pulled(this);
	return f.dot;
}, true);

// click.dm:327
rt.def("/mob/living/carbon/human/proc/CtrlClick", function* CtrlClick(f: Frame, user: Value) {
	let H: Value = null;
	if (rt.istype(user, T("/mob/living/carbon/human")) && this.Adjacent(user)) {
		if (rt.worldTime(f) < user.next_move) {
			return 0;
		}
		yield* (H = user).dna.species.grab(H, this, H.mind.martial_art);
		H.changeNext_move(8);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// click.dm:340
rt.def("/mob/proc/AltClickOn", function* AltClickOn(f: Frame, A: Value) {
	yield* A.AltClick(this);
	return f.dot;
}, true);

// click.dm:344
rt.def("/mob/living/carbon/proc/AltClickOn", function* AltClickOn(f: Frame, A: Value) {
	if (!this.stat && this.mind && this.mind.changeling && this.mind.changeling.chosen_sting && rt.istype(A, T("/mob/living/carbon")) && A != this) {
		this.next_click = rt.worldTime(f) + 5;
		yield* this.mind.changeling.chosen_sting.try_to_sting(this, A);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// click.dm:351
rt.def("/atom/proc/AltClick", function AltClick(f: Frame, user: Value) {
	let _T: Value = null;
	if ((_T = rt.getStep(f, this, 0)) && user.TurfAdjacent(_T)) {
		if (user.listed_turf == _T) {
			user.listed_turf = null;
		} else {
			user.listed_turf = _T;
			user.client.statpanel = _T.name;
		}
	}
	return f.dot;
});

// click.dm:361
rt.def("/mob/proc/TurfAdjacent", function TurfAdjacent(f: Frame, _T: Value) {
	return _T.Adjacent(this);
});

// click.dm:368
rt.def("/mob/proc/CtrlShiftClickOn", function* CtrlShiftClickOn(f: Frame, A: Value) {
	yield* A.CtrlShiftClick(this);
	return f.dot;
}, true);

// click.dm:372
rt.def("/mob/proc/ShiftMiddleClickOn", function* ShiftMiddleClickOn(f: Frame, A: Value) {
	yield* this.pointed(A);
	return f.dot;
}, true);

// click.dm:388
rt.def("/mob/living/proc/LaserEyes", function* LaserEyes(f: Frame, A: Value) {
	let LE: Value = null;
	this.changeNext_move(4);
	let _T: Value = rt.getStep(f, this, 0);
	let U: Value = rt.getStep(f, A, 0);
	(LE = (yield* new_(T("/obj/item/projectile/beam"), this.loc))).icon = rt.rsc("icons/effects/genetics.dmi");
	LE.icon_state = "eyelasers";
	playsound(f.usr.loc, rt.rsc("sound/weapons/taser2.ogg"), 75, 1);
	LE.firer = this;
	LE.def_zone = this.get_organ_target();
	LE.original = A;
	LE.current = _T;
	LE.yo = U.y - _T.y;
	LE.xo = U.x - _T.x;
	yield* LE.fire();
	return f.dot;
}, true);

// click.dm:407
rt.def("/mob/proc/face_atom", function* face_atom(f: Frame, A: Value) {
	if (this.buckled || this.stat != 0 || !A || !this.x || !this.y || !A.x || !A.y) {
		return f.dot;
	}
	let dx: Value = A.x - this.x;
	let dy: Value = A.y - this.y;
	if (!dx && !dy) {
		if (A.pixel_y > 16) {
			yield* this.setDir(1);
		} else if (A.pixel_y < -16) {
			yield* this.setDir(2);
		} else if (A.pixel_x > 16) {
			yield* this.setDir(4);
		} else if (A.pixel_x < -16) {
			yield* this.setDir(8);
		}
		return f.dot;
	}
	if (rt.op(f, "Abs", [], [dx]) < rt.op(f, "Abs", [], [dy])) {
		if (dy > 0) {
			yield* this.setDir(1);
		} else {
			yield* this.setDir(2);
		}
	} else if (dx > 0) {
		yield* this.setDir(4);
	} else {
		yield* this.setDir(8);
	}
	return f.dot;
}, true);

rt.type(11000, "/obj/screen/click_catcher", "/obj/screen", {
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "click_catcher",
	plane: -99,
	mouse_opacity: 2,
	screen_loc: "CENTER",
});

// click.dm:441
rt.def("/obj/screen/click_catcher/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.transform = matrix(200, 0, 0, 0, 200, 0);
	return f.dot;
}, true);

// click.dm:445
rt.def("/obj/screen/click_catcher/proc/Click", function* Click(f: Frame, location: Value, control: Value, params: Value) {
	let modifiers: Value = null, C: Value = null, _T: Value = null;
	if (rt.index((modifiers = params2list(params)), "middle") && rt.istype(f.usr, T("/mob/living/carbon"))) {
		(C = f.usr).swap_hand();
	} else {
		_T = params2turf(rt.at(modifiers, "screen-loc"), rt.getStep(f, f.usr, 0), f.usr.client);
		params += "&catcher=1";
		if (_T) {
			yield* _T.Click(location, control, params);
		}
	}
	f.dot = 1;
	return f.dot;
}, true);

// click.dm:463
rt.def("/mob/dead/observer/proc/MouseWheelOn", function* MouseWheelOn(f: Frame, A: Value, delta_x: Value, delta_y: Value, params: Value) {
	let modifier: Value = null;
	if (!rt.index((modifier = params2list(params)), "shift")) return f.dot;
	let view: Value = 0;
	if (delta_y > 0) {
		view = -1;
	} else {
		view = 1;
	}
	yield* this.add_view_range(view);
	return f.dot;
}, true);
