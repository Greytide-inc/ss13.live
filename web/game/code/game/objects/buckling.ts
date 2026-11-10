// Based on /tg/station's code/game/objects/buckling.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


// buckling.dm:13
rt.def("/atom/movable/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let unbuckled: Value = null;
	f.dot = (yield* parent_proc());
	if (!(this.can_buckle && this.has_buckled_mobs())) return f.dot;
	if (rt.len(f, this.buckled_mobs) > 1) {
		if (yield* this.user_unbuckle_mob((unbuckled = (yield* g.op(f, "Prompt", [9], [null, "Unbuckle Who?", "Who do you wish to unbuckle?", user, this.buckled_mobs]))), user)) {
			return 1;
		}
	} else {
		if (!(yield* this.user_unbuckle_mob(rt.index(this.buckled_mobs, 1), user))) return f.dot;
		return 1;
	}
	return f.dot;
}, true);

// buckling.dm:24
rt.def("/atom/movable/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, M: Value, user: Value) {
	f.dot = (yield* parent_proc());
	if (!(this.can_buckle && rt.istype(M, T("/mob/living")))) return f.dot;
	if (!(yield* this.user_buckle_mob(M, user))) return f.dot;
	return 1;
}, true);

// buckling.dm:30
rt.def("/atom/movable/proc/has_buckled_mobs", function has_buckled_mobs(f: Frame) {
	if (!this.buckled_mobs) {
		return 0;
	}
	if (!rt.len(f, this.buckled_mobs)) return f.dot;
	return 1;
});

// buckling.dm:37
rt.def("/atom/movable/proc/buckle_mob", function* buckle_mob(f: Frame, M: Value, force: Value, check_loc: Value) {
	force ??= 0;
	check_loc ??= 1;
	if (!this.buckled_mobs) {
		this.buckled_mobs = list();
	}
	if (!rt.istype(M, T("/mob/living"))) {
		return 0;
	}
	if (check_loc && M.loc != this.loc) {
		return 0;
	}
	if (!this.can_buckle && !force || M.buckled || rt.len(f, this.buckled_mobs) >= this.max_buckled_mobs || this.buckle_requires_restraints && !M.restrained() || M == this) {
		return 0;
	}
	if (!M.can_buckle() && !force) {
		if (M == f.usr) {
			to_chat(M, `<span class='warning'>You are unable to buckle yourself to the ${this}!</span>`);
		} else {
			to_chat(f.usr, `<span class='warning'>You are unable to buckle ${M} to the ${this}!</span>`);
		}
		return 0;
	}
	if (M.pulledby && this.buckle_prevents_pull) {
		yield* M.pulledby.stop_pulling();
	}
	if (!check_loc && M.loc != this.loc) {
		yield* M.forceMove(this.loc);
	}
	M.buckled = this;
	yield* M.setDir(this.dir);
	(rt.modSrcVar(f, "buckled_mobs", M, rt.bitOr));
	yield* M.update_canmove();
	yield* M.throw_alert("buckled", T("/obj/screen/alert/restrained/buckled"), { new_master: this });
	yield* this.post_buckle_mob(M);
	return 1;
}, true);

// buckling.dm:71
rt.def("/obj/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	if (!rt.bitAnd(this.resistance_flags, 8)) return f.dot;
	yield* f.args[0].adjust_fire_stacks(1);
	yield* f.args[0].IgniteMob();
	return f.dot;
}, true, { args: ["M", "force", "check_loc"] });

// buckling.dm:78
rt.def("/atom/movable/proc/unbuckle_mob", function* unbuckle_mob(f: Frame, buckled_mob: Value, force: Value) {
	force ??= 0;
	if (!(rt.istype(buckled_mob, T("/mob/living")) && buckled_mob.buckled == this && (buckled_mob.can_unbuckle() || force))) return f.dot;
	f.dot = buckled_mob;
	buckled_mob.buckled = null;
	buckled_mob.anchored = rt.initial(f, buckled_mob, "anchored");
	yield* buckled_mob.update_canmove();
	yield* buckled_mob.clear_alert("buckled");
	this.buckled_mobs -= buckled_mob;
	yield* this.post_buckle_mob(f.dot);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }, {  }] });

// buckling.dm:89
rt.def("/atom/movable/proc/unbuckle_all_mobs", function* unbuckle_all_mobs(f: Frame, force: Value) {
	let m: Value = null;
	force ??= 0;
	if (!this.has_buckled_mobs()) {
		return f.dot;
	}
	for (m of each(this.buckled_mobs)) {
		yield* this.unbuckle_mob(m, force);
	}
	return f.dot;
}, true);

// buckling.dm:102
rt.def("/atom/movable/proc/user_buckle_mob", function* user_buckle_mob(f: Frame, M: Value, user: Value, check_loc: Value) {
	check_loc ??= 1;
	if (!(get_dist(user, this) <= 1) || user.stat || user.restrained()) {
		return 0;
	}
	yield* this.add_fingerprint(user);
	f.dot = (yield* this.buckle_mob(M, { check_loc: check_loc }));
	if (!f.dot) return f.dot;
	if (M == user) {
		M.visible_message(`<span class='notice'>${M} buckles ${M.p_them()}self to ${this}.</span>`, `<span class='notice'>You buckle yourself to ${this}.</span>`, "<span class='italics'>You hear metal clanking.</span>");
	} else {
		M.visible_message(`<span class='warning'>${user} buckles ${M} to ${this}!</span>`, `<span class='warning'>${user} buckles you to ${this}!</span>`, "<span class='italics'>You hear metal clanking.</span>");
	}
	return f.dot;
}, true);

// buckling.dm:120
rt.def("/atom/movable/proc/user_unbuckle_mob", function* user_unbuckle_mob(f: Frame, buckled_mob: Value, user: Value) {
	let M: Value = null;
	if (M = (yield* this.unbuckle_mob(buckled_mob))) {
		if (M != user) {
			M.visible_message(`<span class='notice'>${user} unbuckles ${M} from ${this}.</span>`, `<span class='notice'>${user} unbuckles you from ${this}.</span>`, "<span class='italics'>You hear metal clanking.</span>");
		} else {
			M.visible_message(`<span class='notice'>${M} unbuckles ${M.p_them()}self from ${this}.</span>`, `<span class='notice'>You unbuckle yourself from ${this}.</span>`, "<span class='italics'>You hear metal clanking.</span>");
		}
		yield* this.add_fingerprint(user);
	}
	return M;
}, true);
