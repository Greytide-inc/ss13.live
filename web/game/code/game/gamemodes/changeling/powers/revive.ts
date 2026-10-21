// From code/game/gamemodes/changeling/powers/revive.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11248, "/obj/effect/proc_holder/changeling/revive", "/obj/effect/proc_holder/changeling", {
	helptext: "Does not regrow lost organs or a missing head.",
	req_stat: 2,
	always_keep: 1,
	ignores_fakedeath: 1,
	name: "Revive",
	desc: "We regenerate, healing all damage from our form.",
});

// /obj/effect/proc_holder/changeling/revive/proc/sting_action  (code/game/gamemodes/changeling/powers/revive.dm:11)  may sleep
rt.def("/obj/effect/proc_holder/changeling/revive/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let missing: Value = null;
	f.vars = () => [user, missing];
	(rt.modField(f, live(user), "status_flags", 16769023, rt.bitAnd));
	rt.setFv(f, "tod", live(user), null);
	yield* g.callName(f, live(user), "revive", ["full_heal", 1], rt.Args.Named);
	missing = (yield* g.callName(f, live(user), "get_missing_limbs", []));
	(missing = rt.modify(live(missing), "head", subtract));
	if (truthy(rt.len(f, live(missing)))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/magic/demon_consume.ogg"), 50, 1]);
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀'s missing limbs reform, making a loud, grotesque sound!</span>", [live(user)]), "<span class='userdanger'>Your limbs regrow, making a loud, crunchy sound and giving you great pain!</span>", "<span class='italics'>You hear organic matter ripping and tearing!</span>"]);
		yield* g.callName(f, live(user), "emote", ["scream"]);
		yield* g.callName(f, live(user), "regenerate_limbs", [0, rt.list("head")]);
		yield* g.callName(f, live(user), "regenerate_organs", []);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>We have revived ourselves.</span>"]);
	(rt.modField(f, rt.gv(f, "changeling", rt.fv(f, "mind", live(user))), "purchasedpowers", live(f.src), subtract));
	return 1;
}, true);

// /obj/effect/proc_holder/changeling/revive/proc/can_be_used_by  (code/game/gamemodes/changeling/powers/revive.dm:32)
rt.def("/obj/effect/proc_holder/changeling/revive/proc/can_be_used_by", function can_be_used_by(f: Frame) {
	if ((!isEqual(rt.fv(f, "stat", live(f.args[0])), 2) && !truthy(rt.bitAnd(rt.fv(f, "status_flags", live(f.args[0])), 8192)))) {
		(rt.modField(f, rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[0]))), "purchasedpowers", live(f.src), subtract));
		return 0;
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["user"] });
