// Based on /tg/station's code/modules/spells/spell_types/area_teleport.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


rt.type(11281, "/obj/effect/proc_holder/spell/targeted/area_teleport", "/obj/effect/proc_holder/spell/targeted", {
	randomise_selection: 0,
	invocation_area: 1,
	sound1: rt.rsc("sound/weapons/zapbang.ogg"),
	sound2: rt.rsc("sound/weapons/zapbang.ogg"),
	name: "Area teleport",
	desc: "This spell teleports you to a type of area of your selection.",
	nonabstract_req: 1,
});

// area_teleport.dm:12
rt.def("/obj/effect/proc_holder/spell/targeted/area_teleport/proc/perform", function* perform(f: Frame, targets: Value, recharge: Value, user: Value) {
	let thearea: Value = null;
	recharge ??= 1;
	user ??= f.usr;
	if (!(thearea = (yield* this.before_cast(targets))) || !(yield* this.cast_check(1))) {
		yield* this.revert_cast();
		return f.dot;
	}
	yield* this.invocation(thearea, user);
	if (this.charge_type == "recharge" && recharge) {
		yield* ImmediateInvokeAsync(this, P("/obj/effect/proc_holder/spell/proc/start_recharge"));
	}
	yield* this.cast(targets, thearea, user);
	yield* this.after_cast(targets);
	return f.dot;
}, true);

// area_teleport.dm:25
rt.def("/obj/effect/proc_holder/spell/targeted/area_teleport/proc/before_cast", function* before_cast(f: Frame, targets: Value) {
	let A: Value = null, thearea: Value = null;
	if (!this.randomise_selection) {
		A = (yield* g.op(f, "Prompt", [1], [null, A, "Teleport", "Area to teleport to", GLOB.teleportlocs]));
	} else {
		A = pick(GLOB.teleportlocs);
	}
	if (!A) {
		return f.dot;
	}
	return (thearea = rt.index(GLOB.teleportlocs, A));
}, true);

// area_teleport.dm:36
rt.def("/obj/effect/proc_holder/spell/targeted/area_teleport/proc/cast", function* cast(f: Frame, targets: Value, thearea: Value, user: Value) {
	let target: Value = null, L: Value = null, _T: Value = null, clear: Value = null, O: Value = null, tempL: Value = null, attempt: Value = null, success: Value = null;
	user ??= f.usr;
	playsound(rt.getStep(f, user, 0), this.sound1, 50, 1);
	for (target of each(targets, T("/mob/living"))) {
		L = list();
		_T = null;
		for (_T of each(get_area_turfs(thearea.type), T("/turf"))) {
			if (!_T.density) {
				clear = 1;
				O = null;
				for (O of each(_T, T("/obj"))) {
					if (O.density) {
						clear = 0;
						break;
					}
				}
				if (clear) {
					L += _T;
				}
			}
		}
		if (!rt.len(f, L)) {
			to_chat(f.usr, "The spell matrix was unable to locate a suitable teleport destination for an unknown reason. Sorry.");
			return f.dot;
		}
		if (target && target.buckled) {
			yield* target.buckled.unbuckle_mob(target, { force: 1 });
		}
		tempL = L;
		attempt = null;
		success = 0;
		while (rt.len(f, tempL)) {
			attempt = pick(tempL);
			yield* target.Move(attempt);
			if (rt.getStep(f, target, 0) == attempt) {
				success = 1;
				break;
			}
			yield* tempL.Remove(attempt);
		}
		if (!success) {
			target.loc = pick(L);
			playsound(rt.getStep(f, user, 0), this.sound2, 50, 1);
		}
	}
	return f.dot;
}, true);

// area_teleport.dm:75
rt.def("/obj/effect/proc_holder/spell/targeted/area_teleport/proc/invocation", function* invocation(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = null;
	}
	if (f.args[1] === null) {
		f.args[1] = f.usr;
	}
	if (!this.invocation_area || !f.args[0]) {
		yield* parent_proc();
	} else if (this.invocation_type === "shout") {
		yield* f.args[1].say(`${this.invocation} ${uppertext(f.args[0].name)}`);
		if (f.args[1].gender == "male") {
			playsound(f.args[1].loc, pick(rt.rsc("sound/misc/null.ogg"), rt.rsc("sound/misc/null.ogg")), 100, 1);
		} else {
			playsound(f.args[1].loc, pick(rt.rsc("sound/misc/null.ogg"), rt.rsc("sound/misc/null.ogg")), 100, 1);
		}
	} else if (this.invocation_type === "whisper") {
		yield* f.args[1].whisper(`${this.invocation} ${uppertext(f.args[0].name)}`);
	}
	return f.dot;
}, true, { args: ["chosenarea", "user"] });
