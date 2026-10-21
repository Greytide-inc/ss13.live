// From code/modules/spells/spell_types/ethereal_jaunt.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11292, "/obj/effect/proc_holder/spell/targeted/ethereal_jaunt", "/obj/effect/proc_holder/spell/targeted", {
	jaunt_duration: 50,
	jaunt_in_time: 5,
	jaunt_in_type: rt.typePath("/obj/effect/temp_visual/wizard"),
	jaunt_out_type: rt.typePath("/obj/effect/temp_visual/wizard/out"),
	include_user: 1,
	name: "Ethereal Jaunt",
	desc: "This spell creates your ethereal form, temporarily making you invisible and able to pass through walls.",
	school: "transmutation",
	charge_max: 300,
	clothes_req: 1,
	invocation: "none",
	invocation_type: "none",
	range: -1,
	cooldown_min: 100,
	nonabstract_req: 1,
	action_icon_state: "jaunt",
});

// /obj/effect/proc_holder/spell/targeted/ethereal_jaunt/proc/cast  (code/modules/spells/spell_types/ethereal_jaunt.dm:21)
rt.def("/obj/effect/proc_holder/spell/targeted/ethereal_jaunt/proc/cast", function cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null;
	let $e: any;
	f.vars = () => [user, target, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	rt.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.rsc("sound/magic/ethereal_enter.ogg"), 50, 1, -1]);
	target = null;
	rt.forList(f, 0, live(targets), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		target = $e;
		rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/effect/proc_holder/spell/targeted/ethereal_jaunt/proc/do_jaunt"), live(target)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/effect/proc_holder/spell/targeted/ethereal_jaunt/proc/do_jaunt  (code/modules/spells/spell_types/ethereal_jaunt.dm:26)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/ethereal_jaunt/proc/do_jaunt", function* do_jaunt(f: Frame, target: Value) {
	let mobloc: Value = null, holder: Value = null, direction: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [target, mobloc, holder, direction, _T, $e];
	rt.setFv(f, "notransform", live(target), 1);
	mobloc = rt.getStep(f, live(target), 0);
	holder = (yield* g.new_(f, T("/obj/effect/dummy/spell_jaunt"), [live(mobloc)]));
	yield* g.new_(f, rt.sv(f, "jaunt_out_type"), [live(mobloc), rt.fv(f, "dir", live(target))]);
	yield* g.callName(f, live(target), "ExtinguishMob", []);
	if (truthy(rt.fv(f, "buckled", live(target)))) {
		yield* g.callName(f, rt.fv(f, "buckled", live(target)), "unbuckle_mob", [null, live(target), "force", 1], rt.Args.Named);
	}
	if (truthy(rt.fv(f, "pulledby", live(target)))) {
		yield* g.callName(f, rt.fv(f, "pulledby", live(target)), "stop_pulling", []);
	}
	yield* g.callName(f, live(target), "stop_pulling", []);
	if (truthy((yield* g.callName(f, live(target), "has_buckled_mobs", [])))) {
		yield* g.callName(f, live(target), "unbuckle_all_mobs", ["force", 1], rt.Args.Named);
	}
	rt.setFv(f, "loc", live(target), live(holder));
	yield* g.callName(f, live(target), "reset_perspective", [live(holder)]);
	rt.setFv(f, "notransform", live(target), 0);
	yield* g.srcCall(f, "jaunt_steam", live(mobloc));
	yield* g.call(f, P("/proc/sleep"), null, [rt.sv(f, "jaunt_duration")]);
	if (!isEqual(rt.fv(f, "loc", live(target)), live(holder))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(holder)]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "jaunt_steam", (mobloc = rt.getStep(f, rt.fv(f, "loc", live(target)), 0)));
	rt.setFv(f, "canmove", live(target), 0);
	rt.setFv(f, "reappearing", live(holder), 1);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(target), 0), rt.rsc("sound/magic/ethereal_exit.ogg"), 50, 1, -1]);
	yield* g.call(f, P("/proc/sleep"), null, [subtract(25, rt.sv(f, "jaunt_in_time"))]);
	yield* g.new_(f, rt.sv(f, "jaunt_in_type"), [live(mobloc), rt.fv(f, "dir", live(target))]);
	yield* g.call(f, P("/proc/sleep"), null, [rt.sv(f, "jaunt_in_time")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(holder)]);
	if (!truthy(live(target)) || truthy(rt.fv(f, "gc_destroyed", live(target)))) return f.dot;
	if (truthy(rt.fv(f, "density", live(mobloc)))) {
		direction = null;
		rt.forList(f, 0, rt.gl("alldirs"));
		while (($e = rt.next(f, 0)) !== undefined) {
			direction = $e;
			if (truthy((_T = rt.getStep(f, live(mobloc), live(direction))))) {
				if (truthy((yield* g.callName(f, live(target), "Move", [live(_T)])))) {
					break;
				}
			}
		}
		rt.endFor(f, 0);
	}
	rt.setFv(f, "canmove", live(target), 1);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }] });

