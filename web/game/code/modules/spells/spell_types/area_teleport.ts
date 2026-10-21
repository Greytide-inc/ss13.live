// From code/modules/spells/spell_types/area_teleport.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11281, "/obj/effect/proc_holder/spell/targeted/area_teleport", "/obj/effect/proc_holder/spell/targeted", {
	randomise_selection: 0,
	invocation_area: 1,
	sound1: rt.rsc("sound/weapons/zapbang.ogg"),
	sound2: rt.rsc("sound/weapons/zapbang.ogg"),
	name: "Area teleport",
	desc: "This spell teleports you to a type of area of your selection.",
	nonabstract_req: 1,
});

// /obj/effect/proc_holder/spell/targeted/area_teleport/proc/perform  (code/modules/spells/spell_types/area_teleport.dm:12)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/area_teleport/proc/perform", function* perform(f: Frame, targets: Value, recharge: Value, user: Value) {
	let thearea: Value = null;
	f.vars = () => [targets, recharge, user, thearea];
	if (live(recharge) === null) {
		recharge = 1;
	}
	if (live(user) === null) {
		user = live(f.usr);
	}
	if ((!truthy((thearea = (yield* g.srcCall(f, "before_cast", live(targets))))) || !truthy((yield* g.srcCall(f, "cast_check", 1))))) {
		yield* g.srcCall(f, "revert_cast");
		return live(f.dot);
	}
	yield* g.srcCall(f, "invocation", live(thearea), live(user));
	if ((isEqual(rt.sv(f, "charge_type"), "recharge") && truthy(live(recharge)))) {
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/effect/proc_holder/spell/proc/start_recharge")]);
	}
	yield* g.srcCall(f, "cast", live(targets), live(thearea), live(user));
	yield* g.srcCall(f, "after_cast", live(targets));
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/targeted/area_teleport/proc/before_cast  (code/modules/spells/spell_types/area_teleport.dm:25)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/area_teleport/proc/before_cast", function* before_cast(f: Frame, targets: Value) {
	let A: Value = null, thearea: Value = null;
	f.vars = () => [targets, A, thearea];
	A = null;
	if (!truthy(rt.sv(f, "randomise_selection"))) {
		A = (yield* g.op(f, "Prompt", [1], [null, live(A), "Teleport", "Area to teleport to", rt.gl("teleportlocs")]));
	} else {
		A = rt.op(f, "PickUnweighted", [1], [rt.gl("teleportlocs")]);
	}
	if (!truthy(live(A))) {
		return live(f.dot);
	}
	return (thearea = rt.index(rt.gl("teleportlocs"), live(A)));
}, true);

// /obj/effect/proc_holder/spell/targeted/area_teleport/proc/cast  (code/modules/spells/spell_types/area_teleport.dm:36)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/area_teleport/proc/cast", function* cast(f: Frame, targets: Value, thearea: Value, user: Value) {
	let target: Value = null, L: Value = null, _T: Value = null, clear: Value = null, O: Value = null, tempL: Value = null, attempt: Value = null, success: Value = null;
	let $e: any;
	f.vars = () => [targets, thearea, user, target, L, _T, clear, O, tempL, attempt, success, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.sv(f, "sound1"), 50, 1]);
	target = null;
	rt.forList(f, 0, live(targets), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		target = $e;
		L = rt.list();
		_T = null;
		rt.forList(f, 1, (yield* g.call(f, P("/proc/get_area_turfs"), null, [rt.fv(f, "type", live(thearea))])), T("/turf"));
		while (($e = rt.next(f, 1)) !== undefined) {
			_T = $e;
			if (!truthy(rt.fv(f, "density", live(_T)))) {
				clear = 1;
				O = null;
				rt.forList(f, 2, live(_T), T("/obj"));
				while (($e = rt.next(f, 2)) !== undefined) {
					O = $e;
					if (truthy(rt.fv(f, "density", live(O)))) {
						clear = 0;
						break;
					}
				}
				rt.endFor(f, 2);
				if (truthy(live(clear))) {
					L = rt.modify(live(L), live(_T), add);
				}
			}
		}
		rt.endFor(f, 1);
		if (!truthy(rt.len(f, live(L)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The spell matrix was unable to locate a suitable teleport destination for an unknown reason. Sorry."]);
			return live(f.dot);
		}
		if ((truthy(live(target)) && truthy(rt.fv(f, "buckled", live(target))))) {
			yield* g.callName(f, rt.fv(f, "buckled", live(target)), "unbuckle_mob", [null, live(target), "force", 1], rt.Args.Named);
		}
		tempL = live(L);
		attempt = null;
		success = 0;
		while (truthy(rt.len(f, live(tempL)))) {
			attempt = rt.op(f, "PickUnweighted", [1], [live(tempL)]);
			yield* g.callName(f, live(target), "Move", [live(attempt)]);
			if (isEqual(rt.getStep(f, live(target), 0), live(attempt))) {
				success = 1;
				break;
			}
			yield* g.callName(f, live(tempL), "Remove", [live(attempt)]);
		}
		if (!truthy(live(success))) {
			rt.setFv(f, "loc", live(target), rt.op(f, "PickUnweighted", [1], [live(L)]));
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.sv(f, "sound2"), 50, 1]);
		}
	}
	rt.endFor(f, 0);
	return live(f.dot);
}, true);

// /obj/effect/proc_holder/spell/targeted/area_teleport/proc/invocation  (code/modules/spells/spell_types/area_teleport.dm:75)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/area_teleport/proc/invocation", function* invocation(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (live(f.args[0]) === null) {
		f.args[0] = null;
	}
	if (live(f.args[1]) === null) {
		f.args[1] = live(f.usr);
	}
	if ((!truthy(rt.sv(f, "invocation_area")) || !truthy(live(f.args[0])))) {
		yield* g.callSuper(f, [], rt.Args.Same);
	} else {
		$0 = rt.sv(f, "invocation_type");
		if ($0 === "shout") {
			yield* g.callName(f, live(f.args[1]), "say", [fmt("＀ ＀", [rt.sv(f, "invocation"), (yield* g.call(f, P("/proc/uppertext"), null, [rt.fv(f, "name", live(f.args[0]))]))])]);
			if (isEqual(rt.fv(f, "gender", live(f.args[1])), "male")) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.args[1])), rt.op(f, "PickUnweighted", [2], [rt.rsc("sound/misc/null.ogg"), rt.rsc("sound/misc/null.ogg")]), 100, 1]);
			} else {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.args[1])), rt.op(f, "PickUnweighted", [2], [rt.rsc("sound/misc/null.ogg"), rt.rsc("sound/misc/null.ogg")]), 100, 1]);
			}
		} else if ($0 === "whisper") {
			yield* g.callName(f, live(f.args[1]), "whisper", [fmt("＀ ＀", [rt.sv(f, "invocation"), (yield* g.call(f, P("/proc/uppertext"), null, [rt.fv(f, "name", live(f.args[0]))]))])]);
		}
	}
	return live(f.dot);
}, true, { args: ["chosenarea", "user"] });