// /obj/effect/proc_holder/spell/targeted/ethereal_jaunt/proc/jaunt_steam  (code/modules/spells/spell_types/ethereal_jaunt.dm:67)
rt.def("/obj/effect/proc_holder/spell/targeted/ethereal_jaunt/proc/jaunt_steam", function jaunt_steam(f: Frame, mobloc: Value) {
	let steam: Value = null;
	f.vars = () => [steam];
	rt.callName(f, (steam = rt.new_(f, T("/datum/effect_system/steam_spread"), [])), "set_up", [10, 0, live(mobloc)]);
	rt.callName(f, live(steam), "start", []);
	return f.dot;
});

rt.type(11950, "/obj/effect/dummy/spell_jaunt", "/obj/effect/dummy", {
	canmove: 1,
	reappearing: 0,
	anchored: 1,
	name: "water",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "nothing",
	density: 0,
	invisibility: 60,
	resistance_flags: 51,
});

// /obj/effect/dummy/spell_jaunt/proc/Destroy  (code/modules/spells/spell_types/ethereal_jaunt.dm:84)  may sleep
rt.def("/obj/effect/dummy/spell_jaunt/proc/Destroy", function* Destroy(f: Frame) {
	let AM: Value = null;
	let $e: any;
	f.vars = () => [AM, $e];
	AM = null;
	rt.forList(f, 0, live(f.src), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		yield* g.callName(f, live(AM), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/dummy/spell_jaunt/proc/relaymove  (code/modules/spells/spell_types/ethereal_jaunt.dm:89)
rt.def("/obj/effect/dummy/spell_jaunt/proc/relaymove", function relaymove(f: Frame, user: Value, direction: Value) {
	let newLoc: Value = null;
	f.vars = () => [newLoc];
	if (((!truthy(rt.fv(f, "canmove", live(f.src))) || truthy(rt.sv(f, "reappearing"))) || !truthy(live(direction)))) {
		return live(f.dot);
	}
	newLoc = rt.getStep(f, live(f.src), live(direction));
	rt.callSrc(f, "setDir", [live(direction)]);
	if (!truthy(rt.bitAnd(rt.fv(f, "flags", live(newLoc)), 1))) {
		rt.setSv(f, "loc", live(newLoc));
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Some strange aura is blocking the way!</span>"]);
	}
	rt.setFv(f, "canmove", live(f.src), 0);
	rt.spawnTail(f, 2, "/obj/effect/dummy/spell_jaunt/proc/relaymove: spawn at modules/spells/spell_types/ethereal_jaunt.dm:97", user, direction, newLoc);
	return f.dot;
});

// a spawn(2) body of /obj/effect/dummy/spell_jaunt/proc/relaymove, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/effect/dummy/spell_jaunt/proc/relaymove: spawn at modules/spells/spell_types/ethereal_jaunt.dm:97", function* (f: Frame, user: Value, direction: Value, newLoc: Value) {
	f.vars = () => [user, direction, newLoc];
	rt.setFv(f, "canmove", live(f.src), 1);
	return null;
});
